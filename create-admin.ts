import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_ieqLvJwCMQ01@ep-green-mud-amowdera-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require');

function hashPassword(password: string): string {
  const crypto = require('crypto');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  const adminPassword = hashPassword('admin123');
  
  // Update or create admin user
  const existing = await sql`SELECT id FROM users WHERE email = 'ericktorresadm@hotmail.com'`;
  
  if (existing.length > 0) {
    await sql`UPDATE users SET password = ${adminPassword}, name = 'Admin' WHERE email = 'ericktorresadm@hotmail.com'`;
    console.log('✅ Senha do admin atualizada!');
  } else {
    await sql`
      INSERT INTO users (name, email, password, created_at, updated_at)
      VALUES ('Admin', 'ericktorresadm@hotmail.com', ${adminPassword}, NOW(), NOW())
    `;
    console.log('✅ Usuário admin criado!');
  }
  
  // List all users
  const users = await sql`SELECT id, name, email FROM users`;
  console.log('Usuários:', JSON.stringify(users, null, 2));
}

main().catch(console.error);