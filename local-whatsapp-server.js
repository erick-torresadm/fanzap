const { Client, LocalAuth } = require('./src/lib/whatsapp-web.js');

const clients = new Map();

function getClient(instanceId) {
  if (!clients.has(instanceId)) {
    const client = new Client({
      authStrategy: new LocalAuth({ dataPath: `./sessions/${instanceId}` }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    client.on('ready', () => {
      console.log(`✅ Cliente ${instanceId} pronto!`);
    });

    client.on('authenticated', () => {
      console.log(`🔐 Cliente ${instanceId} autenticado!`);
    });

    client.on('message', async (msg) => {
      console.log(`📩 ${msg.from}: ${msg.body}`);
      
      // Enviar para o site via webhook
      try {
        await fetch('https://fanzap.vercel.app/api/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instance: instanceId,
            from: msg.from,
            body: msg.body,
            messageId: msg.id._serialized
          })
        });
      } catch (e) {
        console.error('Erro ao enviar webhook:', e.message);
      }
    });

    client.on('disconnected', () => {
      console.log(`❌ Cliente ${instanceId} desconectado!`);
    });

    client.initialize();
    clients.set(instanceId, client);
  }
  return clients.get(instanceId);
}

module.exports = { getClient };