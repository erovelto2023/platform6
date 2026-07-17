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
        <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <LayoutTemplate className="w-8 h-8 text-sky-500" />
                        Puck Page Builder
                    </h1>
                    <p className="text-slate-500 mt-1">Design beautiful landing pages instantly.</p>
                </div>
                <Link href="/admin/page-builder-simple/create">
                    <Button className="bg-sky-500 hover:bg-sky-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Page
                    </Button>
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search pages by name or slug..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 w-full text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-slate-50 focus:bg-white transition-colors"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    {/* Status Tabs */}
                    <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                        {(["all", "published", "draft"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusFilter(tab)}
                                className={`text-xs px-3 py-1.5 font-semibold rounded-md capitalize transition-all ${statusFilter === tab ? "bg-white text-sky-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Type Filter Select */}
                    <select
                        value={typeFilter}
                        onChange={(e: any) => setTypeFilter(e.target.value)}
                        className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 font-semibold text-slate-650"
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
                        <Card key={page._id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow group bg-white border border-slate-200">
                            <div className="p-5 flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1.5">
                                        <h3 className="font-semibold text-lg text-slate-900 group-hover:text-sky-600 transition-colors">
                                            {page.name}
                                        </h3>
                                        <div className="flex items-center text-xs text-slate-500 font-mono">
                                            <span>/p/{page.slug}</span>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 bg-white">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/page-builder-simple/${page._id}`}>
                                                    <Pencil className="w-4 h-4 mr-2" /> Edit Page
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <a href={`/p/${page.slug}`} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="w-4 h-4 mr-2" /> View Live
                                                </a>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDuplicate(page._id)}>
                                                <Copy className="w-4 h-4 mr-2" /> Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                className="text-red-600 focus:bg-red-50"
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
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-slate-900 text-slate-100 px-2.5 py-1 rounded-md border border-slate-805">
                                            <Code className="w-3 h-3 text-emerald-450" /> HTML Code
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-sky-50 text-sky-700 px-2.5 py-1 rounded-md border border-sky-100">
                                            <FileText className="w-3 h-3 text-sky-500" /> Puck Visual
                                        </span>
                                    )}

                                    {page.accessControl && (
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                                            page.accessControl === "admin" 
                                                ? "bg-red-50 text-red-700 border-red-105" 
                                                : page.accessControl === "student" 
                                                    ? "bg-indigo-50 text-indigo-700 border-indigo-105" 
                                                    : "bg-emerald-50 text-emerald-700 border-emerald-105"
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
                            <div className="px-5 py-3 bg-slate-50 border-t flex items-center justify-between text-xs text-slate-505">
                                <div className="flex items-center gap-2">
                                    {page.isPublished ? (
                                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                            <Globe className="w-3.5 h-3.5" /> Published
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-amber-600 font-medium">
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
                <div className="text-center py-20 bg-white border border-slate-205 border-dashed rounded-xl">
                    <LayoutTemplate className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">No pages match your filter</h3>
                    <p className="text-slate-500 mb-6">Try clearing your search term or selecting another filter category.</p>
                    <Button onClick={() => { setSearchTerm(""); setStatusFilter("all"); setTypeFilter("all"); }} className="bg-sky-500 hover:bg-sky-600">
                        Reset Filters
                    </Button>
                </div>
            )}
        </div>
    );
}
