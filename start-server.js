const { spawn } = require('child_process');

console.log('Iniciando WhatsApp Server...');
const server = spawn('node', ['whatsapp-server.js'], { 
  cwd: process.cwd(),
  shell: true,
  stdio: 'inherit'
});

setTimeout(() => {
  console.log('\nIniciando tunnel (Cloudflare)...');
  const tunnel = spawn('npx', ['cloudflared', 'tunnel', '--url', 'http://localhost:3001'], { 
    cwd: process.cwd(),
    shell: true,
    stdio: 'inherit'
  });
}, 3000);