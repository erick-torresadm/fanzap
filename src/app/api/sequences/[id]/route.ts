import { NextResponse } from 'next/server';
import { getSequenceById, updateSequence, deleteSequence } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sequence = await getSequenceById(id);
    
    if (!sequence) {
      return NextResponse.json({ error: 'Sequência não encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({
      ...sequence,
      messages: typeof sequence.messages === 'string' ? JSON.parse(sequence.messages) : sequence.messages,
    });
  } catch (error) {
    console.error('[API] Error fetching sequence:', error);
    return NextResponse.json({ error: 'Failed to fetch sequence' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    
    console.log('[API] PUT sequence:', id, updates);
    
    const dbUpdates: { name?: string; messages?: any; isActive?: boolean } = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.messages !== undefined) dbUpdates.messages = updates.messages;
    if (updates.isActive !== undefined) dbUpdates.isActive = Boolean(updates.isActive);
    
    console.log('[API] dbUpdates:', dbUpdates);
    
    const sequence = await updateSequence(id, dbUpdates);
    
    if (!sequence) {
      return NextResponse.json({ error: 'Sequência não encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({
      ...sequence,
      messages: typeof sequence.messages === 'string' ? JSON.parse(sequence.messages) : sequence.messages,
    });
  } catch (error) {
    console.error('[API] Error updating sequence:', error);
    return NextResponse.json({ error: 'Failed to update sequence' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteSequence(id);
    
    if (!result) {
      return NextResponse.json({ error: 'Sequência não encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error deleting sequence:', error);
    return NextResponse.json({ error: 'Failed to delete sequence' }, { status: 500 });
  }
}