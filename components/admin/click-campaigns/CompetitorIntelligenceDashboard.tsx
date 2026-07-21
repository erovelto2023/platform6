"use client";

import React, { useState, useEffect } from "react";
import {
  Eye, TrendingUp, DollarSign, AlertTriangle, Search, Filter,
  Plus, Trash2, Settings, X, BarChart3, Target, Globe,
  Calendar, Clock, ArrowUpRight, ArrowDownRight, Zap, Shield,
  Download, Share2, RefreshCw, Activity, Users, Megaphone, Check,
} from "lucide-react";

export interface CompetitorAd {
  _id?: string;
  competitorName: string;
  platform: string;
  adFormat: string;
  headline: string;
  creative: string;
  firstSeen?: string;
  lastSeen?: string;
  estimatedSpend: number;
  estimatedImpressions: number;
  engagementRate: number;
  status: "active" | "inactive" | "archived";
}

export interface CompetitorCampaign {
  _id?: string;
  competitorName: string;
  campaignName: string;
  platform: string;
  objective: string;
  startDate?: string;
  estimatedDailySpend: number;
  estimatedTotalSpend: number;
  targeting: string[];
  creatives: CompetitorAd[];
  status: "active" | "paused" | "ended";
}

export interface CompetitorAlert {
  _id?: string;
  type: "new_campaign" | "budget_increase" | "creative_change" | "strategy_shift";
  competitorName: string;
  message: string;
  severity: "low" | "medium" | "high";
  timestamp?: string;
  acknowledged: boolean;
}

export const CompetitorIntelligenceDashboard: React.FC = () => {
  const [competitors, setCompetitors] = useState<CompetitorCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState<"all" | "Meta" | "Google" | "TikTok" | "LinkedIn">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "paused" | "ended">("all");

  const [newCompetitor, setNewCompetitor] = useState({
    competitorName: "",
    campaignName: "",
    platform: "Meta",
    objective: "",
    estimatedDailySpend: 500,
    targeting: [] as string[],
  });

  const [newCreatives, setNewCreatives] = useState<CompetitorAd[]>([
    { competitorName: "", platform: "Meta", adFormat: "Video", headline: "", creative: "", estimatedSpend: 0, estimatedImpressions: 0, engagementRate: 0, status: "active" },
  ]);

  const fetchCompetitors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/click-campaigns/competitors");
      const data = await response.json();
      if (data.success) {
        setCompetitors(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch competitor intelligence:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const handleCreateCompetitor = async () => {
    try {
      const response = await fetch("/api/admin/click-campaigns/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCompetitor,
          creatives: newCreatives.map(c => ({ ...c, competitorName: newCompetitor.competitorName, platform: newCompetitor.platform })),
          estimatedTotalSpend: newCompetitor.estimatedDailySpend * 30,
          status: "active",
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchCompetitors();
        setShowCreateModal(false);
        setNewCompetitor({
          competitorName: "",
          campaignName: "",
          platform: "Meta",
          objective: "",
          estimatedDailySpend: 500,
          targeting: [],
        });
        setNewCreatives([{ competitorName: "", platform: "Meta", adFormat: "Video", headline: "", creative: "", estimatedSpend: 0, estimatedImpressions: 0, engagementRate: 0, status: "active" }]);
      }
    } catch (error) {
      console.error("Failed to create competitor:", error);
    }
  };

  const handleDeleteCompetitor = async (competitorId: string) => {
    try {
      await fetch(`/api/admin/click-campaigns/competitors/${competitorId}`, {
        method: "DELETE",
      });
      await fetchCompetitors();
    } catch (error) {
      console.error("Failed to delete competitor:", error);
    }
  };

  const filteredCompetitors = competitors.filter(comp => {
    const matchesSearch = comp.competitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.campaignName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === "all" || comp.platform === filterPlatform;
    const matchesStatus = filterStatus === "all" || comp.status === filterStatus;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const totalCompetitors = competitors.length;
  const activeCampaigns = competitors.filter(c => c.status === "active").length;
  const totalSpend = competitors.reduce((sum, comp) => sum + comp.estimatedTotalSpend, 0);
  const totalCreatives = competitors.reduce((sum, comp) => sum + comp.creatives.length, 0);

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
            <Eye className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-bold text-slate-100">Competitor Intelligence Dashboard</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track competitor campaigns, creatives, and spending
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-red-600/20"
        >
          <Plus className="w-4 h-4" /> Track Competitor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-4 h-4 text-red-400" />
            <span className="text-[10px] text-slate-500">Competitors Tracked</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{totalCompetitors}</div>
          <div className="text-[10px] text-slate-400 mt-1">{activeCampaigns} active campaigns</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] text-slate-500">Total Spend Tracked</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">${totalSpend.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 mt-1">Estimated competitor spend</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Megaphone className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] text-slate-500">Creatives Tracked</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{totalCreatives}</div>
          <div className="text-[10px] text-slate-400 mt-1">Ads and creatives monitored</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] text-slate-500">Alerts</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">0</div>
          <div className="text-[10px] text-slate-400 mt-1">New insights detected</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search competitors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
          />
        </div>

        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value as any)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500 transition"
        >
          <option value="all">All Platforms</option>
          <option value="Meta">Meta</option>
          <option value="Google">Google</option>
          <option value="TikTok">TikTok</option>
          <option value="LinkedIn">LinkedIn</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500 transition"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="ended">Ended</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredCompetitors.map((competitor) => (
          <div
            key={competitor._id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  competitor.status === "active" ? "bg-emerald-950 border border-emerald-800" :
                  competitor.status === "paused" ? "bg-amber-950 border border-amber-800" :
                  "bg-slate-950 border border-slate-700"
                }`}>
                  <Eye className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100">{competitor.competitorName}</h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      competitor.status === "active" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                      competitor.status === "paused" ? "bg-amber-950 text-amber-300 border border-amber-800" :
                      "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}>
                      {competitor.status}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded-md text-[10px] font-semibold">
                      {competitor.platform}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{competitor.campaignName}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {competitor.objective}
                    </span>
                    {competitor.startDate && (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Since {new Date(competitor.startDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteCompetitor(competitor._id!)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition"
                  title="Remove competitor"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Daily Spend</div>
                <div className="text-lg font-bold text-slate-100">${competitor.estimatedDailySpend.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">Estimated</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Total Spend</div>
                <div className="text-lg font-bold text-slate-100">${competitor.estimatedTotalSpend.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">Campaign total</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Creatives</div>
                <div className="text-lg font-bold text-slate-100">{competitor.creatives.length}</div>
                <div className="text-[10px] text-slate-400">Ads tracked</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Targeting</div>
                <div className="text-lg font-bold text-slate-100">{competitor.targeting.length}</div>
                <div className="text-[10px] text-slate-400">Segments</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Targeting</div>
              <div className="flex flex-wrap gap-2">
                {competitor.targeting.map((target, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-950 border border-slate-700 rounded-md text-[10px] text-slate-300">
                    {target}
                  </span>
                ))}
              </div>
            </div>

            {competitor.creatives.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tracked Creatives</div>
                <div className="space-y-2">
                  {competitor.creatives.map((creative, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-100">{creative.headline}</span>
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md text-[10px]">{creative.adFormat}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">{creative.creative}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-100">${creative.estimatedSpend.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-500">Spend</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <div className="text-[10px] text-slate-500 mb-1">Impressions</div>
                          <div className="text-xs font-semibold text-slate-300">{creative.estimatedImpressions.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 mb-1">Engagement</div>
                          <div className="text-xs font-semibold text-slate-300">{creative.engagementRate.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 mb-1">Status</div>
                          <div className={`text-xs font-semibold ${
                            creative.status === "active" ? "text-emerald-400" :
                            creative.status === "inactive" ? "text-amber-400" :
                            "text-slate-500"
                          }`}>{creative.status}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-950 border border-red-800 rounded-xl">
                    <Eye className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Track Competitor</h3>
                    <p className="text-xs text-slate-400">Add a competitor campaign to monitor</p>
                  </div>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-800 rounded-lg transition">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Competitor Name *</label>
                    <input
                      type="text"
                      value={newCompetitor.competitorName}
                      onChange={(e) => setNewCompetitor({ ...newCompetitor, competitorName: e.target.value })}
                      placeholder="e.g. Competitor A"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Campaign Name *</label>
                    <input
                      type="text"
                      value={newCompetitor.campaignName}
                      onChange={(e) => setNewCompetitor({ ...newCompetitor, campaignName: e.target.value })}
                      placeholder="e.g. Summer Campaign"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Platform *</label>
                    <select
                      value={newCompetitor.platform}
                      onChange={(e) => setNewCompetitor({ ...newCompetitor, platform: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    >
                      <option value="Meta">Meta</option>
                      <option value="Google">Google</option>
                      <option value="TikTok">TikTok</option>
                      <option value="LinkedIn">LinkedIn</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Objective</label>
                    <input
                      type="text"
                      value={newCompetitor.objective}
                      onChange={(e) => setNewCompetitor({ ...newCompetitor, objective: e.target.value })}
                      placeholder="e.g. Brand Awareness"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Estimated Daily Spend *</label>
                  <input
                    type="number"
                    value={newCompetitor.estimatedDailySpend}
                    onChange={(e) => setNewCompetitor({ ...newCompetitor, estimatedDailySpend: parseInt(e.target.value) })}
                    placeholder="500"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Targeting (comma separated)</label>
                  <input
                    type="text"
                    value={newCompetitor.targeting.join(", ")}
                    onChange={(e) => setNewCompetitor({ ...newCompetitor, targeting: e.target.value.split(",").map(t => t.trim()) })}
                    placeholder="Fitness enthusiasts, 25-45, US market"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-slate-300">Tracked Creatives</label>
                    <button
                      onClick={() => setNewCreatives([...newCreatives, { competitorName: "", platform: newCompetitor.platform, adFormat: "Video", headline: "", creative: "", estimatedSpend: 0, estimatedImpressions: 0, engagementRate: 0, status: "active" }])}
                      className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 transition"
                    >
                      <Plus className="w-3 h-3" /> Add Creative
                    </button>
                  </div>
                  {newCreatives.map((creative, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-700 rounded-lg p-3 mb-2">
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <input
                          type="text"
                          value={creative.headline}
                          onChange={(e) => {
                            const updated = [...newCreatives];
                            updated[idx].headline = e.target.value;
                            setNewCreatives(updated);
                          }}
                          placeholder="Headline"
                          className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                        />
                        <select
                          value={creative.adFormat}
                          onChange={(e) => {
                            const updated = [...newCreatives];
                            updated[idx].adFormat = e.target.value;
                            setNewCreatives(updated);
                          }}
                          className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                        >
                          <option value="Video">Video</option>
                          <option value="Image">Image</option>
                          <option value="Carousel">Carousel</option>
                          <option value="Story">Story</option>
                        </select>
                      </div>
                      <textarea
                        value={creative.creative}
                        onChange={(e) => {
                          const updated = [...newCreatives];
                          updated[idx].creative = e.target.value;
                          setNewCreatives(updated);
                        }}
                        placeholder="Creative description..."
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100 mb-2"
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="number"
                          value={creative.estimatedSpend}
                          onChange={(e) => {
                            const updated = [...newCreatives];
                            updated[idx].estimatedSpend = parseInt(e.target.value);
                            setNewCreatives(updated);
                          }}
                          placeholder="Spend"
                          className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                        />
                        <input
                          type="number"
                          value={creative.estimatedImpressions}
                          onChange={(e) => {
                            const updated = [...newCreatives];
                            updated[idx].estimatedImpressions = parseInt(e.target.value);
                            setNewCreatives(updated);
                          }}
                          placeholder="Impressions"
                          className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                        />
                        <button
                          onClick={() => setNewCreatives(newCreatives.filter((_, i) => i !== idx))}
                          className="p-1 hover:bg-slate-800 rounded transition"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCompetitor}
                  disabled={!newCompetitor.competitorName || !newCompetitor.campaignName}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" /> Track Competitor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
