import { getGlossaryTerms } from "@/lib/actions/glossary.actions";
import GlossaryTerm from "@/lib/db/models/GlossaryTerm";
import connectToDatabase from "@/lib/db/connect";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { 
    ArrowLeft, 
    Calculator, 
    Lightbulb,
    Bookmark,
    Share2,
    Info,
    ExternalLink,
    Heart,
    Rocket
} from "lucide-react";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    await connectToDatabase();
    const term = await GlossaryTerm.findOne({ slug }).lean();

    if (!term) return { title: "Term Not Found" };

    return {
        title: `${term.term} - Make Money Online Guide | K Business Academy`,
        description: `Learn how ${term.term} works for making money online. Includes tools, tutorials, pros/cons, and beginner tips for success.`,
        keywords: [...(term.keywords || []), term.term, "make money online", term.category],
    };
}

export default async function GlossaryTermPage({ params }: Props) {
    const { slug } = await params;
    await connectToDatabase();
    const term = await GlossaryTerm.findOne({ slug }).lean() as any;

    if (!term) notFound();

    // Fetch related terms
    const { terms: allTerms } = await getGlossaryTerms({ limit: 1000 });
    const relatedTerms = allTerms.filter((t: any) => 
        t.category === term.category && t.id !== term.id
    ).slice(0, 5); // get up to 5 related items

    const updatedDate = term.lastUpdated ? new Date(term.lastUpdated).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "March 2026";

    return (
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
                    {/* Content Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center flex-wrap gap-3 mb-4">
                            <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-emerald-500 uppercase tracking-widest">
                                {term.category || 'General'}
                            </span>
                            <span className="text-slate-400 text-sm italic">Updated {updatedDate}</span>
                            
                            {term.lowPhysicalEffort && (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 rounded-full text-rose-600 dark:text-rose-400 text-xs font-bold">
                                    <Heart size={14} /> Low Physical Effort
                                </span>
                            )}
                            {term.startupCost && term.startupCost !== '$0' && (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 dark:bg-blue-900/30 dark:border-blue-800 rounded-full text-blue-600 dark:text-blue-400 text-xs font-bold">
                                    <Rocket size={14} /> {term.startupCost} Startup
                                </span>
                            )}
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-black mb-2 leading-tight">{term.term}</h1>
                        <h2 className="text-2xl font-medium mb-8 text-slate-500 dark:text-slate-400 line-clamp-2">
                            {term.shortDefinition}
                        </h2>

                        <div className="prose prose-lg dark:prose-invert max-w-none prose-emerald">
                            <p className="text-xl leading-relaxed mb-8 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                {term.definition}
                            </p>

                            {(term.howItMakesMoney || term.howItWorks) && (
                                <div className="p-8 rounded-3xl mb-10 border-2 border-dashed bg-emerald-50 border-emerald-200 dark:bg-slate-800/50 dark:border-slate-700">
                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-4">
                                        <Calculator size={20} />
                                        How It Makes Money
                                    </div>
                                    <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
                                        {term.howItMakesMoney || term.howItWorks}
                                    </p>
                                </div>
                            )}

                            {term.gettingStartedChecklist && term.gettingStartedChecklist.length > 0 && (
                                <>
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <Lightbulb className="text-amber-500" />
                                        Key Takeaways & Getting Started
                                    </h3>
                                    <ul className="space-y-4 mb-10 list-none pl-0">
                                        {term.gettingStartedChecklist.map((item: string, idx: number) => (
                                            <li key={idx} className="flex gap-4 items-start m-0">
                                                <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                                <span className="text-slate-700 dark:text-slate-300">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            
                            {term.commonMistakes && (
                                <div className="p-6 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-900/50 mt-8 mb-8 not-prose">
                                    <h4 className="font-bold text-rose-800 dark:text-rose-400 mb-2 flex items-center gap-2">
                                        Common Mistakes
                                    </h4>
                                    <p className="text-rose-700 dark:text-rose-300/80 text-sm">{term.commonMistakes}</p>
                                </div>
                            )}
                            
                            {term.realExamples && (
                                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/50 mb-8 not-prose">
                                    <h4 className="font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                                        Real Example
                                    </h4>
                                    <p className="text-blue-700 dark:text-blue-300/80 text-sm italic">"{term.realExamples}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Metadata */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 p-8 rounded-3xl border bg-white border-slate-200 shadow-xl shadow-slate-200/50 dark:bg-slate-800/50 dark:border-slate-700 dark:shadow-none">
                            <h4 className="font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                                <Info size={18} className="text-emerald-600 dark:text-emerald-400" />
                                Details & Actions
                            </h4>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">Skill Level</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{term.skillRequired || "Beginner"}</span>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">Time to Entry</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{term.timeToFirstDollar || "Varies"}</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3 mb-8">
                                <button className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm">
                                    <Bookmark size={18} /> Save for later
                                </button>
                                <button className="w-full py-3 px-4 rounded-xl border font-bold flex items-center justify-center gap-2 transition-colors border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm">
                                    <Share2 size={18} /> Share term
                                </button>
                            </div>

                            <hr className="mb-8 border-slate-100 dark:border-slate-700" />

                            <h4 className="font-bold mb-4 text-slate-800 dark:text-white text-sm">Related Paths</h4>
                            {relatedTerms.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {relatedTerms.map((r: any) => (
                                        <Link 
                                            key={r.id}
                                            href={`/glossary/${r.slug}`}
                                            className="text-xs px-3 py-1.5 rounded-lg border transition-all border-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:hover:border-emerald-500 dark:text-slate-300 font-medium"
                                        >
                                            {r.term}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic">No related paths found.</p>
                            )}

                            <div className="mt-10 p-4 rounded-2xl text-xs text-center transform transition-all bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                <p className="text-slate-500 dark:text-slate-400 mb-2">Notice a typo or want to improve this definition?</p>
                                <Link href="/contact" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1">
                                    Suggest Edit <ExternalLink size={12} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
