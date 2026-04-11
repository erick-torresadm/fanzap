import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_ieqLvJwCMQ01@ep-green-mud-amowdera-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require');

async function main() {
  await sql`CREATE TABLE IF NOT EXISTS flows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    instance_name VARCHAR(255),
    nodes JSONB NOT NULL DEFAULT '[]',
    edges JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`;
  
  await sql`CREATE TABLE IF NOT EXISTS sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    instance_name VARCHAR(255),
    messages JSONB NOT NULL DEFAULT '[]',
    flow_id UUID,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`;
  
  await sql`CREATE TABLE IF NOT EXISTS triggers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    instance_name VARCHAR(255),
    keyword VARCHAR(255),
    target_type VARCHAR(50) DEFAULT 'flow',
    target_id UUID,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`;
  
  await sql`CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_name VARCHAR(255) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    content TEXT,
    from_number VARCHAR(50),
    to_number VARCHAR(50),
    message_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
  )`;
  
  await sql`CREATE INDEX IF NOT EXISTS idx_messages_instance ON messages(instance_name)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_messages_from ON messages(from_number)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_flows_instance ON flows(instance_name)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sequences_instance ON sequences(instance_name)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_triggers_instance ON triggers(instance_name)`;
  
  console.log('✅ Tables created successfully!');
}

main().catch(console.error);