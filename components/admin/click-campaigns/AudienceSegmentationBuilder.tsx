"use client";

import React, { useState, useEffect } from "react";
import {
  Users, Plus, Trash2, Search, Filter, Target, TrendingUp,
  BarChart3, Settings, Copy, Check, X, Zap, Globe, Smartphone,
  Monitor, Clock, DollarSign, Percent, ArrowRight, AlertCircle,
  CheckCircle2, Layers, UserCheck, UserPlus, UserMinus, RefreshCw,
} from "lucide-react";

export interface SegmentRule {
  _id?: string;
  type: "behavior" | "demographic" | "psychographic" | "technographic" | "geographic";
  field: string;
  operator: "equals" | "not_equals" | "contains" | "not_contains" | "greater_than" | "less_than" | "between" | "in_last" | "not_in_last";
  value: string | number | string[];
  description: string;
}

export interface AudienceSegment {
  _id?: string;
  name: string;
  description: string;
  status: "active" | "paused" | "archived";
  type: "custom" | "lookalike" | "retargeting" | "exclusion";
  platform: "all" | "meta" | "google" | "tiktok" | "linkedin" | "email";
  rules: SegmentRule[];
  estimatedSize: number;
  actualSize: number;
  matchRate: number;
  performance: {
    ctr: number;
    conversionRate: number;
    cpa: number;
    roas: number;
  };
  createdAt?: string;
  updatedAt?: string;
  lookalikeSource?: string;
}

export const AudienceSegmentationBuilder: React.FC = () => {
  const [segments, setSegments] = useState<AudienceSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "paused" | "archived">("all");
  const [filterType, setFilterType] = useState<"all" | "custom" | "lookalike" | "retargeting" | "exclusion">("all");

  const [newSegment, setNewSegment] = useState({
    name: "",
    description: "",
    type: "custom" as AudienceSegment["type"],
    platform: "all" as AudienceSegment["platform"],
    lookalikeSource: "",
  });

  const [newRules, setNewRules] = useState<SegmentRule[]>([
    { type: "behavior", field: "", operator: "equals", value: "", description: "" },
  ]);

  const fetchSegments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/click-campaigns/segments");
      const data = await response.json();
      if (data.success) {
        setSegments(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch segments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const handleCreateSegment = async () => {
    try {
      const response = await fetch("/api/admin/click-campaigns/segments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newSegment,
          rules: newRules,
          estimatedSize: 0,
          actualSize: 0,
          matchRate: 0,
          performance: {
            ctr: 0,
            conversionRate: 0,
            cpa: 0,
            roas: 0,
          },
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchSegments();
        setShowCreateModal(false);
        setNewSegment({
          name: "",
          description: "",
          type: "custom",
          platform: "all",
          lookalikeSource: "",
        });
        setNewRules([{ type: "behavior", field: "", operator: "equals", value: "", description: "" }]);
      }
    } catch (error) {
      console.error("Failed to create segment:", error);
    }
  };

  const handleDeleteSegment = async (segmentId: string) => {
    try {
      await fetch(`/api/admin/click-campaigns/segments/${segmentId}`, {
        method: "DELETE",
      });
      await fetchSegments();
    } catch (error) {
      console.error("Failed to delete segment:", error);
    }
  };

  const filteredSegments = segments.filter(seg => {
    const matchesSearch = seg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         seg.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || seg.status === filterStatus;
    const matchesType = filterType === "all" || seg.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalSegments = segments.length;
  const activeSegments = segments.filter(s => s.status === "active").length;
  const totalAudience = segments.reduce((sum, s) => sum + s.actualSize, 0);
  const avgROAS = segments.length > 0 ? segments.reduce((sum, s) => sum + s.performance.roas, 0) / segments.length : 0;

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
            <Users className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-100">Audience Segmentation Builder</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create custom audience segments with behavioral targeting rules
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" /> New Segment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] text-slate-500">Total Segments</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{totalSegments}</div>
          <div className="text-[10px] text-slate-400 mt-1">{activeSegments} active</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] text-slate-500">Total Audience</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{totalAudience.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 mt-1">Unique users</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] text-slate-500">Avg ROAS</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{avgROAS.toFixed(2)}x</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Performance
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] text-slate-500">Match Rate</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {segments.length > 0 ? (segments.reduce((sum, s) => sum + s.matchRate, 0) / segments.length).toFixed(1) : 0}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Average accuracy</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search segments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition"
        >
          <option value="all">All Types</option>
          <option value="custom">Custom</option>
          <option value="lookalike">Lookalike</option>
          <option value="retargeting">Retargeting</option>
          <option value="exclusion">Exclusion</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredSegments.map((segment) => (
          <div
            key={segment._id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  segment.status === "active" ? "bg-emerald-950 border border-emerald-800" :
                  segment.status === "paused" ? "bg-amber-950 border border-amber-800" :
                  "bg-slate-950 border border-slate-700"
                }`}>
                  {segment.type === "lookalike" ? <UserPlus className="w-5 h-5 text-purple-400" /> :
                   segment.type === "retargeting" ? <UserCheck className="w-5 h-5 text-blue-400" /> :
                   segment.type === "exclusion" ? <UserMinus className="w-5 h-5 text-red-400" /> :
                   <Users className="w-5 h-5 text-emerald-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100">{segment.name}</h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      segment.status === "active" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                      segment.status === "paused" ? "bg-amber-950 text-amber-300 border border-amber-800" :
                      "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}>
                      {segment.status}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded-md text-[10px] font-semibold">
                      {segment.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{segment.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      {segment.platform === "all" ? <Globe className="w-3 h-3" /> :
                       segment.platform === "meta" ? <Monitor className="w-3 h-3" /> :
                       <Smartphone className="w-3 h-3" />}
                      {segment.platform}
                    </span>
                    {segment.lookalikeSource && (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Source: {segment.lookalikeSource}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteSegment(segment._id!)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition"
                  title="Delete segment"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Audience Size</div>
                <div className="text-lg font-bold text-slate-100">{segment.actualSize.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">Matched users</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Match Rate</div>
                <div className="text-lg font-bold text-slate-100">{segment.matchRate.toFixed(1)}%</div>
                <div className="text-[10px] text-slate-400">Accuracy</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Conversion Rate</div>
                <div className="text-lg font-bold text-slate-100">{segment.performance.conversionRate.toFixed(1)}%</div>
                <div className="text-[10px] text-slate-400">Performance</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">ROAS</div>
                <div className="text-lg font-bold text-slate-100">{segment.performance.roas.toFixed(2)}x</div>
                <div className="text-[10px] text-slate-400">Return on ad spend</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Targeting Rules</div>
              <div className="space-y-2">
                {segment.rules.map((rule, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md text-[10px] font-semibold">
                        {rule.type}
                      </span>
                      <span className="text-xs text-slate-300 font-mono">{rule.field}</span>
                      <span className="text-xs text-slate-500">{rule.operator}</span>
                      <span className="text-xs text-slate-300">{String(rule.value)}</span>
                    </div>
                    {rule.description && (
                      <div className="text-[10px] text-slate-500 mt-1">{rule.description}</div>
                    )}
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
                  <div className="p-2 bg-emerald-950 border border-emerald-800 rounded-xl">
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Create Audience Segment</h3>
                    <p className="text-xs text-slate-400">Define targeting rules for your audience</p>
                  </div>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-800 rounded-lg transition">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Segment Name *</label>
                    <input
                      type="text"
                      value={newSegment.name}
                      onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                      placeholder="e.g. High-Intent Purchasers"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Segment Type *</label>
                    <select
                      value={newSegment.type}
                      onChange={(e) => setNewSegment({ ...newSegment, type: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    >
                      <option value="custom">Custom</option>
                      <option value="lookalike">Lookalike</option>
                      <option value="retargeting">Retargeting</option>
                      <option value="exclusion">Exclusion</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
                  <textarea
                    value={newSegment.description}
                    onChange={(e) => setNewSegment({ ...newSegment, description: e.target.value })}
                    placeholder="What defines this audience?"
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Platform *</label>
                    <select
                      value={newSegment.platform}
                      onChange={(e) => setNewSegment({ ...newSegment, platform: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    >
                      <option value="all">All Platforms</option>
                      <option value="meta">Meta</option>
                      <option value="google">Google</option>
                      <option value="tiktok">TikTok</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                  {newSegment.type === "lookalike" && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Lookalike Source</label>
                      <input
                        type="text"
                        value={newSegment.lookalikeSource}
                        onChange={(e) => setNewSegment({ ...newSegment, lookalikeSource: e.target.value })}
                        placeholder="e.g. Top 10% LTV Customers"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-slate-300">Targeting Rules *</label>
                    <button
                      onClick={() => setNewRules([...newRules, { type: "behavior", field: "", operator: "equals", value: "", description: "" }])}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
                    >
                      <Plus className="w-3 h-3" /> Add Rule
                    </button>
                  </div>
                  {newRules.map((rule, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-700 rounded-lg p-3 mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <select
                          value={rule.type}
                          onChange={(e) => {
                            const updated = [...newRules];
                            updated[idx].type = e.target.value as any;
                            setNewRules(updated);
                          }}
                          className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                        >
                          <option value="behavior">Behavior</option>
                          <option value="demographic">Demographic</option>
                          <option value="psychographic">Psychographic</option>
                          <option value="technographic">Technographic</option>
                          <option value="geographic">Geographic</option>
                        </select>
                        <input
                          type="text"
                          value={rule.field}
                          onChange={(e) => {
                            const updated = [...newRules];
                            updated[idx].field = e.target.value;
                            setNewRules(updated);
                          }}
                          placeholder="Field"
                          className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                        />
                        <select
                          value={rule.operator}
                          onChange={(e) => {
                            const updated = [...newRules];
                            updated[idx].operator = e.target.value as any;
                            setNewRules(updated);
                          }}
                          className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                        >
                          <option value="equals">equals</option>
                          <option value="not_equals">not equals</option>
                          <option value="contains">contains</option>
                          <option value="not_contains">not contains</option>
                          <option value="greater_than">greater than</option>
                          <option value="less_than">less than</option>
                          <option value="between">between</option>
                          <option value="in_last">in last</option>
                          <option value="not_in_last">not in last</option>
                        </select>
                        {newRules.length > 1 && (
                          <button
                            onClick={() => setNewRules(newRules.filter((_, i) => i !== idx))}
                            className="p-1 hover:bg-slate-800 rounded transition"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={String(rule.value)}
                        onChange={(e) => {
                          const updated = [...newRules];
                          updated[idx].value = e.target.value;
                          setNewRules(updated);
                        }}
                        placeholder="Value"
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100 mb-2"
                      />
                      <input
                        type="text"
                        value={rule.description}
                        onChange={(e) => {
                          const updated = [...newRules];
                          updated[idx].description = e.target.value;
                          setNewRules(updated);
                        }}
                        placeholder="Rule description (optional)"
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100"
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
                  onClick={handleCreateSegment}
                  disabled={!newSegment.name || newRules.length === 0 || newRules.some(r => !r.field || !r.value)}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" /> Create Segment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
