"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    Search, 
    RefreshCw, 
    Download, 
    Trash2, 
    Copy, 
    FileArchive, 
    FileText, 
    FileCode, 
    File as FileIcon,
    HardDrive,
    Package,
    Shield,
    Check,
    Loader2,
    ArrowUpRight
} from "lucide-react";
import { getResources, removeResource, incrementDownload } from "@/lib/actions/media.actions";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface AssetWarehouseProps {
    refreshKey?: number;
}

export default function AssetWarehouse({ refreshKey }: AssetWarehouseProps) {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchAssets = useCallback(async () => {
        setLoading(true);
        const result = await getResources({ 
            query: search, 
            type: "file"
        });
        if (result.success) {
            setAssets(result.data);
        }
        setLoading(false);
    }, [search]);

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

    const handleCopy = (url: string, id: string) => {
        const fullUrl = `${window.location.origin}${url}`;
        navigator.clipboard.writeText(fullUrl);
        setCopiedId(id);
        toast.success("Download link copied");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this asset?")) return;
        const result = await removeResource(id);
        if (result.success) {
            toast.success("Asset removed from vault");
            fetchAssets();
        } else {
            toast.error("Failed to delete asset");
        }
    };

    const handleDownload = async (id: string, url: string) => {
        window.open(`/api/media/download/${id}`, "_blank");
        setTimeout(() => fetchAssets(), 1000);
    };

    const formatSize = (bytes: number) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    const getFileIcon = (mimeType?: string) => {
        if (!mimeType) return <FileIcon className="h-6 w-6 text-slate-400" />;
        if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("archive")) 
            return <FileArchive className="h-6 w-6 text-amber-500" />;
        if (mimeType.includes("pdf")) 
            return <FileText className="h-6 w-6 text-rose-500" />;
        if (mimeType.includes("javascript") || mimeType.includes("json") || mimeType.includes("html")) 
            return <FileCode className="h-6 w-6 text-indigo-500" />;
        return <FileIcon className="h-6 w-6 text-slate-400" />;
    };

    return (
        <div className="space-y-6">
            {/* Stats & Search */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-[#6366F1] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search digital assets, zip archives, PDFs, lead magnets..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#111622] border border-slate-800 rounded-3xl pl-12 pr-4 py-4 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6366F1] transition-all shadow-xl"
                    />
                </div>

                <div className="bg-[#111622] border border-slate-800 rounded-3xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#6366F1]/10 rounded-2xl text-[#6366F1]">
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Vault Files</p>
                            <p className="text-lg font-black text-white font-mono">{assets.length}</p>
                        </div>
                    </div>
                    <Button 
                        onClick={() => fetchAssets()} 
                        variant="ghost" 
                        size="icon"
                        className="text-slate-500 hover:text-white rounded-xl hover:bg-slate-900"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#6366F1]" : ""}`} />
                    </Button>
                </div>
            </div>

            {/* Warehouse Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin text-[#6366F1]" />
                    <p className="text-xs font-mono font-bold uppercase tracking-widest">Querying Digital Warehouse...</p>
                </div>
            ) : assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-[#111622] rounded-3xl border border-slate-800 text-center p-8 space-y-4">
                    <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                        <HardDrive className="h-10 w-10 text-slate-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white uppercase">Digital Warehouse Empty</h3>
                        <p className="text-xs text-slate-500 font-mono mt-1">No downloadable files, PDFs, or archives found matching query.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-[#111622] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-[#0A0D14] border-b border-slate-800/80">
                                <tr>
                                    <th className="px-6 py-4 font-mono font-bold text-slate-400 uppercase tracking-wider">Asset File</th>
                                    <th className="px-6 py-4 font-mono font-bold text-slate-400 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 font-mono font-bold text-slate-400 uppercase tracking-wider">File Size</th>
                                    <th className="px-6 py-4 font-mono font-bold text-slate-400 uppercase tracking-wider text-center">Downloads</th>
                                    <th className="px-6 py-4 font-mono font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/80 bg-[#111622]">
                                {assets.map((asset) => (
                                    <tr key={asset._id} className="hover:bg-[#0A0D14]/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-[#0A0D14] rounded-2xl border border-slate-800 shrink-0">
                                                    {getFileIcon(asset.mimeType)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-white truncate max-w-[280px]" title={asset.title}>
                                                        {asset.title}
                                                    </p>
                                                    <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                                                        {asset.originalName || asset.url}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-[#0A0D14] border border-slate-800 text-[#6366F1] font-mono font-bold text-[10px] uppercase rounded-xl">
                                                {asset.category || "General"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-slate-300 font-bold">
                                            {formatSize(asset.size)}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono">
                                            <span className="px-3 py-1 bg-[#0A0D14] border border-slate-800 text-emerald-400 font-bold text-xs rounded-xl">
                                                {asset.downloadCount || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={() => handleDownload(asset._id, asset.url)}
                                                    className="h-9 bg-[#6366F1] hover:bg-[#5850EC] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl px-3 flex items-center gap-1.5"
                                                >
                                                    <Download size={14} /> Download
                                                </Button>
                                                <Button
                                                    onClick={() => handleCopy(asset.url, asset._id)}
                                                    variant="outline"
                                                    className="h-9 bg-[#0A0D14] border-slate-800 text-slate-400 hover:text-white rounded-xl px-3"
                                                    title="Copy Vault Link"
                                                >
                                                    {copiedId === asset._id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(asset._id)}
                                                    variant="outline"
                                                    className="h-9 bg-[#0A0D14] border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl px-3"
                                                    title="Delete Asset"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
