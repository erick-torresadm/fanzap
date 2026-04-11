import { NextResponse } from 'next/server';
import { evolutionApi } from '@/lib/evolution-api';

export async function POST(request: Request) {
  try {
    const { sequenceId, phoneNumber } = await request.json();
    
    if (!sequenceId || !phoneNumber) {
      return NextResponse.json(
        { error: 'sequenceId e phoneNumber são obrigatórios' },
        { status: 400 }
      );
    }
    
    const sequenceRepo = await import('../route.ts');
    const sequences = sequenceRepo.sequences;
    const sequence = sequences.get(sequenceId);
    
    if (!sequence) {
      return NextResponse.json({ error: 'Sequência não encontrada' }, { status: 404 });
    }
    
    const instanceName = sequence.instanceId;
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    const results = [];
    
    for (const msg of sequence.messages) {
      try {
        if (msg.type === 'text' || !msg.type) {
          await evolutionApi.sendMessage(instanceName, cleanPhone, msg.content);
        } else if (msg.type === 'image' || msg.type === 'video' || msg.type === 'audio') {
          await evolutionApi.sendMedia(instanceName, cleanPhone, {
            mediaUrl: msg.mediaUrl,
            caption: msg.content,
          });
        }
        
        results.push({ messageId: msg.id, success: true });
        
        if (msg.delay > 0) {
          await new Promise(resolve => setTimeout(resolve, msg.delay));
        }
      } catch (err) {
        results.push({ messageId: msg.id, success: false, error: err instanceof Error ? err.message : 'Erro' });
      }
    }
    
    return NextResponse.json({
      success: true,
      sequenceId,
      phoneNumber: cleanPhone,
      results,
    });
  } catch (error) {
    console.error('[API] Error executing sequence:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao executar sequência' },
      { status: 500 }
    );
  }
}