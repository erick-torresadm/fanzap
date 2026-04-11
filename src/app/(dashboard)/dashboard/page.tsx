'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  GitBranch, 
  Users,
  TrendingUp
} from 'lucide-react';

const stats = [
  { title: 'Mensagens Hoje', value: '247', icon: MessageSquare },
  { title: 'Fluxos Ativos', value: '8', icon: GitBranch },
  { title: 'Contatos', value: '156', icon: Users },
  { title: 'Conversão', value: '23%', icon: TrendingUp },
];

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className="h-5 w-5 text-gray-400" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="font-medium mb-4">Instâncias Conectadas</h2>
        <p className="text-gray-500 text-sm">
          Nenhuma instância conectada ainda. 
          <a href="/instances" className="text-blue-600 hover:underline"> Conectar agora</a>
        </p>
      </Card>
    </div>
  );
}