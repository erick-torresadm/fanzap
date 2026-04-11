'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  GitBranch, 
  Clock, 
  Zap, 
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const stats = [
  {
    title: 'Mensagens Hoje',
    value: '247',
    change: '+12.5%',
    changeType: 'positive',
    icon: MessageSquare,
  },
  {
    title: 'Fluxos Ativos',
    value: '8',
    change: '+2',
    changeType: 'positive',
    icon: GitBranch,
  },
  {
    title: 'Contatos Atendidos',
    value: '156',
    change: '+8.2%',
    changeType: 'positive',
    icon: Users,
  },
  {
    title: 'Taxa de Conversão',
    value: '23%',
    change: '-2.1%',
    changeType: 'negative',
    icon: TrendingUp,
  },
];

const recentFlows = [
  { name: 'Atendimento pós-venda', status: 'active', executions: 45 },
  { name: 'Qualificação de leads', status: 'active', executions: 32 },
  { name: 'Follow-up orçamentos', status: 'paused', executions: 18 },
  { name: 'Suporte técnico', status: 'active', executions: 67 },
];

const instances = [
  { name: 'Minha Empresa', phone: '+55 11 99999-0000', status: 'connected', messages: 123 },
  { name: 'Vendas Principal', phone: '+55 11 98888-0000', status: 'connected', messages: 89 },
];

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral da sua automação de WhatsApp
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className={stat.changeType === 'positive' ? 'text-emerald-500' : 'text-destructive'}>
                  {stat.changeType === 'positive' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </span>
                <span>vs último mês</span>
              </p>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Fluxos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFlows.map((flow) => (
                <div key={flow.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <GitBranch className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{flow.name}</p>
                      <p className="text-sm text-muted-foreground">{flow.executions} execuções</p>
                    </div>
                  </div>
                  <Badge variant={flow.status === 'active' ? 'default' : 'secondary'}>
                    {flow.status === 'active' ? 'Ativo' : 'Pausado'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Instâncias Conectadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {instances.map((instance) => (
                <div key={instance.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium">{instance.name}</p>
                      <p className="text-sm text-muted-foreground">{instance.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="border-emerald-500 text-emerald-600">
                      {instance.status === 'connected' ? 'Conectada' : 'Desconectada'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{instance.messages} msgs</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Ativações de Hoje</CardTitle>
            <Badge variant="outline">24 ativações</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Gráfico de ativações em desenvolvimento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}