'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Library, LayoutDashboard, History, Settings, Palette } from 'lucide-react';
import { useState } from 'react';
import SettingsModal from './SettingsModal';

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
    <aside className="w-64 border-r border-[#1f1f1f] bg-[#121212] flex flex-col hidden md:flex shrink-0 min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-[#1f1f1f]">
        <Book className="w-6 h-6 text-amber-500 mr-2" />
        <h1 className="text-xl font-black text-white tracking-tight">Story Hacker</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href && !item.isAction;
          const Icon = item.icon;
          
          if (item.isAction && item.name === 'Settings') {
            return (
              <button 
                key={item.name} 
                onClick={() => setIsSettingsOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition text-slate-400 hover:text-white hover:bg-[#1f1f1f]"
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </button>
            );
          }

          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition ${
                isActive 
                  ? 'bg-amber-500/10 text-amber-500' 
                  : 'text-slate-400 hover:text-white hover:bg-[#1f1f1f]'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#1f1f1f]">
        <Link href="/dashboard" className="text-xs text-slate-500 hover:text-amber-500 transition">
          &larr; Back to Dashboard
        </Link>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </aside>
  );
}
