import { getGlossaryTerms } from "@/lib/actions/glossary.actions";
import GlossaryTerm from "@/lib/db/models/GlossaryTerm";
import connectToDatabase from "@/lib/db/connect";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { 
    ArrowLeft, Calculator, Lightbulb, Bookmark, Share2, Info, ExternalLink, Heart, Rocket,
    Youtube, Instagram, ShoppingBag, Globe, Podcast, LayoutList, Target, AlertTriangle, Star, CheckCircle2, Zap, PlayCircle, BookOpen, Quote, HelpCircle, History, Users, CheckSquare, Briefcase, Sparkles, Clock
} from "lucide-react";
import GlossaryActions from "@/components/glossary/GlossaryActions";
import GlossaryProgressTracker from "@/components/glossary/GlossaryProgressTracker";
import RelatedTerms from "@/components/glossary/RelatedTerms";
import GlossaryTermStructuredData from "@/components/glossary/StructuredData";
import { getReadingTimeEstimate } from "@/lib/utils/readingTime";

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
        description: term.metaDescription || term.shortDefinition || `Learn how ${term.term} works for making money online. Includes examples, tools, and strategies.`,
        keywords: [...(term.keywords || []), term.term, "make money online", term.category || ""],
    };
}

// Helper to reliably render arrays
const renderList = (items: any[] | undefined, icon: React.ReactNode, title: string) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                {icon}
                {title}
            </h3>
            <ul className="space-y-3">
                {items.map((item, i) => {
                    const label = typeof item === 'string' ? item : item.name;
                    const url = typeof item === 'object' && item.url ? item.url : null;
                    
                    return (
                        <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-300 items-start">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            {url ? (
                                <a href={url} target="_blank" rel="noopener noreferrer" className="leading-relaxed hover:text-emerald-500 font-medium transition-colors flex items-center gap-1">
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

    // Convert MongoDB documents to plain objects
    const serializedTerm = JSON.parse(JSON.stringify(term));
    const serializedAllTerms = JSON.parse(JSON.stringify(allTerms));

    const updatedDate = serializedTerm.lastUpdated ? new Date(serializedTerm.lastUpdated).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "March 2026";
    const readingTime = getReadingTimeEstimate(serializedTerm);

    // Extracting video ID if it's a youtube link
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
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-900 dark:text-white pb-20">
            <div className="max-w-5xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Link 
                    href="/glossary"
                    className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-8 group font-bold w-fit"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Glossary
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2">
                        {/* 1. Header & Tags */}
                        <div className="flex items-center flex-wrap gap-3 mb-4">
                            <Link href={`/glossary?category=${serializedTerm.category}`} className="text-xs font-bold px-3 py-1 rounded-full text-white bg-emerald-500 hover:bg-emerald-600 transition-colors uppercase tracking-widest cursor-pointer">
                                {serializedTerm.category || 'General'}
                            </Link>
                            <span className="text-slate-400 text-sm italic">Updated {updatedDate}</span>
                            <div className="flex items-center gap-1 text-slate-500 text-sm">
                                <Clock size={14} />
                                <span>{readingTime}</span>
                            </div>
                        </div>
                        
                        {/* Term (H1) */}
                        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight text-slate-900 dark:text-white">
                            {serializedTerm.term}
                        </h1>

                        {/* 2. Quick Definition (Featured Snippet Ready) */}
                        {serializedTerm.shortDefinition && (
                            <div className="p-6 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl dark:bg-emerald-950/30 dark:border-emerald-500 mb-10 shadow-sm">
                                <p className="text-xl font-medium text-emerald-900 dark:text-emerald-100 leading-relaxed">
                                    <strong className="font-black">Definition:</strong> {serializedTerm.shortDefinition}
                                </p>
                            </div>
                        )}

                        <div className="prose prose-lg dark:prose-invert max-w-none prose-emerald">
                            {/* 3. Simple Explanation */}
                            <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <BookOpen className="text-emerald-500" /> What is {serializedTerm.term}?
                            </h2>
                            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                {serializedTerm.definition}
                            </p>

                            {/* Expanded Explanation */}
                            {serializedTerm.expandedExplanation && (
                                <>
                                    <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <Sparkles className="text-purple-500" /> Deeper Dive
                                    </h2>
                                    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                        {serializedTerm.expandedExplanation}
                                    </p>
                                </>
                            )}

                            {/* History & Traditional Meaning */}
                            {(serializedTerm.origin || serializedTerm.traditionalMeaning) && (
                                <div className="p-8 rounded-3xl mt-12 mb-10 bg-slate-100 dark:bg-slate-800/50 not-prose">
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                        <History className="text-emerald-500" />
                                        History & Origins
                                    </h3>
                                    <div className="space-y-6">
                                        {serializedTerm.origin && (
                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Origin & Etymology</h4>
                                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{serializedTerm.origin}</p>
                                            </div>
                                        )}
                                        {serializedTerm.traditionalMeaning && (
                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Traditional Meaning</h4>
                                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{serializedTerm.traditionalMeaning}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 4. Why This Term Matters */}
                            {serializedTerm.whyItMatters && (
                                <>
                                    <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <AlertTriangle className="text-amber-500" /> Why {serializedTerm.term} Matters
                                    </h2>
                                    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                                        {serializedTerm.whyItMatters}
                                    </p>
                                </>
                            )}

                            {/* 5. How It Works */}
                            {(serializedTerm.howItWorks || serializedTerm.howItMakesMoney) && (
                                <div className="p-8 rounded-3xl mt-12 mb-10 border-2 border-dashed bg-white border-slate-200 shadow-sm dark:bg-slate-800/50 dark:border-slate-700 not-prose">
                                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold mb-4 text-xl">
                                        <Calculator className="text-emerald-500" />
                                        How It Works & Makes Money
                                    </div>
                                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {serializedTerm.howItWorks || serializedTerm.howItMakesMoney}
                                    </p>
                                </div>
                            )}

                            {/* Best For */}
                            {serializedTerm.bestFor && (
                                <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-900/50 mt-12 mb-10 not-prose">
                                    <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2 text-lg">
                                        <Users size={20} className="text-purple-600 dark:text-purple-400" /> Ideal Target Audience
                                    </h4>
                                    <p className="text-purple-900 dark:text-purple-200/80 leading-relaxed text-lg">{serializedTerm.bestFor}</p>
                                </div>
                            )}

                            {/* Use Cases & Common Practices */}
                            {(serializedTerm.useCases || serializedTerm.commonPractices) && (
                                <div className="mt-12 mb-10">
                                    <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <Briefcase className="text-emerald-500" /> Practical Applications
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                                        {serializedTerm.useCases && (
                                            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                                                <h4 className="font-bold mb-3 text-slate-800 dark:text-slate-100">Real-World Use Cases</h4>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{serializedTerm.useCases}</p>
                                            </div>
                                        )}
                                        {serializedTerm.commonPractices && (
                                            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                                                <h4 className="font-bold mb-3 text-slate-800 dark:text-slate-100">Common Practices</h4>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{serializedTerm.commonPractices}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 6. Real-World Examples */}
                            {serializedTerm.realExamples && (
                                <div className="mt-12 mb-10">
                                    <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <Target className="text-emerald-500" /> Real-World Examples
                                    </h2>
                                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/50 not-prose">
                                        <p className="text-blue-800 dark:text-blue-200 leading-relaxed italic text-lg">
                                            "{serializedTerm.realExamples}"
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* 12. Video Explanation */}
                            {youtubeEmbedUrl && (
                                <div className="mt-12 mb-10 not-prose">
                                    <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <PlayCircle className="text-emerald-500" /> Video Explanation
                                    </h2>
                                    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
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
                                </div>
                            )}

                            {/* 17. Case Studies */}
                            {serializedTerm.caseStudies && serializedTerm.caseStudies.length > 0 && (
                                <div className="mt-12 mb-10 not-prose">
                                    <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <Star className="text-emerald-500" /> Case Studies
                                    </h2>
                                    <div className="space-y-4">
                                        {serializedTerm.caseStudies.map((study: any, idx: number) => (
                                            <div key={idx} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{study.title}</h3>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-3">
                                                    {study.description}
                                                </p>
                                                {study.url && (
                                                    <a href={study.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-1 hover:underline">
                                                        Read Full Case Study <ExternalLink size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 10. Benefits */}
                            {serializedTerm.benefits && (
                                <>
                                    <h2 className="text-2xl font-bold mt-12 mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <Zap className="text-amber-500" /> Benefits of {serializedTerm.term}
                                    </h2>
                                    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                                        {serializedTerm.benefits}
                                    </p>
                                </>
                            )}

                            {/* 9. Common Mistakes */}
                            {serializedTerm.commonMistakes && (
                                <div className="p-6 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-900/50 mt-12 mb-10 not-prose">
                                    <h4 className="font-bold text-rose-800 dark:text-rose-400 mb-2 flex items-center gap-2 text-lg">
                                        <AlertTriangle size={20} /> Common Mistakes & Pitfalls
                                    </h4>
                                    <p className="text-rose-700 dark:text-rose-300/80 leading-relaxed">{serializedTerm.commonMistakes}</p>
                                </div>
                            )}

                            {/* 18. Key Takeaways */}
                            {serializedTerm.takeaways && serializedTerm.takeaways.length > 0 && (
                                <div className="mt-12 bg-slate-100 dark:bg-slate-800 p-8 rounded-3xl not-prose mb-10">
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                        <CheckCircle2 className="text-emerald-500" />
                                        Key Takeaways
                                    </h3>
                                    <ul className="space-y-4 list-none pl-0">
                                        {serializedTerm.takeaways.map((item: string, idx: number) => (
                                            <li key={idx} className="flex gap-4 items-start m-0">
                                                <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                                <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-lg">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Getting Started Checklist */}
                            {serializedTerm.gettingStartedChecklist && serializedTerm.gettingStartedChecklist.length > 0 && (
                                <div className="mt-12 bg-white dark:bg-slate-800 p-8 rounded-3xl border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/5 not-prose mb-10">
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                        <CheckSquare className="text-emerald-500" />
                                        Getting Started Checklist
                                    </h3>
                                    <div className="space-y-4">
                                        {serializedTerm.gettingStartedChecklist.map((item: string, idx: number) => (
                                            <label key={idx} className="flex gap-4 items-start p-4 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                                <div className="w-6 h-6 rounded border-2 border-slate-300 dark:border-slate-600 group-hover:border-emerald-500 mt-0.5 flex items-center justify-center shrink-0">
                                                    <span className="w-3 h-3 bg-emerald-500 rounded-sm opacity-0" />
                                                </div>
                                                <span className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium select-none">{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-sm text-slate-400 mt-6 italic text-center">Interactive checklist—click items to mark them complete (local only).</p>
                                </div>
                            )}

                            {/* 13. FAQ Accordions (SEO Friendly) */}
                            {serializedTerm.faqs && serializedTerm.faqs.length > 0 && (
                                <div className="mt-12 mb-10 not-prose">
                                    <h2 className="text-3xl font-black mb-8 text-slate-900 dark:text-white flex items-center gap-2">
                                        <HelpCircle className="text-emerald-500" size={28} /> FAQs
                                    </h2>
                                    <div className="space-y-4">
                                        {serializedTerm.faqs.map((faq: any, idx: number) => (
                                            <details key={idx} className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                                                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 dark:text-slate-100 select-none hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                    {faq.question}
                                                    <span className="transition-transform duration-300 group-open:rotate-180 text-emerald-500">
                                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                                    </span>
                                                </summary>
                                                <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700">
                                                    {faq.answer}
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Creator Content & SEO Generation Sandbox */}
                            <div className="mt-16 pt-12 border-t-2 border-dashed border-slate-200 dark:border-slate-700 not-prose">
                                <h2 className="text-3xl font-black mb-4 text-slate-900 dark:text-white">Content Creator Setup</h2>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-2xl">Use these AI-generated structures to build out your own content strategy around the topic of {serializedTerm.term}.</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {renderList(serializedTerm.headlines, <LayoutList className="text-slate-400" size={20} />, "Blog Headlines")}
                                    {renderList(serializedTerm.youtubeTitles, <Youtube className="text-red-500" size={20} />, "YouTube Titles")}
                                    {renderList(serializedTerm.pinterestIdeas, <span className="text-[#E60023] font-bold text-lg leading-none">P</span>, "Pinterest Pins")}
                                    {renderList(serializedTerm.instagramIdeas, <Instagram className="text-pink-500" size={20} />, "Instagram Posts")}
                                    {renderList(serializedTerm.amazonProducts, <ShoppingBag className="text-orange-500" size={20} />, "Related Products")}
                                    {renderList(serializedTerm.websitesRanking, <Globe className="text-blue-500" size={20} />, "Websites")}
                                    {renderList(serializedTerm.podcastsRanking, <Podcast className="text-purple-500" size={20} />, "Ranked Podcasts")}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Metadata */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            
                            {/* Progress Tracker */}
                            <GlossaryProgressTracker slug={serializedTerm.slug} term={serializedTerm.term} />
                            
                            {/* Actions Box */}
                            <div className="p-8 rounded-3xl border bg-white border-slate-200 shadow-xl shadow-slate-200/50 dark:bg-slate-800/50 dark:border-slate-700 dark:shadow-none">
                                <h4 className="font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                                    <Info size={18} className="text-emerald-600 dark:text-emerald-400" />
                                    Details Overview
                                </h4>
                                
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {serializedTerm.skillRequired && (
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">Skill Level</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{serializedTerm.skillRequired}</span>
                                        </div>
                                    )}
                                    {serializedTerm.timeToFirstDollar && (
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">Time to Entry</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{serializedTerm.timeToFirstDollar}</span>
                                        </div>
                                    )}
                                    {serializedTerm.startupCost && (
                                        <div className="col-span-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">Average Start-Up Cost</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{serializedTerm.startupCost}</span>
                                        </div>
                                    )}
                                    {serializedTerm.platformPreference && (
                                        <div className="col-span-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                                            <span className="block text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 mb-1">Platform / Software</span>
                                            <span className="font-bold text-emerald-900 dark:text-emerald-100 text-sm">{serializedTerm.platformPreference}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Synonyms & Alternate Names */}
                                {serializedTerm.synonyms && serializedTerm.synonyms.length > 0 && (
                                    <div className="mb-6">
                                        <span className="block text-xs font-black uppercase text-slate-400 mb-2">Also Known As</span>
                                        <div className="flex flex-wrap gap-2">
                                            {serializedTerm.synonyms.map((syn: string, i: number) => (
                                                <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                                                    {syn}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <GlossaryActions slug={serializedTerm.slug} term={serializedTerm.term} />
                            </div>

                            {/* Related Terms */}
                            <RelatedTerms currentTerm={serializedTerm} allTerms={serializedAllTerms} />

                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
