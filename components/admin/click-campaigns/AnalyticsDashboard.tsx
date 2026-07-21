"use client";

import React, { useState } from "react";
import { BarChart3, AlertOctagon, Download, DollarSign, Eye, MousePointer, TrendingUp, ShieldAlert, ArrowUpRight, CheckCircle2 } from "lucide-react";

export interface ChannelPerformance {
  platform: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
  status: "Performing Well" | "Underperforming" | "Budget Alert";
}

interface AnalyticsDashboardProps {
  channelData?: ChannelPerformance[];
  gapAlerts?: string[];
}

const defaultChannelData: ChannelPerformance[] = [
  {
    platform: "Meta (Facebook/IG)",
    spend: 420,
    impressions: 28400,
    clicks: 1120,
    ctr: 3.94,
    cpc: 0.38,
    cpa: 14.50,
    roas: 3.4,
    status: "Performing Well",
  },
  {
    platform: "Pinterest",
    spend: 180,
    impressions: 19500,
    clicks: 680,
    ctr: 3.48,
    cpc: 0.26,
    cpa: 12.10,
    roas: 4.1,
    status: "Performing Well",
  },
  {
    platform: "TikTok Ads",
    spend: 310,
    impressions: 42000,
    clicks: 840,
    ctr: 2.00,
    cpc: 0.37,
    cpa: 28.00,
    roas: 1.6,
    status: "Underperforming",
  },
  {
    platform: "Google Search",
    spend: 290,
    impressions: 8900,
    clicks: 530,
    ctr: 5.95,
    cpc: 0.55,
    cpa: 18.20,
    roas: 2.9,
    status: "Performing Well",
  },
];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  channelData = defaultChannelData,
  gapAlerts = [],
}) => {
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);

  const totalSpend = channelData.reduce((acc, c) => acc + c.spend, 0);
  const totalImpressions = channelData.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = channelData.reduce((acc, c) => acc + c.clicks, 0);
  const avgCtr = (totalClicks / totalImpressions) * 100;
  const avgRoas = channelData.reduce((acc, c) => acc + c.roas, 0) / channelData.length;

  const handleExportReport = () => {
    setReportGenerated(true);
    setTimeout(() => setReportGenerated(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-slate-100">Unified Cross-Platform Analytics</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated spend, clicks, CTR, and ROAS with automated Gap Analysis fatigue alerts.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-blue-600/20"
        >
          <Download className="w-4 h-4" /> Export Shareable PDF Report
        </button>
      </div>

      {reportGenerated && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span><strong>Report Generated:</strong> Campaign_Analytics_Summary_July2026.pdf has been compiled.</span>
          </div>
          <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded font-mono font-bold">READY</span>
        </div>
      )}

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-blue-400" /> Total Spend
          </div>
          <div className="text-xl font-extrabold text-slate-100">${totalSpend.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> Across 4 channels
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-indigo-400" /> Impressions
          </div>
          <div className="text-xl font-extrabold text-slate-100">{totalImpressions.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">Total Reach</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <MousePointer className="w-3.5 h-3.5 text-emerald-400" /> Avg CTR
          </div>
          <div className="text-xl font-extrabold text-slate-100">{avgCtr.toFixed(2)}%</div>
          <div className="text-[10px] text-emerald-400 font-semibold">High Engagement</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Avg ROAS
          </div>
          <div className="text-xl font-extrabold text-amber-400">{avgRoas.toFixed(1)}x</div>
          <div className="text-[10px] text-slate-400">Return on Ad Spend</div>
        </div>
      </div>

      {/* Gap Analysis Alert Box */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertOctagon className="w-5 h-5" /> Automated Gap Analysis & Fatigue Alerts
        </div>

        <div className="space-y-2">
          <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>TikTok Campaign Warning:</strong> ROAS is 1.6x (below your 2.5x target threshold). CPA rose 35% in 48 hrs. Consider refreshing video creatives with 9:16 vertical hook variations.
            </div>
          </div>

          <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl text-xs text-blue-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong>Pinterest Opportunity:</strong> ROAS is 4.1x with $0.26 CPC. Shift $50/day budget from TikTok to Pinterest Idea Pins for higher overall ROI.
            </div>
          </div>
        </div>
      </div>

      {/* Performance by Channel Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 font-bold text-sm text-slate-100">
          Multi-Platform Channel Breakdown
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Platform</th>
                <th className="p-3.5">Spend</th>
                <th className="p-3.5">Clicks</th>
                <th className="p-3.5">CTR</th>
                <th className="p-3.5">CPC</th>
                <th className="p-3.5">CPA</th>
                <th className="p-3.5">ROAS</th>
                <th className="p-3.5">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {channelData.map((channel, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition">
                  <td className="p-3.5 font-bold text-slate-100">{channel.platform}</td>
                  <td className="p-3.5 font-mono">${channel.spend}</td>
                  <td className="p-3.5 font-mono">{channel.clicks}</td>
                  <td className="p-3.5 font-mono text-emerald-400 font-bold">{channel.ctr}%</td>
                  <td className="p-3.5 font-mono">${channel.cpc}</td>
                  <td className="p-3.5 font-mono">${channel.cpa}</td>
                  <td className="p-3.5 font-mono font-bold text-amber-400">{channel.roas}x</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        channel.status === "Performing Well"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                          : "bg-rose-950 text-rose-300 border border-rose-800/40"
                      }`}
                    >
                      {channel.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
