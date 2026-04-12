async function test() {
  const tunnelUrl = 'https://unphotographed-aleena-hurriedly.ngrok-free.dev';
  const instanceName = 'fanzap_b74cec06';
  
  console.log('=== Teste /status ===');
  try {
    const res = await fetch(`${tunnelUrl}/status/${instanceName}`);
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data));
  } catch (e) { console.log('Erro:', e.message); }
  
  console.log('\n=== Teste Site /instances ===');
  try {
    const res = await fetch('https://fanzap.vercel.app/api/instances', {
      headers: { 'x-user-id': 'b74cec06-d0e3-49f8-95d1-01407473db5a' }
    });
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data));
  } catch (e) { console.log('Erro:', e.message); }
}

test();