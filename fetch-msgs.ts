async function test() {
  const res = await fetch('https://api.membropro.com.br/chat/findMessages/erickfandim', {
    method: 'POST',
    headers: { 
      apikey: 'd6996979cd25b0ebe76ab2fbe509538e',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ limit: 5 })
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Response:', JSON.stringify(data, null, 2));
}

test().catch(console.error);