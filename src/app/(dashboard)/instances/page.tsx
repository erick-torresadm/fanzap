'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  MessageSquare, 
  Plus, 
  RefreshCw,
  QrCode,
  Trash2,
  Loader2,
  Check,
  XCircle,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';

interface Instance {
  id: string;
  name: string;
  phoneNumber: string;
  status: 'connected' | 'disconnected' | 'connecting';
}

interface QRCodeData {
  qrCode: string;
  code: string;
  pairingCode?: string;
}

export default function InstancesPage() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<QRCodeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInstances = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/instances');
      const data = await res.json();
      if (Array.isArray(data)) {
        setInstances(data);
      } else {
        setInstances([]);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
      setInstances([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstances();
    const interval = setInterval(fetchInstances, 10000);
    return () => clearInterval(interval);
  }, [fetchInstances]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      setCreating(true);
      const res = await fetch('/api/instances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Falha ao criar');
      }
      setNewName('');
      setShowNew(false);
      fetchInstances();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
    } finally {
      setCreating(false);
    }
  };

  const handleConnect = async (name: string) => {
    try {
      setConnecting(name);
      setError(null);
      const res = await fetch(`/api/instances/${name}/qrcode`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao gerar código');
      }
      
      setQrCode(data);
      
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/instances/${name}`);
          if (statusRes.ok) {
            const instanceData = await statusRes.json();
            if (instanceData.status === 'connected') {
              clearInterval(pollInterval);
              setConnecting(null);
              setQrCode(null);
              fetchInstances();
            }
          }
        } catch { clearInterval(pollInterval); }
      }, 3000);
      
      setTimeout(() => { 
        clearInterval(pollInterval); 
        setConnecting(null); 
      }, 180000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
      setConnecting(null);
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
      const res = await fetch(`/api/instances/${name}`, { method: 'DELETE' });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error); }
      setInstances(instances.filter(i => i.id !== name));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
    }
  };

  const handleSetWebhook = async (name: string) => {
    if (!confirm('Configurar webhook automaticamente para esta instância?')) return;
    
    const webhookUrl = `${window.location.origin}/api/webhook`;
    
    try {
      setConnecting(name);
      const res = await fetch(`/api/instances/${name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setWebhook', webhookUrl })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao configurar webhook');
      }
      
      alert('Webhook configurado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono">Instâncias</h1>
          <p className="text-[#6B7280]">Gerencie suas conexões WhatsApp</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Nova Instância
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[#FF3D00]/10 border border-[#FF3D00]/20 rounded-lg text-[#FF3D00] text-sm">
          {error}
        </div>
      )}

      {showNew && (
        <div className="card mb-6">
          <h3 className="font-semibold mb-4">Criar Nova Instância</h3>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Nome da instância (ex: empresa-vendas)" 
              className="input flex-1"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <button onClick={handleCreate} disabled={creating || !newName.trim()} className="btn btn-primary">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar'}
            </button>
            <button onClick={() => setShowNew(false)} className="btn btn-outline">Cancelar</button>
          </div>
        </div>
      )}

      {qrCode && (
        <div className="card mb-6 text-center">
          <h3 className="font-semibold mb-2">Conectar ao WhatsApp</h3>
          <p className="text-sm text-[#6B7280] mb-6">Escaneie o QR Code com seu aplicativo WhatsApp</p>
          
          <div className="flex justify-center mb-6">
            {qrCode.qrCode ? (
              <div className="p-4 bg-white border-2 border-[#0F0F0F] rounded-lg inline-block">
                <img src={qrCode.qrCode} alt="QR Code" className="w-56 h-56" />
              </div>
            ) : qrCode.pairingCode ? (
              <div className="p-8 bg-[#FAFAFA] rounded-lg inline-block">
                <p className="text-sm text-[#6B7280] mb-2">Código de Pareamento</p>
                <p className="text-4xl font-mono font-bold tracking-widest">{qrCode.pairingCode}</p>
              </div>
            ) : (
              <div className="w-56 h-56 bg-[#FAFAFA] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#6B7280]" />
              </div>
            )}
          </div>
          
          <p className="text-xs text-[#6B7280] mb-4">
            {connecting ? 'Aguardando conexão...' : 'Aguardando QR Code...'}
          </p>
          
          <button onClick={() => { setQrCode(null); setConnecting(null); }} className="btn btn-outline">
            Cancelar
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#6B7280]" />
        </div>
      ) : instances.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-[#FAFAFA] rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-[#6B7280]" />
          </div>
          <h3 className="font-semibold mb-2">Nenhuma instância</h3>
          <p className="text-sm text-[#6B7280] mb-6">Crie sua primeira instância para começar</p>
          <button onClick={() => setShowNew(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Criar Instância
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {instances.map((inst) => (
            <div key={inst.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    inst.status === 'connected' 
                      ? 'bg-[#00C853]/10' 
                      : inst.status === 'connecting'
                      ? 'bg-[#FFB300]/10'
                      : 'bg-[#FAFAFA]'
                  }`}>
                    <MessageSquare className={`w-6 h-6 ${
                      inst.status === 'connected' 
                        ? 'text-[#00C853]' 
                        : inst.status === 'connecting'
                        ? 'text-[#FFB300]'
                        : 'text-[#6B7280]'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{inst.name}</h3>
                    <p className="text-sm text-[#6B7280]">{inst.phoneNumber || 'Não conectado'}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  {inst.status === 'connected' && (
                    <span className="badge badge-success">
                      <Wifi className="w-3 h-3 mr-1" />
                      Conectado
                    </span>
                  )}
                  {inst.status === 'connecting' && (
                    <span className="badge badge-warning">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Conectando
                    </span>
                  )}
                  {inst.status === 'disconnected' && (
                    <span className="badge badge-outline">
                      <WifiOff className="w-3 h-3 mr-1" />
                      Desconectado
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {inst.status === 'connected' && (
                    <button 
                      onClick={() => handleSetWebhook(inst.name)}
                      disabled={connecting === inst.name}
                      className="btn btn-sm btn-secondary"
                      title="Configurar webhook"
                    >
                      {connecting === inst.name ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Wifi className="w-4 h-4" />
                      )}
                      Webhook
                    </button>
                  )}
                  {inst.status !== 'connected' && (
                    <button 
                      onClick={() => handleConnect(inst.name)}
                      disabled={connecting === inst.name}
                      className="btn btn-sm btn-primary"
                    >
                      {connecting === inst.name ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <QrCode className="w-4 h-4" />
                      )}
                      Conectar
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(inst.name)}
                    className="btn btn-sm btn-ghost text-[#FF3D00]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}