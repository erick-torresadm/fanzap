const express = require('express');
const { Client, LocalAuth } = require('./src/lib/whatsapp-web.js');
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
        await fetch('https://fanzap.vercel.app/api/webhook', {
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
    
    client.on('qr', (qr) => {
      qrCodes.set(instanceId, qr);
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
  if (client.pupPage) return res.json({ status: 'connected' });
  return res.json({ status: 'connecting' });
});

app.post('/send/:instanceId', async (req, res) => {
  const { instanceId } = req.params;
  const { to, message } = req.body;
  
  try {
    const client = getClient(instanceId);
    await client.sendMessage(to + '@c.us', message);
    res.json({ status: 'sent' });
  } catch (e) {
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