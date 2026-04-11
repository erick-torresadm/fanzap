import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_ieqLvJwCMQ01@ep-green-mud-amowdera-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require');

async function main() {
  console.log('=== USUARIOS ===');
  const users = await sql`SELECT id, name, email FROM users`;
  console.log(JSON.stringify(users, null, 2));
  
  console.log('\n=== GATILHOS ATIVOS ===');
  const triggers = await sql`SELECT * FROM triggers WHERE is_active = true`;
  console.log(JSON.stringify(triggers, null, 2));
  
  console.log('\n=== SEQUENCIAS ATIVAS ===');
  const sequences = await sql`SELECT * FROM sequences WHERE is_active = true`;
  console.log(JSON.stringify(sequences, null, 2));
  
  console.log('\n=== FLUXOS ATIVOS ===');
  const flows = await sql`SELECT * FROM flows WHERE is_active = true`;
  console.log(JSON.stringify(flows, null, 2));
  
  console.log('\n=== MENSAGENS RECEBIDAS (últimas 5) ===');
  const messages = await sql`SELECT * FROM messages WHERE direction = 'incoming' ORDER BY created_at DESC LIMIT 5`;
  console.log(JSON.stringify(messages, null, 2));
  
  console.log('\n=== MENSAGENS ENVIADAS (últimas 5) ===');
  const sentMessages = await sql`SELECT * FROM messages WHERE direction = 'outgoing' ORDER BY created_at DESC LIMIT 5`;
  console.log(JSON.stringify(sentMessages, null, 2));
}

main().catch(console.error);