"use client";

import React, { useState } from "react";
import {
  BookOpen, Sparkles, Copy, Check, TrendingUp, Award, UserCheck, RefreshCw, Plus,
  HeartHandshake, Filter, Search, Tag, MessageSquare, Video, Mail, FileText, Megaphone,
  ChevronDown, ChevronUp, Star, AlertCircle, Lightbulb, Target, Shield, Clock,
  Share2, Globe, Image as ImageIcon, X,
} from "lucide-react";

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

      if (data.success) {
        setGeneratedDraft({
          headline: data.headline,
          rawAiCopy: data.rawAiCopy,
          callToAction: data.callToAction,
        });
        setHumanTouchInput(
          `💡 Founder Insight: When I first tested this approach, our CTR jumped 40%. The key was staying authentic!`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveDraftWithHumanTouch = () => {
    if (!generatedDraft) return;

    onSaveCopy({
      title: `${chosenFramework} Ad Copy - ${productName || "Offer"}`,
      contentType: "headline",
      platform: targetPlatform as Platform,
      content: generatedDraft.rawAiCopy,
      context: `Framework: ${chosenFramework}`,
      framework: chosenFramework,
      humanTouchCopy: humanTouchInput,
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
            Proven framework templates (AIDA, PAS, FAB) combined with AI Co-Pilot & your unique Human Touch.
          </p>
        </div>

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

      {/* AI Co-Pilot Workflow Box */}
      {showAiGenerator && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10" />

          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h4 className="font-bold text-slate-100">AI Co-Pilot with "Human Touch" Workflow</h4>
            </div>
            <span className="text-xs text-purple-300 bg-purple-950/60 border border-purple-800/40 px-3 py-1 rounded-full font-medium">
              Step-by-step Partner Assistant
            </span>
          </div>

          {!generatedDraft ? (
            <form onSubmit={handleGenerateAiCopy} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Product / Offer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Niche Box Blueprint"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Copywriting Framework
                  </label>
                  <select
                    value={chosenFramework}
                    onChange={(e) => setChosenFramework(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="AIDA">AIDA (Attention, Interest, Desire, Action)</option>
                    <option value="PAS">PAS (Problem, Agitate, Solution)</option>
                    <option value="FAB">FAB (Feature, Advantage, Benefit)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Target Platform
                  </label>
                  <select
                    value={targetPlatform}
                    onChange={(e) => setTargetPlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="Meta">Meta (Facebook / Instagram)</option>
                    <option value="Pinterest">Pinterest Description</option>
                    <option value="TikTok">TikTok Caption & Hook</option>
                    <option value="Google Ads">Google Search Ad</option>
                    <option value="Email">Email Nurture Sequence</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50"
                >
                  {aiLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Drafting AI Framework...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Generate AI Draft
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Human Touch Workflow Reminder */}
              <div className="p-3.5 bg-purple-950/40 border border-purple-800/50 rounded-xl text-purple-200 text-xs flex items-start gap-3">
                <HeartHandshake className="w-5 h-5 text-purple-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Human Touch Philosophy:</span> AI is your co-pilot, not a replacement. Review the draft below and inject your personal backstory, real results, or custom callout.
                </div>
              </div>

              {/* Draft Box */}
              <div className="space-y-3 bg-slate-950 p-4 border border-slate-800 rounded-xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Headline Draft</span>
                  <div className="text-sm font-bold text-slate-100 mt-1">{generatedDraft.headline}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">AI Framework Body ({chosenFramework})</span>
                  <pre className="text-xs text-slate-300 mt-1 whitespace-pre-wrap font-sans bg-slate-900 p-3 rounded-lg border border-slate-800">
                    {generatedDraft.rawAiCopy}
                  </pre>
                </div>
              </div>

              {/* Human Refinement Input */}
              <div>
                <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> Add Your Personal "Human Touch" Touchpoint
                </label>
                <textarea
                  value={humanTouchInput}
                  onChange={(e) => setHumanTouchInput(e.target.value)}
                  rows={3}
                  placeholder="Add your founder story, specific client testimonial, or personal guarantee..."
                  className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setGeneratedDraft(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Start Over
                </button>
                <button
                  onClick={handleSaveDraftWithHumanTouch}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/30"
                >
                  <Check className="w-4 h-4" /> Save Final Copy to Swipe Vault
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, content, context, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-3">
          {/* Platform Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="All">All Platforms</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="pinterest">Pinterest</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="google_ads">Google Ads</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter/X</option>
              <option value="email">Email</option>
              <option value="landing_page">Landing Page</option>
              <option value="sales_page">Sales Page</option>
              <option value="direct_mail">Direct Mail</option>
              <option value="sms">SMS</option>
              <option value="podcast">Podcast</option>
              <option value="blog">Blog</option>
            </select>
          </div>

          {/* Content Type Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">Content Type</label>
            <select
              value={selectedContentType}
              onChange={(e) => setSelectedContentType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="All">All Types</option>
              <option value="headline">Headline</option>
              <option value="hook">Hook</option>
              <option value="opening_paragraph">Opening Paragraph</option>
              <option value="subheadline">Subheadline</option>
              <option value="bullet_point">Bullet Point</option>
              <option value="call_to_action">Call to Action</option>
              <option value="testimonial">Testimonial</option>
              <option value="objection">Objection</option>
              <option value="objection_rebuttal">Objection Rebuttal</option>
              <option value="pain_point">Pain Point</option>
              <option value="benefit">Benefit</option>
              <option value="feature">Feature</option>
              <option value="guarantee">Guarantee</option>
              <option value="urgency_element">Urgency Element</option>
              <option value="scarcity_element">Scarcity Element</option>
              <option value="social_proof">Social Proof</option>
              <option value="story">Story</option>
              <option value="case_study">Case Study</option>
              <option value="email_subject_line">Email Subject Line</option>
              <option value="email_preheader">Email Preheader</option>
              <option value="video_script">Video Script</option>
              <option value="video_hook">Video Hook</option>
              <option value="youtube_description">YouTube Description</option>
              <option value="youtube_tag">YouTube Tag</option>
              <option value="comment">Comment</option>
              <option value="question">Question</option>
              <option value="faq">FAQ</option>
              <option value="competitor_comparison">Competitor Comparison</option>
              <option value="industry_insight">Industry Insight</option>
              <option value="statistic">Statistic</option>
              <option value="roi_example">ROI Example</option>
              <option value="customer_feedback">Customer Feedback</option>
              <option value="support_issue">Support Issue</option>
              <option value="survey_response">Survey Response</option>
            </select>
          </div>

          {/* Framework Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">Framework</label>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="All">All Frameworks</option>
              <option value="AIDA">AIDA</option>
              <option value="PAS">PAS</option>
              <option value="FAB">FAB</option>
              <option value="4Ps">4Ps</option>
              <option value="Quest">Quest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vault Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCopies.map((item, idx) => (
          <div
            key={item._id || idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800/40 rounded-lg text-[10px] font-bold">
                  {item.contentType}
                </span>
                <span className="text-xs font-bold text-slate-200">{item.title}</span>
              </div>

              {/* Performance Tag */}
              <div
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.performanceTag === "Winner"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : item.performanceTag === "High CTR"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {item.performanceTag === "Winner" && <Award className="w-3 h-3 text-amber-400" />}
                {item.performanceTag === "High CTR" && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                {item.performanceTag} {item.historicalCtr ? `(${item.historicalCtr}% CTR)` : ""}
              </div>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, tagIdx) => (
                  <span key={tagIdx} className="px-2 py-0.5 bg-slate-950 border border-slate-700 rounded-md text-[10px] text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content Display */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Content ({item.contentType})</div>
              <p className="whitespace-pre-wrap">{item.content}</p>
            </div>

            {/* Context */}
            {item.context && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400">
                <div className="text-[10px] uppercase font-bold text-slate-500">Context</div>
                <p className="mt-1">{item.context}</p>
              </div>
            )}

            {/* Human Touch Addon */}
            {item.humanTouchCopy && (
              <div className="bg-purple-950/30 p-3 rounded-xl border border-purple-800/40 text-xs text-purple-200 space-y-1">
                <div className="text-[10px] font-bold text-purple-300 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Human Touch Addition:
                </div>
                <p className="italic">{item.humanTouchCopy}</p>
              </div>
            )}

            {/* Copy CTA & Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Platform: {item.platform}</span>
                {item.source && <span className="text-[11px] text-slate-500">• Source: {item.source}</span>}
              </div>

              <button
                onClick={() =>
                  handleCopy(
                    `${item.content}${item.humanTouchCopy ? "\n\n" + item.humanTouchCopy : ""}`,
                    item._id || String(idx)
                  )
                }
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copiedId === (item._id || String(idx)) ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Swipe Text
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Swipe Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-950 border border-indigo-800 rounded-xl">
                    <Plus className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Add New Swipe</h3>
                    <p className="text-xs text-slate-400">Save content from any platform or context</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-800 rounded-lg transition">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="e.g. High-converting Facebook headline"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Platform *</label>
                    <select
                      value={newItem.platform}
                      onChange={(e) => setNewItem({ ...newItem, platform: e.target.value as Platform })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    >
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="pinterest">Pinterest</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="google_ads">Google Ads</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter/X</option>
                      <option value="email">Email</option>
                      <option value="landing_page">Landing Page</option>
                      <option value="sales_page">Sales Page</option>
                      <option value="direct_mail">Direct Mail</option>
                      <option value="sms">SMS</option>
                      <option value="podcast">Podcast</option>
                      <option value="blog">Blog</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Content Type *</label>
                    <select
                      value={newItem.contentType}
                      onChange={(e) => setNewItem({ ...newItem, contentType: e.target.value as ContentType })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    >
                      <option value="headline">Headline</option>
                      <option value="hook">Hook</option>
                      <option value="opening_paragraph">Opening Paragraph</option>
                      <option value="subheadline">Subheadline</option>
                      <option value="bullet_point">Bullet Point</option>
                      <option value="call_to_action">Call to Action</option>
                      <option value="testimonial">Testimonial</option>
                      <option value="objection">Objection</option>
                      <option value="objection_rebuttal">Objection Rebuttal</option>
                      <option value="pain_point">Pain Point</option>
                      <option value="benefit">Benefit</option>
                      <option value="feature">Feature</option>
                      <option value="guarantee">Guarantee</option>
                      <option value="urgency_element">Urgency Element</option>
                      <option value="scarcity_element">Scarcity Element</option>
                      <option value="social_proof">Social Proof</option>
                      <option value="story">Story</option>
                      <option value="case_study">Case Study</option>
                      <option value="email_subject_line">Email Subject Line</option>
                      <option value="email_preheader">Email Preheader</option>
                      <option value="video_script">Video Script</option>
                      <option value="video_hook">Video Hook</option>
                      <option value="youtube_description">YouTube Description</option>
                      <option value="youtube_tag">YouTube Tag</option>
                      <option value="comment">Comment</option>
                      <option value="question">Question</option>
                      <option value="faq">FAQ</option>
                      <option value="competitor_comparison">Competitor Comparison</option>
                      <option value="industry_insight">Industry Insight</option>
                      <option value="statistic">Statistic</option>
                      <option value="roi_example">ROI Example</option>
                      <option value="customer_feedback">Customer Feedback</option>
                      <option value="support_issue">Support Issue</option>
                      <option value="survey_response">Survey Response</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Content *</label>
                  <textarea
                    value={newItem.content}
                    onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                    rows={4}
                    placeholder="Paste the content here..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Context</label>
                  <input
                    type="text"
                    value={newItem.context}
                    onChange={(e) => setNewItem({ ...newItem, context: e.target.value })}
                    placeholder="e.g. Used in Q4 holiday campaign, got 4.2% CTR"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Source</label>
                    <input
                      type="text"
                      value={newItem.source}
                      onChange={(e) => setNewItem({ ...newItem, source: e.target.value })}
                      placeholder="e.g. Competitor X, Gary Vaynerchuk"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Performance Tag</label>
                    <select
                      value={newItem.performanceTag}
                      onChange={(e) => setNewItem({ ...newItem, performanceTag: e.target.value as SwipeCopyItem["performanceTag"] })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Testing">Testing</option>
                      <option value="High CTR">High CTR</option>
                      <option value="High Conversion">High Conversion</option>
                      <option value="Winner">Winner</option>
                      <option value="Archive">Archive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newItem.tags}
                    onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                    placeholder="e.g. holiday, urgency, social proof"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Notes</label>
                  <textarea
                    value={newItem.notes}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    rows={2}
                    placeholder="Any additional notes..."
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
                  onClick={handleAddNewItem}
                  disabled={!newItem.title || !newItem.content}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" /> Save Swipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
