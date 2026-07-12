'use client';

import { useState, useEffect, use, useRef, Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Layers, Zap, Folder, Plus, Loader2, FileText, Settings, History, MoreVertical, Edit3, Trash2, Download, Printer, Activity } from 'lucide-react';
import BookBuilderPipeline from '@/components/story-hacker/BookBuilderPipeline';
import ChatSidebar from '@/components/story-hacker/ChatSidebar';
import AtticusBuilder from '@/components/story-hacker/AtticusBuilder';
import RichTextEditor from '@/components/story-hacker/RichTextEditor';
import AutoCritAnalysis from '@/components/story-hacker/AutoCritAnalysis';
import { useSearchParams } from 'next/navigation';

interface Project {
  _id: string;
  title: string;
  description: string;
  subtitle?: string;
  authorName?: string;
  coverImage?: string;
  theme?: string;
  manuscriptOrder?: string[];
}

interface Document {
  _id: string;
  projectId: string;
  name: string;
  type: string;
  content: string;
  aiAnalysis?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

const DOCUMENT_TYPES = ['Characters', 'worldbuilding', 'plot', 'manuscript', 'research', 'notes'];

interface Template {
  _id: string;
  name: string;
  category: string;
  content: string;
}

export default function ProjectHub({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>}>
      <ProjectHubContent params={params} />
    </Suspense>
  );
}

function ProjectHubContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const initialTab = (searchParams?.get('tab') as any) || 'documents';

  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTab, setActiveTab] = useState<'documents' | 'templates' | 'automations' | 'format' | 'analysis'>(initialTab);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [docContent, setDocContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [loading, setLoading] = useState(true);

  // New Document Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('Characters');
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);
  
  // Document actions menu
  const [showDocMenu, setShowDocMenu] = useState(false);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    setLoading(true);
    try {
      const [projRes, docRes, tplRes] = await Promise.all([
        fetch(`/api/story/projects/${id}`),
        fetch(`/api/story/documents?projectId=${id}`),
        // Fetch all templates so they can be grouped by category in the sidebar
        fetch(`/api/story/templates`)
      ]);

      if (projRes.ok) {
        const data = await projRes.json();
        setProject(data.project);
      }
      if (docRes.ok) {
        const data = await docRes.json();
        setDocuments(data.documents);
        if (data.documents.length > 0) {
          setActiveDocument(data.documents[0]);
          setDocContent(data.documents[0].content || '');
        }
      }
      if (tplRes.ok) {
        const data = await tplRes.json();
        setTemplates(data.templates || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDoc(true);
    try {
      const initialContent = (window as any)._pendingTemplateContent || '';
      const res = await fetch('/api/story/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: id, name: newDocName, type: newDocType, content: initialContent })
      });
      if (res.ok) {
        const data = await res.json();
        setIsDocModalOpen(false);
        setNewDocName('');
        (window as any)._pendingTemplateContent = undefined; // clear it
        setDocuments(prev => [data.document, ...prev]);
        setActiveDocument(data.document);
        setDocContent(data.document.content || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setDocContent(newContent);
    setSaveStatus('saving');
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      if (!activeDocument) return;
      try {
        const res = await fetch('/api/story/documents', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId: activeDocument._id, content: newContent })
        });
        if (res.ok) {
          setSaveStatus('saved');
          setDocuments(prev => prev.map(d => d._id === activeDocument._id ? { ...d, content: newContent } : d));
        } else {
          setSaveStatus('error');
        }
      } catch (err) {
        setSaveStatus('error');
      }
    }, 1000);
  };

  const handleAppendToDocument = (text: string) => {
    if (!activeDocument) {
      alert("Please select or create a document to insert the text into.");
      return;
    }
    
    const newContent = docContent ? docContent + '\n\n' + text : text;
    setDocContent(newContent);
    setSaveStatus('saving');
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/story/documents', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId: activeDocument._id, content: newContent })
        });
        if (res.ok) {
          setSaveStatus('saved');
          setDocuments(prev => prev.map(d => d._id === activeDocument._id ? { ...d, content: newContent } : d));
        } else {
          setSaveStatus('error');
        }
      } catch (err) {
        setSaveStatus('error');
      }
    }, 1000);
  };

  const handleRenameDocument = async () => {
    if (!activeDocument) return;
    const newName = prompt('Enter new document name:', activeDocument.name);
    if (!newName || newName === activeDocument.name) return;
    
    try {
      const res = await fetch(`/api/story/documents/${activeDocument._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) {
        setDocuments(prev => prev.map(d => d._id === activeDocument._id ? { ...d, name: newName } : d));
        setActiveDocument({ ...activeDocument, name: newName });
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteDocument = async () => {
    if (!activeDocument) return;
    if (!confirm(`Are you sure you want to delete "${activeDocument.name}"?`)) return;
    
    try {
      const res = await fetch(`/api/story/documents/${activeDocument._id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d._id !== activeDocument._id));
        setActiveDocument(null);
        setDocContent('');
      }
    } catch (e) { console.error(e); }
  };

  const handleExportDoc = () => {
    if (!activeDocument) return;
    
    // Create an HTML string that MS Word can interpret as a .doc file
    const contentHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>${activeDocument.name}</title></head>
      <body>
        <h1>${activeDocument.name}</h1>
        <p style="white-space: pre-wrap;">${docContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </body>
      </html>
    `;
    
    const blob = new Blob([contentHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDocument.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDocMenu(false);
  };

  const handleExportPdf = () => {
    setShowDocMenu(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <Link href="/story-hacker" className="text-amber-500 hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="hide-during-book-print h-screen flex flex-col bg-[#0a0a0a] text-slate-200 overflow-hidden font-sans">
      {/* Header */}
      <header className="border-b border-[#1f1f1f] bg-[#121212] h-14 flex items-center px-4 shrink-0 justify-between">
        <div className="flex items-center gap-4">
          <Link href="/story-hacker" className="text-slate-400 hover:text-white transition p-1.5 -ml-1.5 rounded-lg hover:bg-[#1f1f1f]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-5 w-px bg-[#333]"></div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <h1 className="text-sm font-bold text-white tracking-tight">{project.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === 'documents' ? 'bg-[#1f1f1f] text-white' : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a]'}`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab('automations')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === 'automations' ? 'bg-[#1f1f1f] text-amber-500' : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a]'}`}
          >
            <Zap className="w-3.5 h-3.5" />
            AI Automations
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === 'analysis' ? 'bg-[#1f1f1f] text-blue-400' : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a]'}`}
          >
            <Activity className="w-3.5 h-3.5" />
            AutoCrit Analysis
          </button>
          <button
            onClick={() => setActiveTab('format')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === 'format' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'bg-[#1f1f1f] text-slate-300 hover:bg-[#2a2a2a] hover:text-white'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Format & Publish
          </button>
        </div>
      </header>

      {/* Main 3-Column Layout for Documents */}
      {activeTab === 'documents' && (
        <div className="flex-1 flex overflow-hidden hide-on-print">
          
          {/* Column 1: Document Tree Sidebar */}
          <aside className="w-64 border-r border-[#1f1f1f] bg-[#121212] flex flex-col shrink-0 hide-on-print">
            <div className="p-3 border-b border-[#1f1f1f] flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Docs</span>
              <button onClick={() => setIsDocModalOpen(true)} className="text-slate-400 hover:text-amber-500 transition p-1 rounded-md hover:bg-[#1f1f1f]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-4">
              {DOCUMENT_TYPES.map(type => {
                const typeDocs = documents.filter(d => d.type === type);
                if (typeDocs.length === 0) return null;
                return (
                  <div key={type} className="space-y-1">
                    <h3 className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-1">
                      <Folder className="w-3 h-3" />
                      {type}
                    </h3>
                    {typeDocs.map(doc => (
                      <button
                        key={doc._id}
                        onClick={() => {
                          setActiveDocument(doc);
                          setDocContent(doc.content || '');
                          setSaveStatus('saved');
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition flex items-center gap-2 ${
                          activeDocument?._id === doc._id ? 'bg-[#1f1f1f] text-amber-500 font-medium' : 'text-slate-300 hover:bg-[#1a1a1a] hover:text-white'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 opacity-70" />
                        <span className="truncate">{doc.name}</span>
                      </button>
                    ))}
                  </div>
                );
              })}
              {documents.length === 0 && (
                <div className="text-center p-4">
                  <p className="text-xs text-slate-500">No documents yet.</p>
                </div>
              )}
            </div>
          </aside>

          {/* Column 2: Editor Area */}
          <main className="flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden relative print-main">
            {activeDocument ? (
              <>
                <div className="h-14 border-b border-[#1f1f1f] flex items-center px-6 justify-between shrink-0 bg-[#0a0a0a] hide-on-print">
                  <h2 className="text-lg font-bold text-white">{activeDocument.name}</h2>
                  <div className="flex items-center gap-2 relative">
                    <span className="text-xs text-slate-500 bg-[#121212] px-2 py-1 rounded border border-[#1f1f1f] mr-2">{activeDocument.type}</span>
                    {saveStatus === 'saving' && <span className="text-xs text-amber-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Saving...</span>}
                    {saveStatus === 'saved' && <span className="text-xs text-slate-500">Saved</span>}
                    {saveStatus === 'error' && <span className="text-xs text-red-500">Error saving</span>}
                    
                    <button 
                      onClick={() => setShowDocMenu(!showDocMenu)}
                      className="text-slate-400 hover:text-white p-1.5 ml-2 hover:bg-[#1f1f1f] rounded-md transition"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {showDocMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowDocMenu(false)} />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#121212] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                          <button onClick={handleRenameDocument} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-[#1f1f1f] hover:text-white transition text-left">
                            <Edit3 className="w-4 h-4" /> Rename Document
                          </button>
                          <div className="h-px bg-[#1f1f1f] my-1" />
                          <button onClick={handleExportDoc} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-[#1f1f1f] hover:text-white transition text-left">
                            <Download className="w-4 h-4" /> Export as .DOC
                          </button>
                          <button onClick={handleExportPdf} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-[#1f1f1f] hover:text-white transition text-left">
                            <Printer className="w-4 h-4" /> Print / Save PDF
                          </button>
                          <div className="h-px bg-[#1f1f1f] my-1" />
                          <button onClick={handleDeleteDocument} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-[#1f1f1f] hover:text-red-300 transition text-left">
                            <Trash2 className="w-4 h-4" /> Delete Document
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Print Title (Only visible during print) */}
                <h1 className="hidden print-only text-2xl font-bold mb-6 text-black">{activeDocument.name}</h1>
                
                <div className="flex-1 overflow-hidden print-content-area flex flex-col">
                  <RichTextEditor
                    key={activeDocument._id}
                    content={docContent}
                    onChange={(html) => handleContentChange({ target: { value: html } } as any)}
                    title={activeDocument.name}
                    onTitleChange={(newTitle) => {
                      setDocuments(prev => prev.map(d => d._id === activeDocument._id ? { ...d, name: newTitle } : d));
                      setActiveDocument(prev => prev ? { ...prev, name: newTitle } : null);
                      fetch(`/api/story/documents`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ documentId: activeDocument._id, name: newTitle })
                      }).catch(console.error);
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p>Select a document or create a new one.</p>
              </div>
            )}
          </main>

          {/* Column 3: Chat Sidebar */}
          <ChatSidebar projectId={id} documents={documents} templates={templates} onAppendToDocument={handleAppendToDocument} />
        </div>
      )}



      {/* AI AUTOMATIONS TAB */}
      {activeTab === 'automations' && (
        <div className="flex-1 flex overflow-hidden">
          <BookBuilderPipeline projectId={id} />
        </div>
      )}

      {/* AUTOCRIT ANALYSIS TAB */}
      {activeTab === 'analysis' && (
        <div className="flex-1 flex overflow-hidden">
          <AutoCritAnalysis 
            documents={documents} 
            onUpdateDocument={(id, content, aiAnalysis) => {
               setDocuments(prev => prev.map(d => d._id === id ? { 
                 ...d, 
                 content, 
                 aiAnalysis: aiAnalysis ? { ...d.aiAnalysis, ...aiAnalysis } : d.aiAnalysis 
               } : d));
               if (activeDocument && activeDocument._id === id) {
                 setDocContent(content);
               }
               
               // Properly debounce the API call to avoid spamming the backend
               if (saveTimeoutRef.current) {
                 clearTimeout(saveTimeoutRef.current);
               }
               saveTimeoutRef.current = setTimeout(async () => {
                 try {
                   await fetch('/api/story/documents', {
                     method: 'PUT',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ documentId: id, content, aiAnalysis })
                   });
                 } catch (e) {
                   console.error("Failed to save inline edit:", e);
                 }
               }, 1000);
            }} 
          />
        </div>
      )}

      {/* FORMAT & PUBLISH TAB */}
      {activeTab === 'format' && (
        <div className="flex-1 flex overflow-hidden">
          <AtticusBuilder projectId={id} project={project} documents={documents} setProject={setProject} setDocuments={setDocuments} />
        </div>
      )}

      {/* Create Document Modal */}
      {isDocModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#333] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#1f1f1f]">
              <h3 className="text-xl font-bold text-white">Create Document</h3>
            </div>
            <form onSubmit={handleCreateDocument} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Document Name</label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={e => setNewDocName(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition"
                  placeholder="e.g. Hero's Journey Notes"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Bucket Type</label>
                <select
                  value={newDocType}
                  onChange={e => setNewDocType(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition appearance-none"
                >
                  {DOCUMENT_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white rounded-xl text-sm font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDoc || !newDocName}
                  className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition flex justify-center items-center"
                >
                  {isSubmittingDoc ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Doc'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
