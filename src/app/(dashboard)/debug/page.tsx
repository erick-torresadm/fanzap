'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';

interface DebugInfo {
  messages: any[];
  triggers: any[];
  sequences: any[];
  flows: any[];
  webhookStatus: any;
}

export default function DebugPage() {
  const [data, setData] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastWebhookCall, setLastWebhookCall] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [msgRes, triggersRes, sequencesRes, flowsRes, webhookRes] = await Promise.all([
        fetch('/api/messages/debug'),
        fetch('/api/triggers'),
        fetch('/api/sequences'),
        fetch('/api/flows'),
        fetch('/api/webhook')
      ]);
      
      const messages = await msgRes.json();
      const triggers = await triggersRes.json();
      const sequences = await sequencesRes.json();
      const flows = await flowsRes.json();
      const webhookStatus = await webhookRes.json();
      
      setData({
        messages: Array.isArray(messages) ? messages : [],
        triggers: Array.isArray(triggers) ? triggers : [],
        sequences: Array.isArray(sequences) ? sequences : [],
        flows: Array.isArray(flows) ? flows : [],
        webhookStatus
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const testWebhook = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'messages.upsert',
          instance: 'rickteste',
          data: {
            messages: [{
              key: { remoteJid: '5511999999999@s.whatsapp.net', fromMe: false, id: 'test123' },
              message: { conversation: 'oi' }
            }]
          }
        })
      });
      const result = await res.json();
      setLastWebhookCall(result);
      setTimeout(fetchData, 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#00D9FF]" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-mono">Debug Webhook</h1>
          <p className="text-[#6B7280]">Diagnóstico em tempo real</p>
        </div>
        <div className="flex gap-2">
          <button onClick={testWebhook} className="btn btn-secondary" disabled={loading}>
            Testar Webhook
          </button>
          <button onClick={fetchData} className="btn btn-primary">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {lastWebhookCall && (
        <div className="mb-6 p-4 bg-[#00D9FF]/10 border border-[#00D9FF]/20 rounded-lg">
          <h3 className="font-semibold text-[#00D9FF] mb-2">Última chamada ao webhook:</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(lastWebhookCall, null, 2)}</pre>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-3 text-[#00D9FF]">Gatilhos Ativos</h3>
          {data?.triggers.length === 0 ? (
            <p className="text-[#6B7280]">Nenhum gatilho</p>
          ) : (
            <div className="space-y-2">
              {data?.triggers.map((t: any) => (
                <div key={t.id} className="p-3 bg-[#0A0A0A] rounded-lg">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-[#6B7280]">
                    keyword: "{t.keyword}" → {t.target_type}: {t.target_id?.substring(0, 8)}...
                  </div>
                  <div className="text-xs text-[#6B7280]">instância: {t.instance_name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3 text-[#00D9FF]">Sequências Ativas</h3>
          {data?.sequences.length === 0 ? (
            <p className="text-[#6B7280]">Nenhuma sequência</p>
          ) : (
            <div className="space-y-2">
              {data?.sequences.map((s: any) => (
                <div key={s.id} className="p-3 bg-[#0A0A0A] rounded-lg">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-[#6B7280]">
                    {s.messages?.length || 0} mensagens
                  </div>
                  <div className="text-xs text-[#6B7280]">instância: {s.instance_name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card md:col-span-2">
          <h3 className="font-semibold mb-3 text-[#00D9FF]">Mensagens Recebidas</h3>
          {data?.messages.length === 0 ? (
            <p className="text-[#6B7280]">Nenhuma mensagem recebida ainda</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-auto">
              {data?.messages.map((m: any) => (
                <div key={m.id} className="p-3 bg-[#0A0A0A] rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">{m.direction === 'incoming' ? '📥' : '📤'}</span>
                    <span className="text-xs text-[#6B7280]">{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  <div className="text-sm">{m.content}</div>
                  <div className="text-xs text-[#6B7280]">de: {m.from_number} | instância: {m.instance_name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card md:col-span-2">
          <h3 className="font-semibold mb-3 text-[#00D9FF]">Status Webhook</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(data?.webhookStatus, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}