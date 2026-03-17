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

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-8">
          
          {/* Filtering Controls */}
          <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex-1 w-full">
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block px-1">Category</label>
                <select 
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setSelectedTag('all'); setCurrentPage(1); }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat} className="capitalize">{cat}</option>
                    ))}
                </select>
            </div>
            <div className="flex-1 w-full">
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block px-1">Topic Tag</label>
                <select 
                    value={selectedTag}
                    onChange={(e) => { setSelectedTag(e.target.value); setSelectedCategory('all'); setCurrentPage(1); }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                >
                    <option value="all">All Tags</option>
                    {Array.from(new Set(terms.flatMap(t => t.tags || []))).sort().map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
            </div>
            <div className="pt-5 flex gap-2">
                <button 
                    onClick={resetFilters}
                    className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Clear All Filters"
                >
                    <Clock size={20} className="rotate-180" />
                </button>
            </div>
          </div>

          {/* A-Z Bar - Compact */}
          <div className="flex flex-wrap justify-center gap-1 py-4 border-y border-slate-100 dark:border-slate-800">
            {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map(l => (
              <button 
                key={l}
                onClick={() => { setActiveLetter(activeLetter === l ? null : l); setCurrentPage(1); }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                  activeLetter === l ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-2 mt-4">
            <p>Showing <span className="text-slate-900 dark:text-white">{filteredTerms.length}</span> terms</p>
            {activeLetter || selectedCategory !== 'all' || selectedTag !== 'all' ? (
                <span className="text-emerald-500">Filtered view active</span>
            ) : (
                <span>All terms</span>
            )}
          </div>

          {/* Terms Grid - Centered & Premium */}
          <div className="grid grid-cols-1 gap-4">
            {currentItems.map((term: any) => (
              <Link 
                key={term.slug}
                href={`/glossary/${term.slug}`}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:shadow-xl transition-all group animate-in fade-in slide-in-from-bottom-2 flex items-center gap-6"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-emerald-500 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <Book size={20} />
                </div>
                <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">{term.term}</h3>
                        <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded">{term.category}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate font-medium">{term.shortDefinition}</p>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
              <Search size={40} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">No terms found</h3>
              <p className="text-slate-500">Try adjusting your filters or search query.</p>
              <button onClick={resetFilters} className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold">Show All Terms</button>
            </div>
          )}

          {/* Pagination - Clean & Centered */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
                <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-50"
                >
                    <ChevronRight size={16} className="rotate-180" />
                </button>
                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button 
                            key={p} 
                            onClick={() => setCurrentPage(p)} 
                            className={`w-9 h-9 rounded-lg text-xs font-black transition-all ${
                                currentPage === p 
                                    ? 'bg-emerald-600 text-white shadow-md' 
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-600'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
                <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-50"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
          )}
          
          {/* Study Mode Call to Action - Integrated Footer */}
          <div className="mt-20 p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><Zap size={120} className="text-emerald-500" /></div>
            <h4 className="text-2xl font-black text-white mb-4 relative z-10">Master the Library</h4>
            <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto relative z-10">Done reading? Turn these terms into permanent knowledge with our interactive study engine.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <Link href="/glossary/study" className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
                    Enter Study Mode
                </Link>
                <Link href="/glossary-bookmarks" className="px-8 py-3 bg-white/10 text-white hover:bg-white/20 rounded-xl font-black text-sm transition-all border border-white/10">
                    View My Saved Terms
                </Link>
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
