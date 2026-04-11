import { NextResponse } from 'next/server';
import { getTriggers, createTrigger, getTriggerById, updateTrigger, deleteTrigger, getActiveTriggers } from '@/lib/database';

export async function GET() {
  try {
    const triggers = await getTriggers();
    return NextResponse.json(triggers.map((t: any) => ({
      ...t,
      isActive: t.is_active,
      instanceId: t.instance_name,
      targetType: t.target_type,
      targetId: t.target_id
    })));
  } catch (error) {
    console.error('[API] Error fetching triggers:', error);
    return NextResponse.json({ error: 'Failed to fetch triggers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, instanceName, keyword, targetType, targetId } = body;
    
    if (!name || !instanceName) {
      return NextResponse.json(
        { error: 'name e instanceName são obrigatórios' },
        { status: 400 }
      );
    }
    
    const trigger = await createTrigger({
      name,
      instanceName,
      keyword: keyword || '',
      targetType: targetType || 'flow',
      targetId: targetId || ''
    });
    
    return NextResponse.json({
      ...trigger,
      isActive: trigger.is_active,
      instanceId: trigger.instance_name,
      targetType: trigger.target_type,
      targetId: trigger.target_id
    });
  } catch (error) {
    console.error('[API] Error creating trigger:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao criar gatilho' }, { status: 500 });
  }
}