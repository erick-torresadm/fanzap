import { NextResponse } from 'next/server';
import { sql } from '@/lib/database';

const SCHEMA = `
-- Flows (automation flows)
CREATE TABLE IF NOT EXISTS flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  instance_name VARCHAR(255),
  nodes JSONB NOT NULL DEFAULT '[]',
  edges JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Message Sequences
CREATE TABLE IF NOT EXISTS sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  instance_name VARCHAR(255),
  messages JSONB NOT NULL DEFAULT '[]',
  flow_id UUID,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Triggers (automation triggers)
CREATE TABLE IF NOT EXISTS triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  instance_name VARCHAR(255),
  keyword VARCHAR(255),
  target_type VARCHAR(50) DEFAULT 'flow',
  target_id UUID,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Message Logs (received and sent messages)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_name VARCHAR(255) NOT NULL,
  direction VARCHAR(10) NOT NULL,
  content TEXT,
  from_number VARCHAR(50),
  to_number VARCHAR(50),
  message_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_instance ON messages(instance_name);
CREATE INDEX IF NOT EXISTS idx_messages_from ON messages(from_number);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_flows_instance ON flows(instance_name);
CREATE INDEX IF NOT EXISTS idx_sequences_instance ON sequences(instance_name);
CREATE INDEX IF NOT EXISTS idx_triggers_instance ON triggers(instance_name);
`;

export async function POST() {
  try {
    await sql(SCHEMA);
    return NextResponse.json({ success: true, message: 'Database schema initialized' });
  } catch (error) {
    console.error('[API] Schema init error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize schema' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    return NextResponse.json({ tables: tables.map((t: any) => t.table_name) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
}