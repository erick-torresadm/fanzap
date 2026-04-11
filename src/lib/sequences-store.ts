export interface SequenceMessage {
  id: string;
  content: string;
  type: string;
  delay: number;
  mediaUrl?: string;
}

export interface Sequence {
  id: string;
  name: string;
  instanceId: string;
  flowId?: string;
  messages: SequenceMessage[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const sequencesStore = new Map<string, Sequence>();

export function generateId() {
  return Math.random().toString(36).substring(2, 15);
}