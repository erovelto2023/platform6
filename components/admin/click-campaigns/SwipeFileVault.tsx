"use client";

import React, { useState } from "react";
import {
  BookOpen, Sparkles, Copy, Check, TrendingUp, Award, UserCheck, RefreshCw, Plus,
  HeartHandshake, Filter, Search, Tag, MessageSquare, Video, Mail, FileText, Megaphone,
  ChevronDown, ChevronUp, Star, AlertCircle, Lightbulb, Target, Shield, Clock,
  Share2, Globe, Image as ImageIcon, X,
} from "lucide-react";
import { ClipterBrowser } from "./ClipterBrowser";

// ─── Comprehensive Content Types ──────────────────────────────────────────────
export type ContentType =
  | "headline"
  | "hook"
  | "opening_paragraph"
  | "subheadline"
  | "bullet_point"
  | "call_to_action"
  | "testimonial"
  | "objection"
  | "objection_rebuttal"
  | "pain_point"
  | "benefit"
  | "feature"
  | "guarantee"
  | "urgency_element"
  | "scarcity_element"
  | "social_proof"
  | "story"
  | "case_study"
  | "email_subject_line"
  | "email_preheader"
  | "video_script"
  | "video_hook"
  | "youtube_description"
  | "youtube_tag"
  | "comment"
  | "question"
  | "faq"
  | "competitor_comparison"
  | "industry_insight"
  | "statistic"
  | "roi_example"
  | "customer_feedback"
  | "support_issue"
  | "survey_response";

export type Platform =
  | "facebook"
  | "instagram"
  | "pinterest"
  | "tiktok"
  | "youtube"
  | "google_ads"
  | "linkedin"
  | "twitter"
  | "email"
  | "landing_page"
  | "sales_page"
  | "direct_mail"
  | "sms"
  | "podcast"
  | "blog";

export interface SwipeCopyItem {
  _id?: string;
  title: string;
  contentType: ContentType;
  platform: Platform;
  content: string;
  context?: string;
  source?: string;
  performanceTag: "Winner" | "High CTR" | "High Conversion" | "Testing" | "Draft" | "Archive";
  historicalCtr?: number;
  historicalConversion?: number;
  tags?: string[];
  dateAdded?: string;
  notes?: string;
  framework?: string;
  humanTouchCopy?: string;
}

interface SwipeFileVaultProps {
  copyList: SwipeCopyItem[];
  onSaveCopy: (copyItem: Omit<SwipeCopyItem, "_id">) => void;
  onUpdateCopy?: (id: string, copyItem: Partial<SwipeCopyItem>) => void;
}

export const SwipeFileVault: React.FC<SwipeFileVaultProps> = ({
  copyList,
  onSaveCopy,
  onUpdateCopy,
}) => {
  const [selectedFramework, setSelectedFramework] = useState<string>("All");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [selectedContentType, setSelectedContentType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showClipterBrowser, setShowClipterBrowser] = useState<boolean>(false);

  // AI Co-Pilot Form State
  const [showAiGenerator, setShowAiGenerator] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [productName, setProductName] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("Aspiring entrepreneurs");
  const [chosenFramework, setChosenFramework] = useState<"AIDA" | "PAS" | "FAB">("AIDA");
  const [targetPlatform, setTargetPlatform] = useState<string>("Meta");

  // AI Output & Human Touch State
  const [generatedDraft, setGeneratedDraft] = useState<{
    headline: string;
    rawAiCopy: string;
    callToAction: string;
  } | null>(null);
  const [humanTouchInput, setHumanTouchInput] = useState<string>("");

  // Add New Item Form State
  const [newItem, setNewItem] = useState({
    title: "",
    contentType: "headline" as ContentType,
    platform: "facebook" as Platform,
    content: "",
    context: "",
    source: "",
    tags: "",
    notes: "",
    performanceTag: "Draft" as SwipeCopyItem["performanceTag"],
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateAiCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const res = await fetch("/api/admin/click-campaigns/ai-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: productName || "Launch Accelerator",
          targetAudience,
          framework: chosenFramework,
          platform: targetPlatform,
        }),
      });
      const data = await res.json();
      if (data.success && data.generatedCopy) {
        setGeneratedDraft(data.generatedCopy);
      }
    } catch (err) {
      console.error("Failed to generate AI copy:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveAiDraftToVault = () => {
    if (!generatedDraft) return;

    const finalContent = humanTouchInput.trim()
      ? `${generatedDraft.rawAiCopy}\n\n✨ Human Touch Polish:\n${humanTouchInput}`
      : generatedDraft.rawAiCopy;

    onSaveCopy({
      title: `${productName || "Product"} (${chosenFramework}) - ${targetPlatform}`,
      contentType: "headline",
      platform: targetPlatform.toLowerCase() as Platform,
      content: finalContent,
      context: `Target: ${targetAudience} | Framework: ${chosenFramework}`,
      source: "AI Co-Pilot + Human Touch",
      tags: ["AI Generated", chosenFramework, targetPlatform],
      notes: humanTouchInput ? "Enhanced with personalized Human Touch polish." : "Raw AI Draft",
      performanceTag: "Testing",
      historicalCtr: 3.2,
    });

    setShowAiGenerator(false);
    setGeneratedDraft(null);
    setHumanTouchInput("");
  };

  const filteredCopies = copyList.filter((c) => {
    const matchesFramework = selectedFramework === "All" || c.framework === selectedFramework || c.contentType === selectedFramework.toLowerCase();
    const matchesPlatform = selectedPlatform === "All" || c.platform === selectedPlatform;
    const matchesContentType = selectedContentType === "All" || c.contentType === selectedContentType;
    const matchesSearch = searchQuery === "" ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.context?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFramework && matchesPlatform && matchesContentType && matchesSearch;
  });

  const handleAddNewItem = () => {
    onSaveCopy({
      ...newItem,
      tags: newItem.tags.split(',').map(t => t.trim()).filter(t => t),
      dateAdded: new Date().toISOString(),
    });
    setShowAddModal(false);
    setNewItem({
      title: "",
      contentType: "headline",
      platform: "facebook",
      content: "",
      context: "",
      source: "",
      tags: "",
      notes: "",
      performanceTag: "Draft",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-100">Copy & Headline Vault (Swipe File)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Proven framework templates (AIDA, PAS, FAB) combined with AI Co-Pilot.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-purple-600/20"
          >
            <Plus className="w-4 h-4" /> Add New Swipe
          </button>
          
          <button
            onClick={() => setShowAiGenerator(!showAiGenerator)}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-pink-600/20"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            {showAiGenerator ? "Close Generator" : "AI Co-Pilot"}
          </button>
        </div>
      </div>

      {/* AI Co-Pilot Workflow Box */}
      {showAiGenerator && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10" />

          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h4 className="font-bold text-slate-100">AI Co-Pilot with "Human Touch" Workflow</h4>
            </div>
            <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded font-mono">
              STEP 1: AI DRAFT ➔ STEP 2: HUMAN TOUCH POLISH
            </span>
          </div>

          <form onSubmit={handleGenerateAiCopy} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Product Name</label>
              <input
                type="text"
                placeholder="e.g. Launch Accelerator"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Audience</label>
              <input
                type="text"
                placeholder="e.g. Affiliate Marketers"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Copy Framework</label>
              <select
                value={chosenFramework}
                onChange={(e) => setChosenFramework(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
              >
                <option value="AIDA">AIDA (Attention, Interest, Desire, Action)</option>
                <option value="PAS">PAS (Problem, Agitate, Solution)</option>
                <option value="FAB">FAB (Features, Advantages, Benefits)</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={aiLoading}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-yellow-300" />}
                Generate Draft
              </button>
            </div>
          </form>

          {/* AI Output & Human Touch Editor */}
          {generatedDraft && (
            <div className="space-y-4 pt-4 border-t border-slate-800 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-purple-400 font-bold">
                    <span>1. Raw AI Generated Draft</span>
                    <span className="text-[10px] text-slate-500 font-mono">Framework: {chosenFramework}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{generatedDraft.rawAiCopy}</p>
                </div>

                <div className="bg-slate-950 border border-indigo-900/60 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-indigo-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-pink-400" /> 2. Add Your Personal "Human Touch"
                    </span>
                    <span className="text-[10px] text-pink-400 font-mono">Story / Humor / Angle</span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Add your personal story, humor, brand voice tone, or specific nuance to make it truly authentic..."
                    value={humanTouchInput}
                    onChange={(e) => setHumanTouchInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleSaveAiDraftToVault}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Award className="w-4 h-4" /> Save Final Copy to Swipe Vault
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search swipes, hooks, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48 sm:w-64"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Platform:
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-200"
            >
              <option value="All">All Platforms</option>
              <option value="facebook">Meta (Facebook/IG)</option>
              <option value="tiktok">TikTok Ads</option>
              <option value="pinterest">Pinterest</option>
              <option value="google_ads">Google Ads</option>
              <option value="email">Email</option>
              <option value="landing_page">Landing Page</option>
              <option value="sales_page">Sales Page</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="text-indigo-400 font-bold">{filteredCopies.length}</span> of {copyList.length} swipes
        </div>
      </div>

      {/* Swipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCopies.map((copy) => (
          <div
            key={copy._id || copy.title}
            className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-5 rounded-2xl space-y-4 transition flex flex-col justify-between shadow-lg group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="font-extrabold text-sm text-slate-100 group-hover:text-indigo-300 transition">
                  {copy.title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    copy.performanceTag === "Winner"
                      ? "bg-amber-950 text-amber-300 border border-amber-800/60"
                      : copy.performanceTag === "High CTR"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                      : "bg-slate-950 text-slate-400 border border-slate-800"
                  }`}
                >
                  {copy.performanceTag}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                "{copy.content}"
              </p>

              {copy.context && (
                <p className="text-[11px] text-slate-400 italic">Context: {copy.context}</p>
              )}
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono text-indigo-400">{copy.platform}</span>
                {copy.historicalCtr && (
                  <span className="text-emerald-400 font-bold font-mono flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> {copy.historicalCtr}% CTR
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {copy.tags?.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-slate-950 text-slate-400 rounded text-[9px] font-mono">
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleCopy(copy.content, copy._id || copy.title)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copiedId === (copy._id || copy.title) ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Swipe Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100">Add New Swipe Copy Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Caples Curiosity Piano Hook"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Copy Content *</label>
                <textarea
                  rows={4}
                  placeholder="Type or paste the high-converting copy snippet..."
                  value={newItem.content}
                  onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-bold leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Platform</label>
                  <select
                    value={newItem.platform}
                    onChange={(e) => setNewItem({ ...newItem, platform: e.target.value as Platform })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold"
                  >
                    <option value="facebook">Meta (Facebook/IG)</option>
                    <option value="tiktok">TikTok Ads</option>
                    <option value="pinterest">Pinterest</option>
                    <option value="google_ads">Google Ads</option>
                    <option value="email">Email</option>
                    <option value="landing_page">Landing Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Performance Tag</label>
                  <select
                    value={newItem.performanceTag}
                    onChange={(e) => setNewItem({ ...newItem, performanceTag: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold"
                  >
                    <option value="Winner">Winner 🏆</option>
                    <option value="High CTR">High CTR ⚡</option>
                    <option value="High Conversion">High Conv 💎</option>
                    <option value="Testing">Testing 🧪</option>
                    <option value="Draft">Draft 📝</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="hook, direct-response, curiosity"
                  value={newItem.tags}
                  onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewItem}
                disabled={!newItem.title || !newItem.content}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl font-extrabold shadow-lg shadow-indigo-600/30"
              >
                Save Swipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
