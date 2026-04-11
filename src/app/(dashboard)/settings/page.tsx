'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Eye, EyeOff, Loader2, Check, Plus, Trash2, QrCode, Wifi, WifiOff } from 'lucide-react';

interface ApiSettings {
  apiUrl: string;
  apiKey: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Instance {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'connecting';
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<ApiSettings>({ apiUrl: '', apiKey: '' });
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userCookie = document.cookie.split('fanzap_user=')[1];
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split(';')[0]));
        setUser(userData);
      } catch (e) {
        console.error('Error parsing user cookie:', e);
      }
    }
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.apiUrl) {
        setSettings({ apiUrl: data.apiUrl, apiKey: data.apiKey });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...settings })
      });
    } catch (e) {
      console.error(e);
    }
    
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#6B7280]" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-[#00D9FF]/10 rounded-xl flex items-center justify-center">
          <Settings className="w-6 h-6 text-[#00D9FF]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-mono">Configurações</h1>
          <p className="text-[#6B7280]">Configure sua Evolution API</p>
        </div>
      </div>

      <div className="card space-y-6">
        <div className="p-4 bg-[#0A0A0A] rounded-lg border border-[#1A1A1A]">
          <h3 className="font-semibold mb-1">Usuário</h3>
          <p className="text-sm text-[#6B7280]">{user?.name} ({user?.email})</p>
        </div>

        <div>
          <label className="block text-sm text-[#6B7280] mb-2">URL da Evolution API</label>
          <input
            type="url"
            value={settings.apiUrl}
            onChange={(e) => setSettings(prev => ({ ...prev, apiUrl: e.target.value }))}
            className="input"
            placeholder="https://api.sua-empresa.com.br"
          />
        </div>

        <div>
          <label className="block text-sm text-[#6B7280] mb-2">API Key</label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={settings.apiKey}
              onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
              className="input pr-10"
              placeholder="Sua API key"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !settings.apiUrl || !settings.apiKey}
          className="btn btn-primary w-full"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saved ? 'Salvo!' : 'Salvar Configurações'}
        </button>
      </div>

      <div className="mt-6 p-4 bg-[#0A0A0A] rounded-lg border border-[#1A1A1A]">
        <h3 className="font-semibold mb-2">Como obter suas credenciais:</h3>
        <ol className="text-sm text-[#6B7280] space-y-2">
          <li>1. Hospede sua própria Evolution API</li>
          <li>2. Acesse Configurações → API Keys</li>
          <li>3. Crie uma nova chave</li>
          <li>4. Copie a URL e a API Key aqui</li>
        </ol>
      </div>
    </div>
  );
}