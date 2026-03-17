"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, Book, Calculator, TrendingUp, Zap, ChevronRight, Clock, Bookmark, LayoutList, Trophy, ArrowRight
} from 'lucide-react';
import TagCloud from '../../components/glossary/TagCloud';
import RotatingAffiliateBanner from '../../components/glossary/RotatingAffiliateBanner';

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
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [keywordOfTheDay, setKeywordOfTheDay] = useState<any>(null);

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
      const matchesLetter = !activeLetter || term.term.toUpperCase().startsWith(activeLetter);
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
    setCurrentPage(1);
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-20">
      {/* Hero / Header Section */}
      <div className="pt-24 pb-12 px-6 text-center border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
            The Internet Marketer <span className="text-emerald-500">Keyword Glossary</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium mb-12 italic">
            Master Keywords and Niche Marketing one word at a time.
          </p>

          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input
              type="text"
              placeholder="Search specific keywords or niches..."
              className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl outline-none text-lg font-bold transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>

          {/* Inline Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-black uppercase tracking-widest text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-8 mt-4">
             <button onClick={() => { setSearchQuery(''); setActiveLetter(null); }} className="hover:text-emerald-600 transition-colors flex items-center gap-2">
                <Book size={14} /> Browse A-Z
             </button>
             <span className="text-slate-200">|</span>
             <button onClick={() => { setSelectedCategory('all'); }} className="hover:text-emerald-600 transition-colors flex items-center gap-2">
                <LayoutList size={14} /> Search Categories
             </button>
             <span className="text-slate-200">|</span>
             <Link href="/glossary/study" className="hover:text-emerald-600 transition-colors flex items-center gap-2">
                <Zap size={14} className="fill-current" /> Enter Study Mode
             </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-16">
          
          {/* Daily Spotlight Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            {/* Keyword of the Day */}
            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><TrendingUp size={100} className="text-emerald-600" /></div>
                <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">Keyword of the Day</span>
                    {keywordOfTheDay ? (
                        <>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">{keywordOfTheDay.term}</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 line-clamp-3 leading-relaxed font-medium">{keywordOfTheDay.shortDefinition}</p>
                            <Link href={`/glossary/${keywordOfTheDay.slug}`} className="text-emerald-600 font-black text-sm uppercase tracking-wider flex items-center gap-2 hover:translate-x-1 transition-all">
                                Learn More <ChevronRight size={16} />
                            </Link>
                        </>
                    ) : (
                        <div className="h-40 animate-pulse bg-emerald-200/20 rounded-2xl" />
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

          {/* Randomized Grid Section */}
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800 px-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                   Essential Keywords
                </h3>
                <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800">
                    Randomizing {currentItems.length} Terms
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentItems.map((term: any) => (
                    <Link 
                        key={term.slug}
                        href={`/glossary/${term.slug}`}
                        className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-2xl transition-all group animate-in fade-in slide-in-from-bottom-4 flex flex-col h-full relative"
                    >
                        <div className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-4 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md inline-block self-start">{term.category}</div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-emerald-500 transition-colors leading-tight">{term.term}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-3 mb-8 flex-grow font-medium">{term.shortDefinition}</p>
                        <div className="pt-6 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between text-[10px] font-black uppercase text-slate-300">
                             <div className="flex items-center gap-1.5 focus:text-emerald-500 transition-colors"><Clock size={12} /> {Math.round((term.shortDefinition?.length || 100) / 100) + 1}m read</div>
                             <ChevronRight size={14} className="group-hover:translate-x-1 transition-all text-emerald-500" />
                        </div>
                    </Link>
                ))}
            </div>

            {filteredTerms.length === 0 && (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <Search size={40} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No keywords found</h3>
                    <p className="text-slate-500">Try a different term or clear your filters.</p>
                </div>
            )}

            {/* Pagination 1-10 Style */}
            {totalPages > 1 && (
                <div className="mt-20 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-1">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all font-black"
                        >
                            <ChevronRight size={20} className="rotate-180" />
                        </button>
                        
                        <div className="flex items-center gap-1 px-4">
                            {Array.from({ length: Math.min(10, totalPages) }, (_, i) => i + 1).map(p => (
                                <button 
                                    key={p} 
                                    onClick={() => setCurrentPage(p)} 
                                    className={`w-12 h-12 rounded-2xl text-sm font-black transition-all ${
                                        currentPage === p 
                                            ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 scale-110' 
                                            : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:border-emerald-500 hover:text-emerald-600'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all font-black"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
          </div>

          {/* Footer Discovery - Popular Tags */}
          <div className="mt-24 pt-24 border-t border-slate-100 dark:border-slate-800">
             <div className="max-w-4xl mx-auto text-center">
                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-8">Popular Keyword Topics</h4>
                <div className="bg-slate-50 dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800">
                    <TagCloud terms={terms} onSelectTag={(tag) => { setSelectedTag(tag); setSelectedCategory('all'); setCurrentPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} activeTag={selectedTag} />
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function GlossaryClient(props: GlossaryClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>}>
      <GlossaryClientInner {...props} />
    </Suspense>
  );
}
