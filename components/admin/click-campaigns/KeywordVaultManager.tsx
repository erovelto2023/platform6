"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Plus,
  Sparkles,
  Search,
  Download,
  Tag,
  TrendingUp,
  DollarSign,
  Layers,
  FileText,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Filter,
  ShieldAlert,
  FolderPlus,
  ArrowUpRight,
  Copy
} from "lucide-react";

export interface KeywordVaultItem {
  id: string;
  keyword: string;
  matchType: "Exact" | "Phrase" | "Broad";
  intent: "Transactional" | "Commercial" | "Informational" | "Navigational";
  funnelStage: "BOFU" | "MOFU" | "TOFU";
  adGroup: string;
  monthlyVolume: number;
  estimatedCpc: number;
  difficulty: number;
  relatedKeywords: string[];
  associatedHeadlines: string[];
  associatedAdCopy: string[];
  negativeKeywords: string[];
}

const defaultKeywords: KeywordVaultItem[] = [
  {
    id: "kw1",
    keyword: "affiliate campaign management software",
    matchType: "Phrase",
    intent: "Transactional",
    funnelStage: "BOFU",
    adGroup: "Campaign Software",
    monthlyVolume: 3400,
    estimatedCpc: 2.85,
    difficulty: 52,
    relatedKeywords: [
      "affiliate marketing dashboard",
      "multi channel ad manager",
      "campaign builder tool",
    ],
    associatedHeadlines: [
      "Stop Tool Fatigue - Best Affiliate Campaign Software",
      "Launch High ROAS Campaigns in 10 Minutes",
    ],
    associatedAdCopy: [
      "All-in-one media asset vault, swipe copy manager, and automated aspect ratio checking in 1 dashboard.",
    ],
    negativeKeywords: ["free cracked download", "null script", "gpl download"],
  },
  {
    id: "kw2",
    keyword: "meta ad specs aspect ratios 2026",
    matchType: "Exact",
    intent: "Informational",
    funnelStage: "TOFU",
    adGroup: "Ad Specs & Ratios",
    monthlyVolume: 5600,
    estimatedCpc: 1.2,
    difficulty: 38,
    relatedKeywords: [
      "facebook ad dimensions 2026",
      "instagram story 9:16 aspect ratio",
      "pinterest pin canvas size",
    ],
    associatedHeadlines: [
      "Never Post Broken Aspect Ratio Ads Again",
      "Instant 1:1, 2:3, 9:16 Visual Spec Matrix",
    ],
    associatedAdCopy: [
      "Auto-detect image sizes before budget bleeds on unoptimized Facebook & Pinterest pins.",
    ],
    negativeKeywords: ["job openings", "career", "salary"],
  },
  {
    id: "kw3",
    keyword: "best high CTR pinterest pin templates",
    matchType: "Phrase",
    intent: "Commercial",
    funnelStage: "MOFU",
    adGroup: "Pinterest Scaling",
    monthlyVolume: 2900,
    estimatedCpc: 1.65,
    difficulty: 41,
    relatedKeywords: [
      "pinterest idea pin graphics",
      "vertical 2:3 canvas templates",
      "pinterest ad copywriting",
    ],
    associatedHeadlines: [
      "Boost Pinterest CTR by 3.8x with Vertical 2:3 Pins",
    ],
    associatedAdCopy: [
      "Pre-formatted 2:3 vertical templates with high contrast text overlays for maximum organic reach.",
    ],
    negativeKeywords: ["free psd", "vector png"],
  },
];

const defaultGlobalNegatives = [
  "free download",
  "cracked",
  "null script",
  "torrent",
  "jobs",
  "salary",
  "login",
  "scam",
  "reddit",
];

interface KeywordVaultManagerProps {
  onSelectKeywordForCampaign?: (kw: KeywordVaultItem) => void;
}

export const KeywordVaultManager: React.FC<KeywordVaultManagerProps> = ({
  onSelectKeywordForCampaign,
}) => {
  const [keywords, setKeywords] = useState<KeywordVaultItem[]>(defaultKeywords);
  const [globalNegatives, setGlobalNegatives] = useState<string[]>(defaultGlobalNegatives);
  const [newNegativeInput, setNewNegativeInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [matchFilter, setMatchFilter] = useState<string>("All");
  const [intentFilter, setIntentFilter] = useState<string>("All");

  // Selection & Edit Modals
  const [selectedKwDetail, setSelectedKwDetail] = useState<KeywordVaultItem | null>(null);
  const [editingKw, setEditingKw] = useState<KeywordVaultItem | null>(null);
  const [editRelatedInput, setEditRelatedInput] = useState<string>("");
  const [editHeadlineInput, setEditHeadlineInput] = useState<string>("");
  const [editNegativeInput, setEditNegativeInput] = useState<string>("");

  // Copy Feedback States
  const [copiedCommaStatus, setCopiedCommaStatus] = useState<boolean>(false);
  const [copiedNegativesStatus, setCopiedNegativesStatus] = useState<boolean>(false);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showNegativeModal, setShowNegativeModal] = useState<boolean>(false);
  const [seedKeyword, setSeedKeyword] = useState<string>("");
  const [isExpanding, setIsExpanding] = useState<boolean>(false);

  // New Keyword Form
  const [newKw, setNewKw] = useState<Omit<KeywordVaultItem, "id">>({
    keyword: "",
    matchType: "Phrase",
    intent: "Transactional",
    funnelStage: "BOFU",
    adGroup: "General Campaign",
    monthlyVolume: 1500,
    estimatedCpc: 1.5,
    difficulty: 40,
    relatedKeywords: [],
    associatedHeadlines: [],
    associatedAdCopy: [],
    negativeKeywords: [],
  });

  const [relatedInput, setRelatedInput] = useState<string>("");
  const [headlineInput, setHeadlineInput] = useState<string>("");
  const [copyInput, setCopyInput] = useState<string>("");
  const [negativeKwInput, setNegativeKwInput] = useState<string>("");

  const handleAddRelated = () => {
    if (!relatedInput) return;
    const parsed = relatedInput.split(/,|\n/).map((s) => s.trim()).filter(Boolean);
    setNewKw((prev) => ({
      ...prev,
      relatedKeywords: Array.from(new Set([...prev.relatedKeywords, ...parsed])),
    }));
    setRelatedInput("");
  };

  const handleAddHeadline = () => {
    if (!headlineInput) return;
    const parsed = headlineInput.split(/,|\n/).map((s) => s.trim()).filter(Boolean);
    setNewKw((prev) => ({
      ...prev,
      associatedHeadlines: Array.from(new Set([...prev.associatedHeadlines, ...parsed])),
    }));
    setHeadlineInput("");
  };

  const handleAddNegativeKw = () => {
    if (!negativeKwInput) return;
    const parsed = negativeKwInput.split(/,|\n/).map((s) => s.trim()).filter(Boolean);
    setNewKw((prev) => ({
      ...prev,
      negativeKeywords: Array.from(new Set([...prev.negativeKeywords, ...parsed])),
    }));
    setNegativeKwInput("");
  };

  const handleSaveKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKw.keyword) return;

    const parsedKeywords = newKw.keyword
      .split(/,|\n/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const createdItems: KeywordVaultItem[] = parsedKeywords.map((kwStr, idx) => ({
      ...newKw,
      keyword: kwStr,
      id: `kw_${Date.now()}_${idx}`,
    }));

    setKeywords((prev) => [...createdItems, ...prev]);
    setShowAddModal(false);
    setNewKw({
      keyword: "",
      matchType: "Phrase",
      intent: "Transactional",
      funnelStage: "BOFU",
      adGroup: "General Campaign",
      monthlyVolume: 1500,
      estimatedCpc: 1.5,
      difficulty: 40,
      relatedKeywords: [],
      associatedHeadlines: [],
      associatedAdCopy: [],
      negativeKeywords: [],
    });
  };

  // EDIT KEYWORD HANDLERS
  const handleUpdateEditingKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKw) return;

    setKeywords((prev) =>
      prev.map((k) => (k.id === editingKw.id ? editingKw : k))
    );
    if (selectedKwDetail?.id === editingKw.id) {
      setSelectedKwDetail(editingKw);
    }
    setEditingKw(null);
  };

  const handleAddEditRelated = () => {
    if (!editRelatedInput || !editingKw) return;
    const parsed = editRelatedInput.split(/,|\n/).map((s) => s.trim()).filter(Boolean);
    setEditingKw((prev) => prev ? ({
      ...prev,
      relatedKeywords: Array.from(new Set([...prev.relatedKeywords, ...parsed])),
    }) : null);
    setEditRelatedInput("");
  };

  const handleRemoveEditRelated = (term: string) => {
    if (!editingKw) return;
    setEditingKw((prev) => prev ? ({
      ...prev,
      relatedKeywords: prev.relatedKeywords.filter((r) => r !== term),
    }) : null);
  };

  const handleAddEditNegative = () => {
    if (!editNegativeInput || !editingKw) return;
    const parsed = editNegativeInput.split(/,|\n/).map((s) => s.trim()).filter(Boolean);
    setEditingKw((prev) => prev ? ({
      ...prev,
      negativeKeywords: Array.from(new Set([...prev.negativeKeywords, ...parsed])),
    }) : null);
    setEditNegativeInput("");
  };

  const handleRemoveEditNegative = (term: string) => {
    if (!editingKw) return;
    setEditingKw((prev) => prev ? ({
      ...prev,
      negativeKeywords: prev.negativeKeywords.filter((n) => n !== term),
    }) : null);
  };

  const handleAddEditHeadline = () => {
    if (!editHeadlineInput || !editingKw) return;
    const parsed = editHeadlineInput.split(/,|\n/).map((s) => s.trim()).filter(Boolean);
    setEditingKw((prev) => prev ? ({
      ...prev,
      associatedHeadlines: Array.from(new Set([...prev.associatedHeadlines, ...parsed])),
    }) : null);
    setEditHeadlineInput("");
  };

  const handleRemoveEditHeadline = (headline: string) => {
    if (!editingKw) return;
    setEditingKw((prev) => prev ? ({
      ...prev,
      associatedHeadlines: prev.associatedHeadlines.filter((h) => h !== headline),
    }) : null);
  };

  const handleDeleteKeyword = (id: string) => {
    setKeywords((prev) => prev.filter((k) => k.id !== id));
    if (selectedKwDetail?.id === id) setSelectedKwDetail(null);
    if (editingKw?.id === id) setEditingKw(null);
  };

  const handleAddGlobalNegative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNegativeInput) return;

    const parsedNegatives = newNegativeInput
      .split(/,|\n/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    setGlobalNegatives((prev) => Array.from(new Set([...prev, ...parsedNegatives])));
    setNewNegativeInput("");
  };

  const handleRemoveGlobalNegative = (term: string) => {
    setGlobalNegatives((prev) => prev.filter((t) => t !== term));
  };

  const handleCopyCommaKeywords = () => {
    const allTerms: string[] = [];
    filteredKeywords.forEach((k) => {
      if (k.keyword) allTerms.push(k.keyword);
      if (k.relatedKeywords) allTerms.push(...k.relatedKeywords);
    });

    const uniqueCommaList = Array.from(new Set(allTerms)).join(", ");
    navigator.clipboard.writeText(uniqueCommaList);
    setCopiedCommaStatus(true);
    setTimeout(() => setCopiedCommaStatus(false), 2000);
  };

  const handleCopyCommaNegatives = () => {
    const commaNegatives = globalNegatives.join(", ");
    navigator.clipboard.writeText(commaNegatives);
    setCopiedNegativesStatus(true);
    setTimeout(() => setCopiedNegativesStatus(false), 2000);
  };

  const handleCopyItemKeywords = (item: KeywordVaultItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const itemTerms = [item.keyword, ...(item.relatedKeywords || [])].join(", ");
    navigator.clipboard.writeText(itemTerms);
    setCopiedItemId(item.id);
    setTimeout(() => setCopiedItemId(null), 2000);
  };

  const handleAiExpandKeyword = () => {
    if (!seedKeyword) return;
    setIsExpanding(true);
    setTimeout(() => {
      const generatedVariations: KeywordVaultItem[] = [
        {
          id: `kw_${Date.now()}_1`,
          keyword: `best ${seedKeyword} for online marketers`,
          matchType: "Phrase",
          intent: "Commercial",
          funnelStage: "MOFU",
          adGroup: `${seedKeyword} High Intent`,
          monthlyVolume: 4200,
          estimatedCpc: 2.1,
          difficulty: 44,
          relatedKeywords: [
            `${seedKeyword} software review`,
            `${seedKeyword} pricing plan`,
            `top alternatives to ${seedKeyword}`,
          ],
          associatedHeadlines: [
            `Top Rated ${seedKeyword} - Launch in Minutes`,
            `Maximize Sales with ${seedKeyword}`,
          ],
          associatedAdCopy: [
            `Consolidated campaign workspace built specifically for ${seedKeyword} optimization.`,
          ],
          negativeKeywords: ["free torrent", "cracked download", "nulled"],
        },
        {
          id: `kw_${Date.now()}_2`,
          keyword: `how to scale ${seedKeyword}`,
          matchType: "Broad",
          intent: "Informational",
          funnelStage: "TOFU",
          adGroup: `${seedKeyword} Guides`,
          monthlyVolume: 6100,
          estimatedCpc: 1.45,
          difficulty: 35,
          relatedKeywords: [
            `${seedKeyword} strategy guide`,
            `${seedKeyword} masterclass 2026`,
          ],
          associatedHeadlines: [
            `Step-by-Step Guide to ${seedKeyword}`,
          ],
          associatedAdCopy: [
            `Learn how top media buyers scale high ROAS ad campaigns effortlessly.`,
          ],
          negativeKeywords: ["job openings"],
        },
      ];

      setGlobalNegatives((prev) => Array.from(new Set([...prev, `${seedKeyword} torrent`, `${seedKeyword} free download`])));
      setKeywords((prev) => [...generatedVariations, ...prev]);
      setIsExpanding(false);
      setSeedKeyword("");
    }, 1200);
  };

  const handleExportCsv = () => {
    const headers = [
      "Keyword",
      "Match Type",
      "Intent",
      "Funnel Stage",
      "Ad Group",
      "Monthly Volume",
      "Est. CPC",
      "Related Keywords",
      "Negative Keywords",
      "Headlines",
      "Ad Copy",
    ];
    const rows = keywords.map((k) => [
      `"${k.keyword}"`,
      k.matchType,
      k.intent,
      k.funnelStage,
      `"${k.adGroup}"`,
      k.monthlyVolume,
      `$${k.estimatedCpc}`,
      `"${(k.relatedKeywords || []).join(" | ")}"`,
      `"${(k.negativeKeywords || []).join(" | ")}"`,
      `"${(k.associatedHeadlines || []).join(" | ")}"`,
      `"${(k.associatedAdCopy || []).join(" | ")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Campaign_Keywords_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredKeywords = keywords.filter((k) => {
    const matchesSearch = k.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.adGroup?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMatch = matchFilter === "All" || k.matchType === matchFilter;
    const matchesIntent = intentFilter === "All" || k.intent === intentFilter;
    return matchesSearch && matchesMatch && matchesIntent;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-2xl">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Keyword & Search Intent Command Vault</h2>
              <p className="text-xs text-slate-400">
                Track, edit, and organize keywords, copy comma-separated lists for YouTube/Google Ads, and manage negative exclusions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopyCommaKeywords}
            className="px-4 py-2.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 rounded-2xl text-xs font-bold flex items-center gap-2 transition"
          >
            {copiedCommaStatus ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-yellow-400" />}
            {copiedCommaStatus ? "Copied Comma List!" : "Copy Comma-Separated Keywords"}
          </button>

          <button
            onClick={() => setShowNegativeModal(true)}
            className="px-4 py-2.5 bg-red-950/60 border border-red-800 hover:bg-red-900 text-red-300 rounded-2xl text-xs font-bold flex items-center gap-2 transition"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" /> Negative Keywords ({globalNegatives.length})
          </button>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-2xl text-xs font-bold flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Export CSV
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition shadow-lg shadow-yellow-500/20"
          >
            <Plus className="w-4 h-4" /> Add Keyword & Ad Mapping
          </button>
        </div>
      </div>

      {/* AI Expansion Generator Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
          <span className="text-xs font-bold text-slate-200">AI Keyword & Negative Expander:</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:flex-1">
          <input
            type="text"
            placeholder="Enter seed topic (e.g. affiliate tools, SaaS funnel)..."
            value={seedKeyword}
            onChange={(e) => setSeedKeyword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            onClick={handleAiExpandKeyword}
            disabled={isExpanding || !seedKeyword}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-slate-950 rounded-xl text-xs font-extrabold whitespace-nowrap transition"
          >
            {isExpanding ? "Expanding..." : "✨ Expand Keywords & Exclusions"}
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords or ad groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Match:</span>
            <select
              value={matchFilter}
              onChange={(e) => setMatchFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
            >
              <option value="All">All Match Types</option>
              <option value="Exact">Exact [Keyword]</option>
              <option value="Phrase">Phrase "Keyword"</option>
              <option value="Broad">Broad Keyword</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Intent:</span>
            <select
              value={intentFilter}
              onChange={(e) => setIntentFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
            >
              <option value="All">All Intents</option>
              <option value="Transactional">Transactional</option>
              <option value="Commercial">Commercial</option>
              <option value="Informational">Informational</option>
            </select>
          </div>
        </div>
      </div>

      {/* Keywords Table / Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl divide-y divide-slate-800/80">
        {filteredKeywords.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedKwDetail(item)}
            className="p-5 hover:bg-slate-800/30 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-slate-100 font-mono">
                  {item.matchType === "Exact" ? `[${item.keyword}]` : item.matchType === "Phrase" ? `"${item.keyword}"` : item.keyword}
                </span>
                <span className="px-2.5 py-0.5 bg-yellow-950 text-yellow-300 border border-yellow-800/60 rounded-full text-[10px] font-extrabold">
                  {item.matchType} Match
                </span>
                <span className="px-2.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-800/60 rounded-full text-[10px] font-bold">
                  {item.intent} Intent ({item.funnelStage})
                </span>
                <span className="px-2 py-0.5 bg-slate-950 text-indigo-300 border border-slate-800 rounded text-[10px] font-bold">
                  Group: {item.adGroup}
                </span>
              </div>

              {item.relatedKeywords?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 font-semibold">Related:</span>
                  {item.relatedKeywords.map((rel, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-950 text-slate-300 border border-slate-800 rounded text-[10px]">
                      ~ {rel}
                    </span>
                  ))}
                </div>
              )}

              {item.associatedHeadlines?.length > 0 && (
                <div className="text-xs text-slate-300 flex items-center gap-2 pt-0.5">
                  <span className="text-slate-500 font-semibold">Mapped Headline:</span>
                  <span className="text-emerald-400 font-medium">"{item.associatedHeadlines[0]}"</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right text-xs space-y-0.5 pr-2">
                <div className="text-slate-400">Vol: <strong className="text-slate-100">{item.monthlyVolume.toLocaleString()}/mo</strong></div>
                <div className="text-slate-400">Est CPC: <strong className="text-emerald-400">${item.estimatedCpc}</strong></div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingKw({ ...item });
                }}
                className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-slate-800 rounded-xl transition"
                title="Edit Keyword & Mappings"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => handleCopyItemKeywords(item, e)}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                title="Copy keyword & related synonyms as comma-separated text"
              >
                {copiedItemId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedItemId === item.id ? "Copied!" : "Copy Tags"}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteKeyword(item.id);
                }}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-xl transition"
                title="Delete Keyword"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT KEYWORD MODAL */}
      {editingKw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-yellow-400" /> Edit Target Keyword & Ad Group
              </h3>
              <button onClick={() => setEditingKw(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateEditingKeyword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Target Keyword Phrase
                  </label>
                  <input
                    type="text"
                    required
                    value={editingKw.keyword}
                    onChange={(e) => setEditingKw({ ...editingKw, keyword: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-yellow-500 rounded-xl px-3 py-2 text-sm text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Ad Group Name</label>
                  <input
                    type="text"
                    value={editingKw.adGroup}
                    onChange={(e) => setEditingKw({ ...editingKw, adGroup: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Match Type</label>
                  <select
                    value={editingKw.matchType}
                    onChange={(e) => setEditingKw({ ...editingKw, matchType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="Phrase">Phrase "kw"</option>
                    <option value="Exact">Exact [kw]</option>
                    <option value="Broad">Broad kw</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Search Intent</label>
                  <select
                    value={editingKw.intent}
                    onChange={(e) => setEditingKw({ ...editingKw, intent: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="Transactional">Transactional</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Informational">Informational</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Funnel Stage</label>
                  <select
                    value={editingKw.funnelStage}
                    onChange={(e) => setEditingKw({ ...editingKw, funnelStage: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="BOFU">BOFU (Bottom)</option>
                    <option value="MOFU">MOFU (Middle)</option>
                    <option value="TOFU">TOFU (Top)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Est Monthly Volume</label>
                  <input
                    type="number"
                    value={editingKw.monthlyVolume}
                    onChange={(e) => setEditingKw({ ...editingKw, monthlyVolume: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Est CPC ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingKw.estimatedCpc}
                    onChange={(e) => setEditingKw({ ...editingKw, estimatedCpc: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>
              </div>

              {/* Edit Related Keywords */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Related Keywords / Synonyms (Paste Comma List to Add)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter related keywords or paste comma list..."
                    value={editRelatedInput}
                    onChange={(e) => setEditRelatedInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddEditRelated}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold shrink-0"
                  >
                    + Add List
                  </button>
                </div>
                {editingKw.relatedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {editingKw.relatedKeywords.map((r, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-950 text-indigo-300 text-xs rounded border border-slate-800 font-medium flex items-center gap-1.5">
                        <span>~ {r}</span>
                        <button type="button" onClick={() => handleRemoveEditRelated(r)} className="text-slate-500 hover:text-red-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Excluded Negative Keywords */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Specific Negative Keywords to Exclude (Paste Comma List to Add)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter negatives to exclude or paste comma list..."
                    value={editNegativeInput}
                    onChange={(e) => setEditNegativeInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddEditNegative}
                    className="px-3.5 py-2 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-xl text-xs font-bold shrink-0"
                  >
                    + Exclude List
                  </button>
                </div>
                {editingKw.negativeKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {editingKw.negativeKeywords.map((neg, i) => (
                      <span key={i} className="px-2.5 py-1 bg-red-950/40 text-red-300 text-xs rounded border border-red-800/40 font-medium flex items-center gap-1.5">
                        <span>- {neg}</span>
                        <button type="button" onClick={() => handleRemoveEditNegative(neg)} className="text-red-400 hover:text-red-300">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Associated Headlines */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Mapped Headlines (Paste Comma List to Add)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter headline or paste comma list..."
                    value={editHeadlineInput}
                    onChange={(e) => setEditHeadlineInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddEditHeadline}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold shrink-0"
                  >
                    + Add List
                  </button>
                </div>
                {editingKw.associatedHeadlines.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {editingKw.associatedHeadlines.map((h, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-950 text-emerald-300 text-xs rounded border border-slate-800 font-medium flex items-center gap-1.5">
                        <span>"{h}"</span>
                        <button type="button" onClick={() => handleRemoveEditHeadline(h)} className="text-slate-500 hover:text-red-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingKw(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-md shadow-yellow-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD KEYWORD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-yellow-400" /> Add Target Keyword & Ad Group Mapping
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKeyword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Main Target Keyword Phrase
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. affiliate campaign management software"
                    value={newKw.keyword}
                    onChange={(e) => setNewKw({ ...newKw, keyword: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-yellow-500 rounded-xl px-3 py-2 text-sm text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Ad Group Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Affiliate Courses & Tools"
                    value={newKw.adGroup}
                    onChange={(e) => setNewKw({ ...newKw, adGroup: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Match Type</label>
                  <select
                    value={newKw.matchType}
                    onChange={(e) => setNewKw({ ...newKw, matchType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="Phrase">Phrase "kw"</option>
                    <option value="Exact">Exact [kw]</option>
                    <option value="Broad">Broad kw</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Search Intent</label>
                  <select
                    value={newKw.intent}
                    onChange={(e) => setNewKw({ ...newKw, intent: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="Transactional">Transactional</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Informational">Informational</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Funnel Stage</label>
                  <select
                    value={newKw.funnelStage}
                    onChange={(e) => setNewKw({ ...newKw, funnelStage: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="BOFU">BOFU (Bottom)</option>
                    <option value="MOFU">MOFU (Middle)</option>
                    <option value="TOFU">TOFU (Top)</option>
                  </select>
                </div>
              </div>

              {/* Related Keywords Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Related Keywords / Synonyms (Paste Comma-Separated List)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste comma list... e.g. affiliate dashboard, multi-channel ad tool, campaign builder"
                    value={relatedInput}
                    onChange={(e) => setRelatedInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddRelated}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold shrink-0"
                  >
                    + Add List
                  </button>
                </div>
                {newKw.relatedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {newKw.relatedKeywords.map((r, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-950 text-indigo-300 text-[11px] rounded border border-slate-800 font-medium">
                        ~ {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Negative Keywords Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Specific Negative Keywords to Exclude (Paste Comma-Separated List)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste comma list... e.g. free, torrent, cracked, null script, GPL"
                    value={negativeKwInput}
                    onChange={(e) => setNegativeKwInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddNegativeKw}
                    className="px-3.5 py-2 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-xl text-xs font-bold shrink-0"
                  >
                    + Exclude List
                  </button>
                </div>
                {newKw.negativeKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {newKw.negativeKeywords.map((neg, i) => (
                      <span key={i} className="px-2 py-1 bg-red-950/40 text-red-300 text-[11px] rounded border border-red-800/40 font-medium">
                        - {neg}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Headlines inline */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Mapped Headlines Using This Keyword (Paste Comma-Separated List)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste comma list... e.g. Stop Tool Fatigue, Launch in 10 Minutes, Best Software"
                    value={headlineInput}
                    onChange={(e) => setHeadlineInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddHeadline}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold shrink-0"
                  >
                    + Add List
                  </button>
                </div>
                {newKw.associatedHeadlines.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {newKw.associatedHeadlines.map((h, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-950 text-emerald-300 text-[11px] rounded border border-slate-800 font-medium">
                        "{h}"
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-md shadow-yellow-500/20"
                >
                  Save Keyword & Ad Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Negative Keywords Manager Modal */}
      {showNegativeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" /> Negative Keywords Vault & Exclusions
              </h3>
              <button onClick={() => setShowNegativeModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Exclude wasted ad spend searches (e.g. free downloads, cracked scripts, jobs) across all campaigns.
            </p>

            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-semibold">Copy Negatives as Comma List for Google Ads:</span>
              <button
                onClick={handleCopyCommaNegatives}
                className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                {copiedNegativesStatus ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedNegativesStatus ? "Copied!" : "Copy Comma List"}
              </button>
            </div>

            <form onSubmit={handleAddGlobalNegative} className="flex gap-2">
              <input
                type="text"
                placeholder="Add negative keyword term..."
                value={newNegativeInput}
                onChange={(e) => setNewNegativeInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shrink-0"
              >
                + Add Negative
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2 max-h-60 overflow-y-auto">
              {globalNegatives.map((term, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-red-950/40 border border-red-800/60 text-red-200 rounded-xl text-xs font-mono font-semibold flex items-center gap-2"
                >
                  <span>- {term}</span>
                  <button onClick={() => handleRemoveGlobalNegative(term)} className="text-red-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowNegativeModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Keyword Detail Modal */}
      {selectedKwDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-mono">
                <KeyRound className="w-5 h-5 text-yellow-400" /> "{selectedKwDetail.keyword}"
              </h3>
              <button onClick={() => setSelectedKwDetail(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl text-center text-xs">
              <div>
                <div className="text-[10px] text-slate-400">Match Type</div>
                <div className="font-bold text-yellow-400">{selectedKwDetail.matchType}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Search Volume</div>
                <div className="font-bold text-slate-100">{selectedKwDetail.monthlyVolume.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Est CPC</div>
                <div className="font-bold text-emerald-400">${selectedKwDetail.estimatedCpc}</div>
              </div>
            </div>

            {selectedKwDetail.relatedKeywords?.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase">Related Keywords & Synonyms</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedKwDetail.relatedKeywords.map((r, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-lg text-xs">
                      ~ {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedKwDetail.negativeKeywords?.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase">Excluded Negative Keywords</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedKwDetail.negativeKeywords.map((neg, i) => (
                    <span key={i} className="px-2.5 py-1 bg-red-950/40 border border-red-800/40 text-red-300 rounded-lg text-xs font-mono">
                      - {neg}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Mapped Headlines</span>
              <div className="space-y-1">
                {selectedKwDetail.associatedHeadlines?.map((h, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-medium">
                    "{h}"
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Mapped Primary Ad Copy</span>
              <div className="space-y-1">
                {selectedKwDetail.associatedAdCopy?.map((c, i) => (
                  <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300">
                    {c}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingKw({ ...selectedKwDetail });
                    setSelectedKwDetail(null);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-yellow-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Edit2 className="w-3.5 h-3.5 text-yellow-400" /> Edit Keyword
                </button>

                <button
                  onClick={(e) => handleCopyItemKeywords(selectedKwDetail, e)}
                  className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {copiedItemId === selectedKwDetail.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-yellow-400" />}
                  {copiedItemId === selectedKwDetail.id ? "Copied!" : "Copy Tags"}
                </button>
              </div>

              <button
                onClick={() => setSelectedKwDetail(null)}
                className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
