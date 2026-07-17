"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, LayoutTemplate, Globe, EyeOff, MoreVertical, Trash2, ExternalLink, Pencil, Copy } from "lucide-react";
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map(page => (
                    <Card key={page._id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="p-5 flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
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
                        </div>
                        <div className="px-5 py-3 bg-slate-50 border-t flex items-center justify-between text-xs text-slate-500">
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
                ))}
            </div>
            {pages.length === 0 && (
                <div className="text-center py-20 bg-white border border-slate-200 border-dashed rounded-xl">
                    <LayoutTemplate className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">No pages created yet</h3>
                    <p className="text-slate-500 mb-6">Create your first landing page using the Puck editor.</p>
                    <Link href="/admin/page-builder-simple/create">
                        <Button className="bg-sky-500 hover:bg-sky-600">
                            Create First Page
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
