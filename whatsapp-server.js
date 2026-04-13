const express = require('express');
const { Client, LocalAuth, MessageMedia } = require('./src/lib/whatsapp-web.js');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Capturar erros globais para não crashar
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Erro não tratado:', err.message);
  console.error(err.stack);
});
process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Promise não tratada:', reason);
});

const app = express();
app.use(express.json());

const SESSIONS_DIR = './whatsapp-sessions';
if (!fs.existsSync(SESSIONS_DIR)) fs.mkdirSync(SESSIONS_DIR, { recursive: true });

const clients = new Map();
const qrCodes = new Map();
const webhookUrls = new Map();
const lidCache = new Map();

const DEFAULT_WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://fanzap.vercel.app/api/webhook';

function cleanPhoneNumber(rawFrom) {
  return rawFrom.replace(/@(c\.us|g\.us|lid|s\.whatsapp\.net|broadcast)$/i, '');
}

function getClient(instanceId) {
  if (!clients.has(instanceId)) {
    const sessionPath = path.join(SESSIONS_DIR, instanceId);

    const client = new Client({
      authStrategy: new LocalAuth({ dataPath: sessionPath }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-extensions',
          '--disable-background-networking',
          '--disable-default-apps',
          '--disable-sync',
          '--no-first-run',
          '--no-zygote',
          '--single-process'
        ]
      }
    });

    client.on('ready', () => {
      console.log(`[✓] Cliente ${instanceId} conectado!`);
      qrCodes.set(instanceId, null);
    });

    client.on('authenticated', () => {
      console.log(`[🔐] ${instanceId} autenticado!`);
    });

    // MENSAGENS RECEBIDAS - inclui fromMe para admin poder testar
    client.on('message_create', async (msg) => {
      // message_create captura TODAS as mensagens (enviadas e recebidas)
      // msg.fromMe = true quando EU envio
      // msg.fromMe = false quando OUTRO envia

      const body = msg.body || '';
      if (!body) return; // Ignorar mensagens sem texto (ex: stickers)

      // Ignorar mensagens de grupos
      if (msg.from?.endsWith('@g.us') || msg.to?.endsWith('@g.us')) return;

      // Ignorar mensagens de status/broadcast
      if (msg.from === 'status@broadcast' || msg.to === 'status@broadcast') return;

      const rawFrom = msg.fromMe ? msg.to : msg.from;
      let from = cleanPhoneNumber(rawFrom);

      const isAdmin = msg.fromMe;

      // Resolver LID para número real
      if (rawFrom.endsWith('@lid')) {
        if (lidCache.has(from)) {
          from = lidCache.get(from);
        } else {
          let resolved = false;

          try {
            const chat = await msg.getChat();
            const chatId = chat?.id?._serialized || '';
            if (chatId.endsWith('@c.us')) {
              const realNumber = chatId.replace('@c.us', '');
              lidCache.set(cleanPhoneNumber(rawFrom), realNumber);
              from = realNumber;
              resolved = true;
            }
          } catch {}

          if (!resolved && msg.id?.remote) {
            const remote = msg.id.remote;
            if (remote.endsWith('@c.us')) {
              const realNumber = remote.replace('@c.us', '');
              lidCache.set(cleanPhoneNumber(rawFrom), realNumber);
              from = realNumber;
              resolved = true;
            }
          }

          if (!resolved) {
            try {
              const contact = await msg.getContact();
              if (contact?.number) {
                lidCache.set(cleanPhoneNumber(rawFrom), contact.number);
                from = contact.number;
              }
            } catch {}
          }
        }
      }

      console.log(`[📩] ${isAdmin ? '(ADMIN)' : ''} ${rawFrom} -> ${from}: ${body}`);

      // Enviar para webhook
      const webhookUrl = webhookUrls.get(instanceId) || DEFAULT_WEBHOOK_URL;

      const payload = {
        instance: instanceId,
        from: from,
        body: body,
        messageId: msg.id?._serialized || msg.id?.id || '',
        pushName: msg._data?.notifyName || '',
        timestamp: msg.timestamp,
        type: msg.type,
        fromMe: isAdmin
      };

      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const text = await res.text();
        console.log(`[📤] Webhook ${res.status}: ${text.substring(0, 100)}`);
      } catch (e) {
        console.error(`[❌] Webhook erro: ${e.message}`);
      }
    });

    client.on('disconnected', (reason) => {
      console.log(`[✗] ${instanceId} desconectado! Razão: ${reason}`);
      qrCodes.set(instanceId, null);

      setTimeout(() => {
        console.log(`[🔄] Tentando reconectar ${instanceId}...`);
        clients.delete(instanceId);
        getClient(instanceId);
      }, 5000);
    });

    client.initialize().catch(err => {
      console.error(`[INIT ERROR] ${instanceId}:`, err.message);
    });
    clients.set(instanceId, client);
  }
  return clients.get(instanceId);
}

// === HELPERS ===

async function resolveChatId(client, to) {
  const cleanNumber = to.replace(/\D/g, '');

  try {
    const numberId = await client.getNumberId(cleanNumber);
    if (numberId) return numberId._serialized;
  } catch {}

  const candidates = [`${cleanNumber}@c.us`];
  if (!cleanNumber.startsWith('55') && cleanNumber.length <= 11) {
    candidates.push(`55${cleanNumber}@c.us`);
  }
  for (const c of candidates) {
    try { if (await client.isRegisteredUser(c)) return c; } catch {}
  }

  try {
    const chats = await client.getChats();
    const match = chats.find(c => (c.id._serialized || '').includes(cleanNumber));
    if (match) return match.id._serialized;
  } catch {}

  return `${cleanNumber}@c.us`;
}

async function simulatePresence(client, chatId, type, durationMs) {
  try {
    const chat = await client.getChatById(chatId);
    if (!chat) return;

    if (type === 'audio') {
      await chat.sendStateRecording();
      console.log(`[⏺️] Gravando... (${durationMs}ms)`);
    } else {
      await chat.sendStateTyping();
      console.log(`[⌨️] Digitando... (${durationMs}ms)`);
    }

    await new Promise(r => setTimeout(r, durationMs));
    await chat.clearState();
  } catch (e) {
    console.log(`[PRESENCE] ${e.message}`);
  }
}

// === ROUTES ===

app.post('/connect/:instanceId', async (req, res) => {
  const { instanceId } = req.params;
  console.log(`[→] Conectando ${instanceId}...`);

  try {
    const client = getClient(instanceId);

    if (client.info) {
      return res.json({
        status: 'connected',
        phoneNumber: client.info.wid?.user || null
      });
    }

    client.on('qr', async (qr) => {
      const qrImage = await QRCode.toDataURL(qr, { width: 300 });
      qrCodes.set(instanceId, qrImage);
    });

    let attempts = 0;
    const checkQR = setInterval(() => {
      const qr = qrCodes.get(instanceId);
      if (qr) {
        clearInterval(checkQR);
        res.json({ qrCode: qr, status: 'waiting_scan' });
      }
      attempts++;
      if (attempts > 60) {
        clearInterval(checkQR);
        res.json({ status: 'timeout' });
      }
    }, 1000);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/status/:instanceId', (req, res) => {
  const { instanceId } = req.params;
  const client = clients.get(instanceId);

  if (!client) return res.json({ status: 'not_created' });
  if (client.info) {
    return res.json({
      status: 'connected',
      phoneNumber: client.info.wid?.user || null
    });
  }
  return res.json({ status: 'connecting' });
});

app.post('/send/:instanceId', async (req, res) => {
  const { instanceId } = req.params;
  const { to, message, type, mediaUrl } = req.body;

  if (!to) return res.status(400).json({ error: 'to é obrigatório' });
  if (!message && !mediaUrl) return res.status(400).json({ error: 'message ou mediaUrl obrigatório' });

  try {
    const client = clients.get(instanceId);
    if (!client || !client.info) {
      return res.status(400).json({ error: `Instância ${instanceId} não conectada` });
    }

    const chatId = await resolveChatId(client, to);
    const msgType = type || 'text';

    // Simular presença
    const typingMs = msgType === 'audio'
      ? Math.min(Math.max((message || '').length * 100, 3000), 8000)
      : Math.min(Math.max((message || '').length * 50, 1500), 5000);

    await simulatePresence(client, chatId, msgType, typingMs);

    // Enviar
    if (msgType === 'text' || !mediaUrl) {
      console.log(`[SEND] [texto] -> ${chatId}: ${(message || '').substring(0, 50)}`);
      await client.sendMessage(chatId, message);

    } else if (msgType === 'audio' && mediaUrl) {
      console.log(`[SEND] [áudio] -> ${chatId}: ${mediaUrl}`);
      const media = await MessageMedia.fromUrl(mediaUrl, { unsafeMime: true });
      await client.sendMessage(chatId, media, { sendAudioAsVoice: true });

    } else if (mediaUrl) {
      console.log(`[SEND] [${msgType}] -> ${chatId}: ${mediaUrl}`);
      const media = await MessageMedia.fromUrl(mediaUrl, { unsafeMime: true });
      await client.sendMessage(chatId, media, { caption: message || '' });
    }

    res.json({ status: 'sent', to: chatId, type: msgType });
  } catch (e) {
    console.error('[SEND ERROR]:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post('/webhook/:instanceId', (req, res) => {
  const { instanceId } = req.params;
  const { webhookUrl } = req.body;
  if (!webhookUrl) return res.status(400).json({ error: 'webhookUrl obrigatório' });
  webhookUrls.set(instanceId, webhookUrl);
  console.log(`[🔗] Webhook ${instanceId}: ${webhookUrl}`);
  res.json({ success: true, webhookUrl });
});

app.get('/webhook/:instanceId', (req, res) => {
  const { instanceId } = req.params;
  res.json({ instanceId, webhookUrl: webhookUrls.get(instanceId) || DEFAULT_WEBHOOK_URL });
});

app.post('/disconnect/:instanceId', async (req, res) => {
  const { instanceId } = req.params;
  const client = clients.get(instanceId);
  if (client) {
    try { await client.destroy(); } catch {}
    clients.delete(instanceId);
    qrCodes.delete(instanceId);
    webhookUrls.delete(instanceId);
  }
  res.json({ success: true });
});

app.get('/', (req, res) => {
  const list = [];
  for (const [id, client] of clients) {
    list.push({
      id,
      status: client.info ? 'connected' : 'connecting',
      phoneNumber: client.info?.wid?.user || null,
      webhookUrl: webhookUrls.get(id) || DEFAULT_WEBHOOK_URL
    });
  }
  res.json({ status: 'ok', clients: clients.size, instances: list });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', clients: clients.size });
});

app.get('/instances', (req, res) => {
  const list = [];
  for (const [id, client] of clients) {
    list.push({
      id,
      status: client.info ? 'connected' : 'connecting',
      phoneNumber: client.info?.wid?.user || null
    });
  }
  res.json(list);
});

// === START SERVER ===

// Auto-iniciar instância padrão se não houver argumentos
const AUTO_START_INSTANCE = process.env.AUTO_START_INSTANCE || 'fanzap_b74cec06';

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`\n🚀 WhatsApp Server NA PORTA ${PORT}`);
  console.log(`📡 Webhook padrão: ${DEFAULT_WEBHOOK_URL}`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📱 Para conectar com Vercel, use ngrok:`);
    console.log(`   ngrok http ${PORT}`);
  }
  
  console.log(`\n✅ Servidor rodando. Pressione Ctrl+C para parar.\n`);
  
  // Auto-conectar instância se nenhuma instância została criada
  if (AUTO_START_INSTANCE && !clients.has(AUTO_START_INSTANCE)) {
    console.log(`[🔄] Auto-iniciando instância ${AUTO_START_INSTANCE}...`);
    try {
      getClient(AUTO_START_INSTANCE);
    } catch (e) {
      console.log(`[⚠] Erro ao auto-iniciar: ${e.message}`);
    }
  }
});

// Manter servidor vivo no Windows
process.on('SIGINT', () => {
  console.log('\n👋 Encerrando servidor...');
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 1000);
});

// Manter o processo vivo
server.on('error', (err) => {
  console.error('[SERVER ERROR]:', err.message);
});

// Keepalive - previne que o Node.js encerre
setInterval(() => {}, 1 << 30);
