'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Library, LayoutDashboard, History, Settings, Palette } from 'lucide-react';
import { useState } from 'react';
import SettingsModal from './SettingsModal';
import { cn } from '@/lib/utils';

export default function GlobalSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Projects', href: '/story-hacker', icon: Library },
    { name: 'Publisher', href: '/story-hacker/publisher', icon: Book },
    { name: 'Book Themes', href: '/story-hacker/themes', icon: Palette },
    { name: 'Templates', href: '/story-hacker/templates', icon: LayoutDashboard },
    { name: 'Automations', href: '/story-hacker/automations', icon: History },
    { name: 'Settings', href: '#', icon: Settings, isAction: true },
  ];

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="w-full h-16 border-b border-[#1f1f1f] bg-[#121212] flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center">
        <Book className="w-6 h-6 text-amber-500 mr-2 shrink-0" />
        <h1 className="text-xl font-black text-white tracking-tight shrink-0 hidden sm:block">Story Hacker</h1>
      </div>
      <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-full no-scrollbar">
        {navItems.map((item) => {
          // If pathname starts with the item href, check if it's active.
          // For Projects, we only match exact /story-hacker or sub-projects.
          const isProjects = item.href === '/story-hacker';
          const isActive = isProjects 
            ? (pathname === '/story-hacker' || pathname?.startsWith('/story-hacker/projects'))
            : (pathname === item.href && !item.isAction);
          const Icon = item.icon;
          
          if (item.isAction && item.name === 'Settings') {
            return (
              <button 
                key={item.name} 
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition text-slate-400 hover:text-white hover:bg-[#1f1f1f] shrink-0"
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            );
          }

          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition shrink-0",
                isActive 
                  ? 'bg-amber-500/10 text-amber-500 font-semibold' 
                  : 'text-slate-400 hover:text-white hover:bg-[#1f1f1f]'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </header>
  );
}
