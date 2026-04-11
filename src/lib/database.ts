import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || 'postgresql://neondb_owner:npg_ieqLvJwCMQ01@ep-green-mud-amowdera-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
const sql: any = neon(databaseUrl);

export { sql };

// Flows
export async function getFlows() {
  return await sql`SELECT * FROM flows ORDER BY created_at DESC`;
}

export async function getFlowById(id: string) {
  const result = await sql`SELECT * FROM flows WHERE id = ${id}`;
  return result[0] || null;
}

export async function createFlow(data: { name: string; description?: string; instanceName: string; nodes?: any[]; edges?: any[] }) {
  const result = await sql`
    INSERT INTO flows (name, description, instance_name, nodes, edges, is_active, created_at, updated_at)
    VALUES (${data.name}, ${data.description || ''}, ${data.instanceName}, ${JSON.stringify(data.nodes || [])}, ${JSON.stringify(data.edges || [])}, false, NOW(), NOW())
    RETURNING *
  `;
  return result[0];
}

export async function updateFlow(id: string, updates: { name?: string; description?: string; nodes?: any; edges?: any; isActive?: boolean }) {
  const fields: string[] = [];
  const values: any[] = [id];
  let idx = 2;
  
  if (updates.name !== undefined) {
    fields.push(`name = $${idx++}`);
    values.push(updates.name);
  }
  if (updates.description !== undefined) {
    fields.push(`description = $${idx++}`);
    values.push(updates.description);
  }
  if (updates.nodes !== undefined) {
    fields.push(`nodes = $${idx++}`);
    values.push(JSON.stringify(updates.nodes));
  }
  if (updates.edges !== undefined) {
    fields.push(`edges = $${idx++}`);
    values.push(JSON.stringify(updates.edges));
  }
  if (updates.isActive !== undefined) {
    fields.push(`is_active = $${idx++}`);
    values.push(updates.isActive);
  }
  
  if (fields.length === 0) return null;
  
  const query = `UPDATE flows SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $1 RETURNING *`;
  const result = await sql(query, values);
  return result[0];
}

export async function deleteFlow(id: string) {
  const result = await sql`DELETE FROM flows WHERE id = ${id} RETURNING id`;
  return result[0];
}

export async function getActiveFlows() {
  return await sql`SELECT * FROM flows WHERE is_active = true`;
}

export async function getFlowsByInstance(instanceName: string) {
  return await sql`SELECT * FROM flows WHERE instance_name = ${instanceName} AND is_active = true`;
}

// Sequences
export async function getSequences() {
  return await sql`SELECT * FROM sequences ORDER BY created_at DESC`;
}

export async function getSequenceById(id: string) {
  const result = await sql`SELECT * FROM sequences WHERE id = ${id}`;
  return result[0] || null;
}

export async function createSequence(data: { name: string; instanceName: string; messages: any[]; flowId?: string }) {
  const result = await sql`
    INSERT INTO sequences (name, instance_name, messages, flow_id, is_active, created_at, updated_at)
    VALUES (${data.name}, ${data.instanceName}, ${JSON.stringify(data.messages)}, ${data.flowId || null}, false, NOW(), NOW())
    RETURNING *
  `;
  return result[0];
}

export async function updateSequence(id: string, updates: { name?: string; messages?: any; isActive?: boolean }) {
  const fields: string[] = [];
  const values: any[] = [id];
  let idx = 2;
  
  if (updates.name !== undefined) {
    fields.push(`name = $${idx++}`);
    values.push(updates.name);
  }
  if (updates.messages !== undefined) {
    fields.push(`messages = $${idx++}`);
    values.push(JSON.stringify(updates.messages));
  }
  if (updates.isActive !== undefined) {
    fields.push(`is_active = $${idx++}`);
    values.push(updates.isActive);
  }
  
  if (fields.length === 0) return null;
  
  const query = `UPDATE sequences SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $1 RETURNING *`;
  const result = await sql(query, values);
  return result[0];
}

export async function deleteSequence(id: string) {
  const result = await sql`DELETE FROM sequences WHERE id = ${id} RETURNING id`;
  return result[0];
}

export async function getActiveSequences() {
  return await sql`SELECT * FROM sequences WHERE is_active = true`;
}

export async function getSequencesByInstance(instanceName: string) {
  return await sql`SELECT * FROM sequences WHERE instance_name = ${instanceName} AND is_active = true`;
}

// Triggers
export async function getTriggers() {
  return await sql`SELECT * FROM triggers ORDER BY created_at DESC`;
}

export async function getTriggerById(id: string) {
  const result = await sql`SELECT * FROM triggers WHERE id = ${id}`;
  return result[0] || null;
}

export async function createTrigger(data: { name: string; instanceName: string; keyword: string; targetType?: string; targetId?: string }) {
  const result = await sql`
    INSERT INTO triggers (name, instance_name, keyword, target_type, target_id, is_active, created_at, updated_at)
    VALUES (${data.name}, ${data.instanceName}, ${data.keyword}, ${data.targetType || 'flow'}, ${data.targetId || null}, false, NOW(), NOW())
    RETURNING *
  `;
  return result[0];
}

export async function updateTrigger(id: string, updates: { name?: string; keyword?: string; targetType?: string; targetId?: string; isActive?: boolean }) {
  const fields: string[] = [];
  const values: any[] = [id];
  let idx = 2;
  
  if (updates.name !== undefined) {
    fields.push(`name = $${idx++}`);
    values.push(updates.name);
  }
  if (updates.keyword !== undefined) {
    fields.push(`keyword = $${idx++}`);
    values.push(updates.keyword);
  }
  if (updates.targetType !== undefined) {
    fields.push(`target_type = $${idx++}`);
    values.push(updates.targetType);
  }
  if (updates.targetId !== undefined) {
    fields.push(`target_id = $${idx++}`);
    values.push(updates.targetId);
  }
  if (updates.isActive !== undefined) {
    fields.push(`is_active = $${idx++}`);
    values.push(updates.isActive);
  }
  
  if (fields.length === 0) return null;
  
  const query = `UPDATE triggers SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $1 RETURNING *`;
  const result = await sql(query, values);
  return result[0];
}

export async function deleteTrigger(id: string) {
  const result = await sql`DELETE FROM triggers WHERE id = ${id} RETURNING id`;
  return result[0];
}

export async function getActiveTriggers() {
  return await sql`SELECT * FROM triggers WHERE is_active = true`;
}

export async function getTriggersByInstance(instanceName: string) {
  return await sql`SELECT * FROM triggers WHERE instance_name = ${instanceName} AND is_active = true`;
}

// Messages
export async function saveMessage(data: { instanceName: string; direction: string; content?: string; fromNumber?: string; toNumber?: string; messageId?: string }) {
  const result = await sql`
    INSERT INTO messages (instance_name, direction, content, from_number, to_number, message_id, created_at)
    VALUES (${data.instanceName}, ${data.direction}, ${data.content || ''}, ${data.fromNumber || ''}, ${data.toNumber || ''}, ${data.messageId || null}, NOW())
    RETURNING *
  `;
  return result[0];
}

export async function getMessages(instanceName: string, limit = 50) {
  return await sql`SELECT * FROM messages WHERE instance_name = ${instanceName} ORDER BY created_at DESC LIMIT ${limit}`;
}

export async function getMessagesByContact(instanceName: string, fromNumber: string, limit = 20) {
  return await sql`SELECT * FROM messages WHERE instance_name = ${instanceName} AND from_number = ${fromNumber} ORDER BY created_at DESC LIMIT ${limit}`;
}