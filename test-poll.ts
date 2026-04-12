async function test() {
  // Test the health endpoint first
  const health = await fetch('https://fanzap.vercel.app/api/health');
  console.log('Health:', health.status);
  
  // Test the poll endpoint
  const res = await fetch('https://fanzap.vercel.app/api/messages/poll', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ instanceName: 'erickfandim' })
  });
  console.log('Poll Status:', res.status);
  console.log('Poll URL:', res.url);
  
  const text = await res.text();
  console.log('Poll Response:', text.substring(0, 500));
}

test().catch(console.error);