import { getGlossaryTerms, incrementGlossaryView, incrementGlossaryPathwayClick } from "@/lib/actions/glossary.actions";
import GlossaryTerm from "@/lib/db/models/GlossaryTerm";
import connectToDatabase from "@/lib/db/connect";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { 
    ArrowLeft, Calculator, Lightbulb, Bookmark, Share2, Info, ExternalLink, Heart, Rocket, ChevronRight,
    Video as Youtube, Camera as Instagram, ShoppingBag, Globe, Podcast, LayoutList, Target, TriangleAlert as AlertTriangle, Star, CircleCheck as CheckCircle2, Zap, CirclePlay as PlayCircle, BookOpen, Quote, CircleHelp as HelpCircle, History, Users, SquareCheck as CheckSquare, Briefcase, Sparkles, Clock, TrendingUp, Wrench, Layers, Network, Cpu, ShieldCheck
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

const renderList = (items: any[] | undefined, icon: React.ReactNode, title: string, requireUrl = false) => {
    if (!items || items.length === 0) return null;

    const displayItems = requireUrl
        ? items.filter((item: any) => {
            const url = typeof item === 'object' && item.url ? item.url.trim() : '';
            return url.length > 0 && url !== '#';
          })
        : items;

    if (displayItems.length === 0) return null;

    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-100">
                {icon}
                {title}
            </h3>
            <ul className="space-y-3">
                {displayItems.map((item, i) => {
                    const label = typeof item === 'string' ? item : item.name;
                    const url = typeof item === 'object' && item.url ? item.url : null;
                    
                    return (
                        <li key={i} className="flex gap-3 text-slate-300 items-start">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                            {url ? (
                                <a href={url} target="_blank" rel="noopener noreferrer" className="leading-relaxed hover:text-cyan-400 font-medium transition-colors flex items-center gap-1">
                                    {label} <ExternalLink size={12} />
                                </a>
                            ) : (
                                <span className="leading-relaxed">{label}</span>
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

    const updatedDate = serializedTerm.lastUpdated ? new Date(serializedTerm.lastUpdated).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "March 2026";
    const readingTime = getReadingTimeEstimate(serializedTerm);

    const breadcrumbs = [
        { label: "Glossary", href: "/glossary" },
        { label: serializedTerm.category || "General", href: `/glossary?category=${serializedTerm.category}` },
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
                            <div className="flex items-center flex-wrap gap-3 mb-4 font-mono text-xs">
                                <Link href={`/glossary?category=${serializedTerm.category}`} className="px-3 py-1 rounded-xl text-cyan-300 bg-slate-900 border border-slate-800 hover:border-cyan-500 uppercase font-bold tracking-wider cursor-pointer">
                                    {serializedTerm.category || 'General'}
                                </Link>
                                {serializedTerm.entityType && (
                                    <span className="px-3 py-1 rounded-xl text-purple-300 bg-slate-900 border border-slate-800 uppercase font-bold tracking-wider">
                                        {serializedTerm.entityType}
                                    </span>
                                )}
                                <span className="text-slate-500">Updated {updatedDate}</span>
                                <div className="flex items-center gap-1 text-slate-400">
                                    <Clock size={14} />
                                    <span>{readingTime}</span>
                                </div>
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-slate-100 uppercase">
                                {serializedTerm.term}
                            </h1>
                        </div>

                        {/* Phase 2 Component: Entity Knowledge Node Box */}
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
                                    <span className="text-slate-100 font-bold">{serializedTerm.entityType || 'Core Business Concept'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block mb-1">Knowledge Cluster:</span>
                                    <span className="text-cyan-300 font-bold">{serializedTerm.category || 'General'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Phase 2 Component: AEO Direct Answer Summary Box */}
                        <div className="p-8 bg-slate-900 border border-cyan-800/80 rounded-3xl shadow-2xl relative overflow-hidden group">
                            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider mb-3">
                                <Sparkles size={16} /> AI Search Direct Answer (AEO Snippet)
                            </div>
                            <div className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed font-mono" data-aeo-summary data-direct-answer>
                                <CustomHTMLRenderer html={autoLinkContentHTML(serializedTerm.aeoSummary || serializedTerm.shortDefinition || serializedTerm.definition, termMap)} />
                            </div>
                        </div>

                        {/* Phase 2 Component: Real-World Business Scenario & ROI */}
                        {serializedTerm.realWorldScenario?.stepByStep && serializedTerm.realWorldScenario.stepByStep.length > 0 && (
                            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-3">
                                    <Target size={16} /> Real-World Execution Scenario & ROI Impact
                                </div>
                                {serializedTerm.realWorldScenario.context && (
                                    <p className="text-sm font-mono text-slate-300 italic">{serializedTerm.realWorldScenario.context}</p>
                                )}
                                <div className="space-y-3 pt-2">
                                    <h4 className="text-xs font-mono font-bold uppercase text-slate-400">Step-by-Step Execution:</h4>
                                    <ol className="space-y-2 font-mono text-xs text-slate-200">
                                        {serializedTerm.realWorldScenario.stepByStep.map((step: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                                                <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-bold shrink-0">{idx + 1}</span>
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                                {serializedTerm.realWorldScenario.citableMetric && (
                                    <div className="mt-4 p-4 bg-slate-950 border border-emerald-800/80 rounded-2xl flex items-center justify-between text-xs font-mono">
                                        <span className="text-slate-400">Citable Performance Metric:</span>
                                        <span className="text-emerald-400 font-bold">{serializedTerm.realWorldScenario.citableMetric}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Phase 2 Component: Deep Content Pathways Card */}
                        {serializedTerm.deepPathways && serializedTerm.deepPathways.length > 0 && (
                            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                                <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-3">
                                    <Rocket size={16} /> Deep Content Pathways & Conversion Funnels
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    {serializedTerm.deepPathways.map((pathway: any, idx: number) => (
                                        <a
                                            key={idx}
                                            href={pathway.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 bg-slate-950 border border-slate-800 hover:border-cyan-500 rounded-2xl flex flex-col justify-between group transition-all"
                                        >
                                            <div>
                                                <span className="text-[9px] font-mono font-bold uppercase text-cyan-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg inline-block mb-2">
                                                    {pathway.type}
                                                </span>
                                                <h4 className="font-bold text-slate-100 group-hover:text-cyan-300 text-sm">{pathway.title}</h4>
                                                {pathway.description && <p className="text-xs text-slate-400 font-mono mt-1 line-clamp-2">{pathway.description}</p>}
                                            </div>
                                            <div className="mt-4 flex items-center justify-end text-xs font-mono text-cyan-400 gap-1">
                                                Explore <ExternalLink size={12} />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Phase 3 Component: Intent-Based Question Variations Accordion */}
                        {serializedTerm.questionVariations && serializedTerm.questionVariations.length > 0 && (
                            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
                                <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-3">
                                    <HelpCircle size={16} /> User Intent & Problem Query Variations (AEO Accordion)
                                </div>
                                <div className="space-y-3 font-mono text-xs">
                                    {serializedTerm.questionVariations.map((qv: any, idx: number) => (
                                        <details key={idx} className="group bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                                            <summary className="p-4 cursor-pointer font-bold text-slate-100 flex items-center justify-between">
                                                <span className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800 text-[9px] uppercase">{qv.intentType || 'Query'}</span>
                                                    {qv.question}
                                                </span>
                                                <ChevronRight size={14} className="group-open:rotate-90 transition-transform text-slate-400" />
                                            </summary>
                                            <div className="p-4 border-t border-slate-800 text-slate-300 leading-relaxed bg-slate-900">
                                                {qv.targetAnswer}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* In-Depth Explanation */}
                        <div className="space-y-6 pt-4">
                            <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
                                <BookOpen size={20} className="text-cyan-400" />
                                Detailed Technical Analysis
                            </h2>
                            <div className="text-sm font-mono leading-relaxed text-slate-300 space-y-4 bg-slate-900 p-6 rounded-3xl border border-slate-800">
                                <CustomHTMLRenderer html={autoLinkContentHTML(serializedTerm.definition, termMap)} />
                            </div>
                        </div>

                        {/* Creator Content & Prompts */}
                        <div className="pt-8 border-t border-slate-800 space-y-6">
                            <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Content Creator Assets</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {renderList(serializedTerm.headlines, <LayoutList className="text-slate-400" size={18} />, "Blog Headlines")}
                                {renderList(serializedTerm.youtubeTitles, <Youtube className="text-rose-400" size={18} />, "YouTube Titles")}
                                {renderList(serializedTerm.amazonProducts, <ShoppingBag className="text-amber-400" size={18} />, "Recommended Products", true)}
                                {renderList(serializedTerm.websitesRanking, <Globe className="text-cyan-400" size={18} />, "Websites", true)}
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
                        <div className="sticky top-24 space-y-6 font-mono text-xs">
                            
                            <RotatingAffiliateBanner products={products} />

                            <GlossaryProgressTracker slug={serializedTerm.slug} term={serializedTerm.term} />
                            
                            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900 shadow-xl space-y-4">
                                <h4 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
                                    <Info size={16} className="text-cyan-400" />
                                    Entity Overview
                                </h4>
                                
                                <div className="space-y-3">
                                    {serializedTerm.skillRequired && (
                                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                            <span className="block text-[9px] font-bold uppercase text-slate-400 mb-0.5">Skill Level</span>
                                            <span className="font-bold text-slate-200">{serializedTerm.skillRequired}</span>
                                        </div>
                                    )}
                                    {serializedTerm.startupCost && (
                                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                            <span className="block text-[9px] font-bold uppercase text-slate-400 mb-0.5">Start-Up Cost</span>
                                            <span className="font-bold text-slate-200">{serializedTerm.startupCost}</span>
                                        </div>
                                    )}
                                    {serializedTerm.platformPreference && (
                                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                            <span className="block text-[9px] font-bold uppercase text-cyan-400 mb-0.5">Software / Platform</span>
                                            <span className="font-bold text-slate-200">{serializedTerm.platformPreference}</span>
                                        </div>
                                    )}
                                </div>

                                {serializedTerm.synonyms && serializedTerm.synonyms.length > 0 && (
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Also Known As</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {serializedTerm.synonyms.map((syn: string, i: number) => (
                                                <span key={i} className="text-[10px] bg-slate-950 text-cyan-300 px-2.5 py-1 rounded-xl border border-slate-800">
                                                    {syn}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
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
