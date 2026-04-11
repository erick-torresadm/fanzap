'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, 
  Plus, 
  Play,
  Pause,
  Trash2,
  Edit,
  MessageSquare,
  X,
  Loader2,
  Send,
  GripVertical
} from 'lucide-react';

interface SequenceMessage {
  id: string;
  content: string;
  type: string;
  delay: number;
  mediaUrl?: string;
}

interface Sequence {
  id: string;
  name: string;
  instanceId: string;
  messages: SequenceMessage[];
  isActive: boolean;
}

export default function SequencesPage() {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSequence, setEditingSequence] = useState<Sequence | null>(null);
  const [instances, setInstances] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    instanceId: '',
    messages: [] as SequenceMessage[]
  });

  useEffect(() => {
    fetchSequences();
    fetchInstances();
  }, []);

  const fetchSequences = async () => {
    try {
      const res = await fetch('/api/sequences');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSequences(data.map((s: any) => ({
          ...s,
          isActive: s.is_active,
          instanceId: s.instance_name
        })));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstances = async () => {
    try {
      const res = await fetch('/api/instances');
      const data = await res.json();
      if (Array.isArray(data)) {
        setInstances(data.filter((i: any) => i.status === 'connected'));
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, instanceId: data[0].name }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openCreateModal = () => {
    setEditingSequence(null);
    setFormData({
      name: '',
      instanceId: instances[0]?.name || '',
      messages: [{ id: Date.now().toString(), content: '', type: 'text', delay: 60 }]
    });
    setShowModal(true);
  };

  const openEditModal = (seq: Sequence) => {
    setEditingSequence(seq);
    setFormData({
      name: seq.name,
      instanceId: seq.instanceId,
      messages: [...seq.messages]
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.instanceId || formData.messages.length === 0) return;

    const payload = {
      name: formData.name,
      instanceName: formData.instanceId,
      messages: formData.messages.map(m => ({
        content: m.content,
        type: m.type,
        delay: m.delay,
        mediaUrl: m.mediaUrl || null
      }))
    };

    try {
      if (editingSequence) {
        await fetch(`/api/sequences/${editingSequence.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/sequences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setShowModal(false);
      fetchSequences();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSequenceStatus = async (seq: Sequence) => {
    const newStatus = !seq.isActive;
    await fetch(`/api/sequences/${seq.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: newStatus })
    });
    setSequences(sequences.map(s => s.id === seq.id ? { ...s, isActive: newStatus } : s));
  };

  const deleteSequence = async (seq: Sequence) => {
    if (!confirm('Excluir sequência?')) return;
    await fetch(`/api/sequences/${seq.id}`, { method: 'DELETE' });
    setSequences(sequences.filter(s => s.id !== seq.id));
  };

  const addMessage = () => {
    setFormData(prev => ({
      ...prev,
      messages: [...prev.messages, { 
        id: Date.now().toString(), 
        content: '', 
        type: 'text', 
        delay: 60 
      }]
    }));
  };

  const updateMessage = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      messages: prev.messages.map(m => m.id === id ? { ...m, [field]: value } : m)
    }));
  };

  const removeMessage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      messages: prev.messages.filter(m => m.id !== id)
    }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-mono">Sequências</h1>
          <p className="text-[#6B7280]">Mensagens automatizadas em sequência</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Nova Sequência
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#6B7280]" />
        </div>
      ) : sequences.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-[#6B7280]" />
          </div>
          <h3 className="font-semibold mb-2">Nenhuma sequência</h3>
          <p className="text-sm text-[#6B7280] mb-6">Crie sua primeira sequência automatizada</p>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Criar Sequência
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sequences.map((seq) => (
            <div key={seq.id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#00D9FF]/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[#00D9FF]" />
                </div>
                <div>
                  <div className="font-medium">{seq.name}</div>
                  <div className="text-sm text-[#6B7280]">
                    {seq.messages.length} mensagem{seq.messages.length !== 1 ? 'ns' : ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  seq.isActive 
                    ? 'bg-[#00C853]/10 text-[#00C853]' 
                    : 'bg-[#1A1A1A] text-[#6B7280]'
                }`}>
                  {seq.isActive ? '● Ativo' : '○ Pausado'}
                </span>
                <button 
                  onClick={() => toggleSequenceStatus(seq)}
                  className={`p-2 rounded-lg transition-colors ${
                    seq.isActive 
                      ? 'text-[#FFB300] hover:bg-[#FFB300]/10' 
                      : 'text-[#00C853] hover:bg-[#00C853]/10'
                  }`}
                >
                  {seq.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => openEditModal(seq)}
                  className="p-2 rounded-lg text-[#6B7280] hover:bg-white/5"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteSequence(seq)}
                  className="p-2 rounded-lg text-[#6B7280] hover:text-[#FF3D00] hover:bg-[#FF3D00]/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold font-mono text-lg">
                {editingSequence ? 'Editar Sequência' : 'Nova Sequência'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#6B7280] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#6B7280] mb-2">Nome</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input"
                    placeholder="Ex: Nutrição de Leads"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#6B7280] mb-2">Instância</label>
                  <select
                    value={formData.instanceId}
                    onChange={(e) => setFormData(prev => ({ ...prev, instanceId: e.target.value }))}
                    className="input"
                    disabled={instances.length === 0}
                  >
                    {instances.length === 0 ? (
                      <option value="">Nenhuma instância conectada</option>
                    ) : (
                      instances.map((inst) => (
                        <option key={inst.name} value={inst.name}>
                          {inst.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm text-[#6B7280]">Mensagens</label>
                  <button onClick={addMessage} className="text-xs text-[#00D9FF] hover:underline">
                    + Adicionar mensagem
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.messages.map((msg, index) => (
                    <div key={msg.id} className="p-4 bg-[#0A0A0A] rounded-lg border border-[#1A1A1A]">
                      <div className="flex items-center gap-2 mb-3">
                        <GripVertical className="w-4 h-4 text-[#6B7280]" />
                        <span className="text-xs text-[#6B7280]">Mensagem {index + 1}</span>
                        {index > 0 && (
                          <div className="flex items-center gap-1 ml-auto">
                            <span className="text-xs text-[#6B7280]">Aguardar</span>
                            <input
                              type="number"
                              value={msg.delay}
                              onChange={(e) => updateMessage(msg.id, 'delay', parseInt(e.target.value))}
                              className="w-16 input text-center text-sm"
                              min={0}
                            />
                            <span className="text-xs text-[#6B7280]">seg</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <textarea
                          value={msg.content}
                          onChange={(e) => updateMessage(msg.id, 'content', e.target.value)}
                          className="input flex-1 resize-none"
                          rows={2}
                          placeholder="Digite a mensagem..."
                        />
                        <button
                          onClick={() => removeMessage(msg.id)}
                          className="p-2 text-[#6B7280] hover:text-[#FF3D00]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  disabled={!formData.name || !formData.instanceId || formData.messages.length === 0}
                  className="btn btn-primary disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}