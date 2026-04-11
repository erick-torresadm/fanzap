'use client';

import { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  MessageSquare,
  Clock,
  Zap,
  Save,
  Loader2,
  X,
  ChevronDown,
  ChevronRight,
  Send
} from 'lucide-react';

interface FlowNode {
  id: string;
  type: 'trigger' | 'message' | 'wait' | 'condition';
  data: {
    label: string;
    message?: string;
    waitSeconds?: number;
    condition?: string;
  };
  position?: { x: number; y: number };
}

interface Flow {
  id: string;
  name: string;
  status: 'active' | 'paused';
  instance: string;
  nodes: FlowNode[];
  isActive?: boolean;
}

const nodeTypes = [
  { type: 'trigger', label: 'Gatilho', icon: Zap, color: '#FFB300', desc: 'Inicia o fluxo' },
  { type: 'message', label: 'Mensagem', icon: MessageSquare, color: '#00D9FF', desc: 'Envia mensagem' },
  { type: 'wait', label: 'Aguardar', icon: Clock, color: '#00C853', desc: 'Espera X segundos' },
  { type: 'condition', label: 'Condição', icon: GitBranch, color: '#FF3D00', desc: 'Verifica condição' },
];

export default function FlowsPage() {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingFlow, setEditingFlow] = useState<Flow | null>(null);
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [instances, setInstances] = useState<any[]>([]);
  const [selectedInstance, setSelectedInstance] = useState('');
  const [newFlowName, setNewFlowName] = useState('');

  useEffect(() => {
    fetchFlows();
    fetchInstances();
  }, []);

  const fetchFlows = async () => {
    try {
      const res = await fetch('/api/flows');
      const data = await res.json();
      if (Array.isArray(data)) {
        setFlows(data.map((f: any) => ({
          ...f,
          status: f.is_active ? 'active' : 'paused',
          instance: f.instance_name
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
        if (data.length > 0) setSelectedInstance(data[0].name);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createFlow = async () => {
    if (!newFlowName || !selectedInstance) return;
    
    const newFlow: Flow = {
      id: Date.now().toString(),
      name: newFlowName,
      status: 'paused',
      instance: selectedInstance,
      nodes: [{ id: '1', type: 'trigger', data: { label: 'Início', condition: 'any' }, position: { x: 0, y: 0 } }]
    };

    try {
      await fetch('/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFlowName,
          instanceName: selectedInstance,
          nodes: newFlow.nodes,
          edges: [],
        })
      });
      setFlows([...flows, newFlow]);
      setShowModal(false);
      setNewFlowName('');
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFlowStatus = async (flow: Flow) => {
    const newStatus: 'active' | 'paused' = flow.status === 'active' ? 'paused' : 'active';
    const updatedFlows = flows.map(f => f.id === flow.id ? { ...f, status: newStatus } : f);
    setFlows(updatedFlows);
    
    try {
      await fetch(`/api/flows/${flow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus === 'active' })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteFlow = async (flow: Flow) => {
    if (!confirm('Excluir fluxo?')) return;
    setFlows(flows.filter(f => f.id !== flow.id));
    try {
      await fetch(`/api/flows/${flow.id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  const openEditor = (flow: Flow) => {
    setEditingFlow(flow);
    setNodes(flow.nodes.length > 0 ? flow.nodes : [
      { id: '1', type: 'trigger', data: { label: 'Início', condition: 'any' }, position: { x: 0, y: 0 } }
    ]);
    setShowEditor(true);
  };

  const addNode = (type: FlowNode['type']) => {
    const nodeInfo = nodeTypes.find(n => n.type === type);
    const newNode: FlowNode = {
      id: Date.now().toString(),
      type,
      data: {
        label: nodeInfo?.label || 'Nó',
        message: type === 'message' ? '' : undefined,
        waitSeconds: type === 'wait' ? 5 : undefined,
        condition: type === 'condition' ? '' : undefined,
      },
      position: { x: 0, y: nodes.length * 80 }
    };
    setNodes([...nodes, newNode]);
  };

  const updateNode = (id: string, field: string, value: any) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n));
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const saveFlow = async () => {
    if (!editingFlow) return;
    
    const updatedFlow = { ...editingFlow, nodes };
    setFlows(flows.map(f => f.id === editingFlow.id ? updatedFlow : f));
    
    try {
      await fetch(`/api/flows/${editingFlow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes: nodes })
      });
    } catch (e) {
      console.error(e);
    }
    
    setShowEditor(false);
  };

  const getNodeIcon = (type: string) => {
    const node = nodeTypes.find(n => n.type === type);
    return node?.icon || GitBranch;
  };

  const getNodeColor = (type: string) => {
    return nodeTypes.find(n => n.type === type)?.color || '#6B7280';
  };

  return (
    <div className="p-8 h-[calc(100vh-64px)] overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-mono">Fluxos</h1>
          <p className="text-[#6B7280]">Crie automações para suas instâncias</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Novo Fluxo
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#6B7280]" />
        </div>
      ) : flows.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-[#00D9FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <GitBranch className="w-8 h-8 text-[#00D9FF]" />
          </div>
          <h3 className="font-semibold mb-2">Nenhum fluxo</h3>
          <p className="text-sm text-[#6B7280] mb-6">Crie seu primeiro fluxo de automação</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Criar Fluxo
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {flows.map((flow) => (
            <div key={flow.id} className="card hover:border-[#00D9FF]/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00D9FF]/10 rounded-lg flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-[#00D9FF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{flow.name}</h3>
                    <p className="text-xs text-[#6B7280]">{flow.instance}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-[#1A1A1A]">
                <span className={`text-xs ${flow.status === 'active' ? 'text-[#00C853]' : 'text-[#6B7280]'}`}>
                  {flow.status === 'active' ? '● Ativo' : '○ Pausado'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFlowStatus(flow)}
                    className={`p-2 rounded-lg transition-colors ${flow.status === 'active' ? 'text-[#FFB300] hover:bg-[#FFB300]/10' : 'text-[#00C853] hover:bg-[#00C853]/10'}`}
                    title={flow.status === 'active' ? 'Pausar' : 'Ativar'}
                  >
                    {flow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEditor(flow)}
                    className="p-2 rounded-lg text-[#6B7280] hover:bg-white/5 hover:text-white"
                    title="Editar"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteFlow(flow)}
                    className="p-2 rounded-lg text-[#6B7280] hover:text-[#FF3D00] hover:bg-[#FF3D00]/10"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold font-mono text-lg">Novo Fluxo</h3>
              <button onClick={() => setShowModal(false)} className="text-[#6B7280] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#6B7280] mb-2">Nome do Fluxo</label>
                <input
                  type="text"
                  value={newFlowName}
                  onChange={(e) => setNewFlowName(e.target.value)}
                  className="input"
                  placeholder="Ex: Atendimento"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6B7280] mb-2">Instância</label>
                <select
                  value={selectedInstance}
                  onChange={(e) => setSelectedInstance(e.target.value)}
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
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancelar</button>
                <button onClick={createFlow} disabled={!newFlowName || !selectedInstance} className="btn btn-primary disabled:opacity-50">
                  <Plus className="w-4 h-4" />
                  Criar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditor && editingFlow && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1A1A1A]">
              <div>
                <h3 className="font-bold font-mono text-lg">{editingFlow.name}</h3>
                <p className="text-xs text-[#6B7280]">{editingFlow.instance}</p>
              </div>
              <button onClick={() => setShowEditor(false)} className="text-[#6B7280] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 flex gap-2 flex-wrap">
              {nodeTypes.map((node) => (
                <button
                  key={node.type}
                  onClick={() => addNode(node.type as FlowNode['type'])}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#00D9FF]/50 transition-colors"
                >
                  <node.icon className="w-4 h-4" style={{ color: node.color }} />
                  <span className="text-sm">{node.label}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {nodes.map((node, index) => {
                const Icon = getNodeIcon(node.type);
                return (
                  <div key={node.id} className="p-4 bg-[#0A0A0A] rounded-lg border border-[#1A1A1A]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${getNodeColor(node.type)}20` }}>
                        <Icon className="w-4 h-4" style={{ color: getNodeColor(node.type) }} />
                      </div>
                      <span className="font-medium text-sm">{node.data.label}</span>
                      {index > 0 && <ChevronRight className="w-4 h-4 text-[#6B7280]" />}
                    </div>

                    {node.type === 'trigger' && (
                      <div>
                        <label className="text-xs text-[#6B7280]">Condição de ativação</label>
                        <select
                          value={node.data.condition || 'any'}
                          onChange={(e) => updateNode(node.id, 'condition', e.target.value)}
                          className="input mt-1"
                        >
                          <option value="any">Qualquer mensagem</option>
                          <option value="contains:ola">Contém "olá"</option>
                          <option value="equals:oi">Exatamente "oi"</option>
                        </select>
                      </div>
                    )}

                    {node.type === 'message' && (
                      <textarea
                        value={node.data.message || ''}
                        onChange={(e) => updateNode(node.id, 'message', e.target.value)}
                        className="input mt-2"
                        rows={2}
                        placeholder="Digite a mensagem..."
                      />
                    )}

                    {node.type === 'wait' && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-[#6B7280]">Aguardar</span>
                        <input
                          type="number"
                          value={node.data.waitSeconds || 5}
                          onChange={(e) => updateNode(node.id, 'waitSeconds', parseInt(e.target.value))}
                          className="input w-20"
                          min={1}
                        />
                        <span className="text-sm text-[#6B7280]">segundos</span>
                      </div>
                    )}

                    {node.type === 'condition' && (
                      <input
                        value={node.data.condition || ''}
                        onChange={(e) => updateNode(node.id, 'condition', e.target.value)}
                        className="input mt-2"
                        placeholder="Condição (ex: contains:palavra)"
                      />
                    )}

                    <div className="flex justify-end mt-2">
                      <button onClick={() => removeNode(node.id)} className="text-xs text-[#6B7280] hover:text-[#FF3D00]">
                        Remover
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#1A1A1A]">
              <button onClick={() => setShowEditor(false)} className="btn btn-secondary">Cancelar</button>
              <button onClick={saveFlow} className="btn btn-primary">
                <Save className="w-4 h-4" />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}