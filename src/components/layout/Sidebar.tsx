'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  GitBranch, 
  Clock, 
  Zap, 
  Settings,
  Users,
  X
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/instances', icon: MessageSquare, label: 'Instâncias' },
  { href: '/flows', icon: GitBranch, label: 'Fluxos' },
  { href: '/sequences', icon: Clock, label: 'Sequências' },
  { href: '/triggers', icon: Zap, label: 'Gatilhos' },
  { href: '/plans', icon: Users, label: 'Planos' },
  { href: '/settings', icon: Settings, label: 'Configurações' },
];

export function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <aside className="w-60 bg-white border-r border-[#E5E7EB] flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-[#E5E7EB]">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0F0F0F] rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold font-mono">F</span>
            </div>
            <span className="font-bold font-mono text-[#0F0F0F]">Fanzap</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#0F0F0F] text-white'
                    : 'text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#0F0F0F]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#E5E7EB]">
          <div className="p-3 bg-[#FAFAFA] rounded-lg">
            <p className="text-xs text-[#6B7280] mb-2">Plano Atual</p>
            <p className="text-sm font-semibold">Básico</p>
            <p className="text-xs text-[#6B7280]">R$ 97/mês</p>
          </div>
        </div>
      </aside>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}