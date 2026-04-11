import { NextResponse } from 'next/server';
import { getTriggerById, updateTrigger, deleteTrigger } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trigger = await getTriggerById(id);
    
    if (!trigger) {
      return NextResponse.json({ error: 'Gatilho não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({
      ...trigger,
      isActive: trigger.is_active,
      instanceId: trigger.instance_name,
      targetType: trigger.target_type,
      targetId: trigger.target_id
    });
  } catch (error) {
    console.error('[API] Error fetching trigger:', error);
    return NextResponse.json({ error: 'Failed to fetch trigger' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    
    const trigger = await updateTrigger(id, {
      name: updates.name,
      keyword: updates.keyword,
      targetType: updates.targetType,
      targetId: updates.targetId,
      isActive: updates.isActive
    });
    
    if (!trigger) {
      return NextResponse.json({ error: 'Gatilho não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({
      ...trigger,
      isActive: trigger.is_active,
      instanceId: trigger.instance_name,
      targetType: trigger.target_type,
      targetId: trigger.target_id
    });
  } catch (error) {
    console.error('[API] Error updating trigger:', error);
    return NextResponse.json({ error: 'Failed to update trigger' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteTrigger(id);
    
    if (!result) {
      return NextResponse.json({ error: 'Gatilho não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error deleting trigger:', error);
    return NextResponse.json({ error: 'Failed to delete trigger' }, { status: 500 });
  }
}