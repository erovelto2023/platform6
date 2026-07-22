"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles, Zap, Target, TrendingUp, AlertTriangle, Copy, Check,
  Trash2, Save, RefreshCw, Filter, Search, Plus, X, Lightbulb,
  BookOpen, Wand2, Download, Share2, Settings, Eye, BarChart3,
  ArrowRight, ChevronDown, ChevronUp, Tag, Clock,
} from "lucide-react";

export interface HeadlinePattern {
  _id?: string;
  name: string;
  category: string;
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
  campaignId?: string;
  isSaved: boolean;
  tags: string[];
  performance?: {
    impressions?: number;
    clicks?: number;
    ctr?: number;
    conversions?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

const POWER_WORDS = {
  generic: {
    "lose": ["melt", "shred", "burn", "eliminate", "destroy"],
    "make": ["create", "generate", "produce", "unleash", "explode"],
    "get": ["unlock", "discover", "reveal", "access", "achieve"],
    "improve": ["transform", "revolutionize", "supercharge", "maximize", "optimize"],
    "help": ["empower", "guide", "assist", "support", "enable"],
    "learn": ["master", "dominate", "conquer", "absorb", "acquire"],
    "use": ["leverage", "harness", "exploit", "utilize", "deploy"],
    "stop": ["eliminate", "eradicate", "abolish", "terminate", "cease"],
    "start": ["launch", "ignite", "kickstart", "begin", "commence"],
    "find": ["uncover", "reveal", "discover", "locate", "identify"],
  },
  emotional: {
    "amazing": ["mind-blowing", "extraordinary", "phenomenal", "spectacular", "breathtaking"],
    "good": ["outstanding", "exceptional", "superior", "remarkable", "excellent"],
    "bad": ["terrible", "awful", "horrible", "disastrous", "catastrophic"],
    "big": ["massive", "colossal", "enormous", "gigantic", "monumental"],
    "small": ["tiny", "microscopic", "minuscule", "petite", "compact"],
    "fast": ["lightning-fast", "rapid", "swift", "blazing", "instant"],
    "slow": ["sluggish", "lethargic", "painstaking", "gradual", "tedious"],
    "easy": ["effortless", "simple", "straightforward", "seamless", "intuitive"],
    "hard": ["challenging", "demanding", "difficult", "arduous", "complex"],
    "new": ["revolutionary", "innovative", "cutting-edge", "groundbreaking", "pioneering"],
  },
  urgency: {
    "now": ["immediately", "instantly", "right now", "today", "without delay"],
    "soon": ["shortly", "before long", "in moments", "coming soon", "around the corner"],
    "limited": ["exclusive", "scarce", "restricted", "finite", "constrained"],
    "quick": ["rapid", "swift", "speedy", "hasty", "expedited"],
  },
};

const DEFAULT_PATTERNS: HeadlinePattern[] = [
  {
    name: "Specific Promise + Timeframe",
    category: "promise_timeframe",
    template: "How to {outcome} in {timeframe}",
    description: "Reduces friction by telling the brain exactly what it gets and how little effort it takes.",
    psychology: "Specific promises with timeframes reduce perceived effort and increase motivation.",
    inputFields: [
      { name: "outcome", label: "Desired Outcome", placeholder: "e.g., Rank on Page 1", type: "text" },
      { name: "timeframe", label: "Timeframe or Ease Factor", placeholder: "e.g., 30 Days, Without Writing Code", type: "text" },
    ],
    examples: [
      "How to Take Out Stains… Use [Product] and Follow These Easy Directions",
      "Who Else Wants Lighter Cake – In Half the Mixing Time?",
      "How I Improved My Memory in One Evening",
    ],
    isActive: true,
  },
  {
    name: "Question of Insecurity",
    category: "insecurity",
    template: "Do You Make These {adjective} Mistakes in {topic}?",
    description: "Targets a hidden pain point or fear of social judgment. Forces the reader to self-identify.",
    psychology: "Questions about mistakes trigger self-doubt and curiosity about the answer.",
    inputFields: [
      { name: "adjective", label: "Adjective", placeholder: "e.g., Embarrassing, Common, Costly", type: "text" },
      { name: "topic", label: "Topic or Context", placeholder: "e.g., English, Marketing, Parenting", type: "text" },
    ],
    examples: [
      "Do You Make These Mistakes in English?",
      "Are You Ever Tongue-Tied at a Party?",
      "Have You Got These Symptoms of Nerve Exhaustion?",
      "Does Your Child Ever Embarrass You?",
    ],
    isActive: true,
  },
  {
    name: "Who Else / Secret Discovery",
    category: "secret_discovery",
    template: "Who Else Wants {benefit}?",
    description: "Creates exclusivity and curiosity. Implies that 'others' know something the reader doesn't.",
    psychology: "Social proof and curiosity gap make readers want to know what others know.",
    inputFields: [
      { name: "benefit", label: "Highly Desirable Benefit", placeholder: "e.g., a Screen Star Figure", type: "text" },
      { name: "painPoint", label: "Common Pain Point (optional)", placeholder: "e.g., Without Dieting", type: "text" },
    ],
    examples: [
      "The Secret of Making People Like You",
      "Who Else Wants a Screen Star Figure?",
      "Discover the Fortune That Lies Hidden in Your Salary",
      "Thousands Have This Priceless Gift—But Never Discover It!",
    ],
    isActive: true,
  },
  {
    name: "Story of Transformation",
    category: "transformation",
    template: "How a {persona} {overcame} to {achieve}",
    description: "Uses narrative arc. If they (a fool, a plain girl, a barber) could do it, so can you.",
    psychology: "Underdog stories create relatability and belief that success is achievable.",
    inputFields: [
      { name: "persona", label: "Unlikely Persona", placeholder: "e.g., Busy Mom, Complete Newbie, Former Barber", type: "text" },
      { name: "overcame", label: "Obstacle or Skepticism", placeholder: "e.g., Overcame Skepticism, Started with Nothing", type: "text" },
      { name: "achieve", label: "Great Result", placeholder: "e.g., Earn $8,000 in 4 Months", type: "text" },
    ],
    examples: [
      "How I Made a Fortune with a 'Fool Idea'",
      "How a 'Fool Stunt' Made Me a Star Salesman",
      "They Laughed When I Sat Down at the Piano – But When I Began to Play!",
      "Former Barber Earns $8,000 in Four Months as a Real Estate Specialist",
    ],
    isActive: true,
  },
  {
    name: "Warning / Cost of Inaction",
    category: "warning",
    template: "The {mistake} That Is Costing You {loss} Every Year",
    description: "Loss aversion. People are more motivated to avoid losing money/status than gaining it.",
    psychology: "Fear of loss is a stronger motivator than the promise of gain.",
    inputFields: [
      { name: "mistake", label: "Small Mistake or Hidden Cost", placeholder: "e.g., Little Leaks, Worker Tension", type: "text" },
      { name: "loss", label: "Big Loss", placeholder: "e.g., $3,000 a Year, Your Health", type: "text" },
    ],
    examples: [
      "A Little Mistake That Cost a Farmer $3,000 a Year",
      "Why Some Foods Explode in Your Stomach",
      "Is the Life of a Child Worth $1 to You?",
      "Little Leaks That Keep Men Poor",
      "How Much Is 'Worker Tension' Costing Your Company?",
    ],
    isActive: true,
  },
  {
    name: "Direct Command / Challenge",
    category: "command",
    template: "Stop Using {oldMethod}! Try {newSolution} Instead.",
    description: "Asserts authority and cuts through noise. Good for strong offers.",
    psychology: "Direct commands create urgency and position you as an authority.",
    inputFields: [
      { name: "oldMethod", label: "Outdated Tool or Method", placeholder: "e.g., Your Oars, Traditional Marketing", type: "text" },
      { name: "newSolution", label: "New Solution", placeholder: "e.g., This Sensation, AI-Powered Tool", type: "text" },
    ],
    examples: [
      "Throw Away Your Oars!",
      "Buy No Desk – Until You've Seen This Sensation",
      "Check the Kind of Body You Want",
      "Don't Let Athletes Foot 'Lay You Up'",
    ],
    isActive: true,
  },
  {
    name: "Specific Number / List",
    category: "list",
    template: "{number} Proven Ways to {benefit}",
    description: "Promises organized, digestible value. The brain loves lists because they feel complete.",
    psychology: "Specific numbers promise concrete, organized value that feels achievable.",
    inputFields: [
      { name: "number", label: "Specific Number (odd works best)", placeholder: "e.g., 7, 17, 76", type: "number" },
      { name: "benefit", label: "Benefit or Category", placeholder: "e.g., a Man's Heart, Overcome Skin Troubles", type: "text" },
      { name: "painPoint", label: "Without Pain Point (optional)", placeholder: "e.g., Without Dieting", type: "text" },
    ],
    examples: [
      "Five Familiar Skin Troubles – Which Do You Want to Overcome?",
      "161 New Ways to a Man's Heart",
      "Six Types of Investors – Which Group Are You?",
      "76 Reasons Why It Would Have Paid You to Answer Our Ad",
    ],
    isActive: true,
  },
  {
    name: "Curiosity Gap",
    category: "curiosity",
    template: "The Secret About {topic} That {authority} Don't Want You to Know",
    description: "Creates information gap that the brain feels compelled to fill.",
    psychology: "Curiosity gaps create an irresistible urge to close the information gap.",
    inputFields: [
      { name: "topic", label: "Topic or Subject", placeholder: "e.g., Weight Loss, Investing", type: "text" },
      { name: "authority", label: "Authority or Group", placeholder: "e.g., Doctors, Experts, Gurus", type: "text" },
    ],
    examples: [
      "The Secret About Weight Loss That Doctors Don't Want You to Know",
      "What Your Financial Advisor Isn't Telling You",
      "The Truth About [Industry] That [Experts] Hide",
    ],
    isActive: true,
  },
  {
    name: "Social Proof / Bandwagon",
    category: "social_proof",
    template: "{number} People Are Already {action} – Shouldn't You?",
    description: "Leverages the fear of missing out and the desire to fit in.",
    psychology: "Social proof validates decisions and creates FOMO (fear of missing out).",
    inputFields: [
      { name: "number", label: "Number of People", placeholder: "e.g., 10,000, 50,000", type: "text" },
      { name: "action", label: "Action or Benefit", placeholder: "e.g., Using This, Making Money, Getting Results", type: "text" },
    ],
    examples: [
      "10,000 People Are Already Using This – Shouldn't You?",
      "Join 5,000+ Smart Marketers Who Are Already Winning",
      "See Why 25,000+ People Made the Switch",
    ],
    isActive: true,
  },
  {
    name: "Comparison / Better Than",
    category: "comparison",
    template: "Why {yourSolution} Is Better Than {competitor} for {audience}",
    description: "Directly positions your solution as superior to alternatives.",
    psychology: "Comparisons help readers make quick decisions by highlighting advantages.",
    inputFields: [
      { name: "yourSolution", label: "Your Solution", placeholder: "e.g., Our Tool, This Method", type: "text" },
      { name: "competitor", label: "Competitor or Alternative", placeholder: "e.g., Traditional Methods, Competitors", type: "text" },
      { name: "audience", label: "Target Audience", placeholder: "e.g., Busy Professionals, Small Businesses", type: "text" },
    ],
    examples: [
      "Why Our Tool Is Better Than Traditional Marketing for Small Businesses",
      "Why This Method Beats Competitors for Busy Entrepreneurs",
      "See How We Outperform [Alternative] for [Audience]",
    ],
    isActive: true,
  },
  {
    name: "Testimonial / Quote Style",
    category: "social_proof",
    template: "\"{quote}\" – {person}, {title}",
    description: "Uses direct quotes to build credibility and authenticity.",
    psychology: "Quotes feel authentic and personal, building trust through social proof.",
    inputFields: [
      { name: "quote", label: "Impactful Quote", placeholder: "e.g., This Changed My Life", type: "text" },
      { name: "person", label: "Person's Name", placeholder: "e.g., Sarah Johnson", type: "text" },
      { name: "title", label: "Title or Role", placeholder: "e.g., CEO, Marketing Director", type: "text" },
    ],
    examples: [
      "\"This Changed My Life\" – Sarah Johnson, CEO",
      "\"I Doubled My Revenue in 30 Days\" – Mike Chen, Entrepreneur",
      "\"The Best Investment I Ever Made\" – Lisa Park, Small Business Owner",
    ],
    isActive: true,
  },
];

export const HeadlineBuilder: React.FC = () => {
  const [patterns, setPatterns] = useState<HeadlinePattern[]>(DEFAULT_PATTERNS);
  const [selectedPattern, setSelectedPattern] = useState<HeadlinePattern | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [generatedHeadline, setGeneratedHeadline] = useState<string>("");
  const [savedHeadlines, setSavedHeadlines] = useState<GeneratedHeadline[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPowerWords, setShowPowerWords] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showExamples, setShowExamples] = useState(false);

  useEffect(() => {
    fetchSavedHeadlines();
  }, []);

  const fetchSavedHeadlines = async () => {
    try {
      const response = await fetch("/api/admin/click-campaigns/headlines?type=generated");
      const data = await response.json();
      if (data.success) {
        setSavedHeadlines(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch saved headlines:", error);
    }
  };

  const generateHeadline = () => {
    if (!selectedPattern) return;

    let headline = selectedPattern.template;
    Object.keys(inputs).forEach(key => {
      const value = inputs[key];
      if (value) {
        headline = headline.replace(`{${key}}`, value);
      }
    });

    setGeneratedHeadline(headline);
  };

  const applyPowerWord = (word: string, fieldType: string) => {
    const inputField = selectedPattern?.inputFields.find(f => f.name === fieldType);
    if (!inputField) return;

    const currentValue = inputs[fieldType] || "";
    const words = currentValue.split(" ");
    const lastWord = words[words.length - 1];

    if (POWER_WORDS.generic[lastWord as keyof typeof POWER_WORDS.generic]) {
      const replacements = POWER_WORDS.generic[lastWord as keyof typeof POWER_WORDS.generic];
      const randomReplacement = replacements[Math.floor(Math.random() * replacements.length)];
      words[words.length - 1] = randomReplacement;
      setInputs({ ...inputs, [fieldType]: words.join(" ") });
    } else if (POWER_WORDS.emotional[lastWord as keyof typeof POWER_WORDS.emotional]) {
      const replacements = POWER_WORDS.emotional[lastWord as keyof typeof POWER_WORDS.emotional];
      const randomReplacement = replacements[Math.floor(Math.random() * replacements.length)];
      words[words.length - 1] = randomReplacement;
      setInputs({ ...inputs, [fieldType]: words.join(" ") });
    }
  };

  const saveHeadline = async () => {
    if (!generatedHeadline || !selectedPattern) return;

    try {
      setLoading(true);
      const response = await fetch("/api/admin/click-campaigns/headlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "generated",
          patternId: selectedPattern._id || selectedPattern.name,
          patternName: selectedPattern.name,
          headline: generatedHeadline,
          inputs,
          isSaved: true,
          tags: [selectedPattern.category],
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchSavedHeadlines();
        alert("Headline saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save headline:", error);
      alert("Failed to save headline");
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredPatterns = patterns.filter(pattern => {
    const matchesCategory = selectedCategory === "all" || pattern.category === selectedCategory;
    const matchesSearch = pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pattern.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && pattern.isActive;
  });

  const categories = [
    { value: "all", label: "All Patterns" },
    { value: "promise_timeframe", label: "Promise + Timeframe" },
    { value: "insecurity", label: "Insecurity" },
    { value: "secret_discovery", label: "Secret Discovery" },
    { value: "transformation", label: "Transformation" },
    { value: "warning", label: "Warning" },
    { value: "command", label: "Command" },
    { value: "list", label: "List" },
    { value: "curiosity", label: "Curiosity" },
    { value: "social_proof", label: "Social Proof" },
    { value: "comparison", label: "Comparison" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-slate-100">Headline Builder</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate high-converting headlines using proven psychological patterns
          </p>
        </div>

        <button
          onClick={() => setShowPowerWords(!showPowerWords)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-purple-600/20"
        >
          <Wand2 className="w-4 h-4" /> {showPowerWords ? "Hide" : "Show"} Power Words
        </button>
      </div>

      {showPowerWords && (
        <div className="bg-gradient-to-r from-purple-950/50 to-pink-950/50 border border-purple-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="w-5 h-5 text-purple-400" />
            <h4 className="text-sm font-bold text-slate-100">Power Word Injector</h4>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Replace generic words with high-emotion power words to increase headline impact.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h5 className="text-xs font-semibold text-slate-300 mb-2">Generic → Power</h5>
              <div className="space-y-1">
                {Object.entries(POWER_WORDS.generic).slice(0, 5).map(([generic, powers]) => (
                  <div key={generic} className="text-[10px] text-slate-400">
                    <span className="text-slate-500">{generic}</span> → <span className="text-purple-300">{powers.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-slate-300 mb-2">Emotional Boosters</h5>
              <div className="space-y-1">
                {Object.entries(POWER_WORDS.emotional).slice(0, 5).map(([generic, powers]) => (
                  <div key={generic} className="text-[10px] text-slate-400">
                    <span className="text-slate-500">{generic}</span> → <span className="text-pink-300">{powers.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-slate-300 mb-2">Urgency Words</h5>
              <div className="space-y-1">
                {Object.entries(POWER_WORDS.urgency).slice(0, 5).map(([generic, powers]) => (
                  <div key={generic} className="text-[10px] text-slate-400">
                    <span className="text-slate-500">{generic}</span> → <span className="text-blue-300">{powers.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-100">Choose a Pattern</h4>
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
              >
                <BookOpen className="w-3 h-3" /> {showExamples ? "Hide" : "Show"} Examples
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search patterns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredPatterns.map((pattern) => (
                <div
                  key={pattern.name}
                  onClick={() => {
                    setSelectedPattern(pattern);
                    setInputs({});
                    setGeneratedHeadline("");
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedPattern?.name === pattern.name
                      ? "bg-purple-950 border border-purple-700"
                      : "bg-slate-950 border border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="text-xs font-bold text-slate-100 mb-1">{pattern.name}</h5>
                      <p className="text-[10px] text-slate-400 line-clamp-2">{pattern.description}</p>
                    </div>
                    <Lightbulb className="w-4 h-4 text-purple-400 flex-shrink-0 ml-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedPattern && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-bold text-slate-100">Fill in the Blanks</h4>
              </div>

              <div className="space-y-3">
                {selectedPattern.inputFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">{field.label}</label>
                    <div className="flex gap-2">
                      <input
                        type={field.type}
                        value={inputs[field.name] || ""}
                        onChange={(e) => setInputs({ ...inputs, [field.name]: e.target.value })}
                        placeholder={field.placeholder}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                      />
                      {showPowerWords && (
                        <button
                          onClick={() => applyPowerWord(inputs[field.name] || "", field.name)}
                          className="px-3 py-2 bg-purple-950 border border-purple-700 rounded-lg hover:bg-purple-900 transition"
                          title="Apply power word"
                        >
                          <Wand2 className="w-4 h-4 text-purple-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  onClick={generateHeadline}
                  disabled={Object.keys(inputs).length === 0 || Object.values(inputs).every(v => !v)}
                  className="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Generate Headline
                </button>
              </div>
            </div>
          )}

          {selectedPattern && showExamples && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-bold text-slate-100">Examples</h4>
              </div>
              <div className="space-y-2">
                {selectedPattern.examples.map((example, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                    <p className="text-xs text-slate-300 italic">"{example}"</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-blue-950/30 border border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] font-semibold text-blue-300">Psychology</span>
                </div>
                <p className="text-[10px] text-slate-400">{selectedPattern.psychology}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {generatedHeadline && (
            <div className="bg-gradient-to-br from-purple-950/50 to-pink-950/50 border border-purple-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h4 className="text-sm font-bold text-slate-100">Generated Headline</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(generatedHeadline)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </button>
                  <button
                    onClick={saveHeadline}
                    disabled={loading}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
                  >
                    {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Save
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 mb-4">
                <p className="text-lg font-bold text-slate-100 text-center">{generatedHeadline}</p>
              </div>

              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] text-slate-400">Pattern: {selectedPattern?.name}</span>
              </div>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-slate-100">Saved Headlines</h4>
              </div>
              <span className="text-[10px] text-slate-500">{savedHeadlines.length} saved</span>
            </div>

            {savedHeadlines.length === 0 ? (
              <div className="text-center py-8">
                <Save className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No saved headlines yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {savedHeadlines.map((headline) => (
                  <div key={headline._id} className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-xs font-semibold text-slate-100 flex-1">{headline.headline}</p>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => copyToClipboard(headline.headline)}
                          className="p-1 hover:bg-slate-800 rounded transition"
                        >
                          <Copy className="w-3 h-3 text-slate-400" />
                        </button>
                        <button
                          onClick={() => deleteHeadline(headline._id!)}
                          className="p-1 hover:bg-slate-800 rounded transition"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded-md text-[10px]">
                        {headline.patternName}
                      </span>
                      {headline.createdAt && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
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
      </div>
    </div>
  );
};
