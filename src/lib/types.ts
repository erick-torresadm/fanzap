export type InstanceStatus = 'connected' | 'disconnected' | 'connecting';

export interface WhatsAppInstance {
  id: string;
  name: string;
  phoneNumber: string;
  status: InstanceStatus;
  createdAt: Date;
  lastActive?: Date;
  avatar?: string;
}

export interface FlowNode {
  id: string;
  type: 'start' | 'message' | 'condition' | 'delay' | 'webhook' | 'end';
  position: { x: number; y: number };
  data: {
    label: string;
    config?: Record<string, unknown>;
  };
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
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageSequence {
  id: string;
  name: string;
  instanceId: string;
  flowId?: string;
  messages: {
    content: string;
    delay: number;
    type: 'text' | 'image' | 'audio' | 'video';
  }[];
  isActive: boolean;
}

export interface Trigger {
  id: string;
  name: string;
  type: 'keyword' | 'any_message';
  keyword?: string;
  flowId: string;
  instanceId: string;
  isActive: boolean;
}

export type PlanType = 'free' | 'basic' | 'pro' | 'enterprise';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  instances: number;
  flows: number;
  messagesPerMonth: number;
  features: string[];
}