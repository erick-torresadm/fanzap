'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  GitBranch, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit,
  Copy,
  Play,
  Pause,
  Loader2
} from 'lucide-react';

interface Flow {
  id: string;
  name: string;
  status: 'active' | 'paused';
  instance: string;
}

const mockFlows: Flow[] = [
  { id: '1', name: 'Atendimento', status: 'active', instance: 'Minha Empresa' },
  { id: '2', name: 'Qualificação', status: 'active', instance: 'Vendas' },
];

export default function FlowsPage() {
  const [flows, setFlows] = useState(mockFlows);
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Fluxos</h1>
          <p className="text-gray-500 text-sm">Crie automações</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Fluxo
        </Button>
      </div>

      {flows.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <GitBranch className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhum fluxo criado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {flows.map((flow) => (
            <Card key={flow.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <GitBranch className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">{flow.name}</div>
                  <div className="text-sm text-gray-500">{flow.instance}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  flow.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {flow.status === 'active' ? 'Ativo' : 'Pausado'}
                </span>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
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