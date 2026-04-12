async function test() {
  try {
    const res = await fetch('https://afraid-dolls-repair.loca.lt/health', { method: 'POST' });
    console.log('localtunnel:', res.status);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data));
  } catch (e) {
    console.log('Erro:', e.message);
  }
}

test();