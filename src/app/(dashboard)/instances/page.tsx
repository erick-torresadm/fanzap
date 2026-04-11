'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Plus, 
  RefreshCw,
  QrCode,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle
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
      if (!res.ok) throw new Error('Falha ao buscar');
      const data = await res.json();
      setInstances(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstances();
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
        throw new Error(data.error || 'Falha ao gerar QR');
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
      }, 5000);
      
      setTimeout(() => { clearInterval(pollInterval); setConnecting(null); }, 120000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
      setConnecting(null);
    }
  };

  const handleDelete = async (name: string) => {
    try {
      const res = await fetch(`/api/instances/${name}`, { method: 'DELETE' });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error); }
      setInstances(instances.filter(i => i.id !== name));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Instâncias</h1>
          <p className="text-gray-500 text-sm">Conecte seu WhatsApp</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova
        </Button>
      </div>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}

      {showNew && (
        <Card className="mb-4 p-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Nome da instância" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCreate} disabled={creating || !newName.trim()}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Criar'}
            </Button>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
          </div>
        </Card>
      )}

      {qrCode && (
        <Card className="mb-4 p-6 text-center">
          <h3 className="font-medium mb-4">Escaneie com WhatsApp</h3>
          {qrCode.qrCode ? (
            <img src={qrCode.qrCode} alt="QR Code" className="w-48 h-48 mx-auto border" />
          ) : (
            <div className="w-48 h-48 mx-auto bg-gray-100 flex items-center justify-center">
              <QrCode className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">
            {connecting === 'connecting' ? 'Aguardando...' : 'Aguardando conexão...'}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => setQrCode(null)}>
            Fechar
          </Button>
        </Card>
      )}

      {instances.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhuma instância</p>
          <Button className="mt-4" onClick={() => setShowNew(true)}>
            Criar primeira instância
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {instances.map((inst) => (
            <Card key={inst.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  inst.status === 'connected' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <MessageSquare className={`h-5 w-5 ${
                    inst.status === 'connected' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <div className="font-medium">{inst.name}</div>
                  <div className="text-sm text-gray-500">
                    {inst.phoneNumber || 'Não conectado'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {inst.status === 'connected' ? (
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Conectado
                  </span>
                ) : inst.status === 'connecting' ? (
                  <span className="flex items-center gap-1 text-sm text-amber-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Conectando
                  </span>
                ) : (
                  <Button size="sm" onClick={() => handleConnect(inst.id)}>
                    <QrCode className="h-4 w-4 mr-1" />
                    Conectar
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => handleDelete(inst.id)}>
                  <Trash2 className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}