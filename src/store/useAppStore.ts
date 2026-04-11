import { create } from 'zustand';
import type { WhatsAppInstance, Flow, MessageSequence, Trigger } from '@/lib/types';

interface AppState {
  instances: WhatsAppInstance[];
  flows: Flow[];
  sequences: MessageSequence[];
  triggers: Trigger[];
  
  addInstance: (instance: WhatsAppInstance) => void;
  updateInstance: (id: string, data: Partial<WhatsAppInstance>) => void;
  removeInstance: (id: string) => void;
  
  addFlow: (flow: Flow) => void;
  updateFlow: (id: string, data: Partial<Flow>) => void;
  removeFlow: (id: string) => void;
  
  addSequence: (sequence: MessageSequence) => void;
  updateSequence: (id: string, data: Partial<MessageSequence>) => void;
  removeSequence: (id: string) => void;
  
  addTrigger: (trigger: Trigger) => void;
  updateTrigger: (id: string, data: Partial<Trigger>) => void;
  removeTrigger: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  instances: [],
  flows: [],
  sequences: [],
  triggers: [],
  
  addInstance: (instance) =>
    set((state) => ({ instances: [...state.instances, instance] })),
  updateInstance: (id, data) =>
    set((state) => ({
      instances: state.instances.map((i) => (i.id === id ? { ...i, ...data } : i)),
    })),
  removeInstance: (id) =>
    set((state) => ({
      instances: state.instances.filter((i) => i.id !== id),
    })),
  
  addFlow: (flow) =>
    set((state) => ({ flows: [...state.flows, flow] })),
  updateFlow: (id, data) =>
    set((state) => ({
      flows: state.flows.map((f) => (f.id === id ? { ...f, ...data } : f)),
    })),
  removeFlow: (id) =>
    set((state) => ({ flows: state.flows.filter((f) => f.id !== id) })),
  
  addSequence: (sequence) =>
    set((state) => ({ sequences: [...state.sequences, sequence] })),
  updateSequence: (id, data) =>
    set((state) => ({
      sequences: state.sequences.map((s) => (s.id === id ? { ...s, ...data } : s)),
    })),
  removeSequence: (id) =>
    set((state) => ({ sequences: state.sequences.filter((s) => s.id !== id) })),
  
  addTrigger: (trigger) =>
    set((state) => ({ triggers: [...state.triggers, trigger] })),
  updateTrigger: (id, data) =>
    set((state) => ({
      triggers: state.triggers.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),
  removeTrigger: (id) =>
    set((state) => ({ triggers: state.triggers.filter((t) => t.id !== id) })),
}));