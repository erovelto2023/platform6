"use client";

import React, { useState, useEffect } from "react";
import {
  FlaskConical, Copy, Check, Plus, Trash2, BarChart3, TrendingUp,
  Calendar, Filter, Search, RefreshCw, Download, Share2, Settings,
  Play, Pause, Trophy, AlertCircle, CheckCircle2, X, ArrowRight,
  Split, Zap, Target, Users, Percent, Clock, Award,
} from "lucide-react";

export interface ABTestVariant {
  _id?: string;
  name: string;
  type: "headline" | "creative" | "offer" | "cta" | "landing_page" | "email_subject";
  content: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
  revenue: number;
  isWinner: boolean;
  confidence: number;
}

export interface ABTestExperiment {
  _id?: string;
  name: string;
  description: string;
  status: "draft" | "running" | "completed" | "paused";
  type: "headline" | "creative" | "offer" | "cta" | "landing_page" | "email_subject";
  platform: string;
  startDate: string;
  endDate: string;
  targetAudience: string;
  variants: ABTestVariant[];
  winnerId?: string;
  statisticalSignificance: number;
  minSampleSize: number;
  currentSampleSize: number;
  autoWinner: boolean;
  createdAt?: string;
}

export const ABTestingModule: React.FC = () => {
  const [experiments, setExperiments] = useState<ABTestExperiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "running" | "completed" | "paused">("all");

  const [newExperiment, setNewExperiment] = useState({
    name: "",
    description: "",
    type: "headline" as ABTestExperiment["type"],
    platform: "Meta",
    targetAudience: "",
    startDate: "",
    endDate: "",
    autoWinner: true,
    minSampleSize: 1000,
  });

  const [newVariants, setNewVariants] = useState([
    { name: "Variant A", content: "" },
    { name: "Variant B", content: "" },
  ]);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/click-campaigns/abtests");
      const data = await response.json();
      if (data.success) {
        setExperiments(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch A/B tests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  const handleCreateExperiment = async () => {
    try {
      const response = await fetch("/api/admin/click-campaigns/abtests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newExperiment,
          variants: newVariants.map((v) => ({
            name: v.name,
            type: newExperiment.type,
            content: v.content,
            impressions: 0,
            clicks: 0,
            conversions: 0,
            ctr: 0,
            conversionRate: 0,
            revenue: 0,
            isWinner: false,
            confidence: 0,
          })),
          currentSampleSize: 0,
          statisticalSignificance: 0,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchExperiments();
        setShowCreateModal(false);
        setNewExperiment({
          name: "",
          description: "",
          type: "headline",
          platform: "Meta",
          targetAudience: "",
          startDate: "",
          endDate: "",
          autoWinner: true,
          minSampleSize: 1000,
        });
        setNewVariants([{ name: "Variant A", content: "" }, { name: "Variant B", content: "" }]);
      }
    } catch (error) {
      console.error("Failed to create experiment:", error);
    }
  };

  const handleStartExperiment = async (experimentId: string) => {
    try {
      await fetch(`/api/admin/click-campaigns/abtests/${experimentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "running" }),
      });
      await fetchExperiments();
    } catch (error) {
      console.error("Failed to start experiment:", error);
    }
  };

  const handlePauseExperiment = async (experimentId: string) => {
    try {
      await fetch(`/api/admin/click-campaigns/abtests/${experimentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paused" }),
      });
      await fetchExperiments();
    } catch (error) {
      console.error("Failed to pause experiment:", error);
    }
  };

  const handleDeleteExperiment = async (experimentId: string) => {
    try {
      await fetch(`/api/admin/click-campaigns/abtests/${experimentId}`, {
        method: "DELETE",
      });
      await fetchExperiments();
    } catch (error) {
      console.error("Failed to delete experiment:", error);
    }
  };

  const handleDeclareWinner = async (experimentId: string, variantId: string) => {
    try {
      const experiment = experiments.find(e => e._id === experimentId);
      if (!experiment) return;
      
      await fetch(`/api/admin/click-campaigns/abtests/${experimentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          winnerId: variantId,
          status: "completed",
          variants: experiment.variants.map(v => ({
            ...v,
            isWinner: v._id === variantId,
          })),
        }),
      });
      await fetchExperiments();
    } catch (error) {
      console.error("Failed to declare winner:", error);
    }
  };

  const filteredExperiments = experiments.filter(exp => {
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || exp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalExperiments = experiments.length;
  const runningExperiments = experiments.filter(e => e.status === "running").length;
  const completedExperiments = experiments.filter(e => e.status === "completed").length;
  const avgImprovement = completedExperiments > 0
    ? experiments.filter(e => e.status === "completed").reduce((sum, exp) => {
        if (!exp.winnerId) return sum;
        const winner = exp.variants.find(v => v._id === exp.winnerId);
        const baseline = exp.variants.find(v => v._id !== exp.winnerId);
        if (!winner || !baseline || baseline.conversionRate === 0) return sum;
        const improvement = ((winner.conversionRate - baseline.conversionRate) / baseline.conversionRate) * 100;
        return sum + improvement;
      }, 0) / completedExperiments
    : 0;

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
            <FlaskConical className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-slate-100">A/B Testing Module</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Run headline, creative, and offer tests with statistical significance
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" /> New Experiment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <FlaskConical className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] text-slate-500">Total Tests</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{totalExperiments}</div>
          <div className="text-[10px] text-slate-400 mt-1">{runningExperiments} running</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] text-slate-500">Completed</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{completedExperiments}</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Winners found
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Percent className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] text-slate-500">Avg Improvement</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{avgImprovement.toFixed(1)}%</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Conversion lift
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] text-slate-500">Significance</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">95%+</div>
          <div className="text-[10px] text-slate-400 mt-1">Confidence threshold</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search experiments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredExperiments.map((experiment) => (
          <div
            key={experiment._id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  experiment.status === "running" ? "bg-emerald-950 border border-emerald-800" :
                  experiment.status === "completed" ? "bg-blue-950 border border-blue-800" :
                  experiment.status === "paused" ? "bg-amber-950 border border-amber-800" :
                  "bg-slate-950 border border-slate-700"
                }`}>
                  {experiment.status === "running" ? <Play className="w-5 h-5 text-emerald-400" /> :
                   experiment.status === "completed" ? <Trophy className="w-5 h-5 text-blue-400" /> :
                   experiment.status === "paused" ? <Pause className="w-5 h-5 text-amber-400" /> :
                   <FlaskConical className="w-5 h-5 text-slate-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100">{experiment.name}</h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      experiment.status === "running" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                      experiment.status === "completed" ? "bg-blue-950 text-blue-300 border border-blue-800" :
                      experiment.status === "paused" ? "bg-amber-950 text-amber-300 border border-amber-800" :
                      "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}>
                      {experiment.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{experiment.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Split className="w-3 h-3" />
                      {experiment.type}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {experiment.platform}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {experiment.status === "draft" && (
                  <button
                    onClick={() => handleStartExperiment(experiment._id!)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition"
                    title="Start experiment"
                  >
                    <Play className="w-4 h-4 text-emerald-400" />
                  </button>
                )}
                {experiment.status === "running" && (
                  <button
                    onClick={() => handlePauseExperiment(experiment._id!)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition"
                    title="Pause experiment"
                  >
                    <Pause className="w-4 h-4 text-amber-400" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteExperiment(experiment._id!)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition"
                  title="Delete experiment"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Sample Size</div>
                <div className="text-lg font-bold text-slate-100">{experiment.currentSampleSize.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">Target: {experiment.minSampleSize.toLocaleString()}</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Significance</div>
                <div className="text-lg font-bold text-slate-100">{experiment.statisticalSignificance.toFixed(1)}%</div>
                <div className="text-[10px] text-slate-400">Confidence level</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Total Revenue</div>
                <div className="text-lg font-bold text-slate-100">${experiment.variants.reduce((sum, v) => sum + v.revenue, 0).toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">All variants</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Auto Winner</div>
                <div className="text-lg font-bold text-slate-100">{experiment.autoWinner ? "On" : "Off"}</div>
                <div className="text-[10px] text-slate-400">Auto-deployment</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Variants Performance</div>
              {experiment.variants.map((variant) => (
                <div
                  key={variant._id}
                  className={`bg-slate-950 border rounded-lg p-4 ${
                    variant.isWinner ? "border-amber-500/50" : "border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      {variant.isWinner && (
                        <div className="p-1 bg-amber-950 border border-amber-800 rounded-md">
                          <Award className="w-4 h-4 text-amber-400" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-100">{variant.name}</span>
                          {variant.isWinner && (
                            <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded-md text-[10px] font-semibold">
                              Winner
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 font-mono">{variant.content}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-100">{variant.conversionRate.toFixed(1)}%</div>
                      <div className="text-[10px] text-slate-400">Conversion Rate</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    <div>
                      <div className="text-[10px] text-slate-500 mb-1">Impressions</div>
                      <div className="text-sm font-semibold text-slate-100">{variant.impressions.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 mb-1">Clicks</div>
                      <div className="text-sm font-semibold text-slate-100">{variant.clicks.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 mb-1">CTR</div>
                      <div className="text-sm font-semibold text-slate-100">{variant.ctr.toFixed(2)}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 mb-1">Conversions</div>
                      <div className="text-sm font-semibold text-slate-100">{variant.conversions.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 mb-1">Revenue</div>
                      <div className="text-sm font-semibold text-slate-100">${variant.revenue.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-500">Statistical Confidence</span>
                      <span className="text-[10px] font-semibold text-slate-300">{variant.confidence.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition ${
                          variant.confidence >= 95 ? "bg-emerald-500" :
                          variant.confidence >= 80 ? "bg-amber-500" :
                          "bg-red-500"
                        }`}
                        style={{ width: `${variant.confidence}%` }}
                      />
                    </div>
                  </div>

                  {experiment.status === "running" && !experiment.winnerId && variant.confidence >= 90 && (
                    <button
                      onClick={() => handleDeclareWinner(experiment._id!, variant._id!)}
                      className="mt-3 w-full px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Trophy className="w-3.5 h-3.5" /> Declare as Winner
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-950 border border-purple-800 rounded-xl">
                    <FlaskConical className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Create A/B Test</h3>
                    <p className="text-xs text-slate-400">Set up a new experiment</p>
                  </div>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-800 rounded-lg transition">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Test Name *</label>
                    <input
                      type="text"
                      value={newExperiment.name}
                      onChange={(e) => setNewExperiment({ ...newExperiment, name: e.target.value })}
                      placeholder="e.g. Headline Test - Summer Campaign"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Test Type *</label>
                    <select
                      value={newExperiment.type}
                      onChange={(e) => setNewExperiment({ ...newExperiment, type: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    >
                      <option value="headline">Headline</option>
                      <option value="creative">Creative</option>
                      <option value="offer">Offer</option>
                      <option value="cta">CTA Button</option>
                      <option value="landing_page">Landing Page</option>
                      <option value="email_subject">Email Subject</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
                  <textarea
                    value={newExperiment.description}
                    onChange={(e) => setNewExperiment({ ...newExperiment, description: e.target.value })}
                    placeholder="What are you testing?"
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Platform *</label>
                    <input
                      type="text"
                      value={newExperiment.platform}
                      onChange={(e) => setNewExperiment({ ...newExperiment, platform: e.target.value })}
                      placeholder="e.g. Meta, Website, Email"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Audience</label>
                    <input
                      type="text"
                      value={newExperiment.targetAudience}
                      onChange={(e) => setNewExperiment({ ...newExperiment, targetAudience: e.target.value })}
                      placeholder="e.g. US, 25-45, interested in fitness"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Date *</label>
                    <input
                      type="date"
                      value={newExperiment.startDate}
                      onChange={(e) => setNewExperiment({ ...newExperiment, startDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">End Date *</label>
                    <input
                      type="date"
                      value={newExperiment.endDate}
                      onChange={(e) => setNewExperiment({ ...newExperiment, endDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Min Sample Size</label>
                    <input
                      type="number"
                      value={newExperiment.minSampleSize}
                      onChange={(e) => setNewExperiment({ ...newExperiment, minSampleSize: parseInt(e.target.value) })}
                      placeholder="1000"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="autoWinner"
                      checked={newExperiment.autoWinner}
                      onChange={(e) => setNewExperiment({ ...newExperiment, autoWinner: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="autoWinner" className="text-xs text-slate-300">Auto-declare winner at 95% confidence</label>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-slate-300">Test Variants *</label>
                    <button
                      onClick={() => setNewVariants([...newVariants, { name: `Variant ${String.fromCharCode(65 + newVariants.length)}`, content: "" }])}
                      className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
                    >
                      <Plus className="w-3 h-3" /> Add Variant
                    </button>
                  </div>
                  {newVariants.map((variant, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-700 rounded-lg p-3 mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => {
                            const updated = [...newVariants];
                            updated[idx].name = e.target.value;
                            setNewVariants(updated);
                          }}
                          placeholder="Variant name"
                          className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                        />
                        {newVariants.length > 2 && (
                          <button
                            onClick={() => setNewVariants(newVariants.filter((_, i) => i !== idx))}
                            className="p-1 hover:bg-slate-800 rounded transition"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        )}
                      </div>
                      <textarea
                        value={variant.content}
                        onChange={(e) => {
                          const updated = [...newVariants];
                          updated[idx].content = e.target.value;
                          setNewVariants(updated);
                        }}
                        placeholder="Variant content..."
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-xs text-slate-100"
                      />
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
                  onClick={handleCreateExperiment}
                  disabled={!newExperiment.name || !newExperiment.startDate || !newExperiment.endDate || newVariants.length < 2}
                  className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" /> Create Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
