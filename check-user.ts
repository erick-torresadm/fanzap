import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_ieqLvJwCMQ01@ep-green-mud-amowdera-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require');

async function main() {
  const result = await sql`SELECT id, name, email, password FROM users WHERE email = 'ericktorresadm@hotmail.com'`;
  console.log('User:', JSON.stringify(result[0], null, 2));
}

main().catch(console.error);