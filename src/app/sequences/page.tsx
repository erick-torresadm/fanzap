'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Clock, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Play,
  Pause,
  Edit,
  Copy,
  MessageSquare,
  Send,
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-react';

const mockSequences = [
  {
    id: '1',
    name: 'Nutrição de Leads',
    description: 'Sequência de 5 mensagens para nutrir novos leads',
    instance: 'Minha Empresa',
    status: 'active',
    messages: 5,
    sent: 234,
    pending: 45,
    failed: 3,
  },
  {
    id: '2',
    name: 'Follow-up Orçamento',
    description: 'Lembretes após envio de orçamento',
    instance: 'Vendas Principal',
    status: 'active',
    messages: 3,
    sent: 89,
    pending: 12,
    failed: 1,
  },
  {
    id: '3',
    name: 'Boas-vindas',
    description: 'Mensagem de boas-vindas para novos contatos',
    instance: 'Suporte',
    status: 'paused',
    messages: 2,
    sent: 0,
    pending: 0,
    failed: 0,
  },
];

const mockMessages = [
  { id: '1', content: 'Olá! Obrigado por entrar em contato. Como posso ajudar?', delay: 0, type: 'text' },
  { id: '2', content: 'Temos diversas opções que podem atender sua necessidade...', delay: 60, type: 'text' },
  { id: '3', content: 'Posso agendar uma call para apresentar melhor?', delay: 120, type: 'text' },
];

export default function SequencesPage() {
  const [selectedSequence, setSelectedSequence] = useState<string | null>(null);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sequências</h1>
          <p className="text-muted-foreground mt-1">
            Crie sequências de mensagens automáticas
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Sequência
        </Button>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Todas as Sequências</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockSequences.map((sequence) => (
              <Card key={sequence.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{sequence.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {sequence.description}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {sequence.messages} msgs
                    </span>
                    <span>•</span>
                    <span>{sequence.instance}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <div className="text-lg font-bold text-emerald-600">{sequence.sent}</div>
                      <div className="text-xs text-muted-foreground">Enviadas</div>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <div className="text-lg font-bold text-amber-600">{sequence.pending}</div>
                      <div className="text-xs text-muted-foreground">Pendentes</div>
                    </div>
                    <div className="p-2 rounded-lg bg-destructive/10">
                      <div className="text-lg font-bold text-destructive">{sequence.failed}</div>
                      <div className="text-xs text-muted-foreground">Falhas</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant={sequence.status === 'active' ? 'default' : 'secondary'}>
                      {sequence.status === 'active' ? (
                        <><Play className="h-3 w-3 mr-1" /> Ativa</>
                      ) : (
                        <><Pause className="h-3 w-3 mr-1" /> Pausada</>
                      )}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="editor">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome da Sequência</label>
                  <Input placeholder="Ex: Nutrição de Leads" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea placeholder="Descrição da sequência..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Instância</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma instância" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Minha Empresa</SelectItem>
                      <SelectItem value="2">Vendas Principal</SelectItem>
                      <SelectItem value="3">Suporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium"> Gatilho de Início</label>
                  <Select defaultValue="manual">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Iniciar manualmente</SelectItem>
                      <SelectItem value="keyword">Palavra-chave</SelectItem>
                      <SelectItem value="new_contact">Novo contato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Mensagens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMessages.map((msg, index) => (
                    <div key={msg.id} className="flex gap-4 p-4 rounded-lg border bg-card">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        {index < mockMessages.length - 1 && (
                          <div className="flex-1 w-0.5 bg-border" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Mensagem {index + 1}</span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {msg.delay === 0 ? 'Imediato' : `${msg.delay} min`}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{msg.content}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Mensagem
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}