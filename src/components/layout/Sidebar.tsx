'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
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
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 bg-white border-r flex flex-col">
        <div className="h-14 flex items-center px-4 border-b">
          <Link href="/dashboard" className="font-bold text-lg">
            Fanzap
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}