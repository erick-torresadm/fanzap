'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2, Phone, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

interface Instance {
  name: string;
  status: string;
  phoneNumber?: string;
}

export default function TestePage() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedInstance, setSelectedInstance] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetchInstances();
  }, []);

  const fetchInstances = async () => {
    try {
      const res = await fetch('/api/instances');
      const data = await res.json();
      if (Array.isArray(data)) {
        setInstances(data);
        const connected = data.find((i: Instance) => i.status === 'connected');
        if (connected) setSelectedInstance(connected.name);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!phone || !message || !selectedInstance) return;
    
    setSending(true);
    setResult(null);

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instanceName: selectedInstance,
          number: phone.replace(/\D/g, ''),
          text: message
        })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setResult({ success: true, message: 'Mensagem enviada com sucesso!' });
        setMessage('');
        setPhone('');
      } else {
        setResult({ success: false, message: data.error || 'Erro ao enviar mensagem' });
      }
    } catch (e) {
      setResult({ success: false, message: 'Erro de conexão' });
    } finally {
      setSending(false);
    }
  };

  const connectedInstances = instances.filter(i => i.status === 'connected');

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-mono">Teste de Mensagens</h1>
        <p className="text-[#6B7280]">Envie mensagens de teste usando suas instâncias conectadas</p>
      </div>

      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-[#00D9FF]" />
          <h2 className="font-semibold">Selecionar Instância</h2>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-[#6B7280]">
            <Loader2 className="w-4 h-4 animate-spin" />
            Carregando...
          </div>
        ) : connectedInstances.length === 0 ? (
          <div className="text-center py-6">
            <AlertCircle className="w-8 h-8 text-[#FFB300] mx-auto mb-2" />
            <p className="text-[#6B7280]">Nenhuma instância conectada</p>
            <a href="/instances" className="text-[#00D9FF] text-sm hover:underline">
              Conectar instância →
            </a>
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {connectedInstances.map((inst) => (
              <button
                key={inst.name}
                onClick={() => setSelectedInstance(inst.name)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedInstance === inst.name
                    ? 'bg-[#00D9FF] text-[#0F0F0F] font-medium'
                    : 'bg-[#1A1A1A] text-[#6B7280] hover:text-white'
                }`}
              >
                {inst.name} ({inst.phoneNumber || '---'})
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-[#00D9FF]" />
          <h2 className="font-semibold">Enviar Mensagem</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#6B7280] mb-2">Número de telefone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="11999999999"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-[#6B7280] mb-2">Mensagem</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              rows={4}
              className="input resize-none"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!selectedInstance || !phone || !message || sending}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar Mensagem
              </>
            )}
          </button>

          {result && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              result.success 
                ? 'bg-[#00C853]/10 text-[#00C853]' 
                : 'bg-[#FF3D00]/10 text-[#FF3D00]'
            }`}>
              {result.success ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {result.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}