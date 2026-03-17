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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-10">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                <LayoutList size={14} /> Categories
              </h3>
              <div className="flex flex-col gap-1">
                {['all', ...categories].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setSelectedTag('all'); setCurrentPage(1); }}
                    className={`px-4 py-3 rounded-xl text-left font-bold transition-all flex items-center justify-between group ${
                      selectedCategory === cat ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-600'
                    }`}
                  >
                    <span className="capitalize">{cat === 'all' ? 'All Areas' : cat}</span>
                    <ChevronRight className={`transition-opacity ${selectedCategory === cat ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} size={16} />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Trophy size={60} className="text-white" /></div>
              <h4 className="text-white font-black text-xl mb-2 relative z-10">My Saved Terms</h4>
              <p className="text-slate-400 text-xs mb-6 relative z-10 leading-relaxed">Continue where you left off in our interactive study engine.</p>
              <Link href="/glossary-bookmarks" className="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-900 rounded-xl font-black text-sm hover:bg-emerald-400 transition-colors relative z-10">
                <Bookmark size={16} className="fill-current" /> Open Library
              </Link>
            </div>

            <TagCloud terms={terms} onSelectTag={(tag) => { setSelectedTag(tag); setSelectedCategory('all'); setCurrentPage(1); }} activeTag={selectedTag} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* A-Z Bar */}
            <div className="flex flex-wrap gap-1 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
              {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map(l => (
                <button 
                  key={l}
                  onClick={() => { setActiveLetter(activeLetter === l ? null : l); setCurrentPage(1); }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black transition-all ${
                    activeLetter === l ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
              {activeLetter && <button onClick={() => setActiveLetter(null)} className="px-3 h-9 rounded-lg bg-red-50 text-red-600 text-[10px] font-black uppercase hover:bg-red-100">Clear</button>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentItems.map((term: any, idx: number) => (
                <Link 
                  key={term.slug}
                  href={`/glossary/${term.slug}`}
                  className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:shadow-2xl transition-all group animate-in fade-in slide-in-from-bottom-4 flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:text-emerald-500 transition-colors">{term.category || 'General'}</div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300"><Clock size={12} /> {Math.round((term.shortDefinition?.length || 100) / 100) + 1}m</div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-emerald-500 transition-colors">{term.term}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-8 flex-grow font-medium">{term.shortDefinition}</p>
                  <div className="pt-6 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-emerald-500 font-black text-xs uppercase tracking-wider">Learn More <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></div>
                    {term.views > 0 && <div className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-lg"><TrendingUp size={12} /> {term.views}</div>}
                  </div>
                </Link>
              ))}
            </div>

            {filteredTerms.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700">
                <Search size={40} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-xl font-bold mb-2">No terms found</h3>
                <p className="text-slate-500">Try a different search or clear your filters.</p>
                <button onClick={resetFilters} className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">Clear All Filters</button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === p ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-600'}`}>{p}</button>
                ))}
              </div>
            )}
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
