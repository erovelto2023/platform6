'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, Loader2, ArrowLeft, Trash2, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TABS = [
  { id: 'api-key', label: 'API Key & Balance' },
  { id: 'ai-model', label: 'AI Model & Instructions' },
  { id: 'chat-personas', label: 'Chat Personas' },
  { id: 'automation-models', label: 'Automation Models' }
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('chat-personas');
  const [personas, setPersonas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPersona, setEditingPersona] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    systemPrompt: '',
    isDefault: false
  });

  useEffect(() => {
    if (isOpen && activeTab === 'chat-personas') {
      fetchPersonas();
      setEditingPersona(null);
    }
  }, [isOpen, activeTab]);

  const fetchPersonas = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/story/personas');
      if (res.ok) {
        const data = await res.json();
        setPersonas(data.personas || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (persona: any) => {
    setFormData({
      name: persona.name,
      description: persona.description,
      systemPrompt: persona.systemPrompt,
      isDefault: persona.isDefault
    });
    setEditingPersona(persona);
  };

  const handleNew = () => {
    setFormData({
      name: '',
      description: '',
      systemPrompt: '',
      isDefault: false
    });
    setEditingPersona({});
  };

  const handleSave = async () => {
    if (!formData.name || !formData.systemPrompt) return;
    setIsSaving(true);
    try {
      const url = editingPersona._id 
        ? `/api/story/personas/${editingPersona._id}`
        : `/api/story/personas`;
      
      const method = editingPersona._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchPersonas();
        setEditingPersona(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingPersona._id || !confirm('Delete this persona?')) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/story/personas/${editingPersona._id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchPersonas();
        setEditingPersona(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-[#1f1f1f] w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col h-[80vh] max-h-[800px] border border-[#333] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333] shrink-0">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 hover:bg-[#333] rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-64 border-r border-[#333] p-4 shrink-0 overflow-y-auto">
            <div className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setEditingPersona(null);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-[#333] text-white'
                      : 'text-slate-400 hover:text-white hover:bg-[#2a2a2a]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 overflow-y-auto bg-[#1a1a1a]">
            {activeTab === 'chat-personas' && (
              <div className="max-w-3xl">
                {!editingPersona ? (
                  <>
                    <h3 className="text-xl font-bold text-white mb-2">Chat Personas</h3>
                    <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                      A persona sets how the assistant behaves in a chat. You pick one when starting a chat, and your custom instructions still apply on top of it.
                    </p>

                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {personas.map((persona) => (
                          <div 
                            key={persona._id}
                            onClick={() => handleEdit(persona)}
                            className="group bg-[#1a1a1a] border border-[#333] hover:border-[#444] rounded-xl p-4 transition cursor-pointer flex items-start gap-3"
                          >
                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-amber-500 shrink-0 mt-0.5 transition-colors" />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-slate-200 text-sm group-hover:text-white transition">{persona.name}</h4>
                                {persona.isSystem && (
                                  <span className="text-[10px] bg-[#333] text-slate-300 px-2 py-0.5 rounded-md font-medium tracking-wide uppercase">System</span>
                                )}
                                {persona.isDefault && (
                                  <span className="text-[10px] bg-[#bd7a3a]/20 text-[#bd7a3a] px-2 py-0.5 rounded-md font-medium tracking-wide uppercase">Default</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 font-medium">{persona.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <button 
                      onClick={handleNew}
                      className="mt-8 text-sm font-bold text-[#bd7a3a] hover:text-amber-400 transition flex items-center gap-1"
                    >
                      + New persona
                    </button>
                  </>
                ) : (
                  // Form View
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <button 
                      onClick={() => setEditingPersona(null)}
                      className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold mb-6 transition"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Personas
                    </button>

                    <h3 className="text-xl font-bold text-white mb-6">
                      {editingPersona._id ? 'Edit Persona' : 'Create New Persona'}
                    </h3>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Name</label>
                        <input 
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                          className="w-full bg-[#121212] border border-[#333] rounded-lg px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition"
                          placeholder="e.g. Worldbuilding Expert"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
                        <input 
                          type="text"
                          value={formData.description}
                          onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                          className="w-full bg-[#121212] border border-[#333] rounded-lg px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition"
                          placeholder="Brief summary of what this persona does"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">System Prompt</label>
                        <textarea 
                          value={formData.systemPrompt}
                          onChange={e => setFormData(f => ({ ...f, systemPrompt: e.target.value }))}
                          className="w-full bg-[#121212] border border-[#333] rounded-lg px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition h-64 resize-y font-mono text-[13px] leading-relaxed"
                          placeholder="You are a helpful assistant..."
                        />
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={formData.isDefault}
                          onChange={e => setFormData(f => ({ ...f, isDefault: e.target.checked }))}
                          className="w-4 h-4 rounded border-[#333] bg-[#121212] text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-sm font-bold text-slate-300">Set as Default Persona</span>
                      </label>

                      <div className="flex items-center justify-between pt-6 border-t border-[#333]">
                        {editingPersona._id ? (
                          <button 
                            onClick={handleDelete}
                            disabled={isSaving}
                            className="text-red-500 hover:text-red-400 flex items-center gap-2 text-sm font-bold px-4 py-2 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        ) : <div />}

                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setEditingPersona(null)}
                            disabled={isSaving}
                            className="text-slate-400 hover:text-white px-4 py-2 text-sm font-bold transition disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleSave}
                            disabled={!formData.name || !formData.systemPrompt || isSaving}
                            className="bg-[#bd7a3a] hover:bg-[#a66a30] text-white px-6 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50 flex items-center gap-2"
                          >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Persona
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab !== 'chat-personas' && (
              <div className="flex items-center justify-center h-full text-slate-500">
                Content for {TABS.find(t => t.id === activeTab)?.label}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
