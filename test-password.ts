import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_ieqLvJwCMQ01@ep-green-mud-amowdera-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require');

function verifyPassword(password: string, stored: string): boolean {
  const crypto = require('crypto');
  const parts = stored.split(':');
  if (parts.length !== 2) return false;
  const salt = parts[0];
  const storedHash = parts[1];
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  console.log('Input password:', password);
  console.log('Salt:', salt);
  console.log('Computed hash:', hash);
  console.log('Stored hash:', storedHash);
  return hash === storedHash;
}

async function main() {
  const result = await sql`SELECT password FROM users WHERE email = 'ericktorresadm@hotmail.com'`;
  const storedPassword = result[0].password;
  
  const isValid = verifyPassword('admin123', storedPassword);
  console.log('Password valid:', isValid);
}

main().catch(console.error);