'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  GitBranch, 
  Clock, 
  Zap, 
  Settings,
  Users,
  Menu,
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

export function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-[#0F0F0F] rounded-lg flex items-center justify-center shadow-lg"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-[#E5E7EB]">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#0F0F0F]"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}