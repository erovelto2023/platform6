"use client";

import React, { useState } from "react";
import { Calculator, DollarSign, TrendingUp, ArrowRight, ShieldCheck, RefreshCw, Zap } from "lucide-react";

export const RoasCalculatorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [dailyBudget, setDailyBudget] = useState<number>(50);
  const [campaignDays, setCampaignDays] = useState<number>(30);
  const [avgCpc, setAvgCpc] = useState<number>(0.35);
  const [landingPageConvRate, setLandingPageConvRate] = useState<number>(3.5); // 3.5%
  const [aov, setAov] = useState<number>(97); // Average Order Value

  if (!isOpen) return null;

  const totalSpend = dailyBudget * campaignDays;
  const estimatedClicks = Math.floor(totalSpend / avgCpc);
  const estimatedConversions = Math.floor(estimatedClicks * (landingPageConvRate / 100));
  const estimatedRevenue = estimatedConversions * aov;
  const estimatedNetProfit = estimatedRevenue - totalSpend;
  const calculatedRoas = totalSpend > 0 ? (estimatedRevenue / totalSpend) : 0;
  const breakEvenCpa = aov;
  const estimatedCpa = estimatedConversions > 0 ? totalSpend / estimatedConversions : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl">
              <Calculator className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Campaign Budget & ROAS Profit Simulator</h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Calculate break-even CPA, projected sales, and net profit before spending a single dollar.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-lg font-bold">✕</button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex justify-between">
                <span>Daily Ad Budget</span>
                <span className="text-emerald-400 font-bold">${dailyBudget}/day</span>
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex justify-between">
                <span>Campaign Duration</span>
                <span className="text-emerald-400 font-bold">{campaignDays} Days</span>
              </label>
              <input
                type="range"
                min="7"
                max="90"
                step="1"
                value={campaignDays}
                onChange={(e) => setCampaignDays(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Est. Cost Per Click (CPC in $)
              </label>
              <input
                type="number"
                step="0.05"
                value={avgCpc}
                onChange={(e) => setAvgCpc(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Landing Page Conversion Rate (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={landingPageConvRate}
                onChange={(e) => setLandingPageConvRate(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Average Order Value / Commission (AOV in $)
              </label>
              <input
                type="number"
                value={aov}
                onChange={(e) => setAov(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 border-b border-slate-800 pb-2">
              Simulated Forecast Summary
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Total Spend</div>
                <div className="text-lg font-bold text-slate-200">${totalSpend.toLocaleString()}</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Est. Orders</div>
                <div className="text-lg font-bold text-slate-200">{estimatedConversions}</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Est. Revenue</div>
                <div className="text-lg font-bold text-emerald-400">${estimatedRevenue.toLocaleString()}</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Projected ROAS</div>
                <div className="text-lg font-extrabold text-amber-400">{calculatedRoas.toFixed(2)}x</div>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
              <span>
                <strong>Net Profit Goal:</strong> ${estimatedNetProfit.toLocaleString()}
              </span>
              <span className="text-[11px] font-semibold text-emerald-300">
                Max CPA Threshold: ${estimatedCpa.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30"
          >
            Apply Projection to Campaign
          </button>
        </div>
      </div>
    </div>
  );
};
