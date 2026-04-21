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

export default function AssetWarehouse() {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchAssets = useCallback(async () => {
        setLoading(true);
        const result = await getResources({ 
            query: search, 
            type: "file" // This includes 'file', 'pdf'
        });
        if (result.success) {
            // Filter out 'image' if the server action returns them (it shouldn't if we passed type='file')
            // Actually our server action handles 'type' filter correctly.
            setAssets(result.data);
        }
        setLoading(false);
    }, [search]);

    useEffect(() => {
        const timer = setTimeout(() => fetchAssets(), 300);
        return () => clearTimeout(timer);
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
        await incrementDownload(id);
        window.open(url, "_blank");
        fetchAssets(); // Refresh download count
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
                        placeholder="Search warehouse by title or filename..."
                        className="w-full bg-[#111622] border border-slate-800 rounded-[24px] pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] outline-none transition-all text-white shadow-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="bg-[#111622] rounded-[24px] border border-slate-800 p-4 flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#6366F1]/10 rounded-xl">
                            <HardDrive className="h-5 w-5 text-[#6366F1]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Vault Total</p>
                            <p className="text-xl font-bold text-white tracking-tight leading-none">{assets.length}</p>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        onClick={() => fetchAssets()}
                        className="p-2 h-auto rounded-xl hover:bg-slate-800"
                    >
                        <RefreshCw className={`h-5 w-5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Assets Table */}
            <div className="bg-[#111622] border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/30">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Fingerprint</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Payload Data</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Interactions</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Access</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-slate-800 rounded-2xl"></div>
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-slate-800 rounded w-48"></div>
                                                    <div className="h-3 bg-slate-800/50 rounded w-32"></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : assets.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <Package className="h-20 w-20 text-slate-800 mb-6" />
                                            <p className="text-2xl font-bold text-slate-500 tracking-tight">Warehouse Vacuum Detected</p>
                                            <p className="text-sm text-slate-600 mt-2">The secure vault is currently empty.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                assets.map((asset) => (
                                    <tr key={asset._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-5">
                                                <div className="p-4 bg-[#0A0D14] rounded-2xl border border-slate-800 group-hover:border-[#6366F1]/30 transition-all shadow-inner">
                                                    {getFileIcon(asset.mimeType)}
                                                </div>
                                                <div className="overflow-hidden max-w-[300px]">
                                                    <h4 className="font-bold text-white text-sm leading-tight flex items-center gap-2 truncate">
                                                        {asset.title}
                                                        {asset.type === 'pdf' && (
                                                            <span className="px-2 py-0.5 bg-rose-500/10 text-[9px] font-black uppercase text-rose-500 rounded-md border border-rose-500/20">
                                                                PDF
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <p className="text-[10px] text-slate-500 font-medium mt-1 truncate font-mono">
                                                        {asset.storedFilename}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs font-bold text-slate-300">
                                                        {formatSize(asset.fileSizeBytes)}
                                                    </p>
                                                    <div className="h-1 w-1 rounded-full bg-slate-700" />
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                                        {asset.mimeType?.split('/')[1] || 'BIN'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Shield className="h-3 w-3" />
                                                    <p className="text-[9px] font-black uppercase tracking-widest">Secure Hostinger Storage</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="text-xl font-black text-[#6366F1] leading-none">{asset.downloadCount || 0}</span>
                                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Downloads</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button 
                                                    onClick={() => handleCopy(asset.url, asset._id)}
                                                    className={`p-3 rounded-2xl border border-slate-800 transition-all hover:scale-105 active:scale-95 ${copiedId === asset._id ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-[#0A0D14] text-slate-400 hover:text-white hover:border-[#6366F1]'}`}
                                                    title="Copy Download URL"
                                                >
                                                    {copiedId === asset._id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                </button>
                                                <button 
                                                    onClick={() => handleDownload(asset._id, asset.url)}
                                                    className="p-3 bg-[#6366F1] text-white rounded-2xl hover:bg-[#5850EC] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#6366F1]/20"
                                                    title="Download Asset"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(asset._id)}
                                                    className="p-3 bg-white/5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 rounded-2xl border border-slate-800 hover:border-rose-500/30 transition-all hover:scale-105 active:scale-95"
                                                    title="Purge Asset"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-4 p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-[32px]">
                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                    <Shield className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                    <h5 className="font-bold text-indigo-200 uppercase tracking-widest text-xs">Digital Asset Encryption Protocol</h5>
                    <p className="text-indigo-400/60 text-xs mt-1 leading-relaxed">
                        All files in the warehouse are stored using unique server-generated keys. Hot-linking is restricted to authorized domains, and download metrics are tracked in real-time to prevent unauthorized distribution.
                    </p>
                </div>
            </div>
        </div>
    );
}
