"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
    Plus, Search, Edit, Trash2, Globe, Eye, 
    ArrowUpRight, BarChart3, Tag, Calendar, 
    MoreHorizontal, Copy, Zap 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { deleteOffer } from '@/lib/actions/offer.actions';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface OfferListClientProps {
    initialOffers: any[];
}

export default function OfferListClient({ initialOffers }: OfferListClientProps) {
    const [offers, setOffers] = useState(initialOffers);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOffers = offers.filter(offer => 
        offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this offer?')) return;
        
        try {
            const result = await deleteOffer(id);
            if (result.success) {
                setOffers(prev => prev.filter(o => o._id !== id));
                toast.success('Offer deleted successfully');
            } else {
                toast.error('Failed to delete offer');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const copyLink = (slug: string) => {
        const url = `${window.location.origin}/offers/${slug}`;
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search offers..." 
                        className="pl-10 rounded-2xl border-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Link href="/admin/offers/create">
                    <Button className="rounded-2xl bg-blue-600 hover:bg-blue-700 gap-2 h-11 px-6 shadow-lg shadow-blue-500/20">
                        <Plus size={18} /> New Offer
                    </Button>
                </Link>
            </div>

            {filteredOffers.length === 0 ? (
                <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-20 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                        <Tag size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900">No offers found</h3>
                        <p className="text-slate-500 font-medium">Start by creating your first high-converting offer.</p>
                    </div>
                    <Link href="/admin/offers/create">
                        <Button variant="outline" className="rounded-xl mt-4">Create First Offer</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredOffers.map((offer) => (
                        <div key={offer._id} className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1">
                            {/* Card Color Header */}
                            <div 
                                className="h-32 w-full relative flex items-end px-6 pb-4" 
                                style={{ backgroundColor: offer.marketplaceColor || '#3b82f6' }}
                            >
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                                        offer.isPublished ? "bg-white text-green-600" : "bg-white/20 text-white backdrop-blur-md"
                                    )}>
                                        {offer.isPublished ? 'Published' : 'Draft'}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/40 border-none outline-none">
                                                <MoreHorizontal size={14} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100 shadow-xl">
                                            <DropdownMenuItem onClick={() => copyLink(offer.slug)} className="rounded-xl gap-2 font-bold cursor-pointer">
                                                <Copy size={14} /> Copy Link
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild className="rounded-xl gap-2 font-bold text-red-600 focus:text-red-600 cursor-pointer">
                                                <button onClick={() => handleDelete(offer._id)} className="w-full flex items-center text-left">
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-lg font-black text-lg">
                                    {offer.name.charAt(0)}
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{offer.pageType || 'Sales Page'}</span>
                                        {offer.abEnabled && <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest flex items-center gap-1"><Zap size={10} fill="currentColor" /> Split Test</span>}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{offer.name}</h3>
                                    <Link href={`/offers/${offer.slug}`} target="_blank" className="text-xs text-slate-400 font-bold flex items-center gap-1 hover:text-blue-500 transition-colors mt-1">
                                        /offers/{offer.slug} <ArrowUpRight size={12} />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 font-bold">
                                    <div className="space-y-1">
                                        <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Views</span>
                                        <div className="flex items-center gap-2">
                                            <Eye size={14} className="text-slate-400" />
                                            <span className="text-sm font-black text-slate-700">{offer.views?.toLocaleString() || 0}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Growth</span>
                                        <div className="flex items-center gap-2">
                                            <BarChart3 size={14} className="text-green-500" />
                                            <span className="text-sm font-black text-green-600">
                                                {offer.views > 0 ? ((offer.clicks / offer.views) * 100).toFixed(1) : '0.0'}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Price</span>
                                        <span className="text-lg font-black text-slate-900">${offer.price || '0'}</span>
                                    </div>
                                    <Link href={`/admin/offers/${offer._id}`}>
                                        <Button size="sm" className="rounded-xl gap-2 h-10 px-6 font-black bg-slate-900 hover:bg-black text-xs uppercase tracking-widest">
                                            <Edit size={14} /> Open Builder
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
