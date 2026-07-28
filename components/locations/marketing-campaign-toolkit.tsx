"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Megaphone, Target, DollarSign, ArrowRight, Zap, Lightbulb } from "lucide-react";

interface MarketingCampaignToolkitProps {
  cityName: string;
  stateName: string;
  medianIncome?: number;
  medianAge?: number;
  population?: number;
}

export function MarketingCampaignToolkit({
  cityName,
  stateName,
  medianIncome = 65000,
  medianAge = 38,
  population = 15000
}: MarketingCampaignToolkitProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const isHighIncome = medianIncome > 70000;
  const isMatureDemo = medianAge > 45;

  const campaignHooks = [
    {
      channel: "Meta Ads (Facebook & Instagram)",
      headline: `Attention ${cityName} Residents!`,
      body: `Looking for top-rated local services in ${cityName}, ${stateName}? Get exclusive local offers tailored for your home & business today.`,
      targeting: `Location: ${cityName}, ${stateName} + 15mi | Age: ${Math.max(18, medianAge - 15)}-${Math.min(65, medianAge + 20)} | Interests: Local Business, Home Improvement`,
      angle: "Local Community Trust & Convenience"
    },
    {
      channel: "Google Search Ads",
      headline: `Best Services in ${cityName} ${stateName} | Fast & Local`,
      body: `Top-rated experts serving ${cityName} and surrounding areas. Free consultations & instant booking. Call now!`,
      targeting: `Keywords: [best services ${cityName}], [${cityName} ${stateName} experts], [top local company near me]`,
      angle: "High Intent Direct Search"
    },
    {
      channel: "TikTok / Reels Short Video",
      headline: `3 Things You Didn't Know About Living in ${cityName}, ${stateName}`,
      body: `If you live in ${cityName}, here is the #1 insider secret every homeowner & local shopper needs to know right now...`,
      targeting: `Geofence: ${cityName} Zip Codes | Format: 15s Hook + Local Solution`,
      angle: "Engaging Local Discovery"
    },
    {
      channel: "Email & Direct Mail Outreach",
      headline: `Special Offer for ${cityName} Business Owners & Residents`,
      body: `As a valued member of the ${cityName} community, we are offering an exclusive local discount on our premium products and services this month.`,
      targeting: `Direct Mail & Local Business Email List (${cityName}, ${stateName})`,
      angle: "VIP Local Exclusive"
    }
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} /> One-Click Local Marketing Generator
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2.5">
            <Megaphone className="text-cyan-400" size={24} /> Local Campaign Toolkit for {cityName}
          </h2>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl">
          Market Ceiling: <span className="text-cyan-400 font-bold">{isHighIncome ? "High-Ticket Premium" : "Mass Market Value"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-wider mb-1">Target Audience Profile</div>
          <div className="text-base font-bold text-slate-100">{cityName} Residents ({medianAge} YRS Avg)</div>
          <p className="text-xs text-slate-400 mt-1">Optimized for local trust, mobile ads & geo-targeted campaigns.</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider mb-1">Purchasing Power</div>
          <div className="text-base font-bold text-slate-100">${medianIncome.toLocaleString()} / Yr Household</div>
          <p className="text-xs text-slate-400 mt-1">{isHighIncome ? "High willingness to pay for premium quality." : "High responsiveness to discounts & value bundles."}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-mono font-bold uppercase text-indigo-400 tracking-wider mb-1">Recommended Primary Channel</div>
          <div className="text-base font-bold text-slate-100">{isMatureDemo ? "Facebook Ads & Direct Mail" : "Google Search & Instagram Reels"}</div>
          <p className="text-xs text-slate-400 mt-1">Based on local demographic age & digital accessibility.</p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h3 className="text-lg font-black uppercase text-slate-100 tracking-wider flex items-center gap-2">
          <Zap className="text-cyan-400" size={18} /> Ready-to-Use Local Ad Copy & Targeting Hooks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaignHooks.map((hook, idx) => {
            const copyContent = `Channel: ${hook.channel}\nHeadline: ${hook.headline}\nBody: ${hook.body}\nTargeting: ${hook.targeting}`;
            return (
              <div key={idx} className="bg-slate-950 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl flex flex-col justify-between transition-all shadow-xl group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-mono font-bold uppercase">
                      {hook.channel}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{hook.angle}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors mb-2">
                    "{hook.headline}"
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {hook.body}
                  </p>
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-400">
                    <strong className="text-slate-300">Targeting Strategy:</strong> {hook.targeting}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(copyContent, idx)}
                  className="mt-4 w-full py-2 bg-slate-900 border border-slate-800 hover:bg-cyan-600 hover:text-white hover:border-cyan-500 text-slate-300 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check size={14} className="text-emerald-400" /> Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Campaign Strategy & Ad Copy
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
