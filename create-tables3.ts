import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_ieqLvJwCMQ01@ep-green-mud-amowdera-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require');

async function main() {
  console.log('Criando tabela de instâncias de usuário...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS user_instances (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID UNIQUE NOT NULL,
      instance_name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  
  console.log('Criando tabela de comandos...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS commands (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      command VARCHAR(50) NOT NULL,
      sequence_id UUID,
      flow_id UUID,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  
  console.log('✅ Tabelas criadas!');
}

main().catch(console.error);