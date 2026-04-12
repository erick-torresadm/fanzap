'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, RefreshCw, MessageSquare } from 'lucide-react';

export default function PollPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const poll = async () => {
    try {
      const res = await fetch('/api/messages/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instanceName: 'erickfandim', lastMessageId: lastId })
      });
      const data = await res.json();
      
      if (data.messages?.length > 0) {
        setMessages(prev => [...data.messages, ...prev].slice(0, 20));
        setLastId(data.messages[0].id);
        console.log('📩 Nova mensagem:', data.messages[0].message?.conversation);
      }
    } catch (e) {
      console.error('Poll error:', e);
    }
  };

  useEffect(() => {
    poll();
    intervalRef.current = setInterval(poll, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [lastId]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-mono">Polling WhatsApp</h1>
          <p className="text-[#6B7280]">Monitorando mensagens em tempo real</p>
        </div>
        <div className="flex gap-2">
          <span className="badge badge-success animate-pulse">
            <span className="w-2 h-2 bg-[#00C853] rounded-full mr-2" />
            Ativo (5s)
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {messages.length === 0 ? (
          <div className="card text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#6B7280]" />
            <p className="text-[#6B7280]">Aguardando mensagens...</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="card">
              <div className="flex items-center gap-2">
                <span>{String(m.key?.fromMe ? '📤' : '📥')}</span>
                <span className="text-sm text-[#6B7280]">{m.pushName || m.key?.remoteJid}</span>
              </div>
              <p className="mt-1">{m.message?.conversation || m.message?.extendedTextMessage?.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}