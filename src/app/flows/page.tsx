'use client';

import { useState, useCallback } from 'react';
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
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  MessageSquare,
  GitBranch,
  Clock,
  Zap,
  Webhook,
  Play,
  Save,
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  Copy,
  ToggleLeft,
  ToggleRight,
  X,
  Check,
  Settings,
  AlertCircle
} from 'lucide-react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  MarkerType,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const mockFlows = [
  {
    id: '1',
    name: 'Atendimento pós-venda',
    description: 'Fluxo de follow-up após venda',
    status: 'active',
    executions: 45,
    instance: 'Minha Empresa',
    updatedAt: '2 horas atrás'
  },
  {
    id: '2',
    name: 'Qualificação de leads',
    description: 'Captura e qualificação de novos leads',
    status: 'active',
    executions: 32,
    instance: 'Vendas Principal',
    updatedAt: '1 dia atrás'
  },
  {
    id: '3',
    name: 'Follow-up orçamentos',
    description: 'Lembretes de orçamentos enviados',
    status: 'paused',
    executions: 18,
    instance: 'Minha Empresa',
    updatedAt: '3 dias atrás'
  },
];

const nodeTypes = [
  { 
    type: 'start', 
    label: 'Início', 
    icon: Play,
    color: 'bg-emerald-500',
    description: 'Ponto de partida do fluxo'
  },
  { 
    type: 'message', 
    label: 'Mensagem', 
    icon: MessageSquare,
    color: 'bg-primary',
    description: 'Enviar mensagem ao cliente'
  },
  { 
    type: 'condition', 
    label: 'Condição', 
    icon: GitBranch,
    color: 'bg-amber-500',
    description: 'Avaliar condição e bifurcar'
  },
  { 
    type: 'delay', 
    label: 'Atraso', 
    icon: Clock,
    color: 'bg-violet-500',
    description: 'Aguardar antes de continuar'
  },
  { 
    type: 'webhook', 
    label: 'Webhook', 
    icon: Webhook,
    color: 'bg-cyan-500',
    description: 'Chamar API externa'
  },
  { 
    type: 'end', 
    label: 'Fim', 
    icon: Zap,
    color: 'bg-destructive',
    description: 'Encerrar o fluxo'
  },
];

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    position: { x: 250, y: 50 },
    data: { label: 'Início' },
  },
  {
    id: '2',
    position: { x: 100, y: 200 },
    data: { label: 'Enviar boas-vindas' },
  },
  {
    id: '3',
    position: { x: 400, y: 200 },
    data: { label: 'Aguardar resposta' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e1-3', source: '1', target: '3', markerEnd: { type: MarkerType.ArrowClosed } },
];

function FlowNode({ data }: { data: { label: string } }) {
  return (
    <div className="px-4 py-3 bg-card border-2 border-primary rounded-lg shadow-lg min-w-[150px]">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <span className="font-medium text-sm">{data.label}</span>
      </div>
    </div>
  );
}

const nodeTypesMap: NodeTypes = {
  default: FlowNode,
};

export default function FlowsPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showNewFlow, setShowNewFlow] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges],
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  };

  return (
    <div className="h-[calc(100vh-2rem)]">
      <Tabs defaultValue="list" className="h-full flex flex-col">
        <div className="flex items-center justify-between px-8 py-4 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fluxos</h1>
            <p className="text-muted-foreground mt-1">
              Crie e gerencie suas automações
            </p>
          </div>
          <TabsList>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="builder">Editor</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="flex-1 m-0 p-8 overflow-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input placeholder="Buscar fluxos..." className="max-w-md" />
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="paused">Pausados</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Instância" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="1">Minha Empresa</SelectItem>
                  <SelectItem value="2">Vendas Principal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockFlows.map((flow) => (
                <Card key={flow.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{flow.name}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {flow.description}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>{flow.instance}</span>
                      <span>•</span>
                      <span>{flow.updatedAt}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={flow.status === 'active' ? 'default' : 'secondary'}>
                          {flow.status === 'active' ? 'Ativo' : 'Pausado'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {flow.executions} exec
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Duplicar</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Excluir</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="builder" className="flex-1 m-0">
          <ResizablePanelGroup orientation="horizontal" className="h-full">
            <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  <div className="text-sm font-medium text-muted-foreground mb-3">
                    Nós Disponíveis
                  </div>
                  <div className="space-y-2">
                    {nodeTypes.map((node) => (
                      <TooltipProvider key={node.type}>
                        <Tooltip>
                          <TooltipTrigger>
                            <button
                              className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted hover:border-primary/50 transition-all text-left"
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('application/reactflow', node.type);
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                            >
                              <div className={`h-8 w-8 rounded-lg ${node.color} flex items-center justify-center`}>
                                <node.icon className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{node.label}</div>
                                <div className="text-xs text-muted-foreground">{node.description}</div>
                              </div>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{node.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </ResizablePanel>

            <ResizableHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

            <ResizablePanel defaultSize={60}>
              <div className="h-full">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypesMap}
                  fitView
                  attributionPosition="bottom-left"
                >
                  <Controls className="bg-card border rounded-lg" />
                  <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
                </ReactFlow>
              </div>
            </ResizablePanel>

            <ResizableHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Propriedades</div>
                    {selectedNode && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedNode(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {selectedNode ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nome do Node</label>
                        <Input placeholder="Nome" defaultValue={nodes.find(n => n.id === selectedNode)?.data.label as string} />
                      </div>
                      
                      {selectedNode === '2' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Mensagem</label>
                            <textarea 
                              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              placeholder="Digite sua mensagem..."
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Tipo de Mídia</label>
                            <Select defaultValue="text">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Texto</SelectItem>
                                <SelectItem value="image">Imagem</SelectItem>
                                <SelectItem value="audio">Áudio</SelectItem>
                                <SelectItem value="video">Vídeo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                      
                      {selectedNode === '3' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Condição</label>
                            <Select defaultValue="contains">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="contains">Contém</SelectItem>
                                <SelectItem value="equals">Igual a</SelectItem>
                                <SelectItem value="startswith">Começa com</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Valor</label>
                            <Input placeholder="Palavra-chave" />
                          </div>
                        </>
                      )}
                      
                      {selectedNode === '4' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Aguardar</label>
                          <div className="flex gap-2">
                            <Input type="number" placeholder="30" className="w-20" />
                            <Select defaultValue="minutes">
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="seconds">Segundos</SelectItem>
                                <SelectItem value="minutes">Minutos</SelectItem>
                                <SelectItem value="hours">Horas</SelectItem>
                                <SelectItem value="days">Dias</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      
                      <Button className="w-full">
                        <Check className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Selecione um node para editar suas propriedades
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>
      </Tabs>
    </div>
  );
}