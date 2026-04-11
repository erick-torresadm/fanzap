import { NextResponse } from 'next/server';
import { getSequences, createSequence } from '@/lib/database';

export async function GET() {
  try {
    const sequences = await getSequences();
    return NextResponse.json(sequences.map((s: any) => ({
      ...s,
      messages: typeof s.messages === 'string' ? JSON.parse(s.messages) : s.messages,
    })));
  } catch (error) {
    console.error('[API] Error fetching sequences:', error);
    return NextResponse.json({ error: 'Failed to fetch sequences' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, instanceName, messages, flowId } = body;
    
    if (!name || !instanceName || !messages) {
      return NextResponse.json(
        { error: 'name, instanceName e messages são obrigatórios' },
        { status: 400 }
      );
    }
    
    const sequence = await createSequence({
      name,
      instanceName,
      messages,
      flowId: flowId || null,
    });
    
    return NextResponse.json({
      ...sequence,
      messages: typeof sequence.messages === 'string' ? JSON.parse(sequence.messages) : sequence.messages,
    });
  } catch (error) {
    console.error('[API] Error creating sequence:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao criar sequência' }, { status: 500 });
  }
}