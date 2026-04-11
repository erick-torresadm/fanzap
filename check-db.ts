import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_ieqLvJwCMQ01@ep-green-mud-amowdera-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require');

async function main() {
  console.log('=== TRIGGERS ===');
  const triggers = await sql`SELECT * FROM triggers`;
  console.log(JSON.stringify(triggers, null, 2));
  
  console.log('\n=== SEQUENCES ===');
  const sequences = await sql`SELECT * FROM sequences`;
  console.log(JSON.stringify(sequences, null, 2));
  
  console.log('\n=== ACTIVE TRIGGERS ===');
  const activeTriggers = await sql`SELECT * FROM triggers WHERE is_active = true`;
  console.log(JSON.stringify(activeTriggers, null, 2));
  
  console.log('\n=== ACTIVE SEQUENCES ===');
  const activeSeqs = await sql`SELECT * FROM sequences WHERE is_active = true`;
  console.log(JSON.stringify(activeSeqs, null, 2));
}

main().catch(console.error);