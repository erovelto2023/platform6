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
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `niche-box-${slug}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        toast({
          title: "Export Success",
          description: `Exported ${slug}.json`,
        });
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export niche box data",
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
      <div className="flex items-center justify-center h-64 text-cyan-400 font-mono text-xs">
        Loading niche boxes...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl shadow-xl">
            <Layers size={24} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-100 uppercase">
              Niche<span className="text-cyan-400">Box</span> Studio
            </h1>
            <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">Blueprint & Niche Business Manager</p>
          </div>
        </div>
        <Link href="/admin/niche-boxes/create">
          <Button className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-extrabold px-6 py-3 rounded-2xl text-xs tracking-wider uppercase shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 border-0 cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            CREATE NEW BLUEPRINT
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800 rounded-3xl shadow-xl">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by name, slug or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-2xl text-xs font-mono"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44 bg-slate-950 border-slate-800 text-slate-100 rounded-2xl h-10 font-mono font-bold text-xs uppercase px-4">
                  <SelectValue placeholder="STATUS" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
                  <SelectItem value="all" className="text-xs font-mono font-bold uppercase">ALL STATUS</SelectItem>
                  <SelectItem value="draft" className="text-xs font-mono font-bold uppercase text-amber-400">DRAFT</SelectItem>
                  <SelectItem value="published" className="text-xs font-mono font-bold uppercase text-emerald-400">PUBLISHED</SelectItem>
                  <SelectItem value="archived" className="text-xs font-mono font-bold uppercase text-slate-400">ARCHIVED</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-44 bg-slate-950 border-slate-800 text-slate-100 rounded-2xl h-10 font-mono font-bold text-xs uppercase px-4">
                  <SelectValue placeholder="CATEGORY" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
                  <SelectItem value="all" className="text-xs font-mono font-bold uppercase">ALL CATEGORIES</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="text-xs font-mono font-bold uppercase text-cyan-300">{cat.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Niche Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNiches.map((niche) => (
          <Card key={niche._id} className="bg-slate-900 border-slate-800 hover:border-cyan-500/80 hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-slate-100 text-xl font-black tracking-tight line-clamp-1">{niche.nicheName}</CardTitle>
                  <p className="text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider mt-1">{niche.category}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`rounded-xl py-1 px-3 text-[9px] font-mono font-bold uppercase tracking-wider shadow-sm
                        ${niche.status === 'published' 
                          ? 'bg-slate-950 text-emerald-400 border border-emerald-800' 
                          : niche.status === 'archived'
                          ? 'bg-slate-950 text-slate-400 border border-slate-800'
                          : 'bg-slate-950 text-amber-400 border border-amber-800'
                        }`}>
                    {niche.status}
                  </Badge>
                  {niche.featured && (
                    <Badge className="bg-slate-950 text-purple-300 border border-purple-800 text-[8px] font-mono font-bold uppercase tracking-wider">
                      FEATURED
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-xs font-mono text-slate-300 space-y-2 font-bold uppercase">
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Competition:</span>
                  <span className={`
                    ${niche.competition === 'Low' ? 'text-emerald-400' : ''}
                    ${niche.competition === 'Medium' ? 'text-amber-400' : ''}
                    ${niche.competition === 'Hard' ? 'text-orange-400' : ''}
                    ${niche.competition === 'Master' ? 'text-rose-400' : ''}
                  `}>
                    {niche.competition}
                  </span>
                </div>
                {niche.marketSize && (
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Audience:</span>
                    <span className="text-slate-100">{niche.marketSize}</span>
                  </div>
                )}
                {niche.growthRate && (
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Growth:</span>
                    <span className="text-cyan-400">{niche.growthRate}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Downloads:</span>
                  <span className="text-emerald-400">{niche.downloadCount}</span>
                </div>
              </div>
              
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase border-t border-slate-800/80 pt-4">
                UPDATED: {new Date(niche.updatedAt).toLocaleDateString()}
              </div>

              <div className="flex gap-2 pt-2">
                <Link href={`/admin/niche-boxes/${niche.nicheSlug}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-slate-950 border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 rounded-2xl text-[10px] font-mono font-bold uppercase transition-all">
                    <Edit className="w-3.5 h-3.5 mr-2 text-cyan-400" />
                    EDIT
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => exportNiche(niche.nicheSlug)}
                  className="bg-slate-950 border-slate-800 text-slate-200 hover:text-cyan-400 hover:bg-slate-800 rounded-2xl p-3"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => deleteNiche(niche.nicheSlug)}
                  className="bg-slate-950 border-slate-800 text-rose-400 hover:bg-rose-950 rounded-2xl p-3"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNiches.length === 0 && (
        <div className="text-center py-24 max-w-7xl mx-auto bg-slate-900 border border-slate-800 border-dashed rounded-3xl p-8">
          <Layers size={48} className="mx-auto text-slate-500 mb-4" />
          <div className="text-slate-300 font-mono text-xs font-bold uppercase">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
              ? 'No niche boxes found matching your filters.'
              : 'No blueprints found in your Architect Studio.'
            }
          </div>
          {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
            <Link href="/admin/niche-boxes/create">
              <Button className="mt-8 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-xs font-extrabold uppercase shadow-xl transition-all">
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
