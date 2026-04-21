"use client";

import { useState } from "react";
import { 
    FileText, 
    File as FileIcon, 
    Download, 
    Trash2, 
    Copy, 
    MoreHorizontal,
    FileCode,
    FileArchive,
    ShieldCheck,
    CheckCircle2,
    HardDrive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { removeResource } from "@/lib/actions/media.actions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface DigitalWarehouseProps {
    resources: any[];
    onRefresh: () => void;
}

const getFileIcon = (type: string, url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    if (type === 'pdf' || ext === 'pdf') return <FileText className="h-6 w-6 text-rose-500" />;
    if (['zip', 'rar', '7z'].includes(ext || '')) return <FileArchive className="h-6 w-6 text-amber-500" />;
    if (['csv', 'xlsx', 'xls'].includes(ext || '')) return <FileIcon className="h-6 w-6 text-emerald-500" />;
    if (['json', 'html', 'js'].includes(ext || '')) return <FileCode className="h-6 w-6 text-blue-500" />;
    return <FileIcon className="h-6 w-6 text-slate-500" />;
};

export const DigitalWarehouse = ({ resources, onRefresh }: DigitalWarehouseProps) => {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const onCopy = (url: string) => {
        const fullUrl = `${window.location.origin}${url}`;
        navigator.clipboard.writeText(fullUrl);
        toast.success("URL copied to clipboard", {
            style: { background: "#111622", color: "#fff", border: "1px solid #1e293b" },
        });
    };

    const onDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this asset?")) return;
        setDeletingId(id);
        const result = await removeResource(id);
        if (result.success) {
            toast.success("Asset removed from warehouse");
            onRefresh();
        } else {
            toast.error(result.error || "Deletion failed");
        }
        setDeletingId(null);
    };

    if (resources.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-[#111622] rounded-[32px] border-2 border-dashed border-slate-800">
                <div className="p-6 bg-slate-900 rounded-full mb-6">
                    <HardDrive className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Warehouse is empty</h3>
                <p className="text-slate-500">Upload your first digital product to get started</p>
            </div>
        );
    }

    return (
        <div className="bg-[#111622] rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-800 bg-black/20">
                            <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-slate-500">Asset Details</th>
                            <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-slate-500">File Info</th>
                            <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-slate-500">Status</th>
                            <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {resources.map((item) => (
                            <motion.tr 
                                key={item._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="group hover:bg-[#6366F1]/5 transition-colors"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-slate-900 rounded-2xl group-hover:bg-[#6366F1]/10 transition-colors">
                                            {getFileIcon(item.type, item.url)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-base group-hover:text-[#6366F1] transition-colors">{item.title}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-400 font-mono truncate max-w-[200px]">{item.url.split('/').pop()}</p>
                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                                            Added {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1 rounded-full border border-emerald-400/20">
                                        <ShieldCheck className="h-3 w-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Encrypted</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onCopy(item.url)}
                                            className="text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                            className="text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl"
                                        >
                                            <a href={item.url} download>
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-[#111622] border-slate-800 text-white">
                                                <DropdownMenuItem 
                                                    onClick={() => onDelete(item._id)}
                                                    className="text-rose-500 focus:text-rose-400 focus:bg-rose-500/10 cursor-pointer"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Asset
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
