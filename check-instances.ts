import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_ieqLvJwCMQ01@ep-green-mud-amowdera-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require');

async function main() {
  // Create a test sequence
  const sequenceId = await sql`
    INSERT INTO sequences (name, instance_name, messages, is_active, created_at)
    VALUES (' Saudação', 'fanzap_b74cec06', '[{"content": "Olá! 👋 Bem-vindo ao Fanzap!", "delay": 0}, {"content": "Somos uma plataforma de automação WhatsApp.", "delay": 2}, {"content": "Digite !menu para ver o que podemos fazer por você.", "delay": 3}]', true, NOW())
    RETURNING id
  `;
  
  const seqId = sequenceId[0]?.id;
  console.log('✅ Sequence created:', seqId);
  
  // Create a trigger
  await sql`
    INSERT INTO triggers (name, keyword, instance_name, target_type, target_id, is_active, created_at)
    VALUES ('Saudação Automática', '!oi', 'fanzap_b74cec06', 'sequence', ${seqId}, true, NOW())
  `;
  
  console.log('✅ Trigger created');
  
  // Verify
  const triggers = await sql`SELECT * FROM triggers WHERE is_active = true`;
  console.log('Active triggers:', JSON.stringify(triggers, null, 2));
}

main().catch(console.error);