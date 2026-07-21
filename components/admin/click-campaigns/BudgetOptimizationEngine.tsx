"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign, TrendingUp, ArrowRight, Zap, Target, BarChart3,
  Settings, RefreshCw, Plus, Trash2, Search, Filter, Calendar,
  AlertCircle, CheckCircle2, X, PieChart, LineChart, Percent,
  ArrowUpRight, ArrowDownRight, Minus, Maximize2, Download,
  Play, Pause, Sparkles, Brain, Scale, Coins, Check,
} from "lucide-react";

export interface BudgetAllocation {
  platform: string;
  currentBudget: number;
  recommendedBudget: number;
  currentROAS: number;
  projectedROAS: number;
  change: number;
  changePercent: number;
  confidence: number;
  reason: string;
}

export interface OptimizationRule {
  _id?: string;
  name: string;
  type: "auto_shift" | "bid_adjustment" | "pause_underperformer" | "scale_winner";
  condition: string;
  action: string;
  threshold: number;
  status: "active" | "paused";
  lastTriggered?: string;
  totalSavings: number;
}

export interface BudgetOptimization {
  _id?: string;
  name: string;
  totalBudget: number;
  allocations: BudgetAllocation[];
  rules: OptimizationRule[];
  status: "active" | "paused" | "draft";
  lastOptimized?: string;
  nextOptimization?: string;
  totalSavings: number;
  roiImprovement: number;
  autoOptimize: boolean;
}

export const BudgetOptimizationEngine: React.FC = () => {
  const [optimizations, setOptimizations] = useState<BudgetOptimization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "paused" | "draft">("all");

  const [newOptimization, setNewOptimization] = useState({
    name: "",
    totalBudget: 10000,
    autoOptimize: true,
  });

  const [newAllocations, setNewAllocations] = useState<BudgetAllocation[]>([
    { platform: "Meta", currentBudget: 4000, recommendedBudget: 4000, currentROAS: 0, projectedROAS: 0, change: 0, changePercent: 0, confidence: 0, reason: "" },
    { platform: "Google", currentBudget: 3000, recommendedBudget: 3000, currentROAS: 0, projectedROAS: 0, change: 0, changePercent: 0, confidence: 0, reason: "" },
    { platform: "TikTok", currentBudget: 2000, recommendedBudget: 2000, currentROAS: 0, projectedROAS: 0, change: 0, changePercent: 0, confidence: 0, reason: "" },
  ]);

  const [newRules, setNewRules] = useState<OptimizationRule[]>([
    { name: "Auto-shift to high performers", type: "auto_shift", condition: "ROAS > 3.0", action: "Increase budget by 20%", threshold: 3.0, status: "active", totalSavings: 0 },
  ]);

  const fetchOptimizations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/click-campaigns/budget");
      const data = await response.json();
      if (data.success) {
        setOptimizations(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch budget optimizations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptimizations();
  }, []);

  const handleCreateOptimization = async () => {
    try {
      const response = await fetch("/api/admin/click-campaigns/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newOptimization,
          allocations: newAllocations,
          rules: newRules,
          totalSavings: 0,
          roiImprovement: 0,
          status: "draft",
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchOptimizations();
        setShowCreateModal(false);
        setNewOptimization({
          name: "",
          totalBudget: 10000,
          autoOptimize: true,
        });
      }
    } catch (error) {
      console.error("Failed to create optimization:", error);
    }
  };

  const handleDeleteOptimization = async (optimizationId: string) => {
    try {
      await fetch(`/api/admin/click-campaigns/budget/${optimizationId}`, {
        method: "DELETE",
      });
      await fetchOptimizations();
    } catch (error) {
      console.error("Failed to delete optimization:", error);
    }
  };

  const filteredOptimizations = optimizations.filter(opt => {
    const matchesSearch = opt.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || opt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalBudget = optimizations.reduce((sum, opt) => sum + opt.totalBudget, 0);
  const totalSavings = optimizations.reduce((sum, opt) => sum + opt.totalSavings, 0);
  const avgROIImprovement = optimizations.length > 0 ? optimizations.reduce((sum, opt) => sum + opt.roiImprovement, 0) / optimizations.length : 0;
  const activeOptimizations = optimizations.filter(o => o.status === "active").length;

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
            <Brain className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-slate-100">Budget Optimization Engine</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            AI-powered budget allocation and ROI optimization
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-amber-600/20"
        >
          <Plus className="w-4 h-4" /> New Optimization
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] text-slate-500">Total Budget</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">${totalBudget.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 mt-1">Across optimizations</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Coins className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] text-slate-500">Total Savings</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">${totalSavings.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Optimized savings
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] text-slate-500">Avg ROI Improvement</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{avgROIImprovement.toFixed(1)}%</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Performance gain
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] text-slate-500">Active Optimizations</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{activeOptimizations}</div>
          <div className="text-[10px] text-slate-400 mt-1">Running auto-optimization</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search optimizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOptimizations.map((optimization) => (
          <div
            key={optimization._id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  optimization.status === "active" ? "bg-emerald-950 border border-emerald-800" :
                  optimization.status === "paused" ? "bg-amber-950 border border-amber-800" :
                  "bg-slate-950 border border-slate-700"
                }`}>
                  {optimization.autoOptimize ? <Sparkles className="w-5 h-5 text-blue-400" /> : <Brain className="w-5 h-5 text-amber-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100">{optimization.name}</h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      optimization.status === "active" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                      optimization.status === "paused" ? "bg-amber-950 text-amber-300 border border-amber-800" :
                      "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}>
                      {optimization.status}
                    </span>
                    {optimization.autoOptimize && (
                      <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded-md text-[10px] font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Auto
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ${optimization.totalBudget.toLocaleString()} total budget
                    </span>
                    {optimization.lastOptimized && (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" />
                        Last: {new Date(optimization.lastOptimized).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteOptimization(optimization._id!)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition"
                  title="Delete optimization"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Total Savings</div>
                <div className="text-lg font-bold text-slate-100">${optimization.totalSavings.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400 mt-1">Optimized</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">ROI Improvement</div>
                <div className="text-lg font-bold text-slate-100">{optimization.roiImprovement.toFixed(1)}%</div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Performance
                </div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Allocations</div>
                <div className="text-lg font-bold text-slate-100">{optimization.allocations.length}</div>
                <div className="text-[10px] text-slate-400">Platforms</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Active Rules</div>
                <div className="text-lg font-bold text-slate-100">{optimization.rules.filter(r => r.status === "active").length}</div>
                <div className="text-[10px] text-slate-400">Optimization rules</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Budget Allocations</div>
              <div className="space-y-2">
                {optimization.allocations.map((allocation, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-100">{allocation.platform}</span>
                        {allocation.change !== 0 && (
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            allocation.change > 0 ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                            "bg-red-950 text-red-300 border border-red-800"
                          }`}>
                            {allocation.change > 0 ? "+" : ""}{allocation.changePercent.toFixed(1)}%
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-100">${allocation.recommendedBudget.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-500">Recommended</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="text-[10px] text-slate-500 mb-1">Current</div>
                        <div className="text-xs font-semibold text-slate-300">${allocation.currentBudget.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 mb-1">Current ROAS</div>
                        <div className="text-xs font-semibold text-slate-300">{allocation.currentROAS.toFixed(2)}x</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 mb-1">Projected ROAS</div>
                        <div className="text-xs font-semibold text-emerald-400">{allocation.projectedROAS.toFixed(2)}x</div>
                      </div>
                    </div>
                    {allocation.reason && (
                      <div className="mt-2 text-[10px] text-slate-500 italic">{allocation.reason}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Optimization Rules</div>
              <div className="space-y-2">
                {optimization.rules.map((rule, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          rule.status === "active" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                          "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}>
                          {rule.status}
                        </span>
                        <span className="text-xs font-semibold text-slate-100">{rule.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Saved: ${rule.totalSavings.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {rule.condition} → {rule.action} (threshold: {rule.threshold})
                    </div>
                  </div>
                ))}
              </div>
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
                  <div className="p-2 bg-amber-950 border border-amber-800 rounded-xl">
                    <Brain className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Create Budget Optimization</h3>
                    <p className="text-xs text-slate-400">Set up AI-powered budget allocation</p>
                  </div>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-800 rounded-lg transition">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Optimization Name *</label>
                    <input
                      type="text"
                      value={newOptimization.name}
                      onChange={(e) => setNewOptimization({ ...newOptimization, name: e.target.value })}
                      placeholder="e.g. Q1 2024 Campaign Optimization"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Total Budget *</label>
                    <input
                      type="number"
                      value={newOptimization.totalBudget}
                      onChange={(e) => setNewOptimization({ ...newOptimization, totalBudget: parseInt(e.target.value) })}
                      placeholder="10000"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoOptimize"
                    checked={newOptimization.autoOptimize}
                    onChange={(e) => setNewOptimization({ ...newOptimization, autoOptimize: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="autoOptimize" className="text-xs text-slate-300">Enable auto-optimization</label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Platform Allocations</label>
                  {newAllocations.map((allocation, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-700 rounded-lg p-3 mb-2">
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={allocation.platform}
                          onChange={(e) => {
                            const updated = [...newAllocations];
                            updated[idx].platform = e.target.value;
                            setNewAllocations(updated);
                          }}
                          placeholder="Platform"
                          className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                        />
                        <input
                          type="number"
                          value={allocation.currentBudget}
                          onChange={(e) => {
                            const updated = [...newAllocations];
                            updated[idx].currentBudget = parseInt(e.target.value);
                            updated[idx].recommendedBudget = parseInt(e.target.value);
                            setNewAllocations(updated);
                          }}
                          placeholder="Budget"
                          className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                        />
                        <button
                          onClick={() => setNewAllocations(newAllocations.filter((_, i) => i !== idx))}
                          className="p-1 hover:bg-slate-800 rounded transition"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setNewAllocations([...newAllocations, { platform: "", currentBudget: 0, recommendedBudget: 0, currentROAS: 0, projectedROAS: 0, change: 0, changePercent: 0, confidence: 0, reason: "" }])}
                    className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" /> Add Platform
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Optimization Rules</label>
                  {newRules.map((rule, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-700 rounded-lg p-3 mb-2">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="text"
                          value={rule.name}
                          onChange={(e) => {
                            const updated = [...newRules];
                            updated[idx].name = e.target.value;
                            setNewRules(updated);
                          }}
                          placeholder="Rule name"
                          className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                        />
                        <select
                          value={rule.type}
                          onChange={(e) => {
                            const updated = [...newRules];
                            updated[idx].type = e.target.value as any;
                            setNewRules(updated);
                          }}
                          className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                        >
                          <option value="auto_shift">Auto Shift</option>
                          <option value="bid_adjustment">Bid Adjustment</option>
                          <option value="pause_underperformer">Pause Underperformer</option>
                          <option value="scale_winner">Scale Winner</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={rule.condition}
                          onChange={(e) => {
                            const updated = [...newRules];
                            updated[idx].condition = e.target.value;
                            setNewRules(updated);
                          }}
                          placeholder="Condition"
                          className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                        />
                        <input
                          type="text"
                          value={rule.action}
                          onChange={(e) => {
                            const updated = [...newRules];
                            updated[idx].action = e.target.value;
                            setNewRules(updated);
                          }}
                          placeholder="Action"
                          className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                        />
                        <input
                          type="number"
                          value={rule.threshold}
                          onChange={(e) => {
                            const updated = [...newRules];
                            updated[idx].threshold = parseFloat(e.target.value);
                            setNewRules(updated);
                          }}
                          placeholder="Threshold"
                          className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setNewRules([...newRules, { name: "", type: "auto_shift", condition: "", action: "", threshold: 0, status: "active", totalSavings: 0 }])}
                    className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" /> Add Rule
                  </button>
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
                  onClick={handleCreateOptimization}
                  disabled={!newOptimization.name || newAllocations.length === 0}
                  className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" /> Create Optimization
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
