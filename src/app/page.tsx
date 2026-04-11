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
  Zap as ZapIcon,
  Layers,
  MessageCircle,
  Play,
  BarChart3,
  Shield,
  Rocket
} from 'lucide-react';

const features = [
  {
    icon: GitBranch,
    title: 'Flow Builder Visual',
    description: 'Crie automações arrastando e soltando. Conexões visuais entre nodes para fluxos complexos.',
  },
  {
    icon: MessageCircle,
    title: 'Múltiplas Instâncias',
    description: 'Conecte vários números de WhatsApp. Cada instância com suas próprias automações.',
  },
  {
    icon: Clock,
    title: 'Sequências de Mensagens',
    description: 'Agende mensagens com intervalos personalizados. Nutra seus leads automaticamente.',
  },
  {
    icon: Zap,
    title: 'Gatilhos Inteligentes',
    description: 'Ative fluxos quando o cliente enviar palavras-chave ou mensagens.',
  },
  {
    icon: Play,
    title: 'Automação Completa',
    description: 'Condições, delays, webhooks e mais. Controle total do seu atendimento.',
  },
  {
    icon: BarChart3,
    title: 'Estatísticas em Tempo Real',
    description: 'Acompanhe mensagens enviadas, recebidas e conversions do seu negócio.',
  },
];

const plans = [
  {
    name: 'Gratuito',
    price: 'R$ 0',
    description: 'Para testar a plataforma',
    features: [
      '1 instância WhatsApp',
      '1 fluxo ativo',
      '50 mensagens/mês',
      'Suporte comunidade',
    ],
    cta: 'Começar Grátis',
    popular: false,
  },
  {
    name: 'Básico',
    price: 'R$ 97',
    period: '/mês',
    description: 'Para pequenos negócios',
    features: [
      '3 instâncias WhatsApp',
      '5 fluxos ativos',
      '1.000 mensagens/mês',
      'Suporte por email',
    ],
    cta: 'Escolher Básico',
    popular: true,
  },
  {
    name: 'Pro',
    price: 'R$ 297',
    period: '/mês',
    description: 'Para escalar seu negócio',
    features: [
      '10 instâncias WhatsApp',
      'Fluxos ilimitados',
      '10.000 mensagens/mês',
      'Suporte prioritário',
      'API access',
    ],
    cta: 'Escolher Pro',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: 'Sob Consulta',
    description: 'Para grandes operações',
    features: [
      'Instâncias ilimitadas',
      'Mensagens ilimitadas',
      'Dedicated support',
      'Custom integrations',
      'SLA garantido',
    ],
    cta: 'Falar com Consultor',
    popular: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
              F
            </div>
            <span className="text-xl font-bold tracking-tight">Fanzap</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Planos
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              Sobre
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Começar Agora</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-8">
            <Badge variant="outline" className="px-4 py-1.5 text-sm">
              <ZapIcon className="w-4 h-4 mr-2 text-amber-500" />
              Automação de WhatsApp sem complicação
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              Sua automação de WhatsApp em um{' '}
              <span className="text-primary">clique</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Crie fluxos de atendimento e vendas com arrastar e soltar. 
              Conecte seus números e deixe a automação trabalhar por você.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-base">
                  Criar Minha Conta
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Ver Demonstração
              </Button>
            </div>
          </div>

          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <div className="rounded-2xl border bg-card p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-sm text-muted-foreground">Flow Builder</span>
              </div>
              <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-4 p-8">
                  {[...Array(24)].map((_, i) => (
                    <div key={i} className="border border-dashed border-muted-foreground/20 rounded-lg" />
                  ))}
                </div>
                <div className="relative z-10 text-center p-8">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="h-16 w-16 rounded-2xl bg-primary/20 border-2 border-primary flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-primary" />
                    </div>
                    <div className="h-0.5 w-16 bg-primary" />
                    <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                      <Zap className="h-8 w-8 text-emerald-500" />
                    </div>
                    <div className="h-0.5 w-16 bg-emerald-500" />
                    <div className="h-16 w-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center">
                      <GitBranch className="h-8 w-8 text-amber-500" />
                    </div>
                  </div>
                  <p className="text-muted-foreground">Visualização do Flow Builder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Tudo que você precisa
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas completas para automatizar seu atendimento e vendas no WhatsApp
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 border-muted/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Planos para cada etapa
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para o seu negócio. Comece grátis e escale quando precisar.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para automatizar seu WhatsApp?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Comece gratis e experimente todos os recursos. Sem compromisso.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="h-12 px-8 text-base">
              Criar Conta Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                F
              </div>
              <span className="text-lg font-bold">Fanzap</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Fanzap. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}