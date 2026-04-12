async function test() {
  const res = await fetch('https://fanzap.vercel.app/api/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'MESSAGES_UPSERT',
      instance: 'erickfandim',
      data: {
        messages: [{
          key: { remoteJid: '5511999999999@s.whatsapp.net', fromMe: false, id: 'test123' },
          message: { conversation: 'oi' }
        }]
      }
    })
  });
  console.log('Status:', res.status);
  const json = await res.json();
  console.log('Response:', JSON.stringify(json, null, 2));
}

test().catch(console.error);