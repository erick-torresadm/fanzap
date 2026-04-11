'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  GitBranch, 
  Clock, 
  Zap, 
  Settings,
  Users,
  Send,
  LogOut,
  User
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/instances', icon: MessageSquare, label: 'Instâncias' },
  { href: '/flows', icon: GitBranch, label: 'Fluxos' },
  { href: '/sequences', icon: Clock, label: 'Sequências' },
  { href: '/triggers', icon: Zap, label: 'Gatilhos' },
  { href: '/teste', icon: Send, label: 'Teste' },
  { href: '/settings', icon: Settings, label: 'Configurações' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-gray-200 p-4 flex flex-col">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold font-mono text-[#00D9FF]">FANZAP</h1>
        <p className="text-xs text-gray-500">WhatsApp Automation</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive 
                  ? 'bg-[#00D9FF]/10 text-[#00D9FF]' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="pt-4 border-t border-gray-200 mt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 w-full px-2 py-2 rounded-lg hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
        <p className="text-xs text-gray-400 px-2 mt-2">v1.0.0</p>
      </div>
    </aside>
  );
}