"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    Search, 
    Filter, 
    Copy, 
    Check, 
    Pencil, 
    Trash2, 
    Eye, 
    EyeOff, 
    Loader2, 
    Image as ImageIcon,
    ExternalLink,
    X,
    AlertCircle,
    Tag,
    Clock
} from "lucide-react";
import { getResources, updateResource, removeResource } from "@/lib/actions/media.actions";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface MediaLibraryProps {
    onSelect?: (url: string) => void;
    refreshKey?: number;
}

export default function MediaLibrary({ onSelect, refreshKey }: MediaLibraryProps) {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [editingAsset, setEditingAsset] = useState<any | null>(null);
    const [snippetAsset, setSnippetAsset] = useState<any | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    // Edit form state
    const [editTitle, setEditTitle] = useState("");
    const [editAlt, setEditAlt] = useState("");
    const [editTags, setEditTags] = useState("");
    const [editStatus, setEditStatus] = useState("published");
    const [saving, setSaving] = useState(false);

    const fetchAssets = useCallback(async () => {
        setLoading(true);
        const result = await getResources({ 
            query: search, 
            status: statusFilter, 
            category: categoryFilter,
            type: "image" 
        });
        if (result.success) {
            setAssets(result.data);
        }
        setLoading(false);
    }, [search, statusFilter, categoryFilter]);

    useEffect(() => {
        const timer = setTimeout(() => fetchAssets(), 300);
        return () => clearTimeout(timer);
    }, [fetchAssets, refreshKey]);

    useEffect(() => {
        const handleMediaUploaded = () => {
            fetchAssets();
        };
        window.addEventListener("media-uploaded", handleMediaUploaded);
        return () => window.removeEventListener("media-uploaded", handleMediaUploaded);
    }, [fetchAssets]);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(null), 2000);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this asset?")) return;
        const result = await removeResource(id);
        if (result.success) {
            toast.success("Asset deleted successfully");
            fetchAssets();
        } else {
            toast.error("Failed to delete asset");
        }
    };

    const openEdit = (asset: any) => {
        setEditingAsset(asset);
        setEditTitle(asset.title);
        setEditAlt(asset.altText || "");
        setEditTags(asset.tags?.join(", ") || "");
        setEditStatus(asset.status || "published");
    };

    const handleUpdate = async () => {
        if (!editingAsset) return;
        setSaving(true);
        const tagsArray = editTags.split(",").map(t => t.trim()).filter(Boolean);
        const result = await updateResource(editingAsset._id, {
            title: editTitle,
            altText: editAlt,
            tags: tagsArray,
            status: editStatus
        });

        if (result.success) {
            toast.success("Asset updated successfully");
            setEditingAsset(null);
            fetchAssets();
        } else {
            toast.error("Failed to update asset");
        }
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#111622] p-4 rounded-3xl border border-slate-800">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search assets by title, alt text, or tags..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#0A0D14] border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6366F1] transition-all"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Status Filter */}
                    <div className="flex items-center bg-[#0A0D14] p-1 rounded-2xl border border-slate-800 text-[10px] font-mono font-bold uppercase">
                        <button 
                            onClick={() => setStatusFilter("all")}
                            className={`px-3 py-1.5 rounded-xl transition-all ${statusFilter === "all" ? "bg-[#6366F1] text-white" : "text-slate-400 hover:text-white"}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setStatusFilter("published")}
                            className={`px-3 py-1.5 rounded-xl transition-all ${statusFilter === "published" ? "bg-[#6366F1] text-white" : "text-slate-400 hover:text-white"}`}
                        >
                            Published
                        </button>
                        <button 
                            onClick={() => setStatusFilter("draft")}
                            className={`px-3 py-1.5 rounded-xl transition-all ${statusFilter === "draft" ? "bg-[#6366F1] text-white" : "text-slate-400 hover:text-white"}`}
                        >
                            Draft
                        </button>
                    </div>

                    {/* Category Filter */}
                    <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-[#0A0D14] border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-[#6366F1]"
                    >
                        <option value="all">All Categories</option>
                        <option value="General">General</option>
                        <option value="Course Content">Course Content</option>
                        <option value="Lead Magnets">Lead Magnets</option>
                        <option value="Graphics">Graphics</option>
                        <option value="Documents">Documents</option>
                        <option value="Workshop Assets">Workshop Assets</option>
                        <option value="Bonus Materials">Bonus Materials</option>
                    </select>
                </div>
            </div>

            {/* Grid display */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin text-[#6366F1]" />
                    <p className="text-xs font-mono font-bold uppercase tracking-widest">Loading Asset Vault...</p>
                </div>
            ) : assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-[#111622] rounded-3xl border border-slate-800 text-center p-8 space-y-4">
                    <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                        <ImageIcon className="h-10 w-10 text-slate-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white uppercase">No Media Assets Found</h3>
                        <p className="text-xs text-slate-500 font-mono mt-1">Try adjusting your filters or upload new image assets.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {assets.map((asset) => (
                        <motion.div 
                            key={asset._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group bg-[#111622] border border-slate-800 hover:border-[#6366F1] rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl"
                        >
                            <div className="relative aspect-video bg-[#0A0D14] overflow-hidden flex items-center justify-center border-b border-slate-800">
                                <img 
                                    src={asset.url} 
                                    alt={asset.altText || asset.title} 
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
                                    <button 
                                        onClick={() => openEdit(asset)}
                                        className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition"
                                        title="Edit Asset Properties"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button 
                                        onClick={() => setSnippetAsset(asset)}
                                        className="p-1.5 text-slate-300 hover:text-[#6366F1] rounded-xl hover:bg-white/10 transition"
                                        title="View HTML Snippet"
                                    >
                                        <ExternalLink size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(asset._id)}
                                        className="p-1.5 text-slate-300 hover:text-rose-400 rounded-xl hover:bg-white/10 transition"
                                        title="Delete Asset"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-xl text-[9px] font-mono font-bold uppercase border backdrop-blur-md ${asset.status === 'published' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' : 'bg-amber-950/80 text-amber-400 border-amber-800'}`}>
                                    {asset.status || 'published'}
                                </span>
                            </div>

                            <div className="p-5 space-y-4">
                                <div>
                                    <h4 className="font-bold text-sm text-white truncate" title={asset.title}>
                                        {asset.title}
                                    </h4>
                                    <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                                        {asset.category || 'General'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                                    {onSelect ? (
                                        <Button 
                                            onClick={() => onSelect(asset.url)}
                                            className="w-full bg-[#6366F1] hover:bg-[#5850EC] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl h-9"
                                        >
                                            Select Asset
                                        </Button>
                                    ) : (
                                        <Button 
                                            onClick={() => handleCopy(asset.url, asset._id)}
                                            variant="outline"
                                            className="w-full bg-[#0A0D14] border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl h-9 flex items-center justify-center gap-2"
                                        >
                                            {copied === asset._id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-[#6366F1]" />}
                                            {copied === asset._id ? "Copied Link" : "Copy URL"}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Edit Asset Modal */}
            <Dialog open={!!editingAsset} onOpenChange={(open) => !open && setEditingAsset(null)}>
                <DialogContent className="bg-[#0A0D14] border-slate-800 text-white sm:max-w-[500px] p-6 rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold uppercase tracking-tight text-white">Edit Asset Properties</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4 font-mono text-xs">
                        <div>
                            <label className="block text-slate-400 font-bold uppercase mb-1">Title</label>
                            <input 
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full bg-[#111622] border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#6366F1]"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 font-bold uppercase mb-1">Alt Text</label>
                            <input 
                                type="text"
                                value={editAlt}
                                onChange={(e) => setEditAlt(e.target.value)}
                                className="w-full bg-[#111622] border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#6366F1]"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 font-bold uppercase mb-1">Tags (Comma Separated)</label>
                            <input 
                                type="text"
                                value={editTags}
                                onChange={(e) => setEditTags(e.target.value)}
                                className="w-full bg-[#111622] border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#6366F1]"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 font-bold uppercase mb-1">Status</label>
                            <select 
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="w-full bg-[#111622] border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#6366F1]"
                            >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                        <div className="pt-4 flex gap-2">
                            <Button 
                                onClick={handleUpdate}
                                disabled={saving}
                                className="w-full bg-[#6366F1] hover:bg-[#5850EC] text-white font-bold uppercase rounded-xl h-10"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Snippet Modal */}
            <Dialog open={!!snippetAsset} onOpenChange={(open) => !open && setSnippetAsset(null)}>
                <DialogContent className="bg-[#0A0D14] border-slate-800 text-white sm:max-w-[550px] p-6 rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold uppercase tracking-tight text-white">Embed Code Snippet</DialogTitle>
                    </DialogHeader>
                    {snippetAsset && (
                        <div className="space-y-4 pt-4 font-mono text-xs">
                            <div>
                                <label className="block text-slate-400 font-bold uppercase mb-1">HTML Image Tag</label>
                                <div className="bg-[#111622] p-3 rounded-xl border border-slate-800 flex items-center justify-between text-[#6366F1]">
                                    <code className="truncate max-w-[380px]">{`<img src="${snippetAsset.url}" alt="${snippetAsset.altText || snippetAsset.title}" />`}</code>
                                    <button onClick={() => handleCopy(`<img src="${snippetAsset.url}" alt="${snippetAsset.altText || snippetAsset.title}" />`, 'snippet-html')} className="p-1 hover:text-white">
                                        <Copy size={14} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-400 font-bold uppercase mb-1">Direct URL</label>
                                <div className="bg-[#111622] p-3 rounded-xl border border-slate-800 flex items-center justify-between text-slate-300">
                                    <code className="truncate max-w-[380px]">{snippetAsset.url}</code>
                                    <button onClick={() => handleCopy(snippetAsset.url, 'snippet-url')} className="p-1 hover:text-white">
                                        <Copy size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
