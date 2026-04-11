import { NextResponse } from 'next/server';
import { getFlowById, updateFlow, deleteFlow } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const flow = await getFlowById(id);
    
    if (!flow) {
      return NextResponse.json({ error: 'Fluxo não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({
      ...flow,
      nodes: typeof flow.nodes === 'string' ? JSON.parse(flow.nodes) : flow.nodes,
      edges: typeof flow.edges === 'string' ? JSON.parse(flow.edges) : flow.edges,
    });
  } catch (error) {
    console.error('[API] Error fetching flow:', error);
    return NextResponse.json({ error: 'Failed to fetch flow' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    
    const flow = await updateFlow(id, updates);
    
    if (!flow) {
      return NextResponse.json({ error: 'Fluxo não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({
      ...flow,
      nodes: typeof flow.nodes === 'string' ? JSON.parse(flow.nodes) : flow.nodes,
      edges: typeof flow.edges === 'string' ? JSON.parse(flow.edges) : flow.edges,
    });
  } catch (error) {
    console.error('[API] Error updating flow:', error);
    return NextResponse.json({ error: 'Failed to update flow' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteFlow(id);
    
    if (!result) {
      return NextResponse.json({ error: 'Fluxo não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error deleting flow:', error);
    return NextResponse.json({ error: 'Failed to delete flow' }, { status: 500 });
  }
}