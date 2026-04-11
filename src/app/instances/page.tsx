'use client';

import { useState } from 'react';
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
  Loader2
} from 'lucide-react';

const mockInstances = [
  { 
    id: '1', 
    name: 'Minha Empresa', 
    phone: '+55 11 99999-0000', 
    status: 'connected' as const,
    messages: 1234,
    lastActive: '2 min atrás'
  },
  { 
    id: '2', 
    name: 'Vendas Principal', 
    phone: '+55 11 98888-0000', 
    status: 'connected' as const,
    messages: 856,
    lastActive: '5 min atrás'
  },
  { 
    id: '3', 
    name: 'Suporte', 
    phone: '+55 11 97777-0000', 
    status: 'disconnected' as const,
    messages: 0,
    lastActive: 'há 2 dias'
  },
];

export default function InstancesPage() {
  const [instances, setInstances] = useState(mockInstances);
  const [showNewInstance, setShowNewInstance] = useState(false);
  const [connectingInstance, setConnectingInstance] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setConnectingInstance(id);
    setTimeout(() => {
      setConnectingInstance(null);
      setInstances(instances.map(i => 
        i.id === id ? { ...i, status: 'connected' as const } : i
      ));
    }, 3000);
  };

  const handleDisconnect = (id: string) => {
    setInstances(instances.map(i => 
      i.id === id ? { ...i, status: 'disconnected' as const } : i
    ));
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

      {showNewInstance && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-lg">Conectar Nova Instância</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Instância</label>
              <Input placeholder="Ex: Minha Empresa" />
            </div>
            <div className="flex justify-center py-8">
              <div className="text-center space-y-4">
                <div className="h-48 w-48 bg-muted rounded-lg flex items-center justify-center mx-auto">
                  <QrCode className="h-24 w-24 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Escaneie o QR Code com seu WhatsApp
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Aguardando conexão...</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewInstance(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {instances.map((instance) => (
          <Card key={instance.id} className="overflow-hidden">
            <div className={`h-1 ${instance.status === 'connected' ? 'bg-emerald-500' : 'bg-muted'}`} />
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
                      {instance.phone}
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
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Conectada
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Desconectada
                    </>
                  )}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {instance.status === 'connected' ? 'Online agora' : instance.lastActive}
                </span>
              </div>
              {instance.status === 'connected' && (
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Mensagens: </span>
                    <span className="font-medium">{instance.messages}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDisconnect(instance.id)}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reconectar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
              {instance.status === 'disconnected' && (
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
    </div>
  );
}