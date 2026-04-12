import { NextResponse } from 'next/server';
import { getEvolutionApi } from '@/lib/evolution-api-factory';
import { sql } from '@/lib/database';
import crypto from 'crypto';

const DEFAULT_API_URL = 'https://api.membropro.com.br';
const DEFAULT_API_KEY = 'd6996979cd25b0ebe76ab2fbe509538e';

function generateInstanceName(userId: string): string {
  const hash = crypto.createHash('md5').update(userId).digest('hex').substring(0, 8);
  return `fanzap-${hash}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    const instanceName = generateInstanceName(userId);
    console.log('[CONNECT] Criando instância:', instanceName);

    const evolutionApi = getEvolutionApi(DEFAULT_API_URL, DEFAULT_API_KEY);

    // Verificar se instância já existe
    const existingInstances = await evolutionApi.getInstances();
    const existing = existingInstances.find((i: any) => i.name === instanceName);

    if (existing) {
      console.log('[CONNECT] Instância já existe:', instanceName);
      
      // Se já está conectada, retornar status
      if (existing.connectionStatus === 'open') {
        return NextResponse.json({
          instanceName: existing.name,
          status: 'connected',
          alreadyConnected: true
        });
      }
      
      // Se não está conectada, gerar novo QR code
      const qrData = await evolutionApi.connectInstance(instanceName);
      return NextResponse.json({
        qrCode: qrData.qrCode?.base64 || qrData.pairingCode,
        instanceName: existing.name,
        status: 'connecting'
      });
    }

    // Criar nova instância
    console.log('[CONNECT] Criando nova instância na Evolution API...');
    const createResult = await evolutionApi.createInstance(instanceName);
    console.log('[CONNECT] Instância criada:', createResult.instance.instanceName);

    // Configurar webhook automaticamente
    const webhookUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}/api/webhook`
      : 'https://fanzap.vercel.app/api/webhook';

    console.log('[CONNECT] Configurando webhook para:', webhookUrl);
    
    try {
      await evolutionApi.setWebhook(instanceName, webhookUrl);
      console.log('[CONNECT] Webhook configurado com sucesso');
    } catch (webhookError) {
      console.error('[CONNECT] Erro ao configurar webhook:', webhookError);
      // Não falha a criação se webhook falhar
    }

    // Gerar QR Code
    console.log('[CONNECT] Gerando QR Code...');
    const qrData = await evolutionApi.connectInstance(instanceName);

    // Salvar instância no banco
    await sql`
      INSERT INTO user_instances (user_id, instance_name, created_at)
      VALUES (${userId}, ${instanceName}, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        instance_name = ${instanceName},
        updated_at = NOW()
    `;

    return NextResponse.json({
      qrCode: qrData.qrCode?.base64 || qrData.pairingCode,
      instanceName: instanceName,
      status: 'connecting'
    });
  } catch (error) {
    console.error('[CONNECT] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao conectar' },
      { status: 500 }
    );
  }
}