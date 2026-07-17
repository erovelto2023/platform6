"use client";

import React, { useState } from "react";
import {
  Sparkles,
  MousePointerClick,
  ShoppingBag,
  Video,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  BookOpen,
  Search,
  HelpCircle,
  Dna,
  Play,
  MessagesSquare,
  GitFork,
  UserCheck,
  LayoutList,
  FileSignature,
  Calendar,
  DollarSign,
  Award,
  FileLock,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Mail,
  Zap,
  Globe
} from "lucide-react";



interface ToolCard {
  title: string;
  domain: string;
  description: string;
  badge: {
    text: string;
    type: "ready" | "ai" | "beta" | "soon" | "live";
  };
  icon: React.ComponentType<any>;
  color: string;
  href: string;
}

export default function ScalePlusDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Suites" },
    { id: "ai", name: "AI Power" },
    { id: "marketing", name: "Marketing & Funnels" },
    { id: "crm", name: "Sales & CRM" },
    { id: "legal", name: "Legal & Admin" }
  ];

  const tools: ToolCard[] = [
    {
      title: "ClickCampaigns.ai",
      domain: "ClickCampaigns.ai",
      description: "AI-driven campaign generator to setup VSSLs, long-form sales copy, emails, and affiliate swipes.",
      badge: { text: "AI Powered", type: "ai" },
      icon: Sparkles,
      color: "from-amber-500 to-orange-500 text-orange-500",
      href: "/admin/click-campaigns/new"
    },
    {
      title: "PageBuilder.gg (Puck)",
      domain: "PageBuilder.gg",
      description: "Drag-and-drop landing page editor featuring modern visual editing and custom style sheets.",
      badge: { text: "Ready to Start", type: "ready" },
      icon: MousePointerClick,
      color: "from-sky-500 to-blue-500 text-sky-500",
      href: "/admin/page-builder-simple"
    },
    {
      title: "MyStore.gg | Avia",
      domain: "MyStore.gg",
      description: "AI-powered lightweight e-commerce store creator synced with print-on-demand suppliers.",
      badge: { text: "Live", type: "live" },
      icon: ShoppingBag,
      color: "from-pink-500 to-rose-500 text-rose-500",
      href: "/admin/publishing"
    },
    {
      title: "CreatorStudio.gg",
      domain: "CreatorStudio.gg",
      description: "Create high-converting user generated content script flows, dynamic video scripts, and custom slide decks.",
      badge: { text: "Coming Soon", type: "soon" },
      icon: Video,
      color: "from-purple-500 to-indigo-500 text-purple-500",
      href: "#"
    },
    {
      title: "Imager.gg",
      domain: "Imager.gg",
      description: "Stable diffusion photo studio to generate professional headshots and high-expression YouTube thumbnails.",
      badge: { text: "AI Powered", type: "ai" },
      icon: ImageIcon,
      color: "from-violet-500 to-purple-500 text-violet-500",
      href: "#"
    },
    {
      title: "BlogBaser",
      domain: "BlogBaser.com",
      description: "Autopilot SEO blog content poster configured to publish news and evergreen logs matching your voice DNA.",
      badge: { text: "Ready to Start", type: "ready" },
      icon: FileText,
      color: "from-emerald-500 to-teal-500 text-emerald-500",
      href: "/admin/blog"
    },
    {
      title: "ChatBaser.ai",
      domain: "ChatBaser.ai",
      description: "Knowledge-base customer support assistant trained on your documents, pillar pages, and products.",
      badge: { text: "AI Powered", type: "ai" },
      icon: MessageSquare,
      color: "from-amber-400 to-yellow-500 text-amber-500",
      href: "#"
    },
    {
      title: "Courses.gg",
      domain: "Courses.gg",
      description: "All-in-one platform for communities, forum discussion, student grading, and curriculum builder.",
      badge: { text: "Live", type: "live" },
      icon: BookOpen,
      color: "from-pink-500 to-purple-500 text-pink-500",
      href: "/admin/courses"
    },
    {
      title: "Local Search SEO",
      domain: "LocalSEO.gg",
      description: "Optimizes target locations pages, coordinates Google Maps profiles, and runs localized rank trackers.",
      badge: { text: "Coming Soon", type: "soon" },
      icon: Search,
      color: "from-blue-500 to-cyan-500 text-blue-500",
      href: "#"
    },
    {
      title: "HDHelpDesk.com",
      domain: "HDHelpDesk.com",
      description: "Support ticket portal with agent routing, response automation, and client satisfaction charts.",
      badge: { text: "Live", type: "live" },
      icon: HelpCircle,
      color: "from-indigo-500 to-blue-500 text-indigo-500",
      href: "#"
    },
    {
      title: "BrandBaser.com",
      domain: "BrandBaser.com",
      description: "Direct response copy brand builder wizard. Answer 20 questions to capture your startup USP DNA.",
      badge: { text: "Ready to Start", type: "ready" },
      icon: Dna,
      color: "from-rose-500 to-orange-500 text-rose-500",
      href: "#"
    },
    {
      title: "VideoPlayer.gg",
      domain: "VideoPlayer.gg",
      description: "Optimized VSL video wrapper that hides controls, locks progress, and shows timed action buttons.",
      badge: { text: "Live", type: "live" },
      icon: Play,
      color: "from-violet-500 to-indigo-500 text-violet-500",
      href: "#"
    },
    {
      title: "ChatFunnels.gg",
      domain: "ChatFunnels.gg",
      description: "Conversational leads capture chat bubbles designed to convert landing page traffic dynamically.",
      badge: { text: "AI Powered", type: "ai" },
      icon: MessagesSquare,
      color: "from-sky-400 to-blue-500 text-sky-500",
      href: "#"
    },
    {
      title: "FunnelMapper.io",
      domain: "FunnelMapper.io",
      description: "Interactive flowchart mapper to simulate checkout pathways, opt-ins, and email sequences conversion rates.",
      badge: { text: "Beta", type: "beta" },
      icon: GitFork,
      color: "from-emerald-500 to-teal-500 text-emerald-500",
      href: "#"
    },
    {
      title: "PipeLeads / LeadFinder",
      domain: "PipeLeads.gg",
      description: "B2B client and lead extraction directory based on locations, domains, and business categories.",
      badge: { text: "Live", type: "live" },
      icon: UserCheck,
      color: "from-indigo-500 to-violet-500 text-indigo-500",
      href: "#"
    },
    {
      title: "PipeLeads CRM",
      domain: "CRM.PipeLeads.gg",
      description: "Pipeline card CRM with drag-and-drop stages, client notes, and automated lead notifications.",
      badge: { text: "Live", type: "live" },
      icon: LayoutList,
      color: "from-amber-500 to-orange-500 text-amber-500",
      href: "/admin/affiliates"
    },
    {
      title: "Invoicer.gg",
      domain: "Invoicer.gg",
      description: "Sleek invoicing generator containing credit card payment links, tax records, and recurring plans.",
      badge: { text: "Live", type: "live" },
      icon: DollarSign,
      color: "from-sky-500 to-teal-500 text-teal-500",
      href: "#"
    },
    {
      title: "ProjectBaser.com",
      domain: "ProjectBaser.com",
      description: "Admin task workspace supporting sprint milestones, subtasks delegation, and deadline notifications.",
      badge: { text: "Coming Soon", type: "soon" },
      icon: Calendar,
      color: "from-indigo-500 to-pink-500 text-pink-500",
      href: "#"
    },
    {
      title: "DocSigner.co",
      domain: "DocSigner.co",
      description: "Secure e-signature agreements manager. Draft partnership covenants, NDAs, and project terms of service.",
      badge: { text: "Live", type: "live" },
      icon: FileSignature,
      color: "from-teal-500 to-emerald-500 text-teal-500",
      href: "#"
    },
    {
      title: "CloseBetter.com",
      domain: "CloseBetter.com",
      description: "Interactive onboarding and consultation templates designed to train remote closers on client objections.",
      badge: { text: "Coming Soon", type: "soon" },
      icon: Award,
      color: "from-rose-500 to-pink-500 text-rose-500",
      href: "#"
    },
    {
      title: "TOSdocs.com",
      domain: "TOSdocs.com",
      description: "Dynamic terms of service, privacy statements, and refund policies generator customized for your niche.",
      badge: { text: "Coming Soon", type: "soon" },
      icon: FileLock,
      color: "from-blue-600 to-indigo-600 text-blue-600",
      href: "#"
    },
    {
      title: "AffiliatePages.com",
      domain: "AffiliatePages.com",
      description: "SEO-optimized review hubs containing product comparison tables, ratings, and custom affiliate CTAs.",
      badge: { text: "Coming Soon", type: "soon" },
      icon: UserPlus,
      color: "from-emerald-500 to-emerald-700 text-emerald-600",
      href: "/admin/affiliate-catalog"
    }
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === "all") return matchesSearch;
    if (activeCategory === "ai") return matchesSearch && tool.badge.type === "ai";
    if (activeCategory === "marketing") return matchesSearch && ["ready", "beta"].includes(tool.badge.type);
    if (activeCategory === "crm") return matchesSearch && ["live"].includes(tool.badge.type);
    if (activeCategory === "legal") return matchesSearch && ["soon"].includes(tool.badge.type);
    return matchesSearch;
  });

  const getBadgeStyles = (type: string) => {
    switch (type) {
      case "ai":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "ready":
        return "bg-sky-500/10 text-sky-500 border-sky-500/20";
      case "live":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "beta":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "soon":
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-8 bg-[#0a0a0c] text-slate-100 min-h-screen p-8 rounded-3xl border border-slate-800">
      {/* Top Partnership Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Partnership Active</span>
            <h3 className="font-bold text-white text-sm mt-1">Announcing Tiny Email Partnership!</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Send up to 15,000 marketing emails per month for free. Sync your funnels and launch sequences instantly.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Zap className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Marketer's Event</span>
            <h3 className="font-bold text-white text-sm mt-1">Join the Agentic Marketing Mastermind!</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlock the secrets of agentic workflows and automated content operations withMike Filsaime.
            </p>
          </div>
        </div>
      </div>

      {/* Prompts Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">AI Assistant</h2>
        </div>
        <div className="space-y-2">
          <label className="text-xl font-bold text-white block">What do you want to accomplish today?</label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="e.g., Build a complete product launch campaign for my training hub..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 px-4 pr-12 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button className="absolute right-3 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Your ScalePlus AI-Powered Marketing Suite
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Access 22 specialized tools to automate your copy, design, sales pipelines, and communities.
          </p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
              activeCategory === cat.id
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/10"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.title}
              className="group bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} bg-opacity-10 bg-clip-text`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeStyles(
                      tool.badge.type
                    )}`}
                  >
                    {tool.badge.text}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-md font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {tool.title}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {tool.domain}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {tool.description}
                </p>
              </div>

              {/* Card Action */}
              <div className="pt-6 mt-4 border-t border-slate-900/60 flex items-center justify-between">
                <a
                  href={tool.href}
                  className="text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  Launch App
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
