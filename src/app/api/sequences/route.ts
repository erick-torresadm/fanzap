import { NextResponse } from 'next/server';

const sequences = new Map();
const runningSequences = new Map();

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

export async function GET() {
  const allSequences = Array.from(sequences.values());
  return NextResponse.json(allSequences);
}

export async function POST(request: Request) {
  try {
    const { name, instanceId, messages, flowId } = await request.json();
    
    if (!name || !instanceId || !messages) {
      return NextResponse.json(
        { error: 'name, instanceId e messages são obrigatórios' },
        { status: 400 }
      );
    }
    
    const sequence = {
      id: generateId(),
      name,
      instanceId,
      flowId: flowId || null,
      messages: messages.map((m: any, index: number) => ({
        id: generateId(),
        content: m.content || '',
        type: m.type || 'text',
        delay: m.delay || (index * 1000),
        mediaUrl: m.mediaUrl || null,
      })),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    sequences.set(sequence.id, sequence);
    
    return NextResponse.json(sequence);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao criar sequência' },
      { status: 500 }
    );
  }
}