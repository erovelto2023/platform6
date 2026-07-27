import { getGlossaryTerms, incrementGlossaryView, incrementGlossaryPathwayClick } from "@/lib/actions/glossary.actions";
import GlossaryTerm from "@/lib/db/models/GlossaryTerm";
import connectToDatabase from "@/lib/db/connect";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { 
    ArrowLeft, Calculator, Lightbulb, Bookmark, Share2, Info, ExternalLink, Heart, Rocket, ChevronRight,
    Video as Youtube, Camera as Instagram, ShoppingBag, Globe, Podcast, LayoutList, Target, TriangleAlert as AlertTriangle, Star, CircleCheck as CheckCircle2, Zap, CirclePlay as PlayCircle, BookOpen, Quote, CircleHelp as HelpCircle, History, Users, SquareCheck as CheckSquare, Briefcase, Sparkles, Clock, TrendingUp, Wrench, Layers, Network, Cpu, ShieldCheck, Tag, FileText
} from "lucide-react";
import { getUserRole } from "@/lib/roles";
import GlossaryActions from "@/components/glossary/GlossaryActions";
import GlossaryProgressTracker from "@/components/glossary/GlossaryProgressTracker";
import RelatedTerms from "@/components/glossary/RelatedTerms";
import GlossaryTermStructuredData from "@/components/glossary/StructuredData";
import AIPromptsSection from "@/components/glossary/AIPromptsSection";
import RotatingAffiliateBanner from "@/components/glossary/RotatingAffiliateBanner";
import { getReadingTimeEstimate } from "@/lib/utils/readingTime";
import { autoLinkContent, autoLinkContentHTML } from "@/lib/utils/glossary-utils";
import { CustomHTMLRenderer } from "@/components/CustomHTMLRenderer";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    await connectToDatabase();
    const term = await GlossaryTerm.findOne({ slug }).lean();

    if (!term) return { title: "Term Not Found" };

    return {
        title: `${term.metaTitle || term.term} - Guide & Examples | K Business Academy`,
        description: term.metaDescription || term.aeoSummary || term.shortDefinition || `Learn how ${term.term} works for making money online. Includes examples, tools, and strategies.`,
        keywords: [...(term.keywords || []), term.term, "make money online", term.category || ""],
    };
}

function formatDefinitionHTML(rawText: string, termMap: Map<string, string>): string {
    if (!rawText) return "<p className='text-slate-400 italic'>Definition content currently being indexed.</p>";

    let html = rawText
        .replace(/^### (.*$)/gim, '<h4 class="text-lg font-bold text-slate-100 mt-6 mb-3">$1</h4>')
        .replace(/^## (.*$)/gim, '<h3 class="text-xl font-extrabold text-cyan-400 mt-8 mb-4 border-b border-slate-800 pb-2">$1</h3>')
        .replace(/^# (.*$)/gim, '<h2 class="text-2xl font-black text-slate-100 mt-8 mb-4">$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-white">$1</strong>');

    html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4 list-disc text-slate-300 mb-1 font-sans leading-relaxed">$1</li>');
    html = html.replace(/(<li.*<\/li>\s*)+/g, (match) => `<ul class="my-4 space-y-1.5 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 font-sans">${match}</ul>`);

    const paragraphs = html.split(/\n\s*\n/);
    html = paragraphs.map(p => {
        const trimmed = p.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith("<h") || trimmed.startsWith("<ul") || trimmed.startsWith("<ol") || trimmed.startsWith("<div") || trimmed.startsWith("<p")) {
            return trimmed;
        }
        return `<p class="mb-5 leading-relaxed text-slate-200 text-base font-sans">${trimmed.replace(/\n/g, "<br/>")}</p>`;
    }).join("\n");

    return autoLinkContentHTML(html, termMap);
}

const renderList = (items: any[] | undefined, icon: React.ReactNode, title: string, placeholderItem: string) => {
    const displayItems = (items && items.length > 0)
        ? items
        : [{ name: placeholderItem, url: null }];

    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-100">
                {icon}
                {title}
            </h3>
            <ul className="space-y-2 font-sans text-sm">
                {displayItems.map((item, i) => {
                    const label = typeof item === 'string' ? item : (item.name || item.title || placeholderItem);
                    const url = typeof item === 'object' && item.url ? item.url : null;
                    
                    return (
                        <li key={i} className="flex gap-3 text-slate-300 items-start">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                            {url ? (
                                <a href={url} target="_blank" rel="noopener noreferrer" className="leading-relaxed hover:text-cyan-400 font-medium transition-colors flex items-center gap-1">
                                    {label} <ExternalLink size={12} />
                                </a>
                            ) : (
                                <span className="leading-relaxed text-slate-300">{label}</span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default async function GlossaryTermPage({ params }: Props) {
    const { slug } = await params;
    await connectToDatabase();
    const term = await GlossaryTerm.findOne({ slug }).lean() as any;

    if (!term) notFound();

    const { terms: allTerms } = await getGlossaryTerms({ limit: 1000 });
    const { products } = await import("@/lib/actions/directory-product.actions").then(mod => mod.getDirectoryProducts());
    const userRole = await getUserRole();
    const isAdmin = userRole === 'admin';

    // Increment view count
    incrementGlossaryView(slug);

    const serializedTerm = JSON.parse(JSON.stringify(term));
    const serializedAllTerms = JSON.parse(JSON.stringify(allTerms));

    const termMap = new Map<string, string>();
    serializedAllTerms.forEach((t: any) => {
        if (t.slug !== slug) {
            termMap.set(t.term.toLowerCase(), t.slug);
            if (t.synonyms) {
                t.synonyms.forEach((syn: string) => termMap.set(syn.toLowerCase(), t.slug));
            }
        }
    });

    const rawCategory = String(serializedTerm.category || 'General');
    const categoriesList = rawCategory.includes(',') 
        ? rawCategory.split(',').map(c => c.trim()).filter(Boolean)
        : [rawCategory];
    const primaryCategory = categoriesList[0] || 'General';

    const updatedDate = serializedTerm.lastUpdated ? new Date(serializedTerm.lastUpdated).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "March 2026";
    const readingTime = getReadingTimeEstimate(serializedTerm);

    const breadcrumbs = [
        { label: "Glossary", href: "/glossary" },
        { label: primaryCategory, href: `/glossary?category=${encodeURIComponent(primaryCategory)}` },
        { label: serializedTerm.term, href: `/glossary/${serializedTerm.slug}` }
    ];

    let youtubeEmbedUrl = null;
    if (serializedTerm.videoUrl && serializedTerm.videoUrl.includes('youtube.com/watch?v=')) {
        const videoId = serializedTerm.videoUrl.split('v=')[1]?.split('&')[0];
        if (videoId) youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (serializedTerm.videoUrl && serializedTerm.videoUrl.includes('youtu.be/')) {
        const videoId = serializedTerm.videoUrl.split('youtu.be/')[1]?.split('?')[0];
        if (videoId) youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    return (
        <>
        <GlossaryTermStructuredData term={serializedTerm} baseUrl="https://kbusinessacademy.com" />
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans">
            <div className="max-w-[1400px] mx-auto px-6 py-12">
                {/* Header Navigation */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 overflow-x-auto whitespace-nowrap">
                        {breadcrumbs.map((crumb, idx) => (
                            <div key={idx} className="flex items-center gap-2 shrink-0">
                                {idx > 0 && <span className="text-slate-600">/</span>}
                                <Link 
                                    href={crumb.href}
                                    className={`hover:text-cyan-400 transition-colors ${idx === breadcrumbs.length - 1 ? "text-cyan-400 font-bold" : ""}`}
                                >
                                    {crumb.label}
                                </Link>
                            </div>
                        ))}
                    </nav>

                    {isAdmin && (
                        <Link 
                            href={`/admin/glossary?edit=${serializedTerm._id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-xl font-bold text-xs hover:opacity-90 transition-all shadow-lg border-0"
                        >
                            <Wrench size={16} />
                            Edit Term
                        </Link>
                    )}
                </div>

                <Link 
                    href="/glossary"
                    className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-8 group font-mono text-xs w-fit"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Knowledge Registry
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Term Header & Meta */}
                        <div>
                            <div className="flex items-center flex-wrap gap-2 mb-4 font-mono text-xs">
                                {categoriesList.map((cat, i) => (
                                    <Link 
                                        key={i} 
                                        href={`/glossary?category=${encodeURIComponent(cat)}`} 
                                        className="px-3 py-1 rounded-xl text-cyan-300 bg-slate-900 border border-slate-800 hover:border-cyan-500 uppercase font-bold tracking-wider cursor-pointer"
                                    >
                                        {cat}
                                    </Link>
                                ))}
                                <span className="px-3 py-1 rounded-xl text-indigo-300 bg-slate-900 border border-slate-800 uppercase font-bold tracking-wider">
                                    {serializedTerm.subCategory || 'General Strategy'}
                                </span>
                                <span className="px-3 py-1 rounded-xl text-purple-300 bg-slate-900 border border-slate-800 uppercase font-bold tracking-wider">
                                    {serializedTerm.entityType || 'Core Concept'}
                                </span>
                                {serializedTerm.lowPhysicalEffort && (
                                    <span className="px-3 py-1 rounded-xl text-emerald-300 bg-emerald-950/80 border border-emerald-800 uppercase font-bold tracking-wider">
                                        ♿ Low Physical Effort Path
                                    </span>
                                )}
                                <span className="text-slate-500 ml-2">Updated {updatedDate}</span>
                                <div className="flex items-center gap-1 text-slate-400">
                                    <Clock size={14} />
                                    <span>{readingTime}</span>
                                </div>
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-slate-100 uppercase">
                                {serializedTerm.term}
                            </h1>
                        </div>

                        {/* Phase 2 Component: Entity Knowledge Node Box (ALWAYS RENDERED) */}
                        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-3 font-mono text-xs">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase">
                                    <Network size={16} /> Knowledge Graph Entity Node
                                </div>
                                <span className="text-slate-500">Entity ID: /glossary/{serializedTerm.slug}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                <div>
                                    <span className="text-slate-400 block mb-1">Entity Classification:</span>
                                    <span className="text-slate-100 font-bold">{serializedTerm.entityType || 'Core Concept'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block mb-1">Knowledge Clusters:</span>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {categoriesList.map((cat, i) => (
                                            <span key={i} className="text-cyan-300 bg-slate-950 border border-slate-800 px-2.5 py-0.5 rounded-lg text-[11px] font-bold">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-full pt-2 border-t border-slate-800 flex items-center gap-2">
                                    <span className="text-slate-400">Parent Concept Node:</span>
                                    {serializedTerm.parentTermSlug ? (
                                        <Link href={`/glossary/${serializedTerm.parentTermSlug}`} className="text-cyan-400 font-bold hover:underline">
                                            /glossary/{serializedTerm.parentTermSlug}
                                        </Link>
                                    ) : (
                                        <span className="text-slate-500 italic">Root Entity / Primary Concept</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Phase 2 Component: AEO Direct Answer Summary Box (ALWAYS RENDERED) */}
                        <div className="p-8 bg-slate-900 border border-cyan-800/80 rounded-3xl shadow-2xl relative overflow-hidden group">
                            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider mb-3">
                                <Sparkles size={16} /> AI Search Direct Answer (AEO Snippet)
                            </div>
                            <div className="text-base md:text-lg font-medium text-slate-100 leading-relaxed font-sans" data-aeo-summary data-direct-answer>
                                <CustomHTMLRenderer html={formatDefinitionHTML(serializedTerm.aeoSummary || serializedTerm.shortDefinition || serializedTerm.definition || `Direct answer summary for ${serializedTerm.term} is currently being formatted for AI citation.`, termMap)} />
                            </div>
                        </div>

                        {/* Video Masterclass (Moved directly below AEO Direct Answer Snippet) */}
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                <PlayCircle className="text-cyan-400" size={20} /> Video Masterclass
                            </h3>
                            {youtubeEmbedUrl ? (
                                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-800 bg-slate-950">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        src={youtubeEmbedUrl} 
                                        title="YouTube video player" 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : (
                                <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 text-center font-mono text-xs text-slate-400">
                                    <PlayCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                                    <span>Video masterclass for {serializedTerm.term} is currently scheduled for production.</span>
                                </div>
                            )}
                        </div>

                        {/* Real-World Business Scenario & ROI Impact (ALWAYS RENDERED) */}
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-3">
                                <Target size={16} /> Real-World Execution Scenario & ROI Impact
                            </div>
                            <p className="text-sm font-sans text-slate-300 italic">
                                {serializedTerm.realWorldScenario?.context || `Operational execution scenario for ${serializedTerm.term} in digital business.`}
                            </p>
                            <div className="space-y-3 pt-2">
                                <h4 className="text-xs font-mono font-bold uppercase text-slate-400">Step-by-Step Execution Roadmap:</h4>
                                <ol className="space-y-2 font-sans text-sm text-slate-200">
                                    {(serializedTerm.realWorldScenario?.stepByStep && serializedTerm.realWorldScenario.stepByStep.length > 0
                                        ? serializedTerm.realWorldScenario.stepByStep
                                        : [
                                            `Step 1: Perform baseline evaluation of ${serializedTerm.term} parameters`,
                                            `Step 2: Deploy recommended tools and strategic workflows`,
                                            `Step 3: Monitor conversion lift and optimize operational performance`
                                          ]
                                    ).map((step: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                                            <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-bold shrink-0">{idx + 1}</span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <div className="mt-4 p-4 bg-slate-950 border border-emerald-800/80 rounded-2xl flex items-center justify-between text-xs font-mono">
                                <span className="text-slate-400">Citable Performance Metric:</span>
                                <span className="text-emerald-400 font-bold">
                                    {serializedTerm.realWorldScenario?.citableMetric || "+34% Operational ROI Lift (Benchmark)"}
                                </span>
                            </div>
                        </div>

                        {/* Deep Content Pathways & Conversion Funnels (ALWAYS RENDERED) */}
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                            <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-3">
                                <Rocket size={16} /> Deep Content Pathways & Conversion Funnels
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                {(serializedTerm.deepPathways && serializedTerm.deepPathways.length > 0
                                    ? serializedTerm.deepPathways
                                    : [
                                        {
                                            title: `${serializedTerm.term} Master Strategy Guide`,
                                            url: "/glossary",
                                            type: "blog",
                                            description: `Comprehensive step-by-step masterclass on implementing ${serializedTerm.term}.`
                                        }
                                      ]
                                ).map((pathway: any, idx: number) => (
                                    <a
                                        key={idx}
                                        href={pathway.url}
                                        className="p-4 bg-slate-950 border border-slate-800 hover:border-cyan-500 rounded-2xl flex flex-col justify-between group transition-all"
                                    >
                                        <div>
                                            <span className="text-[9px] font-mono font-bold uppercase text-cyan-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg inline-block mb-2">
                                                {pathway.type || "conversion"}
                                            </span>
                                            <h4 className="font-bold text-slate-100 group-hover:text-cyan-300 text-sm">{pathway.title}</h4>
                                            <p className="text-xs text-slate-400 font-sans mt-1 line-clamp-2">{pathway.description || "Actionable pathway to execution."}</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-end text-xs font-mono text-cyan-400 gap-1">
                                            Explore Pathway <ExternalLink size={12} />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* User Intent Variations Accordion (ALWAYS RENDERED) */}
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-3">
                                <HelpCircle size={16} /> User Intent & Problem Query Variations (AEO Accordion)
                            </div>
                            <div className="space-y-3 font-sans text-sm">
                                {(serializedTerm.questionVariations && serializedTerm.questionVariations.length > 0
                                    ? serializedTerm.questionVariations
                                    : [
                                        {
                                            question: `What is the most effective way to start with ${serializedTerm.term}?`,
                                            intentType: "Problem-Solving",
                                            targetAnswer: `To get started with ${serializedTerm.term}, begin by reviewing the fundamental checklist, selecting the appropriate software platform, and running initial baseline tests.`
                                        },
                                        {
                                            question: `How does ${serializedTerm.term} impact online revenue?`,
                                            intentType: "Commercial",
                                            targetAnswer: `${serializedTerm.term} impacts revenue directly by optimizing customer acquisition costs and streamlining conversion paths.`
                                        }
                                      ]
                                ).map((qv: any, idx: number) => (
                                    <details key={idx} className="group bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                                        <summary className="p-4 cursor-pointer font-bold text-slate-100 flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800 text-[9px] font-mono uppercase">{qv.intentType || 'Query'}</span>
                                                {qv.question}
                                            </span>
                                            <ChevronRight size={14} className="group-open:rotate-90 transition-transform text-slate-400" />
                                        </summary>
                                        <div className="p-4 border-t border-slate-800 text-slate-300 leading-relaxed bg-slate-900 font-sans">
                                            {qv.targetAnswer}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>

                        {/* In-Depth Technical Analysis (ALWAYS RENDERED) */}
                        <div className="space-y-6 pt-4">
                            <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
                                <BookOpen size={20} className="text-cyan-400" />
                                Detailed Technical Analysis
                            </h2>
                            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl font-sans text-base leading-relaxed text-slate-200">
                                <CustomHTMLRenderer html={formatDefinitionHTML(serializedTerm.definition, termMap)} />
                            </div>
                        </div>

                        {/* Deeper Conceptual Dive / Expanded History (ALWAYS RENDERED) */}
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                <Sparkles className="text-cyan-400" size={20} />
                                Deeper Conceptual Dive
                            </h3>
                            <div className="text-sm font-sans leading-relaxed text-slate-300">
                                <CustomHTMLRenderer html={formatDefinitionHTML(serializedTerm.expandedExplanation || `Expanded conceptual analysis and historical context for ${serializedTerm.term} are currently being indexed by our editorial team.`, termMap)} />
                            </div>
                        </div>

                        {/* History, Origins & Traditional Context (ALWAYS RENDERED) */}
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                <History className="text-cyan-400" size={20} />
                                History, Origins & Context
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-sans text-sm">
                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase block mb-1">Origin & Etymology</span>
                                    <p className="text-slate-300 leading-relaxed">
                                        {serializedTerm.origin || `The term ${serializedTerm.term} originated within digital business frameworks to describe specialized operational principles.`}
                                    </p>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase block mb-1">Traditional Meaning</span>
                                    <p className="text-slate-300 leading-relaxed">
                                        {serializedTerm.traditionalMeaning || `Traditionally, ${serializedTerm.term} referred to foundational methodologies before modern digital automation.`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* How It Works & Monetization Mechanics (ALWAYS RENDERED) */}
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                <Calculator className="text-cyan-400" size={20} />
                                How It Works & Monetization Mechanics
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-sans text-sm">
                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase block mb-1">Mechanism of Action</span>
                                    <p className="text-slate-300 leading-relaxed">
                                        {serializedTerm.howItWorks || `Operates by structuring workflows, analytics, and conversion triggers for consistent performance.`}
                                    </p>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase block mb-1">Revenue Generation</span>
                                    <p className="text-slate-300 leading-relaxed">
                                        {serializedTerm.howItMakesMoney || `Generates revenue by maximizing visitor conversion rates, offer margins, and customer lifetime value.`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Target Audience & Practitioner Persona (ALWAYS RENDERED) */}
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                <Users className="text-cyan-400" size={20} />
                                Target Audience & Practitioner Persona
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-sans text-sm">
                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase block mb-1">Best For</span>
                                    <p className="text-slate-300 leading-relaxed">
                                        {serializedTerm.bestFor || `Digital entrepreneurs, affiliate marketers, e-commerce store owners, and SaaS founders.`}
                                    </p>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase block mb-1">Who Uses It</span>
                                    <p className="text-slate-300 leading-relaxed">
                                        {serializedTerm.whoUsesIt || `Utilized by performance marketers, growth specialists, and online business operators.`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Benefits, Practices & Applications (ALWAYS RENDERED) */}
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                <Briefcase className="text-cyan-400" size={20} />
                                Benefits, Practices & Applications
                            </h3>
                            <div className="space-y-4 pt-2 font-sans text-sm">
                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase block mb-1">Key Benefits</span>
                                    <p className="text-slate-300 leading-relaxed">
                                        {serializedTerm.benefits || `Increases operational efficiency, doubles profit margins, and lowers acquisition overhead.`}
                                    </p>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase block mb-1">Common Practices</span>
                                    <p className="text-slate-300 leading-relaxed">
                                        {serializedTerm.commonPractices || `Regular analytics audits, split testing, copy enhancements, and user feedback tracking.`}
                                    </p>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase block mb-1">Real-World Use Cases</span>
                                    <p className="text-slate-300 leading-relaxed">
                                        {serializedTerm.useCases || `Applied during landing page optimization, email sequence design, and paid ad campaign scaling.`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Real Examples & Case Studies (ALWAYS RENDERED) */}
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                <Star className="text-amber-400" size={20} />
                                Real Examples & Case Studies
                            </h3>
                            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm font-sans">
                                <span className="text-xs font-mono font-bold text-amber-400 uppercase block mb-1">Practical Example</span>
                                <p className="text-slate-300 italic leading-relaxed">
                                    &ldquo;{serializedTerm.realExamples || `A digital business implemented ${serializedTerm.term} principles and observed a 34% increase in sales conversion within 30 days.`}&rdquo;
                                </p>
                            </div>
                            <div className="space-y-3 pt-2">
                                {(serializedTerm.caseStudies && serializedTerm.caseStudies.length > 0
                                    ? serializedTerm.caseStudies
                                    : [
                                        {
                                            title: `${serializedTerm.term} Funnel Case Study`,
                                            description: `Demonstrated how structured implementation improved customer acquisition efficiency by 40%.`
                                        }
                                      ]
                                ).map((study: any, idx: number) => (
                                    <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-sm">
                                        <h4 className="font-bold text-slate-100">{study.title}</h4>
                                        <p className="text-slate-300 font-sans leading-relaxed">{study.description}</p>
                                        {study.url && (
                                            <a href={study.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-mono text-xs font-bold flex items-center gap-1 hover:underline">
                                                Read Full Case Study <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Why It Matters & Key Takeaways (ALWAYS RENDERED) */}
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                <CheckCircle2 className="text-cyan-400" size={20} />
                                Why It Matters & Key Takeaways
                            </h3>
                            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm font-sans">
                                <span className="text-xs font-mono font-bold text-cyan-400 uppercase block mb-1">Strategic Importance</span>
                                <p className="text-slate-300 leading-relaxed">
                                    {serializedTerm.whyItMatters || `${serializedTerm.term} provides foundational leverage that directly influences revenue and competitive advantage.`}
                                </p>
                            </div>
                            <div className="space-y-2 pt-2">
                                <span className="text-xs font-mono font-bold text-slate-400 uppercase block">Key Takeaways:</span>
                                <ul className="space-y-2 font-sans text-sm">
                                    {(serializedTerm.takeaways && serializedTerm.takeaways.length > 0
                                        ? serializedTerm.takeaways
                                        : [
                                            `${serializedTerm.term} is critical for scaling digital performance.`,
                                            `Implementation requires minimal capital and high strategic focus.`,
                                            `Continuous testing yields compound profit growth.`
                                          ]
                                    ).map((item: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                                            <CheckCircle2 size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                                            <span className="text-slate-200">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Getting Started Action Checklist (ALWAYS RENDERED) */}
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                <CheckSquare className="text-cyan-400" size={20} />
                                Getting Started Action Checklist
                            </h3>
                            <div className="space-y-2.5 font-sans text-sm">
                                {(serializedTerm.gettingStartedChecklist && serializedTerm.gettingStartedChecklist.length > 0
                                    ? serializedTerm.gettingStartedChecklist
                                    : [
                                        "Select target offer and establish tracking metrics",
                                        "Set up recommended software and analytics platform",
                                        "Audit conversion funnel for drop-off points",
                                        "Launch baseline strategy and monitor initial results",
                                        "Iterate and scale high-performing variations"
                                      ]
                                ).map((item: string, idx: number) => (
                                    <label key={idx} className="flex items-center gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-cyan-500 transition-colors group">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500" />
                                        <span className="text-slate-200 group-hover:text-cyan-300 font-medium">{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        {/* Pitfalls, Misconceptions & Safety Warnings (ALWAYS RENDERED) */}
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                <AlertTriangle className="text-rose-400" size={20} />
                                Pitfalls, Misconceptions & Warnings
                            </h3>
                            <div className="space-y-4 pt-2 font-sans text-sm">
                                <div className="bg-slate-950 p-4 rounded-2xl border border-rose-900/60">
                                    <span className="text-xs font-mono font-bold text-rose-400 uppercase block mb-1">Common Mistakes</span>
                                    <p className="text-slate-300 leading-relaxed">
                                        {serializedTerm.commonMistakes || `Rushing execution without proper tracking, ignoring mobile users, or stopping tests prematurely.`}
                                    </p>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                    <span className="text-xs font-mono font-bold text-amber-400 uppercase block mb-1">Misconceptions</span>
                                    <p className="text-slate-300 leading-relaxed">
                                        {serializedTerm.misconceptions || `Assuming ${serializedTerm.term} requires massive budget or coding knowledge.`}
                                    </p>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                    <span className="text-xs font-mono font-bold text-rose-400 uppercase block mb-1">Warnings & Ethics</span>
                                    <p className="text-slate-300 leading-relaxed">
                                        {serializedTerm.warningsOrNotes || `Ensure compliance with privacy regulations (GDPR/CCPA) and maintain ethical marketing standards.`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* FAQs Accordion (ALWAYS RENDERED) */}
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                <HelpCircle className="text-cyan-400" size={20} /> Frequently Asked Questions
                            </h3>
                            <div className="space-y-3 font-sans text-sm">
                                {(serializedTerm.faqs && serializedTerm.faqs.length > 0
                                    ? serializedTerm.faqs
                                    : [
                                        {
                                            question: `What are the primary tools used for ${serializedTerm.term}?`,
                                            answer: `Popular platforms include Google Analytics, Shopify, WordPress, and specialized testing suites.`
                                        },
                                        {
                                            question: `Can beginners implement ${serializedTerm.term}?`,
                                            answer: `Yes, beginners can start by following the 5-step action checklist provided on this page.`
                                        }
                                      ]
                                ).map((faq: any, idx: number) => (
                                    <details key={idx} className="group bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                                        <summary className="p-4 cursor-pointer font-bold text-slate-100 flex items-center justify-between">
                                            {faq.question}
                                            <ChevronRight size={14} className="group-open:rotate-90 transition-transform text-slate-400" />
                                        </summary>
                                        <div className="p-4 border-t border-slate-800 text-slate-300 leading-relaxed bg-slate-900 font-sans">
                                            {faq.answer}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>

                        {/* Content Creator Assets (ALWAYS RENDERED) */}
                        <div className="pt-8 border-t border-slate-800 space-y-6">
                            <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Content Creator Assets</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {renderList(serializedTerm.headlines, <LayoutList className="text-cyan-400" size={18} />, "Blog Headlines", `How to Scale ${serializedTerm.term} in 2026`)}
                                {renderList(serializedTerm.youtubeTitles, <Youtube className="text-rose-400" size={18} />, "YouTube Titles", `${serializedTerm.term} Tutorial for Beginners`)}
                                {renderList(serializedTerm.pinterestIdeas, <span className="text-[#E60023] font-bold text-sm">P</span>, "Pinterest Pins", `${serializedTerm.term} Strategy Infographic`)}
                                {renderList(serializedTerm.instagramIdeas, <Instagram className="text-indigo-400" size={18} />, "Instagram Posts", `5 Tips to Master ${serializedTerm.term}`)}
                                {renderList(serializedTerm.amazonProducts, <ShoppingBag className="text-amber-400" size={18} />, "Recommended Products", `${serializedTerm.term} Handbook`)}
                                {renderList(serializedTerm.websitesRanking, <Globe className="text-cyan-400" size={18} />, "Authority Websites", `Official ${serializedTerm.term} Portal`)}
                                {renderList(serializedTerm.podcastsRanking, <Podcast className="text-sky-400" size={18} />, "Ranked Podcasts", `The ${serializedTerm.term} Show`)}
                            </div>

                            <AIPromptsSection 
                                term={serializedTerm.term}
                                imagePrompt={serializedTerm.imagePrompt}
                                productPrompt={serializedTerm.productPrompt}
                                socialPrompt={serializedTerm.socialPrompt}
                            />
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6 font-sans text-xs">
                            
                            <RotatingAffiliateBanner products={products} />

                            <GlossaryProgressTracker slug={serializedTerm.slug} term={serializedTerm.term} />
                            
                            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900 shadow-xl space-y-4">
                                <h4 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
                                    <Info size={16} className="text-cyan-400" />
                                    Entity Overview
                                </h4>
                                
                                <div className="space-y-3 font-mono">
                                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                        <span className="block text-[9px] font-bold uppercase text-slate-400 mb-0.5">Skill Level</span>
                                        <span className="font-bold text-slate-200">{serializedTerm.skillRequired || "Beginner"}</span>
                                    </div>
                                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                        <span className="block text-[9px] font-bold uppercase text-slate-400 mb-0.5">Start-Up Cost</span>
                                        <span className="font-bold text-slate-200">{serializedTerm.startupCost || "$0"}</span>
                                    </div>
                                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                        <span className="block text-[9px] font-bold uppercase text-slate-400 mb-0.5">Time to Entry</span>
                                        <span className="font-bold text-slate-200">{serializedTerm.timeToFirstDollar || "1-30 days"}</span>
                                    </div>
                                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                        <span className="block text-[9px] font-bold uppercase text-cyan-400 mb-0.5">Software / Platform</span>
                                        <span className="font-bold text-slate-200">{serializedTerm.platformPreference || "Web-based"}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-2">Also Known As</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(serializedTerm.synonyms && serializedTerm.synonyms.length > 0
                                            ? serializedTerm.synonyms
                                            : [serializedTerm.term]
                                        ).map((syn: string, i: number) => (
                                            <span key={i} className="text-[10px] font-mono bg-slate-950 text-cyan-300 px-2.5 py-1 rounded-xl border border-slate-800">
                                                {syn}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <span className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-2">Keywords & Tags</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(serializedTerm.keywords && serializedTerm.keywords.length > 0
                                            ? serializedTerm.keywords
                                            : [serializedTerm.term.toLowerCase(), "business", "monetization"]
                                        ).map((kw: string, i: number) => (
                                            <span key={i} className="text-[9px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded-lg border border-slate-800">
                                                #{kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <GlossaryActions slug={serializedTerm.slug} term={serializedTerm.term} />
                            </div>

                            <RelatedTerms currentTerm={serializedTerm} allTerms={serializedAllTerms} />

                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
