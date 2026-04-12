import { EvolutionAPI } from './src/lib/evolution-api';

const api = new EvolutionAPI();

async function test() {
  console.log('Enviando mensagem de teste...');
  await api.sendMessage('erickfandim', '5511948333534', '🔥 Teste Fanzap funcionando!');
  console.log('✅ Enviada!');
}

test().catch(e => console.log('Erro:', e.message));