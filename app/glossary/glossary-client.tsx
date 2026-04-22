"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Book, Clock, ChevronRight, TrendingUp, Search, Zap, LayoutList, Trophy, Heart, ArrowRight, HelpCircle } from 'lucide-react';
import TagCloud from '../../components/glossary/TagCloud';
import RotatingAffiliateBanner from '../../components/glossary/RotatingAffiliateBanner';
import { SiteHeader } from '@/components/shared/SiteHeader';

interface GlossaryClientProps {
  initialTerms: any[];
  categories: string[];
  products?: any[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function GlossaryClientInner({ initialTerms, categories, products = [] }: GlossaryClientProps) {
  const searchParams = useSearchParams();
  const [terms, setTerms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [keywordOfTheDay, setKeywordOfTheDay] = useState<any>(null);
  const [showLetters, setShowLetters] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [categoryActiveLetter, setCategoryActiveLetter] = useState<string | null>(null);

  useEffect(() => {
    if (!initialTerms) return;
    const shuffled = shuffleArray(initialTerms);
    setTerms(shuffled);
    setKeywordOfTheDay(shuffled[Math.floor(Math.random() * shuffled.length)]);
  }, [initialTerms]);

  useEffect(() => {
    if (!searchParams) return;
    const tagParam = searchParams.get('tag');
    const categoryParam = searchParams.get('category');
    if (tagParam) { setSelectedTag(tagParam); setSelectedCategory('all'); setSearchQuery(''); setActiveLetter(null); setCurrentPage(1); }
    if (categoryParam) { setSelectedCategory(categoryParam); setSelectedTag('all'); setSearchQuery(''); setActiveLetter(null); setCurrentPage(1); }
  }, [searchParams]);

  const filteredTerms = useMemo(() => {
    return terms.filter(term => {
      const matchesSearch = !searchQuery || 
                            term.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            term.shortDefinition?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLetter = !activeLetter || 
                            (activeLetter === '0-9' ? /^[0-9]/.test(term.term) : term.term.toUpperCase().startsWith(activeLetter));
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
      const matchesTag = selectedTag === 'all' || (term.tags && term.tags.includes(selectedTag));
      return matchesSearch && matchesLetter && matchesCategory && matchesTag;
    });
  }, [terms, searchQuery, activeLetter, selectedCategory, selectedTag]);

  const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
  const currentItems = filteredTerms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setSearchQuery('');
    setActiveLetter(null);
    setSelectedCategory('all');
    setSelectedTag('all');
    setCategoryActiveLetter(null);
    setCurrentPage(1);
    setShowLetters(false);
    setShowCategories(false);
  };

  const characters = ["0-9", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const filteredCategories = useMemo(() => {
    if (!categoryActiveLetter) return [];
    return categories.filter(cat => cat.toUpperCase().startsWith(categoryActiveLetter));
  }, [categoryActiveLetter, categories]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-medium text-slate-900">
      <SiteHeader />

      {/* Hero / Header Section */}
      <div className="pt-24 pb-12 px-6 text-center border-b border-emerald-100">
        <div className="max-w-4xl mx-auto">
          <span className="flex items-center justify-center gap-2 text-emerald-600 font-black tracking-[0.3em] text-xs mb-6 uppercase">
            <TrendingUp size={16} /> Technical Registry
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
            The Academy <span className="italic text-emerald-600">Knowledgebase.</span>
          </h1>
          <p className="text-xl text-slate-600 font-bold mb-12 max-w-2xl mx-auto leading-relaxed italic">
            Master the operational language of high-performance business, one concept at a time.
          </p>

          <div className="relative max-w-2xl mx-auto mb-10">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600" size={24} />
            <input
              type="text"
              placeholder="Query the glossary..."
              className="w-full h-20 pl-16 pr-6 bg-white border-2 border-slate-100 focus:border-emerald-500 rounded-3xl outline-none text-lg font-black transition-all shadow-xl shadow-slate-200/50 text-slate-900 placeholder-slate-300"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>

          {/* Inline Navigation Row */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-t border-slate-100 pt-10 mt-6 md:mt-10">
             <button 
                onClick={() => { setShowLetters(!showLetters); setShowCategories(false); }} 
                className={`hover:text-emerald-600 transition-colors flex items-center gap-2 ${showLetters ? 'text-emerald-600' : ''}`}
             >
                <Book size={14} /> Index Table
             </button>
             <span className="opacity-20">|</span>
             <button 
                onClick={() => { setShowCategories(!showCategories); setShowLetters(false); setCategoryActiveLetter(null); }} 
                className={`hover:text-emerald-600 transition-colors flex items-center gap-2 ${showCategories ? 'text-emerald-600' : ''}`}
             >
                <LayoutList size={14} /> Taxonomy Search
             </button>
             <span className="opacity-20">|</span>
             <Link href="/glossary/study" className="hover:text-emerald-600 transition-colors flex items-center gap-2">
                <Zap size={14} className="fill-current" /> Mastery Mode
             </Link>
          </div>

          {/* Sub-Nav: Letters */}
          {showLetters && (
            <div className="mt-10 flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 max-w-4xl mx-auto">
                {characters.map(char => (
                    <button 
                        key={char}
                        onClick={() => { setActiveLetter(activeLetter === char ? null : char); setCurrentPage(1); }}
                        className={`w-12 h-12 rounded-xl text-[10px] font-black transition-all border ${
                            activeLetter === char 
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200' 
                                : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-500'
                        }`}
                    >
                        {char}
                    </button>
                ))}
            </div>
          )}

          {/* Sub-Nav: Categories (Hierarchical) */}
          {showCategories && (
            <div className="mt-10 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                    <button 
                         onClick={() => { setSelectedCategory('all'); setCurrentPage(1); setCategoryActiveLetter(null); }}
                         className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all border uppercase tracking-widest ${
                             selectedCategory === 'all' && !categoryActiveLetter ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400 border-slate-100'
                         }`}
                    >
                        ALL
                    </button>
                    {alphabet.map(letter => (
                        <button 
                            key={letter}
                            onClick={() => setCategoryActiveLetter(categoryActiveLetter === letter ? null : letter)}
                            className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all border ${
                                categoryActiveLetter === letter 
                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100' 
                                    : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-500'
                            }`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>

                {categoryActiveLetter && (
                    <div className="flex flex-wrap justify-center gap-3 animate-in fade-in duration-300 max-w-5xl mx-auto">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                                    className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase transition-all border tracking-widest ${
                                        selectedCategory === cat 
                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl' 
                                            : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-500 hover:text-emerald-600'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))
                        ) : (
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No operational clusters found for &ldquo;{categoryActiveLetter}&rdquo;</p>
                        )}
                    </div>
                )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col gap-20">
          
          {/* Daily Spotlight Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Keyword of the Day */}
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden flex flex-col justify-center group">
                <div className="absolute -top-10 -right-10 p-8 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700 text-emerald-600"><TrendingUp size={200} /></div>
                <div className="relative z-10">
                    <span className="inline-block px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl mb-8 shadow-lg shadow-emerald-200">Registry Spotlight</span>
                    {keywordOfTheDay ? (
                        <>
                            <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tighter">{keywordOfTheDay.term}</h2>
                            <p className="text-slate-500 mb-10 line-clamp-3 leading-relaxed font-bold italic">{keywordOfTheDay.shortDefinition}</p>
                            <Link href={`/glossary/${keywordOfTheDay.slug}`} className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-2 transition-all">
                                Analyze Term <ArrowRight size={18} />
                            </Link>
                        </>
                    ) : (
                        <div className="h-48 animate-pulse bg-emerald-50 rounded-2xl" />
                    )}
                </div>
            </div>

            {/* Partner Ecosystem */}
            <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-slate-800 flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-slate-900/20">
                <div className="absolute -top-10 -right-10 p-8 opacity-5 rotate-[15deg] text-white"><Zap size={200} /></div>
                <div className="relative z-10">
                    <span className="inline-block px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl mb-8">Ecosystem Leverage</span>
                    <h3 className="text-white font-black text-2xl mb-10 italic">Strategic Partnerships.</h3>
                    <RotatingAffiliateBanner products={products} />
                </div>
            </div>
          </div>

          {/* Card Grid Section */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 pb-6 border-b border-slate-100 px-4 gap-6">
                <h3 className="text-3xl font-black text-slate-900 flex items-center gap-4 italic uppercase tracking-tighter">
                   Essential Vocabulary
                </h3>
                <div className="bg-emerald-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-200 whitespace-nowrap self-start">
                    Analyzing {filteredTerms.length.toLocaleString()} Concepts
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {currentItems.map((term: any) => (
                    <Link 
                        key={term.slug}
                        href={`/glossary/${term.slug}`}
                        className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-emerald-500/30 hover:shadow-[0_20px_50px_rgba(5,150,105,0.1)] transition-all duration-500 group animate-in fade-in slide-in-from-bottom-6 flex flex-col h-full relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-2 h-0 bg-emerald-600 group-hover:h-full transition-all duration-500" />
                        
                        <div className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-6 bg-emerald-50 px-3 py-1 rounded-lg self-start border border-emerald-100">{term.category}</div>
                        <h3 className="text-xl font-black text-slate-900 mb-6 group-hover:text-emerald-600 transition-colors leading-tight underline decoration-emerald-600/0 group-hover:decoration-emerald-600/30 decoration-2 underline-offset-4">{term.term}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8 flex-grow font-bold italic">{term.shortDefinition}</p>
                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                             <div className="flex items-center gap-2 transition-colors"><Clock size={14} className="text-emerald-600" /> {Math.round((term.shortDefinition?.length || 100) / 100) + 1}m study</div>
                             <div className="bg-emerald-50 p-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <ArrowRight size={16} />
                             </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredTerms.length === 0 && (
                <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-xl shadow-slate-200/50">
                    <Search size={60} className="mx-auto text-slate-100 mb-8" />
                    <h3 className="text-3xl font-black text-slate-900 mb-4">No Concepts Detected.</h3>
                    <p className="text-slate-400 max-w-sm mx-auto font-bold mb-10 italic">Adjust your parameters or expand your cluster search.</p>
                    <button onClick={resetFilters} className="bg-emerald-600 text-white px-10 h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:scale-105 transition-all">Clear Search Filters</button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-24 flex flex-col items-center gap-10">
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-slate-100 bg-white text-slate-300 hover:text-emerald-600 hover:border-emerald-600 disabled:opacity-30 transition-all"
                        >
                            <ArrowRight size={24} className="rotate-180" />
                        </button>
                        
                        <div className="flex items-center gap-2 px-4">
                            {Array.from({ length: Math.min(10, totalPages) }, (_, i) => i + 1).map(p => (
                                <button 
                                    key={p} 
                                    onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                                    className={`w-14 h-14 rounded-2xl text-[11px] font-black transition-all ${
                                        currentPage === p 
                                            ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-200 scale-110' 
                                            : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-emerald-500 hover:text-emerald-600'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-slate-100 bg-white text-slate-300 hover:text-emerald-600 hover:border-emerald-600 disabled:opacity-30 transition-all"
                        >
                            <ArrowRight size={24} />
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] bg-white px-6 py-2 rounded-full border border-slate-100">
                        Page {currentPage} of {totalPages} · {filteredTerms.length.toLocaleString()} Registry Concepts
                    </p>
                </div>
            )}
          </div>

          {/* Footer Discovery - Popular Tags */}
          <div className="mt-20 pt-24 border-t border-slate-100">
             <div className="max-w-5xl mx-auto space-y-20">
                <div className="text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-10 block">Concept Taxonomy Directory</span>
                    <div className="bg-white p-16 rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                        <TagCloud terms={terms} onSelectTag={(tag) => { setSelectedTag(tag); setSelectedCategory('all'); setCurrentPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} activeTag={selectedTag} />
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* Global Footer - Dark Theme */}
      <footer className="py-20 bg-slate-900 text-slate-400 border-t border-white/5 mt-20">
          <div className="container px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex items-center gap-3 grayscale brightness-200 opacity-40">
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-black text-white text-xl">K</div>
                  <span className="font-bold tracking-tighter text-xl uppercase">K Business Glossary</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">© 2026 Registry Protocols. Systematic Results.</p>
              <nav className="flex gap-12">
                  <Link href="/courses" className="font-bold hover:text-emerald-500 transition-colors text-[10px] uppercase tracking-widest">Courses</Link>
                  <Link href="/blog" className="font-bold hover:text-emerald-500 transition-colors text-[10px] uppercase tracking-widest">Blog</Link>
                  <Link href="/questions" className="font-bold hover:text-emerald-500 transition-colors text-[10px] uppercase tracking-widest">People Asked Questions</Link>
                  <Link href="/locations" className="font-bold hover:text-emerald-500 transition-colors text-[10px] uppercase tracking-widest">Research Database</Link>
              </nav>
          </div>
      </footer>
    </div>
  );
}

export default function GlossaryClient(props: GlossaryClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-emerald-600"></div></div>}>
      <GlossaryClientInner {...props} />
    </Suspense>
  );
}
