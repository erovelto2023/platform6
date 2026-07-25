"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, LayoutTemplate, Globe, EyeOff, MoreVertical, Trash2, ExternalLink, Pencil, Copy, Search, Lock, Code, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { deletePage, duplicatePage } from "@/lib/actions/page-builder.actions";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PuckPageListClient({ pages }: { pages: any[] }) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
    const [typeFilter, setTypeFilter] = useState<"all" | "visual" | "html">("all");

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this page?")) return;
        setIsDeleting(id);
        try {
            await deletePage(id);
            toast.success("Page deleted successfully");
        } catch (error) {
            toast.error("Failed to delete page");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleDuplicate = async (id: string) => {
        const loadingToast = toast.loading("Duplicating page...");
        try {
            const res = await duplicatePage(id);
            if (res.success) {
                toast.success("Page duplicated successfully", { id: loadingToast });
            } else {
                toast.error(res.error || "Failed to duplicate page", { id: loadingToast });
            }
        } catch (error) {
            toast.error("Failed to duplicate page", { id: loadingToast });
        }
    };

    const filteredPages = pages.filter(page => {
        const matchesSearch = 
            page.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            page.slug.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = 
            statusFilter === "all" || 
            (statusFilter === "published" && page.isPublished) || 
            (statusFilter === "draft" && !page.isPublished);

        const firstSectionTemplate = page.sections?.[0]?.templateId;
        const matchesType = 
            typeFilter === "all" || 
            (typeFilter === "visual" && firstSectionTemplate === "puck-blocks") || 
            (typeFilter === "html" && firstSectionTemplate !== "puck-blocks");

        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-100 flex items-center gap-3">
                        <LayoutTemplate className="w-8 h-8 text-cyan-400" />
                        Puck Page Builder
                    </h1>
                    <p className="text-slate-400 font-mono text-xs mt-1">Design beautiful landing pages instantly with visual React blocks.</p>
                </div>
                <Link href="/admin/page-builder-simple/create">
                    <Button className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-extrabold px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 border-0 cursor-pointer">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Page
                    </Button>
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900 p-4 rounded-3xl border border-slate-800 shadow-xl">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search pages by name or slug..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 w-full text-xs font-mono border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-950 text-slate-100 placeholder:text-slate-500 transition-colors"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    {/* Status Tabs */}
                    <div className="flex bg-slate-950 rounded-2xl p-1 border border-slate-800">
                        {(["all", "published", "draft"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusFilter(tab)}
                                className={`text-xs px-3.5 py-1.5 font-bold rounded-xl capitalize transition-all ${statusFilter === tab ? "bg-cyan-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Type Filter Select */}
                    <select
                        value={typeFilter}
                        onChange={(e: any) => setTypeFilter(e.target.value)}
                        className="text-xs bg-slate-950 border border-slate-800 text-slate-100 rounded-2xl px-3 py-2 focus:outline-none focus:border-cyan-500 font-mono font-bold"
                    >
                        <option value="all">📁 All Formats</option>
                        <option value="visual">🎨 Visual Editor</option>
                        <option value="html">💻 Pure HTML</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPages.map(page => {
                    const firstSectionTemplate = page.sections?.[0]?.templateId;
                    const isHtmlPage = firstSectionTemplate !== "puck-blocks";
                    
                    return (
                        <Card key={page._id} className="flex flex-col overflow-hidden hover:shadow-2xl hover:border-cyan-500/80 transition-all group bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
                            <div className="p-6 flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <h3 className="font-black text-lg text-slate-100 group-hover:text-cyan-300 transition-colors">
                                            {page.name}
                                        </h3>
                                        <div className="flex items-center">
                                            <span className="text-xs font-mono bg-slate-950 border border-slate-800 text-cyan-400 px-2.5 py-1 rounded-xl">/p/{page.slug}</span>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 bg-slate-900 border border-slate-800 text-slate-100 font-sans shadow-2xl rounded-2xl p-1.5">
                                            <DropdownMenuItem asChild className="hover:bg-slate-800 text-slate-200 focus:text-white cursor-pointer rounded-xl font-bold">
                                                <Link href={`/admin/page-builder-simple/${page._id}`}>
                                                    <Pencil className="w-4 h-4 mr-2 text-cyan-400" /> Edit Page
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="hover:bg-slate-800 text-slate-200 focus:text-white cursor-pointer rounded-xl font-bold">
                                                <a href={`/p/${page.slug}`} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="w-4 h-4 mr-2 text-emerald-400" /> View Live
                                                </a>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDuplicate(page._id)} className="hover:bg-slate-800 text-slate-200 focus:text-white cursor-pointer rounded-xl font-bold">
                                                <Copy className="w-4 h-4 mr-2 text-purple-400" /> Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                className="text-rose-400 hover:bg-rose-950 focus:text-rose-300 cursor-pointer rounded-xl font-bold"
                                                onClick={() => handleDelete(page._id)}
                                                disabled={isDeleting === page._id}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" /> 
                                                {isDeleting === page._id ? 'Deleting...' : 'Delete'}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Metadata Badges */}
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {isHtmlPage ? (
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold bg-slate-950 text-emerald-300 px-2.5 py-1 rounded-xl border border-emerald-900/60">
                                            <Code className="w-3 h-3 text-emerald-400" /> HTML Code
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold bg-slate-950 text-sky-300 px-2.5 py-1 rounded-xl border border-sky-900/60">
                                            <FileText className="w-3 h-3 text-sky-400" /> Puck Visual
                                        </span>
                                    )}

                                    {page.accessControl && (
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl border ${
                                            page.accessControl === "admin" 
                                                ? "bg-slate-950 text-rose-300 border-rose-900/60" 
                                                : page.accessControl === "student" 
                                                    ? "bg-slate-950 text-indigo-300 border-indigo-900/60" 
                                                    : "bg-slate-950 text-emerald-300 border-emerald-900/60"
                                        }`}>
                                            <Lock className="w-3 h-3 opacity-80" /> 
                                            {page.accessControl === "admin" 
                                                ? "Admin Only" 
                                                : page.accessControl === "student" 
                                                    ? "Student Only" 
                                                    : "Public"}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                                <div className="flex items-center gap-2">
                                    {page.isPublished ? (
                                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                            <Globe className="w-3.5 h-3.5" /> Published
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                                            <EyeOff className="w-3.5 h-3.5" /> Draft
                                        </span>
                                    )}
                                </div>
                                <span>{page.updatedAt ? formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true }) : 'Unknown'}</span>
                            </div>
                        </Card>
                    );
                })}
            </div>
            
            {filteredPages.length === 0 && (
                <div className="text-center py-20 bg-slate-900 border border-slate-800 border-dashed rounded-3xl p-8">
                    <LayoutTemplate className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-slate-100 mb-1">No pages match your filter</h3>
                    <p className="text-slate-400 text-xs font-mono mb-6">Try clearing your search term or selecting another filter category.</p>
                    <Button onClick={() => { setSearchTerm(""); setStatusFilter("all"); setTypeFilter("all"); }} className="bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold rounded-2xl">
                        Reset Filters
                    </Button>
                </div>
            )}
        </div>
    );
}
