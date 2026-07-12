'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Loader2 } from 'lucide-react';
import GlobalSidebar from '@/components/story-hacker/GlobalSidebar';

interface Project {
  _id: string;
  title: string;
  description: string;
  isArchived?: boolean;
}

export default function PublisherPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/story/projects')
      .then(res => res.json())
      .then(data => {
        if (data.projects) {
          setProjects(data.projects.filter((p: Project) => !p.isArchived));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans flex">
      <GlobalSidebar />

      <main className="flex-1 flex flex-col p-8 lg:p-12">
        <div className="max-w-5xl w-full mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-amber-500" />
              Publisher
            </h2>
            <p className="text-slate-400 mt-2 text-sm">Select a book project to format and export to PDF or EPUB.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 bg-[#121212] border border-[#1f1f1f] rounded-2xl">
              <p className="text-slate-400">No active projects found. Create a project first!</p>
              <Link href="/story-hacker" className="text-amber-500 hover:underline mt-4 inline-block">Go to Projects</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <Link key={project._id} href={`/story-hacker/projects/${project._id}?tab=format`}>
                  <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-6 hover:border-amber-500/50 hover:bg-[#1a1a1a] transition cursor-pointer h-full flex flex-col">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 text-amber-500 mb-4">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 flex-1">{project.description || 'No description'}</p>
                    <div className="mt-6 pt-4 border-t border-[#1f1f1f] text-amber-500 text-sm font-bold flex items-center gap-1">
                      Format & Publish &rarr;
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
