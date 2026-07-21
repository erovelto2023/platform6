"use client";

import React, { useState } from "react";
import { Info, HelpCircle, Layers, Monitor, Smartphone, CheckCircle, ExternalLink } from "lucide-react";

export interface PlatformSpec {
  platform: string;
  category: "Social" | "Search" | "Content/Email";
  recommendedSpecs: string;
  aspectRatio: string;
  copyElements: string[];
  maxVideoLength?: string;
  whyTooltip: string;
}

const platformSpecsData: PlatformSpec[] = [
  {
    platform: "Meta (Facebook Feed & IG)",
    category: "Social",
    recommendedSpecs: "1080x1080px (1:1) or 1080x1350px (4:5)",
    aspectRatio: "1:1 or 4:5",
    copyElements: ["Primary Text (125 chars visible)", "Headline (27 chars)", "Description (27 chars)"],
    whyTooltip: "4:5 vertical occupies 20% more mobile screen real estate than square, driving higher thumb-stop rates.",
  },
  {
    platform: "Instagram Reels & Stories",
    category: "Social",
    recommendedSpecs: "1080x1920px (9:16 Full Screen)",
    aspectRatio: "9:16",
    copyElements: ["On-Screen Text Hook", "Caption (150 chars)", "Hashtags (3-5)"],
    maxVideoLength: "< 90 seconds (15-30s optimal)",
    whyTooltip: "Native 9:16 vertical video delivers full immersive audio-on engagement with 3.2x higher completion rate.",
  },
  {
    platform: "Pinterest Pins",
    category: "Social",
    recommendedSpecs: "1000x1500px (2:3 Ratio)",
    aspectRatio: "2:3",
    copyElements: ["Title (100 chars)", "Description (500 chars)", "Alt Text", "Destination URL"],
    whyTooltip: "Pinterest algorithms favor fresh 2:3 vertical images. Using 2:3 assets yields up to 30% more organic distribution.",
  },
  {
    platform: "TikTok Ads & Spark",
    category: "Social",
    recommendedSpecs: "1080x1920px (9:16 Vertical)",
    aspectRatio: "9:16",
    copyElements: ["Hook Text", "Caption (100 chars)", "CTA Button"],
    maxVideoLength: "9-15 seconds ideal",
    whyTooltip: "TikTok users scroll rapidly; hooks in the first 2 seconds determine 80% of total video retention.",
  },
  {
    platform: "LinkedIn B2B Ads",
    category: "Social",
    recommendedSpecs: "1200x627px (Landscape) or PDF Carousel",
    aspectRatio: "1.91:1 or PDF",
    copyElements: ["Introductory Text (150 chars)", "Headline (70 chars)", "Lead Gen Form"],
    whyTooltip: "Document Carousel Ads (PDFs) generate 3x higher click-through rates among executive B2B decision makers.",
  },
  {
    platform: "Google Search Ads",
    category: "Search",
    recommendedSpecs: "Text Only (Responsive Search Ads)",
    aspectRatio: "N/A",
    copyElements: ["Up to 15 Headlines (30 chars max)", "Up to 4 Descriptions (90 chars max)", "Sitelinks"],
    whyTooltip: "Google dynamically pairs your headlines to maximize Quality Score and lower your cost-per-click.",
  },
  {
    platform: "Microsoft Advertising (Bing)",
    category: "Search",
    recommendedSpecs: "Text Ads + Image Extensions",
    aspectRatio: "1.91:1",
    copyElements: ["Headlines (30 chars)", "Descriptions (90 chars)", "Action Extensions"],
    whyTooltip: "Bing reaches an older, affluent desktop demographic with 30% lower average competition than Google.",
  },
  {
    platform: "Email Marketing (ConvertKit / Mailchimp)",
    category: "Content/Email",
    recommendedSpecs: "Responsive HTML / Plain Text (600px width)",
    aspectRatio: "Vertical Flow",
    copyElements: ["Subject Line (40-50 chars)", "Preheader Text (100 chars)", "CTA Button"],
    whyTooltip: "A strong preheader line increases email open rates by 22% by providing a snippet inside mobile inboxes.",
  },
];

export const PlatformSpecsMatrix: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedTooltip, setSelectedTooltip] = useState<string | null>(null);

  const filteredSpecs = platformSpecsData.filter((spec) => {
    if (activeTab === "All") return true;
    return spec.category === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-100">Dynamic Platform Specifications & Micro-Tooltips</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quick reference guide for dimensions, copy character limits, and strategic "why" recommendations.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 border border-slate-800 rounded-xl">
          {["All", "Social", "Search", "Content/Email"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSpecs.map((spec, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-indigo-500/40 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-slate-100 flex items-center gap-2">
                  {spec.category === "Social" && <Smartphone className="w-4 h-4 text-blue-400" />}
                  {spec.category === "Search" && <Monitor className="w-4 h-4 text-amber-400" />}
                  {spec.category === "Content/Email" && <Layers className="w-4 h-4 text-purple-400" />}
                  {spec.platform}
                </h4>

                <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-bold">
                  {spec.aspectRatio}
                </span>
              </div>

              {/* Specs & Dimensions */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Recommended Specs</div>
                <div className="font-mono text-indigo-300 font-semibold">{spec.recommendedSpecs}</div>
                {spec.maxVideoLength && (
                  <div className="text-[11px] text-emerald-400">Duration: {spec.maxVideoLength}</div>
                )}
              </div>

              {/* Copy Elements Required */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Required Copy Elements</div>
                <div className="flex flex-wrap gap-1.5">
                  {spec.copyElements.map((el, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg"
                    >
                      {el}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strategic Tooltip / "Why" Insight */}
            <div className="pt-3 border-t border-slate-800/80">
              <button
                onClick={() =>
                  setSelectedTooltip(selectedTooltip === spec.platform ? null : spec.platform)
                }
                className="w-full p-2.5 bg-indigo-950/40 border border-indigo-800/40 hover:border-indigo-700/60 rounded-xl text-left text-xs text-indigo-200 flex items-start gap-2 transition"
              >
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold">Strategic "Why" Insight: </span>
                  <span>{spec.whyTooltip}</span>
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
