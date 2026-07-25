"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Book, Clock, ChevronRight, TrendingUp, Search, Zap, LayoutList, Trophy, Heart, ArrowRight, HelpCircle, Sparkles, Target, ShieldCheck, Cpu, DollarSign, Layers } from 'lucide-react';
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

const SEMANTIC_CLUSTERS = [
  { id: 'all', label: '🌐 All Concepts', icon: Layers, desc: 'Complete knowledge registry' },
  { id: 'business-models', label: '🚀 Core Business Models', icon: Target, desc: 'Affiliate, SaaS, E-Commerce, Monetization' },
  { id: 'traffic-conversion', label: '🎯 Traffic & Conversions', icon: TrendingUp, desc: 'SEO, CTR, CRO, Organic Systems' },
  { id: 'technical-systems', label: '💻 Technical & Systems', icon: Cpu, desc: 'API, Webhooks, HTML, Analytics' },
  { id: 'monetization', label: '💰 Monetization & Payouts', icon: DollarSign, desc: 'CPA, Revenue Share, Commissions' },
  { id: 'ai-automation', label: '🤖 AI & AEO Systems', icon: Sparkles, desc: 'AEO, Prompts, AI Workflows' },
];

function GlossaryClientInner({ initialTerms, categories, products = [] }: GlossaryClientProps) {
  const searchParams = useSearchParams();
  const [terms, setTerms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [pillarTerm, setPillarTerm] = useState<any>(null);
  const [showLetters, setShowLetters] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [categoryActiveLetter, setCategoryActiveLetter] = useState<string | null>(null);

  useEffect(() => {
    if (!initialTerms || initialTerms.length === 0) return;
    setTerms(initialTerms);
    const featured = initialTerms.find((t: any) => t.isFeatured) || initialTerms[0];
    setPillarTerm(featured);
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
                            term.shortDefinition?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            term.aeoSummary?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLetter = !activeLetter || 
                            (activeLetter === '0-9' ? /^[0-9]/.test(term.term) : term.term.toUpperCase().startsWith(activeLetter));
      
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;

      let matchesCluster = true;
      if (selectedCluster === 'business-models') {
        matchesCluster = ['Affiliate Marketing', 'Business Models', 'Monetization', 'E-Commerce', 'SaaS'].includes(term.category);
      } else if (selectedCluster === 'traffic-conversion') {
        matchesCluster = ['SEO', 'Traffic', 'Conversions', 'Marketing', 'Analytics'].includes(term.category);
      } else if (selectedCluster === 'technical-systems') {
        matchesCluster = ['Technical', 'Web', 'API', 'Systems'].includes(term.category);
      } else if (selectedCluster === 'monetization') {
        matchesCluster = ['Monetization', 'Finance', 'Affiliate', 'Revenue'].includes(term.category);
      } else if (selectedCluster === 'ai-automation') {
        matchesCluster = ['AI', 'Automation', 'AEO', 'Prompts'].includes(term.category);
      }

      const matchesTag = selectedTag === 'all' || (term.tags && term.tags.includes(selectedTag));
      return matchesSearch && matchesLetter && matchesCategory && matchesCluster && matchesTag;
    });
  }, [terms, searchQuery, activeLetter, selectedCategory, selectedCluster, selectedTag]);

  const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
  const currentItems = filteredTerms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setSearchQuery('');
    setActiveLetter(null);
    setSelectedCategory('all');
    setSelectedCluster('all');
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
    <div className="bg-slate-950 min-h-screen pb-20 font-sans text-slate-100">
      <SiteHeader />

      {/* Hero & Main Topic Pillar Hub Section */}
      <div className="pt-28 pb-16 px-6 text-center border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider">
            <Sparkles size={14} className="text-cyan-400" />
            SEO & AI-Search (AEO) Knowledge Ecosystem
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-100 tracking-tight leading-[1.15] uppercase">
            The Digital <span className="text-cyan-400">Monetization</span> Glossary
          </h1>

          <p className="text-lg md:text-xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
            The authoritative semantic index of digital marketing, online business models, and AI performance metrics. Optimized for direct answer extraction (AEO).
          </p>

          {/* Search Engine Input */}
          <div className="relative max-w-2xl mx-auto pt-4">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Query any term, entity, or monetization strategy..."
              className="w-full h-16 pl-14 pr-6 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-2xl outline-none text-sm font-mono transition-all text-slate-100 placeholder:text-slate-500 shadow-2xl"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>

          {/* Pillar Definition of the Day Banner */}
          {pillarTerm && (
            <div className="mt-8 p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-3xl text-left relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
                  <ShieldCheck size={16} /> Main Pillar Definition
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl text-slate-400 uppercase">
                  {pillarTerm.category || 'Core Concept'}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-100 mb-2">{pillarTerm.term}</h2>
              <p className="text-xs md:text-sm font-mono text-slate-300 mb-4 leading-relaxed" data-aeo-summary>
                {pillarTerm.aeoSummary || pillarTerm.shortDefinition}
              </p>
              <div className="flex items-center justify-between pt-2">
                <div className="text-[10px] font-mono text-slate-500 uppercase">
                  Node Code: <span className="text-slate-300">/glossary/{pillarTerm.slug}</span>
                </div>
                <Link href={`/glossary/${pillarTerm.slug}`} className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase">
                  Explore Full Pillar Entity <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Semantic Category Clusters Navigation Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
                <Layers className="text-cyan-400" size={20} /> Semantic Category Clusters
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-0.5">Explore terms organized by operational intent and business architecture.</p>
            </div>
            <button onClick={resetFilters} className="text-xs font-mono text-cyan-400 hover:underline">
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {SEMANTIC_CLUSTERS.map(cluster => {
              const IconComp = cluster.icon;
              const isActive = selectedCluster === cluster.id;
              return (
                <button
                  key={cluster.id}
                  onClick={() => { setSelectedCluster(cluster.id); setCurrentPage(1); }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isActive 
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-xl' 
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <IconComp className="w-5 h-5 mb-2 text-cyan-400" />
                  <div className="font-extrabold text-xs leading-tight">{cluster.label}</div>
                  <div className="text-[9px] font-mono text-slate-400 mt-1 line-clamp-1">{cluster.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Term Cards Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6 text-xs font-mono text-slate-400">
          <div>Showing <span className="text-cyan-400 font-bold">{filteredTerms.length}</span> terms in knowledge index</div>
          <div>Page <span className="text-slate-100 font-bold">{currentPage}</span> of {totalPages || 1}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map(term => (
            <Link
              key={term._id || term.id}
              href={`/glossary/${term.slug}`}
              className="group bg-slate-900 border border-slate-800 hover:border-cyan-500/80 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 text-cyan-400 px-2.5 py-1 rounded-xl">
                    {term.category || 'General'}
                  </span>
                  {term.entityType && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {term.entityType}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {term.term}
                </h3>

                <p className="text-xs font-mono text-slate-400 line-clamp-3 leading-relaxed">
                  {term.aeoSummary || term.shortDefinition || term.definition}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between mt-4">
                <span className="text-[10px] font-mono text-slate-500">/glossary/{term.slug}</span>
                <span className="text-xs font-mono font-bold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 border-dashed rounded-3xl p-8">
            <Book className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-100 mb-1">No terms found</h3>
            <p className="text-xs font-mono text-slate-400 mb-6">Try searching for a different keyword or resetting your category filter.</p>
            <button onClick={resetFilters} className="bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs uppercase px-6 py-3 rounded-2xl">
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-800 font-mono text-xs">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl disabled:opacity-30"
            >
              Previous Page
            </button>
            <span className="text-slate-400">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl disabled:opacity-30"
            >
              Next Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GlossaryClient(props: GlossaryClientProps) {
  return (
    <Suspense fallback={<div className="bg-slate-950 min-h-screen p-12 text-center text-cyan-400 font-mono text-xs">Loading Knowledge Base...</div>}>
      <GlossaryClientInner {...props} />
    </Suspense>
  );
}
