async function test() {
  const url = 'https://experiencing-int-approximate-plenty.trycloudflare.com';
  
  console.log('=== Teste ===');
  try {
    const res = await fetch(url + '/health');
    console.log(`Health: ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log(data);
    }
  } catch (e) { console.log('Erro:', e.message); }
  
  // Test connect
  try {
    const res = await fetch(url + '/connect/test-user', { method: 'POST' });
    console.log(`Connect: ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log('QR Code:', data.qrCode?.substring(0, 100));
    }
  } catch (e) { console.log('Erro connect:', e.message); }
}

test();