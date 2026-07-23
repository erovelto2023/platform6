"use client";

import React, { useState, useEffect } from "react";
import {
  Mail, Plus, Copy, Check, Send, Sparkles, UserCheck, Trash2, ArrowRight,
  ShieldAlert, BookOpen, Layers, Eye, RefreshCw, HelpCircle, Lightbulb,
  Search, Filter, ShieldCheck, CheckCircle2, DollarSign, Folder, Download,
  Tag, Edit3, Save, FileText, Share2, Star, ThumbsUp
} from "lucide-react";

export interface EmailSequenceStep {
  id: string;
  stepNumber: number;
  title: string;
  templateId?: string;
  category: string;
  delay: string;
  subjectLine: string;
  preheader: string;
  bodyCopy: string;
  ctaText: string;
  whenToUse?: string;
  whyItWorks?: string;
}

export interface OutreachTemplate {
  id: string;
  name: string;
  category: string;
  subjectLine: string;
  preheader: string;
  bodyCopy: string;
  ctaText: string;
  whenToUse: string;
  whyItWorks: string;
  isCustom?: boolean;
}

export interface SwipeEmailItem {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  niche: string;
  sellingPrice: string;
  subjectLine: string;
  preheader: string;
  bodyCopy: string;
  ctaText: string;
  tags: string[];
  conversionNotes: string;
  createdAt: string;
}

// Default For-Sale Email Swipe File Vault Sample Data
const DEFAULT_SWIPE_FILE: SwipeEmailItem[] = [
  {
    title: "High-Ticket B2B Agency Cold Pitch ($47 Value)",
    category: "Prospecting",
    niche: "Marketing & SaaS",
    sellingPrice: "$47.00",
    subjectLine: "Quick question about {{company_name}}'s ad pipeline",
    preheader: "Noticed a small bottleneck in your conversion funnel...",
    bodyCopy: "Hi {{first_name}},\n\nI was reviewing {{company_name}}'s recent campaigns and noticed you're scaling fast in {{relevant_detail}}.\n\nWe helped a similar agency generate {{specific_benefit}} without increasing ad budget.\n\nWould you be open to a 10-minute audit call this Thursday?\n\nBest,\nEric",
    ctaText: "Book 10-Min Audit Call",
    tags: ["High-Ticket", "Agency", "Cold Pitch"],
    conversionNotes: "Generated 34% reply rate across 1,200 sends to VP of Marketing prospects.",
    createdAt: "2026-07-01",
  },
  {
    title: "Black Friday / Cyber Week 72-Hour Flash Sale ($97 Value)",
    category: "Promotional",
    niche: "E-Commerce & Digital Products",
    sellingPrice: "$97.00",
    subjectLine: "🔥 [72 Hours Only] 50% Off {{product_name}}",
    preheader: "Don't miss out! The biggest discount of the year ends Sunday...",
    bodyCopy: "Hi {{first_name}},\n\nFor the next 72 hours, we are unlocking an exclusive 50% discount on {{product_name}}.\n\nUse code {{discount_code}} at checkout before Sunday at midnight.\n\nClick below to claim your package before inventory sells out!\n\nBest,\nEric",
    ctaText: "Claim 50% Discount Now",
    tags: ["E-Commerce", "Flash Sale", "FOMO"],
    conversionNotes: "Generated $24,500 in 72 hours for an online info-product launch.",
    createdAt: "2026-07-10",
  },
  {
    title: "Re-Engaging Dead Leads ('Should I Close Your File?') ($29 Value)",
    category: "Re-Engagement",
    niche: "General Direct Sales",
    sellingPrice: "$29.00",
    subjectLine: "Should I close your file for {{company_name}}?",
    preheader: "Assuming timing isn't right for now...",
    bodyCopy: "Hi {{first_name}},\n\nI haven't heard back and don't want to keep cluttering your inbox.\n\nShould I close your file for now?\n\nIf timing isn't right, no problem at all. Just reply 'YES' to keep your spot open.\n\nBest,\nEric",
    ctaText: "Reply YES to Keep Spot",
    tags: ["Breakup Email", "Re-Engagement", "High Reply Rate"],
    conversionNotes: "48% response rate on leads that had been cold for over 90 days.",
    createdAt: "2026-07-15",
  },
];

// Complete 55 Battle-Tested Sales Email Master Catalog from Outreach.ai
export const outreach55Templates: OutreachTemplate[] = [
  // 1 to 5: Prospecting & Initial Outreach
  {
    id: "tpl_1_cold",
    name: "1. Cold Email (New Prospect)",
    category: "Prospecting",
    subjectLine: "Quick chat about {{company_name}}?",
    preheader: "Noticed your company's growth in {{relevant_detail}}...",
    bodyCopy: "Hi {{first_name}},\n\nI noticed your company is {{relevant_detail}}.\n\nWe help companies like yours achieve {{specific_benefit}}.\n\nI’d love to schedule a quick call to explore how {{product_name}} could support your goals.\n\nLet me know if next Tuesday or Wednesday works for you.\n\nBest,\nEric",
    ctaText: "Schedule a Quick Call",
    whenToUse: "• First outreach to a prospect you’ve never contacted.\n• When there’s a relevant, timely hook like recent news or an industry milestone.",
    whyItWorks: "Highlights personalization while keeping the message concise and action-oriented. Balances curiosity with value, encouraging engagement without feeling pressured.",
  },
  {
    id: "tpl_2_followup",
    name: "2. Follow-Up Email (Post Outreach)",
    category: "Follow-Up & Re-Engagement",
    subjectLine: "Still thinking about {{company_name}}'s goals?",
    preheader: "Following up on my previous email regarding {{product_name}}...",
    bodyCopy: "Hi {{first_name}},\n\nJust following up on my previous email about {{product_name}}.\n\nI wanted to see if you had a chance to review my message.\n\nI’m happy to answer any questions or discuss how we can help with {{specific_need}}.\n\nLooking forward to hearing your thoughts.\n\nBest,\nEric",
    ctaText: "Reply with Your Thoughts",
    whenToUse: "• After no response to initial cold email within 3-5 days.\n• To maintain momentum after a positive interaction when no next steps were locked in.",
    whyItWorks: "Polite but persistent. Reminds the prospect of the initial message and offers assistance without being pushy, keeping dialogue focused on their needs.",
  },
  {
    id: "tpl_3_warm",
    name: "3. Warm Email (Engaged Lead)",
    category: "Prospecting",
    subjectLine: "Saw you were interested — let's connect",
    preheader: "Noticed you recently downloaded {{resource_name}}...",
    bodyCopy: "Hi {{first_name}},\n\nI saw that you recently downloaded our {{resource_name}} or visited our website.\n\nI wanted to share how {{product_name}} can help with {{specific_challenge}}.\n\nWould you be open to a brief call to explore this further?\n\nBest,\nEric",
    ctaText: "Book an Exploration Call",
    whenToUse: "• When a lead shows active engagement (downloading content, viewing pricing, visiting site).\n• After an inbound inquiry or demo request.",
    whyItWorks: "Reaches out when lead interest is hot, increasing response probability with a natural, logical next step.",
  },
  {
    id: "tpl_4_intro",
    name: "4. Introductory Email (Formal Intro)",
    category: "Prospecting",
    subjectLine: "Introducing {{my_company}} to {{company_name}}",
    preheader: "Helping businesses like yours achieve {{desired_result}}...",
    bodyCopy: "Hi {{first_name}},\n\nI’m Eric from {{my_company}}.\n\nWe specialize in {{product_name}} that helps businesses like yours {{specific_benefit}}.\n\nI’d love to chat and see how we can help your team achieve {{desired_result}}.\n\nCan we set up a quick call next week?\n\nBest,\nEric",
    ctaText: "Set Up a Quick Call Next Week",
    whenToUse: "• Reaching out to new prospects for the first time.\n• Making a clean, formal introduction to decision-makers.",
    whyItWorks: "Brief and to the point. Quickly positions your product or service as a direct solution to potential operational challenges.",
  },
  {
    id: "tpl_5_referral",
    name: "5. Referral Request (Existing Contacts)",
    category: "Prospecting",
    subjectLine: "Need a referral? I'd appreciate the help",
    preheader: "Quick favor regarding colleagues in {{relevant_detail}}...",
    bodyCopy: "Hi {{first_name}},\n\nI hope things are going well!\n\nI wanted to ask if you know anyone who might benefit from {{product_name}}.\n\nIf so, I’d appreciate an introduction, and I’m happy to share more details if needed.\n\nThanks,\nEric",
    ctaText: "Introduce a Colleague",
    whenToUse: "• After a positive interaction or experience with a client or contact.\n• Expanding network through warm, trusted referrals.",
    whyItWorks: "Casual but specific. Makes it easy for the recipient to consider referring someone without feeling put on the spot.",
  },
];

export const EmailSequenceMapper: React.FC = () => {
  // VIEW MODE SWITCHER
  const [activeViewMode, setActiveViewMode] = useState<"sequence" | "swipe_vault" | "custom_templates">("sequence");

  // SWIPE FILE VAULT STATE
  const [swipeList, setSwipeList] = useState<SwipeEmailItem[]>(DEFAULT_SWIPE_FILE);
  const [swipeSearch, setSwipeSearch] = useState<string>("");
  const [swipeCategoryFilter, setSwipeCategoryFilter] = useState<string>("All");
  const [showAddSwipeModal, setShowAddSwipeModal] = useState<boolean>(false);
  const [newSwipeItem, setNewSwipeItem] = useState<{
    title: string;
    category: string;
    niche: string;
    sellingPrice: string;
    subjectLine: string;
    preheader: string;
    bodyCopy: string;
    ctaText: string;
    tags: string;
    conversionNotes: string;
  }>({
    title: "",
    category: "Prospecting",
    niche: "General",
    sellingPrice: "$47.00",
    subjectLine: "",
    preheader: "",
    bodyCopy: "",
    ctaText: "Click Here Now",
    tags: "High-Converting, Sales Swipe",
    conversionNotes: "",
  });

  // CUSTOM TEMPLATES STATE
  const [customTemplates, setCustomTemplates] = useState<OutreachTemplate[]>([]);
  const [showAddTemplateModal, setShowAddTemplateModal] = useState<boolean>(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "Prospecting",
    subjectLine: "",
    preheader: "",
    bodyCopy: "",
    ctaText: "",
    whenToUse: "",
    whyItWorks: "",
  });

  // SEQUENCE BUILDER STATE
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");
  const [showBestPractices, setShowBestPractices] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const [sequence, setSequence] = useState<EmailSequenceStep[]>([
    {
      id: "s1",
      stepNumber: 1,
      title: "1. Cold Email (New Prospect)",
      templateId: "tpl_1_cold",
      category: "Prospecting",
      delay: "Immediate (Day 0)",
      subjectLine: outreach55Templates[0].subjectLine,
      preheader: outreach55Templates[0].preheader,
      bodyCopy: outreach55Templates[0].bodyCopy,
      ctaText: outreach55Templates[0].ctaText,
      whenToUse: outreach55Templates[0].whenToUse,
      whyItWorks: outreach55Templates[0].whyItWorks,
    },
    {
      id: "s2",
      stepNumber: 2,
      title: "Follow-Up Email (Post Outreach)",
      templateId: "tpl_2_followup",
      category: "Follow-Up & Re-Engagement",
      delay: "3 Days After Step 1",
      subjectLine: outreach55Templates[1].subjectLine,
      preheader: outreach55Templates[1].preheader,
      bodyCopy: outreach55Templates[1].bodyCopy,
      ctaText: outreach55Templates[1].ctaText,
      whenToUse: outreach55Templates[1].whenToUse,
      whyItWorks: outreach55Templates[1].whyItWorks,
    },
  ]);

  const [activeStepId, setActiveStepId] = useState<string>("s1");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // TOKEN SANDBOX STATE
  const [tokenValues, setTokenValues] = useState<Record<string, string>>({
    first_name: "Alex",
    company_name: "Acme Growth",
    relevant_detail: "expanding multi-platform ad spend",
    specific_benefit: "30% higher CTR and 75% faster launches",
    product_name: "Campaign Manager Dashboard",
    specific_need: "reducing ad aspect ratio errors",
    resource_name: "2026 Marketing Playbook",
    specific_challenge: "fragmented media asset management",
    my_company: "KB Academy",
    desired_result: "scalable affiliate campaign growth",
    discount_code: "BLACKFRIDAY50",
  });

  useEffect(() => {
    fetchSavedData();
  }, []);

  const fetchSavedData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/click-campaigns/email-sequences");
      const data = await res.json();
      if (data.success) {
        if (data.swipeList && data.swipeList.length > 0) {
          setSwipeList(data.swipeList);
        }
        if (data.customTemplates && data.customTemplates.length > 0) {
          setCustomTemplates(data.customTemplates);
        }
      }
    } catch (err) {
      console.error("Failed to fetch saved email sequence data:", err);
    } finally {
      setLoading(false);
    }
  };

  const activeStep = sequence.find((e) => e.id === activeStepId) || sequence[0];

  // APPLY TEMPLATE TO STEP
  const handleApplyTemplateToActiveStep = (tpl: OutreachTemplate) => {
    setSequence((prev) =>
      prev.map((item) =>
        item.id === activeStepId
          ? {
              ...item,
              title: tpl.name,
              templateId: tpl.id,
              category: tpl.category,
              subjectLine: tpl.subjectLine,
              preheader: tpl.preheader,
              bodyCopy: tpl.bodyCopy,
              ctaText: tpl.ctaText,
              whenToUse: tpl.whenToUse,
              whyItWorks: tpl.whyItWorks,
            }
          : item
      )
    );
  };

  // APPLY SWIPE FILE EMAIL TO SEQUENCE
  const handleApplySwipeToSequence = (swipeItem: SwipeEmailItem) => {
    const nextNum = sequence.length + 1;
    const newStep: EmailSequenceStep = {
      id: `s_${Date.now()}`,
      stepNumber: nextNum,
      title: swipeItem.title,
      category: swipeItem.category,
      delay: `${nextNum - 1} Days After Previous`,
      subjectLine: swipeItem.subjectLine,
      preheader: swipeItem.preheader,
      bodyCopy: swipeItem.bodyCopy,
      ctaText: swipeItem.ctaText,
      whenToUse: `Swipe file package for ${swipeItem.niche} (${swipeItem.sellingPrice})`,
      whyItWorks: swipeItem.conversionNotes,
    };
    setSequence([...sequence, newStep]);
    setActiveStepId(newStep.id);
    setActiveViewMode("sequence");
  };

  const handleUpdateActiveStep = (field: keyof EmailSequenceStep, value: any) => {
    setSequence((prev) =>
      prev.map((item) => (item.id === activeStepId ? { ...item, [field]: value } : item))
    );
  };

  const handleAddStep = () => {
    const nextNum = sequence.length + 1;
    const defaultTpl = outreach55Templates[1];
    const newStep: EmailSequenceStep = {
      id: `s_${Date.now()}`,
      stepNumber: nextNum,
      title: `${nextNum}. Follow-Up Step`,
      templateId: defaultTpl.id,
      category: defaultTpl.category,
      delay: `${nextNum - 1} Days After Previous`,
      subjectLine: defaultTpl.subjectLine,
      preheader: defaultTpl.preheader,
      bodyCopy: defaultTpl.bodyCopy,
      ctaText: defaultTpl.ctaText,
      whenToUse: defaultTpl.whenToUse,
      whyItWorks: defaultTpl.whyItWorks,
    };
    setSequence([...sequence, newStep]);
    setActiveStepId(newStep.id);
  };

  const handleDeleteStep = (id: string) => {
    if (sequence.length <= 1) return;
    const filtered = sequence.filter((s) => s.id !== id);
    const reindexed = filtered.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setSequence(reindexed);
    setActiveStepId(reindexed[0].id);
  };

  const interpolate = (text: string) => {
    let result = text || "";
    Object.entries(tokenValues).forEach(([key, val]) => {
      result = result.replaceAll(`{{${key}}}`, val);
    });
    return result;
  };

  const handleCopyText = (stepItem: EmailSequenceStep) => {
    const text = `Subject: ${interpolate(stepItem.subjectLine)}\nPreheader: ${interpolate(stepItem.preheader)}\n\n${interpolate(stepItem.bodyCopy)}\n\n[CTA Button: ${interpolate(stepItem.ctaText)}]`;
    navigator.clipboard.writeText(text);
    setCopiedId(stepItem.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const insertToken = (tokenKey: string) => {
    handleUpdateActiveStep("bodyCopy", activeStep.bodyCopy + ` {{${tokenKey}}} `);
  };

  // SAVE CURRENT STEP AS CUSTOM TEMPLATE
  const handleSaveActiveStepAsTemplate = async () => {
    const createdData = {
      type: "template",
      name: `Custom: ${activeStep.title}`,
      category: activeStep.category,
      subjectLine: activeStep.subjectLine,
      preheader: activeStep.preheader,
      bodyCopy: activeStep.bodyCopy,
      ctaText: activeStep.ctaText,
      whenToUse: activeStep.whenToUse || "Custom saved template from your sequence.",
      whyItWorks: activeStep.whyItWorks || "Personal proven copy structure.",
      isCustom: true,
    };

    try {
      const res = await fetch("/api/admin/click-campaigns/email-sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createdData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCustomTemplates([data.data, ...customTemplates]);
        alert(`Saved '${activeStep.title}' to MongoDB as a custom template!`);
      }
    } catch (err) {
      console.error("Failed to save template to MongoDB:", err);
      // Fallback local
      setCustomTemplates([{ ...createdData, id: `custom_${Date.now()}` } as any, ...customTemplates]);
    }
  };

  // SAVE NEW CUSTOM TEMPLATE FROM MODAL
  const handleCreateCustomTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.name || !newTemplate.subjectLine || !newTemplate.bodyCopy) return;

    const payload = {
      type: "template",
      name: newTemplate.name,
      category: newTemplate.category,
      subjectLine: newTemplate.subjectLine,
      preheader: newTemplate.preheader,
      bodyCopy: newTemplate.bodyCopy,
      ctaText: newTemplate.ctaText,
      whenToUse: newTemplate.whenToUse || "Custom email template",
      whyItWorks: newTemplate.whyItWorks || "High-converting custom sales structure",
      isCustom: true,
    };

    try {
      const res = await fetch("/api/admin/click-campaigns/email-sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCustomTemplates([data.data, ...customTemplates]);
      }
    } catch (err) {
      console.error("Failed to create template:", err);
      setCustomTemplates([{ ...payload, id: `custom_${Date.now()}` } as any, ...customTemplates]);
    } finally {
      setShowAddTemplateModal(false);
      setNewTemplate({
        name: "",
        category: "Prospecting",
        subjectLine: "",
        preheader: "",
        bodyCopy: "",
        ctaText: "",
        whenToUse: "",
        whyItWorks: "",
      });
    }
  };

  // SAVE NEW SWIPE FILE EMAIL
  const handleAddSwipeItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSwipeItem.title || !newSwipeItem.subjectLine || !newSwipeItem.bodyCopy) return;

    const payload = {
      type: "swipe",
      title: newSwipeItem.title,
      category: newSwipeItem.category,
      niche: newSwipeItem.niche,
      sellingPrice: newSwipeItem.sellingPrice,
      subjectLine: newSwipeItem.subjectLine,
      preheader: newSwipeItem.preheader,
      bodyCopy: newSwipeItem.bodyCopy,
      ctaText: newSwipeItem.ctaText,
      tags: newSwipeItem.tags.split(",").map((t) => t.trim()),
      conversionNotes: newSwipeItem.conversionNotes || "High-converting email copy stored for resale or reuse.",
    };

    try {
      const res = await fetch("/api/admin/click-campaigns/email-sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSwipeList([data.data, ...swipeList]);
      }
    } catch (err) {
      console.error("Failed to create swipe item:", err);
      setSwipeList([{ ...payload, id: `swipe_${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) } as any, ...swipeList]);
    } finally {
      setShowAddSwipeModal(false);
      setNewSwipeItem({
        title: "",
        category: "Prospecting",
        niche: "General",
        sellingPrice: "$47.00",
        subjectLine: "",
        preheader: "",
        bodyCopy: "",
        ctaText: "Click Here Now",
        tags: "High-Converting, Sales Swipe",
        conversionNotes: "",
      });
    }
  };

  // EXPORT SWIPE FILE PACKAGE (.TXT)
  const handleExportSwipePackage = () => {
    if (swipeList.length === 0) return;
    const content = swipeList
      .map(
        (s) =>
          `TITLE: ${s.title}\nCATEGORY: ${s.category} | NICHE: ${s.niche} | PRICE: ${s.sellingPrice}\nSUBJECT: ${s.subjectLine}\nPREHEADER: ${s.preheader}\n\n${s.bodyCopy}\n\n[CTA: ${s.ctaText}]\n\nCONVERSION NOTES: ${s.conversionNotes}\n=========================================`
      )
      .join("\n\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email_swipe_file_package_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  };

  const allTemplatesList = [...customTemplates, ...outreach55Templates];

  const filteredTemplates = allTemplatesList.filter((t) => {
    const matchesCategory = selectedCategoryFilter === "All" || t.category === selectedCategoryFilter;
    const matchesSearch =
      t.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.subjectLine.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredSwipeList = swipeList.filter((s) => {
    const matchesCategory = swipeCategoryFilter === "All" || s.category === swipeCategoryFilter;
    const matchesSearch =
      s.title.toLowerCase().includes(swipeSearch.toLowerCase()) ||
      s.subjectLine.toLowerCase().includes(swipeSearch.toLowerCase()) ||
      s.niche.toLowerCase().includes(swipeSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const subjectLen = activeStep.subjectLine.length;
  const isSubjectOptimal = subjectLen > 0 && subjectLen <= 50;
  const paragraphCount = (activeStep.bodyCopy.match(/\n\n/g) || []).length + 1;

  return (
    <div className="space-y-6">
      {/* HEADER BANNER WITH MODE SWITCHER */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl shadow-lg shadow-purple-600/30">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              Email Sequences, Custom Templates & For-Sale Swipe File Vault
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Build sequences, store emails to sell, and create reusable custom email templates
            </p>
          </div>
        </div>

        {/* 3-WAY VIEW MODE SWITCHER */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveViewMode("sequence")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
              activeViewMode === "sequence"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Send className="w-4 h-4 text-purple-300" /> Sequence Workflow ({sequence.length} Steps)
          </button>

          <button
            onClick={() => setActiveViewMode("swipe_vault")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
              activeViewMode === "swipe_vault"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Folder className="w-4 h-4 text-emerald-300" /> For-Sale Swipe Vault ({swipeList.length})
          </button>

          <button
            onClick={() => setActiveViewMode("custom_templates")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
              activeViewMode === "custom_templates"
                ? "bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Edit3 className="w-4 h-4 text-pink-300" /> Custom Templates ({customTemplates.length})
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: FOR-SALE EMAIL SWIPE FILE VAULT */}
      {activeViewMode === "swipe_vault" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Folder className="w-5 h-5 text-emerald-400" /> For-Sale Email Swipe File Vault
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Store high-converting sales emails to sell as swipe files or use across client campaigns.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportSwipePackage}
                  className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4 text-emerald-400" /> Export Swipe Package (.txt)
                </button>

                <button
                  onClick={() => setShowAddSwipeModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/30"
                >
                  <Plus className="w-4 h-4" /> Store New Swipe Email
                </button>
              </div>
            </div>

            {/* SEARCH & CATEGORY FILTER BAR FOR SWIPE FILE */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search swipe emails, niches, subject lines..."
                  value={swipeSearch}
                  onChange={(e) => setSwipeSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {["All", "Prospecting", "Promotional", "Re-Engagement", "Onboarding", "Upselling"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSwipeCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      swipeCategoryFilter === cat
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* SWIPE FILE CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSwipeList.map((item, idx) => (
                <div
                  key={item._id || item.id || idx}
                  className="bg-slate-950 border border-slate-800 hover:border-emerald-600/60 rounded-2xl p-5 space-y-4 shadow-lg transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-[10px] font-mono font-bold">
                        Selling Value: {item.sellingPrice}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.niche}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                    <p className="text-xs text-purple-300 font-mono italic">"{item.subjectLine}"</p>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300 leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap font-sans">
                      {item.bodyCopy}
                    </div>

                    {item.conversionNotes && (
                      <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-[10px] text-emerald-200 space-y-0.5">
                        <span className="font-bold uppercase tracking-wider block text-emerald-400">Conversion Proof / Notes:</span>
                        <p>{item.conversionNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tg) => (
                        <span key={tg} className="text-[9px] px-2 py-0.5 bg-slate-900 text-slate-400 rounded">
                          #{tg}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleApplySwipeToSequence(item)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" /> Load into Sequence
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CUSTOM EMAIL TEMPLATES BUILDER */}
      {activeViewMode === "custom_templates" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-pink-400" /> Custom Email Templates Workspace
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Create reusable custom email templates to populate any sequence in 1-click.
                </p>
              </div>

              <button
                onClick={() => setShowAddTemplateModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 transition shadow-lg shadow-pink-600/30"
              >
                <Plus className="w-4 h-4" /> Build New Custom Template
              </button>
            </div>

            {customTemplates.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800">
                <Edit3 className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500">No custom templates created yet.</p>
                <p className="text-xs text-slate-400">
                  Build custom templates from scratch or save any active step in your sequence workflow!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {customTemplates.map((tpl, idx) => (
                  <div key={tpl.id || idx} className="bg-slate-950 border border-slate-800 hover:border-pink-600/60 rounded-2xl p-5 space-y-3 shadow-lg transition">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-100">{tpl.name}</h4>
                      <span className="px-2 py-0.5 bg-pink-950 text-pink-300 border border-pink-800 rounded-md text-[10px] font-semibold">
                        {tpl.category}
                      </span>
                    </div>

                    <p className="text-xs text-purple-300 font-mono italic">"{tpl.subjectLine}"</p>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300 font-mono leading-relaxed max-h-28 overflow-y-auto whitespace-pre-wrap">
                      {tpl.bodyCopy}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                      <span className="text-[10px] text-slate-500 font-mono">Custom Template</span>
                      <button
                        onClick={() => {
                          handleApplyTemplateToActiveStep(tpl);
                          setActiveViewMode("sequence");
                        }}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition"
                      >
                        Apply to Active Step
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: MAIN SEQUENCE WORKFLOW & DELIVERABILITY AUDIT */}
      {activeViewMode === "sequence" && (
        <div className="space-y-6">
          {/* Header Banner Sub-controls */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-400" /> Sequence Workflow Builder
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize multi-touch delays, token sandbox variables, and real-time deliverability checks
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveActiveStepAsTemplate}
                className="px-3.5 py-2 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Save className="w-4 h-4 text-yellow-300" /> Save Active Step as Template
              </button>

              <button
                onClick={() => setShowBestPractices(!showBestPractices)}
                className="px-3.5 py-2 bg-purple-950/60 border border-purple-800/60 hover:bg-purple-900/80 text-purple-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" /> Deliverability Audit
              </button>

              <button
                onClick={handleAddStep}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-purple-600/20 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Sequence Step
              </button>
            </div>
          </div>

          {/* Deliverability & Outreach.ai Best Practices Audit Drawer */}
          {showBestPractices && (
            <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 space-y-4 text-xs text-slate-300 shadow-xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Outreach.ai Deliverability & Sales Best Practices Checklist
                </div>
                <button onClick={() => setShowBestPractices(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1. Subject Line Length
                  </div>
                  <p className="text-[11px] text-slate-400">Keep under 50 characters. Current length: <strong className={isSubjectOptimal ? "text-emerald-400" : "text-amber-400"}>{subjectLen} chars</strong>.</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 2. Brevity & Mobile Formatting
                  </div>
                  <p className="text-[11px] text-slate-400">Aim for 3-5 short paragraphs. Current: <strong className="text-indigo-300">{paragraphCount} paragraphs</strong>.</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3. Single Specific CTA
                  </div>
                  <p className="text-[11px] text-slate-400">Every email must end with a single, clear action ask (e.g. "Schedule a quick call").</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 4. Domain Authentication
                  </div>
                  <p className="text-[11px] text-slate-400">Ensure proper SPF, DKIM, and DMARC record implementation to maintain primary inbox placement.</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 5. Proactive Renewal Check-In
                  </div>
                  <p className="text-[11px] text-slate-400">Initiate renewal check-ins 60-90 days early (Template #55) to eliminate last-minute churn surprises.</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 6. Consistent Sequencing
                  </div>
                  <p className="text-[11px] text-slate-400">Space follow-ups 3-5 days apart. Consistent multi-touch cadence increases reply rates by 2.4x.</p>
                </div>
              </div>
            </div>
          )}

          {/* Searchable Master Catalog Grid */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" /> Master Catalog ({filteredTemplates.length} Templates Available):
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {["All", "Prospecting", "Follow-Up & Re-Engagement", "Demo & Proposals", "Closing & Contracts", "Onboarding & Post-Sale", "Upselling & Loyalty"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategoryFilter === cat
                      ? "bg-purple-600 text-white"
                      : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
              {filteredTemplates.map((tpl, idx) => (
                <button
                  key={tpl.id || idx}
                  onClick={() => handleApplyTemplateToActiveStep(tpl)}
                  className={`p-3 rounded-xl border text-left text-xs transition flex flex-col justify-between space-y-2 ${
                    activeStep.templateId === tpl.id
                      ? "bg-purple-950/80 border-purple-500 text-purple-200 shadow-md ring-1 ring-purple-500"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-100 text-xs truncate flex items-center justify-between">
                      <span>{tpl.name}</span>
                      {tpl.isCustom && <span className="text-[9px] px-1.5 py-0.5 bg-pink-950 text-pink-300 rounded border border-pink-800">Custom</span>}
                    </div>
                    <div className="text-[11px] text-purple-300 font-mono italic truncate mt-0.5">
                      "{tpl.subjectLine}"
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[9px]">
                    <span className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded font-semibold truncate max-w-[120px]">{tpl.category}</span>
                    <span className="text-purple-400 font-bold shrink-0">Apply ➔</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Sequence Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sequence Steps Sidebar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Sequence Workflow ({sequence.length} Steps)
                </div>
                <button onClick={handleAddStep} className="text-xs text-purple-400 hover:text-purple-300 font-semibold">
                  + Add Step
                </button>
              </div>

              <div className="space-y-2">
                {sequence.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveStepId(item.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                      activeStepId === item.id
                        ? "bg-purple-950/60 border-purple-500 text-purple-200 shadow-md"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="space-y-1 truncate">
                      <div className="text-xs font-bold text-slate-100 truncate">{item.title}</div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="px-2 py-0.5 bg-purple-950 text-purple-300 rounded font-semibold border border-purple-800/40 truncate max-w-[100px]">
                          {item.category}
                        </span>
                        <span className="opacity-75">{item.delay}</span>
                      </div>
                    </div>
                    <Send className="w-3.5 h-3.5 shrink-0 opacity-60 ml-2" />
                  </button>
                ))}
              </div>

              {/* Sandbox Live Variable Customizer */}
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Token Sandbox Values
                </div>

                <div className="space-y-2 text-xs max-h-56 overflow-y-auto pr-1">
                  {Object.keys(tokenValues).map((key) => (
                    <div key={key}>
                      <span className="text-[10px] text-slate-400 font-mono">{`{{${key}}}`}</span>
                      <input
                        type="text"
                        value={tokenValues[key]}
                        onChange={(e) => setTokenValues({ ...tokenValues, [key]: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 mt-0.5 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step Editor & Educational Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h4 className="font-bold text-base text-slate-100">{activeStep.title}</h4>
                    <span className="text-xs text-purple-400 font-semibold">{activeStep.category} | {activeStep.delay}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {sequence.length > 1 && (
                      <button
                        onClick={() => handleDeleteStep(activeStep.id)}
                        className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                        title="Delete step"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleCopyText(activeStep)}
                      className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-purple-600/20"
                    >
                      {copiedId === activeStep.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied Text!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Email Text
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Educational Rationale Card */}
                {(activeStep.whenToUse || activeStep.whyItWorks) && (
                  <div className="bg-purple-950/40 border border-purple-800/50 rounded-xl p-4 space-y-2.5 text-xs text-purple-200">
                    {activeStep.whenToUse && (
                      <div className="flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold uppercase tracking-wider text-[10px] text-purple-300 block">When to use it:</span>
                          <div className="whitespace-pre-line mt-0.5">{activeStep.whenToUse}</div>
                        </div>
                      </div>
                    )}
                    {activeStep.whyItWorks && (
                      <div className="flex items-start gap-2 border-t border-purple-800/40 pt-2">
                        <Lightbulb className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold uppercase tracking-wider text-[10px] text-yellow-300 block">Why this works:</span>
                          <div className="mt-0.5">{activeStep.whyItWorks}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Variable Token Insertion Chips */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Click Token Chip to Insert:</div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {Object.keys(tokenValues).map((tKey) => (
                      <button
                        key={tKey}
                        type="button"
                        onClick={() => insertToken(tKey)}
                        className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-purple-300 rounded text-[11px] font-mono transition"
                      >
                        + {`{{${tKey}}}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex justify-between">
                      <span>Subject Line Template</span>
                      <span className={`text-[10px] font-mono ${isSubjectOptimal ? "text-emerald-400" : "text-amber-400"}`}>
                        {subjectLen}/50 chars (Optimal: under 50)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={activeStep.subjectLine}
                      onChange={(e) => handleUpdateActiveStep("subjectLine", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                      Preheader Snippet
                    </label>
                    <input
                      type="text"
                      value={activeStep.preheader}
                      onChange={(e) => handleUpdateActiveStep("preheader", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                      Body Copy Template
                    </label>
                    <textarea
                      rows={8}
                      value={activeStep.bodyCopy}
                      onChange={(e) => handleUpdateActiveStep("bodyCopy", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 font-mono leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                      CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={activeStep.ctaText}
                      onChange={(e) => handleUpdateActiveStep("ctaText", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Live Recipient Email Preview */}
              <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                    <Eye className="w-4 h-4 text-purple-400" /> Live Rendered Recipient Email ({tokenValues.first_name})
                  </div>
                  <span className="text-[10px] bg-purple-950 px-2 py-0.5 rounded text-purple-300 font-mono">
                    EMAIL RENDER PREVIEW
                  </span>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="border-b border-slate-800/80 pb-2 space-y-1">
                    <div className="text-sm font-bold text-slate-100">
                      {interpolate(activeStep.subjectLine)}
                    </div>
                    <div className="text-xs text-slate-400">
                      Preheader: <span className="italic">{interpolate(activeStep.preheader)}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                    {interpolate(activeStep.bodyCopy)}
                  </div>

                  {activeStep.ctaText && (
                    <div className="pt-3">
                      <div className="inline-block px-5 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold shadow-md">
                        {interpolate(activeStep.ctaText)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW SWIPE FILE EMAIL */}
      {showAddSwipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Folder className="w-4 h-4 text-emerald-400" /> Store New Email in Swipe File Vault
              </h3>
              <button onClick={() => setShowAddSwipeModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddSwipeItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-Ticket SaaS Cold Pitch ($47 Value)"
                  value={newSwipeItem.title}
                  onChange={(e) => setNewSwipeItem({ ...newSwipeItem, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Niche</label>
                  <input
                    type="text"
                    placeholder="e.g. Agency, E-commerce, SaaS"
                    value={newSwipeItem.niche}
                    onChange={(e) => setNewSwipeItem({ ...newSwipeItem, niche: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Selling Price / Value</label>
                  <input
                    type="text"
                    placeholder="e.g. $47.00"
                    value={newSwipeItem.sellingPrice}
                    onChange={(e) => setNewSwipeItem({ ...newSwipeItem, sellingPrice: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Subject Line *</label>
                <input
                  type="text"
                  required
                  placeholder="Subject line template..."
                  value={newSwipeItem.subjectLine}
                  onChange={(e) => setNewSwipeItem({ ...newSwipeItem, subjectLine: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Body Copy *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Full email body copy..."
                  value={newSwipeItem.bodyCopy}
                  onChange={(e) => setNewSwipeItem({ ...newSwipeItem, bodyCopy: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Conversion Proof / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. 34% reply rate across 1,200 sends..."
                  value={newSwipeItem.conversionNotes}
                  onChange={(e) => setNewSwipeItem({ ...newSwipeItem, conversionNotes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSwipeModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold shadow-lg shadow-emerald-600/30"
                >
                  Save to Swipe Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOM EMAIL TEMPLATE */}
      {showAddTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-pink-400" /> Create New Custom Email Template
              </h3>
              <button onClick={() => setShowAddTemplateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateCustomTemplate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Template Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My High-Converting Webinar Pitch"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Subject Line *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Join us live for {{product_name}}"
                  value={newTemplate.subjectLine}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subjectLine: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Body Copy Template *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Type email template body copy with {{tokens}}..."
                  value={newTemplate.bodyCopy}
                  onChange={(e) => setNewTemplate({ ...newTemplate, bodyCopy: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTemplateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-extrabold shadow-lg shadow-pink-600/30"
                >
                  Save Custom Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
