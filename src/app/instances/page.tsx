'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Plus, 
  MoreVertical, 
  Trash2, 
  RefreshCw,
  QrCode,
  Phone,
  CheckCircle2,
  XCircle,
  Loader2,
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
}

export default function InstancesPage() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewInstance, setShowNewInstance] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState('');
  const [creating, setCreating] = useState(false);
  const [connectingInstance, setConnectingInstance] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<QRCodeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInstances = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/instances');
      if (!response.ok) throw new Error('Failed to fetch instances');
      const data = await response.json();
      setInstances(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar instâncias');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstances();
    const interval = setInterval(fetchInstances, 30000);
    return () => clearInterval(interval);
  }, [fetchInstances]);

  const handleCreateInstance = async () => {
    if (!newInstanceName.trim()) return;
    
    try {
      setCreating(true);
      const response = await fetch('/api/instances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newInstanceName }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create instance');
      }
      
      const newInstance = await response.json();
      setInstances([...instances, newInstance]);
      setNewInstanceName('');
      setShowNewInstance(false);
      
      await fetchInstances();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar instância');
    } finally {
      setCreating(false);
    }
  };

  const handleConnect = async (instanceName: string) => {
    try {
      setConnectingInstance(instanceName);
      const response = await fetch(`/api/instances/${instanceName}/qrcode`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get QR code');
      }
      
      const qrData = await response.json();
      setQrCode(qrData);
      
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/instances/${instanceName}`);
          if (statusRes.ok) {
            const instanceData = await statusRes.json();
            if (instanceData.status === 'connected') {
              clearInterval(pollInterval);
              setConnectingInstance(null);
              setQrCode(null);
              fetchInstances();
            }
          }
        } catch {
          clearInterval(pollInterval);
        }
      }, 5000);
      
      setTimeout(() => {
        clearInterval(pollInterval);
        setConnectingInstance(null);
      }, 120000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar');
      setConnectingInstance(null);
    }
  };

  const handleDisconnect = async (instanceName: string) => {
    try {
      const response = await fetch(`/api/instances/${instanceName}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete instance');
      }
      
      setInstances(instances.filter(i => i.id !== instanceName));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao desconectar');
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'connected') {
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    }
    if (status === 'connecting') {
      return <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />;
    }
    return <XCircle className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instâncias</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas conexões de WhatsApp
          </p>
        </div>
        <Button onClick={() => setShowNewInstance(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Instância
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive">
          {error}
        </div>
      )}

      {showNewInstance && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-lg">Criar Nova Instância</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Instância</label>
              <Input 
                placeholder="Ex: minha-empresa" 
                value={newInstanceName}
                onChange={(e) => setNewInstanceName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewInstance(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateInstance} disabled={creating || !newInstanceName.trim()}>
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {qrCode && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Escaneie o QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center py-4">
              {connectingInstance === 'connecting' ? (
                <div className="text-center space-y-4">
                  <div className="h-48 w-48 bg-muted rounded-lg flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  {qrCode.qrCode ? (
                    <img 
                      src={qrCode.qrCode} 
                      alt="QR Code" 
                      className="h-48 w-48 mx-auto border rounded-lg"
                    />
                  ) : (
                    <div className="h-48 w-48 bg-muted rounded-lg flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-muted-foreground" />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Escaneie com seu WhatsApp
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setQrCode(null)}>
                <XCircle className="mr-2 h-4 w-4" />
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : instances.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma instância</h3>
          <p className="text-muted-foreground mb-4">
            Crie sua primeira instância para começar
          </p>
          <Button onClick={() => setShowNewInstance(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Instância
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {instances.map((instance) => (
            <Card key={instance.id} className="overflow-hidden">
              <div className={`h-1 ${instance.status === 'connected' ? 'bg-emerald-500' : instance.status === 'connecting' ? 'bg-amber-500' : 'bg-muted'}`} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      instance.status === 'connected' 
                        ? 'bg-emerald-500/10' 
                        : 'bg-muted'
                    }`}>
                      <MessageSquare className={`h-5 w-5 ${
                        instance.status === 'connected' 
                          ? 'text-emerald-500' 
                          : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{instance.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {instance.phoneNumber || 'Não conectado'}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant={instance.status === 'connected' ? 'default' : 'secondary'}>
                    {instance.status === 'connected' ? (
                      <>
                        <Wifi className="h-3 w-3 mr-1" />
                        Conectada
                      </>
                    ) : instance.status === 'connecting' ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Conectando
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3 w-3 mr-1" />
                        Desconectada
                      </>
                    )}
                  </Badge>
                </div>
                
                {instance.status === 'connected' && (
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDisconnect(instance.id)}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Desconectar
                    </Button>
                  </div>
                )}
                
                {instance.status !== 'connected' && (
                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      className="w-full" 
                      onClick={() => handleConnect(instance.id)}
                      disabled={connectingInstance === instance.id}
                    >
                      {connectingInstance === instance.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Conectando...
                        </>
                      ) : (
                        <>
                          <QrCode className="h-4 w-4 mr-2" />
                          Conectar
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}