import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_ieqLvJwCMQ01@ep-green-mud-amowdera-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require');

async function main() {
  console.log('Corrigindo instância nos dados...');
  
  await sql`UPDATE triggers SET instance_name = 'rickteste' WHERE instance_name = 'erick'`;
  await sql`UPDATE sequences SET instance_name = 'rickteste' WHERE instance_name = 'erick'`;
  await sql`UPDATE flows SET instance_name = 'rickteste' WHERE instance_name = 'erick'`;
  
  console.log('Verificando correção...');
  
  const triggers = await sql`SELECT id, name, instance_name, keyword, is_active FROM triggers`;
  const sequences = await sql`SELECT id, name, instance_name, is_active FROM sequences`;
  
  console.log('Triggers:', JSON.stringify(triggers, null, 2));
  console.log('Sequences:', JSON.stringify(sequences, null, 2));
  
  console.log('\n✅ Correção aplicada!');
}

main().catch(console.error);