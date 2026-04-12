const { spawn } = require('child_process');

console.log('Iniciando WhatsApp Server...');
const server = spawn('node', ['whatsapp-server.js'], { 
  cwd: process.cwd(),
  shell: true,
  stdio: 'inherit'
});

setTimeout(() => {
  console.log('\nIniciando ngrok (HTTP)...');
  const tunnel = spawn('npx', ['ngrok', 'http', '3001', '--host-header=localhost:3001'], { 
    cwd: process.cwd(),
    shell: true,
    stdio: 'inherit'
  });
}, 3000);