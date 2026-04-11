'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface Instance {
  id: string;
  name: string;
  status: string;
}

export default function TestPage() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [selectedInstance, setSelectedInstance] = useState('');
  const [phone, setPhone] = useState('11948333534');
  const [message, setMessage] = useState('Olá! Esta é uma mensagem de teste do Fanzap 🚀');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

  useEffect(() => {
    fetch('/api/instances')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInstances(data.filter((i: any) => i.status === 'connected'));
          if (data.find((i: any) => i.status === 'connected')) {
            setSelectedInstance(data.find((i: any) => i.status === 'connected').name);
          }
        }
      });
  }, []);

  const handleSend = async () => {
    if (!selectedInstance || !phone || !message) return;
    
    setSending(true);
    setResult(null);

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instanceName: selectedInstance,
          number: phone,
          text: message,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setResult({ success: true });
      } else {
        setResult({ error: data.error });
      }
    } catch (err) {
      setResult({ error: 'Erro ao enviar' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold font-mono mb-2">Teste de Mensagens</h1>
        <p className="text-[#6B7280] mb-8">Enviar mensagem de teste</p>

        <div className="card mb-6">
          <label className="block text-sm font-medium mb-2">Instância</label>
          <select 
            value={selectedInstance}
            onChange={(e) => setSelectedInstance(e.target.value)}
            className="input"
          >
            <option value="">Selecione...</option>
            {instances.map(inst => (
              <option key={inst.id} value={inst.name}>{inst.name}</option>
            ))}
          </select>
          
          {instances.length === 0 && (
            <p className="text-[#FF3D00] text-sm mt-2">
              Nenhuma instância conectada. Vá em Instâncias e conecte uma.
            </p>
          )}
        </div>

        <div className="card mb-6">
          <label className="block text-sm font-medium mb-2">Número</label>
          <input 
            type="text" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input"
            placeholder="11948333534"
          />
        </div>

        <div className="card mb-6">
          <label className="block text-sm font-medium mb-2">Mensagem</label>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input min-h-[120px]"
            placeholder="Digite sua mensagem..."
          />
        </div>

        <button 
          onClick={handleSend}
          disabled={sending || !selectedInstance}
          className="btn btn-primary w-full"
        >
          {sending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar Mensagem
            </>
          )}
        </button>

        {result && (
          <div className={`mt-6 p-4 rounded-lg border ${
            result.success 
              ? 'bg-[#00C853]/10 border-[#00C853]/20 text-[#00C853]'
              : 'bg-[#FF3D00]/10 border-[#FF3D00]/20 text-[#FF3D00]'
          }`}>
            {result.success ? (
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Mensagem enviada com sucesso!
              </div>
            ) : (
              <div className="flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                {result.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}