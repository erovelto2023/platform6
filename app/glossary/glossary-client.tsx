"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, Book, Calculator, TrendingUp, Zap, ChevronRight, Clock, Heart, ThumbsUp, Bookmark
} from 'lucide-react';
import TagCloud from '../../components/glossary/TagCloud';
import TermOfTheDay from '../../components/glossary/TermOfTheDay';
import GlossaryTest from '../../components/glossary/GlossaryTest';

interface GlossaryClientProps {
  initialTerms: any[];
  categories: string[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function GlossaryClientInner({ initialTerms, categories }: GlossaryClientProps) {
  const searchParams = useSearchParams();
  // Store terms in state and shuffle only on client side
  const [terms, setTerms] = useState<any[]>([]);

  // Initialize and shuffle terms only on client
  useEffect(() => {
    // Reset to empty array if no terms
    if (!initialTerms || initialTerms.length === 0) {
      setTerms([]);
      return;
    }
    
    const shuffled = shuffleArray(initialTerms);
    setTerms(shuffled);
  }, [initialTerms]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Handle URL parameters for tag filtering
  useEffect(() => {
    if (!searchParams) return;
    
    const tagParam = searchParams.get('tag');
    const categoryParam = searchParams.get('category');
    
    if (tagParam) {
      setSelectedTag(tagParam);
      setSelectedCategory('all');
      setSelectedDifficulty('all');
      setSearchQuery('');
      setActiveLetter(null);
    }
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setSelectedTag('all');
      setSelectedDifficulty('all');
      setSearchQuery('');
      setActiveLetter(null);
    }
    
    setCurrentPage(1);
  }, [searchParams]);

  // Filter terms based on search and selected letter
  const filteredTerms = useMemo(() => {
    if (!terms.length) return [];
    return terms.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            term.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            term.shortDefinition?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLetter = activeLetter ? term.term.toUpperCase().startsWith(activeLetter) : true;
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || 
                               (term.contentLevel === selectedDifficulty) || 
                               (term.skillRequired === selectedDifficulty);
      const matchesTag = selectedTag === 'all' || 
                        term.category === selectedTag || 
                        (term.tags && term.tags.includes(selectedTag));
      
      return matchesSearch && matchesLetter && matchesCategory && matchesDifficulty && matchesTag;
    });
  }, [terms, searchQuery, activeLetter, selectedCategory, selectedDifficulty, selectedTag]);

  const toggleLetter = (letter: string) => {
    if (activeLetter === letter) {
      setActiveLetter(null);
    } else {
      setActiveLetter(letter);
      setSearchQuery(''); // Clear search when picking a letter
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setActiveLetter(null);
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedTag('all');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
  const paginatedTerms = filteredTerms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const trendingTerms = terms.length > 0 ? terms.filter(t => t.isFeatured).slice(0, 3) : [];
  if (trendingTerms.length === 0 && terms.length > 0) trendingTerms.push(...terms.slice(0, 3)); // fallback

  const dailySpark = terms.length > 0 ? terms[0] : null;

  // Show empty state when no terms exist
  if (terms.length === 0) {
    return (
      <div className="min-h-screen transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">
        <header className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Internet Marketing</span> & Online Business Terms
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
            Your definitive reference for digital marketing, affiliate marketing, and online business — simplified and searchable.
          </p>
        </header>
        
        <main className="max-w-6xl mx-auto px-6">
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl dark:bg-slate-800/50 dark:border-slate-700">
            <Book size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No glossary terms found</h3>
            <p className="text-slate-500 dark:text-slate-400">
              The glossary is currently empty. Check back later for new terms.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">
      <header className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Internet Marketing</span> & Online Business Terms
        </h1>
        <p className="text-xl mb-10 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
          Your definitive reference for digital marketing, affiliate marketing, and online business — simplified and searchable.
        </p>
        
        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={24} />
          </div>
          <input 
            type="text"
            placeholder="Search 100+ business terms... (Try 'Affiliate Marketing')"
            className="w-full py-5 pl-14 pr-6 rounded-2xl border-2 outline-none transition-all shadow-xl text-lg bg-white border-slate-100 focus:border-emerald-600 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-emerald-500"
            value={searchQuery}
            onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setActiveLetter(null);
                setCurrentPage(1);
            }}
          />
        </div>
        <div className="mt-4 flex justify-center">
          <Link
            href="/glossary/bookmarks"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <Bookmark size={16} />
            My Saved Glossary
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main Glossary Card */}
          <div className="md:col-span-2 md:row-span-2 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group bg-white border border-slate-200 shadow-sm dark:bg-slate-800/50 dark:border-slate-700">
            <div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Book size={24} />
              </div>
              <h3 className="text-3xl font-bold mb-3">Browse A-Z</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Explore terminology organized by letter for quick discovery.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-6 gap-2">
              {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map(l => (
                <button 
                  key={l} 
                  onClick={() => toggleLetter(l)}
                  className={`aspect-square flex items-center justify-center rounded-lg border transition-all font-bold text-sm
                    ${activeLetter === l 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'border-slate-200 dark:border-slate-700 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-300'
                    }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <Link href="/tools" className="md:col-span-2 rounded-3xl p-8 flex items-center gap-6 group cursor-pointer bg-white border border-slate-200 shadow-sm dark:bg-slate-800/50 dark:border-slate-700">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calculator size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Business Calculators</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">ROI, LTV, and startup costs.</p>
            </div>
            <ChevronRight className="ml-auto text-slate-300" />
          </Link>

          <div className="rounded-3xl p-6 flex flex-col gap-4 bg-white border border-slate-200 shadow-sm dark:bg-slate-800/50 dark:border-slate-700">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-sm uppercase tracking-wider">
              <TrendingUp size={16} />
              Trending Now
            </div>
            <div className="space-y-3">
              {trendingTerms.slice(0, 3).map((t, i) => (
                <Link key={i} href={`/glossary/${t.slug}`} className="block text-sm font-semibold hover:text-emerald-600 transition-colors">
                  {t.term}
                </Link>
              ))}
            </div>
          </div>

          {dailySpark && (
            <Link href={`/glossary/${dailySpark.slug}`} className="rounded-3xl p-6 bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-colors block">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest opacity-80 mb-2">
                <Zap size={14} />
                Daily Spark
              </div>
              <h4 className="text-xl font-black mb-1 truncate">{dailySpark.term}</h4>
              <p className="text-xs leading-relaxed opacity-90 line-clamp-2">{dailySpark.shortDefinition}</p>
            </Link>
          )}
        </div>

        {/* Term of the Day */}
        <div className="mt-8">
          <TermOfTheDay terms={terms} />
        </div>

        <section className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {activeLetter ? `Terms starting with "${activeLetter}"` : searchQuery ? 'Search Results' : 'Essential Terms'}
            </h2>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-sm max-sm:hidden">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Show:</span>
                  <select 
                      value={itemsPerPage} 
                      onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1 font-bold outline-none focus:border-emerald-500 cursor-pointer"
                  >
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                  </select>
               </div>
               <div className="text-sm font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full whitespace-nowrap">
                 {filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'}
               </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-2 font-bold outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => { setSelectedDifficulty(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-2 font-bold outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tag Filter</label>
                <input
                  type="text"
                  placeholder="Filter by tag..."
                  value={selectedTag === 'all' ? '' : selectedTag}
                  onChange={(e) => { setSelectedTag(e.target.value || 'all'); setCurrentPage(1); }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-2 font-bold outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            {selectedTag !== 'all' && (
              <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Currently filtering by tag: <span className="font-semibold text-emerald-600">{selectedTag}</span>
              </div>
            )}
          </div>
          
          {filteredTerms.length > 0 ? (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {paginatedTerms.map((term: any) => (
                <Link 
                  href={`/glossary/${term.slug}`} 
                  key={term.id}
                  className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl dark:bg-slate-800 dark:border-slate-700 flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md text-emerald-700 bg-emerald-50 dark:bg-emerald-900/40 dark:text-emerald-300 uppercase tracking-tighter">
                      {term.category || 'General'}
                    </span>
                    {term.lowPhysicalEffort && (
                        <Heart size={14} className="text-rose-400" />
                    )}
                  </div>
                  <h4 className="text-2xl font-black mb-2 text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{term.term}</h4>
                  <p className="text-sm line-clamp-3 text-slate-600 dark:text-slate-400 mb-4 flex-1">
                    {term.shortDefinition}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {term.timeToFirstDollar ? "Time tracked" : "Varies"}
                    </div>
                    {term.startupCost && (
                      <div className="flex items-center gap-1.5">
                          <Zap size={12} className="text-amber-400" />
                          {term.startupCost}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Prev
                    </button>
                    
                    <div className="flex items-center gap-1 max-sm:hidden">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                            if (
                                page === 1 || 
                                page === totalPages || 
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-colors ${
                                            currentPage === page 
                                            ? 'bg-emerald-600 text-white border-emerald-600' 
                                            : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            }
                            if (page === currentPage - 2 || page === currentPage + 2) {
                                return <span key={page} className="text-slate-400 px-1">...</span>;
                            }
                            return null;
                        })}
                    </div>

                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
            </>
          ) : (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl dark:bg-slate-800/50 dark:border-slate-700">
                <Book size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No terms found</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or selecting a different letter.</p>
                {(searchQuery || activeLetter || selectedCategory !== 'all' || selectedDifficulty !== 'all' || selectedTag !== 'all') && (
                    <button 
                        onClick={resetFilters}
                        className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700"
                    >
                        Clear Filters
                    </button>
                )}
            </div>
          )}
        </section>

        {/* Tag Cloud Section */}
        {terms.length > 0 && (
          <section className="mt-20">
            <TagCloud terms={terms} />
          </section>
        )}

        {/* Test Section (Development Only) */}
        {process.env.NODE_ENV === 'development' && terms.length > 0 && (
          <section className="mt-20">
            <GlossaryTest />
          </section>
        )}
      </main>
    </div>
  );
}

export default function GlossaryClient(props: GlossaryClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading glossary...</p>
        </div>
      </div>
    }>
      <GlossaryClientInner {...props} />
    </Suspense>
  );
}
