"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  Layers, Package, CheckCircle, TrendingUp, Users, DollarSign,
  Target, Zap, Lock, BookOpen, Star, Copy, ExternalLink, Lightbulb, UserCircle, Map as MapIcon,
  FileText, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

export default function NicheBoxDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [niche, setNiche] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>([]);

  useEffect(() => {
    if (!slug) return;
    const fetchNiche = async () => {
      try {
        const res = await fetch(`/api/niche-boxes/${slug}`);
        if (!res.ok) throw new Error('Niche not found');
        const data = await res.json();
        setNiche(data);
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to load niche box', variant: 'destructive' });
        router.push('/niche-boxes');
      } finally {
        setLoading(false);
      }
    };
    fetchNiche();
  }, [slug, router, toast]);

  const handleSelectAllKeywords = (checked: boolean) => {
    if (checked && niche?.keywords) {
      setSelectedKeywords(niche.keywords.map((_: any, i: number) => i));
    } else {
      setSelectedKeywords([]);
    }
  };

  const handleSelectKeyword = (index: number, checked: boolean) => {
    if (checked) {
      setSelectedKeywords(prev => [...prev, index]);
    } else {
      setSelectedKeywords(prev => prev.filter(i => i !== index));
    }
  };

  const handleExportCSV = () => {
    if (!niche?.keywords || selectedKeywords.length === 0) return;
    
    const selectedData = selectedKeywords.map(index => niche.keywords[index]);
    
    // Create CSV header
    const headers = ['Keyword', 'Search Volume', 'Search Intent', 'Avg CPC', 'KD %', 'SERP Features'];
    const csvRows = [headers.join(',')];
    
    // Add rows
    selectedData.forEach((seo: any) => {
      const row = [
        `"${seo.keyword || ''}"`,
        `"${seo.searchVolume || ''}"`,
        `"${seo.searchIntent || ''}"`,
        `"${seo.cpc || ''}"`,
        `"${seo.competitionDifficulty || ''}"`,
        `"${seo.serpFeatures || ''}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${niche.nicheSlug}-keywords.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({ title: 'Export Successful', description: `Exported ${selectedKeywords.length} keywords to CSV.` });
  };

  const handleExportText = () => {
    if (!niche?.keywords || selectedKeywords.length === 0) return;
    
    const selectedData = selectedKeywords.map(index => niche.keywords[index]);
    const textContent = selectedData.map((seo: any) => seo.keyword).join('\n');
    
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${niche.nicheSlug}-keywords.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({ title: 'Export Successful', description: `Exported ${selectedKeywords.length} keywords to Text.` });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-slate-400 animate-pulse font-black text-xl uppercase tracking-tighter italic">Unlocking Niche Details...</div>
      </div>
    );
  }

  if (!niche) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/30 font-sans pb-24">
       {/* Hero Section */}
       <div className="relative border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-20">
             <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div>
                    <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-200 mb-6 uppercase tracking-widest text-xs px-3 py-1 font-black">
                       {niche.category}
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 italic tracking-tighter mb-6 leading-tight">
                       {niche.nicheName}
                    </h1>
                    
                    <div className="flex flex-wrap gap-4 mb-8">
                       <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-4 py-2">
                           <Target size={16} className="text-indigo-600" />
                           <span className="text-sm font-bold text-slate-600">Competition: <span className="text-slate-900">{niche.competition}</span></span>
                       </div>
                       {niche.marketSize && (
                           <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-4 py-2">
                               <TrendingUp size={16} className="text-emerald-600" />
                               <span className="text-sm font-bold text-slate-600">Market Size: <span className="text-slate-900">{niche.marketSize}</span></span>
                           </div>
                       )}
                       {niche.growthRate && (
                           <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-4 py-2">
                               <Zap size={16} className="text-yellow-600" />
                               <span className="text-sm font-bold text-slate-600">Growth: <span className="text-slate-900">{niche.growthRate}</span></span>
                           </div>
                       )}
                       {niche.estimatedValue && (
                           <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-4 py-2">
                               <DollarSign size={16} className="text-green-600" />
                               <span className="text-sm font-bold text-slate-600">Est. Value: <span className="text-slate-900">{niche.estimatedValue}</span></span>
                           </div>
                       )}
                    </div>

                    <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-xl">
                       {niche.research?.marketOverview || "A fully researched, ready-to-deploy business in a box loaded with content, strategies, and customer insights."}
                    </p>
                    
                 </div>
                 {niche.heroImage && (
                    <div className="relative rounded-3xl overflow-hidden border border-slate-200 aspect-video shadow-2xl shadow-indigo-500/10">
                       <img src={niche.heroImage} alt={niche.nicheName} className="object-cover w-full h-full" />
                    </div>
                 )}
             </div>
          </div>
       </div>

       {/* Tabs Section */}
       <div className="max-w-7xl mx-auto px-6 py-12">
          <Tabs defaultValue="research" className="space-y-12">
             <TabsList className="bg-white border border-slate-200 p-1 rounded-xl flex flex-wrap h-auto gap-1 shadow-sm">
                <TabsTrigger value="research" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-500 text-xs font-black uppercase tracking-widest py-3 px-6 rounded-lg">Market Research</TabsTrigger>
                <TabsTrigger value="avatar" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-500 text-xs font-black uppercase tracking-widest py-3 px-6 rounded-lg">Customer Avatar</TabsTrigger>
                <TabsTrigger value="assets" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-500 text-xs font-black uppercase tracking-widest py-3 px-6 rounded-lg">Content Assets ({niche.assets?.length || 0})</TabsTrigger>
                <TabsTrigger value="seo" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-500 text-xs font-black uppercase tracking-widest py-3 px-6 rounded-lg">SEO Vault ({niche.keywords?.length || 0})</TabsTrigger>
                <TabsTrigger value="business" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-500 text-xs font-black uppercase tracking-widest py-3 px-6 rounded-lg">Business Models ({niche.businessModels?.length || 0})</TabsTrigger>
                <TabsTrigger value="tools" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-500 text-xs font-black uppercase tracking-widest py-3 px-6 rounded-lg">Recommended Tools</TabsTrigger>
                <TabsTrigger value="roadmap" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-500 text-xs font-black uppercase tracking-widest py-3 px-6 rounded-lg">Execution Roadmap</TabsTrigger>
                <TabsTrigger value="ideas" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-500 text-xs font-black uppercase tracking-widest py-3 px-6 rounded-lg">Content Strategy</TabsTrigger>
             </TabsList>

             <TabsContent value="research" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                 <div className="grid md:grid-cols-2 gap-8">
                     <Card className="bg-white border-slate-200 p-8 rounded-3xl shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 italic tracking-tighter mb-6">MARKET TRACTION</h3>
                        <div className="space-y-6">
                           <div>
                              <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Top Queries</h4>
                              {niche.research?.topTrends?.map((t: any, i: number) => (
                                 <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 mb-2">
                                     <span className="font-bold text-sm text-slate-800">{t.query}</span>
                                     <div className="flex gap-4 text-xs font-mono">
                                        <span className="text-slate-500">Vol: {t.search}</span>
                                        <span className="text-green-600">{t.increase}</span>
                                     </div>
                                 </div>
                              ))}
                           </div>
                           <div>
                              <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 mt-6">Rising Needs</h4>
                              {niche.research?.risingTrends?.map((t: any, i: number) => (
                                 <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 mb-2">
                                     <span className="font-bold text-sm text-slate-800">{t.query}</span>
                                     <div className="flex gap-4 text-xs font-mono">
                                        <span className="text-slate-500">Vol: {t.search}</span>
                                        <span className="text-green-600">{t.increase}</span>
                                     </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </Card>
                     <Card className="bg-white border-slate-200 p-8 rounded-3xl shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 italic tracking-tighter mb-6">OPPORTUNITIES</h3>
                        <div className="space-y-3">
                           {niche.research?.opportunities?.map((opp: string, i: number) => (
                              <div key={i} className="flex gap-3 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                                 <CheckCircle className="text-indigo-600 mt-0.5 shrink-0" size={16} />
                                 <p className="text-sm text-slate-700 leading-relaxed">{opp}</p>
                              </div>
                           ))}
                        </div>
                     </Card>
                 </div>
             </TabsContent>

             <TabsContent value="avatar" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                 <div className="grid md:grid-cols-2 gap-8">
                     {/* Demographics & Professional */}
                     <div className="space-y-8">
                         <Card className="bg-white border-slate-200 p-8 rounded-3xl shadow-sm">
                             <div className="flex items-center gap-3 mb-6">
                                 <UserCircle className="text-indigo-600" size={24} />
                                 <h3 className="text-xl font-black text-slate-900 italic tracking-tighter">THE AVATAR PROFILE</h3>
                             </div>
                             <div className="space-y-4">
                                {niche.customerAvatar?.demographics?.age && <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 text-sm">Age</span><span className="font-bold text-slate-800">{niche.customerAvatar.demographics.age}</span></div>}
                                {niche.customerAvatar?.demographics?.gender && <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 text-sm">Gender</span><span className="font-bold text-slate-800">{niche.customerAvatar.demographics.gender}</span></div>}
                                {niche.customerAvatar?.demographics?.location && <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 text-sm">Location</span><span className="font-bold text-slate-800">{niche.customerAvatar.demographics.location}</span></div>}
                                {niche.customerAvatar?.demographics?.incomeLevel && <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 text-sm">Income Level</span><span className="font-bold text-slate-800">{niche.customerAvatar.demographics.incomeLevel}</span></div>}
                                {niche.customerAvatar?.professional?.jobTitle && <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 text-sm">Occupation</span><span className="font-bold text-slate-800">{niche.customerAvatar.professional.jobTitle}</span></div>}
                             </div>
                         </Card>

                         <Card className="bg-white border-slate-200 p-8 rounded-3xl shadow-sm">
                             <div className="flex items-center gap-3 mb-6">
                                 <Lightbulb className="text-amber-500" size={24} />
                                 <h3 className="text-xl font-black text-slate-900 italic tracking-tighter">WHAT THEY THINK ABOUT</h3>
                             </div>
                             <div className="space-y-4 text-sm">
                                {niche.customerAvatar?.psychographics?.coreValues && 
                                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                      <span className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-1">Core Values</span>
                                      <p className="text-slate-700">{niche.customerAvatar.psychographics.coreValues}</p>
                                   </div>
                                }
                                {niche.customerAvatar?.psychology?.aspirations && 
                                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                      <span className="text-xs font-black uppercase tracking-widest text-emerald-600 block mb-1">Aspirations</span>
                                      <p className="text-slate-700">{niche.customerAvatar.psychology.aspirations}</p>
                                   </div>
                                }
                                {niche.customerAvatar?.psychology?.fears && 
                                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                      <span className="text-xs font-black uppercase tracking-widest text-rose-600 block mb-1">Fears & Nightmares</span>
                                      <p className="text-slate-700">{niche.customerAvatar.psychology.fears}</p>
                                   </div>
                                }
                             </div>
                         </Card>
                     </div>

                     {/* Deep Psychology & Buying Nav */}
                     <div className="space-y-8">
                         <Card className="bg-white border-slate-200 p-8 rounded-3xl h-full shadow-sm">
                             <h3 className="text-xl font-black text-slate-900 italic tracking-tighter mb-6 pb-4 border-b border-slate-200">THEIR BUYING BEHAVIOR</h3>
                             <div className="space-y-6 text-sm">
                                {niche.customerAvatar?.psychology?.primaryGoals && (
                                   <div>
                                      <span className="text-xs font-black uppercase tracking-widest text-indigo-600 block mb-2">Primary Goals</span>
                                      <div className="bg-indigo-50 text-indigo-900 p-4 rounded-xl border border-indigo-100">{niche.customerAvatar.psychology.primaryGoals}</div>
                                   </div>
                                )}
                                {niche.customerAvatar?.psychology?.biggestChallenges && (
                                   <div>
                                      <span className="text-xs font-black uppercase tracking-widest text-rose-600 block mb-2">Biggest Challenges</span>
                                      <div className="bg-rose-50 text-rose-900 p-4 rounded-xl border border-rose-100">{niche.customerAvatar.psychology.biggestChallenges}</div>
                                   </div>
                                )}
                                {niche.customerAvatar?.psychology?.commonObjections && (
                                   <div>
                                      <span className="text-xs font-black uppercase tracking-widest text-orange-600 block mb-2">Common Objections</span>
                                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700">{niche.customerAvatar.psychology.commonObjections}</div>
                                   </div>
                                )}
                                {niche.customerAvatar?.buyingBehavior?.keyPurchasingDrivers && (
                                   <div>
                                      <span className="text-xs font-black uppercase tracking-widest text-emerald-600 block mb-2">Key Purchase Drivers</span>
                                      <div className="bg-emerald-50 text-emerald-900 p-4 rounded-xl border border-emerald-100">{niche.customerAvatar.buyingBehavior.keyPurchasingDrivers}</div>
                                   </div>
                                )}
                             </div>
                         </Card>
                     </div>
                 </div>
             </TabsContent>
             {/* Content Assets Section */}
             <TabsContent value="assets" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex items-center gap-3 mb-8">
                     <Package className="text-indigo-600" size={32} />
                     <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">DONE-FOR-YOU ASSETS</h3>
                 </div>
                 <div className="grid md:grid-cols-3 gap-6">
                    {niche.assets?.map((asset: any, i: number) => (
                       <Card key={i} className="bg-white border-slate-200 flex flex-col h-full rounded-2xl hover:border-indigo-500/50 transition-colors shadow-sm">
                          <CardContent className="p-6 flex-1 flex flex-col">
                              <Badge className="self-start bg-slate-100 text-slate-600 border-slate-200 mb-4">{asset.category}</Badge>
                              <h4 className="text-lg font-bold text-slate-900 mb-2">{asset.name}</h4>
                              {asset.title && <p className="text-indigo-600 text-sm font-medium mb-2">{asset.title}</p>}
                              {asset.description && <p className="text-sm text-slate-500 mb-6 flex-1">{asset.description}</p>}
                              
                              <div className="pt-4 border-t border-slate-100 mt-auto">
                                 {asset.fileUrl ? (
                                    <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold tracking-widest">
                                       <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer">
                                          DOWNLOAD FILE
                                       </a>
                                    </Button>
                                 ) : asset.link ? (
                                    <Button asChild className="w-full bg-slate-100 hover:bg-slate-200 text-xs font-bold tracking-widest text-slate-700" variant="outline">
                                       <a href={asset.link} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="w-4 h-4 mr-2" />
                                          OPEN RESOURCE
                                       </a>
                                    </Button>
                                 ) : (
                                    <div className="text-center text-xs text-slate-400 font-medium uppercase tracking-widest">Asset Coming Soon</div>
                                 )}
                              </div>
                          </CardContent>
                       </Card>
                    ))}
                 </div>
                 {(!niche.assets || niche.assets.length === 0) && (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
                       <Package className="mx-auto w-12 h-12 text-slate-300 mb-4" />
                       <h3 className="text-lg font-bold text-slate-600">No Assets Available</h3>
                       <p className="text-slate-400 text-sm mt-2">Assets for this niche box are still being curated.</p>
                    </div>
                 )}
             </TabsContent>

             {/* SEO Vault Section */}
             <TabsContent value="seo" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                     <div className="flex items-center gap-3">
                         <TrendingUp className="text-indigo-600" size={32} />
                         <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">SEO KEYWORD VAULT</h3>
                     </div>
                     <div className="flex items-center gap-3">
                        <Button 
                           variant="outline" 
                           className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-bold tracking-widest text-xs h-10 px-4 rounded-xl shadow-sm transition-colors"
                           onClick={handleExportText}
                           disabled={selectedKeywords.length === 0}
                        >
                           <FileText className="w-4 h-4 mr-2" />
                           EXPORT TEXT
                        </Button>
                        <Button 
                           className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-widest text-xs h-10 px-4 rounded-xl shadow-sm transition-colors"
                           onClick={handleExportCSV}
                           disabled={selectedKeywords.length === 0}
                        >
                           <Download className="w-4 h-4 mr-2" />
                           EXPORT CSV {selectedKeywords.length > 0 && `(${selectedKeywords.length})`}
                        </Button>
                     </div>
                 </div>
                 <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                       <table className="w-full text-sm text-left">
                          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100 tracking-widest font-black">
                             <tr>
                                <th className="px-6 py-4 w-12 text-center">
                                   <Checkbox 
                                     checked={niche.keywords?.length > 0 && selectedKeywords.length === niche.keywords.length}
                                     onCheckedChange={handleSelectAllKeywords}
                                     className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded"
                                   />
                                </th>
                                <th className="px-6 py-4">Keyword</th>
                                <th className="px-6 py-4">Search Volume</th>
                                <th className="px-6 py-4">Search Intent</th>
                                <th className="px-6 py-4">Avg CPC</th>
                                <th className="px-6 py-4">KD %</th>
                                <th className="px-6 py-4">SERP Features</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {niche.keywords?.map((seo: any, i: number) => (
                                <tr key={i} className={`transition-colors ${selectedKeywords.includes(i) ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
                                   <td className="px-6 py-4 text-center">
                                      <Checkbox 
                                        checked={selectedKeywords.includes(i)}
                                        onCheckedChange={(checked) => handleSelectKeyword(i, checked === true)}
                                        className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded"
                                      />
                                   </td>
                                   <td className="px-6 py-4 font-bold text-slate-800">{seo.keyword}</td>
                                   <td className="px-6 py-4 text-slate-600 font-mono">{seo.searchVolume}</td>
                                   <td className="px-6 py-4">
                                      <Badge variant="outline" className={`
                                         ${seo.searchIntent?.toLowerCase() === 'informational' && 'bg-blue-50 text-blue-600 border-blue-100'}
                                         ${seo.searchIntent?.toLowerCase() === 'commercial' && 'bg-orange-50 text-orange-600 border-orange-100'}
                                         ${seo.searchIntent?.toLowerCase() === 'transactional' && 'bg-green-50 text-green-600 border-green-100'}
                                      `}>
                                         {seo.searchIntent || 'Unknown'}
                                      </Badge>
                                   </td>
                                   <td className="px-6 py-4 text-emerald-600 font-mono">{seo.cpc ? `$${seo.cpc}` : '-'}</td>
                                   <td className="px-6 py-4">
                                      <span className={`font-mono font-bold ${
                                         parseInt(seo.competitionDifficulty) > 70 ? 'text-red-600' :
                                         parseInt(seo.competitionDifficulty) > 40 ? 'text-amber-600' : 'text-emerald-600'
                                      }`}>
                                         {seo.competitionDifficulty}
                                      </span>
                                   </td>
                                   <td className="px-6 py-4 text-slate-500 text-xs">{seo.serpFeatures}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                    {(!niche.keywords || niche.keywords.length === 0) && (
                       <div className="text-center py-12">
                          <p className="text-slate-500 text-sm">No keyword data available for this niche.</p>
                       </div>
                    )}
                 </div>
             </TabsContent>

             {/* Business Models Section */}
             <TabsContent value="business" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex items-center gap-3 mb-8">
                     <DollarSign className="text-indigo-600" size={32} />
                     <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">RECOMMENDED BUSINESS MODELS</h3>
                 </div>
                 <div className="grid md:grid-cols-2 gap-8">
                    {niche.businessModels?.map((model: any, i: number) => (
                       <Card key={i} className="bg-white border-slate-200 rounded-3xl hover:border-indigo-500/50 transition-all group shadow-sm">
                          <CardContent className="p-8">
                             <div className="flex justify-between items-start mb-4">
                                <h4 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{model.name}</h4>
                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 font-mono font-bold">
                                   {model.profitPotential || "High Profit"}
                                </Badge>
                             </div>
                             <p className="text-slate-600 leading-relaxed text-sm mb-6 pb-6 border-b border-slate-100">
                                {model.description}
                             </p>
                          </CardContent>
                       </Card>
                    ))}
                 </div>
                 {(!niche.businessModels || niche.businessModels.length === 0) && (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
                       <DollarSign className="mx-auto w-12 h-12 text-slate-300 mb-4" />
                       <h3 className="text-lg font-bold text-slate-600">No Business Models</h3>
                       <p className="text-slate-400 text-sm mt-2">Business strategies are currently being formulated.</p>
                    </div>
                 )}
             </TabsContent>

             {/* Recommended Tools Section */}
             <TabsContent value="tools" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex items-center gap-3 mb-8">
                     <Layers className="text-indigo-600" size={32} />
                     <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">RECOMMENDED TOOLS & PARTNERS</h3>
                 </div>
                 <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                       <table className="w-full text-sm text-left">
                          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100 tracking-widest font-black">
                             <tr>
                                <th className="px-6 py-4">Software/Tool</th>
                                <th className="px-6 py-4">Purpose</th>
                                <th className="px-6 py-4">Est. Cost</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4 text-right">Action</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {niche.recommendedTools?.map((tool: any, i: number) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                   <td className="px-6 py-4 font-bold text-slate-900">{tool.toolName}</td>
                                   <td className="px-6 py-4 text-slate-600">{tool.purpose}</td>
                                   <td className="px-6 py-4 font-mono text-emerald-600">{tool.cost}</td>
                                   <td className="px-6 py-4">
                                      <Badge variant="outline" className={`
                                         ${tool.priority === 'Required' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : ''}
                                         ${tool.priority === 'High' ? 'bg-rose-50 text-rose-700 border-rose-100' : ''}
                                         ${tool.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' : ''}
                                         ${tool.priority === 'Optional' ? 'bg-slate-50 text-slate-600 border-slate-100' : ''}
                                      `}>
                                         {tool.priority}
                                      </Badge>
                                   </td>
                                   <td className="px-6 py-4 text-right">
                                      {tool.affiliateLink && (
                                         <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold tracking-widest text-white shadow-sm border-none">
                                            <a href={tool.affiliateLink} target="_blank" rel="noopener noreferrer">
                                               GET IT NOW
                                            </a>
                                         </Button>
                                      )}
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                    {(!niche.recommendedTools || niche.recommendedTools.length === 0) && (
                       <div className="text-center py-12">
                          <p className="text-slate-400 text-sm">No specific tools recommended at this time.</p>
                       </div>
                    )}
                 </div>
             </TabsContent>

             {/* Roadmap section */}
             <TabsContent value="roadmap" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex items-center gap-3 mb-8">
                     <MapIcon className="text-indigo-600" size={32} />
                     <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">EXECUTION ROADMAP</h3>
                 </div>
                 <div className="space-y-6 relative before:absolute before:inset-0 before:ml-10 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                     {niche.phases?.map((phase: any, index: number) => (
                         <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                             <div className="flex items-center justify-center w-20 h-20 rounded-full border-4 border-slate-50 bg-white text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors z-10">
                                <span className="text-xl font-black">{index + 1}</span>
                             </div>
                             
                             <div className="w-[calc(100%-6rem)] md:w-[calc(50%-4rem)] p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-500/30 transition-colors shadow-sm">
                                 <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-slate-50">
                                    <h4 className="text-xl font-black text-slate-900">{phase.name}</h4>
                                    <div className="flex gap-3">
                                       <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200 font-mono text-xs">
                                          ⏱️ {phase.duration || 'Flexible'}
                                       </Badge>
                                       <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono text-xs">
                                          💰 {phase.budget || 'Minimal'}
                                       </Badge>
                                    </div>
                                 </div>
                                 <p className="text-slate-500 text-sm mb-4">{phase.description}</p>
                                 <ul className="space-y-2">
                                     {phase.tasks?.map((task: string, tIndex: number) => (
                                         <li key={tIndex} className="flex gap-2 text-sm text-slate-600">
                                             <CheckCircle className="text-indigo-600 mt-0.5 shrink-0" size={14} />
                                             <span className="leading-snug">{task}</span>
                                         </li>
                                     ))}
                                 </ul>
                             </div>
                         </div>
                     ))}
                 </div>
                 {(!niche.phases || niche.phases.length === 0) && (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
                       <MapIcon className="mx-auto w-12 h-12 text-slate-300 mb-4" />
                       <h3 className="text-lg font-bold text-slate-600">Roadmap Pending</h3>
                       <p className="text-slate-400 text-sm mt-2">The execution plan is still under development.</p>
                    </div>
                 )}
             </TabsContent>

             {/* Content Strategy section */}
             <TabsContent value="ideas" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                     <div className="flex items-center gap-3">
                         <Lightbulb className="text-amber-500" size={32} />
                         <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">HUNDREDS OF CONTENT IDEAS</h3>
                     </div>
                 </div>

                 <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {/* Iterate dynamically over idea pairs */}
                    {niche.ideas && Object.entries(niche.ideas).filter(([_, val]) => val).map(([key, value], i: number) => {
                       // Format the camelCase key into a Title Case string
                       const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
                       
                       return (
                          <Card key={i} className="break-inside-avoid bg-white border-slate-200 rounded-3xl hover:border-indigo-500/30 transition-colors h-fit shadow-sm">
                             <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4 rounded-t-3xl">
                                <CardTitle className="text-sm font-black text-indigo-600 uppercase tracking-widest">{title} Ideas</CardTitle>
                             </CardHeader>
                             <CardContent className="p-6">
                                <div className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                                   {(value as string)}
                                </div>
                             </CardContent>
                          </Card>
                       );
                    })}
                 </div>

                 {(!niche.ideas || Object.keys(niche.ideas).length === 0) && (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
                       <Lightbulb className="mx-auto w-12 h-12 text-slate-300 mb-4" />
                       <h3 className="text-lg font-bold text-slate-600">No Content Ideas</h3>
                       <p className="text-slate-400 text-sm mt-2">Content strategy is pending generation.</p>
                    </div>
                 )}
             </TabsContent>

          </Tabs>
       </div>
    </div>
  );
}
