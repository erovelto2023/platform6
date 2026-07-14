'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Book, ChevronRight, LayoutDashboard, Loader2, Library, Folder, Zap, History, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GlobalSidebar from '@/components/story-hacker/GlobalSidebar';

interface Project {
  _id: string;
  title: string;
  description: string;
  isArchived?: boolean;
  updatedAt: string;
}

export default function StoryHackerDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/story/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/story/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDesc })
      });
      if (res.ok) {
        const data = await res.json();
        setIsModalOpen(false);
        setNewTitle('');
        setNewDesc('');
        router.push(`/story-hacker/projects/${data.project._id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/story/projects/${activeProject._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDesc })
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchProjects();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchiveToggle = async (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`/api/story/projects/${project._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: !project.isArchived })
      });
      if (res.ok) fetchProjects();
    } catch (e) { console.error(e); }
  };

  const handleDuplicate = async (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`/api/story/projects/${project._id}/duplicate`, { method: 'POST' });
      if (res.ok) fetchProjects();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this project and all its documents?')) return;
    try {
      const res = await fetch(`/api/story/projects/${project._id}`, { method: 'DELETE' });
      if (res.ok) fetchProjects();
    } catch (e) { console.error(e); }
  };

  const filteredProjects = projects.filter(p => showArchived ? p.isArchived : !p.isArchived);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans flex flex-col w-full">
      <GlobalSidebar />

      <main className="flex-1 flex flex-col">
        {/* Mobile Header (Hidden on md+) */}
        <header className="md:hidden border-b border-[#1f1f1f] bg-[#121212] h-16 flex items-center px-4">
          <Book className="w-6 h-6 text-amber-500 mr-2" />
          <h1 className="text-xl font-black text-white tracking-tight">Story Hacker</h1>
        </header>

        <div className="p-8 lg:p-12 max-w-7xl w-full mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-black text-white">Your Projects</h2>
              <p className="text-slate-400 mt-2 text-sm">Create and manage your book outlines and dossiers.</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`text-sm font-bold transition px-3 py-1.5 rounded-lg border ${showArchived ? 'bg-amber-600/10 text-amber-500 border-amber-500/20' : 'text-slate-400 border-transparent hover:bg-[#1a1a1a] hover:text-white'}`}
              >
                {showArchived ? 'Hide Archived' : 'Show Archived'}
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-amber-900/20 transition flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Project
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="border border-[#1f1f1f] border-dashed rounded-3xl p-16 text-center bg-[#121212]">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#2a2a2a]">
                <Folder className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{showArchived ? 'No archived projects' : 'No projects yet'}</h3>
              <p className="text-slate-400 mb-6 max-w-sm mx-auto">Get started by creating your first book project to organize your ideas, characters, and outlines.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#333] text-white px-6 py-3 rounded-xl text-sm font-bold transition inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project._id} className="relative group/card h-full">
                  <Link href={`/story-hacker/projects/${project._id}`}>
                    <div className="group bg-[#121212] border border-[#1f1f1f] rounded-2xl p-6 hover:border-amber-500/50 hover:bg-[#1a1a1a] transition cursor-pointer h-full flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 text-amber-500">
                          <Book className="w-5 h-5" />
                        </div>
                        <div className="w-8" /> {/* Spacer for absolute actions menu */}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-slate-400 text-sm line-clamp-2 flex-1">
                        {project.description || 'No description provided.'}
                      </p>
                      <div className="mt-6 pt-4 border-t border-[#1f1f1f] text-xs text-slate-500 flex justify-between items-center">
                        <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                        <span className="bg-[#1f1f1f] px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider text-slate-400">Book</span>
                      </div>
                    </div>
                  </Link>

                  {/* Absolute positioning for actions so they don't trigger the Link */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveProject(project);
                        setEditTitle(project.title);
                        setEditDesc(project.description);
                        setIsEditModalOpen(true);
                      }} 
                      className="p-2 text-slate-400 hover:text-white bg-[#1a1a1a] rounded-md hover:bg-[#333] transition"
                      title="Edit Project"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => handleDuplicate(e, project)} 
                      className="p-2 text-slate-400 hover:text-white bg-[#1a1a1a] rounded-md hover:bg-[#333] transition"
                      title="Duplicate Project"
                    >
                      <Library className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => handleArchiveToggle(e, project)} 
                      className="p-2 text-slate-400 hover:text-amber-500 bg-[#1a1a1a] rounded-md hover:bg-[#333] transition"
                      title={project.isArchived ? "Unarchive" : "Archive"}
                    >
                      <Folder className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#333] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#1f1f1f]">
              <h3 className="text-xl font-bold text-white">Create New Project</h3>
              <p className="text-sm text-slate-400 mt-1">Set up a new workspace for your book.</p>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Book Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition"
                  placeholder="e.g. Ashes of the Wolf King"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Description / Logline</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition h-24 resize-none"
                  placeholder="Optional brief description of the story..."
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white rounded-xl text-sm font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle}
                  className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition flex justify-center items-center"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#333] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#1f1f1f] flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">Edit Project</h3>
                <p className="text-sm text-slate-400 mt-1">Update project details.</p>
              </div>
              <button onClick={(e) => handleDelete(e, activeProject!)} className="text-red-500 hover:text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500/10">Delete</button>
            </div>
            <form onSubmit={handleEditProject} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Book Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition"
                  placeholder="e.g. Ashes of the Wolf King"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Description / Logline</label>
                <textarea
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition h-24 resize-none"
                  placeholder="Optional brief description of the story..."
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white rounded-xl text-sm font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !editTitle}
                  className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition flex justify-center items-center"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
