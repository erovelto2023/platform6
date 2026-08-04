'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Download, Star, Grid, List, Sparkles, TrendingUp, Users, Layers, ArrowRight, ShieldAlert, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NicheBox {
  _id: string;
  nicheName: string;
  nicheSlug: string;
  category: string;
  competition: string;
  marketSize: string;
  growthRate: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  research?: {
    marketOverview: string;
  };
  keywords?: Array<{
    keyword: string;
    searchVolume: string;
  }>;
  phases?: Array<{
    name: string;
    duration: string;
    budget: string;
  }>;
}

const DEMO_NICHES: NicheBox[] = [
  {
    _id: "demo-1",
    nicheName: "AI Prompt Engineering Studio",
    nicheSlug: "ai-prompt-engineering-studio",
    category: "Artificial Intelligence",
    competition: "Low",
    marketSize: "$1.4B / yr",
    growthRate: "+340% YoY",
    status: "published",
    featured: true,
    downloadCount: 428,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    research: {
      marketOverview: "Complete blueprint for building and monetizing premium prompt libraries, custom GPT workflows, and B2B prompt consulting bundles."
    },
    keywords: [{ keyword: "prompt engineering", searchVolume: "110K" }, { keyword: "gpt prompts pack", searchVolume: "45K" }],
    phases: [{ name: "Market Prep", duration: "1 Week", budget: "$100" }]
  },
  {
    _id: "demo-2",
    nicheName: "Faceless YouTube Automation",
    nicheSlug: "faceless-youtube-automation",
    category: "Digital Marketing",
    competition: "Medium",
    marketSize: "$850M / yr",
    growthRate: "+180% YoY",
    status: "published",
    featured: true,
    downloadCount: 890,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    research: {
      marketOverview: "Step-by-step workflow for creating high-retention faceless documentary, finance, and tech channels using ElevenLabs and Midjourney."
    },
    keywords: [{ keyword: "faceless youtube channel", searchVolume: "90K" }],
    phases: [{ name: "Scripting & Voice", duration: "3 Days", budget: "$50" }]
  },
  {
    _id: "demo-3",
    nicheName: "Local SEO Automation for Trades",
    nicheSlug: "local-seo-automation-trades",
    category: "Agency & Services",
    competition: "Low",
    marketSize: "$3.2B / yr",
    growthRate: "+95% YoY",
    status: "published",
    featured: true,
    downloadCount: 650,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    research: {
      marketOverview: "High-ticket monthly recurring agency model offering automated Google Business Profile optimization and review generation for plumbers and HVAC contractors."
    },
    keywords: [{ keyword: "hvac local seo", searchVolume: "35K" }],
    phases: [{ name: "Outreach & Pitching", duration: "1 Week", budget: "$0" }]
  },
  {
    _id: "demo-4",
    nicheName: "Notion Systems & Template Empire",
    nicheSlug: "notion-systems-template-empire",
    category: "Productivity",
    competition: "Medium",
    marketSize: "$420M / yr",
    growthRate: "+210% YoY",
    status: "published",
    featured: false,
    downloadCount: 512,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    research: {
      marketOverview: "Turnkey kit for designing, launching, and scaling high-converting Notion OS planners for entrepreneurs, students, and project managers."
    },
    keywords: [{ keyword: "notion template business", searchVolume: "65K" }]
  },
  {
    _id: "demo-5",
    nicheName: "PLR Digital Product Dissector Vault",
    nicheSlug: "plr-digital-product-dissector-vault",
    category: "E-Commerce & Digital",
    competition: "Low",
    marketSize: "$980M / yr",
    growthRate: "+150% YoY",
    status: "published",
    featured: false,
    downloadCount: 780,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    research: {
      marketOverview: "Repackaging private label rights content into premium e-books, video masterclasses, and mini-courses with custom branding."
    },
    keywords: [{ keyword: "rebrand plr products", searchVolume: "48K" }]
  },
  {
    _id: "demo-6",
    nicheName: "Micro-SaaS Paid Community Blueprint",
    nicheSlug: "micro-saas-paid-community-blueprint",
    category: "Software & SaaS",
    competition: "Hard",
    marketSize: "$2.1B / yr",
    growthRate: "+280% YoY",
    status: "published",
    featured: false,
    downloadCount: 935,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    research: {
      marketOverview: "Hybrid recurring revenue model combining no-code micro apps with a paid Skool/Discord VIP mastermind community."
    },
    keywords: [{ keyword: "micro saas community", searchVolume: "52K" }]
  }
];

export default function NicheBoxesCatalog() {
  const [niches, setNiches] = useState<NicheBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [competitionFilter, setCompetitionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchNiches();
  }, []);

  const fetchNiches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/niche-boxes/public');
      if (response.ok) {
        const data = await response.json();
        const published = data.filter((n: NicheBox) => n.status === 'published');
        setNiches(published.length > 0 ? published : DEMO_NICHES);
      } else {
        setNiches(DEMO_NICHES);
      }
    } catch {
      setNiches(DEMO_NICHES);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedNiches = niches
    .filter(niche => 
      niche.nicheName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      niche.nicheSlug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      niche.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(niche => categoryFilter === 'all' || niche.category === categoryFilter)
    .filter(niche => competitionFilter === 'all' || niche.competition === competitionFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return b.downloadCount - a.downloadCount;
        case 'name':
          return a.nicheName.localeCompare(b.nicheName);
        default:
          return 0;
      }
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, competitionFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedNiches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNiches = filteredAndSortedNiches.slice(startIndex, endIndex);

  const categories = Array.from(new Set(niches.map(n => n.category)));
  const featuredNiches = niches.filter(n => n.featured);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Hero Banner */}
      <div className="relative border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 md:py-24 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10 font-mono">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="h-4 w-4" /> Proven Business Blueprints & Asset Packs
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase italic">
            Niche Business <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400">In A Box</span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed font-sans">
            Done-for-you market research, keyword maps, target demographics, monetization models, and implementation action plans. Skip the months of research and launch immediately.
          </p>

          {/* Quick Metrics Header Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 text-left">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Available Blueprints</div>
              <div className="text-2xl font-black text-amber-400 mt-1">{niches.length}</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Avg. Market Size</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">$1.2B+</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Avg. Growth Rate</div>
              <div className="text-2xl font-black text-cyan-400 mt-1">+185%</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Implementation Time</div>
              <div className="text-2xl font-black text-violet-400 mt-1">&lt; 7 Days</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-12">
        {/* Featured Blueprints Slider / Row */}
        {featuredNiches.length > 0 && (
          <section className="space-y-4 font-mono">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                Featured Premier Blueprints
              </h2>
              <span className="text-xs text-slate-500 font-bold uppercase">{featuredNiches.length} Featured</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredNiches.slice(0, 3).map((niche) => (
                <NicheBoxCard key={niche._id} niche={niche} featured={true} />
              ))}
            </div>
          </section>
        )}

        {/* Filter & Search Bar */}
        <section className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4 font-mono">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <Input
                placeholder="Search blueprints by name, category, keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 h-11 rounded-2xl text-xs focus:border-indigo-500"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-44 bg-slate-950 border-slate-800 text-slate-200 text-xs rounded-xl h-11">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
                <SelectTrigger className="w-36 bg-slate-950 border-slate-800 text-slate-200 text-xs rounded-xl h-11">
                  <SelectValue placeholder="Competition" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                  <SelectItem value="all">All Difficulty</SelectItem>
                  <SelectItem value="Low">Low Difficulty</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 bg-slate-950 border-slate-800 text-slate-200 text-xs rounded-xl h-11">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 h-11 items-center">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Results Grid/List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between font-mono">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Found <span className="text-white font-black">{filteredAndSortedNiches.length}</span> Niche Blueprint{filteredAndSortedNiches.length !== 1 ? 's' : ''}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-20 font-mono text-slate-500">
              Loading niche boxes...
            </div>
          ) : filteredAndSortedNiches.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4 font-mono">
              <div className="text-slate-400 text-sm">No niche boxes match your selected filters.</div>
              <Button 
                onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setCompetitionFilter('all'); }}
                variant="outline"
                className="bg-slate-950 border-slate-800 text-amber-400 font-bold uppercase text-xs"
              >
                Clear Filters
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentNiches.map((niche) => (
                <NicheBoxCard key={niche._id} niche={niche} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {currentNiches.map((niche) => (
                <NicheBoxListItem key={niche._id} niche={niche} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8 font-mono">
              <Button
                variant="outline"
                className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === i + 1 
                        ? "bg-indigo-600 text-white" 
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function NicheBoxCard({ niche, featured = false }: { niche: NicheBox; featured?: boolean }) {
  return (
    <Card className={`bg-slate-900/90 border-slate-800 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between group ${
      featured ? 'ring-1 ring-amber-500/40' : ''
    }`}>
      <div>
        {featured && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] px-3 py-1 text-center uppercase tracking-widest font-mono">
            ⭐ PREMIER BLUEPRINT
          </div>
        )}
        <CardHeader className="pb-3 pt-5 px-6">
          <div className="flex justify-between items-start gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-indigo-400 block mb-1">
                {niche.category}
              </span>
              <CardTitle className="text-white text-lg font-black tracking-tight leading-snug group-hover:text-amber-400 transition-colors">
                {niche.nicheName}
              </CardTitle>
            </div>
            <Badge className={`rounded-md py-0.5 px-2 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 border
              ${niche.competition === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
              ${niche.competition === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
              ${niche.competition === 'Hard' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
              ${niche.competition === 'Master' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}
            `}>
              {niche.competition}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-850">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Market Size</span>
              <span className="font-bold text-slate-200">{niche.marketSize || "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Growth</span>
              <span className="font-bold text-emerald-400">{niche.growthRate || "N/A"}</span>
            </div>
          </div>
          
          {niche.research?.marketOverview && (
            <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
              {niche.research.marketOverview}
            </p>
          )}
        </CardContent>
      </div>

      <div className="p-6 pt-0">
        <Link href={`/niche-boxes/${niche.nicheSlug}`} className="block">
          <Button className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-mono font-bold uppercase tracking-wider text-xs py-5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-1.5 group-hover:scale-[1.02]">
            View Blueprint <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function NicheBoxListItem({ niche }: { niche: NicheBox }) {
  return (
    <Card className="bg-slate-900/90 border-slate-800 hover:border-indigo-500/50 transition-all duration-300 rounded-2xl font-mono">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px]">
                {niche.category}
              </Badge>
              <Badge className={`text-[10px] border
                ${niche.competition === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                ${niche.competition === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                ${niche.competition === 'Hard' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
                ${niche.competition === 'Master' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}
              `}>
                {niche.competition} Difficulty
              </Badge>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">{niche.nicheName}</h3>
            
            {niche.research?.marketOverview && (
              <p className="text-slate-400 text-xs line-clamp-2 font-sans">
                {niche.research.marketOverview}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-1">
              <span>Market: <strong className="text-slate-200">{niche.marketSize}</strong></span>
              <span>Growth: <strong className="text-emerald-400">{niche.growthRate}</strong></span>
              <span>Downloads: <strong className="text-amber-400">{niche.downloadCount}</strong></span>
            </div>
          </div>

          <Link href={`/niche-boxes/${niche.nicheSlug}`} className="shrink-0">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-xs px-6 py-5 rounded-xl flex items-center gap-1.5">
              View Blueprint <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
