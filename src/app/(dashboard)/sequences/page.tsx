'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  Plus, 
  Play,
  Pause,
  Trash2,
  Edit
} from 'lucide-react';

interface Sequence {
  id: string;
  name: string;
  messages: number;
  status: 'active' | 'paused';
}

const mockSequences: Sequence[] = [
  { id: '1', name: 'Nutrição de Leads', messages: 5, status: 'active' },
  { id: '2', name: 'Follow-up Orçamento', messages: 3, status: 'paused' },
];

export default function SequencesPage() {
  const [sequences] = useState(mockSequences);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sequências</h1>
          <p className="text-gray-500 text-sm">Mensagens automatizadas</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova
        </Button>
      </div>

      {sequences.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhuma sequência</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sequences.map((seq) => (
            <Card key={seq.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">{seq.name}</div>
                  <div className="text-sm text-gray-500">{seq.messages} mensagens</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  seq.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {seq.status === 'active' ? 'Ativo' : 'Pausado'}
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