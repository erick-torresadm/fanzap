'use client';

import Link from 'next/link';
import { 
  MessageSquare, 
  GitBranch, 
  Clock, 
  Zap, 
  ArrowRight,
  Check,
  Zap as ZapIcon
} from 'lucide-react';

const features = [
  { icon: GitBranch, title: 'Flow Builder Visual', desc: 'Crie automações com arrastar e soltar' },
  { icon: MessageSquare, title: 'Múltiplas Instâncias', desc: 'Conecte vários números de WhatsApp' },
  { icon: Clock, title: 'Sequências', desc: 'Agende mensagens com intervalos' },
  { icon: Zap, title: 'Gatilhos', desc: 'Ative fluxos por palavra-chave' },
];

const plans = [
  { name: 'Gratuito', price: 'R$ 0', features: ['1 instância', '1 fluxo', '50 msgs/mês'] },
  { name: 'Básico', price: 'R$ 97', features: ['3 instâncias', '5 fluxos', '1.000 msgs/mês'], popular: true },
  { name: 'Pro', price: 'R$ 297', features: ['10 instâncias', 'Fluxos ilimitados', '10.000 msgs/mês'] },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#151515]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#1A1A1A]">
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00D9FF] rounded flex items-center justify-center">
              <span className="text-[#0F0F0F] font-bold font-mono">F</span>
            </div>
            <span className="text-lg font-bold font-mono tracking-tight text-white">Fanzap</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-[#6B7280] hover:text-white transition-colors">Recursos</a>
            <a href="#pricing" className="text-[#6B7280] hover:text-white transition-colors">Planos</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-[#6B7280] hover:text-white transition-colors">Entrar</Link>
            <Link href="/dashboard" className="btn btn-primary btn-sm">Começar</Link>
          </div>
        </div>
      </header>

      <section className="pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00D9FF]/10 text-[#00D9FF] text-xs font-medium rounded-full mb-6 border border-[#00D9FF]/20">
            <ZapIcon className="w-3 h-3" />
            Automação de WhatsApp
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-mono tracking-tight mb-6 leading-tight text-white">
            Sua automação de<br />
            <span className="text-[#00D9FF]">WhatsApp</span> simplificada
          </h1>
          <p className="text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto">
            Crie fluxos de atendimento e vendas com arrastar e soltar. 
            Conecte seus números e deixe a automação trabalhar por você.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="btn btn-primary text-base px-8 py-3">
              Criar Conta Grátis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-[#0F0F0F]/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold font-mono text-center mb-12 text-white">Recursos Principais</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card flex items-start gap-4 hover:border-[#00D9FF]/50 transition-all duration-300 group bg-[#0F0F0F] border-[#1A1A1A]">
                <div className="w-12 h-12 bg-[#00D9FF]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#00D9FF]/20 transition-colors">
                  <f.icon className="w-5 h-5 text-[#00D9FF]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">{f.title}</h3>
                  <p className="text-sm text-[#6B7280]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-6 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold font-mono text-center mb-4 text-white">Planos e Preços</h2>
          <p className="text-[#6B7280] text-center mb-12">Escolha o ideal para seu negócio</p>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={`card relative bg-[#0F0F0F] border-[#1A1A1A] ${plan.popular ? 'border-[#00D9FF] ring-1 ring-[#00D9FF]/30' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-medium bg-[#00D9FF] text-[#0F0F0F] px-3 py-1 rounded-full">
                      Mais популярний
                    </span>
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-2 text-white">{plan.name}</h3>
                <div className="text-3xl font-bold font-mono mb-4 text-white">
                  {plan.price}
                  {plan.price !== 'R$ 0' && <span className="text-sm font-normal text-[#6B7280]">/mês</span>}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="text-sm text-[#6B7280] flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#00C853]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
                  {plan.price === 'R$ 0' ? 'Grátis' : 'Escolher'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-[#1A1A1A]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#00D9FF] rounded flex items-center justify-center">
              <span className="text-[#0F0F0F] text-xs font-bold font-mono">F</span>
            </div>
            <span className="text-sm font-mono text-white">Fanzap</span>
          </div>
          <p className="text-sm text-[#6B7280]">© 2026 Fanzap. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}