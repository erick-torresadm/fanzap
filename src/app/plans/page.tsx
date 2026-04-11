'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Check, 
  CheckCircle2, 
  X,
  Crown,
  Zap,
  Rocket,
  Building2,
  ArrowRight,
  Users,
  MessageSquare,
  GitBranch,
  Shield,
  HeadphonesIcon
} from 'lucide-react';

const plans = [
  {
    name: 'Gratuito',
    price: 'R$ 0',
    period: 'para sempre',
    description: 'Ideal para testar a plataforma',
    icon: Users,
    color: 'bg-muted',
    features: [
      { name: '1 instância WhatsApp', included: true },
      { name: '1 fluxo ativo', included: true },
      { name: '50 mensagens/mês', included: true },
      { name: 'Suporte pela comunidade', included: true },
      { name: 'Sequências de mensagens', included: false },
      { name: 'Gatilhos automáticos', included: false },
      { name: 'API access', included: false },
    ],
    cta: 'Começar Grátis',
    popular: false,
  },
  {
    name: 'Básico',
    price: 'R$ 97',
    period: '/mês',
    description: 'Para pequenos negócios que estão começando',
    icon: Zap,
    color: 'bg-amber-500/20',
    features: [
      { name: '3 instâncias WhatsApp', included: true },
      { name: '5 fluxos ativos', included: true },
      { name: '1.000 mensagens/mês', included: true },
      { name: 'Suporte por email', included: true },
      { name: 'Sequências de mensagens', included: true },
      { name: 'Gatilhos automáticos', included: true },
      { name: 'API access', included: false },
    ],
    cta: 'Escolher Básico',
    popular: true,
  },
  {
    name: 'Pro',
    price: 'R$ 297',
    period: '/mês',
    description: 'Para negócios que precisam escalar',
    icon: Rocket,
    color: 'bg-primary/20',
    features: [
      { name: '10 instâncias WhatsApp', included: true },
      { name: 'Fluxos ilimitados', included: true },
      { name: '10.000 mensagens/mês', included: true },
      { name: 'Suporte prioritário', included: true },
      { name: 'Sequências de mensagens', included: true },
      { name: 'Gatilhos automáticos', included: true },
      { name: 'API access', included: true },
    ],
    cta: 'Escolher Pro',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: 'Sob Consulta',
    period: '',
    description: 'Para grandes operações com necessidades específicas',
    icon: Building2,
    color: 'bg-violet-500/20',
    features: [
      { name: 'Instâncias ilimitadas', included: true },
      { name: 'Mensagens ilimitadas', included: true },
      { name: 'Fluxos ilimitados', included: true },
      { name: 'Suporte dedicado 24/7', included: true },
      { name: 'Sequências de mensagens', included: true },
      { name: 'Gatilhos automáticos', included: true },
      { name: 'API access completo', included: true },
      { name: 'Integrações customizadas', included: true },
      { name: 'SLA garantido', included: true },
    ],
    cta: 'Falar com Consultor',
    popular: false,
  },
];

const faqs = [
  {
    question: 'Posso mudar de plano a qualquer momento?',
    answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente e o valor é ajustado proporcionalmente.',
  },
  {
    question: 'O que acontece se ultrapassar o limite de mensagens?',
    answer: 'Quando você atinge 80% do limite, notificamos você. Se ultrapassar, o fluxo será pausado automaticamente até o próximo ciclo de cobrança.',
  },
  {
    question: 'Posso testar um plano pago antes de comprar?',
    answer: 'Sim! Oferecemos um período de teste de 7 dias para os planos Básico e Pro. Você pode experimentar todos os recursos sem compromisso.',
  },
  {
    question: 'Como funciona a conexão do WhatsApp?',
    answer: 'A conexão é feita via QR Code diretamente no painel. Cada instância permanece conectada e não precisa de revalidação periódica.',
  },
];

export default function PlansPage() {
  return (
    <div className="p-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-4">
          <Crown className="h-4 w-4 mr-2" />
          Planos e Preços
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Escolha o plano ideal para o seu negócio
        </h1>
        <p className="text-xl text-muted-foreground">
          Comece gratis e escale quando precisar. Sem compromisso.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative flex flex-col ${
              plan.popular 
                ? 'border-primary shadow-lg shadow-primary/10' 
                : 'hover:border-primary/50'
            } transition-all`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="px-4">
                  Mais Popular
                </Badge>
              </div>
            )}
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`h-10 w-10 rounded-xl ${plan.color} flex items-center justify-center`}>
                  <plan.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">{plan.period}</span>
                )}
              </div>
              <CardDescription className="mt-2">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={feature.included ? '' : 'text-muted-foreground'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="pt-4">
              <Button 
                className="w-full" 
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Separator />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Perguntas Frequentes</h2>
          <p className="text-muted-foreground">
            Tire suas dúvidas sobre planos e pagamentos
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="p-4 rounded-lg border">
              <div className="font-medium mb-2">{faq.question}</div>
              <div className="text-muted-foreground text-sm">{faq.answer}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-muted/50 p-8 md:p-12 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-muted-foreground mb-6">
            Fale com nossa equipe e encontre o melhor plano para o seu negócio
          </p>
          <Button size="lg">
            <HeadphonesIcon className="h-5 w-5 mr-2" />
            Falar com Consultor
          </Button>
        </div>
      </div>
    </div>
  );
}