'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import ThemeEditor, { Theme } from './ThemeEditor';
import { generatePrintDocument } from '@/lib/printUtils';
import RichTextEditor from './RichTextEditor';
import { 
  Book, Type, Settings, Image as ImageIcon, Check, Loader2, Save, 
  AlignLeft, ChevronRight, GripVertical, Download, Maximize2, Minimize2, BarChart2, Plus
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Project {
  _id: string;
  title: string;
  description: string;
  subtitle?: string;
  authorName?: string;
  publisherName?: string;
  publisherLink?: string;
  copyrightText?: string;
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

const isChapterTitleDuplicate = (name: string, number: number) => {
  const clean = name.trim().toLowerCase();
  if (clean === `chapter ${number}`) return true;
  if (clean === `chapter ${number.toString()}`) return true;
  if (clean === `${number}`) return true;
  if (clean === `untitled chapter`) return true;
  
  const numberWords: { [key: number]: string } = {
    1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
    11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen', 16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
    21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 24: 'twenty-four', 25: 'twenty-five', 26: 'twenty-six', 27: 'twenty-seven', 28: 'twenty-eight', 29: 'twenty-nine', 30: 'thirty',
    31: 'thirty-one', 32: 'thirty-two', 33: 'thirty-three', 34: 'thirty-four', 35: 'thirty-five', 36: 'thirty-six', 37: 'thirty-seven', 38: 'thirty-eight', 39: 'thirty-nine', 40: 'forty',
    41: 'forty-one', 42: 'forty-two', 43: 'forty-three', 44: 'forty-four', 45: 'forty-five', 46: 'forty-six', 47: 'forty-seven', 48: 'forty-eight', 49: 'forty-nine', 50: 'fifty',
    51: 'fifty-one', 52: 'fifty-two', 53: 'fifty-three', 54: 'fifty-four', 55: 'fifty-five', 56: 'fifty-six', 57: 'fifty-seven', 58: 'fifty-eight', 59: 'fifty-nine', 60: 'sixty',
    61: 'sixty-one', 62: 'sixty-two', 63: 'sixty-three', 64: 'sixty-four', 65: 'sixty-five', 66: 'sixty-six', 67: 'sixty-seven', 68: 'sixty-eight', 69: 'sixty-nine', 70: 'seventy',
    71: 'seventy-one', 72: 'seventy-two', 73: 'seventy-three', 74: 'seventy-four', 75: 'seventy-five', 76: 'seventy-six', 77: 'seventy-seven', 78: 'seventy-eight', 79: 'seventy-nine', 80: 'eighty',
    81: 'eighty-one', 82: 'eighty-two', 83: 'eighty-three', 84: 'eighty-four', 85: 'eighty-five', 86: 'eighty-six', 87: 'eighty-seven', 88: 'eighty-eight', 89: 'eighty-nine', 90: 'ninety',
    91: 'ninety-one', 92: 'ninety-two', 93: 'ninety-three', 94: 'ninety-four', 95: 'ninety-five', 96: 'ninety-six', 97: 'ninety-seven', 98: 'ninety-eight', 99: 'ninety-nine', 100: 'hundred'
  };

  const word = numberWords[number];
  if (word) {
    if (clean === word) return true;
    if (clean === word.replace('-', ' ')) return true;
    if (clean === `chapter ${word}`) return true;
    if (clean === `chapter ${word.replace('-', ' ')}`) return true;
  }
  return false;
};

interface AtticusBuilderProps {
  projectId: string;
  project: Project;
  documents: Document[];
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
}

export default function AtticusBuilder({ projectId, project, documents, setProject, setDocuments }: AtticusBuilderProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'writing' | 'formatting'>('details');
  const [isSaving, setIsSaving] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isEditingTheme, setIsEditingTheme] = useState(false);
  const [editingThemeDraft, setEditingThemeDraft] = useState<Theme | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch Themes on Mount
  useEffect(() => {
    fetch('/api/story/themes')
      .then(res => res.json())
      .then(data => {
        if (data.themes) setThemes(data.themes);
      })
      .catch(console.error);
  }, []);
  
  // Local state for book details
  const [title, setTitle] = useState(project?.title || '');
  const [subtitle, setSubtitle] = useState(project?.subtitle || '');
  const [authorName, setAuthorName] = useState(project?.authorName || '');
  const [coverImage, setCoverImage] = useState(project?.coverImage || '');

  // Local state for writing mode
  const [activeDocId, setActiveDocId] = useState<string | null>('frontmatter-title');
  const [docContent, setDocContent] = useState('');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isUpdatingPageNumbersRef = useRef(false);

  const updatePageNumbers = () => {
    if (isUpdatingPageNumbersRef.current) return;
    isUpdatingPageNumbersRef.current = true;
    requestAnimationFrame(() => {
      const el = document.getElementById('book-preview-content');
      if (el) {
        const current = Math.round(el.scrollLeft / el.clientWidth) + 1;
        const total = Math.round(el.scrollWidth / el.clientWidth) || 1;
        setCurrentPage(current);
        setTotalPages(total);
      }
      isUpdatingPageNumbersRef.current = false;
    });
  };

  useEffect(() => {
    const timer = setTimeout(updatePageNumbers, 300);
    return () => clearTimeout(timer);
  }, [docContent, activeDocId, activeTab]);

  useEffect(() => {
    if (activeTab === 'formatting') {
      window.addEventListener('resize', updatePageNumbers);
      return () => window.removeEventListener('resize', updatePageNumbers);
    }
  }, [activeTab]);

  // Filter manuscript documents
  const manuscriptDocs = documents.filter(d => d.type === 'manuscript');
  
  // Sort documents based on project.manuscriptOrder if it exists
  const orderedDocs = [...manuscriptDocs].sort((a, b) => {
    const order = project.manuscriptOrder || [];
    const indexA = order.indexOf(a._id);
    const indexB = order.indexOf(b._id);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const activeDoc = orderedDocs.find(d => d._id === activeDocId);

  // Sync state when project changes
  useEffect(() => {
    setTitle(project.title);
    setSubtitle(project.subtitle || '');
    setAuthorName(project.authorName || '');
    setCoverImage(project.coverImage || '');
  }, [project]);

  // Sync active document content when documents prop updates (e.g. from AutoCrit)
  useEffect(() => {
    if (activeDocId) {
      const doc = documents.find(d => d._id === activeDocId);
      if (doc && doc.content !== docContent) {
        setDocContent(doc.content || '');
      }
    }
  }, [documents, activeDocId]);

  // Auto-save project details
  const saveProjectTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!project) return;
    if (saveProjectTimeout.current) clearTimeout(saveProjectTimeout.current);
    saveProjectTimeout.current = setTimeout(async () => {
      try {
        await fetch(`/api/story/projects/${projectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: project.title,
            subtitle: project.subtitle,
            authorName: project.authorName,
            publisherName: project.publisherName,
            publisherLink: project.publisherLink,
            copyrightText: project.copyrightText,
            coverImage: project.coverImage,
          })
        });
      } catch (e) {
        console.error('Failed to auto-save project details', e);
      }
    }, 1500);
    return () => {
      if (saveProjectTimeout.current) clearTimeout(saveProjectTimeout.current);
    };
  }, [project?.title, project?.subtitle, project?.authorName, project?.publisherName, project?.publisherLink, project?.copyrightText, project?.coverImage]);

  // Handle saving book details manually (still kept for the button)
  const handleSaveDetails = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/story/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project?.title,
          subtitle: project?.subtitle,
          authorName: project?.authorName,
          publisherName: project?.publisherName,
          publisherLink: project?.publisherLink,
          copyrightText: project?.copyrightText,
          coverImage: project?.coverImage,
        })
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle saving content
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setDocContent(newContent);
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(async () => {
      if (!activeDocId) return;
      try {
        const res = await fetch('/api/story/documents', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId: activeDocId, content: newContent })
        });
        if (res.ok) {
          setDocuments(prev => prev.map(d => d._id === activeDocId ? { ...d, content: newContent } : d));
        }
      } catch (err) {}
    }, 1000);
  };

  const titleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTitleChange = (docId: string, newTitle: string) => {
    setDocuments(prev => prev.map(d => d._id === docId ? { ...d, name: newTitle } : d));
    
    if (titleTimeoutRef.current) clearTimeout(titleTimeoutRef.current);
    titleTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/story/documents`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId: docId, name: newTitle })
        });
      } catch (e) {}
    }, 1000);
  };

  const handleThemeChange = async (themeId: string) => {
    try {
      const res = await fetch(`/api/story/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeId })
      });
      if (res.ok) {
        setProject(prev => prev ? { ...prev, theme: themeId } : prev);
      }
    } catch (e) {}
  };

  const handleMoveToManuscript = async (docId: string) => {
    try {
      const res = await fetch('/api/story/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId, type: 'manuscript' })
      });
      if (res.ok) {
        setDocuments(prev => prev.map(d => d._id === docId ? { ...d, type: 'manuscript' } : d));
      }
    } catch (e) {}
  };

  const handleRemoveFromManuscript = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Remove this chapter from the manuscript? It will be moved back to your notes.')) return;
    try {
      const res = await fetch('/api/story/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId, type: 'notes' })
      });
      if (res.ok) {
        setDocuments(prev => prev.map(d => d._id === docId ? { ...d, type: 'notes' } : d));
        if (activeDocId === docId) setActiveDocId('frontmatter-title');
      }
    } catch (e) {}
  };

  const handleCreateBlankChapter = async () => {
    try {
      const res = await fetch(`/api/story/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project._id,
          name: 'Untitled Chapter',
          type: 'manuscript',
          content: ''
        })
      });
      const data = await res.json();
      if (data.document) {
        setDocuments(prev => [data.document, ...prev]);
        const newOrder = [...(project.manuscriptOrder || []), data.document._id];
        setProject(prev => prev ? { ...prev, manuscriptOrder: newOrder } : prev);
        
        // Immediately make it the active doc
        setActiveDocId(data.document._id);
        setDocContent('');
        
        // Save the new project order
        await fetch(`/api/story/projects/${project._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ manuscriptOrder: newOrder })
        });
      }
    } catch (e) {
      console.error('Failed to create blank chapter', e);
    }
  };

  const handleSaveTheme = async (updatedTheme: Partial<Theme>, isNew: boolean) => {
    try {
      let savedTheme: Theme | undefined;
      if (isNew) {
        const res = await fetch('/api/story/themes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTheme)
        });
        const data = await res.json();
        savedTheme = data.theme;
        if (savedTheme) {
          setThemes(prev => [savedTheme!, ...prev]);
        }
      } else {
        const res = await fetch(`/api/story/themes/${updatedTheme._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTheme)
        });
        const data = await res.json();
        savedTheme = data.theme;
        if (savedTheme) {
          setThemes(prev => prev.map(t => t._id === savedTheme!._id ? savedTheme! : t));
        }
      }
      
      // Select the newly saved theme
      if (savedTheme) {
        await handleThemeChange(savedTheme._id);
        setIsEditingTheme(false);
        setEditingThemeDraft(null);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to save theme');
    }
  };

  const selectedTheme = themes.find(t => t._id === project.theme) || themes[0];

  // Helper styles based on selectedTheme
  const getThemeStyles = (theme?: Theme) => {
    if (!theme) return {};
    
    // We add padding equivalent to the margins to simulate the actual printed look on-screen
    return {
      fontFamily: theme.bodyFont,
      fontSize: `${theme.fontSize}pt`,
      lineHeight: theme.lineSpacing,
      textAlign: theme.alignment as any,
    };
  };

  const getHeadingStyles = (theme?: Theme) => {
    if (!theme) return {};
    const weight = (theme.chapterHeadingStyle || '').includes('Bold') ? 'bold' : 'normal';
    const fontStyle = (theme.chapterHeadingStyle || '').includes('Italic') ? 'italic' : 'normal';
    
    return {
      fontFamily: theme.chapterHeadingFont,
      fontSize: `${theme.chapterHeadingSize}pt`,
      textAlign: theme.chapterHeadingAlign as any,
      fontWeight: weight,
      fontStyle: fontStyle,
      width: `${theme.chapterHeadingWidth || 100}%`,
      margin: theme.chapterHeadingAlign === 'center' ? '0 auto' : (theme.chapterHeadingAlign === 'right' ? '0 0 0 auto' : '0'),
    };
  };

  const renderHeadingImage = (theme: Theme) => {
    if (!theme.chapterImageEnabled || !theme.chapterImageGlobalUrl) return null;
    return (
      <div 
        className="my-6" 
        style={{ 
          width: `${theme.chapterImageWidth || 100}%`,
          margin: theme.chapterImageAlign === 'center' ? '1.5rem auto' : (theme.chapterImageAlign === 'right' ? '1.5rem 0 1.5rem auto' : '1.5rem 0'),
          textAlign: theme.chapterImageAlign as any
        }}
      >
        <img src={theme.chapterImageGlobalUrl} alt="" className="max-w-full h-auto inline-block" />
      </div>
    );
  };

  // Handle Export API calls
  const handleExportPDF = () => {
    const printElement = document.getElementById('print-root');
    if (!printElement) {
      alert("Print document is not ready yet.");
      return;
    }

    const customStyles = `
      @page {
        size: ${trimWidth}${trimUnit} ${trimHeight}${trimUnit};
        margin-top: 0.75in;
        margin-bottom: 0.75in;
      }
      @page :left {
        margin-left: ${activePreviewTheme?.marginOutside || 0.5}in;
        margin-right: ${activePreviewTheme?.marginInside || 0.75}in;
        @bottom-center {
          content: counter(page);
          font-family: "${activePreviewTheme?.bodyFont || 'serif'}";
          font-size: 10pt;
        }
        @top-center {
          content: "${project?.authorName || 'AUTHOR'}";
          font-family: "${activePreviewTheme?.chapterHeadingFont || 'serif'}";
          font-size: 8pt;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }
      @page :right {
        margin-left: ${activePreviewTheme?.marginInside || 0.75}in;
        margin-right: ${activePreviewTheme?.marginOutside || 0.5}in;
        @bottom-center {
          content: counter(page);
          font-family: "${activePreviewTheme?.bodyFont || 'serif'}";
          font-size: 10pt;
        }
        @top-center {
          content: "${project?.title || 'TITLE'}";
          font-family: "${activePreviewTheme?.chapterHeadingFont || 'serif'}";
          font-size: 8pt;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }
      
      body {
        font-family: "${activePreviewTheme?.bodyFont || 'serif'}";
        font-size: ${activePreviewTheme?.fontSize ? activePreviewTheme.fontSize + 'pt' : '12pt'};
        line-height: ${activePreviewTheme?.lineSpacing || 1.5};
      }
      h1, h2, h3, h4, h5, h6 { font-family: "${activePreviewTheme?.chapterHeadingFont || 'serif'}"; }
      
      .book-preview-html p {
        margin-bottom: 0;
      }
      .book-preview-html p + p {
        text-indent: ${activePreviewTheme?.indentSize || 0.25}in;
      }
      .book-preview-html p[style*="text-align: right"] { text-align: right; }
      .book-preview-html p[style*="text-align: center"] { text-align: center; }
      .book-preview-html p[style*="text-align: justify"] { text-align: justify; }
    `;

    generatePrintDocument(printElement.innerHTML, customStyles, project?.title || 'Book');
  };

  const handleExportEPUB = async () => {
    try {
      const res = await fetch(`/api/story/projects/${projectId}/export/epub`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'book'}.epub`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to generate EPUB');
      }
    } catch (e) {
      console.error(e);
      alert('Error generating EPUB');
    }
  };

  // Focus Mode Wrapper
  if (isFocusMode && activeDoc) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col">
        <div className="h-14 border-b border-[#1f1f1f] flex items-center justify-between px-6">
          <h2 className="text-slate-400 font-bold">{activeDoc.name}</h2>
          <button 
            onClick={() => setIsFocusMode(false)}
            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm bg-[#1a1a1a] px-3 py-1.5 rounded-lg transition"
          >
            <Minimize2 className="w-4 h-4" /> Exit Focus
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-12">
          <textarea
            className="w-full h-full max-w-3xl mx-auto block bg-transparent resize-none focus:outline-none text-slate-200 text-lg leading-relaxed font-serif"
            value={docContent}
            onChange={handleContentChange}
            placeholder="Start writing..."
          />
        </div>
      </div>
    );
  }

  // Determine the active theme being previewed
  const activePreviewTheme = isEditingTheme ? (editingThemeDraft || selectedTheme) : selectedTheme;

  // Compute aspects and page size for print
  const trimWidth = parseFloat(activePreviewTheme?.trimSize.split(' x ')[0] || '5');
  const trimHeight = parseFloat(activePreviewTheme?.trimSize.split(' x ')[1] || '8');
  const trimUnit = activePreviewTheme?.trimUnit === 'mm' ? 'mm' : 'in';

  return (
    <div className="book-builder-root flex flex-col h-full w-full bg-[#0a0a0a]">
      
      {/* FULL BOOK PRINT CONTAINER (Hidden on screen, used only as a data source for the universal print utility) */}
      {isMounted && typeof document !== 'undefined' && createPortal(
        <div id="print-root" className="hidden w-full bg-white text-black m-0 p-0" style={{
           fontFamily: activePreviewTheme?.bodyFont,
           fontSize: activePreviewTheme?.fontSize ? `${activePreviewTheme.fontSize}pt` : '12pt',
           lineHeight: activePreviewTheme?.lineSpacing || 1.5,
           color: 'black'
        }}>
           {/* Title Page */}
           <div style={{ padding: '1in', breakAfter: 'page', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <h1 className="text-5xl font-serif mb-4 text-black" style={{ fontFamily: activePreviewTheme?.chapterHeadingFont }}>{project?.title || 'Untitled Book'}</h1>
              {project?.subtitle && <h2 className="text-2xl font-serif italic mb-16 text-black">{project.subtitle}</h2>}
              <div className="text-xl font-serif mb-16 text-black">{project?.authorName}</div>
              <div className="mt-auto pt-32 text-sm text-black">
                 {project?.publisherName}<br/>
                 {project?.publisherLink}
              </div>
           </div>

           {/* Copyright Page */}
           <div className="page-break-after w-full" style={{ 
              padding: '1in', 
              fontSize: '0.8em', 
              breakAfter: 'page',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
           }}>
              <div dangerouslySetInnerHTML={{ __html: project?.copyrightText || '' }} />
           </div>

           {/* Table of Contents */}
           <div className="page-break-after w-full" style={{ padding: '1in', breakAfter: 'page' }}>
              <h2 className="text-4xl font-serif mb-12 text-center uppercase tracking-widest" style={{ fontFamily: activePreviewTheme?.chapterHeadingFont }}>Table of Contents</h2>
              <div className="space-y-6 max-w-2xl mx-auto">
                 {orderedDocs.map((doc, idx) => (
                   <div key={doc._id} className="flex justify-between font-serif text-lg text-black">
                      <span>Chapter {idx + 1}: {doc.name}</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Chapters */}
           {orderedDocs.map((doc, idx) => (
             <div key={doc._id} className="page-break-before" style={{ breakBefore: 'page' }}>
               <div className="mb-12 mt-8 flex flex-col">
                 {activePreviewTheme?.chapterNumberEnabled && (
                   <div className="text-xl tracking-widest font-bold mb-4 uppercase text-black" style={{ textAlign: activePreviewTheme.chapterHeadingAlign as any, fontFamily: activePreviewTheme.chapterHeadingFont }}>
                     Chapter {idx + 1}
                   </div>
                 )}
                 {activePreviewTheme?.chapterTitleEnabled && (!activePreviewTheme?.chapterNumberEnabled || !isChapterTitleDuplicate(doc.name, idx + 1)) && (
                   <h2 className="uppercase tracking-widest leading-tight text-black" style={getHeadingStyles(activePreviewTheme)}>
                     {doc.name}
                   </h2>
                 )}
               </div>
               <div 
                 className={`book-preview-html text-sm text-black ${activePreviewTheme?.chapterHeadingDropCap ? 'first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:leading-none' : ''}`}
                 dangerouslySetInnerHTML={{ __html: doc.content ? (doc.content.includes('<p>') ? doc.content : doc.content.split('\n\n').filter(Boolean).map((p: string) => `<p>${p}</p>`).join('')) : '' }} 
               />
             </div>
           ))}
        </div>, document.body
      )}

      {/* Top Nav (Atticus Style) */}
      <div className="book-builder-ui h-14 border-b border-[#1f1f1f] bg-[#121212] flex items-center justify-center relative shrink-0">
        <div className="flex bg-[#1a1a1a] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${activeTab === 'details' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Book Details
          </button>
          <button
            onClick={() => setActiveTab('writing')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${activeTab === 'writing' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Writing
          </button>
          <button
            onClick={() => setActiveTab('formatting')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${activeTab === 'formatting' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Formatting
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        
        {/* BOOK DETAILS TAB */}
        {activeTab === 'details' && (
          <div className="flex-1 overflow-y-auto p-8 flex justify-center">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column: Form */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-[#121212] border border-[#1f1f1f] p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-6">Book Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Book Title</label>
                      <input 
                        value={project?.title || ''} onChange={(e) => setProject(prev => prev ? { ...prev, title: e.target.value } : prev)}
                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subtitle</label>
                      <input 
                        value={project?.subtitle || ''} onChange={(e) => setProject(prev => prev ? { ...prev, subtitle: e.target.value } : prev)}
                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Author</label>
                      <input 
                        value={project?.authorName || ''} onChange={(e) => setProject(prev => prev ? { ...prev, authorName: e.target.value } : prev)}
                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div className="pt-4">
                      <button onClick={handleSaveDetails} disabled={isSaving} className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Cover & Stats */}
              <div className="space-y-6">
                <div className="bg-[#121212] border border-[#1f1f1f] p-6 rounded-2xl flex flex-col items-center text-center">
                  <h3 className="text-sm font-bold text-white mb-4 self-start">Book Cover</h3>
                  {coverImage ? (
                    <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-[#333] mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverImage} alt="Cover" className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className="w-full aspect-[2/3] rounded-lg bg-[#1a1a1a] border border-[#333] flex flex-col items-center justify-center text-slate-500 mb-4">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-xs">No Cover Image</span>
                    </div>
                  )}
                  <input 
                    value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="Cover Image URL..."
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="bg-[#121212] border border-[#1f1f1f] p-6 rounded-2xl">
                  <h3 className="text-sm font-bold text-white mb-4">Book Statistics</h3>
                  <div className="flex items-center gap-4">
                    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4 flex-1">
                      <div className="text-2xl font-black text-amber-500">{orderedDocs.length}</div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Chapters</div>
                    </div>
                    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4 flex-1">
                      <div className="text-2xl font-black text-amber-500">
                        {orderedDocs.reduce((acc, doc) => acc + (doc.content?.split(/\s+/).filter(w => w.length > 0).length || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Words</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#121212] border border-[#1f1f1f] p-6 rounded-2xl">
                   <h3 className="text-sm font-bold text-white mb-4">Export</h3>
                   <div className="grid grid-cols-2 gap-2">
                     <button onClick={handleExportEPUB} className="bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-600/30 py-2 rounded-lg font-bold text-xs">EPUB</button>
                     <button onClick={handleExportPDF} className="bg-blue-600/20 text-blue-500 border border-blue-500/30 hover:bg-blue-600/30 py-2 rounded-lg font-bold text-xs">PDF</button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WRITING TAB */}
        {activeTab === 'writing' && (
          <div className="book-builder-ui flex-1 flex overflow-hidden">
            {/* Sidebar List */}
            <div className="w-64 border-r border-[#1f1f1f] bg-[#121212] flex flex-col shrink-0 overflow-y-auto p-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">
                Front Matter
              </h4>
              <div className="space-y-1 mb-6">
                <button
                  onClick={() => setActiveDocId('frontmatter-title')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${
                    activeDocId === 'frontmatter-title' ? 'bg-[#1f1f1f] text-amber-500 font-medium border border-[#333]' : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a] border border-transparent'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" /> Title Page
                </button>
                <button
                  onClick={() => setActiveDocId('frontmatter-copyright')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${
                    activeDocId === 'frontmatter-copyright' ? 'bg-[#1f1f1f] text-amber-500 font-medium border border-[#333]' : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a] border border-transparent'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" /> Copyright
                </button>
                <button
                  onClick={() => setActiveDocId('frontmatter-toc')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${
                    activeDocId === 'frontmatter-toc' ? 'bg-[#1f1f1f] text-amber-500 font-medium border border-[#333]' : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a] border border-transparent'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" /> Contents
                </button>
              </div>

              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                Body / Chapters
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-[#1f1f1f] px-1.5 py-0.5 rounded">{orderedDocs.length}</span>
                  <button 
                    onClick={handleCreateBlankChapter}
                    className="text-amber-500 bg-amber-500/10 p-1 rounded hover:bg-amber-500/20 transition"
                    title="Add Blank Chapter"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </h4>
              <div className="space-y-1">
                <DragDropContext onDragEnd={async (result: DropResult) => {
                  if (!result.destination) return;
                  const items = Array.from(orderedDocs.map(d => d._id));
                  const [reorderedItem] = items.splice(result.source.index, 1);
                  items.splice(result.destination.index, 0, reorderedItem);
                  
                  setProject(prev => prev ? { ...prev, manuscriptOrder: items } : prev);
                  
                  try {
                    await fetch(`/api/story/projects/${project._id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ manuscriptOrder: items })
                    });
                  } catch (e) {
                    console.error(e);
                  }
                }}>
                  <Droppable droppableId="manuscript">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                        {orderedDocs.map((doc, index) => (
                          <Draggable key={doc._id} draggableId={doc._id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between group ${
                                  activeDocId === doc._id ? 'bg-[#1f1f1f] text-amber-500 font-medium border border-[#333]' : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a] border border-transparent'
                                }`}
                              >
                                <button
                                  className="flex-1 text-left truncate outline-none"
                                  onClick={() => {
                                    setActiveDocId(doc._id);
                                    setDocContent(doc.content || '');
                                  }}
                                >
                                  {doc.name}
                                </button>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div onClick={(e) => handleRemoveFromManuscript(doc._id, e)} className="text-red-500 hover:text-red-400 p-1 bg-[#2a2a2a] rounded cursor-pointer">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                  </div>
                                  <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-white p-1">
                                    <GripVertical className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                {orderedDocs.length === 0 && (
                  <div className="text-xs text-slate-600 p-2 text-center">No manuscript chapters yet. Add one from below.</div>
                )}
              </div>

              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mt-8 mb-2 flex items-center justify-between border-t border-[#1f1f1f] pt-6">
                Available Documents
                <span className="text-[9px] bg-[#1f1f1f] px-1.5 py-0.5 rounded">{documents.filter(d => d.type !== 'manuscript').length}</span>
              </h4>
              <div className="space-y-1">
                {documents.filter(d => d.type !== 'manuscript').map(doc => (
                  <div key={doc._id} className="flex items-center justify-between group px-3 py-2 text-sm text-slate-500 hover:bg-[#1a1a1a] rounded-lg transition">
                    <div className="flex flex-col truncate pr-2">
                      <span className="truncate group-hover:text-slate-300">{doc.name}</span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-600">{doc.type}</span>
                    </div>
                    <button 
                      onClick={() => handleMoveToManuscript(doc._id)} 
                      className="text-amber-500 bg-amber-500/10 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-500/20"
                      title="Add to Manuscript"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {documents.filter(d => d.type !== 'manuscript').length === 0 && (
                  <div className="text-xs text-slate-600 p-2 text-center">No other documents found in this project.</div>
                )}
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 bg-[#0a0a0a] flex flex-col relative">
              {activeDocId === 'frontmatter-title' ? (
                <div className="flex-1 overflow-y-auto bg-[#f8f9fa] p-8 flex justify-center">
                  <div className="bg-white max-w-[800px] w-full shadow-md border border-slate-200 min-h-full px-12 py-16 text-center text-slate-800 flex flex-col items-center justify-center">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-12">Title Page</div>
                    
                    <div className="w-full mb-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
                      <input 
                        className="w-full text-center text-4xl font-serif border-b border-transparent hover:border-slate-200 focus:border-amber-500 bg-transparent outline-none transition px-4 py-2"
                        value={project.title} 
                        onChange={(e) => {
                          setProject(prev => prev ? { ...prev, title: e.target.value } : prev);
                          // debounced save omitted here for brevity, assume handleSaveDetails handles this elsewhere or add simple save
                        }}
                        placeholder="Untitled Book"
                      />
                    </div>

                    <div className="w-full mb-12">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Subtitle</label>
                      <input 
                        className="w-full text-center text-xl font-serif italic border-b border-transparent hover:border-slate-200 focus:border-amber-500 bg-transparent outline-none transition px-4 py-2"
                        value={project.subtitle || ''} 
                        onChange={(e) => setProject(prev => prev ? { ...prev, subtitle: e.target.value } : prev)}
                        placeholder="-"
                      />
                    </div>

                    <div className="w-full mb-12">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Author</label>
                      <input 
                        className="w-full text-center text-lg font-serif border-b border-transparent hover:border-slate-200 focus:border-amber-500 bg-transparent outline-none transition px-4 py-2"
                        value={project.authorName || ''} 
                        onChange={(e) => setProject(prev => prev ? { ...prev, authorName: e.target.value } : prev)}
                        placeholder="Author Name"
                      />
                    </div>

                    <div className="mt-auto pt-24 w-full">
                      <div className="mb-4">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Publisher Name</label>
                        <input 
                          className="w-full text-center text-sm font-serif border-b border-transparent hover:border-slate-200 focus:border-amber-500 bg-transparent outline-none transition px-4 py-1"
                          value={project.publisherName || ''} 
                          onChange={(e) => setProject(prev => prev ? { ...prev, publisherName: e.target.value } : prev)}
                          placeholder="Publisher Name"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Publisher Link</label>
                        <input 
                          className="w-full text-center text-sm font-serif border-b border-transparent hover:border-slate-200 focus:border-amber-500 bg-transparent outline-none transition px-4 py-1"
                          value={project.publisherLink || ''} 
                          onChange={(e) => setProject(prev => prev ? { ...prev, publisherLink: e.target.value } : prev)}
                          placeholder="-"
                        />
                      </div>
                      
                      <button onClick={handleSaveDetails} className="mt-8 text-xs font-bold bg-amber-500 text-white px-4 py-2 rounded shadow hover:bg-amber-600 transition">
                        Save Details
                      </button>
                    </div>
                  </div>
                </div>
              ) : activeDocId === 'frontmatter-copyright' ? (
                <div className="flex-1 overflow-hidden">
                   <RichTextEditor 
                     key="frontmatter-copyright"
                     content={(project.copyrightText || '').includes('<p>') ? project.copyrightText! : (project.copyrightText || '').split('\n\n').filter(Boolean).map(p => `<p>${p}</p>`).join('')} 
                     onChange={(html) => {
                        setProject(prev => prev ? { ...prev, copyrightText: html } : prev);
                        // Save to backend omitted for typing speed, they can click Save Details in Title Page, or we add debounced save
                     }} 
                     title="Copyright"
                   />
                   <div className="absolute top-4 right-8 z-50">
                     <button onClick={handleSaveDetails} className="text-xs font-bold bg-amber-500 text-white px-4 py-2 rounded shadow hover:bg-amber-600 transition">Save Copyright</button>
                   </div>
                </div>
              ) : activeDocId === 'frontmatter-toc' ? (
                <div className="flex-1 overflow-y-auto bg-[#f8f9fa] p-8 flex justify-center">
                  <div className="bg-white max-w-[800px] w-full shadow-md border border-slate-200 min-h-full px-12 py-16 text-slate-800">
                    <h2 className="text-3xl font-serif border-b border-slate-200 pb-4 mb-8">Table of contents</h2>
                    <div className="flex gap-12">
                      <div className="flex-1 space-y-4">
                        {orderedDocs.map((doc, idx) => (
                          <div key={doc._id} className="flex justify-between font-serif text-lg">
                            <span>Chapter {idx + 1}</span>
                            {/* In a real print, there's dotted lines and page numbers */}
                          </div>
                        ))}
                      </div>
                      <div className="w-64 bg-slate-50 p-6 rounded-lg border border-slate-200 self-start">
                        <h4 className="font-bold text-sm mb-4">Settings</h4>
                        <div className="space-y-3 text-sm">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-slate-300" />
                            <span>Show subtitles</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-slate-300" />
                            <span>List subheads</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeDoc ? (
                <>
                  <div className="h-12 border-b border-[#1f1f1f] flex items-center justify-between px-6 bg-[#0a0a0a] shrink-0">
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-300">
                      {activeDoc.name}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-slate-500 flex items-center gap-1 bg-[#121212] px-2 py-1 rounded border border-[#1f1f1f]">
                        <BarChart2 className="w-3 h-3" />
                        {docContent.split(/\s+/).filter(w => w.length > 0).length} words
                      </div>
                      <button 
                        onClick={() => setIsFocusMode(true)}
                        className="text-slate-400 hover:text-amber-500 transition flex items-center gap-1 text-xs bg-[#121212] px-2 py-1 rounded border border-[#1f1f1f]"
                      >
                        <Maximize2 className="w-3 h-3" /> Focus
                      </button>
                    </div>
                  </div>
                     <RichTextEditor 
                       key={activeDoc._id}
                       content={(docContent || '').includes('<p>') ? (docContent || '') : (docContent || '').split('\n\n').filter(Boolean).map(p => `<p>${p}</p>`).join('')} 
                       onChange={(html) => handleContentChange({ target: { value: html } } as any)} 
                       title={activeDoc.name}
                       onTitleChange={(newTitle) => handleTitleChange(activeDoc._id, newTitle)}
                       projectId={project._id}
                       documents={documents}
                       setDocuments={setDocuments}
                     />
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                  <AlignLeft className="w-12 h-12 mb-4 opacity-20" />
                  <p>Select a chapter to start writing</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FORMATTING TAB */}
        {activeTab === 'formatting' && (
          <div className="book-builder-ui flex-1 flex overflow-hidden">
            {isEditingTheme && editingThemeDraft ? (
               <div className="w-[60%] border-r border-[#1f1f1f] bg-white shrink-0 h-full overflow-hidden flex flex-col">
                  <ThemeEditor 
                    theme={editingThemeDraft} 
                    onSave={handleSaveTheme} 
                    onCancel={() => {
                      setIsEditingTheme(false);
                      setEditingThemeDraft(null);
                    }} 
                  />
               </div>
            ) : (
              /* Theme Selector */
              <div className="w-80 border-r border-[#1f1f1f] bg-[#121212] flex flex-col shrink-0 p-6 overflow-y-auto">
                <h3 className="text-sm font-bold text-white mb-6">Themes</h3>
                <div className="grid grid-cols-2 gap-4">
                  {themes.map(theme => (
                    <div key={theme._id} className="flex flex-col relative group">
                      <button
                        onClick={() => handleThemeChange(theme._id)}
                        className={`flex flex-col items-center p-4 rounded-xl border-2 transition w-full ${
                          project.theme === theme._id ? 'border-amber-500 bg-amber-500/5' : 'border-[#1f1f1f] bg-[#0a0a0a] hover:border-[#333]'
                        }`}
                      >
                        <div className={`w-16 h-20 bg-white rounded shadow-inner mb-3 flex flex-col items-center p-2 pt-4`} style={{ fontFamily: theme.bodyFont }}>
                          <div className="text-[6px] text-slate-400 font-bold uppercase mb-2">Chapter 1</div>
                          {theme.chapterHeadingDropCap ? (
                            <div className="flex items-start text-black w-full px-1">
                              <span className="text-xl font-bold float-left mr-1 leading-none">O</span>
                              <div className="flex-1 h-1 bg-slate-200 mt-1" />
                            </div>
                          ) : (
                            <div className="w-full px-1 space-y-1 mt-1">
                              <div className="w-full h-0.5 bg-slate-300" />
                              <div className="w-5/6 h-0.5 bg-slate-300" />
                              <div className="w-full h-0.5 bg-slate-300" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-300 text-center line-clamp-1">{theme.name}</span>
                      </button>
                      
                      {project.theme === theme._id && (
                        <button 
                          onClick={() => {
                            setEditingThemeDraft(theme);
                            setIsEditingTheme(true);
                          }}
                          className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview Frame */}
            <div className="flex-1 bg-[#0a0a0a] p-8 flex justify-center items-center overflow-hidden relative print-preview-area">
              {/* Pagination Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 bg-[#121212] p-1.5 rounded-lg border border-[#333] shadow-xl">
                <button 
                  className="p-1.5 hover:bg-[#1f1f1f] rounded text-slate-400 hover:text-white transition disabled:opacity-30" 
                  disabled={currentPage <= 1}
                  onClick={() => {
                    const el = document.getElementById('book-preview-content');
                    if (el) el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' });
                  }}
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <span className="text-xs font-bold text-slate-300 px-2 min-w-[100px] text-center select-none">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="p-1.5 hover:bg-[#1f1f1f] rounded text-slate-400 hover:text-white transition disabled:opacity-30" 
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    const el = document.getElementById('book-preview-content');
                    if (el) el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div 
                className="print-document-container w-full bg-white shadow-2xl relative border border-[#333] transition-all duration-300"
                style={{
                  maxWidth: '600px',
                  height: '80%',
                  aspectRatio: `${trimWidth} / ${trimHeight}`
                }}
              >
                {/* Running Header */}
                <div 
                  className="absolute top-[0.6in] left-0 right-0 text-center font-semibold text-slate-400 z-10 select-none pointer-events-none" 
                  style={{ 
                    fontFamily: activePreviewTheme?.chapterHeadingFont, 
                    fontSize: '0.75rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    paddingLeft: `${activePreviewTheme?.marginInside || 0.75}in`,
                    paddingRight: `${activePreviewTheme?.marginOutside || 0.5}in`,
                    display: currentPage === 1 ? 'none' : 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <span className="w-8"></span>
                  <span className="flex-1 text-center">{project.title || 'UNTITLED BOOK'}</span>
                  <span className="w-8"></span>
                </div>

                {/* Book Preview Content */}
                <div 
                  id="book-preview-content"
                  className="absolute inset-0 bg-white text-black transition-all"
                  onScroll={updatePageNumbers}
                  style={{
                    ...getThemeStyles(isEditingTheme ? (editingThemeDraft || selectedTheme) : selectedTheme),
                    backgroundImage: (activePreviewTheme?.chapterImageEnabled && activePreviewTheme.chapterImagePlacement === 'Background Image' && activePreviewTheme.chapterImageGlobalUrl) ? `url(${activePreviewTheme.chapterImageGlobalUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    columnWidth: '100%',
                    columnGap: `${(parseFloat((activePreviewTheme?.marginInside ?? '0.75').toString()) + parseFloat((activePreviewTheme?.marginOutside ?? '0.5').toString()))}in`,
                    height: '100%',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    scrollSnapType: 'x mandatory',
                    boxSizing: 'border-box',
                    paddingTop: '1.2in',
                    paddingBottom: '1in',
                    paddingLeft: `${activePreviewTheme?.marginInside || 0.75}in`,
                    paddingRight: `${activePreviewTheme?.marginOutside || 0.5}in`,
                  }}
                >
                  {activeDoc ? (
                    <div style={{ scrollSnapAlign: 'start', width: '100%' }}>
                      <div className="mb-12 mt-8 flex flex-col" style={{ breakInside: 'avoid' }}>
                        {activePreviewTheme?.chapterImagePlacement === 'Above Chapter #' && renderHeadingImage(activePreviewTheme)}
                        
                        {activePreviewTheme?.chapterNumberEnabled && (
                          <div className="text-xl tracking-widest font-bold mb-4 uppercase" style={{ textAlign: activePreviewTheme.chapterHeadingAlign as any, fontFamily: activePreviewTheme.chapterHeadingFont }}>
                            Chapter {orderedDocs.findIndex(d => d._id === activeDoc._id) + 1}
                          </div>
                        )}

                        {activePreviewTheme?.chapterImagePlacement === 'Above Chapter Title' && renderHeadingImage(activePreviewTheme)}

                        {activePreviewTheme?.chapterTitleEnabled && (!activePreviewTheme?.chapterNumberEnabled || !isChapterTitleDuplicate(activeDoc.name, orderedDocs.findIndex(d => d._id === activeDoc._id) + 1)) && (
                          <h2 className="uppercase tracking-widest leading-tight" style={getHeadingStyles(activePreviewTheme)}>
                            {activeDoc.name}
                          </h2>
                        )}

                        {activePreviewTheme?.chapterImagePlacement === 'Below Chapter Title' && renderHeadingImage(activePreviewTheme)}

                        {activePreviewTheme?.chapterSubtitleEnabled && (
                          <div className="text-lg italic mt-4" style={{ textAlign: activePreviewTheme.chapterHeadingAlign as any, fontFamily: activePreviewTheme.chapterHeadingFont }}>
                            Subtitle
                          </div>
                        )}

                        {activePreviewTheme?.chapterImagePlacement === 'Below Subtitle' && renderHeadingImage(activePreviewTheme)}
                      </div>
                      
                      <div 
                        className={`book-preview-html text-sm text-slate-800 ${activePreviewTheme?.chapterHeadingDropCap ? 'first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:leading-none' : ''}`}
                        dangerouslySetInnerHTML={{ __html: docContent ? ((docContent || '').includes('<p>') ? docContent : docContent.split('\n\n').filter(Boolean).map(p => `<p>${p}</p>`).join('')) : '' }} 
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 py-20" style={{ breakInside: 'avoid' }}>
                      <Book className="w-12 h-12 mb-4 opacity-20" />
                      <p>Select a chapter to preview formatting</p>
                    </div>
                  )}

                  <style dangerouslySetInnerHTML={{ __html: `
                    #book-preview-content::-webkit-scrollbar {
                      display: none;
                    }
                    #book-preview-content {
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    }
                    .book-preview-html p {
                      margin-bottom: 0;
                    }
                    .book-preview-html p + p {
                      text-indent: ${activePreviewTheme?.indentSize || 0.25}in;
                    }
                    /* Handle custom alignments if specified in Tiptap */
                    .book-preview-html p[style*="text-align: right"] { text-align: right; }
                    .book-preview-html p[style*="text-align: center"] { text-align: center; }
                    .book-preview-html p[style*="text-align: justify"] { text-align: justify; }
                  `}} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute right-8 top-6 flex gap-2 hide-on-print z-10">
                 <button onClick={handleExportPDF} className="bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#333] text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2">
                   <Download className="w-4 h-4" /> Export PDF
                 </button>
                 <button onClick={handleExportEPUB} className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-amber-900/20">
                   <Download className="w-4 h-4" /> Export EPUB
                 </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
