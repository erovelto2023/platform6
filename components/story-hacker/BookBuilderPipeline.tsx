'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, CheckCircle2, Loader2, Sparkles, BrainCircuit, Users, Globe, ListOrdered, BookOpenText, Settings, ArrowLeft, RefreshCw, AlertCircle, Check } from 'lucide-react';

const PIPELINES = [
  { id: 'braindump-to-dossier', label: 'Braindump to Dossier', icon: BrainCircuit, desc: 'Turn raw ideas into a structured dossier.' },
  { id: 'dossier-to-characters', label: 'Dossier to Characters', icon: Users, desc: 'Generate character sheets & relationship maps.' },
  { id: 'dossier-to-worldbuilding', label: 'Dossier to Worldbuilding', icon: Globe, desc: 'Expand world elements with rich detail.' },
  { id: 'outline-generator', label: 'Outline Generator', icon: ListOrdered, desc: 'Chapter-by-chapter mapping with plot sliders.' },
  { id: 'chapter-generator', label: 'Chapter Generator', icon: BookOpenText, desc: 'Full prose chapters with scene briefs & style checks.' }
];

interface Step {
  id: string;
  name: string;
  model: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  content: string;
  time?: string;
  tokens?: number;
  error?: string;
}

export default function BookBuilderPipeline({ projectId }: { projectId: string }) {
  const [activePipeline, setActivePipeline] = useState(PIPELINES[0]);
  const [executionMode, setExecutionMode] = useState<'config' | 'running' | 'completed'>('config');
  const [isRunning, setIsRunning] = useState(false);
  
  // Form State for Braindump to Dossier
  const [logline, setLogline] = useState('');
  const [genre, setGenre] = useState('');
  const [tropes, setTropes] = useState('');

  // Execution State
  const [steps, setSteps] = useState<Step[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll output
  useEffect(() => {
    if (scrollRef.current && executionMode === 'running') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [steps, activeStep, executionMode]);

  const handleRunPipeline = async () => {
    setIsRunning(true);
    setExecutionMode('running');
    setSteps([]);
    setActiveStep(0);
    
    try {
      const res = await fetch('/api/story/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipeline: activePipeline.id,
          projectId,
          inputs: { logline, genre, tropes }
        })
      });

      if (!res.ok) throw new Error('Failed to start pipeline');
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) return;
      
      let currentSteps: Step[] = [];
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        const events = buffer.split('\n\n');
        buffer = events.pop() || ''; // Keep the last incomplete part
        
        for (const event of events) {
          if (!event.startsWith('event: ')) continue;
          
          const eventType = event.split('\n')[0].replace('event: ', '').trim();
          const dataStr = event.split('\n')[1].replace('data: ', '').trim();
          const data = JSON.parse(dataStr);
          
          if (eventType === 'step_start') {
            currentSteps = [...currentSteps];
            currentSteps[data.stepIndex] = {
              id: data.step,
              name: data.name,
              model: data.model,
              status: 'running',
              content: ''
            };
            setSteps(currentSteps);
            setActiveStep(data.stepIndex);
          } else if (eventType === 'step_chunk') {
            currentSteps = [...currentSteps];
            if (currentSteps[data.stepIndex]) {
              currentSteps[data.stepIndex].content = data.text;
              setSteps(currentSteps);
            }
          } else if (eventType === 'step_complete') {
             currentSteps = [...currentSteps];
             if (currentSteps[data.stepIndex]) {
               currentSteps[data.stepIndex].status = 'completed';
               currentSteps[data.stepIndex].time = data.time;
               currentSteps[data.stepIndex].tokens = data.tokens;
               setSteps(currentSteps);
             }
          } else if (eventType === 'step_error') {
             currentSteps = [...currentSteps];
             if (data.stepIndex >= 0 && currentSteps[data.stepIndex]) {
               currentSteps[data.stepIndex].status = 'error';
               currentSteps[data.stepIndex].error = data.error;
               setSteps(currentSteps);
             }
             setIsRunning(false);
             break;
          } else if (eventType === 'pipeline_complete') {
             setExecutionMode('completed');
             setIsRunning(false);
          }
        }
      }
    } catch (e) {
      console.error(e);
      setIsRunning(false);
      setExecutionMode('completed');
    }
  };

  // ==========================================
  // EXECUTION MODE UI
  // ==========================================
  if (executionMode === 'running' || executionMode === 'completed') {
    return (
      <div className="flex flex-col h-full min-h-[600px] w-full bg-[#0a0a0a]">
        {/* Top Progress Bar */}
        <div className="h-16 border-b border-[#1f1f1f] bg-[#121212] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setExecutionMode('config')} className="text-slate-400 hover:text-white transition p-2 hover:bg-[#1f1f1f] rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-white font-bold text-sm">{activePipeline.label}</h2>
              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                {steps.filter(s => s.status === 'completed').length}/{steps.length || 10} steps 
                {executionMode === 'running' ? (
                  <span className="text-amber-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Running</span>
                ) : (
                  <span className="text-emerald-500 flex items-center gap-1"><Check className="w-3 h-3" /> Complete</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             {executionMode === 'completed' && (
                <button onClick={() => setExecutionMode('config')} className="text-amber-500 hover:bg-amber-500/10 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Start Over
                </button>
             )}
          </div>
        </div>
        
        {/* Main Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Execution Steps Sidebar */}
          <div className="w-80 border-r border-[#1f1f1f] bg-[#121212] p-4 overflow-y-auto shrink-0 flex flex-col gap-2">
             {steps.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin mb-3 text-amber-500" />
                  <span className="text-sm font-medium">Initializing AI Agents...</span>
                </div>
             )}
             
             {steps.map((step, idx) => {
               const isActive = activeStep === idx;
               const isCompleted = step.status === 'completed';
               const isRunning = step.status === 'running';
               const isError = step.status === 'error';
               
               return (
                <div 
                  key={step.id + idx} 
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isActive ? 'bg-[#1a1a1a] border-[#444]' : 'bg-[#0a0a0a] border-[#1f1f1f] hover:border-[#333]'
                  }`}
                >
                   <div className="flex justify-between items-start mb-2">
                     <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          isCompleted ? 'bg-emerald-500' : 
                          isRunning ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
                          isError ? 'bg-red-500' : 'bg-slate-700'
                        }`} />
                        <h4 className={`text-[13px] font-bold leading-tight ${isActive || isCompleted ? 'text-white' : 'text-slate-400'}`}>
                          {step.name}
                        </h4>
                     </div>
                     <span className="text-[9px] text-slate-500 font-mono tracking-wider ml-2 shrink-0">{step.model}</span>
                   </div>
                   
                   {(isCompleted || isError) && (
                     <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#1f1f1f] text-[10px] font-bold text-slate-500">
                        {step.time && <span className="flex items-center gap-1">{step.time}</span>}
                        {step.tokens && <span>{step.tokens.toLocaleString()} tokens</span>}
                        {isError && <span className="text-red-400">Failed</span>}
                     </div>
                   )}
                   {isError && step.error && (
                     <div className="mt-2 text-[10px] text-red-400 bg-red-500/10 p-2 rounded">
                       {step.error}
                     </div>
                   )}
                </div>
               );
             })}
          </div>
          
          {/* Main Viewer */}
          <div className="flex-1 bg-[#0a0a0a] relative flex flex-col">
            {steps[activeStep] ? (
              <div className="flex-1 p-8 lg:p-12 overflow-y-auto" ref={scrollRef}>
                 {steps[activeStep].error ? (
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl flex items-start gap-4 max-w-3xl mx-auto">
                      <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                      <div>
                         <h4 className="text-red-500 font-bold">Generation Failed</h4>
                         <p className="text-red-400 text-sm mt-2 leading-relaxed">{steps[activeStep].error}</p>
                      </div>
                    </div>
                 ) : (
                    <div className="prose prose-invert prose-sm max-w-3xl mx-auto">
                       <div className="flex items-center justify-between mb-8 border-b border-[#1f1f1f] pb-4">
                         <h2 className="text-lg font-bold text-slate-300 m-0 flex items-center gap-3">
                           {steps[activeStep].name}
                           {steps[activeStep].status === 'completed' && <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Success</span>}
                         </h2>
                         {steps[activeStep].status === 'completed' && (
                           <button onClick={() => navigator.clipboard.writeText(steps[activeStep].content)} className="text-xs text-slate-500 hover:text-white transition font-medium">Copy output</button>
                         )}
                       </div>
                       
                       <pre className="whitespace-pre-wrap font-sans text-[15px] text-slate-300 leading-loose bg-transparent p-0">
                         {steps[activeStep].content}
                         {steps[activeStep].status === 'running' && (
                           <span className="inline-block w-2.5 h-4 bg-amber-500 ml-1.5 animate-pulse translate-y-0.5" />
                         )}
                       </pre>
                    </div>
                 )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-4">
                 <BrainCircuit className="w-12 h-12 text-[#1f1f1f]" />
                 <p className="text-sm font-medium">Select a step to view its output</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CONFIGURATION MODE UI
  // ==========================================
  return (
    <div className="flex h-full min-h-[600px] w-full bg-[#0a0a0a]">
      {/* Pipeline Steps Sidebar */}
      <div className="w-72 border-r border-[#1f1f1f] bg-[#121212] p-4 space-y-2 overflow-y-auto shrink-0">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-4 px-2">Automations</h4>
        {PIPELINES.map((pipe) => {
          const Icon = pipe.icon;
          const isActive = activePipeline.id === pipe.id;

          return (
            <button
              key={pipe.id}
              onClick={() => setActivePipeline(pipe)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition ${
                isActive ? 'bg-[#1f1f1f] border border-[#333]' : 'hover:bg-[#1a1a1a] border border-transparent'
              }`}
            >
              <div className={`mt-0.5 shrink-0 ${isActive ? 'text-amber-500' : 'text-slate-600'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {pipe.label}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {pipe.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pipeline Configuration Form */}
      <div className="flex-1 flex overflow-hidden">
        
        <div className="w-full max-w-3xl mx-auto border-x border-[#1f1f1f] bg-[#0a0a0a] flex flex-col h-full shadow-2xl">
          <div className="p-8 border-b border-[#1f1f1f] bg-[#121212]">
             <h3 className="text-2xl font-black text-white flex items-center gap-3">
              <Settings className="w-6 h-6 text-amber-500" />
              {activePipeline.label}
            </h3>
            <p className="text-sm text-slate-400 mt-2 font-medium">{activePipeline.desc}</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8">
            {activePipeline.id === 'braindump-to-dossier' ? (
              <div className="space-y-8 max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Primary Genre</label>
                  <div className="relative">
                    <select 
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-4 text-sm text-white font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition appearance-none cursor-pointer"
                    >
                      <option value="">Select Genre...</option>
                      <option value="Epic Fantasy">Epic Fantasy</option>
                      <option value="Sci-Fi Thriller">Sci-Fi Thriller</option>
                      <option value="Dark Romance">Dark Romance</option>
                      <option value="Cozy Fantasy">Cozy Fantasy</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Core Tropes (Optional)</label>
                  <input 
                    type="text"
                    value={tropes}
                    onChange={(e) => setTropes(e.target.value)}
                    placeholder="e.g. Enemies to lovers, Chosen one..."
                    className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-4 text-sm text-white placeholder-slate-600 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Your Braindump</label>
                  <textarea 
                    value={logline}
                    onChange={(e) => setLogline(e.target.value)}
                    placeholder="Dump your raw story ideas, character concepts, world details, plot threads, vibes, anything..."
                    className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition h-48 resize-y leading-relaxed"
                  />
                </div>
              </div>
            ) : (
               <div className="text-center py-16 border border-[#1f1f1f] border-dashed rounded-2xl bg-[#121212] max-w-2xl mx-auto">
                  <activePipeline.icon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h4 className="text-white font-bold mb-2">Automated Execution</h4>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">This pipeline reads the dossier and project history automatically. No manual inputs are required.</p>
               </div>
            )}
            
            <div className="pt-10 max-w-2xl">
              <button
                onClick={handleRunPipeline}
                disabled={activePipeline.id === 'braindump-to-dossier' && !logline}
                className="w-full bg-[#bd7a3a] hover:bg-[#a66a30] disabled:bg-[#1f1f1f] disabled:text-slate-500 text-white px-6 py-5 rounded-xl text-[15px] font-black shadow-[0_0_20px_rgba(189,122,58,0.2)] disabled:shadow-none transition-all flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Pipeline
              </button>
              <p className="text-center text-[11px] text-slate-500 font-medium mt-4">Estimated time: ~45 seconds (10 steps)</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
