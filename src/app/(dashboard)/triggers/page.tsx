'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Zap, 
  Plus, 
  Play,
  Pause,
  Trash2,
  Edit
} from 'lucide-react';

interface Trigger {
  id: string;
  name: string;
  keyword: string;
  flow: string;
  status: 'active' | 'paused';
}

const mockTriggers: Trigger[] = [
  { id: '1', name: 'Quero comprar', keyword: 'quero comprar', flow: 'Qualificação', status: 'active' },
  { id: '2', name: 'Orçamento', keyword: 'orcamento', flow: 'Follow-up', status: 'active' },
];

export default function TriggersPage() {
  const [triggers] = useState(mockTriggers);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gatilhos</h1>
          <p className="text-gray-500 text-sm">Ative fluxos por palavra-chave</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo
        </Button>
      </div>

      {triggers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhum gatilho</p>
        </div>
      ) : (
        <div className="space-y-3">
          {triggers.map((trigger) => (
            <Card key={trigger.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">{trigger.name}</div>
                  <div className="text-sm text-gray-500">"{trigger.keyword}" → {trigger.flow}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  trigger.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {trigger.status === 'active' ? 'Ativo' : 'Pausado'}
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