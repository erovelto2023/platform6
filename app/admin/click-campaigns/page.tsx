"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Sparkles,
  FileImage,
  BookOpen,
  Calendar,
  Layers,
  BarChart3,
  ShieldCheck,
  Plus,
  Rocket,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Share2,
  RefreshCw,
  Mail,
  Calculator,
  Sliders,
  CheckSquare,
  Brain,
  Target,
  FlaskConical,
  Users,
  Eye,
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

export default function MarketingCampaignManagerPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isRoasModalOpen, setIsRoasModalOpen] = useState<boolean>(false);
  const [isAiPrompterOpen, setIsAiPrompterOpen] = useState<boolean>(false);

  // State Management
  const [campaigns, setCampaigns] = useState<any[]>([
    {
      _id: "c1",
      title: "Summer Affiliate Masterclass Launch",
      objective: "Lead Generation",
      status: "Active",
      platforms: ["Meta", "Pinterest"],
      dailyBudget: 50,
      totalBudget: 700,
      metrics: { spend: 350, impressions: 24500, clicks: 980, ctr: 4.0, cpc: 0.35, cpa: 14.0, roas: 3.8 },
      gapAlerts: ["💡 Optimal performance: ROAS is 3.8x on Pinterest Idea Pins!"],
    },
    {
      _id: "c2",
      title: "TikTok Spark Booster Campaign",
      objective: "Traffic",
      status: "Active",
      platforms: ["TikTok"],
      dailyBudget: 40,
      totalBudget: 400,
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
    setCampaigns((prev) => [
      {
        ...campaignData,
        _id: `c_${Date.now()}`,
      },
      ...prev,
    ]);

    try {
      await fetch("/api/admin/click-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "campaign", data: campaignData }),
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

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Main Bar */}
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
                  Marketing Campaign Manager
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  All-in-one command center solving fragmentation for online entrepreneurs & affiliate marketers.
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
              <Rocket className="w-4 h-4 text-yellow-300" /> Launch Setup Wizard
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800/80">
        {[
          { id: "overview", label: "Overview & Active", icon: Megaphone },
          { id: "dam", label: "Media Assets (DAM)", icon: FileImage },
          { id: "swipe", label: "Copy & Swipe Vault", icon: BookOpen },
          { id: "frameworks", label: "Copy Frameworks", icon: Brain },
          { id: "email", label: "Email Sequences", icon: Mail },
          { id: "scheduler", label: "Launch Scheduler", icon: Calendar },
          { id: "analytics", label: "Analytics & Gap Alerts", icon: BarChart3 },
          { id: "pixel", label: "Pixel Verification", icon: CheckSquare },
          { id: "specs", label: "Platform Specs", icon: Layers },
          { id: "brand", label: "Brand Vault", icon: ShieldCheck },
          { id: "pixelsystem", label: "Pixel Tracking", icon: Target },
          { id: "abtesting", label: "A/B Testing", icon: FlaskConical },
          { id: "segments", label: "Audience Segments", icon: Users },
          { id: "budget", label: "Budget Optimization", icon: Sliders },
          { id: "competitors", label: "Competitor Intel", icon: Eye },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400">Active Campaigns</div>
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

          {/* Active Campaigns List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-400" /> Active Marketing Campaigns
              </h3>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                + Newbie Wizard Setup
              </button>
            </div>

            <div className="space-y-4">
              {campaigns.map((camp) => (
                <div
                  key={camp._id}
                  className="bg-slate-950 p-5 border border-slate-800 hover:border-slate-700 rounded-2xl space-y-4 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-100">{camp.title}</span>
                        <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800/40 rounded-full text-[10px] font-bold">
                          {camp.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Objective: <span className="text-slate-200">{camp.objective}</span> | Target Platforms:{" "}
                        <span className="text-indigo-300 font-semibold">{camp.platforms.join(", ")}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">${camp.dailyBudget}/day</div>
                      <div className="text-[10px] text-slate-400">Spend: ${camp.metrics?.spend || 0}</div>
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  {camp.metrics && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-900 p-3 rounded-xl text-center text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">Impressions</div>
                        <div className="font-bold text-slate-200">{camp.metrics.impressions.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Clicks</div>
                        <div className="font-bold text-slate-200">{camp.metrics.clicks}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">CTR</div>
                        <div className="font-bold text-emerald-400">{camp.metrics.ctr}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">CPC</div>
                        <div className="font-bold text-slate-200">${camp.metrics.cpc}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">CPA</div>
                        <div className="font-bold text-slate-200">${camp.metrics.cpa}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">ROAS</div>
                        <div className="font-bold text-amber-400">{camp.metrics.roas}x</div>
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
        <VisualCalendar schedules={schedules} onAddSchedule={handleAddSchedule} />
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
