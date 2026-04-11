export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string; config?: Record<string, unknown> };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Flow {
  id: string;
  name: string;
  description?: string;
  instanceId: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const flowsStore = new Map<string, Flow>();

export function generateId() {
  return Math.random().toString(36).substring(2, 15);
}