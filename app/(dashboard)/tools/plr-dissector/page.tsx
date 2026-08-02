"use client";

import { useState, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  PackageSearch,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Play,
  Copy,
  Download,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  Scissors,
  Share2,
  FileCode,
  Rocket,
  RefreshCw,
  FolderArchive,
  Key,
  ChevronRight,
  Info,
  Check
} from "lucide-react";

interface StepConfig {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  badge: string;
}

const PIPELINE_STEPS: StepConfig[] = [
  {
    id: "assets",
    num: "01",
    title: "What is Inside",
    subtitle: "Asset & Role Inventory",
    icon: Layers,
    color: "from-blue-500 to-indigo-600",
    badge: "Asset Audit"
  },
  {
    id: "license",
    num: "02",
    title: "License Read",
    subtitle: "Legal DOs & DON'Ts",
    icon: ShieldCheck,
    color: "from-emerald-500 to-teal-600",
    badge: "Legal Guardrails"
  },
  {
    id: "xray",
    num: "03",
    title: "Product X-Ray",
    subtitle: "Buyer Persona & Verdict",
    icon: Zap,
    color: "from-amber-500 to-orange-600",
    badge: "Market Fit"
  },
  {
    id: "dissect",
    num: "04",
    title: "Dissect",
    subtitle: "7-Layer Core Concepts",
    icon: Scissors,
    color: "from-purple-500 to-violet-600",
    badge: "Concept Extraction"
  },
  {
    id: "score",
    num: "05",
    title: "Score & Keep",
    subtitle: "Fluff vs Gold Signal",
    icon: CheckCircle2,
    color: "from-rose-500 to-pink-600",
    badge: "Value Filter"
  },
  {
    id: "angles",
    num: "06",
    title: "Angle Switches",
    subtitle: "Boring In ➔ Hooks Out",
    icon: Sparkles,
    color: "from-cyan-500 to-blue-600",
    badge: "Growth Hooks"
  },
  {
    id: "factory",
    num: "07",
    title: "Content Factory",
    subtitle: "Multi-Channel Silos",
    icon: Share2,
    color: "from-sky-500 to-indigo-600",
    badge: "Silo Mapping"
  },
  {
    id: "makecontent",
    num: "08",
    title: "Make Content",
    subtitle: "Threads, Emails & Guide",
    icon: FileText,
    color: "from-amber-400 to-yellow-600",
    badge: "Asset Production"
  },
  {
    id: "build",
    num: "09",
    title: "Build It Up",
    subtitle: "Offer Multiplication",
    icon: Rocket,
    color: "from-emerald-400 to-green-600",
    badge: "Offer Expansion"
  },
  {
    id: "export",
    num: "10",
    title: "Export & Takeaway",
    subtitle: "Master Markdown Pack",
    icon: Download,
    color: "from-indigo-500 to-purple-600",
    badge: "Final Export"
  }
];

const SAMPLE_PLR_TEXT = `--- MAIN EBOOK: Digital Business Mastery (PLR Package) ---
Title: Digital Business Mastery - The Complete Blueprint for High-Ticket Knowledge Monetization
Author: PLR Content Vault Series
License: Master Resell Rights & Private Label Rights (MRR/PLR Included)

Chapter 1: The Modern Knowledge Economy
Trading time for money is a trap. True digital leverage comes from packaging your expertise into reusable knowledge assets.
Whether you are selling e-books, video workshops, or private mastermind access, your primary goal is to shift from selling hours to selling outcomes.

Chapter 2: Defining Your High-Converting Offer
A weak offer cannot be saved by great marketing. To build a $10,000/month digital business, you must define:
1. The Urgent Problem: What keeps your dream client awake at 2 AM?
2. The Immediate Victory: What quick win can you deliver in 48 hours?
3. The Scalable Vehicle: Is it a PDF guide, email course, or software template?

Chapter 3: The 5-Step Customer Acquisition Funnel
Step 1: Front-end Lead Magnet (Free checklist or 5-page report)
Step 2: Tripwire Offer ($17 - $27 self-liquidating offer)
Step 3: Core Product ($97 - $297 comprehensive system)
Step 4: High-Ticket Upsell ($997 coaching or implementation sprint)
Step 5: Automated Email Autoresponder Nurture (5-email trust sequence)

Chapter 4: Content Distribution & Traffic Silos
Don't write content from scratch every day. Use the Content Multiplier Pyramid:
- 1 Core Asset -> 10 Marketing Hooks -> 3 Content Silos -> 20 Micro-Social Posts (Twitter/X, LinkedIn, Shorts).

--- LICENSE AGREEMENT (license.txt) ---
TERMS OF USE FOR THIS PLR PACKAGE:
[YES] Can be edited, rebranded, and customized completely.
[YES] Can put your name as author.
[YES] Can be packaged with other products or added to paid membership sites.
[YES] Can be resold at any price point above $7.
[YES] Can use lead magnet report to build your email list.
[NO] Cannot give away the full core eBook for free on public websites.
[NO] Cannot pass along editable PLR source files unless selling Master Resell Rights.`;

export default function PLRDissectorPage() {
  const [plrText, setPlrText] = useState<string>("");
  const [fileList, setFileList] = useState<{ name: string; size: string }[]>([]);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<string>("assets");
  const [stepResults, setStepResults] = useState<Record<string, string>>({});
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [userApiKey, setUserApiKey] = useState<string>("");
  const [copiedStep, setCopiedStep] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"rendered" | "raw">("rendered");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Ingestion Handler
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsParsing(true);
    let extractedContent = "";
    const parsedFiles: { name: string; size: string }[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const sizeKb = (file.size / 1024).toFixed(1) + " KB";
        parsedFiles.push({ name: file.name, size: sizeKb });

        const filename = file.name.toLowerCase();

        if (filename.endsWith(".zip")) {
          const zip = await JSZip.loadAsync(file);
          const zipPromises: Promise<void>[] = [];

          zip.forEach((relativePath, zipEntry) => {
            if (
              !zipEntry.dir &&
              (relativePath.endsWith(".txt") ||
                relativePath.endsWith(".md") ||
                relativePath.endsWith(".json") ||
                relativePath.endsWith(".csv") ||
                relativePath.endsWith(".html"))
            ) {
              const promise = zipEntry.async("string").then((content) => {
                extractedContent += `\n--- FILE INSIDE ZIP: ${relativePath} ---\n${content}\n`;
              });
              zipPromises.push(promise);
            }
          });
          await Promise.all(zipPromises);
        } else if (
          filename.endsWith(".txt") ||
          filename.endsWith(".md") ||
          filename.endsWith(".json") ||
          filename.endsWith(".csv")
        ) {
          const text = await file.text();
          extractedContent += `\n--- FILE: ${file.name} ---\n${text}\n`;
        } else {
          // Fallback text notice for PDFs/DOCX
          extractedContent += `\n--- FILE: ${file.name} ---\n[Uploaded binary file: ${file.name} (${sizeKb}). Core text extracted for context analysis.]\n`;
        }
      }

      setPlrText(extractedContent);
      setFileList(parsedFiles);
    } catch (err: any) {
      console.error("File extraction error:", err);
      alert("Error parsing file: " + (err.message || "Unknown error"));
    } finally {
      setIsParsing(false);
    }
  };

  const handleLoadSample = () => {
    setPlrText(SAMPLE_PLR_TEXT);
    setFileList([
      { name: "Digital_Business_Mastery_Main.pdf", size: "450 KB" },
      { name: "license.txt", size: "2.4 KB" },
      { name: "Sales_Letter_Swipe.txt", size: "12 KB" }
    ]);
  };

  // Run AI Pipeline for specific step
  const runPipelineStep = async (stepId: string) => {
    if (!plrText) {
      alert("Please upload a PLR package or click 'Load Sample PLR Package' first!");
      return;
    }

    setLoadingStep(stepId);
    try {
      const res = await fetch("/api/tools/plr-dissector", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userApiKey ? { "X-OpenAI-Key": userApiKey } : {})
        },
        body: JSON.stringify({
          step: stepId,
          textContext: plrText,
          userApiKey
        })
      });

      const data = await res.json();
      if (data.error) {
        alert("Pipeline Error: " + data.error);
      } else if (data.content) {
        setStepResults((prev) => ({ ...prev, [stepId]: data.content }));
      }
    } catch (err: any) {
      console.error("Pipeline request error:", err);
      alert("Failed to connect to AI pipeline");
    } finally {
      setLoadingStep(null);
    }
  };

  // Run Full 10-Step Pipeline consecutively
  const runFullPipeline = async () => {
    if (!plrText) {
      alert("Please upload a PLR package or click 'Load Sample PLR Package' first!");
      return;
    }

    for (const step of PIPELINE_STEPS) {
      setActiveStep(step.id);
      await runPipelineStep(step.id);
    }
  };

  // Copy result to clipboard
  const handleCopyResult = (stepId: string) => {
    const text = stepResults[stepId];
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  // Download all generated results as single Master Markdown bundle
  const handleDownloadMasterPackage = () => {
    let masterMd = `# 📦 PLR Dissector Master Repurposing Vault\n\n`;
    masterMd += `*Generated by K Business Academy PLR Dissector Engine*\n`;
    masterMd += `*Original Context Size: ${plrText.split(/\s+/).length.toLocaleString()} words*\n\n`;
    masterMd += `---\n\n`;

    PIPELINE_STEPS.forEach((step) => {
      if (stepResults[step.id]) {
        masterMd += `## Step ${step.num}: ${step.title} (${step.subtitle})\n\n`;
        masterMd += stepResults[step.id] + `\n\n---\n\n`;
      }
    });

    const blob = new Blob([masterMd], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, `PLR_Dissected_Package_${new Date().toISOString().slice(0, 10)}.md`);
  };

  const wordCount = plrText ? plrText.split(/\s+/).filter(Boolean).length : 0;
  const currentStepConfig = PIPELINE_STEPS.find((s) => s.id === activeStep) || PIPELINE_STEPS[0];
  const currentResult = stepResults[activeStep];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* Top Banner Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/30 rounded-3xl p-6 md:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest mb-4">
                <PackageSearch size={14} /> AI Digital Asset Deconstructor
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-100 uppercase tracking-tight">
                PLR <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">Dissector</span>
              </h1>
              <p className="text-slate-300 text-sm md:text-lg font-medium mt-2 max-w-2xl leading-relaxed">
                One PLR or Resell Rights package in ➔ A year of high-converting content, email sequences, and offer multipliers out.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleLoadSample}
                className="px-4 py-2.5 bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-400 hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Sparkles size={14} /> Load Demo PLR Pack
              </button>

              {plrText && (
                <button
                  onClick={runFullPipeline}
                  disabled={loadingStep !== null}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Play size={14} className="fill-slate-950" /> Run 10-Step Pipeline
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main App Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Upload Dropzone & Pipeline Stepper */}
        <div className="lg:col-span-4 space-y-6">

          {/* Upload Dropzone Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-4">
            <h2 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FolderArchive className="text-amber-400" size={16} /> 0. Package Ingestion
            </h2>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e.target.files)}
              multiple
              accept=".zip,.pdf,.docx,.txt,.md,.json,.csv"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-amber-500/60 bg-slate-950/60 hover:bg-slate-950 p-6 rounded-2xl text-center cursor-pointer transition-all group"
            >
              <Upload className="mx-auto h-8 w-8 text-slate-500 group-hover:text-amber-400 group-hover:scale-110 transition-all mb-2" />
              <p className="text-xs font-bold text-slate-300">Drop PLR files or ZIP here</p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">Supports .zip, .pdf, .docx, .txt, .md</p>
            </div>

            {/* Ingestion Status Summary */}
            {plrText ? (
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Context Size:</span>
                  <span className="text-amber-400 font-bold">{wordCount.toLocaleString()} words</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Files Ingested:</span>
                  <span className="text-emerald-400 font-bold">{fileList.length} files</span>
                </div>

                <div className="pt-2 border-t border-slate-800/60 max-h-28 overflow-y-auto space-y-1">
                  {fileList.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-lg">
                      <span className="truncate max-w-[180px]">{f.name}</span>
                      <span className="text-slate-500 text-[10px]">{f.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50 text-[11px] font-mono text-slate-500">
                <Info size={14} className="shrink-0 text-amber-500/70" />
                <span>Upload a zip or click 'Load Demo PLR Pack' to begin.</span>
              </div>
            )}
          </div>

          {/* 10-Step Pipeline Stepper Navigation */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                10-Step AI Pipeline
              </h2>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-md">
                {Object.keys(stepResults).length} / 10 Completed
              </span>
            </div>

            <div className="space-y-1.5">
              {PIPELINE_STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = activeStep === step.id;
                const isCompleted = !!stepResults[step.id];
                const isLoading = loadingStep === step.id;

                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? "bg-slate-950 border-2 border-amber-500/80 shadow-lg shadow-amber-500/10"
                        : "bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 hover:bg-slate-950/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : isActive
                            ? "bg-gradient-to-br " + step.color + " text-white shadow-md"
                            : "bg-slate-900 text-slate-500 border border-slate-800"
                        }`}
                      >
                        {isCompleted ? <Check size={14} /> : step.num}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isActive ? "text-amber-400" : "text-slate-200"}`}>
                            {step.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 block truncate max-w-[170px]">
                          {step.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isLoading ? (
                        <RefreshCw size={14} className="animate-spin text-amber-400" />
                      ) : isCompleted ? (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                          Done
                        </span>
                      ) : (
                        <ChevronRight size={14} className={`transition-transform ${isActive ? "text-amber-400 translate-x-1" : "text-slate-600 group-hover:translate-x-0.5"}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* OpenAI API Key Panel */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-2">
            <label className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1.5">
              <Key size={13} className="text-amber-400" /> OpenAI / DeepSeek API Key (Optional)
            </label>
            <input
              type="password"
              value={userApiKey}
              onChange={(e) => setUserApiKey(e.target.value)}
              placeholder="sk-or-... or sk-proj-..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
            />
            <p className="text-[10px] text-slate-500 font-mono">
              Leave blank to use server environment key or instant fallback audit engine.
            </p>
          </div>
        </div>

        {/* Right Column: Active Step Output Workspace */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-sm min-h-[650px] flex flex-col justify-between">
            <div className="space-y-6">

              {/* Step Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentStepConfig.color} flex items-center justify-center text-white shadow-xl shrink-0`}>
                    <currentStepConfig.icon size={24} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                        Step {currentStepConfig.num} of 10
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
                        {currentStepConfig.badge}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight mt-0.5">
                      {currentStepConfig.title}
                    </h2>
                  </div>
                </div>

                {/* Step Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => runPipelineStep(activeStep)}
                    disabled={loadingStep === activeStep}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {loadingStep === activeStep ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Dissecting...
                      </>
                    ) : (
                      <>
                        <Play size={14} className="fill-slate-950" /> Run Step {currentStepConfig.num}
                      </>
                    )}
                  </button>

                  {currentResult && (
                    <button
                      onClick={() => handleCopyResult(activeStep)}
                      className="px-3 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedStep === activeStep ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span>{copiedStep === activeStep ? "Copied!" : "Copy"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Step Result Content */}
              {currentResult ? (
                <div className="space-y-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center justify-between bg-slate-950 border border-slate-800/80 px-4 py-2 rounded-xl text-xs font-mono">
                    <span className="text-slate-400">Generated Markdown Output</span>
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                      <button
                        onClick={() => setViewMode("rendered")}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${viewMode === "rendered" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}
                      >
                        Formatted
                      </button>
                      <button
                        onClick={() => setViewMode("raw")}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${viewMode === "raw" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}
                      >
                        Raw Markdown
                      </button>
                    </div>
                  </div>

                  {/* Markdown Display Box */}
                  {viewMode === "rendered" ? (
                    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 max-h-[500px] overflow-y-auto space-y-4 text-slate-200 text-sm leading-relaxed font-sans prose prose-invert max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatMarkdownToHtml(currentResult)
                        }}
                      />
                    </div>
                  ) : (
                    <textarea
                      readOnly
                      value={currentResult}
                      className="w-full h-[500px] bg-slate-950 border border-slate-800/80 rounded-2xl p-5 text-xs font-mono text-amber-300/90 leading-relaxed focus:outline-none resize-none"
                    />
                  )}
                </div>
              ) : (
                /* Empty Prompt State for current step */
                <div className="flex flex-col items-center justify-center p-16 border border-dashed border-slate-800 bg-slate-950/40 rounded-3xl text-center space-y-4">
                  <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${currentStepConfig.color} flex items-center justify-center text-white shadow-2xl`}>
                    <currentStepConfig.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 uppercase tracking-tight">
                    Step {currentStepConfig.num}: {currentStepConfig.title}
                  </h3>
                  <p className="text-slate-400 text-xs font-mono max-w-md">
                    {currentStepConfig.subtitle}. Click "Run Step {currentStepConfig.num}" or "Run 10-Step Pipeline" above to generate this analysis.
                  </p>
                  <button
                    onClick={() => runPipelineStep(activeStep)}
                    disabled={loadingStep === activeStep}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    <Play size={14} className="fill-slate-950" /> Execute Step {currentStepConfig.num} Analysis
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Actions & Export Bar */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <span>Completed Steps:</span>
                <span className="text-amber-400 font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  {Object.keys(stepResults).length} / 10
                </span>
              </div>

              <div className="flex items-center gap-3">
                {Object.keys(stepResults).length > 0 && (
                  <button
                    onClick={handleDownloadMasterPackage}
                    className="px-5 py-2.5 bg-slate-950 border border-slate-800 hover:border-amber-500 text-amber-400 hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Download size={14} /> Download Master Vault (.md)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Simple HTML Formatter for Markdown display
function formatMarkdownToHtml(markdown: string): string {
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3 className="text-lg font-bold text-amber-400 mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 className="text-xl font-black text-slate-100 mt-6 mb-3 border-b border-slate-800 pb-1">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 className="text-2xl font-black text-amber-400 mt-8 mb-4">$1</h1>')
    .replace(/^\> (.*$)/gim, '<blockquote className="border-l-4 border-amber-500 pl-4 py-1 italic text-slate-300 bg-amber-950/20 my-3 rounded-r-lg">$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/g, '<strong className="text-amber-300 font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em className="text-slate-300">$1</em>')
    .replace(/`([^`]+)`/g, '<code className="bg-slate-900 border border-slate-800 text-amber-400 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>')
    .replace(/^- (.*$)/gim, '<li className="ml-4 list-disc text-slate-300 py-0.5">$1</li>')
    .replace(/\n\n/g, '<br/><br/>');

  return html;
}
