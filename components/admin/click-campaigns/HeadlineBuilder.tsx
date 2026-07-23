"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles, Zap, Target, TrendingUp, AlertTriangle, Copy, Check,
  Trash2, Save, RefreshCw, Filter, Search, Plus, X, Lightbulb,
  BookOpen, Wand2, Download, Share2, Settings, Eye, BarChart3,
  ArrowRight, ChevronDown, ChevronUp, Tag, Clock, Heart, ThumbsDown,
  Layers, CheckCircle2, ShieldCheck, Flame, Users, Sliders, Folder,
  FolderPlus, MessageSquare, ExternalLink, ArrowRightCircle, Star
} from "lucide-react";

export interface HeadlinePattern {
  _id?: string;
  name: string;
  category: string;
  trigger: "curiosity" | "urgency" | "ease_speed" | "trust" | "exclusivity" | "value_gain" | "fear_pain" | "fresh_release" | "breakthrough" | "modern_future" | "unique_different" | "reinvention";
  template: string;
  description: string;
  psychology: string;
  inputFields: {
    name: string;
    label: string;
    placeholder: string;
    type: "text" | "number" | "select";
    options?: string[];
  }[];
  examples: string[];
  isActive: boolean;
}

export interface GeneratedHeadline {
  _id?: string;
  patternId: string;
  patternName: string;
  headline: string;
  inputs: Record<string, any>;
  platform?: string;
  audience?: string;
  brandVoice?: string;
  folder?: string;
  campaignId?: string;
  isSaved: boolean;
  tags: string[];
  score?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface VariantHeadline {
  style: "standard" | "emotional" | "urgency" | "curiosity" | "fear" | "custom";
  label: string;
  headline: string;
  score: number;
  triggerName: string;
}

// 12 PSYCHOLOGICAL TRIGGERS (INCLUDING THE 5 NEW CATEGORIES)
const PSYCHOLOGICAL_TRIGGERS = [
  { id: "fresh_release", name: "Fresh Release", icon: Flame, color: "rose", description: "Signals immediate availability & timeliness ('Hot Off the Press')" },
  { id: "breakthrough", name: "Breakthrough & Discovery", icon: Sparkles, color: "purple", description: "Signals a giant leap forward that makes old methods obsolete" },
  { id: "modern_future", name: "Modern & Future-Facing", icon: Layers, color: "blue", description: "Positions offer as the smart, next-gen forward-thinking choice" },
  { id: "unique_different", name: "Unique & Different", icon: Star, color: "emerald", description: "Separates the offer from competitors ('One-of-a-Kind')" },
  { id: "reinvention", name: "Reinvention & Fresh Start", icon: RefreshCw, color: "amber", description: "Promises a fresh start for audiences who tried old ways & failed" },
  { id: "curiosity", name: "Curiosity & Mystery", icon: Lightbulb, color: "purple", description: "The 'Gap' Trigger — Compels the brain to seek missing info" },
  { id: "urgency", name: "Urgency & Scarcity", icon: Clock, color: "red", description: "The 'Clock' Trigger — Triggers immediate action via FOMO" },
  { id: "ease_speed", name: "Ease & Speed", icon: Zap, color: "blue", description: "The 'Friction Remover' — Promises fast, effortless results" },
  { id: "trust", name: "Trust & Authority", icon: ShieldCheck, color: "emerald", description: "The 'Safety' Trigger — Proves risk-free credibility" },
  { id: "exclusivity", name: "Exclusivity & Belonging", icon: Users, color: "amber", description: "The 'Tribe' Trigger — Grants insider status" },
  { id: "value_gain", name: "Value & Gain", icon: TrendingUp, color: "green", description: "The 'ROI/Greed' Trigger — Promises massive returns" },
  { id: "fear_pain", name: "Fear & Pain", icon: AlertTriangle, color: "orange", description: "The 'Loss Aversion' Trigger — Warns against costly mistakes" },
];

// TARGET AUDIENCE PERSONAS
const AUDIENCE_PERSONAS = [
  { id: "all", name: "General Audience", contextWords: [] },
  { id: "marketers", name: "Digital Marketers & Affiliates", contextWords: ["ROI", "ROAS", "Leads", "Conversions", "CPC", "Funnel"] },
  { id: "entrepreneurs", name: "Founders & Business Owners", contextWords: ["Revenue", "Scale", "Profit Margin", "Growth", "Delegation"] },
  { id: "moms", name: "Stay-at-Home Moms", contextWords: ["Side Income", "Family Time", "Flexible Hours", "Stress-Free", "Peace of Mind"] },
  { id: "fitness", name: "Fitness & Health Enthusiasts", contextWords: ["Fat Loss", "Energy Boost", "Lean Muscle", "Clean Habit", "Transformation"] },
  { id: "creators", name: "Content Creators & Influencers", contextWords: ["Viral Growth", "Engagement", "Audience", "Brand Deals", "Monetization"] },
  { id: "realtors", name: "Real Estate Agents", contextWords: ["Closings", "Listings", "Commission", "Qualified Buyers", "Market Rate"] },
];

// BRAND VOICE TUNERS
const BRAND_VOICES = [
  { id: "empowering", name: "Empowering & Direct", modifier: "Unleash Your Potential" },
  { id: "professional", name: "Professional & Authoritative", modifier: "Proven Industry Standards" },
  { id: "witty", name: "Witty & Conversational", modifier: "Let's Be Honest" },
  { id: "bold", name: "Bold & Aggressive", modifier: "Stop Making Excuses" },
];

// PLATFORMS & OPTIMIZERS
const PLATFORMS = [
  { id: "email", name: "Email Subject Line", limit: 50, desc: "Curiosity-driven, short, lowercase friendly" },
  { id: "blog", name: "Blog / Sales H1 Title", limit: 70, desc: "SEO-friendly, benefit-heavy, comprehensive" },
  { id: "social", name: "Social Media Hook (FB/IG/TikTok)", limit: 45, desc: "Punchy, scroll-stopping, emoji-enhanced" },
  { id: "ad", name: "Google & Meta Ad Headline", limit: 35, desc: "Direct value proposition, high CTR focus" },
];

// CLASSIC WINNERS SWIPE FILE
const CLASSIC_SWIPE_HEADLINES = [
  {
    original: "They Laughed When I Sat Down at the Piano – But When I Began to Play!",
    author: "John Caples (1926)",
    patternId: "transformation",
    suggestedInputs: { persona: "Complete Beginner", overcame: "Skepticism & Doubts", achieve: "Generate $10k in Sales" }
  },
  {
    original: "Do You Make These Mistakes in English?",
    author: "Sherwin Cody (1919)",
    patternId: "insecurity",
    suggestedInputs: { adjective: "Embarrassing", topic: "Facebook & Meta Ad Copy" }
  },
  {
    original: "Who Else Wants a Screen Star Figure?",
    author: "Classic Mail-Order Copy",
    patternId: "secret_discovery",
    suggestedInputs: { benefit: "a 7-Figure Automated Lead Machine" }
  },
  {
    original: "How a 'Fool Stunt' Made Me a Star Salesman",
    author: "Classic Direct Response",
    patternId: "transformation",
    suggestedInputs: { persona: "Ex-Barber", overcame: "Lack of Capital", achieve: "Build a $100K Agency" }
  },
  {
    original: "A Little Mistake That Cost a Farmer $3,000 a Year",
    author: "Maxwell Sackheim",
    patternId: "warning",
    suggestedInputs: { mistake: "Ignoring Email Follow-Ups", loss: "$12,000 in Lost Sales" }
  },
  {
    original: "Throw Away Your Oars! Try This Sensation Instead",
    author: "Johnson Motors",
    patternId: "command",
    suggestedInputs: { oldMethod: "Manual Outreach & Cold DMing", newSolution: "AI Campaign Automator" }
  },
];

// REPEATABLE PATTERNS INCLUDING THE 5 NEW TRIGGER PATTERNS
const DEFAULT_PATTERNS: HeadlinePattern[] = [
  {
    name: "Just Released Announcement",
    category: "fresh_release",
    trigger: "fresh_release",
    template: "Just Released: The {adjective} Way to {desiredOutcome} (Now Available)",
    description: "Signals immediate availability & timeliness. Makes the reader feel among the first to know.",
    psychology: "Early-adopter excitement and timeliness trigger.",
    inputFields: [
      { name: "adjective", label: "Adjective", placeholder: "e.g., Brand-New, Newly Updated", type: "text" },
      { name: "desiredOutcome", label: "Desired Outcome", placeholder: "e.g., Build High-Converting Funnels", type: "text" },
    ],
    examples: [
      "Just Released: The Brand-New Way to Scale Your Ads in 2026",
      "Hot Off the Press: Now Available for Immediate Access",
    ],
    isActive: true,
  },
  {
    name: "Breakthrough & Discovery Leap",
    category: "breakthrough",
    trigger: "breakthrough",
    template: "The {breakthroughName} Breakthrough That Makes {oldMethod} Obsolete",
    description: "Implies a significant leap forward, suggesting that previous methods are now outdated.",
    psychology: "Obsolescence avoidance and innovation excitement.",
    inputFields: [
      { name: "breakthroughName", label: "Breakthrough Name", placeholder: "e.g., AI Copy Engine, 1-Click Funnel", type: "text" },
      { name: "oldMethod", label: "Old Method", placeholder: "e.g., Manual Ad Writing, Hiring Agencies", type: "text" },
    ],
    examples: [
      "The Groundbreaking AI Breakthrough That Makes Copywriting Agencies Obsolete",
    ],
    isActive: true,
  },
  {
    name: "Next-Gen Future-Facing",
    category: "modern_future",
    trigger: "modern_future",
    template: "The Next-Gen {productType} Built for {targetAudience} Who Want {benefit}",
    description: "Positions the product as the smart, forward-thinking choice for early adopters.",
    psychology: "Fear of being left behind and attraction to cutting-edge tools.",
    inputFields: [
      { name: "productType", label: "Product Type", placeholder: "e.g., Marketing Automation Platform", type: "text" },
      { name: "targetAudience", label: "Target Audience", placeholder: "e.g., Digital Marketers, SaaS Founders", type: "text" },
      { name: "benefit", label: "Primary Benefit", placeholder: "e.g., Future-Proof Lead Generation", type: "text" },
    ],
    examples: [
      "The Next-Gen State-of-the-Art Suite Built for Marketers Who Want Future-Proof ROI",
    ],
    isActive: true,
  },
  {
    name: "Proprietary & One-of-a-Kind",
    category: "unique_different",
    trigger: "unique_different",
    template: "The Proprietary {methodName} System Unlike Any Other {category}",
    description: "Separates the offer from competitors by proving why it's distinct and unique.",
    psychology: "Uniqueness bias and differentiation from market noise.",
    inputFields: [
      { name: "methodName", label: "Method/System Name", placeholder: "e.g., 3-Step Trigger Engine", type: "text" },
      { name: "category", label: "Category", placeholder: "e.g., Copywriting Tool on the Market", type: "text" },
    ],
    examples: [
      "The Proprietary One-of-a-Kind Signature System Unlike Any Other Funnel Builder",
    ],
    isActive: true,
  },
  {
    name: "Reinvention & Fresh Start",
    category: "reinvention",
    trigger: "reinvention",
    template: "Reinvented & Overhauled: A Brand-New Approach to {problemArea}",
    description: "Acknowledges past failures with old ways and promises a fresh start.",
    psychology: "Fresh start effect for audiences who failed with previous attempts.",
    inputFields: [
      { name: "problemArea", label: "Problem Area", placeholder: "e.g., Facebook Ad Conversion Rates", type: "text" },
    ],
    examples: [
      "Reinvented & Overhauled: A Brand-New Standard for Scaling E-commerce Ads",
    ],
    isActive: true,
  },
  {
    name: "Specific Promise + Timeframe",
    category: "promise_timeframe",
    trigger: "ease_speed",
    template: "How to {outcome} in {timeframe}",
    description: "Reduces friction by telling the brain exactly what it gets and how little effort it takes.",
    psychology: "Specific promises with timeframes reduce perceived effort and increase motivation.",
    inputFields: [
      { name: "outcome", label: "Desired Outcome", placeholder: "e.g., Rank #1 on Google", type: "text" },
      { name: "timeframe", label: "Timeframe or Ease Factor", placeholder: "e.g., 30 Days, Without Writing Code", type: "text" },
    ],
    examples: [
      "How to Take Out Stains… Use [Product] and Follow These Easy Directions",
    ],
    isActive: true,
  },
  {
    name: "Question of Insecurity",
    category: "insecurity",
    trigger: "fear_pain",
    template: "Do You Make These {adjective} Mistakes in {topic}?",
    description: "Targets a hidden pain point or fear of social judgment. Forces the reader to self-identify.",
    psychology: "Questions about mistakes trigger self-doubt and curiosity about the answer.",
    inputFields: [
      { name: "adjective", label: "Adjective", placeholder: "e.g., Embarrassing, Common, Costly", type: "text" },
      { name: "topic", label: "Topic or Context", placeholder: "e.g., Email Marketing, Facebook Ads", type: "text" },
    ],
    examples: [
      "Do You Make These Mistakes in English?",
    ],
    isActive: true,
  },
  {
    name: "Who Else / Secret Discovery",
    category: "secret_discovery",
    trigger: "curiosity",
    template: "Who Else Wants {benefit}?",
    description: "Creates exclusivity and curiosity. Implies that 'others' know something the reader doesn't.",
    psychology: "Social proof and curiosity gap make readers want to know what others know.",
    inputFields: [
      { name: "benefit", label: "Highly Desirable Benefit", placeholder: "e.g., a Screen Star Figure", type: "text" },
    ],
    examples: [
      "Who Else Wants a Screen Star Figure?",
    ],
    isActive: true,
  },
  {
    name: "Story of Transformation",
    category: "transformation",
    trigger: "exclusivity",
    template: "How a {persona} {overcame} to {achieve}",
    description: "Uses narrative arc. If an unlikely person could do it, so can you.",
    psychology: "Underdog stories create relatability and belief that success is achievable.",
    inputFields: [
      { name: "persona", label: "Unlikely Persona", placeholder: "e.g., Busy Mom, Complete Newbie", type: "text" },
      { name: "overcame", label: "Obstacle or Skepticism", placeholder: "e.g., Overcame Doubt, Started with $50", type: "text" },
      { name: "achieve", label: "Great Result", placeholder: "e.g., Generate $10,000 in 30 Days", type: "text" },
    ],
    examples: [
      "How a 'Fool Stunt' Made Me a Star Salesman",
    ],
    isActive: true,
  },
  {
    name: "Warning / Cost of Inaction",
    category: "warning",
    trigger: "fear_pain",
    template: "The {mistake} That Is Costing You {loss} Every Year",
    description: "Loss aversion. People are more motivated to avoid losing money/status than gaining it.",
    psychology: "Fear of loss is a stronger motivator than the promise of gain.",
    inputFields: [
      { name: "mistake", label: "Small Mistake or Hidden Cost", placeholder: "e.g., Little Leaks, Ignoring Follow-ups", type: "text" },
      { name: "loss", label: "Big Loss", placeholder: "e.g., $3,000 a Year, High-Paying Clients", type: "text" },
    ],
    examples: [
      "A Little Mistake That Cost a Farmer $3,000 a Year",
    ],
    isActive: true,
  },
];

export const HeadlineBuilder: React.FC = () => {
  // STEPPER STATE
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTrigger, setSelectedTrigger] = useState<string>("fresh_release");
  const [selectedPattern, setSelectedPattern] = useState<HeadlinePattern | null>(DEFAULT_PATTERNS[0]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [selectedAudience, setSelectedAudience] = useState<string>("all");
  const [selectedBrandVoice, setSelectedBrandVoice] = useState<string>("empowering");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("email");
  const [boostIntensity, setBoostIntensity] = useState<"soft" | "moderate" | "aggressive">("moderate");

  // OUTPUT VARIANTS & SAVED STATE
  const [generatedVariants, setGeneratedVariants] = useState<VariantHeadline[]>([]);
  const [savedHeadlines, setSavedHeadlines] = useState<GeneratedHeadline[]>([]);
  const [activeFolder, setActiveFolder] = useState<string>("All");
  const [customFolderInput, setCustomFolderInput] = useState<string>("");
  const [folders, setFolders] = useState<string[]>(["All", "Launch Campaign", "Email Nurture", "FB Ads", "Blog Titles"]);
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showSwipeSidebar, setShowSwipeSidebar] = useState<boolean>(true);

  useEffect(() => {
    fetchSavedHeadlines();
  }, []);

  const fetchSavedHeadlines = async () => {
    try {
      const response = await fetch("/api/admin/click-campaigns/headlines?type=generated");
      const data = await response.json();
      if (data.success && data.data) {
        setSavedHeadlines(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch saved headlines:", error);
    }
  };

  // READABILITY, EMOTION & IMPACT SCORING ENGINE (0 - 100)
  const calculateScores = (text: string) => {
    if (!text) return { overall: 0, clarity: 0, emotion: 0, platformFit: 0 };

    const len = text.length;
    const targetPlatform = PLATFORMS.find((p) => p.id === selectedPlatform) || PLATFORMS[0];

    // Platform Fit score
    let platformFit = 100;
    if (len > targetPlatform.limit) {
      platformFit = Math.max(30, 100 - (len - targetPlatform.limit) * 3);
    }

    // Emotion score
    let emotion = 50;
    const lower = text.toLowerCase();
    if (/!(|\?)/.test(text)) emotion += 10;
    if (/\d+/.test(text)) emotion += 15;
    if (lower.includes("secret") || lower.includes("mistake") || lower.includes("proven") || lower.includes("warning") || lower.includes("just released") || lower.includes("breakthrough")) {
      emotion += 20;
    }

    // Clarity score
    let clarity = 85;
    if (len > 90) clarity -= 20;
    if (text.split(" ").length < 4) clarity -= 15;

    const overall = Math.min(99, Math.round((clarity * 0.3) + (emotion * 0.4) + (platformFit * 0.3)));

    return { overall, clarity, emotion, platformFit };
  };

  // GENERATE 5 VARIANTS BASED ON TRIGGERS & BOOST INTENSITY
  const handleGenerateVariants = () => {
    if (!selectedPattern) return;

    let baseText = selectedPattern.template;
    Object.keys(inputs).forEach((key) => {
      if (inputs[key]) {
        baseText = baseText.replace(`{${key}}`, inputs[key]);
      }
    });

    const audienceObj = AUDIENCE_PERSONAS.find((a) => a.id === selectedAudience);
    const audienceTag = audienceObj && audienceObj.contextWords.length > 0 ? ` [For ${audienceObj.name.split("&")[0].trim()}]` : "";

    const intensityPrefix =
      boostIntensity === "aggressive"
        ? "🔥 [URGENT] "
        : boostIntensity === "moderate"
        ? "⚡ "
        : "";

    const variants: VariantHeadline[] = [
      {
        style: "standard",
        label: "🎯 Standard Core Pattern",
        headline: `${intensityPrefix}${baseText}${audienceTag}`,
        score: calculateScores(`${intensityPrefix}${baseText}${audienceTag}`).overall,
        triggerName: selectedTrigger,
      },
      {
        style: "curiosity",
        label: "🌟 Fresh & Breakthrough Angle",
        headline: `Just Unveiled Breakthrough: ${baseText}`,
        score: calculateScores(`Just Unveiled Breakthrough: ${baseText}`).overall,
        triggerName: "breakthrough",
      },
      {
        style: "urgency",
        label: "⚡ Next-Gen Modern Angle",
        headline: `Next-Gen Future-Proof Method: ${baseText}`,
        score: calculateScores(`Next-Gen Future-Proof Method: ${baseText}`).overall,
        triggerName: "modern_future",
      },
      {
        style: "emotional",
        label: "💖 Proprietary Unique Variant",
        headline: `The One-of-a-Kind Proprietary Way: ${baseText}`,
        score: calculateScores(`The One-of-a-Kind Proprietary Way: ${baseText}`).overall,
        triggerName: "unique_different",
      },
      {
        style: "fear",
        label: "🔄 Reinvention & Fresh Start",
        headline: `Reinvented & Overhauled: ${baseText} (A Brand-New Approach)`,
        score: calculateScores(`Reinvented & Overhauled: ${baseText} (A Brand-New Approach)`).overall,
        triggerName: "reinvention",
      },
    ];

    setGeneratedVariants(variants);
    setCurrentStep(5);
  };

  // REMIX FROM CLASSIC SWIPE FILE
  const handleRemixClassic = (classicItem: typeof CLASSIC_SWIPE_HEADLINES[0]) => {
    const foundPattern = DEFAULT_PATTERNS.find((p) => p.category === classicItem.patternId) || DEFAULT_PATTERNS[0];
    setSelectedPattern(foundPattern);
    setSelectedTrigger(foundPattern.trigger);
    setInputs((classicItem.suggestedInputs as unknown) as Record<string, string>);
    setCurrentStep(3);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const saveHeadline = async (headlineText: string) => {
    if (!headlineText || !selectedPattern) return;

    try {
      setLoading(true);
      const response = await fetch("/api/admin/click-campaigns/headlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "generated",
          patternId: selectedPattern._id || selectedPattern.name,
          patternName: selectedPattern.name,
          headline: headlineText,
          inputs,
          platform: selectedPlatform,
          audience: selectedAudience,
          brandVoice: selectedBrandVoice,
          folder: activeFolder,
          isSaved: true,
          tags: [selectedTrigger, selectedPlatform, activeFolder],
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchSavedHeadlines();
      }
    } catch (error) {
      console.error("Failed to save headline:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHeadline = async (id: string) => {
    try {
      await fetch(`/api/admin/click-campaigns/headlines/${id}`, {
        method: "DELETE",
      });
      await fetchSavedHeadlines();
    } catch (error) {
      console.error("Failed to delete headline:", error);
    }
  };

  const addFolder = () => {
    if (customFolderInput && !folders.includes(customFolderInput)) {
      setFolders([...folders, customFolderInput]);
      setActiveFolder(customFolderInput);
      setCustomFolderInput("");
    }
  };

  const filteredSavedHeadlines = savedHeadlines.filter((h) => {
    if (activeFolder === "All") return true;
    return (h as any).folder === activeFolder || h.tags?.includes(activeFolder);
  });

  return (
    <div className="space-y-6">
      {/* APP TOP HEADER */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl shadow-lg shadow-purple-600/30">
            <Wand2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Headline Engineering Suite & Swipe File</h2>
            <p className="text-xs text-slate-400 mt-1">
              Move from "I don't know what to write" to 5 high-converting headlines powered by 12 psychological triggers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSwipeSidebar(!showSwipeSidebar)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition shadow-md ${
              showSwipeSidebar
                ? "bg-purple-950 border border-purple-800 text-purple-300"
                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            {showSwipeSidebar ? "Hide Classic Swipe File Sidebar" : "Show Classic Swipe File"}
          </button>
        </div>
      </div>

      {/* STEP NAVIGATION STEPPER */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-2">
        {[
          { step: 1, label: "1. Select Goal & Trigger (12 Triggers)", icon: Target },
          { step: 2, label: "2. Pick Pattern", icon: BookOpen },
          { step: 3, label: "3. Fill Blanks", icon: Sliders },
          { step: 4, label: "4. Persona & Platform", icon: Users },
          { step: 5, label: "5. Variants & Score", icon: Sparkles },
        ].map((s) => {
          const Icon = s.icon;
          const isActive = currentStep === s.step;
          const isDone = currentStep > s.step;

          return (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`flex-1 min-w-[140px] px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-105"
                  : isDone
                  ? "bg-slate-950 border border-purple-900/60 text-purple-400"
                  : "bg-slate-950/60 border border-slate-800/60 text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: LEFT WORKSPACE / RIGHT SWIPE SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAIN APPLICATION WORKSPACE (8 COLUMNS OR 12 COLUMNS) */}
        <div className={showSwipeSidebar ? "lg:col-span-8 space-y-6" : "lg:col-span-12 space-y-6"}>

          {/* STEP 1: PSYCHOLOGICAL TRIGGER SELECTOR (12 TRIGGERS) */}
          {currentStep === 1 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="space-y-1 border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" /> Step 1: Select Your Primary Psychological Goal (12 Triggers)
                </h3>
                <p className="text-xs text-slate-400">
                  Select the exact emotion or marketing angle you want to trigger in your reader's mind.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {PSYCHOLOGICAL_TRIGGERS.map((t) => {
                  const Icon = t.icon;
                  const isSelected = selectedTrigger === t.id;

                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTrigger(t.id);
                        const matchedPattern = DEFAULT_PATTERNS.find((p) => p.trigger === t.id) || DEFAULT_PATTERNS[0];
                        setSelectedPattern(matchedPattern);
                        setCurrentStep(2);
                      }}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? "bg-purple-950/80 border-purple-500 shadow-xl shadow-purple-900/30 scale-[1.02]"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-800 text-purple-400">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-100">{t.name}</h4>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-tight">{t.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: PATTERN SELECTION */}
          {currentStep === 2 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" /> Step 2: Choose Repeatable Pattern
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pre-loaded classic copywriting structures reverse-engineered from world-class headlines.
                  </p>
                </div>
                <span className="text-xs font-bold text-purple-400 bg-purple-950 border border-purple-800 px-3 py-1 rounded-full">
                  Trigger: {PSYCHOLOGICAL_TRIGGERS.find((t) => t.id === selectedTrigger)?.name}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {DEFAULT_PATTERNS.map((pattern) => {
                  const isSelected = selectedPattern?.name === pattern.name;

                  return (
                    <div
                      key={pattern.name}
                      onClick={() => {
                        setSelectedPattern(pattern);
                        setInputs({});
                        setCurrentStep(3);
                      }}
                      className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                        isSelected
                          ? "bg-purple-950/80 border-purple-500 shadow-lg shadow-purple-900/30"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                          {pattern.name}
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">{pattern.template}</span>
                      </div>
                      <p className="text-xs text-slate-400">{pattern.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: FILL IN THE BLANKS */}
          {currentStep === 3 && selectedPattern && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" /> Step 3: Fill in the Blanks
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Fill in your specific details for <span className="text-purple-300 font-bold">'{selectedPattern.name}'</span>.
                </p>
              </div>

              <div className="space-y-4">
                {selectedPattern.inputFields.map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-200">{field.label}</label>
                    <input
                      type={field.type}
                      value={inputs[field.name] || ""}
                      onChange={(e) => setInputs({ ...inputs, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition font-medium"
                    />
                  </div>
                ))}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(4)}
                    disabled={Object.keys(inputs).length === 0 || Object.values(inputs).every((v) => !v)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 transition shadow-lg shadow-purple-600/30 cursor-pointer"
                  >
                    Next: Persona & Platform <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PERSONA, PLATFORM OPTIMIZER & BRAND VOICE */}
          {currentStep === 4 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" /> Step 4: Audience Persona & Platform Optimizer
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adapt tone, jargon, and character limits specifically for your target audience & distribution channel.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Audience Persona */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Target Audience Persona
                  </label>
                  <select
                    value={selectedAudience}
                    onChange={(e) => setSelectedAudience(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-bold focus:border-purple-500"
                  >
                    {AUDIENCE_PERSONAS.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                {/* Platform Optimizer */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Target Platform Channel
                  </label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-bold focus:border-purple-500"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (Limit: {p.limit} chars)</option>
                    ))}
                  </select>
                </div>

                {/* Brand Voice Tuner */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Brand Voice Tuner
                  </label>
                  <select
                    value={selectedBrandVoice}
                    onChange={(e) => setSelectedBrandVoice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-bold focus:border-purple-500"
                  >
                    {BRAND_VOICES.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                {/* Power Word Boost Intensity */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    AI Power Word Boost Intensity
                  </label>
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
                    {(["soft", "moderate", "aggressive"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setBoostIntensity(lvl)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                          boostIntensity === lvl
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleGenerateVariants}
                  className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 transition shadow-xl shadow-purple-600/30 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" /> Generate 5 High-Converting Variations
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: A/B TEST VARIANT GENERATOR & IMPACT SCORES */}
          {currentStep === 5 && generatedVariants.length > 0 && (
            <div className="bg-slate-900 border border-purple-800/80 rounded-3xl p-6 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" /> Generated A/B Test Variations & Readability Scores
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    5 high-performing variants using different psychological triggers & power word boosts.
                  </p>
                </div>

                <button
                  onClick={handleGenerateVariants}
                  className="px-4 py-2 bg-purple-950 border border-purple-800 text-purple-300 hover:bg-purple-900 rounded-xl text-xs font-bold flex items-center gap-2 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </button>
              </div>

              <div className="space-y-4">
                {generatedVariants.map((variant, idx) => {
                  const scores = calculateScores(variant.headline);

                  return (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-slate-800 hover:border-purple-600/60 rounded-2xl p-5 space-y-3 transition"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-purple-300">{variant.label}</span>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                              scores.overall >= 85
                                ? "bg-emerald-950 border-emerald-700 text-emerald-300"
                                : scores.overall >= 70
                                ? "bg-purple-950 border-purple-700 text-purple-300"
                                : "bg-amber-950 border-amber-700 text-amber-300"
                            }`}
                          >
                            ⚡ Copy Score: {scores.overall}/100
                          </span>

                          <button
                            onClick={() => copyToClipboard(variant.headline)}
                            className="p-2 text-slate-400 hover:text-emerald-400 transition"
                            title="Copy to clipboard"
                          >
                            {copiedText === variant.headline ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => saveHeadline(variant.headline)}
                            disabled={loading}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                          >
                            <Save className="w-3.5 h-3.5" /> Save
                          </button>
                        </div>
                      </div>

                      <p className="text-base font-bold text-slate-100 leading-snug">{variant.headline}</p>

                      {/* READABILITY & IMPACT METERS */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono">
                        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-slate-400">
                          <span>Clarity Score: </span>
                          <span className="text-blue-300 font-bold">{scores.clarity}%</span>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-slate-400">
                          <span>Emotion Score: </span>
                          <span className="text-rose-300 font-bold">{scores.emotion}%</span>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-slate-400">
                          <span>Platform Fit: </span>
                          <span className="text-emerald-300 font-bold">{scores.platformFit}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SAVE & ORGANIZE WORKSPACE WITH FOLDERS */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-100">Save & Organize Workspace</h3>
                  <p className="text-xs text-slate-400">Personal swipe file folders & campaign organization</p>
                </div>
              </div>

              {/* Add New Folder */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="New folder name..."
                  value={customFolderInput}
                  onChange={(e) => setCustomFolderInput(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100"
                />
                <button
                  onClick={addFolder}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Folder
                </button>
              </div>
            </div>

            {/* Folder Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {folders.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFolder(f)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                    activeFolder === f
                      ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                      : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Folder className="w-3.5 h-3.5 text-amber-300" />
                  <span>{f}</span>
                </button>
              ))}
            </div>

            {/* Saved Headlines Grid */}
            {filteredSavedHeadlines.length === 0 ? (
              <div className="text-center py-10 space-y-2 bg-slate-950/40 rounded-2xl border border-slate-800">
                <Save className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500">No headlines saved in folder '{activeFolder}' yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {filteredSavedHeadlines.map((headline) => (
                  <div key={headline._id} className="bg-slate-950 border border-slate-800 hover:border-amber-600/60 rounded-2xl p-4 space-y-2 transition">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-bold text-slate-100 flex-1 leading-relaxed">{headline.headline}</p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyToClipboard(headline.headline)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 rounded transition"
                        >
                          {copiedText === headline.headline ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteHeadline(headline._id!)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded-md text-[10px] font-semibold">
                        Folder: {(headline as any).folder || "General"}
                      </span>
                      {headline.createdAt && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(headline.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR: CLASSIC WINNERS SWIPE FILE & 1-CLICK REMIX */}
        {showSwipeSidebar && (
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <h4 className="text-sm font-bold text-slate-100">Classic Winners Swipe File</h4>
                </div>
                <span className="text-[10px] font-bold text-yellow-400 bg-yellow-950 border border-yellow-800 px-2 py-0.5 rounded-full">
                  1-Click Remix
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Reverse-engineered multi-million dollar direct response headlines. Click <strong>"Remix"</strong> to pre-fill pattern inputs!
              </p>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {CLASSIC_SWIPE_HEADLINES.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 hover:border-purple-600/60 rounded-2xl p-4 space-y-3 transition">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-100 leading-snug">"{item.original}"</p>
                      <span className="text-[10px] text-purple-400 font-mono block">— {item.author}</span>
                    </div>

                    <button
                      onClick={() => handleRemixClassic(item)}
                      className="w-full py-2 bg-gradient-to-r from-purple-950 to-indigo-950 hover:from-purple-900 hover:to-indigo-900 border border-purple-800 text-purple-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Remix into My Niche
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
