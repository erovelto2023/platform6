"use client";

import React, { useState } from "react";
import { BookOpen, Sparkles, Copy, Check, TrendingUp, Award, UserCheck, RefreshCw, Plus, HeartHandshake } from "lucide-react";

export interface SwipeCopyItem {
  _id?: string;
  title: string;
  framework: "AIDA" | "PAS" | "FAB" | "4Ps" | "Quest";
  platform: string;
  rawAiCopy: string;
  humanTouchCopy: string;
  performanceTag: "Winner" | "High CTR" | "High Conversion" | "Testing" | "Draft";
  historicalCtr?: number;
  headline?: string;
  callToAction?: string;
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      framework: chosenFramework,
      platform: targetPlatform,
      rawAiCopy: generatedDraft.rawAiCopy,
      humanTouchCopy: humanTouchInput,
      headline: generatedDraft.headline,
      callToAction: generatedDraft.callToAction,
      performanceTag: "Testing",
      historicalCtr: 3.2,
    });

    setShowAiGenerator(false);
    setGeneratedDraft(null);
    setHumanTouchInput("");
  };

  const filteredCopies = copyList.filter((c) => {
    if (selectedFramework === "All") return true;
    return c.framework === selectedFramework;
  });

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
          onClick={() => setShowAiGenerator(!showAiGenerator)}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-purple-600/20"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          {showAiGenerator ? "Close Generator" : "Launch AI Co-Pilot"}
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

      {/* Framework Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["All", "AIDA", "PAS", "FAB", "4Ps", "Quest"].map((fw) => (
          <button
            key={fw}
            onClick={() => setSelectedFramework(fw)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedFramework === fw
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            {fw}
          </button>
        ))}
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
                  {item.framework}
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

            {/* Headline */}
            {item.headline && (
              <div className="text-sm font-semibold text-slate-100 border-l-2 border-indigo-500 pl-3">
                "{item.headline}"
              </div>
            )}

            {/* Raw AI Copy */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Framework Copy Structure</div>
              <p className="whitespace-pre-wrap">{item.rawAiCopy}</p>
            </div>

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
              <span className="text-[11px] text-slate-400">Platform: {item.platform}</span>

              <button
                onClick={() =>
                  handleCopy(
                    `${item.headline ? item.headline + "\n\n" : ""}${item.rawAiCopy}\n\n${item.humanTouchCopy}`,
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
    </div>
  );
};
