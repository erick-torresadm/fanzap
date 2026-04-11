import { NextResponse } from 'next/server';

const flows = new Map();

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

export async function GET() {
  const allFlows = Array.from(flows.values());
  return NextResponse.json(allFlows);
}

export async function POST(request: Request) {
  try {
    const { name, description, instanceId, nodes, edges } = await request.json();
    
    if (!name || !instanceId) {
      return NextResponse.json(
        { error: 'name e instanceId são obrigatórios' },
        { status: 400 }
      );
    }
    
    const flow = {
      id: generateId(),
      name,
      description: description || '',
      instanceId,
      nodes: nodes || [],
      edges: edges || [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    flows.set(flow.id, flow);
    
    return NextResponse.json(flow);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao criar fluxo' },
      { status: 500 }
    );
  }
}