"use client";

import { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { ExternalLink, updateLink } from '@/lib/actions/link-checker.actions';
import { Search, ExternalLink as ExternalLinkIcon, Edit2, Check, X, Shield, Layout, BookOpen, Link as LinkIcon, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LinkCheckerProps {
    initialLinks: ExternalLink[];
}

export default function LinkChecker({ initialLinks }: LinkCheckerProps) {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [sourceFilter, setSourceFilter] = useState<string>('all');
    const [editingLink, setEditingLink] = useState<string | null>(null); // field + id key
    const [editValue, setEditValue] = useState('');
    const [isPending, startTransition] = useTransition();

    const filteredLinks = useMemo(() => {
        return initialLinks.filter(link => {
            const matchesSearch = 
                link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                link.sourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                link.label.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesSource = sourceFilter === 'all' || link.sourceType === sourceFilter;
            
            return matchesSearch && matchesSource;
        });
    }, [initialLinks, searchTerm, sourceFilter]);

    const handleEditStart = (link: ExternalLink) => {
        setEditingLink(`${link.id}-${link.field}`);
        setEditValue(link.url);
    };

    const handleEditCancel = () => {
        setEditingLink(null);
        setEditValue('');
    };

    const handleUpdate = (link: ExternalLink) => {
        if (editValue === link.url) {
            handleEditCancel();
            return;
        }

        startTransition(async () => {
            const res = await updateLink(link, editValue);
            if (res.success) {
                toast({
                    title: "Success",
                    description: "Link updated successfully",
                });
                // In a real app, you might want to update the local state or revalidate
                // Since this is a server action with revalidatePath, the page should refresh
                // But for better UX we can just reload if needed or let the server handle it
                window.location.reload();
            } else {
                toast({
                    title: "Error",
                    description: res.error || "Failed to update link",
                    variant: "destructive",
                });
            }
            setEditingLink(null);
        });
    };

    const sourceTypes = ['Glossary', 'NicheBox', 'Resource', 'Affiliate'];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-end justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex-1 w-full space-y-4">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">
                        External <span className="text-indigo-600">Link Checker</span>
                    </h1>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by URL, Name or field..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value)}
                            className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold uppercase text-xs tracking-widest"
                        >
                            <option value="all">ALL SOURCES</option>
                            {sourceTypes.map(type => (
                                <option key={type} value={type}>{type.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Links Found</p>
                    <p className="text-4xl font-black text-indigo-600">{filteredLinks.length}</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Source / Label</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">URL</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLinks.map((link) => {
                                const isEditing = editingLink === `${link.id}-${link.field}`;
                                
                                return (
                                    <tr key={`${link.id}-${link.field}`} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl ${
                                                    link.sourceType === 'Glossary' ? 'bg-amber-50 text-amber-600' :
                                                    link.sourceType === 'NicheBox' ? 'bg-indigo-50 text-indigo-600' :
                                                    link.sourceType === 'Resource' ? 'bg-emerald-50 text-emerald-600' :
                                                    'bg-rose-50 text-rose-600'
                                                }`}>
                                                    {link.sourceType === 'Glossary' && <BookOpen size={16} />}
                                                    {link.sourceType === 'NicheBox' && <Layout size={16} />}
                                                    {link.sourceType === 'Resource' && <Shield size={16} />}
                                                    {link.sourceType === 'Affiliate' && <LinkIcon size={16} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 line-clamp-1">{link.sourceName}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{link.label} • {link.sourceType}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        className="flex-1 px-3 py-2 bg-white border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => handleUpdate(link)}
                                                        disabled={isPending}
                                                        className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                                                    >
                                                        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={handleEditCancel}
                                                        disabled={isPending}
                                                        className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 max-w-xl">
                                                    <p className="text-xs font-mono text-slate-500 truncate hover:text-indigo-600 cursor-pointer transition-colors" title={link.url}>
                                                        {link.url}
                                                    </p>
                                                    <button
                                                        onClick={() => handleEditStart(link)}
                                                        className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={link.url}
                                                    target="_blank"
                                                    className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all flex items-center gap-2"
                                                >
                                                    Visit <ExternalLinkIcon size={12} />
                                                </Link>
                                                <Link
                                                    href={link.adminLink}
                                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all"
                                                >
                                                    Source
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredLinks.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-4 bg-slate-50 rounded-full">
                                                <Search size={32} className="text-slate-200" />
                                            </div>
                                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No links found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
