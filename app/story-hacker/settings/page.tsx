'use client';

import GlobalSidebar from '@/components/story-hacker/GlobalSidebar';
import { Book, Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans flex">
      <GlobalSidebar />
      <main className="flex-1 flex flex-col">
        <header className="md:hidden border-b border-[#1f1f1f] bg-[#121212] h-16 flex items-center px-4">
          <Book className="w-6 h-6 text-amber-500 mr-2" />
          <h1 className="text-xl font-black text-white tracking-tight">Story Hacker</h1>
        </header>

        <div className="p-8 lg:p-12 max-w-7xl w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white">Settings</h2>
            <p className="text-slate-400 mt-2 text-sm">Manage your Story Hacker preferences and integrations.</p>
          </div>
          
          <div className="border border-[#1f1f1f] border-dashed rounded-3xl p-16 text-center bg-[#121212]">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#2a2a2a]">
              <Settings className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
            <p className="text-slate-400 max-w-sm mx-auto">
              API key configurations and model preferences will be available in a future update.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
