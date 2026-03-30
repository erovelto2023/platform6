import Link from "next/link";
import { getFAQBySlug, getPaginatedFAQs } from "@/lib/actions/faq.actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Tag, ExternalLink, HelpCircle, ChevronRight, MessageSquare } from "lucide-react";
import { notFound } from "next/navigation";

export default async function FAQDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const faq = await getFAQBySlug(slug);
    
    if (!faq) {
        notFound();
    }

    // Fetch some related questions or simply more from same category
    const { faqs: relatedFAQs } = await getPaginatedFAQs({ 
        category: faq.parentQuestion || "",
        limit: 5,
        page: 1
    });

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 font-sans text-slate-300">
            {/* Header */}
            <header className="px-6 lg:px-10 h-16 flex items-center border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-xl text-white">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-500/50">
                            K
                        </div>
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            K Business Academy
                        </span>
                    </Link>
                </div>
                <nav className="ml-auto flex items-center gap-4 sm:gap-6 hidden md:flex">
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/courses">Courses</Link>
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/blog">Blog</Link>
                    <Link className="text-sm font-medium text-purple-400 hover:text-white transition-colors" href="/questions">FAQs</Link>
                    <Link href="/sign-in">
                        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">Log In</Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1 py-12 md:py-20 bg-slate-950">
                <div className="container px-4 mx-auto max-w-6xl">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-12">
                        <Link href="/questions" className="hover:text-purple-400 transition-colors">Questions</Link>
                        <ChevronRight size={12} />
                        <span className="text-slate-600 truncate max-w-[200px]">{faq.parentQuestion || "General"}</span>
                        <ChevronRight size={12} />
                        <span className="text-purple-400 truncate max-w-[200px]">{faq.question}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <article className="prose prose-invert prose-purple max-w-none">
                                <header className="mb-12">
                                    <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-tight mb-8">
                                        {faq.h1Title || faq.question}
                                    </h1>
                                    
                                    {/* Fast Answer Snippet */}
                                    <div className="p-8 bg-gradient-to-br from-purple-900/30 to-slate-900 border border-purple-500/20 rounded-3xl mb-12 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                                        <h3 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <HelpCircle size={16} /> Fast Answer
                                        </h3>
                                        <p className="text-xl text-slate-200 font-medium leading-relaxed italic">
                                            {faq.answerSnippet}
                                        </p>
                                    </div>
                                </header>

                                {/* Deep Dive Sections */}
                                <div className="space-y-16">
                                    {faq.deepDive?.problem && (
                                        <section className="scroll-mt-24">
                                            <h2 className="text-2xl font-black text-red-400 uppercase tracking-widest mb-6 italic border-b border-red-900/30 pb-2">The Problem / Pain Point</h2>
                                            <p className="text-lg leading-relaxed text-slate-300 bg-red-400/5 p-6 rounded-2xl border border-red-400/10 whitespace-pre-wrap font-medium">
                                                {faq.deepDive.problem}
                                            </p>
                                        </section>
                                    )}

                                    {faq.deepDive?.methodology && (
                                        <section className="scroll-mt-24">
                                            <h2 className="text-2xl font-black text-blue-400 uppercase tracking-widest mb-6 italic border-b border-blue-900/30 pb-2">The Methodology / Science</h2>
                                            <p className="text-lg leading-relaxed text-slate-300 bg-blue-400/5 p-8 rounded-2xl border border-blue-400/10 whitespace-pre-wrap font-medium shadow-inner shadow-blue-400/5">
                                                {faq.deepDive.methodology}
                                            </p>
                                        </section>
                                    )}

                                    {faq.deepDive?.application && (
                                        <section className="scroll-mt-24">
                                            <h2 className="text-2xl font-black text-emerald-400 uppercase tracking-widest mb-6 italic border-b border-emerald-900/30 pb-2">Practical Application</h2>
                                            <p className="text-lg leading-relaxed text-slate-300 bg-emerald-400/5 p-8 rounded-2xl border border-emerald-400/10 whitespace-pre-wrap font-medium">
                                                {faq.deepDive.application}
                                            </p>
                                        </section>
                                    )}
                                </div>

                                {/* Source/Reference */}
                                {faq.linkUrl && (
                                    <div className="mt-16 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Verified Source</h4>
                                        <a href={faq.linkUrl} target="_blank" className="flex items-center gap-2 text-purple-400 hover:text-white transition-colors group">
                                            <span className="font-bold underline decoration-purple-400/30">{faq.linkTitle || "Click here to view reference"}</span>
                                            <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </a>
                                    </div>
                                )}
                            </article>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1 space-y-12">
                            {/* CTA Card */}
                            <div className="p-8 bg-primary rounded-[2.5rem] text-white border border-primary relative overflow-hidden group">
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-headline font-black mb-4 italic leading-tight">Ready to build your business?</h3>
                                    <p className="text-white/70 text-sm mb-8 font-medium italic">Get access to our full library of blueprints, execution guides, and business tools—absolutely free.</p>
                                    <Link href="/sign-up">
                                        <Button className="w-full bg-white text-primary hover:bg-purple-500 hover:text-white font-black uppercase tracking-widest py-6 rounded-2xl shadow-xl shadow-black/20">
                                            Start Your Journey
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Related Questions */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 sticky top-24">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <MessageSquare size={16} /> Related Questions
                                </h3>
                                <nav className="flex flex-col gap-4">
                                    {relatedFAQs.filter((f: any) => f._id !== faq._id).slice(0, 5).map((rf: any) => (
                                        <Link 
                                            key={rf._id} 
                                            href={`/questions/${rf.slug}`}
                                            className="text-sm font-bold text-slate-400 hover:text-purple-400 transition-all block pb-4 border-b border-slate-800/50 last:border-0"
                                        >
                                            {rf.question}
                                        </Link>
                                    ))}
                                </nav>
                                <Link href="/questions" className="block text-center mt-6 text-xs font-black text-purple-400 uppercase tracking-widest hover:text-white transition-colors italic underline underline-offset-4">
                                    Browse All Questions
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800 bg-slate-900 mt-20">
                <div className="container px-4 mx-auto text-center md:flex md:justify-between items-center">
                    <p className="text-slate-500 text-xs italic mb-4 md:mb-0 pr-8">© 2025 K Business Academy. Elevating professional growth through structured execution.</p>
                    <div className="flex justify-center gap-6">
                        <Link href="/terms" className="text-xs text-slate-600 hover:text-white transition-colors font-bold uppercase tracking-widest">Terms</Link>
                        <Link href="/privacy" className="text-xs text-slate-600 hover:text-white transition-colors font-bold uppercase tracking-widest">Privacy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
