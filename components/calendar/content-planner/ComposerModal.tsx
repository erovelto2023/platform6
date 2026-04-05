'use client';

import { useState, useEffect } from "react";
import { 
  X, Image as ImageIcon, Smile, Hash, Share2, Camera, 
  Calendar, Info, Target, Users, Layout, Zap, Edit3, 
  Paperclip, BarChart, Settings, CheckCircle2, AlertTriangle, RefreshCcw,
  UserPlus, MessageSquare, Trash2, Check, Copy, Plus
} from "lucide-react";
import { createPost, updatePost, deletePost } from "@/lib/actions/content-planner/post.actions";

const PROMPT_TEMPLATES: Record<string, string> = {
  "Blog Post": `Act as a professional content writer. Write a comprehensive blog post based on the following strategy parameters:

**Strategy & Context:**
- **Title:** {{title}}
- **Theme:** {{calendarColor}}
- **Target Audience:** {{targetAudience}}
- **Goal:** {{audienceGoal}}
- **Brand Voice:** {{brandVoice}}
- **Keywords:** {{focusKeywords}}

**Instructions:**
1. Use the {{contentBrief}} to outline the key points.
2. Optimize for SEO using the provided keywords naturally.
3. Ensure the tone matches {{brandVoice}}.
4. Include the following Call to Action at the end: {{cta}}.
5. Keep in mind the KPI goal: {{kpis}}.

**Internal Notes:** {{internalNotes}} (Use this for specific constraints or dos/don'ts).

Output the full article with H2/H3 headers.`,

  "Email Newsletter": `Act as an email marketing specialist. Draft an email newsletter based on these details:

**Campaign Details:**
- **Subject Line Idea:** {{title}}
- **Audience:** {{targetAudience}}
- **Goal:** {{audienceGoal}}
- **Voice:** {{brandVoice}}

**Content Requirements:**
- Use this brief for the body content: {{contentBrief}}
- Include this CTA prominently: {{cta}}
- Reference these keywords for relevance: {{focusKeywords}}

**Constraints:**
- Keep it concise for mobile reading.
- Incorporate feedback from team notes: {{internalNotes}}.

Provide 3 subject line variations and the full email body.`,

  "YouTube Strategy": `Act as a YouTube scriptwriter. Create a detailed video script based on this plan:

**Video Strategy:**
- **Title:** {{title}}
- **Audience:** {{targetAudience}}
- **Goal:** {{audienceGoal}}
- **Voice:** {{brandVoice}}

**Script Requirements:**
- Use this brief for the core content: {{contentBrief}}
- Integrate these keywords for searchability: {{focusKeywords}}
- Include this CTA verbally and visually: {{cta}}
- Consider these assets for visuals: [Media Assets Attached].

**Optimization:**
- Aim for this metric: {{kpis}}.
- Add notes for the editor based on: {{internalNotes}}.

Output: Hook, Intro, Main Points (with visual cues), Outro, CTA.`,

  "LinkedIn Post": `Act as a LinkedIn thought leader. Draft a post optimized for engagement.

**Post Strategy:**
- **Topic:** {{title}}
- **Audience:** {{targetAudience}}
- **Goal:** {{audienceGoal}}
- **Voice:** {{brandVoice}}

**Content:**
- Expand on this brief: {{contentBrief}}
- Include this CTA: {{cta}}
- Use these keywords for SEO: {{focusKeywords}}

**Formatting:**
- Use short paragraphs and whitespace.
- Incorporate team feedback: {{internalNotes}}.
- Suggest 3 relevant hashtags if {{hashtags}} is empty.

Output: The full post text + image suggestion.`,
};

const interpolatePrompt = (type: string, formData: any, business: any) => {
  const brandVoiceStr = Array.isArray(formData.brandVoice) 
    ? formData.brandVoice.join(', ') 
    : (formData.brandVoice || "[Brand Voice]");

  const contentType = formData.contentType || type || "[Content Type]";

  return `Act as a professional content strategist. Create a plan for:
**Topic:** ${formData.title || "[Working Title / Subject]"}
**Content Type:** ${contentType}
**Target Audience:** ${formData.targetAudience || "[Target Audience]"}
**Goal:** ${formData.audienceGoal || "[Audience Goal]"}
**Keywords:** ${formData.focusKeywords || "[Focus Keywords]"}
**Brief:** ${formData.contentBrief || "[Content Brief / Direction]"}
**CTA:** ${formData.cta || "[Call to Action (CTA)]"}
**Brand Voice:** ${brandVoiceStr}

**Generation Volume:**
Generate exactly ${formData.aiScale || 5} distinct, creative, and strategically aligned ideas or draft variations for this specific ${contentType}. Ensure each variation is unique and actionable.`;
};

type WorkflowStage = 'Idea' | 'Brief' | 'Draft' | 'Review' | 'Approved' | 'Scheduled' | 'Published';
type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
type Tab = 'strategy' | 'copy' | 'assets' | 'preview' | 'ai';

export function ComposerModal({ isOpen, onClose, initialDate, initialPost, business }: { 
  isOpen: boolean, 
  onClose: () => void, 
  initialDate?: Date | null,
  initialPost?: any,
  business?: any 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('strategy');

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    contentType: string;
    platforms: string[];
    status: 'Draft' | 'Scheduled' | 'Published';
    scheduledAt: string;
    targetAudience: string;
    audienceGoal: string;
    focusKeywords: string;
    brandVoice: string[];
    workflowStage: WorkflowStage;
    priority: Priority;
    contentBrief: string;
    cta: string;
    internalNotes: string;
    kpis: string;
    calendarColor: string;
    aiScale: number;
  }>({
    title: '',
    description: '', 
    contentType: 'Social Media',
    platforms: [] as string[],
    status: 'Draft',
    scheduledAt: '',
    targetAudience: '',
    audienceGoal: '',
    focusKeywords: '',
    brandVoice: [] as string[],
    workflowStage: 'Idea' as WorkflowStage,
    priority: 'Medium' as Priority,
    contentBrief: '',
    cta: '',
    internalNotes: '',
    kpis: '',
    calendarColor: '#606c38',
    aiScale: 5,
  });

  // Load Initial Data
  useEffect(() => {
    if (initialPost && isOpen) {
      setFormData(prev => ({
        ...prev,
        ...initialPost,
        title: initialPost.title || '',
        description: initialPost.description || '',
        platforms: Array.isArray(initialPost.platforms) ? initialPost.platforms : (prev.platforms || []),
        scheduledAt: initialPost.scheduledAt ? new Date(initialPost.scheduledAt).toISOString().slice(0, 16) : '',
        focusKeywords: Array.isArray(initialPost.focusKeywords) ? initialPost.focusKeywords.join(', ') : (initialPost.focusKeywords || ''),
        brandVoice: Array.isArray(initialPost.brandVoice) ? initialPost.brandVoice : (initialPost.brandVoice ? [initialPost.brandVoice] : []),
      }));
    } else if (initialDate && isOpen && !initialPost) {
      const date = new Date(initialDate);
      date.setHours(12, 0, 0, 0);
      setFormData(prev => ({ 
        ...prev, 
        scheduledAt: date.toISOString().slice(0, 16), 
        status: 'Scheduled', 
        workflowStage: 'Scheduled',
        title: '',
        description: '',
        platforms: [],
        contentBrief: '',
        cta: '',
      }));
    }
  }, [initialDate, initialPost, isOpen]);

  const handleSave = async () => {
    if (!formData.title.trim()) return;
    setIsSubmitting(true);
    
    const preparedData = {
      ...formData,
      focusKeywords: formData.focusKeywords.split(',').map(k => k.trim()).filter(Boolean),
      scheduledFor: formData.scheduledAt ? new Date(formData.scheduledAt) : undefined,
    };

    try {
      const res = initialPost 
        ? await updatePost(initialPost.id, preparedData)
        : await createPost(preparedData);
        
      if (res.success) {
        onClose();
      } else {
        alert(`Failed to save: ${res.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Composer Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPrompt = () => {
    const prompt = interpolatePrompt(formData.contentType, formData, business);
    navigator.clipboard.writeText(prompt);
    alert("AI Strategy Prompt copied to clipboard!");
  };

  const handleDelete = async () => {
    if (!initialPost) return;
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setIsSubmitting(true);
    try {
      const res = await deletePost(initialPost.id);
      if (res.success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-center items-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl relative z-10 flex flex-col h-[90vh] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0 bg-white">
          <div>
             <h2 className="text-xl font-bold text-slate-900 leading-none flex items-center gap-2">
                {initialPost ? `Edit: ${formData.title}` : 'Launch Content Plan'}
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">{activeTab}</span>
             </h2>
             <p className="text-xs text-slate-400 mt-1.5 font-medium">Coordinate your ecosystem strategy and production.</p>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button onClick={() => setActiveTab('strategy')} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'strategy' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Strategy</button>
              <button onClick={() => setActiveTab('copy')} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'copy' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Copy</button>
              <button onClick={() => setActiveTab('assets')} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'assets' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Assets</button>
              <button onClick={() => setActiveTab('ai')} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'ai' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                <Zap className="w-3.5 h-3.5" />
                AI
              </button>
            </nav>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50/20">
          {activeTab === 'strategy' && (
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <div className="max-w-4xl mx-auto space-y-10">
                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-primary">
                     <Edit3 className="w-5 h-5" />
                     <h3 className="text-lg font-bold tracking-tight text-slate-900">Identification</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                       <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Working Title / Goal</label>
                       <input type="text" placeholder="e.g. Scaling with AI Strategy" className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 text-lg font-bold outline-none focus:border-primary transition-all shadow-sm focus:bg-white" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Content Type</label>
                        <select className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white font-bold text-sm" value={formData.contentType} onChange={(e) => setFormData({...formData, contentType: e.target.value})}>
                          <option>Social Media</option>
                          <option>Blog Post</option>
                          <option>Email Newsletter</option>
                          <option>YouTube Video</option>
                          <option>Case Study</option>
                          <option>Podcast</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Publish On</label>
                        <input type="datetime-local" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm font-bold" value={formData.scheduledAt} onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})} />
                    </div>
                  </div>
                </section>

                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Target Audience</label>
                      <input type="text" placeholder="e.g. Entrepreneurs" className="w-full h-11 px-4 rounded-xl border border-slate-100 bg-slate-50/50" value={formData.targetAudience} onChange={(e) => setFormData({...formData, targetAudience: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Goal</label>
                      <input type="text" placeholder="e.g. Direct Bookings" className="w-full h-11 px-4 rounded-xl border border-slate-100 bg-slate-50/50" value={formData.audienceGoal} onChange={(e) => setFormData({...formData, audienceGoal: e.target.value})} />
                   </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'copy' && (
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-white">
              <div className="max-w-4xl mx-auto space-y-10">
                <section>
                  <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-4">Content Brief / Strategy Brief</label>
                  <textarea className="w-full min-h-[140px] p-6 rounded-2xl border-2 border-slate-50 bg-slate-50/30 font-medium text-slate-800 outline-none focus:border-primary focus:bg-white transition-all" placeholder="Outline the core concept..." value={formData.contentBrief} onChange={(e) => setFormData({...formData, contentBrief: e.target.value})}></textarea>
                </section>
                <section>
                  <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-4">Final Caption / Script / Body</label>
                  <textarea className="w-full min-h-[300px] p-8 rounded-3xl border-2 border-slate-50 bg-white font-medium text-slate-800 focus:border-primary transition-all outline-none" placeholder="Draft your content here..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
                     <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-slate-50"><Smile className="w-4 h-4" /> Emojis</button>
                        <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-slate-50"><Hash className="w-4 h-4" /> Hashtags</button>
                     </div>
                     <span className="text-[10px] font-bold text-slate-300">{formData.description?.length || 0} characters</span>
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
             <div className="flex-1 flex items-center justify-center p-20 bg-slate-50/30">
                <div className="text-center space-y-4">
                   <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto border border-slate-100">
                      <ImageIcon className="w-10 h-10 text-slate-200" />
                   </div>
                   <h3 className="font-bold text-slate-900">Creative Hub</h3>
                   <p className="text-xs text-slate-500 max-w-[240px] mx-auto">Drop your images, videos or links here to associate them with this post.</p>
                   <button className="px-6 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-bold hover:bg-slate-50 transition-all uppercase tracking-widest">+ Add Asset</button>
                </div>
             </div>
          )}

          {activeTab === 'ai' && (
            <div className="flex-1 overflow-y-auto p-12 bg-indigo-50/20 custom-scrollbar">
              <div className="max-w-4xl mx-auto">
                 <div className="bg-indigo-900 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl border border-white/10">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 space-y-10">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                             <div className="w-16 h-16 rounded-[22px] bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl">
                                <Zap className="w-8 h-8 text-amber-400 fill-amber-400 shadow-sm" />
                             </div>
                             <div>
                                <h4 className="text-2xl font-black tracking-tight">AI Strategy Composer</h4>
                                <p className="text-xs text-indigo-200 font-bold tracking-widest uppercase mt-1">High-Fidelity Context Generation</p>
                             </div>
                          </div>
                          <button onClick={copyPrompt} className="px-8 py-4 rounded-2xl bg-white text-indigo-900 text-xs font-black hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center gap-3 active:bg-indigo-50">
                             <Copy className="w-5 h-5" />
                             COPY MASTER PROMPT
                          </button>
                       </div>
                       
                       <div className="bg-slate-950/40 backdrop-blur-xl rounded-3xl p-10 border border-white/10 font-mono text-sm leading-relaxed text-indigo-50/90 whitespace-pre-wrap shadow-inner ring-1 ring-white/5">
                          {interpolatePrompt(formData.contentType, formData, business)}
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                             <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-6">Variations Output</p>
                             <div className="flex items-center gap-8">
                                <input type="range" min="1" max="25" step="1" className="flex-1 accent-white" value={formData.aiScale || 5} onChange={(e) => setFormData({...formData, aiScale: parseInt(e.target.value)})} />
                                <span className="text-5xl font-black tracking-tighter opacity-80">{formData.aiScale || 5}</span>
                             </div>
                          </div>
                          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col justify-center">
                             <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-4">Prompt Health</p>
                             <div className="flex items-center gap-4">
                                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                                   <div className={`h-full transition-all duration-700 ${formData.contentBrief?.length > 40 ? 'bg-emerald-400 w-full shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 'bg-amber-400 w-1/3 shadow-[0_0_15px_rgba(251,191,36,0.3)]'}`}></div>
                                </div>
                                <span className="text-[11px] font-black uppercase text-white/60">{formData.contentBrief?.length > 40 ? 'READY' : 'LOW INFO'}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
             <button className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest px-1">
                <Paperclip className="w-4 h-4" />
                Context
             </button>
             <button className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest px-1">
                <BarChart className="w-4 h-4" />
                KPIs
             </button>
          </div>
          <div className="flex items-center gap-4">
             {initialPost && (
                <button 
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="p-3 mx-2 rounded-2xl border border-red-50 text-red-400 hover:bg-red-50 transition-all flex items-center justify-center hover:text-red-600"
                  title="Archive Post"
                >
                  <Trash2 className="w-5 h-5 transition-transform hover:scale-110" />
                </button>
              )}
             <button onClick={onClose} className="px-6 py-3 rounded-2xl text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest">Discard</button>
             <button 
              onClick={handleSave}
              disabled={isSubmitting || !formData.title.trim()}
              className="px-10 py-3.5 rounded-2xl text-[11px] font-black bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:shadow-none transition-all uppercase tracking-widest"
             >
                {isSubmitting ? 'WORKING...' : (initialPost ? 'UPDATE STRATEGY' : 'SYNC TO CALENDAR')}
             </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
