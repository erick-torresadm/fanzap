'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Zap, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Play,
  Pause,
  Edit,
  Copy,
  MessageSquare,
  GitBranch,
  Tag,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const mockTriggers = [
  {
    id: '1',
    name: 'Trigger "Quero comprar"',
    type: 'keyword',
    keyword: 'quero comprar',
    flow: 'Qualificação de leads',
    instance: 'Minha Empresa',
    status: 'active',
    activations: 156,
  },
  {
    id: '2',
    name: 'Trigger "Orçamento"',
    type: 'keyword',
    keyword: 'orcamento',
    flow: 'Follow-up orçamentos',
    instance: 'Vendas Principal',
    status: 'active',
    activations: 89,
  },
  {
    id: '3',
    name: 'Trigger "Ajuda"',
    type: 'any_message',
    keyword: '',
    flow: 'Suporte técnico',
    instance: 'Suporte',
    status: 'paused',
    activations: 234,
  },
];

export default function TriggersPage() {
  const [showNewTrigger, setShowNewTrigger] = useState(false);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gatilhos</h1>
          <p className="text-muted-foreground mt-1">
            Configure gatilhos para ativar seus fluxos automaticamente
          </p>
        </div>
        <Button onClick={() => setShowNewTrigger(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Gatilho
        </Button>
      </div>

      {showNewTrigger && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Gatilho</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Gatilho</label>
                <Input placeholder="Ex: Trigger Quero Comprar" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Gatilho</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keyword">Palavra-chave</SelectItem>
                    <SelectItem value="any_message">Qualquer mensagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Palavra-chave</label>
                <Input placeholder="Ex: quero comprar" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fluxo a Ativar</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um fluxo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Atendimento pós-venda</SelectItem>
                    <SelectItem value="2">Qualificação de leads</SelectItem>
                    <SelectItem value="3">Follow-up orçamentos</SelectItem>
                    <SelectItem value="4">Suporte técnico</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewTrigger(false)}>
                Cancelar
              </Button>
              <Button>
                <Zap className="h-4 w-4 mr-2" />
                Criar Gatilho
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="paused">Pausados</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockTriggers.map((trigger) => (
              <Card key={trigger.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-500" />
                        {trigger.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {trigger.type === 'keyword' ? (
                            <><Tag className="h-3 w-3 mr-1" /> {trigger.keyword}</>
                          ) : (
                            <><MessageSquare className="h-3 w-3 mr-1" /> Qualquer msg</>
                          )}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GitBranch className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{trigger.flow}</div>
                        <div className="text-xs text-muted-foreground">{trigger.instance}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <Badge variant={trigger.status === 'active' ? 'default' : 'secondary'}>
                        {trigger.status === 'active' ? (
                          <><CheckCircle2 className="h-3 w-3 mr-1" /> Ativo</>
                        ) : (
                          <><XCircle className="h-3 w-3 mr-1" /> Pausado</>
                        )}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {trigger.activations} ativações
                      </span>
                    </div>
                    
                    <div className="flex gap-1 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant={trigger.status === 'active' ? 'outline' : 'default'} 
                        size="sm"
                        className="flex-1"
                      >
                        {trigger.status === 'active' ? (
                          <><Pause className="h-3 w-3 mr-1" /> Pausar</>
                        ) : (
                          <><Play className="h-3 w-3 mr-1" /> Ativar</>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}