async function test() {
  const tunnelUrl = 'https://post-ellen-pulse-diversity.trycloudflare.com';
  
  // Test tunnel
  console.log('=== Teste Tunnel ===');
  try {
    const res = await fetch(tunnelUrl + '/health');
    console.log(`Health: ${res.status}`);
  } catch (e) { console.log('Erro:', e.message); }
  
  // Test localhost
  console.log('\n=== Teste Localhost ===');
  try {
    const res = await fetch('http://localhost:3001/health');
    console.log(`Localhost Health: ${res.status}`);
    if (res.ok) console.log(await res.json());
  } catch (e) { console.log('Erro:', e.message); }
  
  // Test site connect
  console.log('\n=== Teste Site ===');
  try {
    const res = await fetch('https://fanzap.vercel.app/api/instances/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'b74cec06-d0e3-49f8-95d1-01407473db5a' })
    });
    console.log(`Connect: ${res.status}`);
    const data = await res.json();
    console.log(JSON.stringify(data).substring(0, 300));
  } catch (e) { console.log('Erro:', e.message); }
}

test();