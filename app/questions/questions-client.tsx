"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    Book, Clock, ChevronRight, TrendingUp, Search,
    Zap, LayoutList, HelpCircle, MessageCircle, ArrowRight
} from 'lucide-react';
import RotatingAffiliateBanner from '@/components/glossary/RotatingAffiliateBanner';
import { SiteHeader } from '@/components/shared/SiteHeader';

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
        <div className="bg-[#fefae0] min-h-screen pb-20 font-medium">
            <SiteHeader />

            {/* Hero / Header */}
            <div className="pt-24 pb-12 px-6 text-center border-b border-[#bc6c25]/10">
                <div className="max-w-4xl mx-auto">
                    <span className="flex items-center justify-center gap-2 text-[#bc6c25] font-black tracking-[0.3em] text-xs mb-6 uppercase">
                        <HelpCircle size={16} /> Knowledge Base
                    </span>
                    <h1 className="text-4xl md:text-7xl font-black text-[#283618] mb-6 tracking-tight leading-[1.1]">
                        The Academy <span className="italic text-[#606c38]">Intelligence Hub.</span>
                    </h1>
                    <p className="text-xl text-[#283618]/60 font-bold mb-12 max-w-2xl mx-auto leading-relaxed">
                        Access {initialFAQs.length.toLocaleString()}+ tactical answers processed through our methodology.
                    </p>

                    {/* Search */}
                    <div className="relative max-w-2xl mx-auto mb-10">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#606c38]" size={24} />
                        <input
                            type="text"
                            placeholder="Query the database..."
                            className="w-full h-20 pl-16 pr-6 bg-white border-2 border-[#283618]/5 focus:border-[#606c38] rounded-3xl outline-none text-lg font-black transition-all shadow-xl shadow-[#283618]/5 placeholder-[#283618]/20 text-[#283618]"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                    </div>

                    {/* Inline Nav Row */}
                    <div className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-[#283618]/40 border-t border-[#bc6c25]/5 pt-10 mt-6 md:mt-10">
                        <button
                            onClick={() => { setShowLetters(!showLetters); setShowCategories(false); }}
                            className={`hover:text-[#606c38] transition-colors flex items-center gap-2 ${showLetters ? 'text-[#606c38]' : ''}`}
                        >
                            <Book size={14} /> Index Registry
                        </button>
                        <span className="opacity-20">|</span>
                        <button
                            onClick={() => { setShowCategories(!showCategories); setShowLetters(false); setCategoryActiveLetter(null); }}
                            className={`hover:text-[#606c38] transition-colors flex items-center gap-2 ${showCategories ? 'text-[#606c38]' : ''}`}
                        >
                            <LayoutList size={14} /> Operational Clusters
                        </button>
                        {(searchQuery || activeLetter || selectedCategory !== 'all') && (
                            <>
                                <span className="opacity-20">|</span>
                                <button onClick={resetFilters} className="text-[#bc6c25] hover:text-[#bc6c25]/80 transition-colors">
                                    Format Reset
                                </button>
                            </>
                        )}
                    </div>

                    {/* A-Z Letter browser */}
                    {showLetters && (
                        <div className="mt-10 flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 max-w-4xl mx-auto">
                            {characters.map(char => (
                                <button
                                    key={char}
                                    onClick={() => { setActiveLetter(activeLetter === char ? null : char); setCurrentPage(1); }}
                                    className={`w-12 h-12 rounded-xl text-[10px] font-black transition-all border ${
                                        activeLetter === char
                                            ? 'bg-[#606c38] text-[#fefae0] border-[#606c38] shadow-lg shadow-[#606c38]/30'
                                            : 'bg-white text-[#283618]/40 border-[#283618]/5 hover:border-[#606c38]'
                                    }`}
                                >
                                    {char}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Category browser */}
                    {showCategories && (
                        <div className="mt-10 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                                <button
                                    onClick={() => { setSelectedCategory('all'); setCurrentPage(1); setCategoryActiveLetter(null); }}
                                    className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all border uppercase tracking-widest ${
                                        selectedCategory === 'all' && !categoryActiveLetter ? 'bg-[#606c38] text-[#fefae0] border-[#606c38]' : 'bg-white text-[#283618]/40 border-[#283618]/5'
                                    }`}
                                >Root Directory</button>
                                {alphabet.map(letter => (
                                    <button
                                        key={letter}
                                        onClick={() => setCategoryActiveLetter(categoryActiveLetter === letter ? null : letter)}
                                        className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all border ${
                                            categoryActiveLetter === letter
                                                ? 'bg-[#dda15e] text-[#283618] border-[#dda15e] shadow-lg shadow-[#dda15e]/20'
                                                : 'bg-white text-[#283618]/40 border-[#283618]/5 hover:border-[#bc6c25]'
                                        }`}
                                    >{letter}</button>
                                ))}
                            </div>
                            {categoryActiveLetter && (
                                <div className="flex flex-wrap justify-center gap-3 animate-in fade-in duration-300 max-w-5xl mx-auto">
                                    {filteredCategoryList.length > 0 ? filteredCategoryList.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                                            className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase transition-all border tracking-widest ${
                                                selectedCategory === cat
                                                    ? 'bg-[#606c38] text-[#fefae0] border-[#606c38] shadow-xl'
                                                    : 'bg-white text-[#283618]/50 border-[#283618]/5 hover:border-[#606c38] hover:text-[#606c38]'
                                            }`}
                                        >{cat}</button>
                                    )) : (
                                        <p className="text-[10px] font-black text-[#283618]/20 uppercase tracking-widest italic">No operational clusters found for &ldquo;{categoryActiveLetter}&rdquo;</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex flex-col gap-20">

                    {/* Spotlight Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Daily Intelligence */}
                        <div className="bg-white p-12 rounded-[3.5rem] border border-[#283618]/5 shadow-2xl shadow-[#283618]/5 relative overflow-hidden flex flex-col justify-center group">
                            <div className="absolute -top-10 -right-10 p-8 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700 text-[#606c38]"><HelpCircle size={200} /></div>
                            <div className="relative z-10">
                                <span className="inline-block px-4 py-1.5 bg-[#bc6c25] text-[#fefae0] text-[10px] font-black uppercase tracking-widest rounded-xl mb-8 shadow-lg shadow-[#bc6c25]/20">Daily Intelligence Spotlight</span>
                                {spotlightFAQ ? (
                                    <>
                                        <h2 className="text-3xl font-black text-[#283618] mb-6 leading-tight group-hover:text-[#606c38] transition-colors">{spotlightFAQ.question}</h2>
                                        <p className="text-[#283618]/60 mb-10 line-clamp-3 leading-relaxed font-bold italic">{spotlightFAQ.answerSnippet}</p>
                                        <Link href={`/questions/${spotlightFAQ.slug}`} className="text-[#606c38] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-2 transition-all">
                                            Read Methodology <ArrowRight size={18} />
                                        </Link>
                                    </>
                                ) : (
                                    <div className="h-48 animate-pulse bg-[#606c38]/5 rounded-[2rem]" />
                                )}
                            </div>
                        </div>

                        {/* Partner Ecosystem */}
                        <div className="bg-[#283618] p-12 rounded-[3.5rem] border border-[#283618] flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-[#283618]/20">
                            <div className="absolute -top-10 -right-10 p-8 opacity-5 rotate-[15deg] text-white"><Zap size={200} /></div>
                            <div className="relative z-10">
                                <span className="inline-block px-4 py-1.5 bg-[#606c38] text-[#fefae0] text-[10px] font-black uppercase tracking-widest rounded-xl mb-8">Ecosystem Leverage</span>
                                <h3 className="text-[#fefae0] font-black text-2xl mb-10 italic">Operational Toolkit Support.</h3>
                                <RotatingAffiliateBanner products={products} />
                            </div>
                        </div>
                    </div>

                    {/* Card Grid */}
                    <div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 pb-6 border-b border-[#283618]/5 px-4 gap-6">
                            <h3 className="text-3xl font-black text-[#283618] flex items-center gap-4 italic uppercase tracking-tighter">
                                {selectedCategory !== 'all' ? selectedCategory : 'Intelligence Registry'}
                                {activeLetter && <span className="text-[#bc6c25]">— {activeLetter}</span>}
                            </h3>
                            <div className="bg-[#606c38] text-[#fefae0] px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#606c38]/20 whitespace-nowrap self-start">
                                {filteredFAQs.length.toLocaleString()} Operational Nodes
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {currentItems.map((faq: any) => (
                                <Link
                                    key={faq.slug}
                                    href={`/questions/${faq.slug}`}
                                    className="bg-white p-10 rounded-[2.5rem] border border-[#283618]/5 hover:border-[#606c38]/30 hover:shadow-[0_20px_50px_rgba(40,54,24,0.1)] transition-all duration-500 group animate-in fade-in slide-in-from-bottom-6 flex flex-col h-full relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-2 h-0 bg-[#606c38] group-hover:h-full transition-all duration-500" />
                                    
                                    {faq.parentQuestion && (
                                        <div className="text-[9px] font-black uppercase tracking-widest text-[#bc6c25] mb-6 bg-[#dda15e]/10 px-3 py-1 rounded-lg self-start line-clamp-1 border border-[#bc6c25]/5">
                                            {faq.parentQuestion}
                                        </div>
                                    )}
                                    <h3 className="text-lg font-black text-[#283618] mb-6 group-hover:text-[#606c38] transition-colors leading-tight line-clamp-3 flex-grow underline decoration-[#606c38]/0 group-hover:decoration-[#606c38]/30 decoration-2 underline-offset-4">
                                        {faq.question}
                                    </h3>
                                    {faq.answerSnippet && (
                                        <p className="text-[#283618]/50 text-sm leading-relaxed line-clamp-2 mb-8 font-bold italic">
                                            {faq.answerSnippet}
                                        </p>
                                    )}
                                    <div className="pt-6 border-t border-[#283618]/5 flex items-center justify-between text-[10px] font-black uppercase text-[#283618]/30">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-[#bc6c25]" /> {Math.max(1, Math.round((faq.answerSnippet?.length || 80) / 200))}m analysis
                                        </div>
                                        <div className="bg-[#606c38]/5 p-2 rounded-lg group-hover:bg-[#606c38] group-hover:text-[#fefae0] transition-all">
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {currentItems.length === 0 && (
                            <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-[#283618]/10 shadow-xl shadow-[#283618]/5">
                                <Search size={60} className="mx-auto text-[#283618]/10 mb-8" />
                                <h3 className="text-3xl font-black text-[#283618] mb-4">No Nodes Detected.</h3>
                                <p className="text-[#283618]/40 max-w-sm mx-auto font-bold mb-10 italic">Adjust your parameters or expand your cluster search.</p>
                                <button onClick={resetFilters} className="bg-[#bc6c25] text-[#fefae0] px-10 h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#bc6c25]/20 hover:scale-105 transition-all">Clear Search Filters</button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-24 flex flex-col items-center gap-10">
                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-[#283618]/5 bg-white text-[#283618]/30 hover:text-[#606c38] hover:border-[#606c38] disabled:opacity-30 transition-all"
                                    ><ArrowRight size={24} className="rotate-180" /></button>

                                    <div className="flex items-center gap-2 px-4">
                                        {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                                            const p = currentPage > 6 ? currentPage - 5 + i : i + 1;
                                            if (p > totalPages) return null;
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    className={`w-14 h-14 rounded-2xl text-[11px] font-black transition-all ${
                                                        currentPage === p
                                                            ? 'bg-[#606c38] text-[#fefae0] shadow-2xl shadow-[#606c38]/30 scale-110'
                                                            : 'bg-white border-2 border-[#283618]/5 text-[#283618]/30 hover:border-[#bc6c25] hover:text-[#bc6c25]'
                                                    }`}
                                                >{p}</button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-[#283618]/5 bg-white text-[#283618]/30 hover:text-[#606c38] hover:border-[#606c38] disabled:opacity-30 transition-all"
                                    ><ArrowRight size={24} /></button>
                                </div>
                                <p className="text-[10px] text-[#283618]/30 font-black uppercase tracking-[0.3em] bg-white px-6 py-2 rounded-full border border-[#283618]/5">
                                    Page {currentPage} of {totalPages} · {filteredFAQs.length.toLocaleString()} Intelligence Nodes
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer Discovery - Popular Categories */}
                    <div className="mt-20 pt-24 border-t border-[#bc6c25]/10">
                        <div className="max-w-5xl mx-auto space-y-20">
                            <div className="text-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#bc6c25] mb-10 block">Operational Cluster Directory</span>
                                <div className="bg-white p-16 rounded-[4rem] border border-[#283618]/5 shadow-2xl shadow-[#283618]/5">
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {categories.slice(0, 40).map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                                                    selectedCategory === cat
                                                        ? 'bg-[#606c38] text-[#fefae0] shadow-lg'
                                                        : 'bg-[#fefae0]/50 text-[#283618]/60 border border-[#283618]/5 hover:bg-[#606c38]/10 hover:text-[#606c38] hover:border-[#606c38]'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Footer - Dark Theme */}
            <footer className="py-20 bg-[#283618] text-[#fefae0]/40 border-t border-[#fefae0]/5 mt-20">
                <div className="container px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3 grayscale brightness-200 opacity-40">
                        <div className="w-10 h-10 bg-[#606c38] rounded-xl flex items-center justify-center font-black text-[#fefae0] text-xl">K</div>
                        <span className="font-bold tracking-tighter text-xl">K BUSINESS INTELLIGENCE</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">© 2026 Global Knowledge Architecture</p>
                    <nav className="flex gap-12">
                        <Link href="/courses" className="font-bold hover:text-[#dda15e] transition-colors text-xs uppercase tracking-widest">Strategy</Link>
                        <Link href="/library" className="font-bold hover:text-[#dda15e] transition-colors text-xs uppercase tracking-widest">Library</Link>
                        <Link href="#" className="font-bold hover:text-[#dda15e] transition-colors text-xs uppercase tracking-widest">Registry</Link>
                        <Link href="#" className="font-bold hover:text-[#dda15e] transition-colors text-xs uppercase tracking-widest">Access</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}

export default function QuestionsClient(props: QuestionsClientProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#fefae0] flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#606c38]" /></div>}>
            <QuestionsClientInner {...props} />
        </Suspense>
    );
}
