async function watch() {
  console.log('👀 Monitorando mensagens...');
  
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch('https://fanzap.vercel.app/api/messages/debug');
      const data = await res.json();
      const msgs = data.messages || [];
      if (msgs.length > 0) {
        console.log('📩 Mensagens encontradas:', msgs.length);
        msgs.slice(-3).forEach(m => {
          console.log(`  - [${m.direction}] ${m.content} (${m.instance_name})`);
        });
      } else {
        process.stdout.write('.');
      }
    } catch (e) {
      console.log('Erro:', e.message);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
}

watch();