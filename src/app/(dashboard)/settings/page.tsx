'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <CardTitle className="text-lg mb-4">Perfil</CardTitle>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Nome</Label>
              <Input placeholder="Seu nome" />
            </div>
            <div>
              <Label className="text-sm">Email</Label>
              <Input placeholder="seu@email.com" type="email" />
            </div>
            <Button>Salvar</Button>
          </div>
        </Card>

        <Card className="p-6">
          <CardTitle className="text-lg mb-4">API Key</CardTitle>
          <p className="text-sm text-gray-500 mb-4">
            Configure a chave da Evolution API nas variáveis de ambiente do Vercel.
          </p>
          <div className="p-3 bg-gray-50 rounded text-sm font-mono">
            EVOLUTION_API_KEY
          </div>
        </Card>
      </div>
    </div>
  );
}