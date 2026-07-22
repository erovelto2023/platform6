"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen, Copy, Check, Plus, X, Search, Filter, Zap,
  Lightbulb, Clock, Target, Shield, Users, TrendingUp,
  AlertTriangle, ChevronDown, ChevronUp, RefreshCw,
} from "lucide-react";

export interface PowerWord {
  _id?: string;
  word: string;
  category: string;
  synonyms?: string[];
  examples?: string[];
  psychology: string;
  appUseCase: string;
  isActive: boolean;
}

const CATEGORIES = [
  { value: "urgency_scarcity", label: "Urgency & Scarcity", icon: Clock, color: "red", description: "The 'Now' Trigger - FOMO" },
  { value: "curiosity_mystery", label: "Curiosity & Mystery", icon: Lightbulb, color: "purple", description: "The 'Gap' Trigger" },
  { value: "ease_speed", label: "Ease & Speed", icon: Zap, color: "blue", description: "The 'Friction Remover'" },
  { value: "trust_authority", label: "Trust & Authority", icon: Shield, color: "emerald", description: "The 'Safety' Trigger" },
  { value: "exclusivity_belonging", label: "Exclusivity & Belonging", icon: Users, color: "amber", description: "The 'Tribe' Trigger" },
  { value: "value_gain", label: "Value & Gain", icon: TrendingUp, color: "green", description: "The 'Greed/Benefit' Trigger" },
  { value: "fear_pain", label: "Fear & Pain", icon: AlertTriangle, color: "orange", description: "The 'Problem Agitation' Trigger" },
];

const CATEGORY_COLORS = {
  red: { bg: "bg-red-950", border: "border-red-800", text: "text-red-400" },
  purple: { bg: "bg-purple-950", border: "border-purple-800", text: "text-purple-400" },
  blue: { bg: "bg-blue-950", border: "border-blue-800", text: "text-blue-400" },
  emerald: { bg: "bg-emerald-950", border: "border-emerald-800", text: "text-emerald-400" },
  amber: { bg: "bg-amber-950", border: "border-amber-800", text: "text-amber-400" },
  green: { bg: "bg-green-950", border: "border-green-800", text: "text-green-400" },
  orange: { bg: "bg-orange-950", border: "border-orange-800", text: "text-orange-400" },
};

export const PowerWordsReference: React.FC = () => {
  const [powerWords, setPowerWords] = useState<PowerWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<PowerWord | null>(null);

  const [newWord, setNewWord] = useState({
    word: "",
    category: "urgency_scarcity",
    psychology: "",
    appUseCase: "",
    examples: [] as string[],
  });

  useEffect(() => {
    fetchPowerWords();
  }, []);

  const fetchPowerWords = async () => {
    try {
      setLoading(true);
      // Initialize with default data if empty
      await fetch("/api/admin/click-campaigns/powerwords?initialize=true");
      
      const response = await fetch("/api/admin/click-campaigns/powerwords");
      const data = await response.json();
      if (data.success) {
        setPowerWords(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch power words:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyWord = (word: string) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 2000);
  };

  const addWord = async () => {
    try {
      const response = await fetch("/api/admin/click-campaigns/powerwords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newWord,
          isActive: true,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchPowerWords();
        setShowAddModal(false);
        setNewWord({
          word: "",
          category: "urgency_scarcity",
          psychology: "",
          appUseCase: "",
          examples: [],
        });
      }
    } catch (error) {
      console.error("Failed to add word:", error);
    }
  };

  const deleteWord = async (id: string) => {
    try {
      await fetch(`/api/admin/click-campaigns/powerwords/${id}`, {
        method: "DELETE",
      });
      await fetchPowerWords();
    } catch (error) {
      console.error("Failed to delete word:", error);
    }
  };

  const filteredWords = powerWords.filter(word => {
    const matchesCategory = selectedCategory === "all" || word.category === selectedCategory;
    const matchesSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (word.synonyms?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const wordsByCategory = CATEGORIES.reduce((acc, category) => {
    acc[category.value] = powerWords.filter(w => w.category === category.value);
    return acc;
  }, {} as Record<string, PowerWord[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-slate-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-slate-100">Power Words Reference</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Psychological trigger words for high-converting copy
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Add New Word
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search words..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {selectedCategory === "all" ? (
        <div className="space-y-4">
          {CATEGORIES.map((category) => {
            const categoryWords = wordsByCategory[category.value] || [];
            if (categoryWords.length === 0) return null;

            const Icon = category.icon;
            const colors = CATEGORY_COLORS[category.color as keyof typeof CATEGORY_COLORS];
            const isExpanded = expandedCategory === category.value;

            return (
              <div key={category.value} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.value)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border}`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-bold text-slate-100">{category.label}</h4>
                      <p className="text-[10px] text-slate-500">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500">{categoryWords.length} words</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 border-t border-slate-800">
                    <div className="flex flex-wrap gap-2">
                      {categoryWords.map((word) => (
                        <div
                          key={word._id}
                          className="group relative"
                        >
                          <button
                            onClick={() => copyWord(word.word)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                              copiedWord === word.word
                                ? "bg-emerald-950 border-emerald-700 text-emerald-300"
                                : `${colors.bg} ${colors.border} ${colors.text} hover:opacity-80`
                            }`}
                          >
                            {copiedWord === word.word ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              word.word
                            )}
                          </button>
                          <button
                            onClick={() => setSelectedWord(word)}
                            className="absolute -top-2 -right-2 p-1 bg-slate-800 rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <Lightbulb className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredWords.map((word) => {
            const category = CATEGORIES.find(c => c.value === word.category);
            const colors = category ? CATEGORY_COLORS[category.color as keyof typeof CATEGORY_COLORS] : CATEGORY_COLORS.blue;
            const Icon = category?.icon || Lightbulb;

            return (
              <div
                key={word._id}
                className={`bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border}`}>
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{word.word}</h4>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] ${colors.bg} ${colors.border} ${colors.text}`}>
                        {category?.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyWord(word.word)}
                      className="p-2 hover:bg-slate-800 rounded-lg transition"
                      title="Copy word"
                    >
                      {copiedWord === word.word ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>
                    <button
                      onClick={() => deleteWord(word._id!)}
                      className="p-2 hover:bg-slate-800 rounded-lg transition"
                      title="Delete word"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-3 h-3 text-purple-400" />
                      <span className="text-[10px] font-semibold text-purple-300">Psychology</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{word.psychology}</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-3 h-3 text-blue-400" />
                      <span className="text-[10px] font-semibold text-blue-300">App Use Case</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{word.appUseCase}</p>
                  </div>

                  {word.examples && word.examples.length > 0 && (
                    <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-3 h-3 text-amber-400" />
                        <span className="text-[10px] font-semibold text-amber-300">Examples</span>
                      </div>
                      <div className="space-y-1">
                        {word.examples.map((example, idx) => (
                          <p key={idx} className="text-[10px] text-slate-400 italic">"{example}"</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {word.synonyms && word.synonyms.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {word.synonyms.map((synonym, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-950 border border-slate-700 rounded-md text-[10px] text-slate-400">
                          {synonym}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full">
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-950 border border-blue-800 rounded-xl">
                    <Plus className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Add New Power Word</h3>
                    <p className="text-xs text-slate-400">Expand your power words database</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-800 rounded-lg transition">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Word *</label>
                  <input
                    type="text"
                    value={newWord.word}
                    onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                    placeholder="e.g. Amazing"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category *</label>
                  <select
                    value={newWord.category}
                    onChange={(e) => setNewWord({ ...newWord, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Psychology *</label>
                  <textarea
                    value={newWord.psychology}
                    onChange={(e) => setNewWord({ ...newWord, psychology: e.target.value })}
                    placeholder="Explain the psychological trigger..."
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">App Use Case *</label>
                  <textarea
                    value={newWord.appUseCase}
                    onChange={(e) => setNewWord({ ...newWord, appUseCase: e.target.value })}
                    placeholder="When to use this word..."
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Examples (comma separated)</label>
                  <input
                    type="text"
                    value={newWord.examples.join(", ")}
                    onChange={(e) => setNewWord({ ...newWord, examples: e.target.value.split(", ").filter(Boolean) })}
                    placeholder="e.g. Example 1, Example 2"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addWord}
                  disabled={!newWord.word || !newWord.psychology || !newWord.appUseCase}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition"
                >
                  Add Word
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedWord && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100">{selectedWord.word}</h3>
                <button onClick={() => setSelectedWord(null)} className="p-2 hover:bg-slate-800 rounded-lg transition">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-3 h-3 text-purple-400" />
                    <span className="text-[10px] font-semibold text-purple-300">Psychology</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{selectedWord.psychology}</p>
                </div>

                <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-3 h-3 text-blue-400" />
                    <span className="text-[10px] font-semibold text-blue-300">App Use Case</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{selectedWord.appUseCase}</p>
                </div>

                {selectedWord.examples && selectedWord.examples.length > 0 && (
                  <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] font-semibold text-amber-300">Examples</span>
                    </div>
                    <div className="space-y-1">
                      {selectedWord.examples.map((example, idx) => (
                        <p key={idx} className="text-[10px] text-slate-400 italic">"{example}"</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  copyWord(selectedWord.word);
                  setSelectedWord(null);
                }}
                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" /> Copy Word
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
