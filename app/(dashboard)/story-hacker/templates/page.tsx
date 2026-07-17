'use client';

import { useState, useEffect, Suspense } from 'react';
import GlobalSidebar from '@/components/story-hacker/GlobalSidebar';
import { Book, LayoutDashboard, ChevronRight, Folder, FileText, Plus, Search, Edit3, Trash2, Copy, X, Loader2, Download, Upload, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface TemplateFamily {
  _id: string;
  name: string;
  description: string;
  isSystem: boolean;
  templateCount?: number;
}

interface TemplateSubgenre {
  _id: string;
  name: string;
  description: string;
  familyId: string;
  isSystem: boolean;
  templateCount?: number;
}

interface Template {
  _id: string;
  name: string;
  familyId: string;
  subgenreId: string;
  category: string;
  description?: string;
  isSystem: boolean;
  content: string;
  updatedAt: string;
}

function TemplatesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const familyIdParam = searchParams?.get('familyId') || null;
  const subgenreIdParam = searchParams?.get('subgenreId') || null;

  const [families, setFamilies] = useState<TemplateFamily[]>([]);
  const [subgenres, setSubgenres] = useState<TemplateSubgenre[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Folder Modal State
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderType, setFolderType] = useState<'family' | 'subgenre'>('family');
  const [folderName, setFolderName] = useState('');
  const [folderDesc, setFolderDesc] = useState('');

  // Guide Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editIsSystem, setEditIsSystem] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(editContent);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const activeFamily = families.find(f => f._id === familyIdParam);
  const activeSubgenre = subgenres.find(s => s._id === subgenreIdParam);

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/story/templates/backup');
      if (!res.ok) throw new Error('Failed to fetch backup');
      const data = await res.json();
      if (data.success && data.data) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `story-hacker-templates-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert('Export failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error(error);
      alert('Failed to export backup: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        setIsImporting(true);
        const res = await fetch('/api/story/templates/backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(json)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          const { familiesCreated, subgenresCreated, templatesCreated, templatesUpdated } = data.summary;
          alert(`Backup restored successfully!\n\n- Folders Created: ${familiesCreated}\n- Sub-folders Created: ${subgenresCreated}\n- Guides Created: ${templatesCreated}\n- Guides Updated: ${templatesUpdated}`);
          await fetchData();
        } else {
          alert('Import failed: ' + (data.error || 'Unknown error'));
        }
      } catch (err: any) {
        console.error(err);
        alert('Invalid backup file or import error: ' + err.message);
      } finally {
        setIsImporting(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    fetchData();
  }, [familyIdParam, subgenreIdParam]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Always fetch families to build breadcrumbs and UI
      const famRes = await fetch('/api/story/templates/families');
      if (famRes.ok) {
        const famData = await famRes.json();
        setFamilies(famData.families || []);
        setIsAdmin(famData.isAdmin || false);
      }

      if (familyIdParam) {
        const subRes = await fetch(`/api/story/templates/subgenres?familyId=${familyIdParam}`);
        if (subRes.ok) {
          const subData = await subRes.json();
          setSubgenres(subData.subgenres || []);
        }
      }

      if (familyIdParam && subgenreIdParam) {
        const tplRes = await fetch(`/api/story/templates?familyId=${familyIdParam}&subgenreId=${subgenreIdParam}`);
        if (tplRes.ok) {
          const tplData = await tplRes.json();
          setTemplates(tplData.templates || []);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // FOLDER ACTIONS
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = folderType === 'family' ? '/api/story/templates/families' : '/api/story/templates/subgenres';
      const body: any = { name: folderName, description: folderDesc, isSystem: editIsSystem };
      if (folderType === 'subgenre') body.familyId = familyIdParam;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        await fetchData();
        setIsFolderModalOpen(false);
      }
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  const handleEditFolder = async (e: React.MouseEvent, type: 'family' | 'subgenre', id: string, oldName: string) => {
    e.preventDefault(); e.stopPropagation();
    const newName = prompt(`Enter new name:`, oldName);
    if (!newName || newName === oldName) return;
    
    try {
      const url = type === 'family' ? `/api/story/templates/families/${id}` : `/api/story/templates/subgenres/${id}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) await fetchData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteFolder = async (e: React.MouseEvent, type: 'family' | 'subgenre', id: string) => {
    e.preventDefault(); e.stopPropagation();
    const isSure = confirm(`WARNING: Are you absolutely sure you want to delete this folder?\n\nThis will delete ALL guides inside it! This action cannot be undone.`);
    if (!isSure) return;

    try {
      const url = type === 'family' ? `/api/story/templates/families/${id}` : `/api/story/templates/subgenres/${id}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) await fetchData();
    } catch (err) { console.error(err); }
  };

  // GUIDE ACTIONS
  const handleOpenTemplate = (tpl: Template) => {
    setIsCreateMode(false);
    setActiveTemplate(tpl);
    setEditName(tpl.name);
    setEditDescription(tpl.description || '');
    setEditContent(tpl.content);
    setEditCategory(tpl.category);
    setEditIsSystem(tpl.isSystem);
    setIsModalOpen(true);
  };

  const handleCreateNewGuide = () => {
    setIsCreateMode(true);
    setActiveTemplate(null);
    setEditName('New Guide');
    setEditDescription('');
    setEditCategory('Characters');
    setEditContent('');
    setEditIsSystem(false);
    setIsModalOpen(true);
  };

  const handleSaveGuide = async () => {
    if (!isCreateMode && activeTemplate?.isSystem && !isAdmin) return;
    
    setIsSaving(true);
    try {
      const url = isCreateMode ? '/api/story/templates' : `/api/story/templates/${activeTemplate?._id}`;
      const method = isCreateMode ? 'POST' : 'PUT';
      
      const payload: any = {
        name: editName,
        description: editDescription,
        category: editCategory,
        content: editContent,
        familyId: familyIdParam,
        subgenreId: subgenreIdParam
      };
      
      if (isAdmin) payload.isSystem = editIsSystem;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchData();
        setIsModalOpen(false);
      }
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  const handleDuplicateGuide = async () => {
    if (!activeTemplate) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/story/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${activeTemplate.name} (Copy)`,
          description: activeTemplate.description,
          category: activeTemplate.category,
          familyId: activeTemplate.familyId,
          subgenreId: activeTemplate.subgenreId,
          content: activeTemplate.content
        })
      });
      if (res.ok) {
        await fetchData();
        setIsModalOpen(false);
      }
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  const handleDeleteGuide = async () => {
    if (!activeTemplate) return;
    if (activeTemplate.isSystem && !isAdmin) return;
    if (!confirm('Are you sure you want to delete this template?')) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/story/templates/${activeTemplate._id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
        setIsModalOpen(false);
      }
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  const handleQuickDeleteGuide = async (e: React.MouseEvent, tpl: Template) => {
    e.stopPropagation();
    if (tpl.isSystem && !isAdmin) return;
    if (!confirm(`Are you sure you want to delete "${tpl.name}"?`)) return;
    try {
      const res = await fetch(`/api/story/templates/${tpl._id}`, { method: 'DELETE' });
      if (res.ok) await fetchData();
    } catch (error) { console.error(error); }
  };

  // VIEWS
  if (isModalOpen) {
    return (
      <div className="p-8 lg:p-12 max-w-7xl w-full mx-auto relative flex flex-col h-full bg-[#1e1e1e]">
        <div className="flex items-center text-sm font-bold text-slate-400 mb-6 shrink-0">
          <Link href="/story-hacker/templates" className="hover:text-amber-500 transition" onClick={() => setIsModalOpen(false)}>Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
          <Link href={`/story-hacker/templates?familyId=${familyIdParam}`} className="hover:text-amber-500 transition" onClick={() => setIsModalOpen(false)}>
            {activeFamily?.name}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
          <span className="hover:text-amber-500 transition cursor-pointer" onClick={() => setIsModalOpen(false)}>
            {activeSubgenre?.name}
          </span>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
          <span className="text-white font-medium">{isCreateMode ? 'New guide' : activeTemplate?.name}</span>
        </div>
        
        <div className="flex flex-col h-full relative">
          {!isCreateMode && activeTemplate?.isSystem && (
            <div className="bg-amber-600 text-black text-sm font-bold py-2 px-4 rounded mb-6 shrink-0 text-center">
              This is a read-only system guide. Duplicate it to make an editable copy.
            </div>
          )}
          
          <h2 className="text-2xl font-black text-white mb-6 shrink-0">
            {isCreateMode ? 'New guide' : editName}
          </h2>

          <div className="flex-1 overflow-y-auto pb-32">
            <div className="max-w-4xl">
              
              <div className="mb-4">
                <label className="block text-[13px] font-bold text-white mb-2">Category</label>
                <select
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                  disabled={!isCreateMode && activeTemplate?.isSystem && !isAdmin}
                  className="w-full bg-[#333333] border-none rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition disabled:opacity-50 appearance-none"
                >
                  <option value="Characters">Characters</option>
                  <option value="Plots">Plots</option>
                  <option value="worldbuilding">Worldbuilding</option>
                  <option value="Themes">Themes</option>
                  <option value="Style">Style</option>
                  <option value="Tropes">Tropes</option>
                  <option value="Blurb">Blurb</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-bold text-white mb-2">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  disabled={!isCreateMode && activeTemplate?.isSystem && !isAdmin}
                  className="w-full bg-[#333333] border-none rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition disabled:opacity-50"
                />
              </div>

              <div className="mb-8">
                <label className="block text-[13px] font-bold text-white mb-2">Description (optional)</label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  placeholder="One-line summary"
                  disabled={!isCreateMode && activeTemplate?.isSystem && !isAdmin}
                  className="w-full bg-[#333333] border-none rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition placeholder-slate-400 disabled:opacity-50"
                />
              </div>
              
              {isAdmin && (
                <div className="flex items-center gap-3 mb-8 p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
                  <input
                    type="checkbox"
                    id="isSystemCheck"
                    checked={editIsSystem}
                    onChange={e => setEditIsSystem(e.target.checked)}
                    className="w-4 h-4 rounded border-[#333] bg-[#0a0a0a] text-amber-500 focus:ring-amber-500/20"
                  />
                  <label htmlFor="isSystemCheck" className="text-sm font-bold text-slate-300">
                    System Template (Visible to everyone)
                  </label>
                </div>
              )}

              <div className="border border-[#333333] rounded-md overflow-hidden bg-[#1f1f1f]">
                {/* Fake Rich Text Toolbar */}
                <div className="flex items-center gap-4 px-4 py-2 border-b border-[#333333] bg-[#2a2a2a] text-xs font-bold text-white/80">
                  <div className="flex gap-2">
                    <button className="hover:text-white">H1</button>
                    <button className="hover:text-white">H2</button>
                    <button className="hover:text-white">H3</button>
                  </div>
                  <div className="w-px h-4 bg-[#444]" />
                  <div className="flex gap-2 font-serif font-bold">
                    <button className="hover:text-white">B</button>
                    <button className="hover:text-white italic">I</button>
                    <button className="hover:text-white line-through">S</button>
                    <button className="hover:text-white font-mono">&lt;/&gt;</button>
                  </div>
                  <div className="w-px h-4 bg-[#444]" />
                  <div className="flex gap-3">
                    <button className="hover:text-white font-serif">""</button>
                    <button className="hover:text-white flex items-center gap-1">• List</button>
                    <button className="hover:text-white flex items-center gap-1">1. List</button>
                    <button className="hover:text-white">—</button>
                  </div>
                  <div className="w-px h-4 bg-[#444]" />
                  <button className="hover:text-white text-slate-400 font-normal">Clear Formatting</button>
                </div>
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  placeholder="Start typing or press ⌘K to generate with AI..."
                  disabled={!isCreateMode && activeTemplate?.isSystem && !isAdmin}
                  className="w-full bg-[#1f1f1f] px-4 py-4 text-sm text-slate-300 focus:outline-none focus:ring-0 min-h-[400px] resize-y disabled:opacity-50 placeholder-slate-600 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-[#1e1e1e] flex items-center z-10 gap-4">
            {(!activeTemplate?.isSystem || isAdmin || isCreateMode) && (
              <button
                onClick={handleSaveGuide}
                disabled={isSaving || !editName}
                className="px-6 py-2 bg-[#bd7a3a] hover:bg-[#a66a30] disabled:opacity-50 text-white rounded-md text-sm font-medium transition flex items-center justify-center min-w-[120px]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save guide'}
              </button>
            )}
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="text-white hover:text-slate-300 text-sm font-medium transition"
            >
              Cancel
            </button>

            {editContent && (
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] border border-[#444] text-white rounded-md text-sm font-medium transition flex items-center gap-2"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-4 h-4 text-green-500 animate-in fade-in zoom-in-95 duration-150" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-500" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            )}
            
            {!isCreateMode && activeTemplate && (
              <div className="flex-1 flex justify-end gap-4">
                <button
                  onClick={handleDuplicateGuide}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#333333] hover:bg-[#444] text-white rounded-md text-sm font-medium transition flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Duplicate
                </button>
                {(!activeTemplate.isSystem || isAdmin) && (
                  <button
                    onClick={handleDeleteGuide}
                    disabled={isSaving}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // FOLDER CREATION MODAL
  const folderModalJSX = isFolderModalOpen && (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-[#333] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#1f1f1f]">
          <h3 className="text-xl font-bold text-white">New {folderType === 'family' ? 'Main Folder' : 'Sub Folder'}</h3>
        </div>
        <form onSubmit={handleCreateFolder} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Folder Name</label>
            <input type="text" required value={folderName} onChange={e => setFolderName(e.target.value)} className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition" placeholder="e.g. Fantasy" />
          </div>
          {isAdmin && (
            <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
              <input type="checkbox" id="isSysFolder" checked={editIsSystem} onChange={e => setEditIsSystem(e.target.checked)} className="w-4 h-4 rounded border-[#333] bg-[#0a0a0a] text-amber-500 focus:ring-amber-500/20" />
              <label htmlFor="isSysFolder" className="text-sm font-bold text-slate-300">System Folder</label>
            </div>
          )}
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsFolderModalOpen(false)} className="flex-1 px-4 py-3 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white rounded-xl text-sm font-bold transition">Cancel</button>
            <button type="submit" disabled={isSaving || !folderName} className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition flex justify-center items-center">
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // LEVEL 1: FAMILIES
  if (!familyIdParam) {
    return (
      <div className="p-8 lg:p-12 max-w-7xl w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">Writing Guides</h2>
            <p className="text-slate-400 text-[13px]">Genre-specific templates to guide your writing and inform AI context.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportBackup}
              disabled={isExporting}
              className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-md text-sm font-bold border border-[#3a3a3a] transition flex items-center gap-2 disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-amber-500" />}
              Export Backup
            </button>
            
            <label className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-md text-sm font-bold border border-[#3a3a3a] transition flex items-center gap-2 cursor-pointer disabled:opacity-50">
              {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-amber-500" />}
              Import Backup
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImportBackup} 
                className="hidden" 
                disabled={isImporting} 
              />
            </label>

            <button 
              onClick={() => { setFolderType('family'); setFolderName(''); setEditIsSystem(false); setIsFolderModalOpen(true); }}
              className="bg-[#bd7a3a] hover:bg-[#a66a30] text-black px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2"
            >
              <Folder className="w-4 h-4" /> New Folder
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
        ) : families.length === 0 ? (
          <div className="text-center py-16 border border-[#1f1f1f] border-dashed rounded-xl bg-[#121212]">
            <Folder className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No folders created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {families.map(fam => (
              <div 
                key={fam._id} 
                onClick={() => router.push(`/story-hacker/templates?familyId=${fam._id}`)}
                className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4 hover:bg-[#333] transition group flex justify-between items-start cursor-pointer relative"
              >
                <div className="flex items-start gap-3">
                  <Folder className="w-5 h-5 text-[#bd7a3a] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-bold text-[13px]">{fam.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-[#888]">{fam.templateCount || 0} guides</span>
                      {fam.isSystem && <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">System</span>}
                    </div>
                  </div>
                </div>
                {(!fam.isSystem || isAdmin) && (
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition mt-1">
                    <button onClick={(e) => handleEditFolder(e, 'family', fam._id, fam.name)} className="text-slate-500 hover:text-white transition"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={(e) => handleDeleteFolder(e, 'family', fam._id)} className="text-slate-500 hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {folderModalJSX}
      </div>
    );
  }

  // LEVEL 2: SUBGENRES
  if (familyIdParam && !subgenreIdParam) {
    return (
      <div className="p-8 lg:p-12 max-w-7xl w-full mx-auto">
        <div className="flex items-center text-sm font-bold text-slate-400 mb-6 shrink-0">
          <Link href="/story-hacker/templates" className="hover:text-amber-500 transition">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
          <span className="text-white font-medium">{activeFamily?.name}</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">{activeFamily?.name}</h2>
          </div>
          <button 
            onClick={() => { setFolderType('subgenre'); setFolderName(''); setEditIsSystem(false); setIsFolderModalOpen(true); }}
            className="bg-[#bd7a3a] hover:bg-[#a66a30] text-black px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2"
          >
            <Folder className="w-4 h-4" /> New Sub Folder
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
        ) : subgenres.length === 0 ? (
          <div className="text-center py-16 border border-[#1f1f1f] border-dashed rounded-xl bg-[#121212]">
            <Folder className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No sub folders created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subgenres.map(sub => (
              <div 
                key={sub._id} 
                onClick={() => router.push(`/story-hacker/templates?familyId=${familyIdParam}&subgenreId=${sub._id}`)}
                className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4 hover:bg-[#333] transition group flex justify-between items-start cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Folder className="w-5 h-5 text-[#bd7a3a] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-bold text-[13px] leading-tight">{sub.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#888]">{sub.templateCount || 0} guides</span>
                      {sub.isSystem && <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">System</span>}
                    </div>
                  </div>
                </div>
                {(!sub.isSystem || isAdmin) && (
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition mt-1">
                    <button onClick={(e) => handleEditFolder(e, 'subgenre', sub._id, sub.name)} className="text-slate-500 hover:text-white transition"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={(e) => handleDeleteFolder(e, 'subgenre', sub._id)} className="text-slate-500 hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {folderModalJSX}
      </div>
    );
  }

  // LEVEL 3: TEMPLATES
  const order = ['Characters', 'Plots', 'worldbuilding', 'Themes', 'Style', 'Tropes', 'Blurb'];
  const categories = Array.from(new Set(templates.map(t => t.category).filter(Boolean))).sort((a, b) => {
    return order.indexOf(a) - order.indexOf(b);
  });
  
  return (
    <div className="p-8 lg:p-12 max-w-7xl w-full mx-auto relative flex flex-col h-full">
      <div className="flex items-center text-sm font-bold text-slate-400 mb-6 shrink-0">
        <Link href="/story-hacker/templates" className="hover:text-amber-500 transition">Templates</Link>
        <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
        <Link href={`/story-hacker/templates?familyId=${familyIdParam}`} className="hover:text-amber-500 transition">
          {activeFamily?.name}
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
        <span className="text-amber-500">
          {activeSubgenre?.name}
        </span>
      </div>
      
      <>
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 className="text-2xl font-black text-white">{activeSubgenre?.name}</h2>
          <button 
            onClick={handleCreateNewGuide}
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded text-sm font-bold shadow-lg shadow-amber-900/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Guide
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
        ) : templates.length === 0 ? (
          <div className="text-center py-16 border border-[#1f1f1f] border-dashed rounded-xl bg-[#121212]">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No guides found in this folder.</p>
          </div>
        ) : (
          <div className="space-y-8 pb-24">
            {categories.map(cat => {
              const templatesForCat = templates.filter(t => t.category === cat);
              return (
                <div key={cat}>
                  <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                    {cat} 
                    <span className="text-slate-500 text-[10px]">{templatesForCat.length}</span>
                    <button 
                      onClick={() => {
                        handleCreateNewGuide();
                        setEditCategory(cat);
                      }}
                      className="hover:text-amber-500 transition text-slate-500 flex items-center lowercase text-[10px]"
                    >
                      + add
                    </button>
                  </h3>
                  <div className="flex flex-col border border-[#1f1f1f] rounded-lg overflow-hidden bg-[#121212]">
                    {templatesForCat.map(tpl => (
                      <div
                        key={tpl._id}
                        onClick={() => handleOpenTemplate(tpl)}
                        className="flex items-center justify-between p-4 border-b border-[#1f1f1f] last:border-0 hover:bg-[#1a1a1a] cursor-pointer transition group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition" />
                          <span className="text-sm font-medium text-slate-200 group-hover:text-white transition">{tpl.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          {(!tpl.isSystem || isAdmin) && (
                            <button
                              onClick={(e) => handleQuickDeleteGuide(e, tpl)}
                              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          {tpl.isSystem ? (
                            <span className="bg-[#2a2a2a] text-slate-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">System</span>
                          ) : (
                            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Yours</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans flex flex-col w-full">
      <GlobalSidebar />
      <main className="flex-1 flex flex-col h-[calc(100vh-65px)] overflow-y-auto">
        <header className="md:hidden border-b border-[#1f1f1f] bg-[#121212] h-16 flex items-center px-4 shrink-0">
          <Book className="w-6 h-6 text-amber-500 mr-2" />
          <h1 className="text-xl font-black text-white tracking-tight">Story Hacker</h1>
        </header>

        <Suspense fallback={<div className="flex-1 flex justify-center items-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>}>
          <TemplatesContent />
        </Suspense>
      </main>
    </div>
  );
}
