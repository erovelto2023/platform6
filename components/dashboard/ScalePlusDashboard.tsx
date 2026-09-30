"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
    LayoutGrid, Lightbulb, Compass, Bot, Megaphone, BarChart3, HelpCircle, 
    Search, ArrowRight, CheckCircle2, Lock, Sparkles, Layers, Video, Mail, 
    BookOpen, PlaySquare, FileText, ShoppingBag, Radio, Shield, Filter, 
    Calculator, DollarSign, Target, Code, Users, Image as ImageIcon, Calendar, 
    MessageSquare, Headphones, Kanban
} from "lucide-react";

interface ScalePlusApp {
    id: string;
    title: string;
    description: string;
    category: string;
    href: string;
    access: "GRANTED" | "RESTRICTED";
    icon: any;
    iconBg: string;
    cardBg: string;
    cardBorder: string;
}

const APPS: ScalePlusApp[] = [
    {
        id: "click-campaigns",
        title: "ClickCampaigns.ai",
        description: "AI-powered marketing campaign automation that builds complete funnels.",
        category: "Sales & Marketing",
        href: "/admin/click-campaigns",
        access: "RESTRICTED",
        icon: Sparkles,
        iconBg: "bg-pink-600",
        cardBg: "bg-[#fdf2f8]",
        cardBorder: "border-[#fbcfe8]"
    },
    {
        id: "scale-gg",
        title: "Scale.gg",
        description: "Build, sell, and scale your digital products with built-in affiliate marketplace.",
        category: "Core Applications",
        href: "/my-products",
        access: "GRANTED",
        icon: Layers,
        iconBg: "bg-indigo-600",
        cardBg: "bg-[#faf5ff]",
        cardBorder: "border-[#e9d5ff]"
    },
    {
        id: "page-builder",
        title: "PageBuilder.gg",
        description: "The first brand-aware AI page builder. Design with intelligence and speed.",
        category: "Websites & Blogs",
        href: "/admin/page-builder-simple",
        access: "GRANTED",
        icon: Code,
        iconBg: "bg-violet-600",
        cardBg: "bg-[#faf5ff]",
        cardBorder: "border-[#e9d5ff]"
    },
    {
        id: "mail-baser",
        title: "MailBaser",
        description: "World-class email marketing platform with designer forms, automation, and broadcasting.",
        category: "CRM & Client Services",
        href: "/admin/click-campaigns?tab=email",
        access: "GRANTED",
        icon: Mail,
        iconBg: "bg-pink-500",
        cardBg: "bg-[#fdf2f8]",
        cardBorder: "border-[#fbcfe8]"
    },
    {
        id: "courses-gg",
        title: "Courses.gg",
        description: "Course and community platform with unlimited courses, lessons, and modules.",
        category: "Core Applications",
        href: "/catalog",
        access: "GRANTED",
        icon: BookOpen,
        iconBg: "bg-amber-600",
        cardBg: "bg-[#fffbeb]",
        cardBorder: "border-[#fef3c7]"
    },
    {
        id: "video-player",
        title: "VideoPlayer.gg",
        description: "VideoPlayer.gg is a professional video marketing platform for high-converting video hosts.",
        category: "Content & Creative",
        href: "/admin/content",
        access: "GRANTED",
        icon: PlaySquare,
        iconBg: "bg-purple-600",
        cardBg: "bg-[#faf5ff]",
        cardBorder: "border-[#e9d5ff]"
    },
    {
        id: "blog-baser",
        title: "BlogBaser",
        description: "BlogBaser is an AI-powered blogging platform that helps you rank on Google fast.",
        category: "Websites & Blogs",
        href: "/admin/blog",
        access: "GRANTED",
        icon: FileText,
        iconBg: "bg-emerald-600",
        cardBg: "bg-[#f0fdf4]",
        cardBorder: "border-[#bbf7d0]"
    },
    {
        id: "my-store",
        title: "MyStore.gg",
        description: "The lightweight e-commerce platform built for creators. Launch products in 60s.",
        category: "Sales & Marketing",
        href: "/my-products",
        access: "GRANTED",
        icon: ShoppingBag,
        iconBg: "bg-pink-600",
        cardBg: "bg-[#fdf2f8]",
        cardBorder: "border-[#fbcfe8]"
    },
    {
        id: "webinar-baser",
        title: "WebinarBaser",
        description: "Automated webinar software for running scheduled, simulated live events.",
        category: "Sales & Marketing",
        href: "/admin/content",
        access: "GRANTED",
        icon: Radio,
        iconBg: "bg-indigo-600",
        cardBg: "bg-[#faf5ff]",
        cardBorder: "border-[#e9d5ff]"
    },
    {
        id: "ab-lincoln",
        title: "A/B Lincoln",
        description: "Honest A/B testing for pages, offers, and funnel ideas. Keeps split data clean.",
        category: "AI Tools & Branding",
        href: "/tools/competition-black-book",
        access: "RESTRICTED",
        icon: BarChart3,
        iconBg: "bg-orange-600",
        cardBg: "bg-[#fff7ed]",
        cardBorder: "border-[#fed7aa]"
    },
    {
        id: "qualified-funnels",
        title: "QualifiedFunnels.gg",
        description: "Lead generation platform that uses interactive quizzes to capture and score leads.",
        category: "Sales & Marketing",
        href: "/surveys",
        access: "GRANTED",
        icon: Users,
        iconBg: "bg-emerald-600",
        cardBg: "bg-[#f0fdf4]",
        cardBorder: "border-[#bbf7d0]"
    },
    {
        id: "funnel-mapper",
        title: "FunnelMapper.io",
        description: "Visual funnel planning tool that lets marketers design, analyze, and simulate flows.",
        category: "Sales & Marketing",
        href: "/whiteboard",
        access: "GRANTED",
        icon: Target,
        iconBg: "bg-teal-600",
        cardBg: "bg-[#f0fdf4]",
        cardBorder: "border-[#bbf7d0]"
    },
    {
        id: "invoice-gg",
        title: "Invoice.gg",
        description: "Billing and payment automation platform for freelancers, agencies, and sellers.",
        category: "CRM & Client Services",
        href: "/accounting",
        access: "GRANTED",
        icon: DollarSign,
        iconBg: "bg-emerald-700",
        cardBg: "bg-[#f0fdf4]",
        cardBorder: "border-[#bbf7d0]"
    },
    {
        id: "brand-baser",
        title: "BrandBaser.com",
        description: "AI-powered brand content generator for consistent voice across campaigns.",
        category: "AI Tools & Branding",
        href: "/story-hacker",
        access: "GRANTED",
        icon: Bot,
        iconBg: "bg-purple-600",
        cardBg: "bg-[#faf5ff]",
        cardBorder: "border-[#e9d5ff]"
    },
    {
        id: "pipe-leads",
        title: "PipeLeads.ai LeadFinder",
        description: "Lead generation engine that finds ideal prospects with AI-powered scraping.",
        category: "CRM & Client Services",
        href: "/affiliates",
        access: "RESTRICTED",
        icon: Search,
        iconBg: "bg-amber-600",
        cardBg: "bg-[#fffbeb]",
        cardBorder: "border-[#fef3c7]"
    },
    {
        id: "scale-gpts",
        title: "ScaleGPTs.com",
        description: "Platform for building custom AI assistants tailored specifically for your business.",
        category: "AI Tools & Branding",
        href: "/admin/scaleplus",
        access: "GRANTED",
        icon: Bot,
        iconBg: "bg-emerald-600",
        cardBg: "bg-[#f0fdf4]",
        cardBorder: "border-[#bbf7d0]"
    },
    {
        id: "high-ticket-gpt",
        title: "HighTicketGPT.com",
        description: "AI sales copywriting platform built specifically for high-ticket offers & webinars.",
        category: "AI Tools & Branding",
        href: "/story-hacker",
        access: "GRANTED",
        icon: Target,
        iconBg: "bg-green-600",
        cardBg: "bg-[#f0fdf4]",
        cardBorder: "border-[#bbf7d0]"
    },
    {
        id: "tos-docs",
        title: "TOSDocs.com",
        description: "Professional template library for terms of service, privacy policies, and contracts.",
        category: "Help Desk & Ops",
        href: "/admin/docs",
        access: "GRANTED",
        icon: Shield,
        iconBg: "bg-amber-700",
        cardBg: "bg-[#fffbeb]",
        cardBorder: "border-[#fef3c7]"
    },
    {
        id: "affiliate-pages",
        title: "AffiliatePages.com",
        description: "Website builder specified for affiliate marketers with pre-built review designs.",
        category: "Sales & Marketing",
        href: "/affiliates",
        access: "RESTRICTED",
        icon: Code,
        iconBg: "bg-emerald-600",
        cardBg: "bg-[#f0fdf4]",
        cardBorder: "border-[#bbf7d0]"
    },
    {
        id: "creator-studio",
        title: "CreatorStudio.gg",
        description: "CreatorStudio.gg is an AI-powered content engine for generating viral shorts & posts.",
        category: "Content & Creative",
        href: "/tools/design-editor",
        access: "GRANTED",
        icon: Sparkles,
        iconBg: "bg-pink-600",
        cardBg: "bg-[#fdf2f8]",
        cardBorder: "border-[#fbcfe8]"
    },
    {
        id: "image-gg",
        title: "Image.gg",
        description: "AI-powered image and video generator that creates stunning visuals on demand.",
        category: "Content & Creative",
        href: "/tools/design-editor",
        access: "GRANTED",
        icon: ImageIcon,
        iconBg: "bg-emerald-600",
        cardBg: "bg-[#f0fdf4]",
        cardBorder: "border-[#bbf7d0]"
    },
    {
        id: "pipe-leads-crm",
        title: "PipeLeads.ai CRM",
        description: "Sales pipeline management platform with lead tracking, deal stages, and tasks.",
        category: "CRM & Client Services",
        href: "/accounting",
        access: "GRANTED",
        icon: Layers,
        iconBg: "bg-teal-600",
        cardBg: "bg-[#f0f9ff]",
        cardBorder: "border-[#bae6fd]"
    },
    {
        id: "calendar-bug",
        title: "CalendarBug.com",
        description: "Online scheduling platform that simplifies booking meetings, calls, and consultations.",
        category: "Help Desk & Ops",
        href: "/admin/resources",
        access: "GRANTED",
        icon: Calendar,
        iconBg: "bg-emerald-600",
        cardBg: "bg-[#f0fdf4]",
        cardBorder: "border-[#bbf7d0]"
    },
    {
        id: "doc-signer",
        title: "DocSigner.ai",
        description: "Transform contracts into signed agreements in minutes with legally binding e-signatures.",
        category: "Help Desk & Ops",
        href: "/admin/docs",
        access: "RESTRICTED",
        icon: FileText,
        iconBg: "bg-indigo-600",
        cardBg: "bg-[#faf5ff]",
        cardBorder: "border-[#e9d5ff]"
    },
    {
        id: "chat-baser",
        title: "ChatBaser.ai",
        description: "AI chatbot platform that trains on your business content for 24/7 customer support.",
        category: "Help Desk & Ops",
        href: "/community",
        access: "GRANTED",
        icon: MessageSquare,
        iconBg: "bg-pink-600",
        cardBg: "bg-[#fdf2f8]",
        cardBorder: "border-[#fbcfe8]"
    },
    {
        id: "hd-helpdesk",
        title: "HDHelpDesk.com",
        description: "Full-featured customer support platform with smart ticketing, live chat, and knowledge base.",
        category: "Help Desk & Ops",
        href: "/community",
        access: "GRANTED",
        icon: Headphones,
        iconBg: "bg-indigo-600",
        cardBg: "bg-[#faf5ff]",
        cardBorder: "border-[#e9d5ff]"
    },
    {
        id: "project-baser",
        title: "ProjectBaser.com",
        description: "Project management app with Kanban, table, gallery, and calendar views for team tasks.",
        category: "Help Desk & Ops",
        href: "/whiteboard",
        access: "GRANTED",
        icon: Kanban,
        iconBg: "bg-orange-600",
        cardBg: "bg-[#fff7ed]",
        cardBorder: "border-[#fed7aa]"
    },
    {
        id: "groove-cm",
        title: "Groove.cm",
        description: "Your legacy Groove.cm dashboard and applications integration portal.",
        category: "Groove",
        href: "/dashboard",
        access: "RESTRICTED",
        icon: LayoutGrid,
        iconBg: "bg-pink-600",
        cardBg: "bg-[#fdf2f8]",
        cardBorder: "border-[#fbcfe8]"
    }
];

const CATEGORIES = [
    "Core Applications",
    "Sales & Marketing",
    "AI Tools & Branding",
    "Websites & Blogs",
    "Content & Creative",
    "CRM & Client Services",
    "Help Desk & Ops",
    "Groove",
    "All apps"
];

export default function ScalePlusDashboard() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All apps");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredApps = APPS.filter(app => {
        const matchesCategory = selectedCategory === "All apps" || app.category === selectedCategory;
        const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              app.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 bg-[#f8fafc] text-slate-900 font-sans">
            
            {/* 1. TOP FLOATING NAV PILLS BAR */}
            <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-xs flex items-center justify-between gap-1 overflow-x-auto scrollbar-hide">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#dcfce7] border border-green-200 text-[#166534] font-bold text-xs shadow-2xs whitespace-nowrap">
                    <div className="w-5 h-5 rounded-md bg-[#84cc16] flex items-center justify-center text-white text-[10px]">
                        <LayoutGrid className="w-3.5 h-3.5" />
                    </div>
                    <span>Apps</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-xs whitespace-nowrap transition-all">
                    <div className="w-5 h-5 rounded-md bg-fuchsia-500 flex items-center justify-center text-white text-[10px]">
                        <Lightbulb className="w-3.5 h-3.5" />
                    </div>
                    <span>Solutions</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-xs whitespace-nowrap transition-all">
                    <div className="w-5 h-5 rounded-md bg-rose-500 flex items-center justify-center text-white text-[10px]">
                        <Compass className="w-3.5 h-3.5" />
                    </div>
                    <span>Explore Apps</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-xs whitespace-nowrap transition-all">
                    <div className="w-5 h-5 rounded-md bg-amber-600 flex items-center justify-center text-white text-[10px]">
                        <Bot className="w-3.5 h-3.5" />
                    </div>
                    <span>Ask Emily</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-xs whitespace-nowrap transition-all">
                    <div className="w-5 h-5 rounded-md bg-orange-500 flex items-center justify-center text-white text-[10px]">
                        <Megaphone className="w-3.5 h-3.5" />
                    </div>
                    <span>News & Announcements</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-xs whitespace-nowrap transition-all">
                    <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center text-white text-[10px]">
                        <BarChart3 className="w-3.5 h-3.5" />
                    </div>
                    <span>Stats</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-xs whitespace-nowrap transition-all">
                    <div className="w-5 h-5 rounded-md bg-yellow-600 flex items-center justify-center text-white text-[10px]">
                        <HelpCircle className="w-3.5 h-3.5" />
                    </div>
                    <span>Support</span>
                </button>
            </div>

            {/* 2. DUAL GRADIENT HERO ANNOUNCEMENT BANNERS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Banner 1: Magenta / Pink Gradient */}
                <div className="relative rounded-2xl p-6 overflow-hidden scaleplus-banner-magenta text-white shadow-sm flex flex-col justify-between min-h-[130px]">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                            <Megaphone className="w-5 h-5 text-white" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold leading-snug">
                                We just released the Pro Max plan with our mastermind.
                            </h3>
                            <p className="text-white/80 text-xs">
                                Special deal for Groove Latino members: check your dashboard.
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-start">
                        <Link 
                            href="/my-products"
                            className="bg-white text-slate-900 hover:bg-slate-100 transition-all rounded-full px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-md"
                        >
                            Watch the replay. <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Banner 2: Royal Blue Gradient */}
                <div className="relative rounded-2xl p-6 overflow-hidden scaleplus-banner-blue text-white shadow-sm flex flex-col justify-between min-h-[130px]">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                            <Headphones className="w-5 h-5 text-white" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-extrabold tracking-tight">
                                ClickCoach.io
                            </h3>
                            <p className="text-white/80 text-xs">
                                Attention coaches: get more results for your students and higher-paying clients.
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-start">
                        <Link 
                            href="/catalog"
                            className="bg-white text-slate-900 hover:bg-slate-100 transition-all rounded-full px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-md"
                        >
                            ClickCoach is the Answer! <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

            </div>

            {/* 3. CATEGORY NAVIGATION SUBNAV BAR */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-2 shadow-xs flex items-center justify-between text-xs text-slate-600 font-medium overflow-x-auto scrollbar-hide gap-1">
                {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs ${
                                isSelected 
                                ? "bg-[#dcfce7] text-[#15803d] font-bold border border-green-300 shadow-2xs" 
                                : "hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>

            {/* 4. APP GRID CONTAINER */}
            <div className="space-y-4">
                
                {/* Header counter & search */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {filteredApps.length} AVAILABLE
                        </span>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            {selectedCategory === "All apps" ? "All apps" : selectedCategory}
                        </h2>
                    </div>

                    <div className="relative w-64">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search ${filteredApps.length} apps...`}
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
                        />
                    </div>
                </div>

                {/* Grid of Pastel Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredApps.map((app) => (
                        <Link 
                            key={app.id} 
                            href={app.href}
                            className={`group p-4 rounded-2xl border ${app.cardBg} ${app.cardBorder} hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3`}
                        >
                            <div>
                                {/* Icon box */}
                                <div className={`w-8 h-8 rounded-xl ${app.iconBg} text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 mb-2`}>
                                    <app.icon className="w-4 h-4" />
                                </div>

                                {/* Status indicator dot */}
                                <div className="flex items-center gap-1 text-[10px] font-extrabold tracking-wider uppercase mb-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${app.access === 'GRANTED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    <span className={app.access === 'GRANTED' ? 'text-emerald-700' : 'text-amber-700'}>
                                        ACCESS {app.access}
                                    </span>
                                </div>

                                {/* App Title */}
                                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {app.title}
                                </h3>

                                {/* Description */}
                                <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed font-normal">
                                    {app.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredApps.length === 0 && (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
                        <p className="text-slate-400 text-sm font-medium">No apps found matching "{searchQuery}"</p>
                    </div>
                )}

            </div>

        </div>
    );
}
