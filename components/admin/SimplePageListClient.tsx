"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
    Plus, Search, Edit, Trash2, Globe, Eye, 
    ArrowUpRight, FileStack, Layout, Laptop, Smartphone,
    ExternalLink
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { deletePage } from '@/lib/actions/page-builder.actions';

interface SimplePageListClientProps {
    initialPages: any[];
}

export default function SimplePageListClient({ initialPages }: SimplePageListClientProps) {
    const [pages, setPages] = useState(initialPages);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPages = pages.filter(page => 
        page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        const result = await deletePage(id);
        if (result.success) {
            setPages(prev => prev.filter(p => p._id !== id));
            toast.success('Page deleted');
        } else {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search simple pages..." 
                        className="pl-10 rounded-2xl border-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Link href="/admin/page-builder-simple/create">
                    <Button className="rounded-2xl bg-purple-600 hover:bg-purple-700 gap-2 h-11 px-6 shadow-lg shadow-purple-500/20">
                        <Plus size={18} /> New Simple Page
                    </Button>
                </Link>
            </div>

            {filteredPages.length === 0 ? (
                <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-20 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                        <FileStack size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900">No simple pages found</h3>
                        <p className="text-slate-500 font-medium">Create a page by pasting your own HTML code.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPages.map((page) => (
                        <div key={page._id} className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-black">
                                        <Layout size={24} />
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${page.isPublished ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400"}`}>
                                        {page.isPublished ? 'Published' : 'Draft'}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-black text-slate-900 truncate">{page.name}</h3>
                                    <Link href={`/p/${page.slug}`} target="_blank" className="text-xs text-slate-400 font-bold flex items-center gap-1 hover:text-purple-600 transition-colors mt-1">
                                        /p/{page.slug} <ArrowUpRight size={12} />
                                    </Link>
                                </div>

                                <div className="flex items-center gap-2 pt-4">
                                    <Link href={`/admin/page-builder-simple/${page._id}`} className="flex-1">
                                        <Button variant="outline" className="w-full rounded-xl gap-2 font-black text-xs uppercase tracking-widest h-11 border-slate-200">
                                            <Edit size={14} /> Edit HTML
                                        </Button>
                                    </Link>
                                    <Link href={`/p/${page.slug}`} target="_blank">
                                        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-100" title="Visit Page">
                                            <ExternalLink size={16} />
                                        </Button>
                                    </Link>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDelete(page._id)}
                                        className="h-11 w-11 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
