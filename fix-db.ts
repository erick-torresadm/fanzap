import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_ieqLvJwCMQ01@ep-green-mud-amowdera-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require');

async function main() {
  console.log('Corrigindo instância para erickfandim...');
  
  await sql`UPDATE triggers SET instance_name = 'erickfandim' WHERE instance_name = 'rickteste'`;
  await sql`UPDATE sequences SET instance_name = 'erickfandim' WHERE instance_name = 'rickteste'`;
  await sql`UPDATE flows SET instance_name = 'erickfandim' WHERE instance_name = 'rickteste'`;
  
  console.log('Verificando...');
  const triggers = await sql`SELECT id, name, instance_name, keyword, is_active FROM triggers`;
  console.log('Triggers:', JSON.stringify(triggers, null, 2));
  
  console.log('\n✅ Correção aplicada!');
}

main().catch(console.error);