"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Download, Eye, Search, Filter, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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
}

export default function NicheBoxesList() {
  const { toast } = useToast();
  const [niches, setNiches] = useState<NicheBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchNiches();
  }, [statusFilter, categoryFilter]);

  const fetchNiches = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      
      const response = await fetch(`/api/niche-boxes?${params}`);
      if (response.ok) {
        const data = await response.json();
        setNiches(data);
      } else {
        let errorDetails = "Failed to fetch niche boxes";
        try {
          const errData = await response.json();
          errorDetails = errData.details || errData.error || errorDetails;
        } catch(e) {}
        throw new Error(errorDetails);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching niches",
        description: error.message || "Failed to load niche boxes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteNiche = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this niche box?')) return;
    
    try {
      const response = await fetch(`/api/niche-boxes/${slug}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setNiches(niches.filter(n => n.nicheSlug !== slug));
        toast({
          title: "Success",
          description: "Niche box deleted successfully",
        });
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete niche box",
        variant: "destructive",
      });
    }
  };

  const exportNiche = async (slug: string) => {
    try {
      const response = await fetch(`/api/niche-boxes/${slug}`);
      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slug}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export niche box",
        variant: "destructive",
      });
    }
  };

  const filteredNiches = niches.filter(niche => 
    (niche.nicheName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (niche.nicheSlug || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (niche.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(niches.map(n => n.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading niche boxes...</div>
      </div>
    );
  }

  return (
    <div className="p-12 space-y-12 bg-white min-h-screen font-sans">
      <div className="flex justify-between items-end max-w-7xl mx-auto">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-slate-900 p-2.5 rounded-2xl shadow-xl shadow-slate-900/10">
                <Layers size={24} className="text-white" />
             </div>
             <div>
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                   Niche<span className="text-indigo-600">Box</span>
                </h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Architect Studio / BLUEPRINT MANAGER</p>
             </div>
          </div>
          <p className="text-slate-500 font-medium italic">Manage and refine your business blueprints</p>
        </div>
        <Link href="/admin/niche-boxes/create">
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-6 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-lg shadow-indigo-600/10 transition-transform active:scale-95">
            <Plus className="w-4 h-4 mr-2" />
            CREATE NEW BLUEPRINT
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="bg-slate-50 border-slate-200 rounded-3xl max-w-7xl mx-auto shadow-sm">
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by name, slug or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-white border-slate-200 text-slate-900 rounded-xl h-12 focus:ring-1 focus:ring-black outline-none"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44 bg-white border-slate-200 text-slate-900 rounded-xl h-12 font-bold text-xs uppercase tracking-widest px-4">
                <SelectValue placeholder="STATUS" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 shadow-xl">
                <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">ALL STATUS</SelectItem>
                <SelectItem value="draft" className="text-[10px] font-black uppercase tracking-widest">DRAFT</SelectItem>
                <SelectItem value="published" className="text-[10px] font-black uppercase tracking-widest text-green-600">PUBLISHED</SelectItem>
                <SelectItem value="archived" className="text-[10px] font-black uppercase tracking-widest text-slate-400">ARCHIVED</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44 bg-white border-slate-200 text-slate-900 rounded-xl h-12 font-bold text-xs uppercase tracking-widest px-4">
                <SelectValue placeholder="CATEGORY" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 shadow-xl">
                <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">ALL CATEGORIES</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-[10px] font-black uppercase tracking-widest">{cat.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Niche Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filteredNiches.map((niche) => (
          <Card key={niche._id} className="bg-white border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-slate-900 text-xl font-black italic tracking-tight uppercase line-clamp-1">{niche.nicheName}</CardTitle>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">{niche.category}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`rounded-lg py-1 px-3 text-[9px] font-black uppercase tracking-widest shadow-sm
                        ${niche.status === 'published' 
                          ? 'bg-green-50 text-green-600 border border-green-100' 
                          : niche.status === 'archived'
                          ? 'bg-slate-50 text-slate-500 border border-slate-100'
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}>
                    {niche.status}
                  </Badge>
                  {niche.featured && (
                    <Badge className="bg-amber-50 text-amber-600 border border-amber-100 text-[8px] font-black uppercase tracking-widest">
                      FEATURED
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-[11px] text-slate-500 space-y-2 font-bold uppercase tracking-wide">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Competition:</span>
                  <span className={`
                    ${niche.competition === 'Low' ? 'text-green-600' : ''}
                    ${niche.competition === 'Medium' ? 'text-amber-600' : ''}
                    ${niche.competition === 'Hard' ? 'text-orange-600' : ''}
                    ${niche.competition === 'Master' ? 'text-rose-600' : ''}
                  `}>
                    {niche.competition}
                  </span>
                </div>
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
                  <span className="text-slate-400">Downloads:</span>
                  <span className="text-slate-900">{niche.downloadCount}</span>
                </div>
              </div>
              
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-4">
                LAST MODIFIED: {new Date(niche.updatedAt).toLocaleDateString()}
              </div>

              <div className="flex gap-2 pt-2">
                <Link href={`/admin/niche-boxes/${niche.nicheSlug}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-white border-slate-200 text-slate-900 hover:bg-slate-50 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all">
                    <Edit className="w-3.5 h-3.5 mr-2" />
                    EDIT
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => exportNiche(niche.nicheSlug)}
                  className="bg-white border-slate-200 text-slate-900 hover:bg-slate-50 rounded-xl p-3"
                >
                  <Download className="w-4 h-4 text-indigo-600" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => deleteNiche(niche.nicheSlug)}
                  className="bg-white border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl p-3"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNiches.length === 0 && (
        <div className="text-center py-24 max-w-7xl mx-auto">
          <Layers size={48} className="mx-auto text-slate-200 mb-6" />
          <div className="text-slate-500 font-medium italic text-lg">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
              ? 'No niche boxes found matching your filters.'
              : 'No blueprints found in your Architect Studio.'
            }
          </div>
          {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
            <Link href="/admin/niche-boxes/create">
              <Button className="mt-8 bg-slate-900 hover:bg-black text-white px-8 py-6 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl transition-all hover:-translate-y-1">
                <Plus className="w-4 h-4 mr-2" />
                CREATE YOUR FIRST BLUEPRINT
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
