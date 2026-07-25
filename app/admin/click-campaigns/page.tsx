"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Megaphone, Sparkles, FileImage, BookOpen, Calendar, Layers, BarChart3,
  ShieldCheck, Plus, Rocket, DollarSign, TrendingUp, AlertCircle, CheckCircle2,
  Share2, RefreshCw, Mail, Calculator, Sliders, CheckSquare, Brain, Target,
  FlaskConical, Users, Eye, Wand2, Zap, Trash2, ChevronRight, Search, Filter,
  Copy, KeyRound, Grid, Layers3, Compass, Folder, Globe
} from "lucide-react";

import { CampaignWizardModal } from "@/components/admin/click-campaigns/CampaignWizardModal";
import { DigitalAssetManager, DigitalAssetItem } from "@/components/admin/click-campaigns/DigitalAssetManager";
import { SwipeFileVault, SwipeCopyItem } from "@/components/admin/click-campaigns/SwipeFileVault";
import { VisualCalendar, ScheduledCampaignItem } from "@/components/admin/click-campaigns/VisualCalendar";
import { AnalyticsDashboard } from "@/components/admin/click-campaigns/AnalyticsDashboard";
import { PlatformSpecsMatrix } from "@/components/admin/click-campaigns/PlatformSpecsMatrix";
import { BrandVaultEditor, BrandVaultData } from "@/components/admin/click-campaigns/BrandVaultEditor";
import { RoasCalculatorModal } from "@/components/admin/click-campaigns/RoasCalculatorModal";
import { EmailSequenceMapper } from "@/components/admin/click-campaigns/EmailSequenceMapper";
import { PixelChecklist } from "@/components/admin/click-campaigns/PixelChecklist";
import { AiCreativePrompterModal } from "@/components/admin/click-campaigns/AiCreativePrompterModal";
import { CopywritingFrameworks } from "@/components/admin/click-campaigns/CopywritingFrameworks";
import { PixelTrackingSystem } from "@/components/admin/click-campaigns/PixelTrackingSystem";
import { ABTestingModule } from "@/components/admin/click-campaigns/ABTestingModule";
import { AudienceSegmentationBuilder } from "@/components/admin/click-campaigns/AudienceSegmentationBuilder";
import { BudgetOptimizationEngine } from "@/components/admin/click-campaigns/BudgetOptimizationEngine";
import { CompetitorIntelligenceDashboard } from "@/components/admin/click-campaigns/CompetitorIntelligenceDashboard";
import { HeadlineBuilder } from "@/components/admin/click-campaigns/HeadlineBuilder";
import { PowerWordsReference } from "@/components/admin/click-campaigns/PowerWordsReference";
import { CampaignBuilderWorkspace } from "@/components/admin/click-campaigns/CampaignBuilderWorkspace";
import { KeywordVaultManager } from "@/components/admin/click-campaigns/KeywordVaultManager";

interface ToolTab {
  id: string;
  label: string;
  icon: any;
  category: string;
  description: string;
}

const ALL_TOOLS: ToolTab[] = [
  // Hub 1: Campaigns & Copywriting
  { id: "overview", label: "Overview & Campaigns", icon: Megaphone, category: "campaigns", description: "Campaign command & 7-step builder" },
  { id: "headlines", label: "Headline Builder", icon: Wand2, category: "campaigns", description: "AI performance headline generator" },
  { id: "powerwords", label: "Power Words Vault", icon: Zap, category: "campaigns", description: "Psychological triggers & word vaults" },
  { id: "frameworks", label: "Copy Frameworks", icon: Brain, category: "campaigns", description: "AIDA, PAS, FAB & 4P copy formulas" },

  // Hub 2: Media Assets & Email Vaults
  { id: "dam", label: "Media Assets (DAM)", icon: FileImage, category: "assets", description: "Digital asset manager & aspect mapper" },
  { id: "swipe", label: "Copy & Swipe Vault", icon: BookOpen, category: "assets", description: "Proven ad hooks & copy swipes" },
  { id: "email", label: "Email Sequences & Swipes", icon: Mail, category: "assets", description: "Multi-touch sequences & for-sale swipe file" },
  { id: "keywords", label: "Keywords & Intent", icon: KeyRound, category: "assets", description: "Search intent & volume vault" },

  // Hub 3: Analytics & Performance Optimization
  { id: "analytics", label: "Analytics & Gap Alerts", icon: BarChart3, category: "analytics", description: "KPI performance & conversion alerts" },
  { id: "abtesting", label: "A/B Testing Studio", icon: FlaskConical, category: "analytics", description: "Variant generator & statistical tests" },
  { id: "budget", label: "Budget Optimization", icon: Sliders, category: "analytics", description: "Budget scaling & ROAS rules" },
  { id: "competitors", label: "Competitor Intel", icon: Eye, category: "analytics", description: "Ad spy & competitor positioning" },

  // Hub 4: Audience & Pixel Tracking
  { id: "segments", label: "Audience Segments", icon: Users, category: "audience", description: "Persona builder & audience targeting" },
  { id: "pixelsystem", label: "Pixel Tracking System", icon: Target, category: "audience", description: "Meta CAPI & multi-channel pixel engine" },
  { id: "pixel", label: "Pixel Verification", icon: CheckSquare, category: "audience", description: "Health checklist & event setup" },

  // Hub 5: Strategy, Specs & Brand
  { id: "scheduler", label: "Launch Scheduler", icon: Calendar, category: "brand", description: "Visual ad launch calendar" },
  { id: "specs", label: "Platform Specs Matrix", icon: Layers, category: "brand", description: "Aspect ratio & ad format specs" },
  { id: "brand", label: "Brand Vault", icon: ShieldCheck, category: "brand", description: "Brand voice, colors & guidelines" },
];

const HUB_CATEGORIES = [
  { id: "campaigns", label: "Campaigns & Copy", icon: Rocket, color: "from-blue-600 to-indigo-600" },
  { id: "assets", label: "Assets & Email Vaults", icon: Folder, color: "from-purple-600 to-pink-600" },
  { id: "analytics", label: "Analytics & Optimization", icon: BarChart3, color: "from-emerald-600 to-teal-600" },
  { id: "audience", label: "Audience & Pixels", icon: Target, color: "from-cyan-600 to-blue-600" },
  { id: "brand", label: "Strategy & Brand", icon: ShieldCheck, color: "from-amber-600 to-orange-600" },
];

function CampaignManagerContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams ? searchParams.get("tab") : null;

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [activeHub, setActiveHub] = useState<string>("campaigns");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isRoasModalOpen, setIsRoasModalOpen] = useState<boolean>(false);
  const [isAiPrompterOpen, setIsAiPrompterOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // React to URL query parameter changes (e.g. ?tab=clipter or ?tab=swipe)
  useEffect(() => {
    if (tabParam && ALL_TOOLS.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Synchronize Active Hub when activeTab changes
  useEffect(() => {
    const currentTool = ALL_TOOLS.find((t) => t.id === activeTab);
    if (currentTool && currentTool.category !== activeHub) {
      setActiveHub(currentTool.category);
    }
  }, [activeTab]);

  // State Management
  const [campaigns, setCampaigns] = useState<any[]>([
    {
      _id: "c1",
      title: "Summer Affiliate Masterclass Launch",
      productName: "Affiliate Accelerator Program",
      productType: "Digital Product / eBook",
      targetAudience: "Aspiring online entrepreneurs & side hustlers",
      corePainPoint: "Low CTR and fragmented marketing tools",
      uniqueValue: "10-minute setup with built-in asset specs",
      objective: "Lead Generation",
      status: "Active",
      platforms: ["facebook", "instagram", "tiktok"],
      dailyBudget: 50,
      totalBudget: 500,
      startDate: new Date().toISOString(),
      currentStep: 7,
      completedSteps: [1, 2, 3, 4, 5, 6, 7],
      metrics: { spend: 180, impressions: 14200, clicks: 580, ctr: 4.08, cpc: 0.31, cpa: 12.50, roas: 3.8 },
      gapAlerts: ["TikTok creative fatigue alert: ROAS dropped below 2.0x target."],
    },
  ]);

  const [assets, setAssets] = useState<DigitalAssetItem[]>([
    {
      _id: "a1",
      title: "Affiliate Hero Hook 1:1",
      url: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800",
      mediaType: "image",
      width: 1080,
      height: 1080,
      aspectRatio: "1:1",
      version: "v1.0",
      tags: ["hero", "hook", "social"],
      category: "Social Feed",
      platformTarget: "Meta",
    },
  ]);

  const [copyList, setCopyList] = useState<SwipeCopyItem[]>([
    {
      _id: "sc1",
      title: "The 'Fool Stunt' Transformation Hook",
      contentType: "headline",
      platform: "facebook",
      content: "How a 'Fool Stunt' Turned a Broke Beginner into a $100K/Mo Marketer in 30 Days.",
      context: "Classic John Caples pattern converted to digital ads.",
      performanceTag: "Winner",
      historicalCtr: 4.8,
      historicalConversion: 5.2,
      tags: ["high-ctr", "underdog-story", "caples"],
      dateAdded: "2026-07-20",
    },
    {
      _id: "sc2",
      title: "Do You Make These 3 Ad Copy Mistakes?",
      contentType: "hook",
      platform: "instagram",
      content: "Do You Make These 3 Embarrassing Mistakes When Writing Facebook Ads?",
      context: "Sherwin Cody insecurity question pattern.",
      performanceTag: "High CTR",
      historicalCtr: 4.1,
      historicalConversion: 4.5,
      tags: ["insecurity-question", "mistakes", "meta"],
      dateAdded: "2026-07-21",
    },
  ]);

  const [schedules, setSchedules] = useState<ScheduledCampaignItem[]>([
    {
      id: "sch1",
      title: "Summer Affiliate Masterclass Launch",
      platform: "facebook",
      scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      status: "Scheduled",
      budget: 150,
      assetTitle: "Affiliate Hero Hook 1:1",
      copyTitle: "The 'Fool Stunt' Transformation Hook",
    },
  ]);

  const [brandVault, setBrandVault] = useState<BrandVaultData>({
    brandName: "KB Marketing Academy",
    brandVoice: "Empowering, authoritative, friendly, direct, solution-oriented",
    toneRules: "Use conversational storytelling, bold benefits, zero fluff or academic jargon.",
    visualRules: "High contrast dark mode, vibrant purple/blue accents, clean sans-serif typography.",
    targetAudienceProfile: "Aspiring digital marketers, side-hustlers, course creators & affiliate partners.",
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    accentColor: "#f59e0b",
  });

  // Handlers
  const handleSaveCampaign = (campaignData: any) => {
    setCampaigns([campaignData, ...campaigns]);
    setSelectedCampaignId(campaignData._id);
    setIsWizardOpen(false);
  };

  const handleUpdateCampaign = (updatedCampaign: any) => {
    setCampaigns(campaigns.map((c) => (c._id === updatedCampaign._id ? updatedCampaign : c)));
  };

  const handleDeleteCampaign = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this campaign?")) {
      setCampaigns(campaigns.filter((c) => c._id !== id));
      if (selectedCampaignId === id) setSelectedCampaignId(null);
    }
  };

  const handleCloneCampaign = (camp: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const cloned = {
      ...camp,
      _id: `c_${Date.now()}`,
      title: `${camp.title} (Copy)`,
      status: "Draft",
    };
    setCampaigns([cloned, ...campaigns]);
  };

  const handleAddAsset = (asset: Omit<DigitalAssetItem, "_id">) => {
    const newAsset = { ...asset, _id: `a_${Date.now()}` };
    setAssets([newAsset, ...assets]);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a._id !== id));
  };

  const handleSaveCopy = (copyItem: Omit<SwipeCopyItem, "_id">) => {
    const newCopy = { ...copyItem, _id: `sc_${Date.now()}` };
    setCopyList([newCopy, ...copyList]);
  };

  const handleAddSchedule = (item: ScheduledCampaignItem) => {
    setSchedules([...schedules, item]);
  };

  const handleUpdateSchedule = (item: ScheduledCampaignItem) => {
    setSchedules(schedules.map((s) => (s.id === item.id ? item : s)));
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const handleSaveBrand = (data: BrandVaultData) => {
    setBrandVault(data);
  };

  const selectedCampaign = campaigns.find((c) => c._id === selectedCampaignId);

  const filteredOverviewCampaigns = campaigns.filter((c) => {
    const matchesSearch = searchQuery === "" || c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8 font-sans">
      {/* APP TOP BAR */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl shadow-indigo-600/30">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
                Marketing Campaign Command Center
              </h1>
              <span className="px-2.5 py-0.5 bg-blue-950 border border-blue-800 text-blue-300 rounded-full text-[10px] font-extrabold uppercase font-mono">
                PRO v6.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              End-to-End Campaign Builder, Swipe Vault, Analytics & Multi-Channel Pixel Engine.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setIsRoasModalOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-emerald-400" /> ROAS Calculator
          </button>

          <button
            onClick={() => setIsAiPrompterOpen(true)}
            className="px-4 py-2.5 bg-purple-950 border border-purple-800 text-purple-300 hover:bg-purple-900 rounded-2xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-yellow-300" /> AI Creative Prompter
          </button>

          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 transition shadow-xl shadow-indigo-600/30 cursor-pointer scale-105"
          >
            <Plus className="w-4 h-4" /> Create New Campaign
          </button>
        </div>
      </div>

      {/* HUB CATEGORY SELECTION TABS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" /> Functional Command Hubs
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {ALL_TOOLS.length} Integrated Tools & Modules
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {HUB_CATEGORIES.map((hub) => {
            const Icon = hub.icon;
            const isSelected = activeHub === hub.id;

            return (
              <button
                key={hub.id}
                onClick={() => {
                  setActiveHub(hub.id);
                  const firstTool = ALL_TOOLS.find((t) => t.category === hub.id);
                  if (firstTool) setActiveTab(firstTool.id);
                }}
                className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-500 text-slate-100"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className={`p-2 bg-gradient-to-tr ${hub.color} rounded-xl text-white shadow-md shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs leading-tight">{hub.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECONDARY TOOL MODULE PILLS */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center gap-2 shadow-lg">
        {ALL_TOOLS.filter((t) => t.category === activeHub).map((tool) => {
          const Icon = tool.icon;
          const isSelected = activeTab === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                  : "bg-slate-950 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE WORKSPACE STEPPER DISPLAY (WHEN CAMPAIGN IS SELECTED) */}
      {selectedCampaign ? (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-indigo-500/40 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-xl text-xs font-extrabold font-mono">
                Active Workspace: {selectedCampaign.title}
              </span>
              <span className="text-xs text-slate-400">
                Objective: <strong className="text-slate-200">{selectedCampaign.objective}</strong>
              </span>
            </div>

            <button
              onClick={() => setSelectedCampaignId(null)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
            >
              Close Workspace
            </button>
          </div>

          <CampaignBuilderWorkspace
            campaign={selectedCampaign}
            onUpdateCampaign={handleUpdateCampaign}
            allAssets={assets}
            allCopyList={copyList}
            brandVault={brandVault}
            onBackToDashboard={() => setSelectedCampaignId(null)}
          />
        </div>
      ) : (
        /* STANDARD TAB CONTENT AREA */
        <div className="space-y-6">
          {/* OVERVIEW & CAMPAIGN LIST */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-indigo-400" /> Active Marketing Campaigns ({campaigns.length})
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Click any campaign to launch the 7-step builder workspace with asset and copy linking.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Filter campaigns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 w-44"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-bold"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Draft">Draft</option>
                      <option value="Active">Active</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {filteredOverviewCampaigns.map((camp) => (
                    <div
                      key={camp._id}
                      onClick={() => setSelectedCampaignId(camp._id)}
                      className="bg-slate-950 border border-slate-800 hover:border-indigo-500/60 p-5 rounded-2xl space-y-4 transition cursor-pointer shadow-lg group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-base text-slate-100 group-hover:text-indigo-300 transition">
                              {camp.title}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                camp.status === "Active"
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                  : "bg-amber-950 text-amber-300 border border-amber-800"
                              }`}
                            >
                              {camp.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400">
                            Objective: <span className="text-slate-200">{camp.objective}</span> | Channels:{" "}
                            <span className="text-indigo-300 font-semibold">{camp.platforms?.join(", ") || "None"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xs font-bold text-emerald-400">${camp.dailyBudget}/day</div>
                            <div className="text-[10px] text-slate-400">Spend: ${camp.metrics?.spend || 0}</div>
                          </div>

                          <button
                            onClick={() => setSelectedCampaignId(camp._id)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-blue-600/20"
                          >
                            Manage & Build Out <ChevronRight className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => handleCloneCampaign(camp, e)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                            title="Clone Campaign"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => handleDeleteCampaign(camp._id, e)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-xl transition"
                            title="Delete Campaign"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Metrics Bar */}
                      {camp.metrics && (
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-900 p-3 rounded-xl text-center text-xs">
                          <div>
                            <div className="text-[10px] text-slate-400">Impressions</div>
                            <div className="font-bold text-slate-200">{camp.metrics.impressions?.toLocaleString() || 0}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Clicks</div>
                            <div className="font-bold text-slate-200">{camp.metrics.clicks || 0}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">CTR</div>
                            <div className="font-bold text-emerald-400">{camp.metrics.ctr || 0}%</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">CPC</div>
                            <div className="font-bold text-slate-200">${camp.metrics.cpc || 0}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">CPA</div>
                            <div className="font-bold text-slate-200">${camp.metrics.cpa || 0}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">ROAS</div>
                            <div className="font-bold text-amber-400">{camp.metrics.roas || 0}x</div>
                          </div>
                        </div>
                      )}

                      {/* Gap Alerts */}
                      {camp.gapAlerts?.map((alert: string, i: number) => (
                        <div
                          key={i}
                          className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl text-xs text-blue-200 flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>{alert}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: KEYWORDS */}
          {activeTab === "keywords" && <KeywordVaultManager />}

          {/* TAB CONTENT: DAM */}
          {activeTab === "dam" && (
            <DigitalAssetManager
              assets={assets}
              onAddAsset={handleAddAsset}
              onDeleteAsset={handleDeleteAsset}
            />
          )}

          {/* TAB CONTENT: COPY & SWIPE VAULT */}
          {activeTab === "swipe" && (
            <SwipeFileVault copyList={copyList} onSaveCopy={handleSaveCopy} />
          )}

          {/* TAB CONTENT: COPY FRAMEWORKS LIBRARY */}
          {activeTab === "frameworks" && <CopywritingFrameworks />}

          {/* TAB CONTENT: EMAIL SEQUENCES */}
          {activeTab === "email" && <EmailSequenceMapper />}

          {/* TAB CONTENT: LAUNCH SCHEDULER */}
          {activeTab === "scheduler" && (
            <VisualCalendar
              schedules={schedules}
              onAddSchedule={handleAddSchedule}
              onUpdateSchedule={handleUpdateSchedule}
              onDeleteSchedule={handleDeleteSchedule}
            />
          )}

          {/* TAB CONTENT: ANALYTICS & GAP ALERTS */}
          {activeTab === "analytics" && <AnalyticsDashboard />}

          {/* TAB CONTENT: PIXEL VERIFICATION */}
          {activeTab === "pixel" && <PixelChecklist />}

          {/* TAB CONTENT: PLATFORM SPECS */}
          {activeTab === "specs" && <PlatformSpecsMatrix />}

          {/* TAB CONTENT: BRAND VAULT */}
          {activeTab === "brand" && (
            <BrandVaultEditor brandData={brandVault} onSaveBrand={handleSaveBrand} />
          )}

          {/* TAB CONTENT: PIXEL TRACKING SYSTEM */}
          {activeTab === "pixelsystem" && <PixelTrackingSystem />}

          {/* TAB CONTENT: A/B TESTING MODULE */}
          {activeTab === "abtesting" && <ABTestingModule />}

          {/* TAB CONTENT: AUDIENCE SEGMENTATION BUILDER */}
          {activeTab === "segments" && <AudienceSegmentationBuilder />}

          {/* TAB CONTENT: BUDGET OPTIMIZATION ENGINE */}
          {activeTab === "budget" && <BudgetOptimizationEngine />}

          {/* TAB CONTENT: COMPETITOR INTELLIGENCE DASHBOARD */}
          {activeTab === "competitors" && <CompetitorIntelligenceDashboard />}

          {/* TAB CONTENT: HEADLINE BUILDER */}
          {activeTab === "headlines" && <HeadlineBuilder />}

          {/* TAB CONTENT: POWER WORDS REFERENCE */}
          {activeTab === "powerwords" && <PowerWordsReference />}
        </div>
      )}

      {/* MODALS */}
      {isWizardOpen && (
        <CampaignWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onComplete={handleSaveCampaign}
        />
      )}

      <RoasCalculatorModal isOpen={isRoasModalOpen} onClose={() => setIsRoasModalOpen(false)} />

      <AiCreativePrompterModal isOpen={isAiPrompterOpen} onClose={() => setIsAiPrompterOpen(false)} />
    </div>
  );
}

export default function MarketingCampaignManagerPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400 font-mono">Loading Campaign Manager Studio...</div>}>
      <CampaignManagerContent />
    </Suspense>
  );
}
