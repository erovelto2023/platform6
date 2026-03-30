import { getFAQBySlug, getPaginatedFAQs } from "@/lib/actions/faq.actions";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
    ArrowLeft, ExternalLink, HelpCircle, ChevronRight,
    Clock, BookOpen, Zap, CheckCircle2, Quote, Tag, AlertTriangle
} from "lucide-react";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const faq = await getFAQBySlug(slug);
    if (!faq) return { title: "Question Not Found" };
    return {
        title: `${faq.question} | K Business Academy`,
        description: faq.answerSnippet || `Get a clear, expert answer to: ${faq.question}`,
        keywords: [faq.parentQuestion, "FAQ", "business questions", "K Business Academy"].filter(Boolean) as string[],
    };
}

export default async function FAQDetailPage({ params }: Props) {
    const { slug } = await params;
    const faq = await getFAQBySlug(slug);

    if (!faq || !faq.isPublished) notFound();

    // Fetch related questions from the same parent category
    const { faqs: relatedFAQs } = await getPaginatedFAQs({
        page: 1,
        limit: 12,
        category: faq.parentQuestion || "",
        isPublished: true,
    });
    const related = relatedFAQs.filter((f: any) => f.slug !== slug).slice(0, 8);

    const hasDeepDive = faq.deepDive?.problem || faq.deepDive?.methodology || faq.deepDive?.application;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white transition-colors duration-300 pb-24">
            <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-8 flex-wrap">
                    <Link href="/questions" className="hover:text-sky-600 transition-colors font-bold flex items-center gap-1">
                        <ArrowLeft size={16} className="inline" /> Questions
                    </Link>
                    {faq.parentQuestion && (
                        <>
                            <ChevronRight size={14} />
                            <Link
                                href={`/questions?category=${encodeURIComponent(faq.parentQuestion)}`}
                                className="hover:text-sky-600 transition-colors font-medium"
                            >
                                {faq.parentQuestion}
                            </Link>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* ── Main Content ── */}
                    <div className="lg:col-span-2">

                        {/* Category badge + meta */}
                        <div className="flex items-center flex-wrap gap-3 mb-5">
                            {faq.parentQuestion && (
                                <Link
                                    href={`/questions?category=${encodeURIComponent(faq.parentQuestion)}`}
                                    className="text-xs font-bold px-3 py-1 rounded-full text-white bg-sky-500 hover:bg-sky-600 transition-colors uppercase tracking-widest cursor-pointer"
                                >
                                    {faq.parentQuestion}
                                </Link>
                            )}
                            <div className="flex items-center gap-1 text-slate-400 text-sm">
                                <Clock size={13} />
                                <span>{Math.max(1, Math.round(((faq.answerSnippet?.length || 0) + (faq.sourceText?.length || 0)) / 200))} min read</span>
                            </div>
                        </div>

                        {/* H1 */}
                        <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tight text-slate-900 dark:text-white">
                            {faq.h1Title || faq.question}
                        </h1>

                        {/* Answer Snippet — featured snippet box */}
                        {faq.answerSnippet && faq.answerSnippet !== 'not-given' && (
                            <div className="p-8 bg-white border border-slate-200 rounded-3xl dark:bg-slate-800/50 dark:border-slate-700 mb-10 shadow-xl shadow-sky-500/5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-500" />
                                <p className="text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed relative z-10">
                                    <span className="text-sky-600 dark:text-sky-400 font-black mr-2">Answer:</span>
                                    {faq.answerSnippet}
                                </p>
                            </div>
                        )}

                        {/* Source text (full answer) */}
                        {faq.sourceText && faq.sourceText !== 'not-given' && faq.sourceText !== faq.answerSnippet && (
                            <>
                                <h2 className="text-2xl font-black mt-10 mb-5 text-slate-900 dark:text-white flex items-center gap-3">
                                    <div className="w-9 h-9 bg-sky-100 dark:bg-sky-900/30 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
                                        <BookOpen size={18} />
                                    </div>
                                    Full Explanation
                                </h2>
                                <div className="prose prose-lg dark:prose-invert max-w-none prose-purple">
                                    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                        {faq.sourceText}
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Deep Dive Sections */}
                        {hasDeepDive && (
                            <div className="mt-12 space-y-8">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                    <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                                        <Zap size={18} />
                                    </div>
                                    Deep Dive
                                </h2>

                                {faq.deepDive?.problem && (
                                    <div className="p-6 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                                        <h3 className="font-bold text-rose-700 dark:text-rose-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
                                            <AlertTriangle size={15} /> The Challenge
                                        </h3>
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{faq.deepDive.problem}</p>
                                    </div>
                                )}
                                {faq.deepDive?.methodology && (
                                    <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                        <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
                                            <BookOpen size={15} /> The Approach
                                        </h3>
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{faq.deepDive.methodology}</p>
                                    </div>
                                )}
                                {faq.deepDive?.application && (
                                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                                        <h3 className="font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
                                            <CheckCircle2 size={15} /> Put It Into Practice
                                        </h3>
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{faq.deepDive.application}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Source Link */}
                        {faq.linkUrl && faq.linkUrl !== '#' && (
                            <div className="mt-12 p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Source Reference</p>
                                    <p className="font-bold text-slate-800 dark:text-slate-100">{faq.linkTitle || "View Source"}</p>
                                </div>
                                <a
                                    href={faq.linkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 flex items-center gap-2 text-sky-600 dark:text-sky-400 font-black text-sm hover:text-sky-700 transition-colors"
                                >
                                    Read Source <ExternalLink size={14} />
                                </a>
                            </div>
                        )}

                        {/* Quote block */}
                        <div className="mt-16 pt-12 border-t border-dashed border-slate-200 dark:border-slate-700">
                            <div className="p-8 bg-sky-50 dark:bg-sky-900/10 rounded-3xl border border-sky-100 dark:border-sky-900/30 relative">
                                <Quote className="text-sky-200 absolute top-6 right-6" size={40} />
                                <p className="text-lg font-medium italic text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl">
                                    &ldquo;{faq.answerSnippet || faq.question}&rdquo;
                                </p>
                                <p className="mt-4 text-xs font-black uppercase tracking-widest text-sky-500">K Business Academy</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Sidebar ── */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">

                            {/* Quick Info Card */}
                            <div className="p-6 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                <h4 className="font-bold mb-5 flex items-center gap-2 text-slate-800 dark:text-white text-sm">
                                    <HelpCircle size={16} className="text-sky-500" /> About This Question
                                </h4>

                                {faq.parentQuestion && (
                                    <div className="mb-4">
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1">
                                            <Tag size={10} /> Category
                                        </span>
                                        <Link
                                            href={`/questions?category=${encodeURIComponent(faq.parentQuestion)}`}
                                            className="text-sky-600 dark:text-sky-400 font-bold text-sm hover:underline"
                                        >
                                            {faq.parentQuestion}
                                        </Link>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Reading Time</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                                        {Math.max(1, Math.round(((faq.answerSnippet?.length || 0) + (faq.sourceText?.length || 0)) / 200))} min
                                    </span>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-3">
                                    <Link
                                        href="/questions"
                                        className="w-full text-center px-4 py-3 bg-sky-600 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-sky-700 transition-all shadow-lg shadow-sky-500/20"
                                    >
                                        Browse All Questions
                                    </Link>
                                    <Link
                                        href="/glossary"
                                        className="w-full text-center px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                                    >
                                        Business Glossary
                                    </Link>
                                </div>
                            </div>

                            {/* Related Questions */}
                            {related.length > 0 && (
                                <div className="p-6 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                    <h4 className="font-bold mb-5 flex items-center gap-2 text-slate-800 dark:text-white text-sm">
                                        <ChevronRight size={16} className="text-sky-500" /> Related Questions
                                    </h4>
                                    <ul className="space-y-3">
                                        {related.map((r: any) => (
                                            <li key={r.slug}>
                                                <Link
                                                    href={`/questions/${r.slug}`}
                                                    className="flex items-start gap-3 group text-sm text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                                                >
                                                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                                                    <span className="font-medium leading-snug line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                                                        {r.question}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                    {faq.parentQuestion && (
                                        <Link
                                            href={`/questions?category=${encodeURIComponent(faq.parentQuestion)}`}
                                            className="mt-6 flex items-center gap-1 text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 hover:text-sky-800 transition-colors"
                                        >
                                            See all in {faq.parentQuestion} <ChevronRight size={12} />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
