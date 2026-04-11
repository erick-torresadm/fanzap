import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_ieqLvJwCMQ01@ep-green-mud-amowdera-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require');

async function main() {
  console.log('Criando tabela de usuários...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  
  console.log('Criando tabela de instâncias de usuário...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS user_instances (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      instance_name VARCHAR(255) NOT NULL,
      instance_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  
  console.log('Adicionando user_id às tabelas existentes...');
  
  await sql`ALTER TABLE flows ADD COLUMN IF NOT EXISTS user_id UUID`;
  await sql`ALTER TABLE sequences ADD COLUMN IF NOT EXISTS user_id UUID`;
  await sql`ALTER TABLE triggers ADD COLUMN IF NOT EXISTS user_id UUID`;
  
  console.log('✅ Tabelas criadas!');
}

main().catch(console.error);