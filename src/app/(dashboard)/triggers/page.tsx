'use client';

import { useState, useEffect } from 'react';
import { 
  Zap, 
  Plus, 
  Play,
  Pause,
  Trash2,
  Edit,
  X,
  Loader2,
  Send
} from 'lucide-react';

interface Trigger {
  id: string;
  name: string;
  keyword: string;
  instanceId: string;
  targetType: string;
  targetId: string;
  isActive: boolean;
}

export default function TriggersPage() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null);
  const [flows, setFlows] = useState<any[]>([]);
  const [sequences, setSequences] = useState<any[]>([]);
  const [instances, setInstances] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    keyword: '',
    instanceName: '',
    targetType: 'flow' as 'flow' | 'sequence',
    targetId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [triggersRes, flowsRes, seqsRes, instRes] = await Promise.all([
        fetch('/api/triggers'),
        fetch('/api/flows'),
        fetch('/api/sequences'),
        fetch('/api/instances')
      ]);
      
      const triggersData = await triggersRes.json();
      const flowsData = await flowsRes.json();
      const seqsData = await seqsRes.json();
      const instData = await instRes.json();
      
      if (Array.isArray(triggersData)) setTriggers(triggersData.map((t: any) => ({
        ...t,
        isActive: t.is_active,
        instanceId: t.instance_name,
        targetType: t.target_type,
        targetId: t.target_id
      })));
      if (Array.isArray(flowsData)) setFlows(flowsData.map((f: any) => ({
        ...f,
        instanceId: f.instance_name,
        isActive: f.is_active
      })));
      if (Array.isArray(seqsData)) setSequences(seqsData.map((s: any) => ({
        ...s,
        instanceId: s.instance_name,
        isActive: s.is_active
      })));
      if (Array.isArray(instData)) {
        setInstances(instData.filter((i: any) => i.status === 'connected'));
        if (instData.length > 0) {
          setFormData(prev => ({ ...prev, instanceName: instData[0].name }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTrigger(null);
    setFormData({
      name: '',
      keyword: '',
      instanceName: instances[0]?.name || '',
      targetType: 'flow',
      targetId: flows.length > 0 ? flows[0].id : (sequences.length > 0 ? sequences[0].id : '')
    });
    setShowModal(true);
  };

  const openEditModal = (trigger: Trigger) => {
    setEditingTrigger(trigger);
    setFormData({
      name: trigger.name,
      keyword: trigger.keyword,
      instanceName: trigger.instanceId,
      targetType: trigger.targetType as 'flow' | 'sequence',
      targetId: trigger.targetId
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.instanceName || !formData.targetId) return;

    try {
      if (editingTrigger) {
        await fetch(`/api/triggers/${editingTrigger.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch('/api/triggers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTriggerStatus = async (trigger: Trigger) => {
    try {
      await fetch(`/api/triggers/${trigger.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !trigger.isActive })
      });
      setTriggers(triggers.map(t => t.id === trigger.id ? { ...t, isActive: !t.isActive } : t));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTrigger = async (trigger: Trigger) => {
    if (!confirm('Excluir gatilho?')) return;
    try {
      await fetch(`/api/triggers/${trigger.id}`, { method: 'DELETE' });
      setTriggers(triggers.filter(t => t.id !== trigger.id));
    } catch (e) {
      console.error(e);
    }
  };

  const getTargetName = (trigger: Trigger) => {
    if (trigger.targetType === 'flow') {
      const flow = flows.find(f => f.id === trigger.targetId);
      return flow?.name || 'Fluxo não encontrado';
    }
    if (trigger.targetType === 'sequence') {
      const seq = sequences.find(s => s.id === trigger.targetId);
      return seq?.name || 'Sequência não encontrada';
    }
    return 'Nenhum';
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-mono">Gatilhos</h1>
          <p className="text-gray-500">Ative fluxos por palavra-chave</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Novo Gatilho
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : triggers.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="font-semibold mb-2">Nenhum gatilho</h3>
          <p className="text-sm text-gray-500 mb-6">Crie gatilhos para ativar fluxos automaticamente</p>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Criar Gatilho
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {triggers.map((trigger) => (
            <div key={trigger.id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium">{trigger.name}</div>
                  <div className="text-sm text-gray-500">
                    <span className="text-[#00D9FF]">"{trigger.keyword}"</span> 
                    {' → '} {getTargetName(trigger)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  trigger.isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {trigger.isActive ? '● Ativo' : '○ Pausado'}
                </span>
                <button 
                  onClick={() => toggleTriggerStatus(trigger)}
                  className={`p-2 rounded-lg transition-colors ${
                    trigger.isActive 
                      ? 'text-yellow-600 hover:bg-yellow-100' 
                      : 'text-green-600 hover:bg-green-100'
                  }`}
                >
                  {trigger.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => openEditModal(trigger)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteTrigger(trigger)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
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
          <div className="card w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold font-mono text-lg">
                {editingTrigger ? 'Editar Gatilho' : 'Novo Gatilho'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input"
                  placeholder="Ex: Quero comprar"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Palavra-chave</label>
                <input
                  type="text"
                  value={formData.keyword}
                  onChange={(e) => setFormData(prev => ({ ...prev, keyword: e.target.value }))}
                  className="input"
                  placeholder="Ex: quero comprar"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Instância</label>
                <select
                  value={formData.instanceName}
                  onChange={(e) => setFormData(prev => ({ ...prev, instanceName: e.target.value }))}
                  className="input"
                  disabled={instances.length === 0}
                >
                  {instances.length === 0 ? (
                    <option value="">Nenhuma instância conectada</option>
                  ) : (
                    instances.map((inst) => (
                      <option key={inst.name} value={inst.name}>{inst.name}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Tipo de alvo</label>
                <select
                  value={formData.targetType}
                  onChange={(e) => {
                    const type = e.target.value as 'flow' | 'sequence';
                    const list = type === 'flow' ? flows : sequences;
                    setFormData(prev => ({ 
                      ...prev, 
                      targetType: type,
                      targetId: list.length > 0 ? list[0].id : ''
                    }));
                  }}
                  className="input"
                >
                  <option value="flow">Fluxo</option>
                  <option value="sequence">Sequência</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {formData.targetType === 'flow' ? 'Selecione o Fluxo' : 'Selecione a Sequência'}
                </label>
                <select
                  value={formData.targetId}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetId: e.target.value }))}
                  className="input"
                  disabled={(formData.targetType === 'flow' && flows.length === 0) || (formData.targetType === 'sequence' && sequences.length === 0)}
                >
                  {formData.targetType === 'flow' ? (
                    flows.length === 0 ? (
                      <option value="">Nenhum fluxo disponível</option>
                    ) : (
                      flows.map(flow => (
                        <option key={flow.id} value={flow.id}>{flow.name}</option>
                      ))
                    )
                  ) : (
                    sequences.length === 0 ? (
                      <option value="">Nenhuma sequência disponível</option>
                    ) : (
                      sequences.map(seq => (
                        <option key={seq.id} value={seq.id}>{seq.name}</option>
                      ))
                    )
                  )}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  disabled={!formData.name || !formData.instanceName || !formData.targetId}
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