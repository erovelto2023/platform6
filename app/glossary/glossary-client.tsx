"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Book, Clock, ChevronRight, TrendingUp, Search, Zap, LayoutList, Trophy, Heart, ArrowRight, HelpCircle, Sparkles, Target, ShieldCheck, Cpu, DollarSign, Layers, RefreshCw, Video, ShoppingCart, Globe, Mic, FileText, Lightbulb, Image as ImageIcon } from 'lucide-react';
import TagCloud from '../../components/glossary/TagCloud';
import RotatingAffiliateBanner from '../../components/glossary/RotatingAffiliateBanner';
import { SiteHeader } from '@/components/shared/SiteHeader';

interface GlossaryClientProps {
  initialTerms: any[];
  categories: string[];
  products?: any[];
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

  const characters = ["0-9", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

  const legendStats = useMemo(() => {
    let images = 0, videos = 0, products = 0, websites = 0, podcasts = 0, caseStudies = 0, aiPrompts = 0, aeoFaqs = 0;
    (initialTerms || []).forEach(t => {
      if (t.imageUrl) images++;
      if (t.videoUrl) videos++;
      if ((t.amazonProducts && t.amazonProducts.length > 0) || (t.recommendedTools && t.recommendedTools.length > 0)) products++;
      if (t.websitesRanking && t.websitesRanking.length > 0) websites++;
      if (t.podcastsRanking && t.podcastsRanking.length > 0) podcasts++;
      if (t.caseStudies && t.caseStudies.length > 0) caseStudies++;
      if (t.imagePrompt || t.productPrompt || t.socialPrompt || (t.youtubeTitles && t.youtubeTitles.length > 0) || (t.pinterestIdeas && t.pinterestIdeas.length > 0) || (t.instagramIdeas && t.instagramIdeas.length > 0)) aiPrompts++;
      if ((t.faqs && t.faqs.length > 0) || (t.questionVariations && t.questionVariations.length > 0) || t.aeoSummary) aeoFaqs++;
    });
    return { images, videos, products, websites, podcasts, caseStudies, aiPrompts, aeoFaqs };
  }, [initialTerms]);

  useEffect(() => {
    if (!initialTerms || initialTerms.length === 0) return;
    setTerms(initialTerms);
    // Rotate to a different pillar term on every page load
    const randomIndex = Math.floor(Math.random() * initialTerms.length);
    setPillarTerm(initialTerms[randomIndex]);
  }, [initialTerms]);

  const rotatePillar = () => {
    if (terms && terms.length > 0) {
      const randomIndex = Math.floor(Math.random() * terms.length);
      setPillarTerm(terms[randomIndex]);
    }
  };

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

      const termFirstChar = (term.term || '').trim().toUpperCase();
      const matchesLetter = !activeLetter || 
                            (activeLetter === '0-9' ? /^[0-9]/.test(termFirstChar) : termFirstChar.startsWith(activeLetter));
      
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
    setCurrentPage(1);
  };

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

          {/* Pillar Definition Rotating Banner */}
          {pillarTerm && (
            <div className="mt-8 p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-3xl text-left relative overflow-hidden shadow-2xl group">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
                  <ShieldCheck size={16} /> Main Pillar Definition
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={rotatePillar}
                    className="flex items-center gap-1 text-[10px] font-mono font-bold bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-1 rounded-xl text-cyan-400 hover:text-cyan-300 transition-all uppercase cursor-pointer"
                    title="Rotate Featured Main Pillar Concept"
                  >
                    <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" /> Rotate Pillar Concept
                  </button>
                  <span className="text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl text-slate-400 uppercase">
                    {pillarTerm.category || 'Core Concept'}
                  </span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-100 mb-2">{pillarTerm.term}</h2>
              <p className="text-xs md:text-sm font-sans text-slate-300 mb-4 leading-relaxed" data-aeo-summary>
                {pillarTerm.aeoSummary || pillarTerm.shortDefinition || pillarTerm.definition}
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

      {/* Alphabetical Character Filter Bar (0-9, A-Z) */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
              <Book size={16} className="text-cyan-400" /> Alphabetical Index (0-9, A-Z)
            </span>
            {activeLetter && (
              <button 
                onClick={() => { setActiveLetter(null); setCurrentPage(1); }} 
                className="text-xs font-mono text-cyan-400 hover:underline"
              >
                Clear Alphabet Filter
              </button>
            )}
          </div>
          
          <div className="flex items-center flex-wrap gap-2 pt-1">
            <button
              onClick={() => { setActiveLetter(null); setCurrentPage(1); }}
              className={`px-3.5 py-2 rounded-xl font-mono font-black text-xs transition-all cursor-pointer ${
                activeLetter === null
                  ? 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-cyan-500 hover:text-cyan-400'
              }`}
            >
              ALL
            </button>

            {characters.map(char => {
              const isActive = activeLetter === char;
              return (
                <button
                  key={char}
                  onClick={() => { setActiveLetter(char); setCurrentPage(1); }}
                  className={`min-w-[38px] px-2.5 py-2 rounded-xl font-mono font-black text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-cyan-500/20 scale-105'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-cyan-500 hover:text-cyan-400'
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>
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
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 text-xs font-mono text-slate-400">
          <div>Showing <span className="text-cyan-400 font-bold">{filteredTerms.length}</span> terms in knowledge index</div>
          <div>Page <span className="text-slate-100 font-bold">{currentPage}</span> of {totalPages || 1}</div>
        </div>

        {/* Icon Legend Bar */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 shadow-xl">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            Icon Legend:
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.images} terms have an Image`}>
            <ImageIcon size={14} className="text-cyan-400" /> Image <span className="text-[10px] font-mono text-cyan-400 font-bold">({legendStats.images})</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.videos} terms have a Video`}>
            <Video size={14} className="text-rose-400" /> Video <span className="text-[10px] font-mono text-rose-400 font-bold">({legendStats.videos})</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.products} terms have Products or Tools`}>
            <ShoppingCart size={14} className="text-amber-400" /> Products <span className="text-[10px] font-mono text-amber-400 font-bold">({legendStats.products})</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.websites} terms have Authority Websites`}>
            <Globe size={14} className="text-blue-400" /> Website <span className="text-[10px] font-mono text-blue-400 font-bold">({legendStats.websites})</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.podcasts} terms have Podcasts`}>
            <Mic size={14} className="text-sky-400" /> Podcast <span className="text-[10px] font-mono text-sky-400 font-bold">({legendStats.podcasts})</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.caseStudies} terms have Case Studies`}>
            <FileText size={14} className="text-emerald-400" /> Case Study <span className="text-[10px] font-mono text-emerald-400 font-bold">({legendStats.caseStudies})</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.aiPrompts} terms have AI Prompts`}>
            <Lightbulb size={14} className="text-indigo-400" /> AI Prompts <span className="text-[10px] font-mono text-indigo-400 font-bold">({legendStats.aiPrompts})</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.aeoFaqs} terms have AEO Summaries or FAQs`}>
            <Sparkles size={14} className="text-purple-400" /> AEO / FAQs <span className="text-[10px] font-mono text-purple-400 font-bold">({legendStats.aeoFaqs})</span>
          </div>
        </div>

        {filteredTerms.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <Book size={32} className="text-slate-600 mx-auto" />
            <h3 className="text-xl font-bold text-slate-200 uppercase">No Terms Found</h3>
            <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">No glossary terms matched your current filter criteria.</p>
            <button onClick={resetFilters} className="px-4 py-2 bg-cyan-600 text-white font-mono font-bold text-xs rounded-xl hover:bg-cyan-500 transition-colors uppercase">
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map(term => (
              <Link
                key={term._id || term.id}
                href={`/glossary/${term.slug}`}
                className="group bg-slate-900 border border-slate-800 hover:border-cyan-500/80 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 text-cyan-400 px-2.5 py-1 rounded-xl">
                      {term.category || 'General'}
                    </span>
                    
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {term.imageUrl && <span title="Image Available"><ImageIcon size={13} className="text-cyan-400" /></span>}
                      {term.videoUrl && <span title="Video Available"><Video size={13} className="text-rose-400" /></span>}
                      {((term.amazonProducts && term.amazonProducts.length > 0) || (term.recommendedTools && term.recommendedTools.length > 0)) && (
                        <span title="Has Products/Tools"><ShoppingCart size={13} className="text-amber-400" /></span>
                      )}
                      {term.websitesRanking && term.websitesRanking.length > 0 && <span title="Has Authority Sites"><Globe size={13} className="text-blue-400" /></span>}
                      {term.podcastsRanking && term.podcastsRanking.length > 0 && <span title="Has Podcasts"><Mic size={13} className="text-sky-400" /></span>}
                      {term.caseStudies && term.caseStudies.length > 0 && <span title="Has Case Studies"><FileText size={13} className="text-emerald-400" /></span>}
                      {((term.youtubeTitles && term.youtubeTitles.length > 0) || (term.pinterestIdeas && term.pinterestIdeas.length > 0) || (term.instagramIdeas && term.instagramIdeas.length > 0) || term.imagePrompt || term.productPrompt || term.socialPrompt) && (
                        <span title="Has AI Prompts"><Lightbulb size={13} className="text-indigo-400" /></span>
                      )}
                      {((term.faqs && term.faqs.length > 0) || (term.questionVariations && term.questionVariations.length > 0) || term.aeoSummary) && (
                        <span title="Has AEO Summary / FAQs"><Sparkles size={13} className="text-purple-400" /></span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {term.term}
                  </h3>

                  <p className="text-xs font-sans text-slate-300 line-clamp-3 leading-relaxed">
                    {term.aeoSummary || term.shortDefinition || term.definition}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="group-hover:text-cyan-400 transition-colors font-bold uppercase text-[10px]">View Entity Guide</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform text-cyan-400" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 font-mono text-xs">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-cyan-400 font-bold">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GlossaryClient(props: GlossaryClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-mono text-xs">
        Loading Glossary Registry...
      </div>
    }>
      <GlossaryClientInner {...props} />
    </Suspense>
  );
}
