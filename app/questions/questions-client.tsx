"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    Book, Clock, ChevronRight, TrendingUp, Search,
    Zap, LayoutList, HelpCircle, MessageCircle
} from 'lucide-react';
import { PaymentSupport } from '@/components/PaymentSupport';
import RotatingAffiliateBanner from '@/components/glossary/RotatingAffiliateBanner';

interface QuestionsClientProps {
    initialFAQs: any[];
    categories: string[];
    products?: any[];
}

function QuestionsClientInner({ initialFAQs, categories, products = [] }: QuestionsClientProps) {
    const searchParams = useSearchParams();
    const [faqs, setFaqs] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLetter, setActiveLetter] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 24;
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [spotlightFAQ, setSpotlightFAQ] = useState<any>(null);
    const [showLetters, setShowLetters] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [categoryActiveLetter, setCategoryActiveLetter] = useState<string | null>(null);

    useEffect(() => {
        if (!initialFAQs) return;
        const shuffled = [...initialFAQs].sort(() => Math.random() - 0.5);
        setFaqs(shuffled);
        setSpotlightFAQ(shuffled[Math.floor(Math.random() * shuffled.length)]);
    }, [initialFAQs]);

    useEffect(() => {
        if (!searchParams) return;
        const cat = searchParams.get('category');
        if (cat) { setSelectedCategory(cat); setCurrentPage(1); }
    }, [searchParams]);

    const filteredFAQs = useMemo(() => {
        return faqs.filter(faq => {
            const matchesSearch = !searchQuery ||
                faq.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answerSnippet?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLetter = !activeLetter ||
                (activeLetter === '0-9' ? /^[0-9]/.test(faq.question) : faq.question?.toUpperCase().startsWith(activeLetter));
            const matchesCategory = selectedCategory === 'all' || faq.parentQuestion === selectedCategory;
            return matchesSearch && matchesLetter && matchesCategory;
        });
    }, [faqs, searchQuery, activeLetter, selectedCategory]);

    const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
    const currentItems = filteredFAQs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const resetFilters = () => {
        setSearchQuery('');
        setActiveLetter(null);
        setSelectedCategory('all');
        setCategoryActiveLetter(null);
        setCurrentPage(1);
        setShowLetters(false);
        setShowCategories(false);
    };

    const characters = ["0-9", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const filteredCategoryList = useMemo(() => {
        if (!categoryActiveLetter) return [];
        return categories.filter(cat => cat.toUpperCase().startsWith(categoryActiveLetter));
    }, [categoryActiveLetter, categories]);

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen pb-20">
            {/* Hero / Header */}
            <div className="pt-24 pb-12 px-6 text-center border-b border-slate-100 dark:border-slate-800">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
                        The Business <span className="text-sky-500">Questions Library</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium mb-12 italic">
                        {initialFAQs.length.toLocaleString()}+ questions answered. Find yours.
                    </p>

                    {/* Search */}
                    <div className="relative max-w-2xl mx-auto mb-8">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl outline-none text-lg font-bold transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                    </div>

                    {/* Inline Nav Row */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-black uppercase tracking-widest text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-8 mt-4">
                        <button
                            onClick={() => { setShowLetters(!showLetters); setShowCategories(false); }}
                            className={`hover:text-sky-600 transition-colors flex items-center gap-2 ${showLetters ? 'text-sky-500' : ''}`}
                        >
                            <Book size={14} /> Browse A-Z
                        </button>
                        <span className="text-slate-200">|</span>
                        <button
                            onClick={() => { setShowCategories(!showCategories); setShowLetters(false); setCategoryActiveLetter(null); }}
                            className={`hover:text-sky-600 transition-colors flex items-center gap-2 ${showCategories ? 'text-sky-500' : ''}`}
                        >
                            <LayoutList size={14} /> Explore Categories
                        </button>
                        {(searchQuery || activeLetter || selectedCategory !== 'all') && (
                            <>
                                <span className="text-slate-200">|</span>
                                <button onClick={resetFilters} className="text-red-400 hover:text-red-600 transition-colors">
                                    Clear Filters
                                </button>
                            </>
                        )}
                    </div>

                    {/* A-Z Letter browser */}
                    {showLetters && (
                        <div className="mt-8 flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            {characters.map(char => (
                                <button
                                    key={char}
                                    onClick={() => { setActiveLetter(activeLetter === char ? null : char); setCurrentPage(1); }}
                                    className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all border ${
                                        activeLetter === char
                                            ? 'bg-sky-600 text-white border-sky-600 shadow-lg'
                                            : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800 hover:border-sky-500'
                                    }`}
                                >
                                    {char}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Category browser */}
                    {showCategories && (
                        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex flex-wrap justify-center gap-1.5 max-w-2xl mx-auto">
                                <button
                                    onClick={() => { setSelectedCategory('all'); setCurrentPage(1); setCategoryActiveLetter(null); }}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border ${
                                        selectedCategory === 'all' && !categoryActiveLetter ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-50 dark:bg-slate-100/5 text-slate-400'
                                    }`}
                                >ALL</button>
                                {alphabet.map(letter => (
                                    <button
                                        key={letter}
                                        onClick={() => setCategoryActiveLetter(categoryActiveLetter === letter ? null : letter)}
                                        className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all border ${
                                            categoryActiveLetter === letter
                                                ? 'bg-sky-600 text-white border-sky-600 shadow-lg'
                                                : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800 hover:border-sky-500'
                                        }`}
                                    >{letter}</button>
                                ))}
                            </div>
                            {categoryActiveLetter && (
                                <div className="flex flex-wrap justify-center gap-2 animate-in fade-in duration-300">
                                    {filteredCategoryList.length > 0 ? filteredCategoryList.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                                            className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase transition-all border ${
                                                selectedCategory === cat
                                                    ? 'bg-sky-600 text-white border-sky-600 shadow-xl'
                                                    : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-sky-500 hover:text-sky-600'
                                            }`}
                                        >{cat}</button>
                                    )) : (
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No categories starting with &ldquo;{categoryActiveLetter}&rdquo;</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col gap-16">

                    {/* Spotlight Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Question of the Day */}
                        <div className="bg-sky-50 dark:bg-sky-900/10 p-10 rounded-[2.5rem] border border-sky-100 dark:border-sky-900/30 relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><HelpCircle size={100} className="text-sky-600" /></div>
                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 bg-sky-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">Question of the Day</span>
                                {spotlightFAQ ? (
                                    <>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{spotlightFAQ.question}</h2>
                                        <p className="text-slate-600 dark:text-slate-400 mb-8 line-clamp-3 leading-relaxed font-medium">{spotlightFAQ.answerSnippet}</p>
                                        <Link href={`/questions/${spotlightFAQ.slug}`} className="text-sky-600 font-black text-sm uppercase tracking-wider flex items-center gap-2 hover:translate-x-1 transition-all">
                                            Read Full Answer <ChevronRight size={16} />
                                        </Link>
                                    </>
                                ) : (
                                    <div className="h-40 animate-pulse bg-sky-200/20 rounded-2xl" />
                                )}
                            </div>
                        </div>

                        {/* Rotating Affiliate Tools */}
                        <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Zap size={100} className="text-white fill-current" /></div>
                            <div className="relative z-10">
                                <h3 className="text-white font-black text-xl mb-8">Boost Your Workflow</h3>
                                <RotatingAffiliateBanner products={products} />
                            </div>
                        </div>
                    </div>

                    {/* Card Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800 px-2">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                {selectedCategory !== 'all' ? selectedCategory : 'All Questions'}
                                {activeLetter && <span className="text-sky-500">— {activeLetter}</span>}
                            </h3>
                            <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800">
                                {filteredFAQs.length.toLocaleString()} results
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentItems.map((faq: any) => (
                                <Link
                                    key={faq.slug}
                                    href={`/questions/${faq.slug}`}
                                    className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-sky-500/50 hover:shadow-2xl transition-all group animate-in fade-in slide-in-from-bottom-4 flex flex-col h-full"
                                >
                                    {faq.parentQuestion && (
                                        <div className="text-[9px] font-black uppercase tracking-widest text-sky-500 mb-4 bg-sky-50 dark:bg-sky-900/20 px-2 py-0.5 rounded-md inline-block self-start line-clamp-1">
                                            {faq.parentQuestion}
                                        </div>
                                    )}
                                    <h3 className="text-base font-black text-slate-900 dark:text-white mb-4 group-hover:text-sky-500 transition-colors leading-tight line-clamp-3 flex-grow">
                                        {faq.question}
                                    </h3>
                                    {faq.answerSnippet && (
                                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2 mb-6 font-medium">
                                            {faq.answerSnippet}
                                        </p>
                                    )}
                                    <div className="pt-4 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between text-[10px] font-black uppercase text-slate-300">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={11} /> {Math.max(1, Math.round((faq.answerSnippet?.length || 80) / 200))}m read
                                        </div>
                                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-all text-sky-500" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {currentItems.length === 0 && (
                            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <Search size={40} className="mx-auto text-slate-200 mb-4" />
                                <h3 className="text-xl font-bold mb-2">No questions found</h3>
                                <p className="text-slate-500">Try a different search term or clear your filters.</p>
                                <button onClick={resetFilters} className="mt-6 text-sky-600 font-black text-sm underline">Clear all filters</button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-20 flex flex-col items-center gap-6">
                                <div className="flex items-center gap-1">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-sky-600 disabled:opacity-30 transition-all font-black"
                                    ><ChevronRight size={20} className="rotate-180" /></button>

                                    <div className="flex items-center gap-1 px-4">
                                        {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                                            const p = currentPage > 6 ? currentPage - 5 + i : i + 1;
                                            if (p > totalPages) return null;
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    className={`w-12 h-12 rounded-2xl text-sm font-black transition-all ${
                                                        currentPage === p
                                                            ? 'bg-sky-600 text-white shadow-xl shadow-sky-500/20 scale-110'
                                                            : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:border-sky-500 hover:text-sky-600'
                                                    }`}
                                                >{p}</button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-sky-600 disabled:opacity-30 transition-all font-black"
                                    ><ChevronRight size={20} /></button>
                                </div>
                                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">
                                    Page {currentPage} of {totalPages} · {filteredFAQs.length.toLocaleString()} results
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer Discovery - Popular Categories */}
                    <div className="mt-24 pt-24 border-t border-slate-100 dark:border-slate-800">
                        <div className="max-w-4xl mx-auto space-y-16">
                            <div className="text-center">
                                <h4 className="text-xs font-black uppercase tracking-widest text-sky-600 mb-8">Popular Question Topics</h4>
                                <div className="bg-slate-50 dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {categories.slice(0, 30).map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                                    selectedCategory === cat
                                                        ? 'bg-sky-600 text-white shadow-lg'
                                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-300 hover:text-sky-600'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <PaymentSupport className="border-none bg-slate-50 dark:bg-slate-900 shadow-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function QuestionsClient(props: QuestionsClientProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600" /></div>}>
            <QuestionsClientInner {...props} />
        </Suspense>
    );
}
