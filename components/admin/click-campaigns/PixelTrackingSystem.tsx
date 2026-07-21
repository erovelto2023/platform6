"use client";

import React, { useState, useEffect } from "react";
import {
  Code2, Copy, Check, Plus, Trash2, BarChart3, Users, MousePointer2,
  TrendingUp, Calendar, Filter, Search, RefreshCw, Download, Share2,
  Settings, Globe, Smartphone, Monitor, Activity, Zap, Target,
  Clock, ArrowRight, AlertCircle, CheckCircle2, X, Percent,
} from "lucide-react";

export interface PixelEvent {
  _id?: string;
  name: string;
  eventType: "page_view" | "click" | "conversion" | "custom" | "purchase" | "signup" | "lead" | "add_to_cart";
  description: string;
  pixelCode: string;
  platform: "web" | "mobile" | "both";
  status: "active" | "paused" | "archived";
  createdAt?: string;
  customEventName?: string;
  rules?: any[];
  stats?: {
    totalTriggers: number;
    uniqueVisitors: number;
    conversionRate: number;
    lastTriggered?: string;
  };
}

export const PixelTrackingSystem: React.FC = () => {
  const [pixels, setPixels] = useState<PixelEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "paused" | "archived">("all");
  const [filterEventType, setFilterEventType] = useState<"all" | "page_view" | "click" | "conversion" | "purchase" | "signup" | "lead" | "add_to_cart" | "custom">("all");

  const [newPixel, setNewPixel] = useState({
    name: "",
    description: "",
    eventType: "page_view" as PixelEvent["eventType"],
    platform: "both" as PixelEvent["platform"],
    customEventName: "",
  });

  // Generate pixel code based on event type
  const generatePixelCode = (pixel: PixelEvent): string => {
    const eventName = pixel.eventType === "custom" ? pixel.customEventName : pixel.eventType;
    const pixelId = pixel._id || "new_pixel";
    
    return `<!-- KB Academy Pixel -->
<script>
  (function(w,d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0];
    if(!d.getElementById(id)){
      js=d.createElement(s);
      js.id=id;
      js.src="https://cdn.kbacademy.com/pixel/v1.js";
      js.setAttribute('data-pixel-id','${pixelId}');
      js.setAttribute('data-event','${eventName}');
      fjs.parentNode.insertBefore(js,fjs);
    }
  }(window,document,'script','kb-pixel-${pixelId}'));
</script>`;
  };

  // Fetch pixels from API
  const fetchPixels = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/click-campaigns/pixels");
      const data = await response.json();
      if (data.success) {
        setPixels(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch pixels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPixels();
  }, []);

  const handleCreatePixel = async () => {
    try {
      const tempPixel: PixelEvent = {
        ...newPixel,
        _id: `temp_${Date.now()}`,
        pixelCode: "",
        status: "active",
      };
      
      const pixelCode = generatePixelCode(tempPixel);
      
      const response = await fetch("/api/admin/click-campaigns/pixels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPixel,
          pixelCode,
          stats: {
            totalTriggers: 0,
            uniqueVisitors: 0,
            conversionRate: 0,
          },
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchPixels();
        setShowCreateModal(false);
        setNewPixel({
          name: "",
          description: "",
          eventType: "page_view",
          platform: "both",
          customEventName: "",
        });
      }
    } catch (error) {
      console.error("Failed to create pixel:", error);
    }
  };

  const handleDeletePixel = async (pixelId: string) => {
    try {
      await fetch(`/api/admin/click-campaigns/pixels/${pixelId}`, {
        method: "DELETE",
      });
      await fetchPixels();
    } catch (error) {
      console.error("Failed to delete pixel:", error);
    }
  };

  const handleCopyPixelCode = (pixelCode: string) => {
    navigator.clipboard.writeText(pixelCode);
  };

  const filteredPixels = pixels.filter(pixel => {
    const matchesSearch = pixel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pixel.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || pixel.status === filterStatus;
    const matchesEventType = filterEventType === "all" || pixel.eventType === filterEventType;
    return matchesSearch && matchesStatus && matchesEventType;
  });

  const totalPixels = pixels.length;
  const activePixels = pixels.filter(p => p.status === "active").length;
  const totalTriggers = pixels.reduce((sum, p) => sum + (p.stats?.totalTriggers || 0), 0);
  const avgConversionRate = pixels.length > 0
    ? pixels.reduce((sum, p) => sum + (p.stats?.conversionRate || 0), 0) / pixels.length
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
            <Target className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-slate-100">Pixel Tracking System</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create and manage tracking pixels for events
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> New Pixel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] text-slate-500">Total Pixels</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{totalPixels}</div>
          <div className="text-[10px] text-slate-400 mt-1">{activePixels} active</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] text-slate-500">Total Triggers</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{totalTriggers.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> All time
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Percent className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] text-slate-500">Avg Conversion</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{avgConversionRate.toFixed(1)}%</div>
          <div className="text-[10px] text-slate-400 mt-1">Across all pixels</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] text-slate-500">Unique Visitors</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {pixels.reduce((sum, p) => sum + (p.stats?.uniqueVisitors || 0), 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Tracked users</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search pixels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={filterEventType}
          onChange={(e) => setFilterEventType(e.target.value as any)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition"
        >
          <option value="all">All Event Types</option>
          <option value="page_view">Page View</option>
          <option value="click">Click</option>
          <option value="conversion">Conversion</option>
          <option value="purchase">Purchase</option>
          <option value="signup">Signup</option>
          <option value="lead">Lead</option>
          <option value="add_to_cart">Add to Cart</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPixels.map((pixel) => (
          <div
            key={pixel._id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  pixel.status === "active" ? "bg-emerald-950 border border-emerald-800" :
                  pixel.status === "paused" ? "bg-amber-950 border border-amber-800" :
                  "bg-slate-950 border border-slate-700"
                }`}>
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100">{pixel.name}</h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      pixel.status === "active" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                      pixel.status === "paused" ? "bg-amber-950 text-amber-300 border border-amber-800" :
                      "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}>
                      {pixel.status}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded-md text-[10px] font-semibold">
                      {pixel.eventType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{pixel.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      {pixel.platform === "web" ? <Monitor className="w-3 h-3" /> :
                       pixel.platform === "mobile" ? <Smartphone className="w-3 h-3" /> :
                       <Globe className="w-3 h-3" />}
                      {pixel.platform}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pixel.createdAt ? new Date(pixel.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyPixelCode(pixel.pixelCode)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition"
                  title="Copy pixel code"
                >
                  <Copy className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => handleDeletePixel(pixel._id!)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition"
                  title="Delete pixel"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Total Triggers</div>
                <div className="text-lg font-bold text-slate-100">{pixel.stats?.totalTriggers?.toLocaleString() || 0}</div>
                <div className="text-[10px] text-slate-400">Events fired</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Unique Visitors</div>
                <div className="text-lg font-bold text-slate-100">{pixel.stats?.uniqueVisitors?.toLocaleString() || 0}</div>
                <div className="text-[10px] text-slate-400">Distinct users</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Conversion Rate</div>
                <div className="text-lg font-bold text-slate-100">{pixel.stats?.conversionRate?.toFixed(1) || 0}%</div>
                <div className="text-[10px] text-slate-400">Performance</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-1">Last Triggered</div>
                <div className="text-lg font-bold text-slate-100">
                  {pixel.stats?.lastTriggered ? new Date(pixel.stats.lastTriggered).toLocaleDateString() : "Never"}
                </div>
                <div className="text-[10px] text-slate-400">Activity</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pixel Code</div>
              <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                <pre className="text-[10px] text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
                  {pixel.pixelCode}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full">
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-950 border border-blue-800 rounded-xl">
                    <Plus className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Create Tracking Pixel</h3>
                    <p className="text-xs text-slate-400">Set up a new event tracking pixel</p>
                  </div>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-800 rounded-lg transition">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pixel Name *</label>
                  <input
                    type="text"
                    value={newPixel.name}
                    onChange={(e) => setNewPixel({ ...newPixel, name: e.target.value })}
                    placeholder="e.g. Homepage View"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
                  <textarea
                    value={newPixel.description}
                    onChange={(e) => setNewPixel({ ...newPixel, description: e.target.value })}
                    placeholder="What does this pixel track?"
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Event Type *</label>
                  <select
                    value={newPixel.eventType}
                    onChange={(e) => setNewPixel({ ...newPixel, eventType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="page_view">Page View</option>
                    <option value="click">Click</option>
                    <option value="conversion">Conversion</option>
                    <option value="purchase">Purchase</option>
                    <option value="signup">Signup</option>
                    <option value="lead">Lead</option>
                    <option value="add_to_cart">Add to Cart</option>
                    <option value="custom">Custom Event</option>
                  </select>
                </div>

                {newPixel.eventType === "custom" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Custom Event Name *</label>
                    <input
                      type="text"
                      value={newPixel.customEventName}
                      onChange={(e) => setNewPixel({ ...newPixel, customEventName: e.target.value })}
                      placeholder="e.g. button_click"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Platform *</label>
                  <select
                    value={newPixel.platform}
                    onChange={(e) => setNewPixel({ ...newPixel, platform: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="both">Both</option>
                  </select>
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
                  onClick={handleCreatePixel}
                  disabled={!newPixel.name || (newPixel.eventType === "custom" && !newPixel.customEventName)}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" /> Create Pixel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
