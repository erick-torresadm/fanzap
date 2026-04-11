'use client';

import { 
  MessageSquare, 
  GitBranch, 
  Users,
  Send,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';

const stats = [
  { title: 'Mensagens Hoje', value: '0', icon: Send, color: '[#00D9FF]' },
  { title: 'Instâncias', value: '0', icon: MessageSquare, color: '[#00C853]' },
  { title: 'Fluxos Ativos', value: '0', icon: GitBranch, color: '[#FFB300]' },
  { title: 'Contatos', value: '0', icon: Users, color: '[#0F0F0F]' },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [instances, setInstances] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/instances')
      .then(res => res.json())
      .then(data => {
        setInstances(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const connectedCount = instances.filter((i: any) => i.status === 'connected').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-mono">Dashboard</h1>
        <p className="text-[#6B7280]">Visão geral da sua automação</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {stats.map((stat, i) => (
          <div key={stat.title} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">{stat.title}</p>
                <p className="text-3xl font-bold font-mono">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : i === 1 ? connectedCount : stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}/10 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Instâncias Recentes</h2>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#6B7280]" />
          </div>
        ) : instances.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#6B7280] mb-4">Nenhuma instância conectada</p>
            <a href="/instances" className="btn btn-primary btn-sm">
              Criar Instância
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {instances.slice(0, 5).map((inst: any) => (
              <div key={inst.id} className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${inst.status === 'connected' ? 'bg-[#00C853]' : 'bg-[#6B7280]'}`} />
                  <span className="font-medium">{inst.name}</span>
                </div>
                <span className="text-sm text-[#6B7280]">{inst.phoneNumber || '---'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}