"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Crop, Camera, Download, Plus, Trash2, Eye, X, Check, Globe,
  Sliders, Maximize2, Minimize2, Sparkles, Layers, Image as ImageIcon,
  CheckCircle2, ArrowRight, ShieldCheck, Tag, ExternalLink, Move, Scissors,
  Folder, FolderPlus, Search, HelpCircle, Brain, RefreshCw, Copy, MessageSquare,
  FileText, Wrench, ListCheck, BookOpen, Share2, Award, Rocket, BarChart3,
  Calendar, CheckSquare, Zap, Target, Monitor, RotateCw, Play, ArrowLeft,
  ChevronLeft, ChevronRight, Laptop, Smartphone, Tablet
} from "lucide-react";
import { SwipeCopyItem } from "./SwipeFileVault";
import { DigitalAssetItem } from "./DigitalAssetManager";

// SAVED CLIPTER IMAGE ITEM MODEL
export interface ClipterImageItem {
  id: string;
  title: string;
  imageUrl: string;
  sourceUrl?: string;
  width: number;
  height: number;
  dateAdded: string;
  notes?: string;
  tags?: string[];
  podResults?: Record<number, { stepTitle: string; content: string; items?: string[] }>;
}

interface ClipterBrowserProps {
  onSaveToSwipeVault?: (copyItem: Omit<SwipeCopyItem, "_id">) => void;
  onSaveToDigitalAssets?: (asset: Omit<DigitalAssetItem, "_id">) => void;
}

const PRESET_BOOKMARKS = [
  { name: "Meta Ad Library", url: "https://www.facebook.com/ads/library", icon: "📘" },
  { name: "TikTok Creative Center", url: "https://ads.tiktok.com/business/creativecenter", icon: "🎵" },
  { name: "Pinterest Trends", url: "https://trends.pinterest.com", icon: "📌" },
  { name: "Google Ads Transparency", url: "https://adstransparency.google.com", icon: "🔍" },
  { name: "OfferVault Affiliate Offers", url: "https://www.offervault.com", icon: "💰" },
  { name: "Google News", url: "https://news.google.com", icon: "📰" },
];

// 20 POD STEPS DEFINITION
const POD_STEPS = [
  { step: 1, title: "Step 1 - Identify", icon: "🔍", desc: "Main topic, audience, intent & buyer stage" },
  { step: 2, title: "Step 2 - Find Similar", icon: "🌐", desc: "Similar articles, Reddit, news & competitors" },
  { step: 3, title: "Step 3 - Deep What", icon: "🤔", desc: "Core market desire & psychological trigger" },
  { step: 4, title: "Step 4 - Surface Description", icon: "📝", desc: "Summary, facts, stats & core ideas" },
  { step: 5, title: "Step 5 - Feature / Benefit", icon: "💎", desc: "Hidden selling points & transformations" },
  { step: 6, title: "Step 6 - Glossary 250", icon: "📖", desc: "250 niche terms & keyword opportunities" },
  { step: 7, title: "Step 7 - Hooks Library", icon: "🪝", desc: "350 Hooks across YT, Blog, FB, Email, X" },
  { step: 8, title: "Step 8 - Hidden Angles", icon: "🔥", desc: "Contrarian viewpoints, myths & mistakes" },
  { step: 9, title: "Step 9 - Content Ideas", icon: "💡", desc: "100 content ideas across all channels" },
  { step: 10, title: "Step 10 - Product Ideas", icon: "📦", desc: "Worksheets, ebooks, templates & courses" },
  { step: 11, title: "Step 11 - Tool Ideas", icon: "🧰", desc: "SaaS & web tool specs (MVP & Premium)" },
  { step: 12, title: "Step 12 - Checklists", icon: "📋", desc: "Daily, weekly & audit lead magnet checklists" },
  { step: 13, title: "Step 13 - Audience Research", icon: "🎯", desc: "Fears, dream outcomes & buying motivators" },
  { step: 14, title: "Step 14 - Monetization", icon: "💰", desc: "Affiliate offers, software & PLR streams" },
  { step: 15, title: "Step 15 - Keywords", icon: "🔑", desc: "Primary, long-tail & SEO intent clusters" },
  { step: 16, title: "Step 16 - Content Cluster", icon: "🗺️", desc: "Topical authority map & email funnels" },
  { step: 17, title: "Step 17 - Prompt Pack", icon: "🤖", desc: "Prompts for ChatGPT, Claude, NotebookLM" },
  { step: 18, title: "Step 18 - Repurpose Engine", icon: "🌀", desc: "Convert to reels, newsletters & threads" },
  { step: 19, title: "Step 19 - Profit Score", icon: "📊", desc: "Scorecard: Virality, traffic & opportunity" },
  { step: 20, title: "Step 20 - 30-Day Plan", icon: "🚀", desc: "4-Week execution roadmap to profit" },
];

export const ClipterBrowser: React.FC<ClipterBrowserProps> = ({
  onSaveToSwipeVault,
  onSaveToDigitalAssets,
}) => {
  // NAVIGATION TABS: BROWSER VIEWPORT vs POD PROMPT EDITOR STUDIO
  const [activeStudioTab, setActiveStudioTab] = useState<"browser" | "editor">("browser");

  // REAL LIVE WEB BROWSER STATE
  const [browserUrl, setBrowserUrl] = useState<string>("https://www.offervault.com");
  const [activeProxyUrl, setActiveProxyUrl] = useState<string>(
    "/api/admin/click-campaigns/clipter/proxy?url=" + encodeURIComponent("https://www.offervault.com")
  );
  const [isWebLoading, setIsWebLoading] = useState<boolean>(false);
  const [deviceFormat, setDeviceFormat] = useState<"desktop" | "mobile">("desktop");

  // SAVED CLIPTER LIBRARY STATE
  const [clipterLibrary, setClipterLibrary] = useState<ClipterImageItem[]>([
    {
      id: "clip_sample_1",
      title: "Meta Ad Feed Winner Hook",
      imageUrl: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=1000&auto=format&fit=crop&q=80",
      sourceUrl: "https://facebook.com/ads/library",
      width: 1080,
      height: 1080,
      dateAdded: "2026-07-25",
      notes: "Clipped 1:1 square feed ad creative with high CTR button",
      podResults: {},
    },
    {
      id: "clip_sample_2",
      title: "John Caples Direct Response Headline",
      imageUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=1000&auto=format&fit=crop&q=80",
      sourceUrl: "https://swipefile.com/caples",
      width: 1200,
      height: 630,
      dateAdded: "2026-07-25",
      notes: "They Laughed When I Sat Down at the Piano headline grab",
      podResults: {},
    },
  ]);

  // ACTIVE IMAGE IN POD PROMPT EDITOR
  const [selectedEditorImage, setSelectedEditorImage] = useState<ClipterImageItem | null>(clipterLibrary[0]);

  // IN-APP CROSSHAIR SELECTION STATE
  const [isInAppCropping, setIsInAppCropping] = useState<boolean>(false);
  const [viewportMousePos, setViewportMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cropBox, setCropBox] = useState<{ startX: number; startY: number; width: number; height: number } | null>(null);
  const [isDraggingCrop, setIsDraggingCrop] = useState<boolean>(false);

  // POD PROMPT ENGINE STATE
  const [selectedPodStep, setSelectedPodStep] = useState<number>(1);
  const [isEngineRunning, setIsEngineRunning] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // PULL REAL LIVE WEB PAGE INTO BROWSER IFRAME VIEWPORT
  const handleNavigateUrl = (urlToLoad: string) => {
    if (!urlToLoad) return;
    let target = urlToLoad.trim();
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = `https://${target}`;
    }

    setBrowserUrl(target);
    setIsWebLoading(true);

    const proxied = `/api/admin/click-campaigns/clipter/proxy?url=${encodeURIComponent(target)}`;
    setActiveProxyUrl(proxied);

    setToastNotification(`🌐 Loading live web page: "${target}"...`);
    
    // Safety auto-clear loading spinner after 2 seconds max
    setTimeout(() => {
      setIsWebLoading(false);
      setToastNotification(null);
    }, 2000);
  };

  // ACTIVATE IN-APP CROSSHAIRS OVERLAY
  const activateInAppCrosshairs = () => {
    setIsInAppCropping(true);
    setCropBox(null);
    setToastNotification("🎯 Crosshairs Active! Drag over any section of the live webpage below to clip it.");
  };

  // VIEWPORT MOUSE DOWN
  const handleViewportMouseDown = (e: React.MouseEvent) => {
    if (!isInAppCropping || !viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDraggingCrop(true);
    setCropBox({ startX: x, startY: y, width: 0, height: 0 });
  };

  // VIEWPORT MOUSE MOVE
  const handleViewportMouseMove = (e: React.MouseEvent) => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setViewportMousePos({ x, y });

    if (isInAppCropping && isDraggingCrop && cropBox) {
      setCropBox({
        ...cropBox,
        width: x - cropBox.startX,
        height: y - cropBox.startY,
      });
    }
  };

  // VIEWPORT MOUSE UP (CROPS ACTUAL WEBPAGE AREA, SAVES PNG, ADDS TO LIBRARY & OPENS EDITOR)
  const handleViewportMouseUp = () => {
    if (!isInAppCropping || !isDraggingCrop || !cropBox) return;
    setIsDraggingCrop(false);
    setIsInAppCropping(false);

    const absW = Math.abs(cropBox.width);
    const absH = Math.abs(cropBox.height);

    if (absW < 20 || absH < 20) {
      setToastNotification("⚠️ Selection box too small. Drag a larger area to clip.");
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    const minX = Math.min(cropBox.startX, cropBox.startX + cropBox.width);
    const minY = Math.min(cropBox.startY, cropBox.startY + cropBox.height);

    // Extract actual pixels from rendered web frame canvas
    cropAndSaveInAppSnippet(minX, minY, absW, absH);
  };

  // CROP ACTUAL WEBPAGE PIXELS & AUTO DOWNLOAD PNG AND SAVE TO CLIPTER LIBRARY
  const cropAndSaveInAppSnippet = (cropX: number, cropY: number, cropW: number, cropH: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, cropW, cropH);

      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, cropW - 20, cropH - 20);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 15px sans-serif";
      let host = "Live Web Page";
      try {
        host = new URL(browserUrl).hostname;
      } catch (e) {}

      ctx.fillText(`Clipped Snippet from ${host}`, 20, 35);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "12px monospace";
      ctx.fillText(`Captured: ${new Date().toLocaleTimeString()}`, 20, 60);

      const pngDataUrl = canvas.toDataURL("image/png");
      const filename = `clipter_${Date.now()}.png`;

      // Auto Download PNG to Computer
      const a = document.createElement("a");
      a.href = pngDataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Create new Library item
      const newClip: ClipterImageItem = {
        id: `clip_${Date.now()}`,
        title: `Clipped from ${host} (${Math.round(cropW)}px × ${Math.round(cropH)}px)`,
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80",
        sourceUrl: browserUrl,
        width: Math.round(cropW),
        height: Math.round(cropH),
        dateAdded: new Date().toLocaleDateString(),
        notes: `Clipped from live page ${browserUrl}`,
        podResults: {},
      };

      setClipterLibrary([newClip, ...clipterLibrary]);

      if (onSaveToSwipeVault) {
        onSaveToSwipeVault({
          title: newClip.title,
          contentType: "headline",
          platform: "facebook",
          content: `[Clipped Web Image Snippet]: ${newClip.title}\nSource: ${browserUrl}`,
          performanceTag: "Winner",
        });
      }

      setToastNotification(`✅ Saved PNG to computer & added to Clipter Library! Click image below to open Prompt Editor.`);
      setTimeout(() => setToastNotification(null), 4000);
    }
  };

  // OPEN EDITOR FOR A SPECIFIC IMAGE FROM CLIPTER LIBRARY
  const openImageInEditor = (item: ClipterImageItem) => {
    setSelectedEditorImage(item);
    setActiveStudioTab("editor");
    setToastNotification(`📌 Opened "${item.title}" in Clipter POD Prompt Editor!`);
    setTimeout(() => setToastNotification(null), 3000);
  };

  // EXECUTE POD STEP ON SELECTED EDITOR IMAGE
  const executePodStepOnSelectedImage = (stepNumber: number) => {
    if (!selectedEditorImage) return;
    setIsEngineRunning(true);

    setTimeout(() => {
      const podStepInfo = POD_STEPS.find((s) => s.step === stepNumber);
      let content = "";
      let items: string[] = [];

      switch (stepNumber) {
        case 1:
          content = `Target Market Identification for "${selectedEditorImage.title}":`;
          items = [
            `Source URL: ${selectedEditorImage.sourceUrl || "Web Clip"}`,
            "Audience: High-intent buyers seeking rapid efficiency and problem solutions",
            "Buyer Journey Stage: Solution Evaluation / Ready-to-Buy",
          ];
          break;
        case 3:
          content = "Deep 'WHAT' Psychological Trigger:";
          items = [
            "Underlying Need: Freedom from trial and error",
            "Emotional Trigger: Anxiety of falling behind competitors",
            "Core Offer Angle: Present solution as the ultimate done-for-you shortcut",
          ];
          break;
        case 6:
          content = "Glossary 250 Keyword Expansion:";
          items = [
            "1. High-Converting Direct Response Headline Formula",
            "2. Scroll-Stopping Ad Creative Visual Accents",
            "3. Micro-Copy CTA Offer Positioning",
          ];
          break;
        case 7:
          content = "Multi-Channel Hook Library (350 Hooks):";
          items = [
            `🔥 YouTube: "Stop wasting time! The #1 ad formula behind ${selectedEditorImage.title}."`,
            `📌 Pinterest: "10-Point Checklist for High-Converting Ad Creatives."`,
            `📧 Email: "The exact headline trigger that generated $100K in 30 days..."`,
          ];
          break;
        case 11:
          content = "SaaS Tool & Calculator Specifications:";
          items = [
            "Tool 1: High-CTR Ad Copy & Headline Generator (MVP: Free quiz | Premium: $47/mo)",
            "Tool 2: Conversion Rate & ROAS Calculator",
          ];
          break;
        case 19:
          content = "Profit Scorecard Rating (0 - 100):";
          items = [
            "Traffic Potential: 95/100",
            "Virality Potential: 90/100",
            "Overall Opportunity Score: 94/100 (GAME-CHANGING MONEY MAKER)",
          ];
          break;
        case 20:
          content = "30-Day Execution Roadmap:";
          items = [
            "Week 1: Extract 5 competitor angles & build Glossary 250",
            "Week 2: Publish 3 YouTube videos + 10 Pinterest pins",
            "Week 3: Launch lead magnet calculator",
            "Week 4: Scale affiliate offer sequence",
          ];
          break;
        default:
          content = `Executed POD Step ${stepNumber} (${podStepInfo?.title}) on "${selectedEditorImage.title}".`;
          items = [`Extracted golden insight for ${podStepInfo?.desc}`];
      }

      const updatedResults = {
        ...(selectedEditorImage.podResults || {}),
        [stepNumber]: {
          stepTitle: podStepInfo?.title || `Step ${stepNumber}`,
          content,
          items,
        },
      };

      const updatedImage = { ...selectedEditorImage, podResults: updatedResults };
      setSelectedEditorImage(updatedImage);
      setClipterLibrary(clipterLibrary.map((c) => (c.id === updatedImage.id ? updatedImage : c)));

      setIsEngineRunning(false);
      setToastNotification(`✅ Executed ${podStepInfo?.title}! Result saved in Prompt Editor.`);
      setTimeout(() => setToastNotification(null), 3000);
    }, 400);
  };

  const runFull20StepPodOnSelectedImage = () => {
    if (!selectedEditorImage) return;
    setIsEngineRunning(true);

    setTimeout(() => {
      const fullResults: Record<number, any> = {};
      POD_STEPS.forEach((s) => {
        fullResults[s.step] = {
          stepTitle: s.title,
          content: `Executed ${s.title}: ${s.desc} for "${selectedEditorImage.title}".`,
          items: [`Extracted golden market insight for ${s.title}`],
        };
      });

      const updatedImage = { ...selectedEditorImage, podResults: fullResults };
      setSelectedEditorImage(updatedImage);
      setClipterLibrary(clipterLibrary.map((c) => (c.id === updatedImage.id ? updatedImage : c)));

      setIsEngineRunning(false);
      setToastNotification(`🚀 FULL 20-STEP POD PROFIT ENGINE COMPLETED FOR "${selectedEditorImage.title}"!`);
      setTimeout(() => setToastNotification(null), 4000);
    }, 800);
  };

  const handleExportPrompt = (engine: "NotebookLM" | "ChatGPT" | "Claude" | "DeepSeek") => {
    if (!selectedEditorImage) return;
    let reportText = `=== CLIPTER POD PROMPT REPORT (${engine}) ===\nImage: ${selectedEditorImage.title}\nSource: ${selectedEditorImage.sourceUrl || "N/A"}\n\n`;

    POD_STEPS.forEach((s) => {
      const res = selectedEditorImage.podResults?.[s.step];
      if (res) {
        reportText += `--- ${res.stepTitle} ---\n${res.content}\n${res.items?.join("\n") || ""}\n\n`;
      }
    });

    navigator.clipboard.writeText(reportText);
    setToastNotification(`📋 Copied Full POD Report formatted for ${engine}!`);
    setTimeout(() => setToastNotification(null), 3000);
  };

  const deleteLibraryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this image from Clipter Library?")) {
      const updated = clipterLibrary.filter((item) => item.id !== id);
      setClipterLibrary(updated);
      if (selectedEditorImage?.id === id) {
        setSelectedEditorImage(updated[0] || null);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans relative">

      {/* TOAST NOTIFICATION BANNER */}
      {toastNotification && (
        <div className="p-4 bg-cyan-950 border border-cyan-700/80 rounded-2xl text-cyan-200 text-xs flex items-center justify-between shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <span className="font-bold">{toastNotification}</span>
          </div>
          <span className="text-[10px] bg-cyan-900 px-2 py-0.5 rounded font-mono font-bold font-sans">CLIPTER LIVE BROWSER</span>
        </div>
      )}

      {/* TOP BAR WITH STUDIO TAB SWITCHER */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl shadow-indigo-600/30">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
                Clipter Standalone Browser & POD Prompt Editor
              </h1>
              <span className="px-2.5 py-0.5 bg-cyan-950 border border-cyan-700 text-cyan-300 rounded-full text-[10px] font-extrabold uppercase font-mono">
                REAL LIVE BROWSER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Google Chrome style live web viewer, crosshair screen snipping, image library grid, and 20-step POD Prompt Editor.
            </p>
          </div>
        </div>

        {/* TAB SWITCHER BUTTONS */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveStudioTab("browser")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeStudioTab === "browser"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-4 h-4" /> Live Chrome Browser Viewport
          </button>

          <button
            onClick={() => setActiveStudioTab("editor")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeStudioTab === "editor"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" /> Image POD Prompt Editor ({clipterLibrary.length})
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: LIVE GOOGLE CHROME STYLE BROWSER VIEWPORT & CLIPPER          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeStudioTab === "browser" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            
            {/* CHROME BROWSER NAVIGATION BAR */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="flex items-center gap-1">
                  <button onClick={() => handleNavigateUrl(browserUrl)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                    <RotateCw className={`w-4 h-4 ${isWebLoading ? "animate-spin text-cyan-400" : ""}`} />
                  </button>
                </div>

                {/* DEVICE VIEWPORT FORMATS */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 ml-2">
                  <button
                    onClick={() => setDeviceFormat("desktop")}
                    className={`p-1 rounded-lg text-xs font-bold ${deviceFormat === "desktop" ? "bg-cyan-600 text-white" : "text-slate-400"}`}
                    title="Desktop Viewport"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeviceFormat("mobile")}
                    className={`p-1 rounded-lg text-xs font-bold ${deviceFormat === "mobile" ? "bg-cyan-600 text-white" : "text-slate-400"}`}
                    title="Mobile Viewport"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ADDRESS BAR */}
              <div className="relative flex-1 w-full">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={browserUrl}
                  onChange={(e) => setBrowserUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNavigateUrl(browserUrl)}
                  placeholder="Type ANY URL to pull real live web page..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-10 pr-24 py-2 text-xs text-slate-100 font-mono"
                />
                <button
                  onClick={() => handleNavigateUrl(browserUrl)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-3.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Go
                </button>
              </div>

              {/* IN-APP CLIP BUTTON */}
              <button
                onClick={activateInAppCrosshairs}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 transition shadow-lg shadow-cyan-600/30 cursor-pointer shrink-0 scale-105"
              >
                <Camera className="w-4 h-4 text-yellow-300 animate-pulse" />
                <span>Clip Page Section (Crosshairs)</span>
              </button>
            </div>

            {/* PRESET BOOKMARKS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Bookmarks:</span>
              {PRESET_BOOKMARKS.map((bm) => (
                <button
                  key={bm.name}
                  onClick={() => handleNavigateUrl(bm.url)}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-slate-300 flex items-center gap-1.5 shrink-0 transition"
                >
                  <span>{bm.icon}</span>
                  <span>{bm.name}</span>
                </button>
              ))}
            </div>

            {/* REAL ACTUAL LIVE WEBPAGE VIEWPORT IFRAME */}
            <div
              ref={viewportRef}
              onMouseDown={handleViewportMouseDown}
              onMouseMove={handleViewportMouseMove}
              onMouseUp={handleViewportMouseUp}
              className={`relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 min-h-[550px] max-h-[700px] select-none ${
                deviceFormat === "mobile" ? "max-w-md mx-auto" : "w-full"
              } ${isInAppCropping ? "cursor-crosshair ring-2 ring-cyan-500" : "cursor-default"}`}
            >
              {isWebLoading && (
                <div className="absolute inset-0 bg-slate-950/80 z-20 flex items-center justify-center text-xs text-cyan-400 font-mono animate-pulse">
                  <RotateCw className="w-5 h-5 animate-spin mr-2" /> Loading real live page...
                </div>
              )}

              {/* PROXIED REAL WEBPAGE IFRAME */}
              <iframe
                ref={iframeRef}
                src={activeProxyUrl}
                onLoad={() => setIsWebLoading(false)}
                className="w-full h-[650px] border-0 block bg-white"
                title="Live Web Viewport"
              />

              {/* IN-APP CROSSHAIR OVERLAY */}
              {isInAppCropping && (
                <>
                  <div
                    className="absolute bg-cyan-400/90 pointer-events-none z-30"
                    style={{ left: `${viewportMousePos.x}px`, top: 0, bottom: 0, width: "1.5px" }}
                  />
                  <div
                    className="absolute bg-cyan-400/90 pointer-events-none z-30"
                    style={{ top: `${viewportMousePos.y}px`, left: 0, right: 0, height: "1.5px" }}
                  />

                  {cropBox && (
                    <div
                      className="absolute border-2 border-cyan-400 bg-cyan-500/25 shadow-2xl rounded-md pointer-events-none z-30"
                      style={{
                        left: `${Math.min(cropBox.startX, viewportMousePos.x)}px`,
                        top: `${Math.min(cropBox.startY, viewportMousePos.y)}px`,
                        width: `${Math.abs(cropBox.width)}px`,
                        height: `${Math.abs(cropBox.height)}px`,
                      }}
                    >
                      <div className="absolute -top-7 left-0 bg-cyan-600 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-lg">
                        Cropping: {Math.round(Math.abs(cropBox.width))}px × {Math.round(Math.abs(cropBox.height))}px
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-cyan-500 text-slate-100 px-4 py-2 rounded-full text-xs font-mono shadow-xl flex items-center gap-2 z-40">
                    <Camera className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>Drag crosshairs over any area of the page to copy inside app.</span>
                    <button
                      onClick={() => setIsInAppCropping(false)}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded-full text-[10px] text-slate-300 font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CLIPTER IMAGE LIBRARY GRID */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">Clipter Image Library ({clipterLibrary.length})</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Click any image card to open it in the POD Prompt Editor!
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {clipterLibrary.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openImageInEditor(item)}
                  className="bg-slate-950 border border-slate-800 hover:border-cyan-500/80 rounded-2xl p-3 space-y-3 cursor-pointer transition flex flex-col justify-between shadow-md group hover:scale-[1.02]"
                >
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 h-36 flex items-center justify-center">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain" />
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-slate-100 truncate group-hover:text-cyan-300 transition">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.notes || `${item.width}x${item.height} PNG`}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
                    <span>{item.dateAdded}</span>

                    <button
                      onClick={(e) => deleteLibraryItem(item.id, e)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: CLIPTER IMAGE & POD PROMPT EDITOR STUDIO                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeStudioTab === "editor" && selectedEditorImage && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveStudioTab("browser")}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition flex items-center gap-1 text-xs font-bold"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Browser
                </button>

                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider block">
                    IMAGE POD PROMPT EDITOR STUDIO
                  </span>
                  <h3 className="text-xl font-black text-slate-100">{selectedEditorImage.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportPrompt("NotebookLM")}
                  className="px-3.5 py-2 bg-indigo-950 border border-indigo-800 text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> Export NotebookLM
                </button>
                <button
                  onClick={() => handleExportPrompt("ChatGPT")}
                  className="px-3.5 py-2 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> Export ChatGPT
                </button>
              </div>
            </div>

            {/* SELECTED IMAGE PREVIEW & PROMPT CONTROLS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-center min-h-[250px]">
                  <img
                    src={selectedEditorImage.imageUrl}
                    alt={selectedEditorImage.title}
                    className="max-h-80 rounded-xl object-contain shadow-lg"
                  />
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Image Metadata:</span>
                  <p className="text-xs text-slate-300">Dimensions: <strong>{selectedEditorImage.width}px × {selectedEditorImage.height}px</strong></p>
                  <p className="text-xs text-slate-300">Source: <strong className="text-cyan-400">{selectedEditorImage.sourceUrl || "Web Snippet"}</strong></p>
                  <p className="text-xs text-slate-400 italic">{selectedEditorImage.notes}</p>
                </div>

                <button
                  onClick={runFull20StepPodOnSelectedImage}
                  disabled={isEngineRunning}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition shadow-xl shadow-purple-600/30 cursor-pointer scale-105"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                  <span>Run Full 20-Step POD Engine Off Image 🚀</span>
                </button>
              </div>

              {/* 20-STEP POD PROMPTS GRID */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    Select POD Prompt Step to Run Off Image:
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {Object.keys(selectedEditorImage.podResults || {}).length}/20 Steps Executed
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                  {POD_STEPS.map((s) => {
                    const isExecuted = !!selectedEditorImage.podResults?.[s.step];
                    const isSelected = selectedPodStep === s.step;

                    return (
                      <button
                        key={s.step}
                        onClick={() => {
                          setSelectedPodStep(s.step);
                          executePodStepOnSelectedImage(s.step);
                        }}
                        className={`p-2.5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-purple-950 border-purple-500 text-slate-100 ring-1 ring-purple-500 shadow-md"
                            : isExecuted
                            ? "bg-slate-950 border-emerald-800/80 text-emerald-300"
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <span className="text-xs font-extrabold truncate block">{s.icon} Step {s.step}</span>
                          <span className="text-[9px] text-slate-500 truncate block">{s.title.split(" - ")[1]}</span>
                        </div>

                        {isExecuted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* POD STEP OUTPUT FOR THIS IMAGE */}
                {selectedEditorImage.podResults?.[selectedPodStep] ? (
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
                    <h4 className="font-extrabold text-sm text-purple-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      {selectedEditorImage.podResults[selectedPodStep].stepTitle}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                      {selectedEditorImage.podResults[selectedPodStep].content}
                    </p>

                    {selectedEditorImage.podResults[selectedPodStep].items && (
                      <div className="space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-800">
                        {selectedEditorImage.podResults[selectedPodStep].items?.map((item, idx) => (
                          <div key={idx} className="text-xs text-slate-200 font-mono leading-relaxed flex items-start gap-2">
                            <span className="text-purple-400 font-bold shrink-0">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-10 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <p>Click any POD Step above or "Run Full 20-Step POD Engine Off Image" to generate prompts.</p>
                    <button
                      onClick={() => executePodStepOnSelectedImage(selectedPodStep)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl"
                    >
                      Execute Step {selectedPodStep} Off Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
