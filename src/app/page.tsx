'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  GitBranch, 
  Clock, 
  Zap, 
  Users,
  ArrowRight,
  CheckCircle2,
  Layers,
  MessageCircle,
  Play,
  BarChart3,
  Shield,
  Rocket,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: GitBranch,
    title: 'Flow Builder Visual',
    description: 'Crie automações arrastando e soltando.',
  },
  {
    icon: MessageCircle,
    title: 'Múltiplas Instâncias',
    description: 'Conecte vários números de WhatsApp.',
  },
  {
    icon: Clock,
    title: 'Sequências',
    description: 'Agende mensagens com intervalos.',
  },
  {
    icon: Zap,
    title: 'Gatilhos',
    description: 'Ative fluxos por palavra-chave.',
  },
];

const plans = [
  {
    name: 'Gratuito',
    price: 'R$ 0',
    features: ['1 instância', '1 fluxo', '50 msgs/mês'],
  },
  {
    name: 'Básico',
    price: 'R$ 97',
    features: ['3 instâncias', '5 fluxos', '1.000 msgs/mês'],
  },
  {
    name: 'Pro',
    price: 'R$ 297',
    features: ['10 instâncias', 'Fluxos ilimitados', '10.000 msgs/mês'],
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">Fanzap</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">
              Recursos
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
              Planos
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Começar</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Automação de WhatsApp
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Crie fluxos de atendimento e vendas com arrastar e soltar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg">
                Criar Conta
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Recursos</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <feature.icon className="h-6 w-6 mb-2 text-gray-900" />
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Planos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className="border">
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="text-2xl font-bold">{plan.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="text-sm text-gray-600 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-gray-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4">Escolher</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center text-sm text-gray-500">
          © 2026 Fanzap. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}