const express = require('express');
const { Client, LocalAuth } = require('./src/lib/whatsapp-web.js');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const SESSIONS_DIR = './whatsapp-sessions';
if (!fs.existsSync(SESSIONS_DIR)) fs.mkdirSync(SESSIONS_DIR, { recursive: true });

const clients = new Map();
const qrCodes = new Map();

function getClient(instanceId) {
  if (!clients.has(instanceId)) {
    const sessionPath = path.join(SESSIONS_DIR, instanceId);
    
    const client = new Client({
      authStrategy: new LocalAuth({ dataPath: sessionPath }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      }
    });

    client.on('ready', () => {
      console.log(`[✓] Cliente ${instanceId} conectado!`);
      qrCodes.set(instanceId, null);
    });

    client.on('authenticated', () => {
      console.log(`[🔐] ${instanceId} autenticado!`);
    });

    client.on('message', async (msg) => {
      if (msg.fromMe) return;
      
      const from = msg.from.replace('@c.us', '').replace('@g.us', '');
      const body = msg.body || '';
      
      console.log(`[📩] ${from}: ${body}`);
      
      try {
        await fetch('https://fanzap-k8nlqx2jq-ericks-projects-0721799c.vercel.app/api/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instance: instanceId,
            from: from,
            body: body,
            messageId: msg.id._serialized,
            pushName: msg.pushName
          })
        });
      } catch (e) {
        console.error('[Erro webhook]:', e.message);
      }
    });

    client.on('disconnected', () => {
      console.log(`[✗] ${instanceId} desconectado!`);
      qrCodes.set(instanceId, null);
    });

    client.initialize();
    clients.set(instanceId, client);
  }
  return clients.get(instanceId);
}

app.post('/connect/:instanceId', async (req, res) => {
  const { instanceId } = req.params;
  console.log(`[→] Conectando ${instanceId}...`);
  
  try {
    const client = getClient(instanceId);
    
    client.on('qr', async (qr) => {
      // Gerar QR code como imagem
      const qrImage = await QRCode.toDataURL(qr, { width: 300 });
      qrCodes.set(instanceId, qrImage);
    });
    
    // Verificar QR code a cada segundo
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
  if (client.pupPage) {
    const info = client.info;
    return res.json({ 
      status: 'connected',
      phoneNumber: info?.wid?.user || null
    });
  }
  return res.json({ status: 'connecting' });
});

app.post('/send/:instanceId', async (req, res) => {
  const { instanceId } = req.params;
  const { to, message } = req.body;
  
  try {
    const client = getClient(instanceId);
    
    // Formato correto: número@c.us (sem código do país se já tiver 55)
    // Docs WWEBJS: "Always strip non-digits and include country code"
    const cleanNumber = to.replace(/\D/g, '');
    let chatId = `${cleanNumber}@c.us`;
    
    // Verificar se o número é válido no WhatsApp
    const isRegistered = await client.isRegisteredUser(chatId);
    if (!isRegistered) {
      // Tentar com código do país brasileiro (55) se não tiver
      const withCountryCode = cleanNumber.length === 12 
        ? `55${cleanNumber}` 
        : cleanNumber;
      chatId = `${withCountryCode}@c.us`;
      
      const isRegistered2 = await client.isRegisteredUser(chatId);
      if (!isRegistered2) {
        return res.status(400).json({ error: 'Número não encontrado no WhatsApp' });
      }
    }
    
    console.log('[SEND] Enviando para:', chatId, 'mensagem:', message);
    await client.sendMessage(chatId, message);
    res.json({ status: 'sent' });
  } catch (e) {
    console.error('[SEND ERROR]:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', clients: clients.size, message: 'WhatsApp Server running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', clients: clients.size });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 WhatsApp Server NA PORTA ${PORT}`);
  console.log(`📱 Para conectar com Vercel, Use ngrok:`);
  console.log(`   ngrok http ${PORT}`);
  console.log(`   Depois configure a URL do ngrok na Vercel\n`);
});