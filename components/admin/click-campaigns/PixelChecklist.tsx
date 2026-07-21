"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, Circle, AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";

export interface PixelItem {
  id: string;
  platform: string;
  eventName: string;
  description: string;
  isVerified: boolean;
  docLink: string;
}

const defaultPixels: PixelItem[] = [
  {
    id: "p1",
    platform: "Meta (Facebook/IG)",
    eventName: "PageView & Lead (Conversions API)",
    description: "Tracks ad clicks and lead magnet submissions. CAPI bypasses iOS 14+ browser ad-blockers.",
    isVerified: true,
    docLink: "https://developers.facebook.com/docs/marketing-api/conversions-api",
  },
  {
    id: "p2",
    platform: "Pinterest",
    eventName: "Pinterest Tag (Base & Lead Event)",
    description: "Ensures promoted vertical pins get properly attributed in Pinterest Analytics.",
    isVerified: true,
    docLink: "https://help.pinterest.com/en/business/article/track-conversions-with-pinterest-tag",
  },
  {
    id: "p3",
    platform: "TikTok Ads",
    eventName: "TikTok Pixel (Complete Payment / Submit Form)",
    description: "Tracks video spark ad conversions and optimizes 9:16 vertical algorithm delivery.",
    isVerified: false,
    docLink: "https://ads.tiktok.com/help/article/tiktok-pixel",
  },
  {
    id: "p4",
    platform: "Google Analytics 4",
    eventName: "GA4 GA4_generate_lead & Purchase",
    description: "Tracks post-click user behavior on your site after ad arrival.",
    isVerified: true,
    docLink: "https://analytics.google.com",
  },
];

export const PixelChecklist: React.FC = () => {
  const [pixels, setPixels] = useState<PixelItem[]>(defaultPixels);

  const toggleVerify = (id: string) => {
    setPixels((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isVerified: !p.isVerified } : p))
    );
  };

  const verifiedCount = pixels.filter((p) => p.isVerified).length;
  const is100Percent = verifiedCount === pixels.length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-100">Pixel & Conversions Tracking Checklist</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Verify Meta CAPI, Pinterest Tag, TikTok Events API, and GA4 events before scaling ad spend.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 border border-slate-800 rounded-xl text-xs font-bold">
          <span className="text-slate-400">Tracking Status:</span>
          <span className={is100Percent ? "text-emerald-400" : "text-amber-400"}>
            {verifiedCount}/{pixels.length} Verified
          </span>
        </div>
      </div>

      {/* Checklist List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800/80">
        {pixels.map((item) => (
          <div key={item.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-800/20 transition">
            <div className="flex items-start gap-3.5">
              <button
                onClick={() => toggleVerify(item.id)}
                className="mt-0.5 text-slate-400 hover:text-emerald-400 transition"
              >
                {item.isVerified ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-100">{item.platform}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-semibold">
                    {item.eventName}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
            </div>

            <a
              href={item.docLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0"
            >
              Setup Guide <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
