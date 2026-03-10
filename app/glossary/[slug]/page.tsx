import { getGlossaryTerms } from "@/lib/actions/glossary.actions";
import GlossaryTerm from "@/lib/db/models/GlossaryTerm";
import connectToDatabase from "@/lib/db/connect";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { 
    ChevronLeft, 
    Rocket, 
    Target, 
    CheckCircle2, 
    Wrench, 
    AlertTriangle, 
    Star, 
    ArrowRight,
    Sparkles,
    Heart
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
    ).slice(0, 3);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Navigation Header */}
            <div className="bg-white border-b border-slate-200 py-4 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
                    <Link href="/glossary" className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors">
                        <ChevronLeft size={20} />
                        Back to Library
                    </Link>
                    <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-1 bg-slate-100 rounded">
                            {term.category}
                        </span>
                    </div>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 mt-12">
                {/* Hero / Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                         {term.lowPhysicalEffort && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-100 rounded-full text-rose-600 text-xs font-bold">
                                <Heart size={14} /> Low Physical Effort
                            </div>
                        )}
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-xs font-bold">
                            <Rocket size={14} /> {term.startupCost || "$0"} Startup
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                        {term.term}
                    </h1>
                    
                    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-widest mb-3">
                                <Sparkles size={16} /> 60-Second AI Summary
                            </h3>
                            <p className="text-lg text-slate-100 leading-relaxed italic">
                                "{term.shortDefinition}"
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {/* What It Is */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm">01</span>
                            What It Is
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {term.definition}
                        </div>
                    </section>

                    {/* How It Makes Money */}
                    <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <Target className="text-emerald-500" />
                            How It Makes Money
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            {term.howItMakesMoney || `The primary way to generate income with ${term.term} is through value creation and delivery to a specific audience.`}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">Skill Level</span>
                                <span className="font-bold text-slate-800">{term.skillRequired || "Beginner"}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">Time to Entry</span>
                                <span className="font-bold text-slate-800">{term.timeToFirstDollar || "1-30 Days"}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">Platform</span>
                                <span className="font-bold text-slate-800">{term.platformPreference || "Universal"}</span>
                            </div>
                        </div>
                    </section>

                    {/* Getting Started Checklist */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-500" />
                            Getting Started Checklist
                        </h2>
                        <div className="space-y-3">
                            {(term.gettingStartedChecklist && term.gettingStartedChecklist.length > 0) ? (
                                term.gettingStartedChecklist.map((item: string, i: number) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all">
                                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-300 group-hover:border-emerald-500 group-hover:text-emerald-500 transition-all">
                                            {i + 1}
                                        </div>
                                        <span className="font-bold text-slate-700">{item}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 italic">Checklist coming soon for this path.</p>
                            )}
                        </div>
                    </section>

                    {/* Recommended Tools */}
                    <section className="bg-emerald-900 rounded-3xl p-8 text-white">
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <Wrench className="text-emerald-400" />
                            Recommended Tools
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
                                <h4 className="font-black text-lg mb-1">Keyword Atlas</h4>
                                <p className="text-sm text-emerald-100/70 mb-4">Essential for finding high-intent niches in {term.term}.</p>
                                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400">
                                    Explore Tool <ArrowRight size={14} />
                                </span>
                            </div>
                            <div className="p-6 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
                                <h4 className="font-black text-lg mb-1">Social Analyzer</h4>
                                <p className="text-sm text-emerald-100/70 mb-4">Track viral trends and content performance for this strategy.</p>
                                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400">
                                    Explore Tool <ArrowRight size={14} />
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Mistakes & Examples */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="p-8 bg-rose-50 rounded-3xl border border-rose-100">
                            <h2 className="text-xl font-black text-rose-900 mb-6 flex items-center gap-3">
                                <AlertTriangle size={24} />
                                Common Mistakes
                            </h2>
                            <p className="text-rose-800/80 leading-relaxed text-sm whitespace-pre-wrap">
                                {term.commonMistakes || "Information about common pitfalls for this path will be updated shortly."}
                            </p>
                        </section>
                        <section className="p-8 bg-amber-50 rounded-3xl border border-amber-100">
                            <h2 className="text-xl font-black text-amber-900 mb-6 flex items-center gap-3">
                                <Star size={24} />
                                Real Example
                            </h2>
                            <p className="text-amber-800/80 leading-relaxed text-sm italic">
                                {term.realExamples || `Many successful entrepreneurs have leveraged ${term.term} to escape the 9-5 and build lasting financial independence.`}
                            </p>
                        </section>
                    </div>

                    {/* Next Steps */}
                    <section className="text-center py-12 border-t border-slate-200">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Explore Related Paths</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {relatedTerms.map((t: any) => (
                                <Link 
                                    key={t.id}
                                    href={`/glossary/${t.slug}`}
                                    className="px-6 py-3 bg-white border border-slate-200 rounded-full font-bold text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all text-sm"
                                >
                                    {t.term}
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </article>
        </div>
    );
}
