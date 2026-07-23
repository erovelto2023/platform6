"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles, Zap, Target, TrendingUp, AlertTriangle, Copy, Check,
  Trash2, Save, RefreshCw, Filter, Search, Plus, X, Lightbulb,
  BookOpen, Wand2, Download, Share2, Settings, Eye, BarChart3,
  ArrowRight, ChevronDown, ChevronUp, Tag, Clock, Heart, ThumbsDown,
  Layers, CheckCircle2, ShieldCheck, Flame, Users, Sliders, Folder,
  FolderPlus, MessageSquare, ExternalLink, ArrowRightCircle, Star, Award,
  Crown, Compass, HelpCircle, Grid, Cpu, Terminal
} from "lucide-react";

import { TOP_100_COPYWRITERS, fontStylePresets, Copywriter100, StylePreset } from "@/lib/copywritingLegends100";

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
  mentorLegend?: string;
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
  mentorName?: string;
}

// 12 PSYCHOLOGICAL TRIGGERS
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
  const [selectedStylePreset, setSelectedStylePreset] = useState<string>("The Legend");
  const [selectedMentor, setSelectedMentor] = useState<string>("ogilvy");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("email");
  const [boostIntensity, setBoostIntensity] = useState<"soft" | "moderate" | "aggressive">("moderate");

  // SEARCH & FILTER FOR 100 LEGENDS MODAL
  const [legendSearchText, setLegendSearchText] = useState<string>("");
  const [legendArchetypeFilter, setLegendArchetypeFilter] = useState<string>("All");

  // OUTPUT VARIANTS & SAVED STATE
  const [generatedVariants, setGeneratedVariants] = useState<VariantHeadline[]>([]);
  const [savedHeadlines, setSavedHeadlines] = useState<GeneratedHeadline[]>([]);
  const [activeFolder, setActiveFolder] = useState<string>("All");
  const [customFolderInput, setCustomFolderInput] = useState<string>("");
  const [folders, setFolders] = useState<string[]>(["All", "Launch Campaign", "Email Nurture", "FB Ads", "Blog Titles"]);
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showSwipeSidebar, setShowSwipeSidebar] = useState<boolean>(true);
  const [showMentorVaultModal, setShowMentorVaultModal] = useState<boolean>(false);

  // MANUALLY ADD HEADLINE MODAL STATE
  const [showAddHeadlineModal, setShowAddHeadlineModal] = useState<boolean>(false);
  const [manualHeadlineText, setManualHeadlineText] = useState<string>("");
  const [manualHeadlineFolder, setManualHeadlineFolder] = useState<string>("All");

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

    let platformFit = 100;
    if (len > targetPlatform.limit) {
      platformFit = Math.max(30, 100 - (len - targetPlatform.limit) * 3);
    }

    let emotion = 50;
    const lower = text.toLowerCase();
    if (/!(|\?)/.test(text)) emotion += 10;
    if (/\d+/.test(text)) emotion += 15;
    if (lower.includes("secret") || lower.includes("mistake") || lower.includes("proven") || lower.includes("warning") || lower.includes("just released") || lower.includes("breakthrough")) {
      emotion += 20;
    }

    let clarity = 85;
    if (len > 90) clarity -= 20;
    if (text.split(" ").length < 4) clarity -= 15;

    const overall = Math.min(99, Math.round((clarity * 0.3) + (emotion * 0.4) + (platformFit * 0.3)));

    return { overall, clarity, emotion, platformFit };
  };

  // GENERATE 5 VARIANTS BASED ON TRIGGERS, PRESET & 100 LEGENDS MENTOR MODE
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

    const activePreset = fontStylePresets.find((p: StylePreset) => p.id === selectedStylePreset) || fontStylePresets[0];
    const mentorObj = TOP_100_COPYWRITERS.find((m) => m.id === selectedMentor) || TOP_100_COPYWRITERS[0];
    
    const mentorPrefix = mentorObj.promptPrefix || activePreset.toneModifier;

    const intensityPrefix =
      boostIntensity === "aggressive"
        ? "🔥 [URGENT] "
        : boostIntensity === "moderate"
        ? "⚡ "
        : "";

    const variants: VariantHeadline[] = [
      {
        style: "standard",
        label: `👑 ${mentorObj.name} Mode (${mentorObj.archetype.split(" ")[0]})`,
        headline: `${mentorPrefix}${baseText}${audienceTag}`,
        score: calculateScores(`${mentorPrefix}${baseText}${audienceTag}`).overall,
        triggerName: selectedTrigger,
        mentorName: mentorObj.name,
      },
      {
        style: "curiosity",
        label: "🏛️ 'The Legend' Preset (Ogilvy / Caples Style)",
        headline: `They Laughed Until I Tested The Evidence: ${baseText}`,
        score: calculateScores(`They Laughed Until I Tested The Evidence: ${baseText}`).overall,
        triggerName: "curiosity",
        mentorName: "David Ogilvy",
      },
      {
        style: "urgency",
        label: "🚀 'The Funnel Hacker' Preset (Brunson / Kern Style)",
        headline: `Hook-Story-Offer: ${baseText} (Get The Funnel Script Now)`,
        score: calculateScores(`Hook-Story-Offer: ${baseText} (Get The Funnel Script Now)`).overall,
        triggerName: "urgency",
        mentorName: "Russell Brunson",
      },
      {
        style: "emotional",
        label: "📊 'The Data Scientist' Preset (Wiebe / Dean Style)",
        headline: `What Customer Data Actually Proves About: ${baseText}`,
        score: calculateScores(`What Customer Data Actually Proves About: ${baseText}`).overall,
        triggerName: "trust",
        mentorName: "Joanna Wiebe",
      },
      {
        style: "fear",
        label: "⚡ 'The AI Innovator' Preset (Alex Hormozi $100M Offer Style)",
        headline: `The Grand-Slam Value Stack Solution: ${baseText}`,
        score: calculateScores(`The Grand-Slam Value Stack Solution: ${baseText}`).overall,
        triggerName: "value_gain",
        mentorName: "Alex Hormozi",
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

  // SAVE HEADLINE
  const saveHeadline = async (headlineText: string, targetFolder?: string) => {
    if (!headlineText) return;
    const folderToSave = targetFolder || activeFolder;

    try {
      setLoading(true);
      const response = await fetch("/api/admin/click-campaigns/headlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "generated",
          patternId: selectedPattern?._id || selectedPattern?.name || "custom",
          patternName: selectedPattern?.name || "Custom Headline",
          headline: headlineText,
          inputs,
          platform: selectedPlatform,
          audience: selectedAudience,
          brandVoice: selectedBrandVoice,
          mentorLegend: selectedMentor,
          folder: folderToSave,
          isSaved: true,
          tags: [selectedTrigger, selectedPlatform, selectedMentor, folderToSave],
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

  // MANUALLY ADD HEADLINE FORM SUBMIT
  const handleAddManualHeadlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualHeadlineText.trim()) return;

    const folderToUse = manualHeadlineFolder !== "All" ? manualHeadlineFolder : (activeFolder !== "All" ? activeFolder : "General");
    await saveHeadline(manualHeadlineText, folderToUse);
    setManualHeadlineText("");
    setShowAddHeadlineModal(false);
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

  // ADD NEW FOLDER
  const addFolder = () => {
    if (customFolderInput && !folders.includes(customFolderInput)) {
      setFolders([...folders, customFolderInput]);
      setActiveFolder(customFolderInput);
      setCustomFolderInput("");
    }
  };

  // DELETE FOLDER
  const deleteFolder = (folderToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (folderToDelete === "All") return;
    if (!confirm(`Are you sure you want to delete folder '${folderToDelete}'?`)) return;

    setFolders(folders.filter((f) => f !== folderToDelete));
    if (activeFolder === folderToDelete) {
      setActiveFolder("All");
    }
  };

  const filteredSavedHeadlines = savedHeadlines.filter((h) => {
    if (activeFolder === "All") return true;
    return (h as any).folder === activeFolder || h.tags?.includes(activeFolder);
  });

  const filteredTop100Legends = TOP_100_COPYWRITERS.filter((l) => {
    const matchesArchetype = legendArchetypeFilter === "All" || l.archetype === legendArchetypeFilter;
    const matchesSearch =
      l.name.toLowerCase().includes(legendSearchText.toLowerCase()) ||
      l.focus.toLowerCase().includes(legendSearchText.toLowerCase()) ||
      l.sampleVoice.toLowerCase().includes(legendSearchText.toLowerCase());
    return matchesArchetype && matchesSearch;
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
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">
              Headline Engineering Suite & 100 Copywriting Legends Vault
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select 5 Style Presets or channel 100 master copywriters & digital marketing legends in AI partner mode.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowMentorVaultModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 transition shadow-lg shadow-amber-600/20 cursor-pointer"
          >
            <Crown className="w-4 h-4 text-yellow-200" /> 100 Legends & Mentors ({TOP_100_COPYWRITERS.length})
          </button>

          <button
            onClick={() => setShowSwipeSidebar(!showSwipeSidebar)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition shadow-md ${
              showSwipeSidebar
                ? "bg-purple-950 border border-purple-800 text-purple-300"
                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            {showSwipeSidebar ? "Hide Swipe File" : "Show Swipe File"}
          </button>
        </div>
      </div>

      {/* STEP NAVIGATION STEPPER */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-2">
        {[
          { step: 1, label: "1. Select Goal & Trigger", icon: Target },
          { step: 2, label: "2. Pick Pattern", icon: BookOpen },
          { step: 3, label: "3. Fill Blanks", icon: Sliders },
          { step: 4, label: "4. Presets & 100 Mentors", icon: Crown },
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
        {/* MAIN APPLICATION WORKSPACE */}
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
                        const firstMatch = DEFAULT_PATTERNS.find((p) => p.trigger === t.id);
                        if (firstMatch) setSelectedPattern(firstMatch);
                      }}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? "bg-purple-950/80 border-purple-500 shadow-lg shadow-purple-600/20 ring-1 ring-purple-500"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-slate-900 rounded-xl">
                          <Icon className="w-4 h-4 text-purple-400" />
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-slate-100">{t.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{t.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 transition shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  Next: Pick Pattern <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PICK PATTERN */}
          {currentStep === 2 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" /> Step 2: Select a Repeatable Headline Pattern
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose a high-converting formula that matches your selected trigger.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEFAULT_PATTERNS.map((pattern, idx) => {
                  const isSelected = selectedPattern?.name === pattern.name;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedPattern(pattern);
                        setInputs({});
                      }}
                      className={`p-5 rounded-2xl border text-left cursor-pointer transition space-y-3 ${
                        isSelected
                          ? "bg-purple-950/80 border-purple-500 shadow-lg shadow-purple-600/20 ring-1 ring-purple-500"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-100">{pattern.name}</span>
                        <span className="px-2.5 py-0.5 bg-slate-900 text-purple-300 rounded-md text-[10px] font-mono font-bold uppercase">
                          {pattern.trigger}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs font-mono text-purple-300">
                        {pattern.template}
                      </div>

                      <p className="text-xs text-slate-400">{pattern.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!selectedPattern}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 transition shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  Next: Fill Blanks <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FILL IN THE BLANKS */}
          {currentStep === 3 && selectedPattern && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="border-b border-slate-800 pb-4 space-y-1">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" /> Step 3: Fill In The Blanks for '{selectedPattern.name}'
                </h3>
                <div className="p-3 bg-slate-950 border border-purple-800/60 rounded-xl text-xs font-mono text-purple-300">
                  {selectedPattern.template}
                </div>
              </div>

              <div className="space-y-4">
                {selectedPattern.inputFields.map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      {field.label} *
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={inputs[field.name] || ""}
                      onChange={(e) => setInputs({ ...inputs, [field.name]: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ))}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(4)}
                    disabled={Object.keys(inputs).length === 0 || Object.values(inputs).every((v) => !v)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 transition shadow-lg shadow-purple-600/30 cursor-pointer"
                  >
                    Next: Presets & 100 Mentors <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: 5 STYLE PRESETS & 100 INFLUENCERS / LEGENDS MENTOR MODE */}
          {currentStep === 4 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" /> Step 4: Select Style Preset or Channel from 100 Copywriting Legends
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose from 5 Master Style Presets or pick an individual mentor from the top 100 marketing influencers.
                </p>
              </div>

              {/* 5 MASTER STYLE PRESET CARDS */}
              <div className="space-y-3">
                <label className="block text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                  5 Master Style Presets (Quick Select)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {fontStylePresets.map((preset: StylePreset) => {
                    const isSelected = selectedStylePreset === preset.id;

                    return (
                      <div
                        key={preset.id}
                        onClick={() => setSelectedStylePreset(preset.id)}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition space-y-2 flex flex-col justify-between ${
                          isSelected
                            ? "bg-amber-950/80 border-amber-500 shadow-lg shadow-amber-600/20 ring-1 ring-amber-500 text-white"
                            : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <div>
                          <span className="font-extrabold text-xs text-slate-100 block">{preset.name}</span>
                          <span className="text-[10px] text-amber-300 font-mono block mt-0.5">{preset.tagline}</span>
                        </div>

                        <p className="text-[10px] text-slate-400 leading-relaxed truncate">{preset.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 100 COPYWRITERS MENTOR MODE SELECTOR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-800">
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Crown className="w-4 h-4" /> Pick Individual Mentor ({TOP_100_COPYWRITERS.length} Master Copywriters)
                    </label>
                    <button
                      onClick={() => setShowMentorVaultModal(true)}
                      className="text-xs text-amber-400 hover:text-amber-300 font-bold underline"
                    >
                      Browse All 100 Legends Vault ➔
                    </button>
                  </div>

                  <select
                    value={selectedMentor}
                    onChange={(e) => setSelectedMentor(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/60 rounded-xl px-3.5 py-3 text-xs text-slate-100 font-extrabold focus:ring-2 focus:ring-amber-500"
                  >
                    {TOP_100_COPYWRITERS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.archetype}) — Style: {m.stylePreset}
                      </option>
                    ))}
                  </select>

                  {/* Active Mentor Rationale Card */}
                  {selectedMentor && (() => {
                    const activeMentorObj = TOP_100_COPYWRITERS.find((m) => m.id === selectedMentor);
                    if (!activeMentorObj) return null;

                    return (
                      <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-2xl text-xs space-y-2 text-amber-200">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-amber-300 text-sm">{activeMentorObj.name} Mode</span>
                          <span className="px-2 py-0.5 bg-amber-900/80 rounded text-[10px] font-mono">{activeMentorObj.archetype}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-sans"><strong>Sample Voice:</strong> "{activeMentorObj.sampleVoice}"</p>
                        <p className="text-[11px] text-slate-400 italic">"Key Concept: {activeMentorObj.keyConcept}"</p>
                      </div>
                    );
                  })()}
                </div>

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
                  className="px-6 py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 transition shadow-xl shadow-purple-600/30 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" /> Generate 5 Mentor-Guided Variations
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
                    <Sparkles className="w-5 h-5 text-yellow-400" /> Generated Mentor Variations & Impact Scores
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    5 high-performing variants using your selected mentor style & psychological triggers.
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
                        <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5 text-amber-400" /> {variant.label}
                        </span>

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
                            <Save className="w-3.5 h-3.5" /> Save to Folder
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
                  <p className="text-xs text-slate-400">Personal swipe file folders & headline library</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowAddHeadlineModal(true)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-yellow-300" /> Add Headline Manually
                </button>

                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="New folder..."
                    value={customFolderInput}
                    onChange={(e) => setCustomFolderInput(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 w-32"
                  />
                  <button
                    onClick={addFolder}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
                  >
                    <FolderPlus className="w-3.5 h-3.5" /> Create
                  </button>
                </div>
              </div>
            </div>

            {/* Folder Tabs with Delete Folder Action */}
            <div className="flex flex-wrap items-center gap-2">
              {folders.map((f) => (
                <div
                  key={f}
                  className={`group relative flex items-center rounded-xl text-xs font-extrabold transition ${
                    activeFolder === f
                      ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                      : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <button
                    onClick={() => setActiveFolder(f)}
                    className="px-3.5 py-1.5 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Folder className="w-3.5 h-3.5 text-amber-300" />
                    <span>{f}</span>
                  </button>

                  {f !== "All" && (
                    <button
                      onClick={(e) => deleteFolder(f, e)}
                      className="pr-2 text-slate-400 hover:text-rose-300 opacity-60 hover:opacity-100 transition"
                      title={`Delete folder '${f}'`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Saved Headlines Grid */}
            {filteredSavedHeadlines.length === 0 ? (
              <div className="text-center py-10 space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800">
                <Save className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No headlines saved in folder '{activeFolder}' yet.</p>
                <button
                  onClick={() => setShowAddHeadlineModal(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" /> Add Headline to '{activeFolder}'
                </button>
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

      {/* MODAL: 100 COPYWRITING LEGENDS HALL OF FAME & SEARCH */}
      {showMentorVaultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-950 border border-amber-800 rounded-2xl">
                  <Crown className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Top 100 Copywriters & Digital Marketing Influencers Vault</h3>
                  <p className="text-xs text-slate-400">
                    Search and pick from 100 legendary practitioners across 5 Archetypes. Channel their exact voice in AI partner mode!
                  </p>
                </div>
              </div>
              <button onClick={() => setShowMentorVaultModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* SEARCH & ARCHETYPE FILTERS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 100 legends, books, styles..."
                  value={legendSearchText}
                  onChange={(e) => setLegendSearchText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {["All", "Direct Response Legends", "Digital Funnel Architects", "SaaS & Conversion Specialists", "Brand & Storytelling Gurus", "Modern AI & Niche Innovators"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setLegendArchetypeFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      legendArchetypeFilter === cat
                        ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                        : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Legends Cards Grid (100 Legends) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTop100Legends.map((legend) => (
                <div
                  key={legend.id}
                  className="bg-slate-950 border border-slate-800 hover:border-amber-600/60 rounded-2xl p-4 space-y-3 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-amber-400 shrink-0" /> {legend.name}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded text-[9px] font-mono shrink-0">
                        {legend.stylePreset}
                      </span>
                    </div>

                    <p className="text-xs text-purple-300 font-mono italic">"{legend.sampleVoice}"</p>
                    <p className="text-[11px] text-slate-400"><strong>Focus:</strong> {legend.focus}</p>

                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] text-slate-400 space-y-0.5">
                      <span className="text-amber-300 font-bold block">Key Concept:</span>
                      <div>"{legend.keyConcept}"</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMentor(legend.id);
                      setSelectedStylePreset(legend.stylePreset);
                      setShowMentorVaultModal(false);
                      setCurrentStep(4);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-xl text-xs font-extrabold transition shadow-md cursor-pointer mt-2"
                  >
                    Channel '{legend.name}' Mode ➔
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD HEADLINE MANUALLY TO WORKSPACE */}
      {showAddHeadlineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" /> Add Custom Headline to Workspace Folder
              </h3>
              <button onClick={() => setShowAddHeadlineModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddManualHeadlineSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Target Folder</label>
                <select
                  value={manualHeadlineFolder}
                  onChange={(e) => setManualHeadlineFolder(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold"
                >
                  {folders.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Headline Text *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type or paste your headline here..."
                  value={manualHeadlineText}
                  onChange={(e) => setManualHeadlineText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-bold leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddHeadlineModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-extrabold shadow-lg shadow-amber-600/30"
                >
                  Save Headline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
