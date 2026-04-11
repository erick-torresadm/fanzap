import { NextResponse } from 'next/server';
import { getFlows, createFlow } from '@/lib/database';

export async function GET() {
  try {
    const flows = await getFlows();
    return NextResponse.json(flows.map((f: any) => ({
      ...f,
      nodes: typeof f.nodes === 'string' ? JSON.parse(f.nodes) : f.nodes,
      edges: typeof f.edges === 'string' ? JSON.parse(f.edges) : f.edges,
    })));
  } catch (error) {
    console.error('[API] Error fetching flows:', error);
    return NextResponse.json({ error: 'Failed to fetch flows' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, instanceName, nodes, edges } = body;
    
    if (!name || !instanceName) {
      return NextResponse.json(
        { error: 'name e instanceName são obrigatórios' },
        { status: 400 }
      );
    }
    
    const flow = await createFlow({
      name,
      description: description || '',
      instanceName,
      nodes: nodes || [],
      edges: edges || [],
    });
    
    return NextResponse.json({
      ...flow,
      nodes: typeof flow.nodes === 'string' ? JSON.parse(flow.nodes) : flow.nodes,
      edges: typeof flow.edges === 'string' ? JSON.parse(flow.edges) : flow.edges,
    });
  } catch (error) {
    console.error('[API] Error creating flow:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao criar fluxo' }, { status: 500 });
  }
}