'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  User, 
  Bell, 
  CreditCard, 
  Shield, 
  Key,
  Save,
  CheckCircle2,
  AlertCircle,
  Crown,
  Zap,
  Users,
  MessageSquare,
  GitBranch
} from 'lucide-react';

const currentPlan = {
  name: 'Básico',
  price: 97,
  instances: 3,
  flows: 5,
  messages: 1000,
  used: {
    instances: 2,
    flows: 3,
    messages: 456
  }
};

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas configurações de conta e preferências
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            Conta
          </TabsTrigger>
          <TabsTrigger value="plan">
            <Crown className="h-4 w-4 mr-2" />
            Plano
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" defaultValue="João Silva" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="joao@exemplo.com" type="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" defaultValue="Minha Empresa Ltda" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue="+55 11 99999-0000" />
                </div>
                <Button onClick={handleSave}>
                  {saved ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Salvo!
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Gerencie suas chaves de API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Chave de API Atual</Label>
                  <div className="flex gap-2">
                    <Input 
                      value="sk_live_xxxxxxxxxxxxxxxxxxxxx" 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button variant="outline">Copiar</Button>
                  </div>
                </div>
                <Button variant="outline">
                  <Key className="h-4 w-4 mr-2" />
                  Gerar Nova Chave
                </Button>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-amber-700">
                    Mantenha sua chave de API em segurança
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plan">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Plano Atual</CardTitle>
                    <CardDescription>
                      Você está no plano {currentPlan.name}
                    </CardDescription>
                  </div>
                  <Badge className="text-lg px-4 py-1">
                    R$ {currentPlan.price}/mês
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Instâncias</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {currentPlan.used.instances}/{currentPlan.instances}
                    </div>
                    <div className="h-2 mt-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${(currentPlan.used.instances / currentPlan.instances) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Fluxos</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {currentPlan.used.flows}/{currentPlan.flows === -1 ? '∞' : currentPlan.flows}
                    </div>
                    <div className="h-2 mt-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: currentPlan.flows === -1 ? '30%' : `${(currentPlan.used.flows / currentPlan.flows) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Mensagens</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {currentPlan.used.messages}/{currentPlan.messages === -1 ? '∞' : currentPlan.messages}
                    </div>
                    <div className="h-2 mt-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: currentPlan.messages === -1 ? '10%' : `${(currentPlan.used.messages / currentPlan.messages) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atualizar Plano</CardTitle>
                <CardDescription>
                  Escolha um plano que atenda melhor suas necessidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className={`p-4 rounded-lg border ${currentPlan.name === 'Gratuito' ? 'ring-2 ring-primary' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5" />
                      <span className="font-semibold">Gratuito</span>
                    </div>
                    <div className="text-2xl font-bold mb-2">R$ 0</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 1 instância</li>
                      <li>• 1 fluxo</li>
                      <li>• 50 msgs/mês</li>
                    </ul>
                    <Button className="w-full mt-4" variant="outline" disabled>
                      Atual
                    </Button>
                  </div>
                  <div className={`p-4 rounded-lg border ${currentPlan.name === 'Básico' ? 'ring-2 ring-primary' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5" />
                      <span className="font-semibold">Básico</span>
                    </div>
                    <div className="text-2xl font-bold mb-2">R$ 97</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 3 instâncias</li>
                      <li>• 5 fluxos</li>
                      <li>• 1.000 msgs/mês</li>
                    </ul>
                    <Button className="w-full mt-4" variant="outline" disabled>
                      Atual
                    </Button>
                  </div>
                  <div className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-5 w-5 text-amber-500" />
                      <span className="font-semibold">Pro</span>
                    </div>
                    <div className="text-2xl font-bold mb-2">R$ 297</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 10 instâncias</li>
                      <li>• Fluxos ilimitados</li>
                      <li>• 10.000 msgs/mês</li>
                    </ul>
                    <Button className="w-full mt-4">
                      Atualizar
                    </Button>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4 inline mr-2" />
                  Integração com Stripe Coming Soon
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>
                Configure como você recebe notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Notificações por Email</div>
                    <div className="text-sm text-muted-foreground">
                      Receba atualizações importantes por email
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Alertas de Instância</div>
                    <div className="text-sm text-muted-foreground">
                      Seja notificado quando uma instância desconectar
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Relatórios Semanais</div>
                    <div className="text-sm text-muted-foreground">
                      Receba um resumo semanal das estatísticas
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Senha</CardTitle>
                <CardDescription>
                  Atualize sua senha de acesso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>
                  <Shield className="h-4 w-4 mr-2" />
                  Alterar Senha
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Autenticação em Dois Fatores</CardTitle>
                <CardDescription>
                  Adicione uma camada extra de segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">2FA Ativado</div>
                    <div className="text-sm text-muted-foreground">
                      Sua conta está protegida
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Gerenciar</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}