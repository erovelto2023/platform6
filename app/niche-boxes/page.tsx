'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Download, Star, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

export default function NicheBoxesCatalog() {
  const [niches, setNiches] = useState<NicheBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [competitionFilter, setCompetitionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNiches();
  }, []);

  const fetchNiches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/niche-boxes/public');
      if (response.ok) {
        const data = await response.json();
        setNiches(data.filter((n: NicheBox) => n.status === 'published'));
      } else {
        // Fallback to mock data if API doesn't exist yet
        setNiches([]);
      }
    } catch (error) {
      console.error('Error fetching niche boxes:', error);
      setNiches([]);
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

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, competitionFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedNiches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNiches = filteredAndSortedNiches.slice(startIndex, endIndex);

  const categories = Array.from(new Set(niches.map(n => n.category)));
  const featuredNiches = niches.filter(n => n.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-400">Loading niche boxes...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-5xl font-black mb-4 tracking-tighter text-slate-900 italic">NICHE BUSINESS <span className="text-indigo-600">IN A BOX</span></h1>
            <p className="text-xl text-slate-500 mb-8 max-w-3xl mx-auto font-medium">
              Complete business blueprints with research, keywords, content assets, and implementation roadmaps. 
              Skip the research phase and jump straight into execution.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" variant="outline" className="border-slate-200 text-slate-900 hover:bg-slate-50 rounded-2xl px-8 py-6 text-lg font-black uppercase tracking-widest transition-all">
                  Browse All Niches
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Featured Niches */}
        {featuredNiches.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Featured Niche Boxes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredNiches.slice(0, 3).map((niche) => (
                <NicheBoxCard 
                  key={niche._id} 
                  niche={niche} 
                  featured={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Filters and Search */}
        <section className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search niche boxes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-white border-slate-200 text-slate-900 placeholder-slate-400 h-12 rounded-2xl focus:ring-indigo-500/20"
                />
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 bg-white border-slate-200 text-slate-900 rounded-xl">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="all" className="text-slate-900">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="text-slate-900">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
                <SelectTrigger className="w-40 bg-white border-slate-200 text-slate-900 rounded-xl">
                  <SelectValue placeholder="Competition" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="all" className="text-slate-900">All Levels</SelectItem>
                  <SelectItem value="Low" className="text-slate-900">Low</SelectItem>
                  <SelectItem value="Medium" className="text-slate-900">Medium</SelectItem>
                  <SelectItem value="Hard" className="text-slate-900">Hard</SelectItem>
                  <SelectItem value="Master" className="text-slate-900">Master</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-white border-slate-200 text-slate-900 rounded-xl">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="newest" className="text-slate-900">Newest</SelectItem>
                  <SelectItem value="oldest" className="text-slate-900">Oldest</SelectItem>
                  <SelectItem value="popular" className="text-slate-900">Most Popular</SelectItem>
                  <SelectItem value="name" className="text-slate-900">Name</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-black text-white rounded-lg' : 'text-slate-400 hover:text-black'}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-black text-white rounded-lg' : 'text-slate-400 hover:text-black'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {filteredAndSortedNiches.length} Niche Box{filteredAndSortedNiches.length !== 1 ? 'es' : ''} Found
            </h2>
          </div>

          {filteredAndSortedNiches.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-slate-500 text-lg mb-4">
                No niche boxes found matching your criteria.
              </div>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setCompetitionFilter('all');
                }}
                variant="outline"
                className="border-slate-700 text-white"
              >
                Clear Filters
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentNiches.map((niche) => (
                <NicheBoxCard 
                  key={niche._id} 
                  niche={niche} 
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {currentNiches.map((niche) => (
                <NicheBoxListItem 
                  key={niche._id} 
                  niche={niche} 
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 text-slate-600"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1 mx-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "ghost"}
                    className={`w-10 h-10 rounded-xl ${
                      currentPage === i + 1 
                        ? "bg-indigo-600 text-white hover:bg-indigo-500" 
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                className="rounded-xl border-slate-200 text-slate-600"
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

function NicheBoxCard({ niche, featured = false }: { 
  niche: NicheBox; 
  featured?: boolean;
}) {
  return (
    <Card className={`bg-white border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group ${
      featured ? 'ring-2 ring-amber-500/50' : ''
    }`}>
      {featured && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-3 py-1.5 text-center uppercase tracking-widest italic">
          ⭐ PREMIER BLUEPRINT
        </div>
      )}
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-slate-900 text-xl mb-2 font-black italic tracking-tight uppercase">{niche.nicheName}</CardTitle>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{niche.category}</p>
          </div>
          <Badge className={`rounded-lg py-1 px-3 text-[10px] font-black uppercase tracking-widest
            ${niche.competition === 'Low' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : ''}
            ${niche.competition === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : ''}
            ${niche.competition === 'Hard' ? 'bg-orange-50 text-orange-600 border-orange-100' : ''}
            ${niche.competition === 'Master' ? 'bg-rose-50 text-rose-600 border-rose-100' : ''}
          `}>
            {niche.competition}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-xs text-slate-500 space-y-2 font-bold uppercase tracking-wide">
          {niche.marketSize && (
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-400">Audience:</span>
              <span className="text-slate-900">{niche.marketSize}</span>
            </div>
          )}
          {niche.growthRate && (
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-400">Growth:</span>
              <span className="text-indigo-600">{niche.growthRate}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-400">Resources:</span>
            <span className="text-slate-900">{(niche.keywords?.length || 0) + (niche.phases?.length || 0)} Assets</span>
          </div>
        </div>
        
        {niche.research?.marketOverview && (
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 italic">
            {niche.research.marketOverview}
          </p>
        )}
        
        <div className="flex gap-2 pt-2">
          <Link href={`/niche-boxes/${niche.nicheSlug}`} className="w-full">
            <Button className="w-full bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] py-6 rounded-2xl transition-all shadow-lg group-hover:-translate-y-1">
              View Blueprint Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function NicheBoxListItem({ niche }: { niche: NicheBox }) {
  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-indigo-500/50 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-white">{niche.nicheName}</h3>
              <Badge className={`
                ${niche.competition === 'Low' ? 'bg-green-500/20 text-green-500 border-green-500/30' : ''}
                ${niche.competition === 'Medium' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : ''}
                ${niche.competition === 'Hard' ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' : ''}
                ${niche.competition === 'Master' ? 'bg-red-500/20 text-red-500 border-red-500/30' : ''}
              `}>
                {niche.competition}
              </Badge>
              <span className="text-slate-400 text-sm">{niche.category}</span>
            </div>
            
            <div className="flex gap-6 text-sm text-slate-300 mb-3">
              {niche.marketSize && <span>Market: {niche.marketSize}</span>}
              {niche.growthRate && <span className="text-green-500">Growth: {niche.growthRate}</span>}
              <span>Keywords: {niche.keywords?.length || 0}</span>
              <span>Phases: {niche.phases?.length || 0}</span>
              <span>Downloads: {niche.downloadCount}</span>
            </div>
            
            {niche.research?.marketOverview && (
              <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                {niche.research.marketOverview}
              </p>
            )}
          </div>
          
            <Link href={`/niche-boxes/${niche.nicheSlug}`}>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 font-bold uppercase tracking-widest text-xs">
                View Blueprint
              </Button>
            </Link>
        </div>
      </CardContent>
    </Card>
  );
}
