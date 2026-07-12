"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { 
  Undo, Redo, Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, 
  Eraser, Settings2, Sparkles, BookOpen, Compass, ChevronRight, UserPlus, Info, Check, BrainCircuit, X
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

// Common non-adverb -ly words
const adverbStopwords = new Set([
  'only', 'early', 'holy', 'family', 'reply', 'apply', 'rely', 'silly', 
  'friendly', 'ugly', 'lonely', 'lovely', 'jelly', 'belly', 'billy', 'lily'
]);

// Standard clichés
const CLICHES = [
  'at the end of the day',
  'read between the lines',
  'twist of fate',
  'clear as crystal',
  'avoid like the plague',
  'in the nick of time',
  'bite the bullet',
  'easier said than done',
  'falling in love',
  'a drop in the ocean'
];

// Passive voice regex helper
const passiveRegex = /\b(am|is|are|was|were|be|been|being)\b\s+(\w+ed|\b(done|seen|gone|taken|known|thrown|written|spoken|chosen|broken|hidden|forgotten|forgiven|slain|drunk|eaten|fallen|blown|drawn|grown|shown|worn|torn|run|swum|begun|spun|struck|sung|sunk|shrunk|stung|wrung))\b/gi;

interface StyleMetrics {
  adverbs: string[];
  passiveVoice: string[];
  longSentences: string[];
  cliches: string[];
  wordCount: number;
}

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  title: string;
  onTitleChange?: (t: string) => void;
  projectId?: string;
  documents?: any[];
  setDocuments?: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  title, 
  onTitleChange,
  projectId,
  documents = [],
  setDocuments
}: RichTextEditorProps) {
  const [showCoach, setShowCoach] = useState(true);
  const [activeTab, setActiveTab] = useState<'style' | 'bible'>('style');
  
  // Style Metrics state
  const [metrics, setMetrics] = useState<StyleMetrics>({
    adverbs: [],
    passiveVoice: [],
    longSentences: [],
    cliches: [],
    wordCount: 0
  });

  // Story Bible Scan State
  const [discoveredNames, setDiscoveredNames] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isAddingChar, setIsAddingChar] = useState<string | null>(null);

  const characterDocs = documents.filter(d => d.type === 'Characters');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      runAnalysis(editor.getText());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] leading-relaxed font-serif text-slate-800',
      },
    },
  });

  // Run style metrics check
  const runAnalysis = (text: string) => {
    if (!text.trim()) {
      setMetrics({ adverbs: [], passiveVoice: [], longSentences: [], cliches: [], wordCount: 0 });
      return;
    }
    const cleanText = text.replace(/<[^>]*>/g, ' '); // Strip HTML tags
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // 1. Adverbs
    const adverbs: string[] = [];
    const adverbMatches = cleanText.match(/\b\w+ly\b/gi) || [];
    adverbMatches.forEach(w => {
      const lower = w.toLowerCase();
      if (!adverbStopwords.has(lower)) {
        adverbs.push(w);
      }
    });

    // 2. Passive Voice
    const passiveVoice: string[] = [];
    let match;
    const regex = new RegExp(passiveRegex);
    while ((match = regex.exec(cleanText)) !== null) {
      passiveVoice.push(match[0]);
    }

    // 3. Long Sentences (> 25 words)
    const sentences = cleanText.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    const longSentences = sentences.filter(s => s.split(/\s+/).length > 25);

    // 4. Clichés
    const cliches: string[] = [];
    CLICHES.forEach(cliche => {
      if (new RegExp(`\\b${cliche}\\b`, 'i').test(cleanText)) {
        cliches.push(cliche);
      }
    });

    setMetrics({ adverbs, passiveVoice, longSentences, cliches, wordCount });
  };

  // Run initial analysis once editor is loaded
  useEffect(() => {
    if (editor) {
      runAnalysis(editor.getText());
    }
  }, [editor]);

  // Scan text for characters (proper nouns)
  const handleScanForCharacters = () => {
    if (!editor) return;
    setIsScanning(true);
    setTimeout(() => {
      const text = editor.getText();
      const matches = text.match(/\b[A-Z][a-z]+\b/g) || [];
      const stopwords = new Set([
        'The', 'He', 'She', 'They', 'It', 'I', 'You', 'We', 'A', 'An', 'And', 'But', 'Or', 'If', 'Then', 'When', 
        'Where', 'Why', 'How', 'My', 'Your', 'His', 'Her', 'Our', 'Their', 'Chapter', 'Copyright', 'Title', 'Page',
        'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'World', 'Dragon', 'Wizards'
      ]);
      
      const existingNames = new Set(characterDocs.map(d => d.name.toLowerCase().trim()));
      
      const uniqueNames = Array.from(new Set(matches))
        .filter(name => !stopwords.has(name) && name.length > 2 && !existingNames.has(name.toLowerCase().trim()));
      
      setDiscoveredNames(uniqueNames);
      setIsScanning(false);
    }, 600);
  };

  // Add character to database
  const handleAddCharacter = async (name: string) => {
    if (!projectId || !name.trim() || !setDocuments) return;
    setIsAddingChar(name);
    try {
      const res = await fetch('/api/story/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name: name.trim(),
          type: 'Characters',
          content: '<h3>Background</h3><p>Describe their origins...</p><h3>Appearance</h3><p>Describe their looks...</p><h3>Personality</h3><p>Describe their traits...</p>'
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.document) {
          setDocuments(prev => [data.document, ...prev]);
          setDiscoveredNames(prev => prev.filter(n => n.toLowerCase() !== name.toLowerCase()));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAddingChar(null);
    }
  };

  if (!editor) return null;

  const ToolbarBtn = ({ isActive = false, onClick, title, children }: any) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded hover:bg-slate-200 transition ${isActive ? 'bg-slate-200 text-blue-600' : 'text-slate-600'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex h-full bg-[#f8f9fa] overflow-hidden relative w-full">
      {/* Main Editor Section */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Toolbar */}
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap gap-1 items-center shrink-0 shadow-sm z-10 sticky top-0">
          <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo className="w-4 h-4" /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo className="w-4 h-4" /></ToolbarBtn>
          
          <div className="w-px h-6 bg-slate-200 mx-2" />
          
          <select 
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'p') editor.chain().focus().setParagraph().run();
              else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
              else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
              else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
            }}
            value={editor.isActive('heading', { level: 1 }) ? 'h1' : editor.isActive('heading', { level: 2 }) ? 'h2' : editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'}
            className="border-none text-sm text-slate-700 font-medium focus:ring-0 cursor-pointer bg-transparent py-1 outline-none"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>
          
          <div className="w-px h-6 bg-slate-200 mx-2" />

          <ToolbarBtn isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
            <Bold className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
            <Italic className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn isActive={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn isActive={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
            <Strikethrough className="w-4 h-4" />
          </ToolbarBtn>

          <div className="w-px h-6 bg-slate-200 mx-2" />

          <ToolbarBtn isActive={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align Left">
            <AlignLeft className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn isActive={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Align Center">
            <AlignCenter className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn isActive={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align Right">
            <AlignRight className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn isActive={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()} title="Justify">
            <AlignJustify className="w-4 h-4" />
          </ToolbarBtn>

          <div className="w-px h-6 bg-slate-200 mx-2" />

          <ToolbarBtn isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
            <List className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn isActive={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered List">
            <ListOrdered className="w-4 h-4" />
          </ToolbarBtn>

          <div className="w-px h-6 bg-slate-200 mx-2" />
          
          <ToolbarBtn onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Clear Formatting">
            <Eraser className="w-4 h-4" />
          </ToolbarBtn>
          
          <div className="flex-1" />
          
          {/* Manuscript Coach Toggle */}
          <button 
            type="button"
            onClick={() => setShowCoach(!showCoach)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
              showCoach 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Style Coach</span>
          </button>
        </div>

        {/* Editor Page Wrapper */}
        <div className="flex-1 overflow-y-auto bg-[#f8f9fa] p-8 flex justify-center">
          <div className="bg-white max-w-[800px] w-full shadow-md border border-slate-200 min-h-full px-12 py-16">
            <div className="text-3xl font-serif text-slate-800 mb-8 border-b border-slate-100 pb-4 flex justify-between items-center">
              {onTitleChange ? (
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  className="bg-transparent border-none outline-none focus:ring-0 p-0 m-0 w-full font-serif placeholder-slate-300"
                  placeholder="Chapter Title..."
                />
              ) : (
                title
              )}
              <button className="text-slate-400 hover:text-blue-500 shrink-0 ml-4"><Settings2 className="w-5 h-5" /></button>
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Manuscript Coach Sidebar */}
      {showCoach && (
        <div className="w-80 border-l border-[#1f1f1f] bg-[#121212] flex flex-col shrink-0 text-slate-200 animate-slide-in h-full">
          {/* Header */}
          <div className="p-4 border-b border-[#1f1f1f] flex items-center justify-between shrink-0 bg-[#0c0c0c]">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-black tracking-wider uppercase text-slate-100">Manuscript Coach</h3>
            </div>
            <button onClick={() => setShowCoach(false)} className="p-1 hover:bg-[#1a1a1a] rounded text-slate-500 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#1f1f1f] shrink-0 bg-[#0e0e0e]">
            <button 
              onClick={() => setActiveTab('style')}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
                activeTab === 'style' 
                  ? 'border-amber-500 text-amber-500 bg-[#121212]' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#151515]'
              }`}
            >
              Style Checklist
            </button>
            <button 
              onClick={() => setActiveTab('bible')}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
                activeTab === 'bible' 
                  ? 'border-amber-500 text-amber-500 bg-[#121212]' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#151515]'
              }`}
            >
              Story Bible ({characterDocs.length})
            </button>
          </div>

          {/* Content Panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {activeTab === 'style' ? (
              <div className="space-y-5">
                {/* Word Metrics Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#181818] p-3 rounded-lg border border-[#222]">
                    <div className="text-[10px] text-slate-500 uppercase font-black">Word Count</div>
                    <div className="text-xl font-black text-white mt-1">{metrics.wordCount}</div>
                  </div>
                  <div className="bg-[#181818] p-3 rounded-lg border border-[#222]">
                    <div className="text-[10px] text-slate-500 uppercase font-black">Reading Time</div>
                    <div className="text-xl font-black text-white mt-1">
                      {Math.ceil(metrics.wordCount / 220)} min
                    </div>
                  </div>
                </div>

                {/* Checklist Items */}
                <div className="space-y-4">
                  {/* Adverbs */}
                  <div className="bg-[#161616] p-3.5 rounded-xl border border-[#222] space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${metrics.adverbs.length > 3 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <h4 className="text-xs font-bold text-slate-200">Adverbs Usage</h4>
                      </div>
                      <span className="text-xs font-mono bg-[#222] px-2 py-0.5 rounded text-slate-300 font-bold">{metrics.adverbs.length} found</span>
                    </div>
                    {metrics.adverbs.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {metrics.adverbs.slice(0, 12).map((adv, idx) => (
                          <span key={adv + idx} className="text-[10px] font-bold bg-[#1a1308] border border-[#bd7a3a]/20 text-amber-400 px-2 py-0.5 rounded">
                            {adv}
                          </span>
                        ))}
                        {metrics.adverbs.length > 12 && (
                          <span className="text-[10px] text-slate-500 font-medium">+{metrics.adverbs.length - 12} more</span>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 leading-normal">Excellent! No excessive adverb usage detected.</p>
                    )}
                  </div>

                  {/* Passive Voice */}
                  <div className="bg-[#161616] p-3.5 rounded-xl border border-[#222] space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${metrics.passiveVoice.length > 2 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <h4 className="text-xs font-bold text-slate-200">Passive Voice</h4>
                      </div>
                      <span className="text-xs font-mono bg-[#222] px-2 py-0.5 rounded text-slate-300 font-bold">{metrics.passiveVoice.length} found</span>
                    </div>
                    {metrics.passiveVoice.length > 0 ? (
                      <div className="space-y-1.5 pt-1">
                        {metrics.passiveVoice.slice(0, 5).map((pv, idx) => (
                          <div key={pv + idx} className="text-[11px] font-medium bg-[#1e1414] border border-red-500/10 text-red-300 p-1.5 rounded flex items-center justify-between">
                            <span className="font-serif">"{pv}"</span>
                            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Use active verb</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 leading-normal">Great! Your prose uses highly active sentences.</p>
                    )}
                  </div>

                  {/* Long Sentences */}
                  <div className="bg-[#161616] p-3.5 rounded-xl border border-[#222] space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${metrics.longSentences.length > 1 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <h4 className="text-xs font-bold text-slate-200">Complex Sentences</h4>
                      </div>
                      <span className="text-xs font-mono bg-[#222] px-2 py-0.5 rounded text-slate-300 font-bold">{metrics.longSentences.length} found</span>
                    </div>
                    {metrics.longSentences.length > 0 ? (
                      <div className="space-y-2 pt-1">
                        {metrics.longSentences.slice(0, 3).map((sent, idx) => (
                          <div key={idx} className="text-[11px] text-slate-400 bg-[#171717] p-2 rounded border border-[#262626] leading-relaxed">
                            "{sent.slice(0, 60)}..."
                            <div className="text-[9px] text-amber-500 mt-1 font-bold">Word count: {sent.split(/\s+/).length} (consider splitting)</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 leading-normal">Your sentences are short, punchy, and readable.</p>
                    )}
                  </div>

                  {/* Clichés */}
                  <div className="bg-[#161616] p-3.5 rounded-xl border border-[#222] space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${metrics.cliches.length > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <h4 className="text-xs font-bold text-slate-200">Clichés</h4>
                      </div>
                      <span className="text-xs font-mono bg-[#222] px-2 py-0.5 rounded text-slate-300 font-bold">{metrics.cliches.length} found</span>
                    </div>
                    {metrics.cliches.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {metrics.cliches.map((cliche, idx) => (
                          <span key={cliche + idx} className="text-[10px] font-bold bg-[#1a1a1a] border border-[#333] text-amber-500 px-2 py-0.5 rounded">
                            {cliche}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 leading-normal">Prose is clean of common literary clichés.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Character Registry */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Cast of Characters</h4>
                  
                  {characterDocs.length === 0 ? (
                    <div className="text-center py-6 border border-[#1f1f1f] border-dashed rounded-xl bg-[#121212] text-slate-500 text-xs">
                      No characters added yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {characterDocs.map((doc: any) => (
                        <div key={doc._id} className="p-3 bg-[#181818] rounded-xl border border-[#222] flex items-center justify-between group hover:border-[#333] transition">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-amber-600/10 border border-amber-500/20 text-amber-500 flex items-center justify-center text-xs font-black select-none">
                              {doc.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white leading-tight">{doc.name}</div>
                              <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Character Doc</div>
                            </div>
                          </div>
                          <Compass className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-500 transition cursor-pointer" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Scanning / Extraction */}
                <div className="pt-4 border-t border-[#1f1f1f] space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Name Scanner</h4>
                    <button 
                      onClick={handleScanForCharacters}
                      disabled={isScanning}
                      className="text-xs text-amber-500 hover:text-amber-400 font-bold transition flex items-center gap-1 bg-amber-500/5 hover:bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
                    >
                      {isScanning ? (
                        <>Scanning...</>
                      ) : (
                        <>Scan Chapter</>
                      )}
                    </button>
                  </div>

                  {discoveredNames.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[10px] text-slate-400">Discovered proper nouns:</div>
                      <div className="max-h-[180px] overflow-y-auto space-y-1.5 pr-1">
                        {discoveredNames.map(name => (
                          <div key={name} className="flex justify-between items-center bg-[#151515] p-2 rounded-lg border border-[#222] hover:border-[#2b2b2b] transition">
                            <span className="text-xs font-medium text-slate-300">{name}</span>
                            <button
                              disabled={isAddingChar === name}
                              onClick={() => handleAddCharacter(name)}
                              className="text-[10px] font-bold text-amber-500 hover:text-white bg-amber-500/10 hover:bg-amber-500 px-2 py-0.5 rounded transition flex items-center gap-0.5 disabled:opacity-40"
                            >
                              <UserPlus className="w-3 h-3" /> Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-in Animations & Prose Rules */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ProseMirror {
          color: #1e293b;
          font-family: inherit;
        }
        .ProseMirror p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
          text-align: justify;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}
