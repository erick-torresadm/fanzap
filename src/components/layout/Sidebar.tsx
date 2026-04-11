'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  GitBranch, 
  Clock, 
  Zap, 
  Settings,
  Users,
  ChevronDown,
  LogOut,
  User
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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

        <div className="p-3 border-t border-[#E5E7EB]" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#FAFAFA] transition-colors"
          >
            <div className="w-9 h-9 bg-[#0F0F0F] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Usuário</p>
              <p className="text-xs text-[#6B7280]">Plano Básico</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {userMenuOpen && (
            <div className="absolute bottom-20 left-4 right-4 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-2 z-50">
              <div className="px-3 py-2 border-b border-[#E5E7EB] mb-2">
                <p className="text-sm font-medium">Usuário</p>
                <p className="text-xs text-[#6B7280]">usuario@fanzap.com</p>
              </div>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 text-sm text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#0F0F0F]"
              >
                <Settings className="w-4 h-4" />
                Configurações
              </Link>
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 text-sm text-[#FF3D00] hover:bg-[#FF3D00]/5"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Link>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}