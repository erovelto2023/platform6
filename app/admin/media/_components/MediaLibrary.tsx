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
}

export default function MediaLibrary({ onSelect }: MediaLibraryProps) {
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
        const result = await updateResource(editingAsset._id, {
            title: editTitle,
            altText: editAlt,
            tags: editTags,
            status: editStatus,
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

    const formatSize = (bytes: number) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    const APP_URL = typeof window !== 'undefined' ? window.location.origin : '';

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 bg-[#111622] p-6 rounded-[32px] border border-slate-800 shadow-xl">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-[#6366F1] transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search assets or tags..."
                        className="w-full bg-[#0A0D14] border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] outline-none transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select 
                        className="bg-[#0A0D14] border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 outline-none focus:ring-2 focus:ring-[#6366F1]/20"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                    <Button 
                        onClick={() => fetchAssets()}
                        variant="ghost"
                        className="rounded-2xl border border-slate-800 h-full aspect-square p-0 hover:bg-slate-800"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-4">
                    <Loader2 className="h-12 w-12 text-[#6366F1] animate-spin" />
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Scanning Database</p>
                </div>
            ) : assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-slate-800 rounded-[40px] bg-[#111622]/50">
                    <ImageIcon className="h-16 w-16 text-slate-800 mb-4" />
                    <p className="text-xl font-bold text-slate-500">No images found</p>
                    <p className="text-sm text-slate-600 mt-1">Try adjusting your filters or upload new assets.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    <AnimatePresence>
                        {assets.map((asset) => (
                            <motion.div 
                                key={asset._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative bg-[#111622] border border-slate-800 rounded-[28px] overflow-hidden hover:border-[#6366F1]/50 transition-all shadow-lg hover:shadow-[#6366F1]/5"
                            >
                                {/* Thumbnail */}
                                <div className="aspect-square relative overflow-hidden bg-slate-900/50">
                                    <img 
                                        src={asset.url} 
                                        alt={asset.altText || asset.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    
                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${asset.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                            {asset.status}
                                        </span>
                                        {asset.category !== 'General' && (
                                            <span className="px-2 py-0.5 bg-[#6366F1] text-white rounded-lg text-[8px] font-black uppercase tracking-widest">
                                                {asset.category}
                                            </span>
                                        )}
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                        <button 
                                            onClick={() => setSnippetAsset(asset)}
                                            className="p-3 bg-white/10 hover:bg-[#6366F1] rounded-2xl text-white transition-all hover:scale-110"
                                            title="Embed Code"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={() => openEdit(asset)}
                                            className="p-3 bg-white/10 hover:bg-white text-slate-900 rounded-2xl transition-all hover:scale-110"
                                            title="Edit Metadata"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(asset._id)}
                                            className="p-3 bg-white/10 hover:bg-rose-500 rounded-2xl text-white transition-all hover:scale-110"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4 space-y-1">
                                    <h4 className="text-sm font-bold text-white truncate">{asset.title}</h4>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                            {formatSize(asset.fileSizeBytes)}
                                        </p>
                                        <div className="flex gap-1">
                                            {asset.tags?.slice(0, 2).map((tag: string) => (
                                                <span key={tag} className="text-[8px] text-[#6366F1] font-bold">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Select Button for Overlays */}
                                {onSelect && (
                                    <button 
                                        onClick={() => onSelect(asset.url)}
                                        className="absolute bottom-4 left-4 right-4 py-2 bg-[#6366F1] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Select Asset
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Snippet Modal */}
            <Dialog open={!!snippetAsset} onOpenChange={() => setSnippetAsset(null)}>
                <DialogContent className="bg-[#0A0D14] border-slate-800 text-white sm:max-w-[600px] p-0 overflow-hidden rounded-[32px]">
                    <div className="p-8 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-[#6366F1]/10 rounded-xl">
                                    <ExternalLink className="h-5 w-5 text-[#6366F1]" />
                                </div>
                                Embed Snippets
                            </DialogTitle>
                        </DialogHeader>

                        {snippetAsset && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-[#111622] rounded-2xl border border-slate-800">
                                    <img src={snippetAsset.url} className="h-16 w-16 object-cover rounded-xl" />
                                    <div>
                                        <p className="font-bold text-white">{snippetAsset.title}</p>
                                        <p className="text-xs text-slate-500">{snippetAsset.altText || "No alt text"}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">HTML Image Tag</label>
                                        <div className="relative group">
                                            <pre className="bg-[#0A0D14] p-4 rounded-2xl border border-slate-800 text-[10px] text-emerald-400 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                                {`<img \n  src="${APP_URL}${snippetAsset.url}" \n  alt="${snippetAsset.altText || snippetAsset.title}" \n  loading="lazy" \n/>`}
                                            </pre>
                                            <button 
                                                onClick={() => handleCopy(`<img src="${APP_URL}${snippetAsset.url}" alt="${snippetAsset.altText || snippetAsset.title}" loading="lazy" />`, 'html')}
                                                className="absolute top-3 right-3 p-2 bg-[#6366F1] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                {copied === 'html' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Direct URL</label>
                                        <div className="relative group">
                                            <div className="bg-[#0A0D14] p-4 rounded-2xl border border-slate-800 text-[10px] text-[#6366F1] font-mono truncate pr-12">
                                                {APP_URL}{snippetAsset.url}
                                            </div>
                                            <button 
                                                onClick={() => handleCopy(`${APP_URL}${snippetAsset.url}`, 'url')}
                                                className="absolute top-3 right-3 p-2 bg-[#6366F1] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                {copied === 'url' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <Button 
                                    onClick={() => setSnippetAsset(null)}
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-2xl h-14 font-bold"
                                >
                                    Close Snippet Vault
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={!!editingAsset} onOpenChange={() => setEditingAsset(null)}>
                <DialogContent className="bg-[#0A0D14] border-slate-800 text-white sm:max-w-[500px] p-0 overflow-hidden rounded-[32px]">
                    <div className="p-8 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-[#6366F1]/10 rounded-xl">
                                    <Pencil className="h-5 w-5 text-[#6366F1]" />
                                </div>
                                Edit Metadata
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Asset Title</label>
                                <input 
                                    type="text"
                                    className="w-full bg-[#111622] border border-slate-800 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#6366F1]/20 outline-none"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Alt Text (SEO)</label>
                                <input 
                                    type="text"
                                    className="w-full bg-[#111622] border border-slate-800 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#6366F1]/20 outline-none"
                                    value={editAlt}
                                    onChange={(e) => setEditAlt(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Tags (Comma Separated)</label>
                                <input 
                                    type="text"
                                    className="w-full bg-[#111622] border border-slate-800 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#6366F1]/20 outline-none"
                                    placeholder="marketing, course, banner"
                                    value={editTags}
                                    onChange={(e) => setEditTags(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Visibility Status</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['published', 'draft'].map((s) => (
                                        <button 
                                            key={s}
                                            onClick={() => setEditStatus(s)}
                                            className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${editStatus === s ? 'bg-[#6366F1] border-[#6366F1] text-white' : 'bg-[#111622] border-slate-800 text-slate-500 hover:border-slate-600'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button 
                                    variant="ghost"
                                    onClick={() => setEditingAsset(null)}
                                    className="flex-1 rounded-2xl border border-slate-800 h-14 font-bold"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="flex-[1.5] bg-[#6366F1] hover:bg-[#5850EC] text-white rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl shadow-[#6366F1]/20"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
