"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Rocket,
  Target,
  FileImage,
  BookOpen,
  ShieldCheck,
  Calendar,
  BarChart3,
  Sparkles,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sliders,
  Users,
  Brain,
  DollarSign,
  TrendingUp,
  Zap,
  HelpCircle,
  Plus,
  FileText,
  X,
  RefreshCw,
  Download,
  KeyRound,
  Printer,
  FileSpreadsheet,
  FileCode
} from "lucide-react";
import { DigitalAssetItem } from "./DigitalAssetManager";
import { SwipeCopyItem, Platform } from "./SwipeFileVault";
import { BrandVaultData } from "./BrandVaultEditor";

export interface CampaignBuilderWorkspaceProps {
  campaign: any;
  allAssets: DigitalAssetItem[];
  allCopyList: SwipeCopyItem[];
  brandVault: BrandVaultData;
  onUpdateCampaign: (updatedCampaign: any) => Promise<void> | void;
  onBackToDashboard: () => void;
  onAddAsset?: (asset: Omit<DigitalAssetItem, "_id">) => Promise<void> | void;
  onSaveCopy?: (copyItem: Omit<SwipeCopyItem, "_id">) => Promise<void> | void;
}

export const CampaignBuilderWorkspace: React.FC<CampaignBuilderWorkspaceProps> = ({
  campaign: initialCampaign,
  allAssets,
  allCopyList,
  brandVault,
  onUpdateCampaign,
  onBackToDashboard,
  onAddAsset,
  onSaveCopy,
}) => {
  const [campaign, setCampaign] = useState<any>(initialCampaign);
  const [activeStep, setActiveStep] = useState<number>(initialCampaign.currentStep || 1);
  const [copiedUtm, setCopiedUtm] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  // Modals & Drawers
  const [showAddAssetModal, setShowAddAssetModal] = useState<boolean>(false);
  const [showAddCopyModal, setShowAddCopyModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [copiedBlueprint, setCopiedBlueprint] = useState<boolean>(false);

  // Keyword input state inside Step 4
  const [kwInput, setKwInput] = useState("");
  const [kwMatchType, setKwMatchType] = useState<"Exact" | "Phrase" | "Broad">("Phrase");

  // New Inline Asset state
  const [newAsset, setNewAsset] = useState({
    title: "",
    url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60",
    mediaType: "image" as "image" | "video",
    aspectRatio: "1:1" as "1:1" | "2:3" | "9:16" | "16:9",
    category: "Feed Post",
    platformTarget: "Meta",
  });

  // New Inline Copy state
  const [newCopy, setNewCopy] = useState({
    title: "",
    content: "",
    framework: "AIDA" as "AIDA" | "PAS" | "FAB",
    platform: "Meta",
  });

  const completedSteps: number[] = campaign.completedSteps || [1];

  const toggleStepCompleted = (stepNum: number) => {
    const isCompleted = completedSteps.includes(stepNum);
    const updatedSteps = isCompleted
      ? completedSteps.filter((s) => s !== stepNum)
      : [...completedSteps, stepNum];
    
    updateAndSaveCampaign({ completedSteps: updatedSteps });
  };

  const updateAndSaveCampaign = async (fieldsToUpdate: Partial<any>) => {
    const updated = { ...campaign, ...fieldsToUpdate, currentStep: activeStep };
    setCampaign(updated);
    setIsSaving(true);
    try {
      await onUpdateCampaign(updated);
    } catch (e) {
      console.error("Failed to auto-save campaign:", e);
    } finally {
      setIsSaving(false);
    }
  };

  // AI Copilot Auto-Fill Strategy
  const handleAiAutoFillStrategy = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch("/api/admin/click-campaigns/ai-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: campaign.productName || campaign.title || "Marketing Platform",
          targetAudience: campaign.targetAudience || brandVault.targetAudienceProfile,
          framework: "AIDA",
          platform: campaign.platforms?.[0] || "Meta",
          brandVoice: brandVault.brandVoice,
        }),
      });
      const data = await res.json();
      if (data.success) {
        updateAndSaveCampaign({
          targetAudience: campaign.targetAudience || brandVault.targetAudienceProfile,
          corePainPoint: data.headline || "Struggling with low CTR & tool fatigue",
          uniqueValue: data.rawAiCopy?.split("\n\n")[1] || "All-in-one setup in under 10 minutes",
        });
      }
    } catch (e) {
      console.error("AI Strategy fill error:", e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Inline Media Asset Submit
  const handleInlineAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.title) return;

    const createdAsset: DigitalAssetItem = {
      _id: `a_${Date.now()}`,
      title: newAsset.title,
      url: newAsset.url,
      mediaType: newAsset.mediaType,
      width: 1080,
      height: 1080,
      aspectRatio: newAsset.aspectRatio,
      version: "v1.0",
      tags: [newAsset.platformTarget],
      category: newAsset.category,
      platformTarget: newAsset.platformTarget,
    };

    if (onAddAsset) await onAddAsset(createdAsset);
    
    const updatedSelected = [...(campaign.selectedAssetIds || []), createdAsset._id];
    updateAndSaveCampaign({ selectedAssetIds: updatedSelected });
    setShowAddAssetModal(false);
    setNewAsset({
      title: "",
      url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60",
      mediaType: "image",
      aspectRatio: "1:1",
      category: "Feed Post",
      platformTarget: "Meta",
    });
  };

  // Inline Copy Submit
  const handleInlineAddCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCopy.title || !newCopy.content) return;

    const createdCopy: SwipeCopyItem = {
      _id: `cp_${Date.now()}`,
      title: newCopy.title,
      contentType: "headline",
      platform: newCopy.platform as Platform,
      content: newCopy.content,
      framework: newCopy.framework,
      performanceTag: "Testing",
      historicalCtr: 3.5,
    };

    if (onSaveCopy) await onSaveCopy(createdCopy);

    const updatedSelected = [...(campaign.selectedCopyIds || []), createdCopy._id];
    updateAndSaveCampaign({ selectedCopyIds: updatedSelected });
    setShowAddCopyModal(false);
    setNewCopy({
      title: "",
      content: "",
      framework: "AIDA",
      platform: "Meta",
    });
  };

  // Add Keyword to Campaign (Supports Bulk Comma-Separated Pasting)
  const handleAddKeywordToCampaign = () => {
    if (!kwInput) return;
    const currentKws = campaign.targetKeywords || [];

    const parsedKeywords = kwInput
      .split(/,|\n/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const newKwObjects = parsedKeywords.map((kwStr) => ({
      keyword: kwStr,
      matchType: kwMatchType,
      intent: "Transactional",
      monthlyVolume: 2400,
      estimatedCpc: 1.8,
      headlines: selectedCopy.map((c) => c.title),
      adCopy: selectedCopy.map((c) => c.content),
    }));

    updateAndSaveCampaign({ targetKeywords: [...currentKws, ...newKwObjects] });
    setKwInput("");
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    const currentKws = campaign.targetKeywords || [];
    const filtered = currentKws.filter((k: any) => k.keyword !== kwToRemove);
    updateAndSaveCampaign({ targetKeywords: filtered });
  };

  const steps = [
    { num: 1, title: "Strategy & Offer", icon: Target, desc: "Objectives, offer name, channels & budgets" },
    { num: 2, title: "Audience & Hook", icon: Users, desc: "Target persona, pain points & unique selling angle" },
    { num: 3, title: "Creative Assets", icon: FileImage, desc: "Media selection & aspect ratio verification" },
    { num: 4, title: "Copy & Keywords", icon: BookOpen, desc: "Headlines, AIDA copy & keyword targeting" },
    { num: 5, title: "Pixels & Tracking", icon: ShieldCheck, desc: "Conversions API check & UTM generator" },
    { num: 6, title: "Scheduler & Budget", icon: Calendar, desc: "Launch timeline & spend distribution" },
    { num: 7, title: "Live Optimization", icon: BarChart3, desc: "ROAS command, gap alerts & scaling engine" },
  ];

  const selectedAssets = allAssets.filter((a) => (campaign.selectedAssetIds || []).includes(a._id));
  const selectedCopy = allCopyList.filter((c) => (campaign.selectedCopyIds || []).includes(c._id));

  const hasSquareAsset = selectedAssets.some((a) => a.aspectRatio === "1:1");
  const hasVerticalPinAsset = selectedAssets.some((a) => a.aspectRatio === "2:3");
  const hasVertical916Asset = selectedAssets.some((a) => a.aspectRatio === "9:16");

  const baseUrl = "https://myplatform.com/offer";
  const primaryPlatform = campaign.platforms?.[0]?.toLowerCase() || "meta";
  const generatedUtm = `${baseUrl}?utm_source=${primaryPlatform}&utm_medium=cpc&utm_campaign=${encodeURIComponent(
    campaign.title.toLowerCase().replace(/\s+/g, "_")
  )}`;

  const handleCopyUtm = () => {
    navigator.clipboard.writeText(generatedUtm);
    setCopiedUtm(true);
    setTimeout(() => setCopiedUtm(false), 2000);
  };

  // Multi-Format Exporters
  const campaignBlueprintMarkdown = `# 🚀 Campaign Blueprint: ${campaign.title}

## 🎯 1. Strategy & Offer Details
- **Offer Name:** ${campaign.productName || campaign.title}
- **Category:** ${campaign.productType || "Digital Product"}
- **Objective:** ${campaign.objective}
- **Target Platforms:** ${campaign.platforms?.join(", ") || "Meta"}
- **Daily Budget:** $${campaign.dailyBudget}/day
- **Total Budget Cap:** $${campaign.totalBudget}

## 👥 2. Target Audience & Hook
- **Target Persona:** ${campaign.targetAudience || brandVault.targetAudienceProfile}
- **Core Pain Point:** ${campaign.corePainPoint || "Low CTR & high ad cost"}
- **Unique Selling Angle:** ${campaign.uniqueValue || "Fast 10-minute setup"}

## 🔑 3. Target Keywords & Ad Mapping
${(campaign.targetKeywords || []).map((k: any) => `- **[${k.matchType}] ${k.keyword}** (Vol: ${k.monthlyVolume}/mo, CPC: $${k.estimatedCpc})`).join("\n") || "- No keywords linked yet"}

## 🖼️ 4. Selected Media Assets (${selectedAssets.length})
${selectedAssets.map((a) => `- [${a.aspectRatio}] ${a.title} (${a.url})`).join("\n") || "- No assets linked yet"}

## ✍️ 5. Selected Ad Copy & Headlines (${selectedCopy.length})
${selectedCopy.map((c) => `### ${c.title} (${c.framework})\n"${c.content}"\n`).join("\n") || "- No copy linked yet"}

## 🔗 6. Tracking & UTM URL
- **Final Tracking URL:** ${generatedUtm}
`;

  // Export CSV
  const handleExportCsv = () => {
    const headers = ["Section", "Key", "Value"];
    const rows = [
      ["Strategy", "Campaign Title", `"${campaign.title}"`],
      ["Strategy", "Product Offer", `"${campaign.productName || ""}"`],
      ["Strategy", "Objective", campaign.objective],
      ["Strategy", "Platforms", `"${(campaign.platforms || []).join("; ")}"`],
      ["Strategy", "Daily Budget", `$${campaign.dailyBudget}`],
      ["Audience", "Target Persona", `"${campaign.targetAudience || ""}"`],
      ["Audience", "Pain Point", `"${campaign.corePainPoint || ""}"`],
      ["Keywords", "Target Keywords", `"${(campaign.targetKeywords || []).map((k: any) => k.keyword).join("; ")}"`],
      ["Assets", "Attached Media", `"${selectedAssets.map((a) => a.title).join("; ")}"`],
      ["Copywriting", "Attached Headlines", `"${selectedCopy.map((c) => c.title).join("; ")}"`],
      ["Tracking", "UTM Link", `"${generatedUtm}"`],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${campaign.title.replace(/\s+/g, "_")}_Blueprint.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(campaign, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${campaign.title.replace(/\s+/g, "_")}_Blueprint.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export PDF / Print Preview
  const handleExportPrintPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Campaign Blueprint - ${campaign.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            h1 { color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
            h2 { color: #475569; margin-top: 25px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
            .badge { background: #e0e7ff; color: #3730a3; padding: 3px 8px; rounded: 4px; font-weight: bold; font-size: 12px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-top: 10px; }
            code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
          </style>
        </head>
        <body>
          <h1>🚀 Campaign Blueprint: ${campaign.title}</h1>
          <p><strong>Status:</strong> <span class="badge">${campaign.status}</span> | <strong>Objective:</strong> ${campaign.objective} | <strong>Budget:</strong> $${campaign.dailyBudget}/day</p>

          <h2>🎯 1. Offer & Target Strategy</h2>
          <div class="box">
            <p><strong>Product / Offer:</strong> ${campaign.productName || campaign.title}</p>
            <p><strong>Target Platforms:</strong> ${campaign.platforms?.join(", ")}</p>
            <p><strong>Audience Persona:</strong> ${campaign.targetAudience || "Not specified"}</p>
            <p><strong>Core Pain Point:</strong> ${campaign.corePainPoint || "Not specified"}</p>
          </div>

          <h2>🔑 2. Target Keywords & Intent Mapping</h2>
          <div class="box">
            <ul>
              ${(campaign.targetKeywords || []).map((k: any) => `<li><strong>[${k.matchType}] ${k.keyword}</strong> - Vol: ${k.monthlyVolume}/mo, CPC: $${k.estimatedCpc}</li>`).join("") || "<li>No keywords mapped</li>"}
            </ul>
          </div>

          <h2>🖼️ 3. Attached Media Assets (${selectedAssets.length})</h2>
          <div class="box">
            <ul>
              ${selectedAssets.map((a) => `<li>[${a.aspectRatio}] ${a.title} (${a.platformTarget})</li>`).join("") || "<li>No assets attached</li>"}
            </ul>
          </div>

          <h2>✍️ 4. Ad Copy & Headlines (${selectedCopy.length})</h2>
          <div class="box">
            ${selectedCopy.map((c) => `<p><strong>${c.title} (${c.framework}):</strong><br/><em>"${c.content}"</em></p>`).join("") || "<p>No ad copy attached</p>"}
          </div>

          <h2>🔗 5. Tracking & UTM URL</h2>
          <div class="box">
            <code>${generatedUtm}</code>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopyBlueprint = () => {
    navigator.clipboard.writeText(campaignBlueprintMarkdown);
    setCopiedBlueprint(true);
    setTimeout(() => setCopiedBlueprint(false), 2000);
  };

  const handleToggleAsset = (assetId: string) => {
    const currentList: string[] = campaign.selectedAssetIds || [];
    const exists = currentList.includes(assetId);
    const newList = exists ? currentList.filter((id) => id !== assetId) : [...currentList, assetId];
    updateAndSaveCampaign({ selectedAssetIds: newList });
  };

  const handleToggleCopy = (copyId: string) => {
    const currentList: string[] = campaign.selectedCopyIds || [];
    const exists = currentList.includes(copyId);
    const newList = exists ? currentList.filter((id) => id !== copyId) : [...currentList, copyId];
    updateAndSaveCampaign({ selectedCopyIds: newList });
  };

  const handlePlatformToggle = (platform: string) => {
    const currentPlatforms: string[] = campaign.platforms || [];
    const exists = currentPlatforms.includes(platform);
    const newPlatforms = exists
      ? currentPlatforms.filter((p) => p !== platform)
      : [...currentPlatforms, platform];
    updateAndSaveCampaign({ platforms: newPlatforms });
  };

  const progressPercentage = Math.round((completedSteps.length / 7) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <button
              onClick={onBackToDashboard}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to All Campaigns
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-600/30">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-100">{campaign.title}</h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                      campaign.status === "Active"
                        ? "bg-emerald-950 border-emerald-800 text-emerald-300"
                        : campaign.status === "Scheduled"
                        ? "bg-indigo-950 border-indigo-800 text-indigo-300"
                        : "bg-slate-800 border-slate-700 text-slate-300"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-4">
                  <span>Objective: <strong className="text-slate-200">{campaign.objective}</strong></span>
                  <span>Platforms: <strong className="text-indigo-300">{campaign.platforms?.join(", ") || "None"}</strong></span>
                  <span>Budget: <strong className="text-emerald-400">${campaign.dailyBudget}/day</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Blueprint Exporter */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2.5 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800 text-indigo-200 rounded-2xl text-xs font-bold flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-indigo-400" /> Export Multi-Format
            </button>

            <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 border border-slate-800 rounded-2xl text-xs">
              <span className="text-slate-400 font-medium">Status:</span>
              <select
                value={campaign.status}
                onChange={(e) => updateAndSaveCampaign({ status: e.target.value })}
                className="bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button
              onClick={() => updateAndSaveCampaign({ status: campaign.status === "Active" ? "Paused" : "Active" })}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition shadow-lg ${
                campaign.status === "Active"
                  ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
              }`}
            >
              {campaign.status === "Active" ? "Pause Campaign" : "Launch / Activate"}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Campaign Setup Progress
            </span>
            <span className="font-extrabold text-blue-400">{progressPercentage}% Complete ({completedSteps.length}/7 Steps)</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 7-Step Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.num;
          const isDone = completedSteps.includes(step.num);

          return (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                isActive
                  ? "bg-blue-600/20 border-blue-500 shadow-md shadow-blue-600/20"
                  : isDone
                  ? "bg-slate-900/90 border-emerald-900/60 text-slate-300"
                  : "bg-slate-900/50 border-slate-800/80 text-slate-400 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : isDone
                      ? "bg-emerald-500 text-slate-950 font-extrabold"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isDone && !isActive ? <Check className="w-3.5 h-3.5" /> : step.num}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : isDone ? "text-emerald-400" : "text-slate-500"}`} />
              </div>
              <div>
                <div className={`text-xs font-bold truncate ${isActive ? "text-blue-200" : "text-slate-200"}`}>
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{step.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* STEP CONTENT BODY */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* STEP 1: STRATEGY & OFFER */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" /> Step 1: Strategy & Offer Architecture
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Define your core campaign objective, offer details, and platform choices.
                </p>
              </div>
              <button
                onClick={() => toggleStepCompleted(1)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  completedSteps.includes(1)
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {completedSteps.includes(1) ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                {completedSteps.includes(1) ? "Step Completed" : "Mark Completed"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={campaign.title || ""}
                  onChange={(e) => updateAndSaveCampaign({ title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Offer / Product Name
                </label>
                <input
                  type="text"
                  value={campaign.productName || ""}
                  placeholder="e.g. Affiliate Masterclass Launch"
                  onChange={(e) => updateAndSaveCampaign({ productName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Campaign Objective
                </label>
                <select
                  value={campaign.objective || "Lead Generation"}
                  onChange={(e) => updateAndSaveCampaign({ objective: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Lead Generation">Lead Generation (Form / Email Capture)</option>
                  <option value="Sales">Sales / Direct Conversion</option>
                  <option value="Brand Awareness">Brand Awareness / Reach</option>
                  <option value="Traffic">Traffic / Clicks to Landing Page</option>
                  <option value="Engagement">Engagement / Content Views</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Offer Category
                </label>
                <select
                  value={campaign.productType || "Digital Product / eBook"}
                  onChange={(e) => updateAndSaveCampaign({ productType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Digital Product / eBook">Digital Product / eBook / Course</option>
                  <option value="Affiliate Offer">Affiliate Promotion Link</option>
                  <option value="Physical Product">Physical Product / E-Commerce</option>
                  <option value="Service / Coaching">Coaching / Service / Agency</option>
                </select>
              </div>
            </div>

            {/* Target Platforms Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Channels & Recommended Ad Specs
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: "Meta", name: "Meta (FB & IG)", ratio: "1:1 Square, 4:5 Feed, 9:16 Story" },
                  { id: "Pinterest", name: "Pinterest Pins", ratio: "2:3 Vertical Pins" },
                  { id: "TikTok", name: "TikTok Ads", ratio: "9:16 Vertical Video" },
                  { id: "LinkedIn", name: "LinkedIn Ads", ratio: "1.91:1 Landscape / Single Image" },
                  { id: "Google Ads", name: "Google Search", ratio: "Text Headlines & Extensions" },
                  { id: "Email", name: "Email Blast", ratio: "HTML / Responsive Layout" },
                ].map((p) => {
                  const selected = (campaign.platforms || []).includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePlatformToggle(p.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        selected
                          ? "bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>{p.name}</span>
                        {selected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{p.ratio}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: AUDIENCE & HOOK */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" /> Step 2: Target Audience & Hook Positioning
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Identify who you are speaking to, their pain points, and your primary messaging hooks.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAiAutoFillStrategy}
                  disabled={isAiGenerating}
                  className="px-3.5 py-2 bg-purple-950/80 hover:bg-purple-900 border border-purple-700 text-purple-200 rounded-xl text-xs font-bold flex items-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  {isAiGenerating ? "Generating..." : "✨ AI Auto-Fill Persona"}
                </button>

                <button
                  onClick={() => toggleStepCompleted(2)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                    completedSteps.includes(2)
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {completedSteps.includes(2) ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                  {completedSteps.includes(2) ? "Step Completed" : "Mark Completed"}
                </button>
              </div>
            </div>

            {/* Brand Vault Persona Preset Quick Match */}
            <div className="p-4 bg-purple-950/30 border border-purple-800/40 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-purple-200">Brand Vault Persona Active</div>
                  <div className="text-[11px] text-purple-300/80">{brandVault.targetAudienceProfile}</div>
                </div>
              </div>
              <button
                onClick={() => updateAndSaveCampaign({ targetAudience: brandVault.targetAudienceProfile })}
                className="px-3 py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700 rounded-xl text-xs font-bold transition"
              >
                Apply Brand Persona
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Target Customer Persona Profile
                </label>
                <input
                  type="text"
                  value={campaign.targetAudience || ""}
                  onChange={(e) => updateAndSaveCampaign({ targetAudience: e.target.value })}
                  placeholder="e.g., Aspiring online entrepreneurs, affiliate marketers aged 25-45"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Core Customer Pain Point / Struggle
                </label>
                <textarea
                  rows={3}
                  value={campaign.corePainPoint || ""}
                  onChange={(e) => updateAndSaveCampaign({ corePainPoint: e.target.value })}
                  placeholder="e.g., Struggling with low ad CTR and overwhelmed by managing multiple advertising platforms"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Unique Selling Advantage & Story
                </label>
                <textarea
                  rows={3}
                  value={campaign.uniqueValue || ""}
                  onChange={(e) => updateAndSaveCampaign({ uniqueValue: e.target.value })}
                  placeholder="e.g., Built-in automated ad specs auto-mapper and copy framework templates for fast 10-minute setup"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CREATIVE & DAM ASSETS WITH INLINE ADD */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-blue-400" /> Step 3: Digital Asset Management & Aspect Specs
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Attach media files from your Digital Asset Vault or upload new assets inline.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddAssetModal(true)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-blue-600/30"
                >
                  <Plus className="w-4 h-4" /> Add Asset Inline
                </button>

                <button
                  onClick={() => toggleStepCompleted(3)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                    completedSteps.includes(3)
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {completedSteps.includes(3) ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                  {completedSteps.includes(3) ? "Step Completed" : "Mark Completed"}
                </button>
              </div>
            </div>

            {/* Aspect ratio coverage checklist */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-3 ${hasSquareAsset ? "bg-emerald-950/40 border-emerald-800 text-emerald-300" : "bg-amber-950/40 border-amber-800 text-amber-300"}`}>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <div className="font-bold">1:1 Square (Meta / IG Feed)</div>
                  <div className="text-[10px] opacity-80">{hasSquareAsset ? "Asset Attached" : "Recommended: Add 1:1 image"}</div>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-3 ${hasVerticalPinAsset ? "bg-emerald-950/40 border-emerald-800 text-emerald-300" : "bg-amber-950/40 border-amber-800 text-amber-300"}`}>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <div className="font-bold">2:3 Vertical Pin (Pinterest)</div>
                  <div className="text-[10px] opacity-80">{hasVerticalPinAsset ? "Asset Attached" : "Recommended: Add 2:3 vertical pin"}</div>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-3 ${hasVertical916Asset ? "bg-emerald-950/40 border-emerald-800 text-emerald-300" : "bg-amber-950/40 border-amber-800 text-amber-300"}`}>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <div className="font-bold">9:16 Vertical Video (TikTok / Reels)</div>
                  <div className="text-[10px] opacity-80">{hasVertical916Asset ? "Asset Attached" : "Recommended: Add 9:16 video"}</div>
                </div>
              </div>
            </div>

            {/* Asset Selection Grid */}
            <div>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Select Assets to Include in Campaign ({selectedAssets.length} Selected)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allAssets.map((asset) => {
                  const isSelected = asset._id ? (campaign.selectedAssetIds || []).includes(asset._id) : false;
                  return (
                    <div
                      key={asset._id}
                      onClick={() => asset._id && handleToggleAsset(asset._id)}
                      className={`p-3 bg-slate-950 border rounded-2xl cursor-pointer transition relative group ${
                        isSelected ? "border-blue-500 bg-blue-950/20 shadow-md" : "border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-900">
                        <img src={asset.url} alt={asset.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isSelected ? "bg-blue-500 text-white" : "bg-slate-900/80 text-slate-400"}`}>
                            {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          </span>
                        </div>
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-950/80 backdrop-blur text-[10px] font-extrabold text-blue-300 rounded">
                          {asset.aspectRatio}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-slate-100 truncate">{asset.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{asset.platformTarget} | {asset.category}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: COPYWRITING & KEYWORDS */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" /> Step 4: Copywriting & Keyword Targeting
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select copy frameworks from your Vault, write custom copy inline, or map target search keywords.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddCopyModal(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-indigo-600/30"
                >
                  <Plus className="w-4 h-4" /> Add Copy Inline
                </button>

                <button
                  onClick={() => toggleStepCompleted(4)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                    completedSteps.includes(4)
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {completedSteps.includes(4) ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                  {completedSteps.includes(4) ? "Step Completed" : "Mark Completed"}
                </button>
              </div>
            </div>

            {/* Keyword Targeting Subsection */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold text-xs text-slate-200">Target Keywords & Ad Group Mapping</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {(campaign.targetKeywords || []).length} Keywords Mapped
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex flex-1 flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="text"
                    placeholder="Enter target keyword phrase..."
                    value={kwInput}
                    onChange={(e) => setKwInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <select
                    value={kwMatchType}
                    onChange={(e) => setKwMatchType(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Phrase">Phrase "kw"</option>
                    <option value="Exact">Exact [kw]</option>
                    <option value="Broad">Broad kw</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddKeywordToCampaign}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-xl text-xs font-extrabold transition shadow-md shadow-yellow-500/20"
                  >
                    + Add Keyword
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const kwList = (campaign.targetKeywords || []).map((k: any) => k.keyword).join(", ");
                    navigator.clipboard.writeText(kwList);
                    alert("Copied campaign keywords as comma-separated list!");
                  }}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-yellow-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0"
                >
                  <Copy className="w-3.5 h-3.5 text-yellow-400" /> Copy Comma List
                </button>
              </div>

              {/* Keywords Tag List */}
              <div className="flex flex-wrap gap-2 pt-2">
                {(campaign.targetKeywords || []).map((k: any, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-yellow-950/40 border border-yellow-800/60 text-yellow-200 rounded-xl text-xs font-mono font-semibold flex items-center gap-2"
                  >
                    <span>{k.matchType === "Exact" ? `[${k.keyword}]` : k.matchType === "Phrase" ? `"${k.keyword}"` : k.keyword}</span>
                    <button onClick={() => handleRemoveKeyword(k.keyword)} className="text-yellow-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Selectable Swipe Copies */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Copy Vault Items to Attach ({selectedCopy.length} Selected)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allCopyList.map((copy) => {
                  const isSelected = copy._id ? (campaign.selectedCopyIds || []).includes(copy._id) : false;
                  return (
                    <div
                      key={copy._id}
                      onClick={() => copy._id && handleToggleCopy(copy._id)}
                      className={`p-4 bg-slate-950 border rounded-2xl cursor-pointer transition ${
                        isSelected ? "border-indigo-500 bg-indigo-950/20 shadow-md" : "border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-100">{copy.title}</span>
                        <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded text-[10px] font-bold">
                          {copy.framework || "AIDA"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium line-clamp-2">"{copy.content}"</p>
                      <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                        <span>Platform: {copy.platform}</span>
                        <span className="text-emerald-400 font-bold">CTR: {copy.historicalCtr || 4.2}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: PIXELS & TRACKING */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Step 5: Pixel & Conversions API Tracking
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Verify conversion pixels and generate auto-tagged UTM campaign parameters.
                </p>
              </div>
              <button
                onClick={() => toggleStepCompleted(5)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  completedSteps.includes(5)
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {completedSteps.includes(5) ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                {completedSteps.includes(5) ? "Step Completed" : "Mark Completed"}
              </button>
            </div>

            {/* UTM Generator Tool */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Auto-Generated Campaign Tracking URL (UTM Tagged)</span>
                <button
                  onClick={handleCopyUtm}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {copiedUtm ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedUtm ? "Copied!" : "Copy Link"}
                </button>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 break-all">
                {generatedUtm}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: SCHEDULER & BUDGET */}
        {activeStep === 6 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" /> Step 6: Launch Scheduler & Budget Allocation
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure daily/total budgets and schedule channel deployment dates.
                </p>
              </div>
              <button
                onClick={() => toggleStepCompleted(6)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  completedSteps.includes(6)
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {completedSteps.includes(6) ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                {completedSteps.includes(6) ? "Step Completed" : "Mark Completed"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Daily Budget ($ USD)
                </label>
                <div className="flex items-center gap-4 bg-slate-950 p-4 border border-slate-800 rounded-xl">
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={campaign.dailyBudget || 50}
                    onChange={(e) => updateAndSaveCampaign({ dailyBudget: Number(e.target.value) })}
                    className="w-full accent-blue-500"
                  />
                  <span className="text-lg font-extrabold text-emerald-400 min-w-[70px] text-right">
                    ${campaign.dailyBudget}/day
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Total Maximum Budget Cap ($ USD)
                </label>
                <input
                  type="number"
                  value={campaign.totalBudget || 500}
                  onChange={(e) => updateAndSaveCampaign({ totalBudget: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: LIVE PERFORMANCE & GAP OPTIMIZATION */}
        {activeStep === 7 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" /> Step 7: Live Performance & Gap Optimizer
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Monitor campaign metrics, automated performance gap alerts, and scaling options.
                </p>
              </div>
              <button
                onClick={() => toggleStepCompleted(7)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  completedSteps.includes(7)
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {completedSteps.includes(7) ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                {completedSteps.includes(7) ? "Step Completed" : "Mark Completed"}
              </button>
            </div>

            {/* Performance KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl">
                <div className="text-xs text-slate-400">Total Spend</div>
                <div className="text-2xl font-extrabold text-slate-100 mt-1">${campaign.metrics?.spend || 0}</div>
              </div>
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl">
                <div className="text-xs text-slate-400">Impressions</div>
                <div className="text-2xl font-extrabold text-slate-100 mt-1">{(campaign.metrics?.impressions || 0).toLocaleString()}</div>
              </div>
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl">
                <div className="text-xs text-slate-400">CTR</div>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">{campaign.metrics?.ctr || 0}%</div>
              </div>
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl">
                <div className="text-xs text-slate-400">ROAS Multiplier</div>
                <div className="text-2xl font-extrabold text-amber-400 mt-1">{campaign.metrics?.roas || 0}x</div>
              </div>
            </div>

            {/* Gap Alerts */}
            {campaign.gapAlerts?.map((alert: string, i: number) => (
              <div key={i} className="p-4 bg-blue-950/40 border border-blue-800/40 rounded-2xl text-xs text-blue-200 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
                <span>{alert}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <button
            disabled={activeStep === 1}
            onClick={() => setActiveStep(activeStep - 1)}
            className="px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 disabled:opacity-40 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Step
          </button>

          <span className="text-xs text-slate-500 font-medium">
            {isSaving ? "Saving progress..." : "All changes auto-saved"}
          </span>

          <button
            disabled={activeStep === 7}
            onClick={() => setActiveStep(activeStep + 1)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-blue-600/30"
          >
            Next Step <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inline Asset Creator Modal */}
      {showAddAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <FileImage className="w-5 h-5 text-blue-400" /> Add Digital Asset Inline
              </h3>
              <button onClick={() => setShowAddAssetModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInlineAddAsset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Asset Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meta_Feed_Square_v1.png"
                  value={newAsset.title}
                  onChange={(e) => setNewAsset({ ...newAsset, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Image / Video URL</label>
                <input
                  type="url"
                  required
                  value={newAsset.url}
                  onChange={(e) => setNewAsset({ ...newAsset, url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Aspect Ratio</label>
                  <select
                    value={newAsset.aspectRatio}
                    onChange={(e) => setNewAsset({ ...newAsset, aspectRatio: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="1:1">1:1 Square (Meta / IG Feed)</option>
                    <option value="2:3">2:3 Vertical (Pinterest Pin)</option>
                    <option value="9:16">9:16 Vertical (TikTok / Reel)</option>
                    <option value="16:9">16:9 Landscape</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Target Channel</label>
                  <select
                    value={newAsset.platformTarget}
                    onChange={(e) => setNewAsset({ ...newAsset, platformTarget: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="Meta">Meta</option>
                    <option value="Pinterest">Pinterest</option>
                    <option value="TikTok">TikTok</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAssetModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  Add & Attach Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inline Copy Creator Modal */}
      {showAddCopyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" /> Add Copy Snippet Inline
              </h3>
              <button onClick={() => setShowAddCopyModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInlineAddCopy} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Snippet Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AIDA Primary Hook v1"
                  value={newCopy.title}
                  onChange={(e) => setNewCopy({ ...newCopy, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Framework</label>
                  <select
                    value={newCopy.framework}
                    onChange={(e) => setNewCopy({ ...newCopy, framework: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="AIDA">AIDA Framework</option>
                    <option value="PAS">PAS Framework</option>
                    <option value="FAB">FAB Framework</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Channel</label>
                  <select
                    value={newCopy.platform}
                    onChange={(e) => setNewCopy({ ...newCopy, platform: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="Meta">Meta</option>
                    <option value="Pinterest">Pinterest</option>
                    <option value="TikTok">TikTok</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Ad Copy Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter primary ad text or headline copy..."
                  value={newCopy.content}
                  onChange={(e) => setNewCopy({ ...newCopy, content: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCopyModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  Save & Attach Copy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Multi-Format Export Blueprint Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Download className="w-5 h-5 text-indigo-400" /> Export Campaign Package (Multi-Format)
              </h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select your preferred export format for client delivery, agency handoff, Google Ads Editor import, or team documentation:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={handleExportCsv}
                className="p-3.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/60 rounded-xl text-left transition group"
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition" />
                <div className="font-bold text-xs text-slate-100">Export CSV</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Excel & Sheets ready</div>
              </button>

              <button
                onClick={handleExportPrintPdf}
                className="p-3.5 bg-slate-950 border border-slate-800 hover:border-blue-500/60 rounded-xl text-left transition group"
              >
                <Printer className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition" />
                <div className="font-bold text-xs text-slate-100">Print / PDF</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Formatted client doc</div>
              </button>

              <button
                onClick={handleExportJson}
                className="p-3.5 bg-slate-950 border border-slate-800 hover:border-amber-500/60 rounded-xl text-left transition group"
              >
                <FileCode className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition" />
                <div className="font-bold text-xs text-slate-100">Export JSON</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Raw backup data</div>
              </button>

              <button
                onClick={handleCopyBlueprint}
                className="p-3.5 bg-slate-950 border border-slate-800 hover:border-indigo-500/60 rounded-xl text-left transition group"
              >
                <Copy className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition" />
                <div className="font-bold text-xs text-slate-100">Copy Markdown</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{copiedBlueprint ? "Copied!" : "Clipboard ready"}</div>
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl max-h-64 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap">
              {campaignBlueprintMarkdown}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
