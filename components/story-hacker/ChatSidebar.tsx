'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Plus, X, FileText, LayoutTemplate, Check, FileDown, MessageSquarePlus } from 'lucide-react';

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

interface Template {
  _id: string;
  name: string;
  content: string;
  category?: string;
}

interface Persona {
  _id: string;
  name: string;
  systemPrompt: string;
  isDefault: boolean;
}

interface ChatThread {
  _id: string;
  name: string;
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
}

interface ChatSidebarProps {
  projectId?: string;
  documents?: Document[];
  templates?: Template[];
  onAppendToDocument?: (content: string) => void;
}

export default function ChatSidebar({ projectId, documents = [], templates = [], onAppendToDocument }: ChatSidebarProps) {
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant' | 'system'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('');

  const [showContextModal, setShowContextModal] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    fetchPersonas();
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchChats();
    }
  }, [projectId]);

  // When activeChatId changes, swap the active messages array
  useEffect(() => {
    if (activeChatId) {
      const chat = chats.find(c => c._id === activeChatId);
      if (chat) {
        setMessages(chat.messages || []);
      }
    }
  }, [activeChatId, chats]);

  const fetchPersonas = async () => {
    try {
      const res = await fetch('/api/story/personas');
      if (res.ok) {
        const data = await res.json();
        setPersonas(data.personas || []);
        const defaultPersona = data.personas?.find((p: Persona) => p.isDefault);
        if (defaultPersona) {
          setSelectedPersonaId(defaultPersona._id);
        } else if (data.personas?.length > 0) {
          setSelectedPersonaId(data.personas[0]._id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchChats = async () => {
    try {
      const res = await fetch(`/api/story/chats?projectId=${projectId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.chats && data.chats.length > 0) {
          setChats(data.chats);
          setActiveChatId(data.chats[0]._id);
        } else {
          // Create default chat if none exist
          createNewChat('Chat 1');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createNewChat = async (name: string = `Chat ${chats.length + 1}`) => {
    try {
      const res = await fetch('/api/story/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, name, messages: [] })
      });
      if (res.ok) {
        const data = await res.json();
        setChats(prev => [...prev, data.chat]);
        setActiveChatId(data.chat._id);
        setMessages([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveMessagesToChat = async (chatId: string, msgs: typeof messages) => {
    if (!chatId) return;
    try {
      // Don't save the temporary 'system' blocks that we inject with context docs,
      // just save user and assistant back-and-forth for display
      const displayMsgs = msgs.filter(m => m.role !== 'system');
      
      await fetch(`/api/story/chats/${chatId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: displayMsgs })
      });
      // Update local state without triggering reload
      setChats(prev => prev.map(c => c._id === chatId ? { ...c, messages: displayMsgs } : c));
    } catch (e) {
      console.error('Failed to save chat', e);
    }
  };

  const toggleDocSelection = (docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const toggleTemplateSelection = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) ? prev.filter(id => id !== templateId) : [...prev, templateId]
    );
  };

  const totalContextItems = selectedDocs.length + selectedTemplates.length;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    const currentChatId = activeChatId; // capture for the async flow
    
    // Optimistic UI update
    const userMessageObj = { role: 'user' as const, content: userMsg };
    const newMessages = [...messages, userMessageObj];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Save immediately so user sees it if they refresh before AI finishes
    saveMessagesToChat(currentChatId, newMessages);

    // Build Payload Messages for AI
    const payloadMessages = [];

    // 1. System Prompt from Persona
    const persona = personas.find(p => p._id === selectedPersonaId);
    if (persona && persona.systemPrompt) {
      payloadMessages.push({ role: 'system', content: persona.systemPrompt });
    }

    // 2. Context Documents & Templates
    if (totalContextItems > 0) {
      let contextContent = "Here are the relevant project documents and templates for context:\n\n";
      
      selectedDocs.forEach(docId => {
        const doc = documents.find(d => d._id === docId);
        if (doc) {
          contextContent += `--- Document: ${doc.name} ---\n${doc.content || 'Empty document'}\n\n`;
        }
      });

      selectedTemplates.forEach(templateId => {
        const tpl = templates.find(t => t._id === templateId);
        if (tpl) {
          contextContent += `--- Template: ${tpl.name} ---\n${tpl.content || 'Empty template'}\n\n`;
        }
      });

      payloadMessages.push({ role: 'system', content: contextContent });
    }

    // 3. Chat History (exclude previous injected system context from payload so we don't duplicate it)
    const displayHistory = newMessages.filter(m => m.role !== 'system');
    payloadMessages.push(...displayHistory);

    try {
      const res = await fetch('/api/story/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payloadMessages })
      });

      if (!res.ok) throw new Error('API Error');

      // Initialize empty assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let assistantContent = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkStr = decoder.decode(value, { stream: true });
          const lines = chunkStr.split('\n').filter(l => l.trim());
          
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              if (parsed.message?.content) {
                assistantContent += parsed.message.content;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1].content = assistantContent;
                  return updated;
                });
              }
            } catch (e) {}
          }
        }
        
        // Done streaming, save the final complete message history to DB
        setMessages(prev => {
          saveMessagesToChat(currentChatId, prev);
          return prev;
        });
      }
    } catch (e) {
      console.error(e);
      const errorMsg = [...newMessages, { role: 'assistant' as const, content: 'Oops! Failed to connect to local Ollama.' }];
      setMessages(errorMsg);
      saveMessagesToChat(currentChatId, errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-80 border-l border-[#1f1f1f] bg-[#0a0a0a] flex flex-col shrink-0 hidden lg:flex h-full relative">
      <div className="p-4 border-b border-[#1f1f1f] bg-[#121212] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI Brainstorm
          </h3>
          <div className="flex items-center gap-1">
            <select
              value={activeChatId}
              onChange={e => setActiveChatId(e.target.value)}
              className="bg-[#1a1a1a] border border-[#333] text-slate-300 text-[11px] rounded py-1 px-2 outline-none focus:border-amber-500 transition max-w-[100px]"
            >
              {chats.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
              {chats.length === 0 && <option value="">Loading...</option>}
            </select>
            <button 
              onClick={() => createNewChat()}
              className="p-1 text-slate-400 hover:text-white hover:bg-[#333] rounded transition"
              title="New Chat"
            >
              <MessageSquarePlus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Persona</span>
          <select 
            value={selectedPersonaId}
            onChange={e => setSelectedPersonaId(e.target.value)}
            className="flex-1 bg-[#1a1a1a] border border-[#333] text-slate-300 text-xs rounded py-1 px-2 outline-none focus:border-amber-500 transition"
          >
            {personas.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
            {personas.length === 0 && <option>Loading...</option>}
          </select>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.filter(m => m.role !== 'system').length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-50">
            <Bot className="w-12 h-12 mb-3 text-slate-500" />
            <p className="text-sm text-slate-400">No messages yet</p>
          </div>
        )}
        {messages.filter(m => m.role !== 'system').map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-amber-600'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={`rounded-2xl p-3 text-sm relative group whitespace-pre-wrap leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600/10 text-indigo-100 border border-indigo-500/20' : 'bg-[#1f1f1f] text-slate-200 border border-[#2a2a2a]'}`}>
              {msg.role === 'assistant' && (
                <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition shadow-lg rounded-md">
                  {onAppendToDocument && (
                    <button
                      onClick={() => onAppendToDocument(msg.content)}
                      className="p-1.5 bg-[#2a2a2a] text-amber-500 hover:text-amber-400 hover:bg-[#333] rounded-md border border-[#333] transition"
                      title="Insert into active document"
                    >
                      <FileDown className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => navigator.clipboard.writeText(msg.content)}
                    className="p-1.5 bg-[#2a2a2a] text-slate-400 hover:text-white hover:bg-[#333] rounded-md border border-[#333] transition"
                    title="Copy to clipboard"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </button>
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="rounded-2xl p-3 text-sm bg-[#1f1f1f] text-slate-200 border border-[#2a2a2a] flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[#1f1f1f] bg-[#121212] relative">
        <button 
          onClick={() => setShowContextModal(!showContextModal)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-amber-500 border border-amber-500/30 rounded px-2 py-1 mb-3 hover:bg-amber-500/10 transition"
        >
          <Plus className="w-3 h-3" /> Add context {totalContextItems > 0 && `(${totalContextItems})`}
        </button>

        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask AI about your story..."
            className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition resize-none h-11 min-h-[44px]"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 flex items-center justify-center bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl transition shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Context Selection Modal */}
      {showContextModal && (
        <div className="absolute bottom-24 left-4 right-4 bg-[#1f1f1f] border border-[#333] shadow-2xl rounded-xl overflow-hidden z-50">
          <div className="p-3 border-b border-[#333] flex justify-between items-center bg-[#1a1a1a]">
            <span className="text-xs font-bold text-white">Select Context</span>
            <button onClick={() => setShowContextModal(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            
            {/* Documents Section */}
            {documents.length > 0 && (
              <div className="mb-4">
                <h4 className="text-[10px] uppercase font-bold text-slate-500 px-2 mb-2 tracking-wider">Your Documents</h4>
                <div className="space-y-1">
                  {documents.map(doc => (
                    <button 
                      key={doc._id}
                      onClick={() => toggleDocSelection(doc._id)}
                      className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#2a2a2a] rounded-lg transition group"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-200 group-hover:text-white truncate max-w-[160px]">{doc.name}</span>
                      </div>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${selectedDocs.includes(doc._id) ? 'bg-amber-500 border-amber-500 text-white' : 'border-[#444]'}`}>
                        {selectedDocs.includes(doc._id) && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Templates Section */}
            {templates.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase font-bold text-slate-500 px-2 mb-2 mt-4 tracking-wider">Templates</h4>
                <div className="space-y-4">
                  {Array.from(new Set(templates.map(t => t.category).filter(Boolean))).sort().map(category => (
                    <div key={category} className="space-y-1">
                      <div className="text-[10px] font-bold text-amber-500/70 px-3 py-1 uppercase tracking-wider">{category}</div>
                      {templates.filter(t => t.category === category).map(tpl => (
                        <button 
                          key={tpl._id}
                          onClick={() => toggleTemplateSelection(tpl._id)}
                          className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#2a2a2a] rounded-lg transition group"
                        >
                          <div className="flex items-center gap-2 pl-2">
                            <LayoutTemplate className="w-3.5 h-3.5 text-emerald-500/70" />
                            <span className="text-xs text-slate-300 group-hover:text-white truncate max-w-[150px]">{tpl.name}</span>
                          </div>
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${selectedTemplates.includes(tpl._id) ? 'bg-amber-500 border-amber-500 text-white' : 'border-[#444]'}`}>
                            {selectedTemplates.includes(tpl._id) && <Check className="w-2.5 h-2.5" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                  
                  {/* Uncategorized templates fallback */}
                  {templates.filter(t => !t.category).length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-amber-500/70 px-3 py-1 uppercase tracking-wider">Other</div>
                      {templates.filter(t => !t.category).map(tpl => (
                        <button 
                          key={tpl._id}
                          onClick={() => toggleTemplateSelection(tpl._id)}
                          className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#2a2a2a] rounded-lg transition group"
                        >
                          <div className="flex items-center gap-2 pl-2">
                            <LayoutTemplate className="w-3.5 h-3.5 text-emerald-500/70" />
                            <span className="text-xs text-slate-300 group-hover:text-white truncate max-w-[150px]">{tpl.name}</span>
                          </div>
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${selectedTemplates.includes(tpl._id) ? 'bg-amber-500 border-amber-500 text-white' : 'border-[#444]'}`}>
                            {selectedTemplates.includes(tpl._id) && <Check className="w-2.5 h-2.5" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {documents.length === 0 && templates.length === 0 && (
              <p className="text-xs text-slate-500 text-center p-4">No content available to add.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
