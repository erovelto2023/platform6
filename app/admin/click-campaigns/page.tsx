"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone, Sparkles, FileImage, BookOpen, Calendar, Layers, BarChart3,
  ShieldCheck, Plus, Rocket, DollarSign, TrendingUp, AlertCircle, CheckCircle2,
  Share2, RefreshCw, Mail, Calculator, Sliders, CheckSquare, Brain, Target,
  FlaskConical, Users, Eye, Wand2, Zap, Trash2, ChevronRight, Search, Filter,
  Copy, KeyRound, Grid, Layers3, Compass, Folder
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

export default function MarketingCampaignManagerPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [activeHub, setActiveHub] = useState<string>("campaigns");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isRoasModalOpen, setIsRoasModalOpen] = useState<boolean>(false);
  const [isAiPrompterOpen, setIsAiPrompterOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

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
      platforms: ["Meta", "Pinterest"],
      dailyBudget: 50,
      totalBudget: 700,
      completedSteps: [1, 2, 3, 5, 7],
      currentStep: 1,
      selectedAssetIds: ["a1", "a2"],
      selectedCopyIds: ["cp1"],
      targetKeywords: [
        { keyword: "affiliate campaign software", matchType: "Phrase", intent: "Transactional", monthlyVolume: 3400, estimatedCpc: 2.85 }
      ],
      metrics: { spend: 350, impressions: 24500, clicks: 980, ctr: 4.0, cpc: 0.35, cpa: 14.0, roas: 3.8 },
      gapAlerts: ["💡 Optimal performance: ROAS is 3.8x on Pinterest Idea Pins!"],
    },
    {
      _id: "c2",
      title: "TikTok Spark Booster Campaign",
      productName: "Viral Hook Masterclass",
      productType: "Video Course",
      targetAudience: "Content Creators & Coaches",
      corePainPoint: "Struggling to hook viewers in first 3 seconds",
      uniqueValue: "9:16 vertical video templates",
      objective: "Traffic",
      status: "Active",
      platforms: ["TikTok"],
      dailyBudget: 40,
      totalBudget: 400,
      completedSteps: [1, 3],
      currentStep: 1,
      selectedAssetIds: ["a3"],
      selectedCopyIds: ["cp2"],
      metrics: { spend: 280, impressions: 38000, clicks: 760, ctr: 2.0, cpc: 0.36, cpa: 28.0, roas: 1.6 },
      gapAlerts: ["⚠️ Underperforming alert: Refresh 9:16 vertical video hooks to boost CTR."],
    },
  ]);

  const [assets, setAssets] = useState<DigitalAssetItem[]>([
    {
      _id: "a1",
      title: "Summer_Sale_Hero_v1.png",
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
      mediaType: "image",
      width: 1080,
      height: 1080,
      aspectRatio: "1:1",
      version: "v1.0",
      tags: ["Social Feed", "Meta"],
      category: "Feed Post",
      platformTarget: "Meta",
    },
    {
      _id: "a2",
      title: "Pinterest_IdeaPin_Vertical_v2.jpg",
      url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60",
      mediaType: "image",
      width: 1000,
      height: 1500,
      aspectRatio: "2:3",
      version: "v2.1",
      tags: ["Vertical Pin", "Pinterest"],
      category: "Idea Pin",
      platformTarget: "Pinterest",
    },
    {
      _id: "a3",
      title: "TikTok_Hook_Demo_v1.mp4",
      url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
      mediaType: "video",
      width: 1080,
      height: 1920,
      aspectRatio: "9:16",
      version: "v1.0",
      tags: ["Reels", "TikTok"],
      category: "Short Video",
      platformTarget: "TikTok",
    },
  ]);

  const [copyList, setCopyList] = useState<SwipeCopyItem[]>([
    {
      _id: "cp1",
      title: "AIDA Hook - Stop Tool Fatigue",
      contentType: "headline",
      platform: "facebook",
      content: "Stop Juggling 10 Different Tools Just to Run One Campaign",
      context: "Attention: Most online marketers waste 15+ hours a week logging into separated platforms.\nInterest: Consolidated Media Assets, Copy Vaults, and Analytics in 1 dashboard.\nDesire: Launch fully optimized campaigns in under 10 minutes.\nAction: Click to claim your free access today!",
      source: "💡 Founder Story: When I started back in 2021, I was losing track of my Facebook pixel events constantly. This exact setup fixed everything for me.",
      performanceTag: "Winner",
      historicalCtr: 4.2,
    },
    {
      _id: "cp2",
      title: "PAS Problem Agitate Solution - Pinterest",
      contentType: "headline",
      platform: "pinterest",
      content: "Struggling with Low Pinterest CTR?",
      context: "Problem: Your pins aren't getting impressions.\nAgitate: Horizontal 16:9 images get buried by vertical pins on mobile.\nSolution: Switch to 2:3 vertical templates with bold headline overlays.",
      source: "👉 Note: Pinterest favors fresh 2:3 pins with high contrast text overlays.",
      performanceTag: "High CTR",
      historicalCtr: 3.8,
    },
  ]);

  const [schedules, setSchedules] = useState<ScheduledCampaignItem[]>([
    {
      id: "s1",
      title: "Summer Affiliate Blast",
      platform: "Meta",
      scheduledDate: "2026-07-22",
      status: "Active",
      assetTitle: "Summer_Sale_Hero_v1.png (1:1)",
      copyTitle: "AIDA Hook Framework",
      budget: 50,
    },
    {
      id: "s2",
      title: "Pinterest Vertical Pin Launch",
      platform: "Pinterest",
      scheduledDate: "2026-07-25",
      status: "Scheduled",
      assetTitle: "Pinterest_IdeaPin_Vertical_v2.jpg (2:3)",
      copyTitle: "PAS Problem Agitate Solution",
      budget: 35,
    },
  ]);

  const [brandVault, setBrandVault] = useState<BrandVaultData>({
    brandName: "KB Academy",
    brandVoice: "Empowering, friendly, authoritative, beginner-focused",
    toneRules: "Conversational, direct, solution-oriented, zero fluff",
    visualRules: "Clean typography, high contrast dark UI, warm vibrant accents",
    targetAudienceProfile: "Aspiring online entrepreneurs, affiliate marketers, side-hustlers",
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    accentColor: "#f59e0b",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/click-campaigns");
        const data = await res.json();
        if (data.success) {
          if (data.campaigns?.length) setCampaigns(data.campaigns);
          if (data.assets?.length) setAssets(data.assets);
          if (data.copyVault?.length) setCopyList(data.copyVault);
          if (data.brandVault?.brandName) setBrandVault(data.brandVault);
        }
      } catch (e) {
        console.log("Using default interactive client state.");
      }
    }
    loadData();
  }, []);

  const handleCreateWizardCampaign = async (campaignData: any) => {
    const tempId = `c_${Date.now()}`;
    const newCamp = { ...campaignData, _id: tempId };
    
    setCampaigns((prev) => [newCamp, ...prev]);
    setSelectedCampaignId(tempId);

    try {
      const res = await fetch("/api/admin/click-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "campaign", data: campaignData }),
      });
      const data = await res.json();
      if (data.success && data.campaign?._id) {
        setCampaigns((prev) =>
          prev.map((c) => (c._id === tempId ? { ...data.campaign } : c))
        );
        setSelectedCampaignId(data.campaign._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloneCampaign = async (campaignToClone: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const clonedData = {
      ...campaignToClone,
      title: `${campaignToClone.title} (Copy)`,
      status: "Draft",
      metrics: { spend: 0, impressions: 0, clicks: 0, ctr: 0, cpc: 0, cpa: 0, roas: 0 },
    };
    delete clonedData._id;

    handleCreateWizardCampaign(clonedData);
  };

  const handleUpdateCampaign = async (updatedCampaign: any) => {
    setCampaigns((prev) =>
      prev.map((c) => (c._id === updatedCampaign._id ? updatedCampaign : c))
    );

    try {
      await fetch("/api/admin/click-campaigns", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "campaign",
          id: updatedCampaign._id,
          data: updatedCampaign,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCampaign = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    setCampaigns((prev) => prev.filter((c) => c._id !== id));
    if (selectedCampaignId === id) setSelectedCampaignId(null);

    try {
      await fetch(`/api/admin/click-campaigns?type=campaign&id=${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAsset = async (asset: Omit<DigitalAssetItem, "_id">) => {
    const newAssetItem = { ...asset, _id: `a_${Date.now()}` };
    setAssets((prev) => [newAssetItem, ...prev]);

    try {
      await fetch("/api/admin/click-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "asset", data: asset }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a._id !== id));
  };

  const handleSaveCopy = async (copyItem: Omit<SwipeCopyItem, "_id">) => {
    const newCopy = { ...copyItem, _id: `cp_${Date.now()}` };
    setCopyList((prev) => [newCopy, ...prev]);

    try {
      await fetch("/api/admin/click-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "copy", data: copyItem }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSchedule = (scheduleItem: ScheduledCampaignItem) => {
    setSchedules((prev) => [scheduleItem, ...prev]);
  };

  const handleUpdateSchedule = (updatedItem: ScheduledCampaignItem) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === updatedItem.id ? updatedItem : s))
    );
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveBrand = async (data: BrandVaultData) => {
    setBrandVault(data);
    try {
      await fetch("/api/admin/click-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "brand", data }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.objective?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedCampaignObject = campaigns.find((c) => c._id === selectedCampaignId);

  // Render Campaign Workspace if a specific campaign is selected
  if (selectedCampaignObject) {
    return (
      <CampaignBuilderWorkspace
        campaign={selectedCampaignObject}
        allAssets={assets}
        allCopyList={copyList}
        brandVault={brandVault}
        onUpdateCampaign={handleUpdateCampaign}
        onBackToDashboard={() => setSelectedCampaignId(null)}
        onAddAsset={handleAddAsset}
        onSaveCopy={handleSaveCopy}
      />
    );
  }

  // Get tools for active hub
  const activeHubTools = ALL_TOOLS.filter((t) => t.category === activeHub);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Main Command Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-600/30">
                <Megaphone className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                  Marketing Campaign Command Center
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Build, manage, and optimize multi-channel marketing campaigns across 18 specialized hubs.
                </p>
              </div>
            </div>

            {/* Brand Voice Active Indicator */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400">Active Brand Voice:</span>
              <span className="px-2.5 py-0.5 bg-blue-950 border border-blue-800/60 text-blue-300 rounded-full font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> {brandVault.brandName} ({brandVault.brandVoice.split(",")[0]})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setActiveHub("campaigns");
                setActiveTab("powerwords");
              }}
              className="px-4 py-3 bg-cyan-950/60 border border-cyan-800/60 hover:bg-cyan-900/80 text-cyan-300 rounded-2xl text-xs font-bold flex items-center gap-2 transition"
            >
              <Zap className="w-4 h-4 text-cyan-400" /> Power Words
            </button>

            <button
              onClick={() => setIsRoasModalOpen(true)}
              className="px-4 py-3 bg-emerald-950/60 border border-emerald-800/60 hover:bg-emerald-900/80 text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2 transition"
            >
              <Calculator className="w-4 h-4 text-emerald-400" /> ROAS Profit Simulator
            </button>

            <button
              onClick={() => setIsAiPrompterOpen(true)}
              className="px-4 py-3 bg-purple-950/60 border border-purple-800/60 hover:bg-purple-900/80 text-purple-300 rounded-2xl text-xs font-bold flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" /> AI Ad Prompter
            </button>

            <button
              onClick={() => setIsWizardOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl text-xs font-bold flex items-center gap-2.5 transition shadow-lg shadow-indigo-600/30 hover:scale-[1.02]"
            >
              <Rocket className="w-4 h-4 text-yellow-300" /> + Create New Campaign
            </button>
          </div>
        </div>
      </div>

      {/* RESTRUCTURED NAVIGATION SYSTEM (NO HORIZONTAL SCROLLBAR) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        {/* Tier 1: 5 Clean Category Hub Cards (Responsive Grid Layout) */}
        <div className="flex flex-col sm:flex-row items-stretch justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Grid className="w-4 h-4 text-blue-400" /> Command Hub Categories:
          </div>

          {/* Quick Jump Tool Select Box */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Jump to Tool:</span>
            <select
              value={activeTab}
              onChange={(e) => {
                const selectedTool = ALL_TOOLS.find((t) => t.id === e.target.value);
                if (selectedTool) {
                  setActiveHub(selectedTool.category);
                  setActiveTab(selectedTool.id);
                }
              }}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {ALL_TOOLS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tier 1 Hub Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {HUB_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeHub === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveHub(cat.id);
                  const firstTool = ALL_TOOLS.find((t) => t.category === cat.id);
                  if (firstTool) setActiveTab(firstTool.id);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 cursor-pointer ${
                  isSelected
                    ? "bg-slate-950 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${cat.color} text-white shadow-md`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  )}
                </div>

                <div>
                  <div className={`text-xs font-bold ${isSelected ? "text-blue-300" : "text-slate-200"}`}>
                    {cat.label}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {ALL_TOOLS.filter((t) => t.category === cat.id).length} Tools
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tier 2: Sub-Tools Pills (Fits directly in grid row, NO SCROLLBAR) */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Available Tools in Active Hub:
          </div>

          <div className="flex flex-wrap gap-2">
            {activeHubTools.map((tool) => {
              const ToolIcon = tool.icon;
              const isToolActive = activeTab === tool.id;

              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    isToolActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <ToolIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400">Total Campaigns</div>
              <div className="text-2xl font-extrabold text-slate-100 mt-1">{campaigns.length}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Running Multi-Channel</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400">Total Media Assets</div>
              <div className="text-2xl font-extrabold text-slate-100 mt-1">{assets.length}</div>
              <div className="text-[10px] text-blue-400 mt-0.5">Tagged & Spec Verified</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400">Swipe File Copies</div>
              <div className="text-2xl font-extrabold text-slate-100 mt-1">{copyList.length}</div>
              <div className="text-[10px] text-purple-400 mt-0.5">AIDA / PAS / FAB Templates</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400">Scheduled Launches</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{schedules.length}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Auto Aspect Mapped</div>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Active Campaigns List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-400" /> Campaign Command List ({filteredCampaigns.length})
              </h3>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                + Newbie Wizard Setup
              </button>
            </div>

            <div className="space-y-4">
              {filteredCampaigns.map((camp) => {
                const completedCount = camp.completedSteps?.length || 1;
                const progressPct = Math.round((completedCount / 7) * 100);

                return (
                  <div
                    key={camp._id}
                    className="bg-slate-950 p-5 border border-slate-800 hover:border-slate-700 rounded-2xl space-y-4 transition group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-slate-100">{camp.title}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              camp.status === "Active"
                                ? "bg-emerald-950 border-emerald-800/40 text-emerald-300"
                                : camp.status === "Scheduled"
                                ? "bg-indigo-950 border-indigo-800/40 text-indigo-300"
                                : "bg-slate-900 border-slate-800 text-slate-400"
                            }`}
                          >
                            {camp.status}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800/40 rounded font-semibold">
                            {completedCount}/7 Steps Complete ({progressPct}%)
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
                );
              })}
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

      {/* Modals */}
      <CampaignWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleCreateWizardCampaign}
      />

      <RoasCalculatorModal
        isOpen={isRoasModalOpen}
        onClose={() => setIsRoasModalOpen(false)}
      />

      <AiCreativePrompterModal
        isOpen={isAiPrompterOpen}
        onClose={() => setIsAiPrompterOpen(false)}
      />
    </div>
  );
}
