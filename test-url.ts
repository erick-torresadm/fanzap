async function test() {
  const tunnelUrl = 'https://definitely-lookup-honolulu-model.trycloudflare.com';
  const siteUrl = 'https://fanzap.vercel.app';
  
  console.log('=== Teste Tunnel ===');
  try {
    const res = await fetch(tunnelUrl + '/health');
    console.log(`GET /health: ${res.status}`);
    if (res.ok) console.log(await res.json());
  } catch (e) { console.log('Erro:', e.message); }
  
  console.log('\n=== Teste Site ===');
  try {
    const res = await fetch(siteUrl + '/api/instances/local-connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instanceId: 'test' })
    });
    console.log(`POST /api/instances/local-connect: ${res.status}`);
    const data = await res.json();
    console.log(JSON.stringify(data).substring(0, 300));
  } catch (e) { console.log('Erro:', e.message); }
}

test();