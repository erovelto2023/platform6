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
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    if (!initialTerms) return;
    setTerms(shuffleArray(initialTerms));
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
    <div className="bg-slate-50 dark:bg-slate-900/50 min-h-screen pb-20">
      {/* Hero / Search Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-20 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 blur-[120px] rounded-full -mr-20 -mt-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-4">
                <Book className="w-3 h-3" /> Digital Marketing Dictionary
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-none">
                The KB <span className="text-emerald-500">Glossary.</span>
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
                Master the language of online business with our curated library of terms and strategies.
              </p>
            </div>
            
            <Link 
                href="/glossary/study"
                className="group relative px-8 py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20 shrink-0"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="relative flex items-center gap-3">
                    <Zap size={20} className="text-emerald-400 dark:text-emerald-200 fill-current" />
                    Enter Study Mode
                </div>
            </Link>
          </div>

          <div className="relative max-w-3xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input
              type="text"
              placeholder="Search terms, niches, or strategies..."
              className="w-full pl-16 pr-6 py-6 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-700 rounded-3xl outline-none text-xl font-bold transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-10">
          
          {/* Top Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Browse A-Z Card */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Book size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Browse A-Z</h3>
                  <p className="text-xs text-slate-400 font-bold">Select a letter to find terms</p>
                </div>
              </div>
              <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
                {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map(l => (
                  <button 
                    key={l}
                    onClick={() => { setActiveLetter(activeLetter === l ? null : l); setCurrentPage(1); }}
                    className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all border ${
                      activeLetter === l 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' 
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-emerald-500 hover:text-emerald-600 shadow-sm'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Categories Card */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden flex flex-col justify-center">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <LayoutList size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Search Categories</h3>
                    <p className="text-sm text-slate-400 font-medium">Filter by core busines areas</p>
                  </div>
               </div>
               <div className="flex flex-wrap gap-2 mt-2">
                  {categories.slice(0, 4).map(cat => (
                    <span key={cat} className="px-3 py-1 bg-slate-100 dark:bg-slate-900 text-slate-500 text-[10px] font-black uppercase rounded-lg">#{cat}</span>
                  ))}
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg">Browse All</span>
               </div>
            </div>
          </div>

          {/* Action Driven Marketing CTA (Large Green Card) */}
          <div className="bg-emerald-600 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-emerald-500/20">
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><Zap size={140} className="text-white fill-current" /></div>
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-4">
                <Trophy className="w-3 h-3" /> Mastery System v2.0
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">Action Driven Marketing</h2>
              <p className="text-emerald-50/80 text-lg font-medium mb-8">Master your market knowledge. Turn terms into tactics with our personalized study engine.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/glossary/study" className="px-10 py-4 bg-white text-emerald-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl">
                  Start Learning
                </Link>
                <Link href="/glossary-bookmarks" className="px-10 py-4 bg-emerald-700 text-white rounded-2xl font-black text-sm hover:bg-emerald-800 transition-all border border-emerald-500/30">
                  Open Library
                </Link>
              </div>
            </div>
          </div>

          {/* Filter Bar Row */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-6 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-xl font-black text-slate-900 dark:text-white shrink-0">Essential Terms</h4>
            
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Dropdown Filters */}
              <div className="flex-1 lg:flex-none">
                  <select 
                      value={selectedCategory}
                      onChange={(e) => { setSelectedCategory(e.target.value); setSelectedTag('all'); setCurrentPage(1); }}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 transition-all cursor-pointer"
                  >
                      <option value="all">Category: All</option>
                      {categories.map(cat => (
                          <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                      ))}
                  </select>
              </div>
              <div className="flex-1 lg:flex-none">
                  <select 
                      value={activeLetter || 'all'}
                      onChange={(e) => { setActiveLetter(e.target.value === 'all' ? null : e.target.value); setCurrentPage(1); }}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 transition-all cursor-pointer"
                  >
                      <option value="all">Letter: All</option>
                      {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map(l => (
                          <option key={l} value={l}>{l}</option>
                      ))}
                  </select>
              </div>
              <div className="flex-1 lg:flex-none">
                  <select 
                      value={selectedTag}
                      onChange={(e) => { setSelectedTag(e.target.value); setSelectedCategory('all'); setCurrentPage(1); }}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 transition-all cursor-pointer"
                  >
                      <option value="all">Tag: All</option>
                      {Array.from(new Set(terms.flatMap(t => t.tags || []))).sort().map(tag => (
                          <option key={tag} value={tag}>{tag.toUpperCase()}</option>
                      ))}
                  </select>
              </div>
              <button 
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-300 transition-all"
              >
                  Clear Filters
              </button>
            </div>
          </div>

          {/* 4-Column Term Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentItems.map((term: any) => (
              <Link 
                key={term.slug}
                href={`/glossary/${term.slug}`}
                className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:shadow-2xl transition-all group animate-in fade-in slide-in-from-bottom-4 flex flex-col h-full overflow-hidden relative"
              >
                <div className="text-[9px] font-black uppercase tracking-tighter text-emerald-600 mb-3">{term.category}</div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3 group-hover:text-emerald-500 transition-colors leading-tight">{term.term}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-3 mb-6 flex-grow font-medium">{term.shortDefinition}</p>
                <div className="pt-4 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300"><Clock size={10} /> {Math.round((term.shortDefinition?.length || 100) / 100) + 1}m</div>
                  {term.views > 0 && <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><TrendingUp size={10} /> {term.views}</div>}
                </div>
              </Link>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700">
              <Search size={40} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-xl font-bold mb-2">No terms found</h3>
              <p className="text-slate-500">Try a different search or clear your filters.</p>
              <button onClick={resetFilters} className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold">Clear All Filters</button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button 
                  key={p} 
                  onClick={() => setCurrentPage(p)} 
                  className={`w-10 h-10 rounded-xl font-bold transition-all ${
                    currentPage === p 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Footer Discovery / Random Tools Section */}
          <div className="mt-20 pt-20 border-t border-slate-200 dark:border-slate-800">
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-12">
                   <div className="lg:w-2/3">
                      <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-4">Inside The Library</h4>
                      <TagCloud terms={terms} onSelectTag={(tag) => { setSelectedTag(tag); setSelectedCategory('all'); setCurrentPage(1); }} activeTag={selectedTag} />
                   </div>
                   <div className="lg:w-1/3 flex flex-col justify-center">
                      <RotatingAffiliateBanner products={products} />
                   </div>
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
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>}>
      <GlossaryClientInner {...props} />
    </Suspense>
  );
}
