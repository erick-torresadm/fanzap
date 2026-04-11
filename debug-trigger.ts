import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_ieqLvJwCMQ01@ep-green-mud-amowdera-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require');

async function main() {
  // Testar se o gatilho Existe com keyword "oi"
  const triggers = await sql`
    SELECT * FROM triggers 
    WHERE is_active = true 
    AND keyword = 'oi'
    AND instance_name = 'rickteste'
  `;
  
  console.log('Trigger para "oi" em rickteste:', JSON.stringify(triggers, null, 2));
  
  // Testar a sequência que deve ser executada
  if (triggers.length > 0) {
    const targetId = triggers[0].target_id;
    const sequence = await sql`SELECT * FROM sequences WHERE id = ${targetId}`;
    console.log('Sequência alvo:', JSON.stringify(sequence, null, 2));
  }
  
  // Verificar instance_name
  console.log('\nInstance name no banco: "rickteste"');
  console.log('Instance name que vem do webhook deve ser igual');
}

main().catch(console.error);