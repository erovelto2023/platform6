"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    ArrowLeft, 
    Globe, 
    MapPin, 
    Phone, 
    Mail, 
    Tag, 
    Key, 
    Building2, 
    Sparkles, 
    Copy, 
    Check, 
    FileText, 
    Lightbulb, 
    Pencil, 
    ExternalLink, 
    Download, 
    ShieldAlert,
    ChevronRight,
    Search,
    Share2,
    DollarSign,
    Users,
    Palette,
    Layers,
    MessageSquare,
    Target,
    Zap,
    Briefcase,
    TrendingUp,
    Lock,
    Award,
    BarChart3,
    Plus,
    Trash2,
    PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { updateCompetitor, updateCompetitorModule } from "@/lib/actions/competitor.actions";
import { createIdea } from "@/lib/actions/idea-pipeline.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define 33 Intelligence Categories Checklist
const INTEL_MODULES = [
    { key: "companyOverview", title: "1. Company Overview", icon: Building2, desc: "Name, DBA, founded year, CEO, HQ, locations, headcount, mission, vision, investors." },
    { key: "businessInfo", title: "2. Business Information", icon: Briefcase, desc: "Products, services, SaaS, digital/physical items, coaching, consulting, white label." },
    { key: "productAnalysis", title: "3. Product Analysis", icon: Layers, desc: "Features, benefits, SKU, upsells, downsells, guarantees, refund policy, star rating." },
    { key: "pricingStrategy", title: "4. Pricing Strategy", icon: DollarSign, desc: "Monthly, annual, lifetime, freemium, discounts, coupons, payment plans, price anchoring." },
    { key: "customerAvatar", title: "5. Customer Avatar", icon: Users, desc: "Age, gender, income, occupation, pain points, desires, goals, fears, buying habits." },
    { key: "brandIdentity", title: "6. Brand Identity", icon: Palette, desc: "Logo, colors, typography, brand voice, slogans, taglines, USP, emotional triggers." },
    { key: "websiteAnalysis", title: "7. Website Analysis", icon: Globe, desc: "Navigation, UX/UI, site speed, mobile-friendly, landing pages, funnels, live chat." },
    { key: "seoAudit", title: "8. SEO Audit", icon: Search, desc: "Domain authority, backlinks, organic traffic, top keywords, meta tags, schema." },
    { key: "contentMarketing", title: "9. Content Marketing", icon: FileText, desc: "Blog, videos, podcasts, webinars, lead magnets, white papers, case studies." },
    { key: "socialMedia", title: "10. Social Media Audit", icon: Share2, desc: "FB, IG, TikTok, YouTube, LinkedIn, X, Pinterest, Reddit, Discord, Threads." },
    { key: "youtubeAnalysis", title: "11. YouTube Analysis", icon: TrendingUp, desc: "Subscribers, upload frequency, views, thumbnail style, CTAs, Shorts strategy." },
    { key: "emailMarketing", title: "12. Email Marketing", icon: Mail, desc: "Welcome sequence, subject lines, open hooks, promotions, cart abandonment." },
    { key: "salesFunnel", title: "13. Sales Funnel", icon: Zap, desc: "Lead magnet, opt-in rate, tripwire, order bump, upsell, downsell, checkout." },
    { key: "advertising", title: "14. Advertising & Ads", icon: Target, desc: "Google, FB, IG, TikTok, LinkedIn, YouTube Ads, hooks, offers, retargeting." },
    { key: "salesCopy", title: "15. Sales Copy & Hooks", icon: MessageSquare, desc: "Headlines, subheadings, storytelling, scarcity, urgency, testimonials, closing." },
    { key: "customerExperience", title: "16. Customer Experience", icon: Award, desc: "Checkout speed, shipping, onboarding, live chat, phone support, return process." },
    { key: "reviews", title: "17. Reviews & Ratings", icon: Award, desc: "Average rating, total reviews, positive themes, complaints, feature requests." },
    { key: "reputation", title: "18. Reputation & Press", icon: ShieldAlert, desc: "Trustpilot, BBB, Reddit discussions, forum mentions, press coverage, PR." },
    { key: "techStack", title: "19. Technology Stack", icon: Layers, desc: "CMS, ecommerce, CRM, analytics, payment processor, CDN, email provider." },
    { key: "trafficSources", title: "20. Traffic Sources", icon: TrendingUp, desc: "Organic, direct, paid search, social, email, referrals, display, affiliates." },
    { key: "affiliateProgram", title: "21. Affiliate Program", icon: DollarSign, desc: "Commission rate, cookie length, payout frequency, promo materials, leaderboards." },
    { key: "partnerships", title: "22. Partnerships", icon: Users, desc: "Influencers, agencies, joint ventures, sponsors, podcast appearances." },
    { key: "hiring", title: "23. Hiring & Job Listings", icon: Briefcase, desc: "New departments, growth areas, salary ranges, tech used, future direction." },
    { key: "financialIndicators", title: "24. Financial Indicators", icon: DollarSign, desc: "Estimated revenue, MRR, ARR, profit margins, pricing growth, customer count." },
    { key: "customerCommunity", title: "25. Customer Community", icon: Users, desc: "FB groups, Discord, Slack, Circle, Skool, private memberships, events." },
    { key: "swotAnalysis", title: "26. SWOT Analysis", icon: Target, desc: "Strengths, Weaknesses, Opportunities, Threats." },
    { key: "competitiveAdvantages", title: "27. Competitive Advantages", icon: Award, desc: "Proprietary tech, patents, partnerships, brand recognition, loyal community." },
    { key: "weaknesses", title: "28. Weaknesses", icon: Lock, desc: "Poor reviews, slow support, outdated site, weak SEO, high prices." },
    { key: "opportunities", title: "29. Market Opportunities", icon: Sparkles, desc: "Missing products/keywords, poor service, underserved audience, geographic gaps." },
    { key: "marketingMetrics", title: "30. Marketing Metrics", icon: BarChart3, desc: "Monthly visitors, conversion rate, bounce rate, session duration, subscribers." },
    { key: "aiReadiness", title: "31. AI Readiness", icon: Sparkles, desc: "AI chatbot, AI search optimization, structured data, LLM content, AI tools." },
    { key: "legalCompliance", title: "32. Legal & Compliance", icon: Lock, desc: "Privacy policy, terms, cookies, GDPR, CCPA, accessibility, trademarks." },
    { key: "keyTakeaways", title: "33. Key Takeaways", icon: Lightbulb, desc: "Top 10 strengths/weaknesses, biggest complaints/desires, market gaps." }
];

const DELIVERABLE_REPORTS = [
    { title: "Executive Summary", desc: "High-level overview and strategic recommendations." },
    { title: "Company Profile", desc: "Core business facts, leadership, and market positioning." },
    { title: "Product & Pricing Matrix", desc: "Compare all competitor offerings and price points side-by-side." },
    { title: "Customer Persona Profile", desc: "Target audience demographics, pain points, and desires." },
    { title: "Marketing & Funnel Map", desc: "Acquisition, lead magnet, upsell, and conversion process." },
    { title: "SEO & Content Audit", desc: "Search rankings, content clusters, and keyword opportunities." },
    { title: "Social Media Dashboard", desc: "Audience size, engagement rates, and content strategy." },
    { title: "Customer Sentiment Analysis", desc: "Common praise, complaints, and unmet customer needs." },
    { title: "Technology Stack Inventory", desc: "CMS, CRM, analytics, payment processors, and automation tools." },
    { title: "SWOT Analysis", desc: "Comprehensive Strengths, Weaknesses, Opportunities, and Threats." },
    { title: "Opportunity Gap Report", desc: "Targeted areas where you can differentiate or outperform them." },
    { title: "Action Plan", desc: "Prioritized execution steps to capture market share." }
];

interface IntelItem {
    id: string;
    title: string;
    tag?: string;
    url?: string;
    content?: string;
    createdAt?: string;
}

interface CompetitorDashboardClientProps {
    competitor: any;
    initialIdeas: any[];
}

export function CompetitorDashboardClient({ competitor, initialIdeas }: CompetitorDashboardClientProps) {
    const [activeTab, setActiveTab] = useState<"modules" | "ai" | "deliverables" | "ideas">("modules");
    const [compData, setCompData] = useState(competitor);
    const [ideas, setIdeas] = useState(initialIdeas);
    
    // Active module multi-item modal state
    const [activeModule, setActiveModule] = useState<any>(null);
    const [moduleItems, setModuleItems] = useState<IntelItem[]>([]);
    const [isSavingModule, setIsSavingModule] = useState(false);

    // Form for adding a new item inside active module
    const [newItemTitle, setNewItemTitle] = useState("");
    const [newItemTag, setNewItemTag] = useState("");
    const [newItemUrl, setNewItemUrl] = useState("");
    const [newItemContent, setNewItemContent] = useState("");
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    // Metadata edit dialog
    const [isEditMetaOpen, setIsEditMetaOpen] = useState(false);
    const [metaForm, setMetaForm] = useState({
        name: competitor.name || "",
        webAddress: competitor.webAddress || "",
        address: competitor.address || "",
        city: competitor.city || "",
        state: competitor.state || "",
        zip: competitor.zip || "",
        country: competitor.country || "",
        phone: competitor.phone || "",
        fax: competitor.fax || "",
        email: competitor.email || "",
        nicheMarket: competitor.nicheMarket || "",
        primaryKeyword: competitor.primaryKeyword || "",
        notes: competitor.notes || ""
    });

    // New Idea Form
    const [isAddIdeaOpen, setIsAddIdeaOpen] = useState(false);
    const [newIdeaTitle, setNewIdeaTitle] = useState("");
    const [newIdeaCategory, setNewIdeaCategory] = useState("Products");
    const [newIdeaType, setNewIdeaType] = useState("Innovate");

    const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

    // OpenRouter AI Modal State
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);
    const [aiModalTitle, setAiModalTitle] = useState("");
    const [aiModalResult, setAiModalResult] = useState("");

    const router = useRouter();

    const handleRunAiPrompt = async (title: string, promptText: string) => {
        try {
            setIsGeneratingAi(true);
            setAiModalTitle(title);
            setAiModalResult("");
            setIsAiModalOpen(true);
            const { executeAiStrategyPrompt } = await import("@/lib/actions/competitor.actions");
            const res = await executeAiStrategyPrompt(promptText);
            if (res.success && res.result) {
                setAiModalResult(res.result);
                toast.success(`Generated ${title} via OpenRouter AI!`);
            } else {
                toast.error(res.error || "Failed to generate AI report");
                setAiModalResult(`⚠️ OpenRouter AI Error: ${res.error || "Please check your OPENROUTER_API_KEY in environment or Settings."}`);
            }
        } catch {
            toast.error("AI Generation failed");
        } finally {
            setIsGeneratingAi(false);
        }
    };

    const openModule = (mod: any) => {
        setActiveModule(mod);
        setEditingItemId(null);
        setNewItemTitle("");
        setNewItemTag("");
        setNewItemUrl("");
        setNewItemContent("");

        const existingData = compData.modulesData?.[mod.key];
        
        if (existingData && Array.isArray(existingData.items)) {
            setModuleItems(existingData.items);
        } else if (existingData && typeof existingData === 'object' && existingData.items) {
            setModuleItems(existingData.items);
        } else if (typeof existingData === 'string' && existingData.trim()) {
            // Convert legacy string to single item
            setModuleItems([{
                id: "legacy_1",
                title: "General Notes",
                content: existingData,
                createdAt: new Date().toLocaleDateString()
            }]);
        } else if (existingData && typeof existingData === 'object' && existingData.text) {
            setModuleItems([{
                id: "legacy_1",
                title: "General Notes",
                content: existingData.text,
                createdAt: new Date().toLocaleDateString()
            }]);
        } else {
            setModuleItems([]);
        }
    };

    const handleAddOrUpdateItem = () => {
        if (!newItemTitle.trim() && !newItemContent.trim()) {
            toast.error("Please enter a title or content for this item");
            return;
        }

        if (editingItemId) {
            setModuleItems(prev => prev.map(item => item.id === editingItemId ? {
                ...item,
                title: newItemTitle || item.title,
                tag: newItemTag,
                url: newItemUrl,
                content: newItemContent
            } : item));
            toast.success("Updated item");
            setEditingItemId(null);
        } else {
            const newItem: IntelItem = {
                id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                title: newItemTitle || "Untitled Entry",
                tag: newItemTag || "General",
                url: newItemUrl,
                content: newItemContent,
                createdAt: new Date().toLocaleDateString()
            };
            setModuleItems(prev => [...prev, newItem]);
            toast.success("Added intelligence item!");
        }

        setNewItemTitle("");
        setNewItemTag("");
        setNewItemUrl("");
        setNewItemContent("");
    };

    const handleEditItem = (item: IntelItem) => {
        setEditingItemId(item.id);
        setNewItemTitle(item.title);
        setNewItemTag(item.tag || "");
        setNewItemUrl(item.url || "");
        setNewItemContent(item.content || "");
    };

    const handleDeleteItem = (id: string) => {
        setModuleItems(prev => prev.filter(i => i.id !== id));
        if (editingItemId === id) {
            setEditingItemId(null);
            setNewItemTitle("");
            setNewItemTag("");
            setNewItemUrl("");
            setNewItemContent("");
        }
        toast.success("Item removed");
    };

    const handleSaveModule = async () => {
        if (!activeModule) return;

        try {
            setIsSavingModule(true);
            const payload = {
                items: moduleItems,
                updatedAt: new Date()
            };
            const res = await updateCompetitorModule(compData._id, activeModule.key, payload);
            if (res.success) {
                toast.success(`Saved ${activeModule.title} (${moduleItems.length} items)`);
                setCompData(res.competitor);
                setActiveModule(null);
            } else {
                toast.error("Failed to save module");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsSavingModule(false);
        }
    };

    const handleSaveMeta = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await updateCompetitor(compData._id, metaForm);
            if (res.success) {
                toast.success("Updated competitor metadata");
                setCompData(res.competitor);
                setIsEditMetaOpen(false);
            } else {
                toast.error("Failed to update");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    const handleCreateIdea = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIdeaTitle.trim()) return;

        try {
            const res = await createIdea({
                title: newIdeaTitle,
                competitorId: compData._id,
                competitorName: compData.name,
                category: newIdeaCategory,
                opportunityType: newIdeaType
            });
            if (res.success) {
                toast.success("Logged new counter-idea!");
                setIdeas(prev => [res.idea, ...prev]);
                setIsAddIdeaOpen(false);
                setNewIdeaTitle("");
            } else {
                toast.error("Failed to log idea");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    // AI Auto Extractor Handler
    const [isExtracting, setIsExtracting] = useState(false);
    const handleAutoExtract = async () => {
        if (!compData.webAddress) {
            toast.error("Please enter a Web Address (URL) first");
            return;
        }

        try {
            setIsExtracting(true);
            toast.loading("Scanning website & extracting tech stack...", { id: "extracting" });
            const { extractCompetitorIntelFromUrl } = await import("@/lib/actions/competitor.actions");
            const res = await extractCompetitorIntelFromUrl(compData.webAddress);
            
            if (res.success && res.extracted) {
                const { title, description, detectedTech, email, socialLinks } = res.extracted;
                toast.success(`Scraped website! Detected ${detectedTech.length} technologies.`, { id: "extracting" });
                
                // Save Tech Stack items if detected
                if (detectedTech.length > 0) {
                    const techItems = detectedTech.map((tech: string, i: number) => ({
                        id: `tech_${Date.now()}_${i}`,
                        title: tech,
                        tag: "Detected Tech",
                        content: `Auto-detected from ${compData.webAddress}`,
                        createdAt: new Date().toLocaleDateString()
                    }));
                    await updateCompetitorModule(compData._id, "techStack", { items: techItems, updatedAt: new Date() });
                }

                // Update contact email if empty
                if (email && !compData.email) {
                    await updateCompetitor(compData._id, { email });
                }

                router.refresh();
            } else {
                toast.error(res.error || "Could not scrape website", { id: "extracting" });
            }
        } catch {
            toast.error("Extraction failed", { id: "extracting" });
        } finally {
            setIsExtracting(false);
        }
    };

    // AI Prompt Generators that iterate over multi-items
    const generateSalesBattlecardPrompt = () => {
        return `Generate a 1-page Sales Battlecard for our sales team competing against "${compData.name}" (${compData.webAddress || 'N/A'}).
Niche Market: ${compData.nicheMarket || 'N/A'}
Primary Keyword: ${compData.primaryKeyword || 'N/A'}

Competitor Intelligence Data:
${JSON.stringify(compData.modulesData || {}, null, 2)}

Produce a structured Sales Battlecard with:
1. Executive Snapshot: Who they are and their core pitch.
2. 3 Killer Differentiators: Why prospects should buy from US instead of them.
3. Pricing & Value Objection Handling Scripts: What to say when a prospect says "[Competitor] is cheaper" or "I am already using [Competitor]".
4. Landmine Questions to Ask Prospects: 3 questions that highlight [Competitor]'s biggest weak spots.`;
    };

    const generateFullStrategyPrompt = () => {
        return `I am conducting a comprehensive ethical competitor analysis on "${compData.name}" (${compData.webAddress || 'N/A'}).
Niche Market: ${compData.nicheMarket || 'N/A'}
Target Keyword: ${compData.primaryKeyword || 'N/A'}
HQ Location: ${[compData.city, compData.state, compData.country].filter(Boolean).join(', ') || 'N/A'}

Here is all collected intelligence structured by category and multiple items:
${JSON.stringify(compData.modulesData || {}, null, 2)}

TASK: Acting as a top-tier Chief Marketing Officer and Competitive Strategy Expert, analyze all of the information above and produce:
1. Executive Strategic Assessment: Why are customers buying from them instead of us right now?
2. Position Vulnerabilities: The 5 biggest market gaps and weak spots they are missing.
3. Counter-Marketing Strategy: A step-by-step plan to position our brand as the superior choice.
4. Ad Hook & Offer Recommendations: 3 high-converting offer hooks that exploit their price and feature weaknesses.`;
    };

    const generateAdHookPrompt = () => {
        return `Create a high-converting counter-advertising campaign designed to outperform "${compData.name}" (${compData.webAddress || 'N/A'}).
Niche: ${compData.nicheMarket || 'N/A'}
Primary Keyword: ${compData.primaryKeyword || 'N/A'}

Competitor Intel Items:
${JSON.stringify(compData.modulesData || {}, null, 2)}

Produce 5 distinct ad scripts for Meta/TikTok/Google Ads with:
- Scroll-stopping hooks addressing their common customer complaints
- Unique value proposition comparing our solution vs theirs
- Clear call-to-action to try our alternative.`;
    };

    const generateSeoHijackPrompt = () => {
        return `Create a high-authority SEO Content Strategy to outrank competitor "${compData.name}" (${compData.webAddress || 'N/A'}).
Niche Market: ${compData.nicheMarket || 'N/A'}
Target Keyword: ${compData.primaryKeyword || 'N/A'}

Competitor Intel:
${JSON.stringify(compData.modulesData || {}, null, 2)}

Produce:
1. Top 5 High-Intent Blog Titles targeting their missing keywords.
2. Search Intent & Keyword Clustering Strategy.
3. Content Architecture & Internal Linking Roadmap.`;
    };

    const generateEmailPoachPrompt = () => {
        return `Create a 5-Part Automated Email Poaching Sequence targeting customers of "${compData.name}".
Niche Market: ${compData.nicheMarket || 'N/A'}

Competitor Intel:
${JSON.stringify(compData.modulesData || {}, null, 2)}

Write 5 distinct emails:
- Email 1: The Secret Competitors Don't Want You to Know
- Email 2: Why [Competitor] Users Are Switching to Us
- Email 3: Side-by-Side Feature & Pricing Comparison
- Email 4: Real Migration Case Study & Testimonial
- Email 5: Exclusive "Switch & Save" Deal + Free Onboarding`;
    };

    const generateVideoScriptPrompt = () => {
        return `Create 3 short-form viral video scripts (TikTok / Instagram Reels / YouTube Shorts) exposing weakness points of "${compData.name}".
Niche Market: ${compData.nicheMarket || 'N/A'}

Competitor Weakness Intel:
${JSON.stringify(compData.modulesData || {}, null, 2)}

Produce 3 distinct 30-second scripts with:
- Visual Hook & On-screen text
- Verbal Hook exposing competitor complaints
- Product comparison demonstration
- Strong Call to Action (CTA)`;
    };

    const generateUxRoadmapPrompt = () => {
        return `Generate a Product UX & Micro-Feature Roadmap to outperform competitor "${compData.name}".
Niche: ${compData.nicheMarket || 'N/A'}

Competitor Intel:
${JSON.stringify(compData.modulesData || {}, null, 2)}

Provide 5 specific product micro-features and workflow improvements to build that eliminate their biggest user friction points.`;
    };

    const generateAffiliatePoachPrompt = () => {
        return `Create an Affiliate & Partner Poaching Outreach Campaign for top influencers promoting "${compData.name}".
Niche: ${compData.nicheMarket || 'N/A'}

Produce:
1. Cold Outreach Email Script to top review bloggers and YouTubers.
2. Commission Structure & Partner Bonus Incentive Package.
3. 3 Key Selling Points why promoting our platform earns them 2x more.`;
    };

    const generateSwotPrompt = () => {
        return `Generate an Executive 4-Quadrant SWOT Matrix Analysis on "${compData.name}".
Niche: ${compData.nicheMarket || 'N/A'}

Collected Data:
${JSON.stringify(compData.modulesData || {}, null, 2)}

Provide structured Strengths, Weaknesses, Opportunities, and Threats with strategic execution steps.`;
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedPrompt(label);
        toast.success(`Copied ${label} to clipboard!`);
        setTimeout(() => setCopiedPrompt(null), 2500);
    };

    const completedCount = Object.keys(compData.modulesData || {}).filter(k => {
        const val = compData.modulesData[k];
        if (!val) return false;
        if (Array.isArray(val.items)) return val.items.length > 0;
        if (typeof val === 'string') return val.trim().length > 0;
        if (typeof val === 'object') return Object.keys(val).length > 0;
        return false;
    }).length;

    // Vulnerability Scorecard Calculation (0-100)
    const weaknessItems = Array.isArray(compData.modulesData?.weaknesses?.items) ? compData.modulesData.weaknesses.items.length : 0;
    const complaintItems = Array.isArray(compData.modulesData?.reviews?.items) ? compData.modulesData.reviews.items.length : 0;
    const oppItems = Array.isArray(compData.modulesData?.opportunities?.items) ? compData.modulesData.opportunities.items.length : 0;
    
    // Higher score = more vulnerable competitor (easier to beat)
    const vulnerabilityScore = Math.min(98, Math.max(35, 40 + (weaknessItems * 10) + (complaintItems * 8) + (oppItems * 6)));

    const generateCounterOfferPrompt = () => {
        return `Generate 3 high-converting counter-offer deals designed to poach customers from competitor "${compData.name}" (${compData.webAddress || 'N/A'}).
Niche Market: ${compData.nicheMarket || 'N/A'}
Target Keyword: ${compData.primaryKeyword || 'N/A'}

Competitor Intelligence Facts:
${JSON.stringify(compData.modulesData || {}, null, 2)}

Produce 3 distinct Counter-Offer deals:
1. The "Switch & Save" Deal: Exploit their subscription cost and hidden fees.
2. The "All-Inclusive" Package: Include features they lock behind high tiers.
3. The "Zero-Risk" Guarantee: Offer a superior guarantee or free migration.`;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            
            {/* TOP NAVIGATION & HEADER */}
            <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <Link href="/tools/competition-black-book" className="inline-flex items-center text-xs font-mono font-bold text-rose-400 hover:text-amber-300 transition">
                        <ArrowLeft className="h-4 w-4 mr-1.5" />
                        Back to Competitors Vault
                    </Link>

                    <div className="flex items-center gap-2 font-mono text-xs">
                        <Link href="/tools/competition-black-book/ad-swipe">
                            <Button size="sm" variant="outline" className="bg-slate-900 border-slate-800 text-rose-400 font-bold h-8">
                                🖼️ Ad Swipe Vault
                            </Button>
                        </Link>
                        <Link href="/tools/competition-black-book/positioning">
                            <Button size="sm" variant="outline" className="bg-slate-900 border-slate-800 text-amber-400 font-bold h-8">
                                🗺️ 2x2 Positioning Map
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-black font-mono text-2xl shrink-0">
                                {compData.name.slice(0, 2).toUpperCase()}
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-2xl md:text-3xl font-black text-slate-100 font-mono tracking-tight">
                                        {compData.name}
                                    </h1>
                                    <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950 border border-rose-800 px-2.5 py-1 rounded-full uppercase">
                                        Vulnerability Score: {vulnerabilityScore}/100 {vulnerabilityScore >= 70 ? "(High Market Opportunity)" : ""}
                                    </span>
                                </div>

                                {compData.webAddress && (
                                    <a 
                                        href={compData.webAddress.startsWith('http') ? compData.webAddress : `https://${compData.webAddress}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs font-mono text-slate-400 hover:text-amber-300 flex items-center gap-1.5"
                                    >
                                        <Globe className="h-3.5 w-3.5 text-rose-400" />
                                        {compData.webAddress}
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            <Button 
                                onClick={() => handleRunAiPrompt("Counter-Offer & Pricing Attack Deals", generateCounterOfferPrompt())}
                                className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono text-xs font-bold h-11 px-4 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
                            >
                                <Sparkles className="h-4 w-4 text-amber-300" />
                                💣 AI Counter-Offer Generator
                            </Button>

                            <Button 
                                onClick={handleAutoExtract}
                                disabled={isExtracting}
                                className="bg-slate-950 border border-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-800 font-mono text-xs font-bold h-11 px-4 rounded-xl flex items-center gap-2 cursor-pointer"
                            >
                                <Zap className="h-4 w-4 text-amber-400" />
                                {isExtracting ? "Extracting..." : "Auto-Extract Intel"}
                            </Button>

                            <Link href="/tools/competition-black-book/compare">
                                <Button variant="outline" className="bg-slate-950 border-slate-800 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 font-mono text-xs font-bold h-11 px-4 rounded-xl flex items-center gap-2 cursor-pointer">
                                    <BarChart3 className="h-4 w-4" />
                                    Compare Matrix
                                </Button>
                            </Link>

                            <Dialog open={isEditMetaOpen} onOpenChange={setIsEditMetaOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800 font-mono text-xs font-bold h-11 px-4 rounded-xl flex items-center gap-2 cursor-pointer">
                                        <Pencil className="h-4 w-4 text-amber-400" />
                                        Edit Details
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto font-sans">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-black uppercase font-mono text-slate-100">
                                            Edit Competitor Details
                                        </DialogTitle>
                                    </DialogHeader>

                                    <form onSubmit={handleSaveMeta} className="space-y-4 pt-2 font-mono text-xs">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block font-bold text-slate-300 mb-1">Name</label>
                                                <Input 
                                                    value={metaForm.name} 
                                                    onChange={e => setMetaForm({ ...metaForm, name: e.target.value })}
                                                    className="bg-slate-950 border-slate-800"
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-bold text-slate-300 mb-1">Web Address</label>
                                                <Input 
                                                    value={metaForm.webAddress} 
                                                    onChange={e => setMetaForm({ ...metaForm, webAddress: e.target.value })}
                                                    className="bg-slate-950 border-slate-800"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block font-bold text-slate-300 mb-1">Niche Market</label>
                                                <Input 
                                                    value={metaForm.nicheMarket} 
                                                    onChange={e => setMetaForm({ ...metaForm, nicheMarket: e.target.value })}
                                                    className="bg-slate-950 border-slate-800"
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-bold text-slate-300 mb-1">Primary Keyword</label>
                                                <Input 
                                                    value={metaForm.primaryKeyword} 
                                                    onChange={e => setMetaForm({ ...metaForm, primaryKeyword: e.target.value })}
                                                    className="bg-slate-950 border-slate-800"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="block font-bold text-slate-300 mb-1">Phone</label>
                                                <Input value={metaForm.phone} onChange={e => setMetaForm({ ...metaForm, phone: e.target.value })} className="bg-slate-950 border-slate-800" />
                                            </div>
                                            <div>
                                                <label className="block font-bold text-slate-300 mb-1">Fax</label>
                                                <Input value={metaForm.fax} onChange={e => setMetaForm({ ...metaForm, fax: e.target.value })} className="bg-slate-950 border-slate-800" />
                                            </div>
                                            <div>
                                                <label className="block font-bold text-slate-300 mb-1">Email</label>
                                                <Input value={metaForm.email} onChange={e => setMetaForm({ ...metaForm, email: e.target.value })} className="bg-slate-950 border-slate-800" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-300 mb-1">Address</label>
                                            <Input value={metaForm.address} onChange={e => setMetaForm({ ...metaForm, address: e.target.value })} className="bg-slate-950 border-slate-800" />
                                        </div>

                                        <div className="grid grid-cols-4 gap-3">
                                            <div>
                                                <label className="block font-bold text-slate-300 mb-1">City</label>
                                                <Input value={metaForm.city} onChange={e => setMetaForm({ ...metaForm, city: e.target.value })} className="bg-slate-950 border-slate-800" />
                                            </div>
                                            <div>
                                                <label className="block font-bold text-slate-300 mb-1">State</label>
                                                <Input value={metaForm.state} onChange={e => setMetaForm({ ...metaForm, state: e.target.value })} className="bg-slate-950 border-slate-800" />
                                            </div>
                                            <div>
                                                <label className="block font-bold text-slate-300 mb-1">Zip</label>
                                                <Input value={metaForm.zip} onChange={e => setMetaForm({ ...metaForm, zip: e.target.value })} className="bg-slate-950 border-slate-800" />
                                            </div>
                                            <div>
                                                <label className="block font-bold text-slate-300 mb-1">Country</label>
                                                <Input value={metaForm.country} onChange={e => setMetaForm({ ...metaForm, country: e.target.value })} className="bg-slate-950 border-slate-800" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-300 mb-1">Notes</label>
                                            <textarea rows={3} value={metaForm.notes} onChange={e => setMetaForm({ ...metaForm, notes: e.target.value })} className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-xl" />
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button type="button" variant="ghost" onClick={() => setIsEditMetaOpen(false)}>Cancel</Button>
                                            <Button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase">Save Changes</Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Button 
                                onClick={() => setActiveTab("ai")}
                                className="bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider h-11 px-5 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                            >
                                <Sparkles className="h-4 w-4" />
                                AI Strategy Generator
                            </Button>
                        </div>
                    </div>

                    {/* METADATA FACT STRIP */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 font-mono text-xs">
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Primary Keyword</span>
                            <span className="text-slate-200 font-bold">{compData.primaryKeyword || "Not Specified"}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Corporate HQ</span>
                            <span className="text-slate-200 font-bold">{[compData.city, compData.state, compData.country].filter(Boolean).join(", ") || "Not Specified"}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Phone / Fax</span>
                            <span className="text-slate-200 font-bold">{compData.phone || compData.fax || "Not Specified"}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Intel Completion</span>
                            <span className="text-amber-400 font-black">{completedCount} / 33 Modules ({Math.round((completedCount / 33) * 100)}%)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex border-b border-slate-800 gap-2 font-mono text-xs overflow-x-auto pb-1">
                <button
                    onClick={() => setActiveTab("modules")}
                    className={`px-5 py-3 rounded-t-2xl font-black uppercase flex items-center gap-2 transition cursor-pointer shrink-0 ${
                        activeTab === "modules"
                            ? "bg-slate-900 border-t border-x border-slate-800 text-rose-400"
                            : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                    <Building2 className="h-4 w-4" />
                    33 Intelligence Modules ({completedCount}/33)
                </button>

                <button
                    onClick={() => setActiveTab("ai")}
                    className={`px-5 py-3 rounded-t-2xl font-black uppercase flex items-center gap-2 transition cursor-pointer shrink-0 ${
                        activeTab === "ai"
                            ? "bg-slate-900 border-t border-x border-slate-800 text-amber-400"
                            : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                    <Sparkles className="h-4 w-4" />
                    AI Strategy & Prompts
                </button>

                <button
                    onClick={() => setActiveTab("deliverables")}
                    className={`px-5 py-3 rounded-t-2xl font-black uppercase flex items-center gap-2 transition cursor-pointer shrink-0 ${
                        activeTab === "deliverables"
                            ? "bg-slate-900 border-t border-x border-slate-800 text-cyan-400"
                            : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                    <FileText className="h-4 w-4" />
                    Structured Deliverables (12 Reports)
                </button>

                <button
                    onClick={() => setActiveTab("ideas")}
                    className={`px-5 py-3 rounded-t-2xl font-black uppercase flex items-center gap-2 transition cursor-pointer shrink-0 ${
                        activeTab === "ideas"
                            ? "bg-slate-900 border-t border-x border-slate-800 text-emerald-400"
                            : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                    <Lightbulb className="h-4 w-4" />
                    Counter-Ideas ({ideas.length})
                </button>
            </div>

            {/* TAB 1: 33 INTELLIGENCE MODULES */}
            {activeTab === "modules" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black font-mono uppercase text-slate-100 tracking-tight flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-rose-400" />
                                Competitor Intelligence Checklist (33 Categories)
                            </h2>
                            <p className="text-xs font-mono text-slate-400 mt-1">
                                Click on any category to add multiple separated intelligence items (products, ads, pricing plans, reviews, etc.).
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {INTEL_MODULES.map((mod) => {
                            const Icon = mod.icon;
                            const modData = compData.modulesData?.[mod.key];
                            
                            let itemCount = 0;
                            if (modData) {
                                if (Array.isArray(modData.items)) itemCount = modData.items.length;
                                else if (typeof modData === 'string' && modData.trim()) itemCount = 1;
                                else if (typeof modData === 'object' && modData.text) itemCount = 1;
                            }

                            return (
                                <div 
                                    key={mod.key} 
                                    onClick={() => openModule(mod)}
                                    className={`bg-slate-900 border rounded-3xl p-6 shadow-xl space-y-3 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between ${
                                        itemCount > 0 ? "border-amber-500/50 bg-slate-900/90" : "border-slate-800 hover:border-rose-500/50"
                                    }`}
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-rose-400">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            {itemCount > 0 ? (
                                                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                                                    {itemCount} {itemCount === 1 ? "Item" : "Items"}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-950 border border-slate-800 px-2.5 py-0.5 rounded-full uppercase">
                                                    Pending
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-base font-bold font-mono text-slate-100 pt-1">
                                            {mod.title}
                                        </h3>
                                        <p className="text-xs font-mono text-slate-400 leading-relaxed">
                                            {mod.desc}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-rose-400">
                                        <span>{itemCount > 0 ? `Manage ${itemCount} Items` : "+ Add Items"}</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB 2: AI STRATEGY & PROMPTS */}
            {activeTab === "ai" && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
                    <div>
                        <h2 className="text-xl font-black font-mono uppercase text-slate-100 tracking-tight flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-amber-400" />
                            AI Competitor Strategy & Prompt Generator
                        </h2>
                        <p className="text-xs font-mono text-slate-400 mt-1">
                            Copy these tailored prompts directly into ChatGPT, Claude, or Gemini to build complete marketing strategies and counter-campaigns based on collected competitor data.
                        </p>
                    </div>

                    {/* PROMPT 1: FULL MARKETING PLAN */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="text-sm font-bold font-mono text-amber-400 flex items-center gap-2">
                                1. Full Competitor Marketing Strategy Prompt
                            </h3>
                            <div className="flex items-center gap-2">
                                <Button 
                                    onClick={() => handleRunAiPrompt("Full Competitor Marketing Strategy", generateFullStrategyPrompt())}
                                    size="sm"
                                    className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-mono text-xs font-black uppercase shadow-lg flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    ⚡ Run via OpenRouter AI
                                </Button>
                                <Button 
                                    onClick={() => copyToClipboard(generateFullStrategyPrompt(), "Full Strategy Prompt")}
                                    size="sm"
                                    variant="outline"
                                    className="bg-slate-900 border-slate-800 text-slate-300 font-mono text-xs font-bold uppercase"
                                >
                                    {copiedPrompt === "Full Strategy Prompt" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    Copy Prompt
                                </Button>
                            </div>
                        </div>
                        <textarea 
                            readOnly 
                            rows={6}
                            value={generateFullStrategyPrompt()} 
                            className="w-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs rounded-xl p-4 focus:outline-none resize-none"
                        />
                    </div>

                    {/* PROMPT 2: COUNTER-AD HOOKS */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="text-sm font-bold font-mono text-rose-400 flex items-center gap-2">
                                2. Counter-Ad Campaign & Copy Hook Hijack Prompt
                            </h3>
                            <div className="flex items-center gap-2">
                                <Button 
                                    onClick={() => handleRunAiPrompt("Counter-Ad Campaign Strategy", generateAdHookPrompt())}
                                    size="sm"
                                    className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-mono text-xs font-black uppercase shadow-lg flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    ⚡ Run via OpenRouter AI
                                </Button>
                                <Button 
                                    onClick={() => copyToClipboard(generateAdHookPrompt(), "Ad Hook Prompt")}
                                    size="sm"
                                    variant="outline"
                                    className="bg-slate-900 border-slate-800 text-slate-300 font-mono text-xs font-bold uppercase"
                                >
                                    {copiedPrompt === "Ad Hook Prompt" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    Copy Prompt
                                </Button>
                            </div>
                        </div>
                        <textarea 
                            readOnly 
                            rows={6}
                            value={generateAdHookPrompt()} 
                            className="w-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs rounded-xl p-4 focus:outline-none resize-none"
                        />
                    </div>

                    {/* PROMPT 3: SALES BATTLECARD */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="text-sm font-bold font-mono text-cyan-400 flex items-center gap-2">
                                3. Sales & Objection Handling Battlecard Prompt
                            </h3>
                            <div className="flex items-center gap-2">
                                <Button 
                                    onClick={() => handleRunAiPrompt("1-Page Sales Battlecard", generateSalesBattlecardPrompt())}
                                    size="sm"
                                    className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-mono text-xs font-black uppercase shadow-lg flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    ⚡ Run via OpenRouter AI
                                </Button>
                                <Button 
                                    onClick={() => copyToClipboard(generateSalesBattlecardPrompt(), "Sales Battlecard Prompt")}
                                    size="sm"
                                    variant="outline"
                                    className="bg-slate-900 border-slate-800 text-slate-300 font-mono text-xs font-bold uppercase"
                                >
                                    {copiedPrompt === "Sales Battlecard Prompt" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    Copy Prompt
                                </Button>
                            </div>
                        </div>
                        <textarea readOnly rows={5} value={generateSalesBattlecardPrompt()} className="w-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs rounded-xl p-4 focus:outline-none resize-none" />
                    </div>

                    {/* PROMPT 4: SEO HIJACK */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-2">
                                4. SEO & Organic Keyword Hijack Strategy Prompt
                            </h3>
                            <div className="flex items-center gap-2">
                                <Button 
                                    onClick={() => handleRunAiPrompt("SEO Content Hijack Plan", generateSeoHijackPrompt())}
                                    size="sm"
                                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-mono text-xs font-black uppercase shadow-lg flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    ⚡ Run via OpenRouter AI
                                </Button>
                                <Button onClick={() => copyToClipboard(generateSeoHijackPrompt(), "SEO Hijack Prompt")} size="sm" variant="outline" className="bg-slate-900 border-slate-800 text-slate-300 font-mono text-xs font-bold uppercase">
                                    {copiedPrompt === "SEO Hijack Prompt" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    Copy Prompt
                                </Button>
                            </div>
                        </div>
                        <textarea readOnly rows={5} value={generateSeoHijackPrompt()} className="w-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs rounded-xl p-4 focus:outline-none resize-none" />
                    </div>

                    {/* PROMPT 5: EMAIL POACHING */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="text-sm font-bold font-mono text-purple-400 flex items-center gap-2">
                                5. 5-Part Customer Poaching Email Sequence Prompt
                            </h3>
                            <div className="flex items-center gap-2">
                                <Button 
                                    onClick={() => handleRunAiPrompt("5-Part Email Poaching Sequence", generateEmailPoachPrompt())}
                                    size="sm"
                                    className="bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-400 hover:to-rose-400 text-slate-950 font-mono text-xs font-black uppercase shadow-lg flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    ⚡ Run via OpenRouter AI
                                </Button>
                                <Button onClick={() => copyToClipboard(generateEmailPoachPrompt(), "Email Poach Prompt")} size="sm" variant="outline" className="bg-slate-900 border-slate-800 text-slate-300 font-mono text-xs font-bold uppercase">
                                    {copiedPrompt === "Email Poach Prompt" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    Copy Prompt
                                </Button>
                            </div>
                        </div>
                        <textarea readOnly rows={5} value={generateEmailPoachPrompt()} className="w-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs rounded-xl p-4 focus:outline-none resize-none" />
                    </div>

                    {/* PROMPT 6: VIRAL VIDEO SCRIPTS */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="text-sm font-bold font-mono text-pink-400 flex items-center gap-2">
                                6. Viral Video Scripts (TikTok / Reels / Shorts) Prompt
                            </h3>
                            <div className="flex items-center gap-2">
                                <Button 
                                    onClick={() => handleRunAiPrompt("Viral Video Scripts", generateVideoScriptPrompt())}
                                    size="sm"
                                    className="bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-slate-950 font-mono text-xs font-black uppercase shadow-lg flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    ⚡ Run via OpenRouter AI
                                </Button>
                                <Button onClick={() => copyToClipboard(generateVideoScriptPrompt(), "Video Script Prompt")} size="sm" variant="outline" className="bg-slate-900 border-slate-800 text-slate-300 font-mono text-xs font-bold uppercase">
                                    {copiedPrompt === "Video Script Prompt" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    Copy Prompt
                                </Button>
                            </div>
                        </div>
                        <textarea readOnly rows={5} value={generateVideoScriptPrompt()} className="w-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs rounded-xl p-4 focus:outline-none resize-none" />
                    </div>

                    {/* PROMPT 7: UX ROADMAP */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="text-sm font-bold font-mono text-amber-300 flex items-center gap-2">
                                7. Product UX & Micro-Feature Roadmap Prompt
                            </h3>
                            <div className="flex items-center gap-2">
                                <Button 
                                    onClick={() => handleRunAiPrompt("Product UX Roadmap", generateUxRoadmapPrompt())}
                                    size="sm"
                                    className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-mono text-xs font-black uppercase shadow-lg flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    ⚡ Run via OpenRouter AI
                                </Button>
                                <Button onClick={() => copyToClipboard(generateUxRoadmapPrompt(), "UX Roadmap Prompt")} size="sm" variant="outline" className="bg-slate-900 border-slate-800 text-slate-300 font-mono text-xs font-bold uppercase">
                                    {copiedPrompt === "UX Roadmap Prompt" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    Copy Prompt
                                </Button>
                            </div>
                        </div>
                        <textarea readOnly rows={5} value={generateUxRoadmapPrompt()} className="w-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs rounded-xl p-4 focus:outline-none resize-none" />
                    </div>

                    {/* PROMPT 8: AFFILIATE POACHING */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="text-sm font-bold font-mono text-blue-400 flex items-center gap-2">
                                8. Affiliate & Partner Poaching Campaign Prompt
                            </h3>
                            <div className="flex items-center gap-2">
                                <Button 
                                    onClick={() => handleRunAiPrompt("Affiliate Poaching Campaign", generateAffiliatePoachPrompt())}
                                    size="sm"
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-slate-950 font-mono text-xs font-black uppercase shadow-lg flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    ⚡ Run via OpenRouter AI
                                </Button>
                                <Button onClick={() => copyToClipboard(generateAffiliatePoachPrompt(), "Affiliate Poach Prompt")} size="sm" variant="outline" className="bg-slate-900 border-slate-800 text-slate-300 font-mono text-xs font-bold uppercase">
                                    {copiedPrompt === "Affiliate Poach Prompt" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    Copy Prompt
                                </Button>
                            </div>
                        </div>
                        <textarea readOnly rows={5} value={generateAffiliatePoachPrompt()} className="w-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs rounded-xl p-4 focus:outline-none resize-none" />
                    </div>

                    {/* PROMPT 9: SWOT MATRIX */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="text-sm font-bold font-mono text-teal-400 flex items-center gap-2">
                                9. Executive 4-Quadrant SWOT Matrix Prompt
                            </h3>
                            <div className="flex items-center gap-2">
                                <Button 
                                    onClick={() => handleRunAiPrompt("Executive SWOT Matrix", generateSwotPrompt())}
                                    size="sm"
                                    className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-mono text-xs font-black uppercase shadow-lg flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    ⚡ Run via OpenRouter AI
                                </Button>
                                <Button onClick={() => copyToClipboard(generateSwotPrompt(), "SWOT Prompt")} size="sm" variant="outline" className="bg-slate-900 border-slate-800 text-slate-300 font-mono text-xs font-bold uppercase">
                                    {copiedPrompt === "SWOT Prompt" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    Copy Prompt
                                </Button>
                            </div>
                        </div>
                        <textarea readOnly rows={5} value={generateSwotPrompt()} className="w-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs rounded-xl p-4 focus:outline-none resize-none" />
                    </div>
                </div>
            )}

            {/* TAB 3: STRUCTURED DELIVERABLES */}
            {activeTab === "deliverables" && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-black font-mono uppercase text-slate-100 tracking-tight flex items-center gap-2">
                            <FileText className="h-5 w-5 text-cyan-400" />
                            Structured Actionable Deliverables (12 Output Frameworks)
                        </h2>
                        <p className="text-xs font-mono text-slate-400 mt-1">
                            Organize your competitor intelligence into executive-ready reports for your team and strategy meetings.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {DELIVERABLE_REPORTS.map((rep, idx) => (
                            <div key={rep.title} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 border border-cyan-800 px-2.5 py-0.5 rounded-full uppercase">
                                        DELIVERABLE #{idx + 1}
                                    </span>
                                    <h3 className="text-base font-bold font-mono text-slate-100">{rep.title}</h3>
                                    <p className="text-xs font-mono text-slate-400 leading-relaxed">{rep.desc}</p>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-slate-800">
                                    <Button 
                                        onClick={() => {
                                            const reportPrompt = `Generate the "${rep.title}" deliverable report for target competitor "${compData.name}" (${compData.webAddress || 'N/A'}).\n\nObjective: ${rep.desc}\nNiche: ${compData.nicheMarket || 'N/A'}\nTarget Keyword: ${compData.primaryKeyword || 'N/A'}\n\nCollected Intelligence Items:\n${JSON.stringify(compData.modulesData || {}, null, 2)}\n\nProduce a structured, professional markdown report.`;
                                            handleRunAiPrompt(`${rep.title} Report`, reportPrompt);
                                        }}
                                        className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-mono text-xs font-black uppercase h-10 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                                    >
                                        <Sparkles className="h-4 w-4" />
                                        ⚡ Run via OpenRouter AI
                                    </Button>

                                    <Button 
                                        onClick={() => {
                                            const reportContent = `# ${rep.title} - ${compData.name}\n\nGenerated Report for ${compData.name} (${compData.webAddress || 'N/A'}).\n\nNiche: ${compData.nicheMarket || 'N/A'}\nTarget Keyword: ${compData.primaryKeyword || 'N/A'}\n\nCollected Intelligence Summary:\n${JSON.stringify(compData.modulesData || {}, null, 2)}`;
                                            copyToClipboard(reportContent, `${rep.title} Report`);
                                        }}
                                        variant="outline"
                                        className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[11px] font-bold uppercase h-9 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        Copy Raw Prompt
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 4: COUNTER-IDEAS PIPELINE */}
            {activeTab === "ideas" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black font-mono uppercase text-slate-100 tracking-tight flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-emerald-400" />
                                Counter-Ideas for {compData.name} ({ideas.length})
                            </h2>
                            <p className="text-xs font-mono text-slate-400 mt-1">
                                Log product, feature, marketing, and pricing ideas to compete directly with this competitor.
                            </p>
                        </div>

                        <Dialog open={isAddIdeaOpen} onOpenChange={setIsAddIdeaOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider h-11 px-5 rounded-xl flex items-center gap-2 cursor-pointer">
                                    <Lightbulb className="h-4 w-4" />
                                    Log Counter-Idea
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-lg font-sans">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-black uppercase font-mono text-slate-100">
                                        Log Counter-Idea vs {compData.name}
                                    </DialogTitle>
                                </DialogHeader>

                                <form onSubmit={handleCreateIdea} className="space-y-4 pt-2 font-mono text-xs">
                                    <div>
                                        <label className="block font-bold text-slate-300 mb-1">Idea Title *</label>
                                        <Input 
                                            required
                                            placeholder="e.g. Build Unlimited Tier at 50% Lower Price" 
                                            value={newIdeaTitle}
                                            onChange={e => setNewIdeaTitle(e.target.value)}
                                            className="bg-slate-950 border-slate-800"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-bold text-slate-300 mb-1">Category</label>
                                            <select 
                                                value={newIdeaCategory}
                                                onChange={e => setNewIdeaCategory(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5"
                                            >
                                                <option value="Products">Products</option>
                                                <option value="Features">Features</option>
                                                <option value="Improvements">Improvements</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Pricing">Pricing</option>
                                                <option value="Customer Experience">Customer Experience</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-300 mb-1">Opportunity Type</label>
                                            <select 
                                                value={newIdeaType}
                                                onChange={e => setNewIdeaType(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5"
                                            >
                                                <option value="Innovate">Innovate</option>
                                                <option value="Differentiate">Differentiate</option>
                                                <option value="Solve Complaint">Solve Complaint</option>
                                                <option value="Reduce Cost">Reduce Cost</option>
                                                <option value="Add AI">Add AI</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button type="button" variant="ghost" onClick={() => setIsAddIdeaOpen(false)}>Cancel</Button>
                                        <Button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase">Log Idea</Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {ideas.length === 0 ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-xl space-y-3">
                            <Lightbulb className="h-10 w-10 text-slate-600 mx-auto" />
                            <h3 className="text-base font-bold font-mono text-slate-200">No Counter-Ideas Logged Yet</h3>
                            <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">
                                Click <span className="text-emerald-400 font-bold">Log Counter-Idea</span> to start capturing product and campaign ideas against {compData.name}.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ideas.map((idea) => {
                                const isArchived = idea.status === "Archived";
                                return (
                                    <div key={idea._id} className={`bg-slate-900 border rounded-2xl p-5 shadow-xl space-y-3 flex flex-col justify-between hover:border-emerald-500/50 transition-all ${isArchived ? "opacity-60 border-slate-850" : "border-slate-800"}`}>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
                                                    {idea.category} &bull; {idea.opportunityType}
                                                </span>
                                                <div className="flex items-center gap-1.5 font-mono text-xs">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase">{idea.status}</span>
                                                    <button 
                                                        onClick={async () => {
                                                            const newStatus = idea.status === "Archived" ? "Backlog" : "Archived";
                                                            const { updateIdea } = await import("@/lib/actions/idea-pipeline.actions");
                                                            const res = await updateIdea(idea._id, { status: newStatus });
                                                            if (res.success) {
                                                                toast.success(newStatus === "Archived" ? "Archived idea" : "Restored idea");
                                                                setIdeas(prev => prev.map(i => i._id === idea._id ? { ...i, status: newStatus } : i));
                                                            }
                                                        }}
                                                        className="text-slate-400 hover:text-amber-300 transition cursor-pointer p-1"
                                                        title={isArchived ? "Unarchive Idea" : "Archive Idea"}
                                                    >
                                                        {isArchived ? "Unarchive" : "Archive"}
                                                    </button>
                                                    <button 
                                                        onClick={async () => {
                                                            if (!confirm(`Delete idea: "${idea.title}"?`)) return;
                                                            const { deleteIdea } = await import("@/lib/actions/idea-pipeline.actions");
                                                            const res = await deleteIdea(idea._id);
                                                            if (res.success) {
                                                                toast.success("Deleted idea");
                                                                setIdeas(prev => prev.filter(i => i._id !== idea._id));
                                                            }
                                                        }}
                                                        className="text-slate-500 hover:text-rose-400 transition cursor-pointer p-1"
                                                        title="Delete Idea"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <h4 className="text-sm font-bold font-mono text-slate-100">{idea.title}</h4>
                                        </div>

                                        <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs font-mono">
                                            <Link href="/tools/competition-black-book/ideas" className="text-amber-400 hover:underline text-[11px] font-bold">
                                                Manage in Pipeline Matrix →
                                            </Link>
                                            <select 
                                                value={idea.status}
                                                onChange={async (e) => {
                                                    const newStatus = e.target.value;
                                                    const { updateIdea } = await import("@/lib/actions/idea-pipeline.actions");
                                                    const res = await updateIdea(idea._id, { status: newStatus });
                                                    if (res.success) {
                                                        toast.success(`Status: ${newStatus}`);
                                                        setIdeas(prev => prev.map(i => i._id === idea._id ? { ...i, status: newStatus } : i));
                                                    }
                                                }}
                                                className="bg-slate-950 border border-slate-800 text-slate-200 text-[11px] rounded px-2 py-0.5 focus:outline-none"
                                            >
                                                <option value="Backlog">Backlog</option>
                                                <option value="Researching">Researching</option>
                                                <option value="Planned">Planned</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Testing">Testing</option>
                                                <option value="Launched">Launched</option>
                                                <option value="Archived">Archived</option>
                                            </select>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* MULTI-ITEM MODULE DIALOG */}
            {activeModule && (
                <Dialog open={!!activeModule} onOpenChange={() => setActiveModule(null)}>
                    <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-4xl max-h-[90vh] overflow-y-auto font-sans">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black uppercase font-mono text-slate-100 flex items-center justify-between pr-6">
                                <div className="flex items-center gap-2">
                                    <activeModule.icon className="h-5 w-5 text-rose-400" />
                                    {activeModule.title}
                                </div>
                                <span className="text-xs font-bold text-amber-400 bg-amber-950 border border-amber-800 px-3 py-1 rounded-full uppercase">
                                    {moduleItems.length} {moduleItems.length === 1 ? "Item" : "Items"} Logged
                                </span>
                            </DialogTitle>
                            <DialogDescription className="text-xs font-mono text-slate-400">
                                {activeModule.desc} &bull; Add multiple separated entry items for clean tracking.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 pt-2 font-mono text-xs">
                            
                            {/* EXISTING ITEMS LIST */}
                            {moduleItems.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                        <Layers className="h-4 w-4 text-amber-400" />
                                        Logged Entries ({moduleItems.length})
                                    </h4>

                                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                                        {moduleItems.map((item, idx) => (
                                            <div key={item.id || idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 relative group hover:border-slate-700 transition">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-rose-400 bg-rose-950 border border-rose-800 px-2 py-0.5 rounded-md uppercase">
                                                            #{idx + 1}
                                                        </span>
                                                        <h5 className="font-bold text-slate-100 text-sm">{item.title}</h5>
                                                        {item.tag && (
                                                            <span className="text-[10px] font-bold text-amber-400 bg-amber-950 border border-amber-800 px-2 py-0.5 rounded-md uppercase">
                                                                {item.tag}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <button 
                                                            onClick={() => handleEditItem(item)}
                                                            className="p-1 text-slate-400 hover:text-amber-300 transition cursor-pointer"
                                                            title="Edit Item"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            className="p-1 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                                                            title="Delete Item"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {item.url && (
                                                    <a 
                                                        href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[11px] text-amber-400 hover:underline inline-flex items-center gap-1"
                                                    >
                                                        <Globe className="h-3 w-3" />
                                                        {item.url}
                                                        <ExternalLink className="h-2.5 w-2.5" />
                                                    </a>
                                                )}

                                                {item.content && (
                                                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-900/60 p-3 rounded-xl border border-slate-850">
                                                        {item.content}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ADD / EDIT ITEM FORM */}
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                                    <PlusCircle className="h-4 w-4" />
                                    {editingItemId ? "Edit Intelligence Entry" : "+ Add New Separated Entry"}
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="sm:col-span-2">
                                        <label className="block text-slate-300 font-bold mb-1">Item Title / Name *</label>
                                        <Input 
                                            placeholder="e.g. Pro Membership Plan ($99/mo) / FB Ad Script #1" 
                                            value={newItemTitle}
                                            onChange={e => setNewItemTitle(e.target.value)}
                                            className="bg-slate-900 border-slate-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-slate-300 font-bold mb-1">Sub-Category / Tag</label>
                                        <Input 
                                            placeholder="e.g. Pricing / Ad Hook / Complaint" 
                                            value={newItemTag}
                                            onChange={e => setNewItemTag(e.target.value)}
                                            className="bg-slate-900 border-slate-800"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-bold mb-1">Reference URL (Optional)</label>
                                    <Input 
                                        placeholder="https://competitor.com/pricing or URL link" 
                                        value={newItemUrl}
                                        onChange={e => setNewItemUrl(e.target.value)}
                                        className="bg-slate-900 border-slate-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-bold mb-1">Detailed Content & Notes</label>
                                    <textarea 
                                        rows={4}
                                        placeholder="Enter specific features, offer details, observations, ad copy text, or review quotes..." 
                                        value={newItemContent}
                                        onChange={e => setNewItemContent(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 text-slate-100 p-3 rounded-xl focus:outline-none resize-y leading-relaxed"
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    {editingItemId && (
                                        <Button 
                                            type="button" 
                                            variant="ghost"
                                            onClick={() => {
                                                setEditingItemId(null);
                                                setNewItemTitle("");
                                                setNewItemTag("");
                                                setNewItemUrl("");
                                                setNewItemContent("");
                                            }}
                                            className="text-slate-400 font-mono text-xs"
                                        >
                                            Cancel Edit
                                        </Button>
                                    )}
                                    <Button 
                                        type="button"
                                        onClick={handleAddOrUpdateItem}
                                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase text-xs px-5"
                                    >
                                        {editingItemId ? "Save Item Changes" : "+ Add Entry Item to List"}
                                    </Button>
                                </div>
                            </div>

                            {/* MAIN ACTION BAR */}
                            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                                <span className="text-slate-400 text-[11px]">
                                    Total Items in {activeModule.title}: <strong className="text-slate-200">{moduleItems.length}</strong>
                                </span>
                                <div className="flex justify-end gap-3">
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        onClick={() => setActiveModule(null)}
                                        className="text-slate-400 font-mono text-xs"
                                    >
                                        Close
                                    </Button>
                                    <Button 
                                        type="button" 
                                        onClick={handleSaveModule}
                                        disabled={isSavingModule}
                                        className="bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase px-6"
                                    >
                                        {isSavingModule ? "Saving All..." : `Save All ${activeModule.title} Items`}
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* OPENROUTER AI OUTPUT RESULT DIALOG */}
            {isAiModalOpen && (
                <Dialog open={isAiModalOpen} onOpenChange={() => setIsAiModalOpen(false)}>
                    <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-4xl max-h-[90vh] overflow-y-auto font-sans">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black uppercase font-mono text-slate-100 flex items-center justify-between pr-6">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-amber-400" />
                                    {aiModalTitle}
                                </div>
                                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full uppercase">
                                    {isGeneratingAi ? "Generating..." : "OpenRouter AI Ready"}
                                </span>
                            </DialogTitle>
                            <DialogDescription className="text-xs font-mono text-slate-400">
                                Live competitive intelligence strategy report generated by OpenRouter AI.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 pt-2 font-mono text-xs">
                            {isGeneratingAi ? (
                                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                                    <Sparkles className="h-10 w-10 text-amber-400 animate-spin mx-auto" />
                                    <h4 className="text-base font-bold text-slate-200">Executing OpenRouter AI Generation...</h4>
                                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                                        Synthesizing all collected competitor intelligence facts across 33 modules.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                                        <span className="text-slate-400 font-bold uppercase text-[10px]">OpenRouter AI Output</span>
                                        <Button 
                                            onClick={() => copyToClipboard(aiModalResult, aiModalTitle)}
                                            size="sm"
                                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase text-xs"
                                        >
                                            <Copy className="h-3.5 w-3.5 mr-1" />
                                            Copy Generated Report
                                        </Button>
                                    </div>
                                    <textarea 
                                        readOnly 
                                        rows={18}
                                        value={aiModalResult}
                                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs p-5 rounded-2xl focus:outline-none resize-y leading-relaxed"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <Button 
                                    onClick={() => setIsAiModalOpen(false)}
                                    className="bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold uppercase px-6"
                                >
                                    Close Window
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    );
}
