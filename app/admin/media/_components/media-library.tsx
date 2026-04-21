"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Trash2, CheckCircle2, MoreVertical, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { removeResource } from "@/lib/actions/media.actions";
import { motion, AnimatePresence } from "framer-motion";

interface MediaLibraryProps {
    resources: any[];
    onRefresh: () => void;
}

export const MediaLibrary = ({ resources, onRefresh }: MediaLibraryProps) => {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const onCopy = (url: string) => {
        const fullUrl = `${window.location.origin}${url}`;
        navigator.clipboard.writeText(fullUrl);
        toast.success("URL copied to clipboard", {
            style: {
                background: "#111622",
                color: "#fff",
                border: "1px solid #1e293b",
            },
        });
    };

    const onDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this asset?")) return;
        
        setDeletingId(id);
        const result = await removeResource(id);
        if (result.success) {
            toast.success("Asset deleted successfully");
            onRefresh();
        } else {
            toast.error(result.error || "Failed to delete asset");
        }
        setDeletingId(null);
    };

    if (resources.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-[#111622] rounded-[32px] border-2 border-dashed border-slate-800">
                <div className="p-6 bg-slate-900 rounded-full mb-6">
                    <ImageIcon className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No images found</h3>
                <p className="text-slate-500">Upload your first image to get started</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <AnimatePresence>
                {resources.map((item, index) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative bg-[#111622] rounded-[24px] overflow-hidden border border-slate-800 hover:border-[#6366F1]/50 transition-all shadow-xl"
                    >
                        {/* Image Preview */}
                        <div className="aspect-square relative overflow-hidden bg-black/20">
                            <Image
                                src={item.url}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            
                            {/* Status Badge */}
                            <div className="absolute top-4 left-4">
                                <div className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1 uppercase tracking-wider">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Published
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <Button
                                    size="icon"
                                    onClick={() => onCopy(item.url)}
                                    className="bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    asChild
                                    className="bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10"
                                >
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button
                                    size="icon"
                                    onClick={() => onDelete(item._id)}
                                    disabled={deletingId === item._id}
                                    className="bg-rose-500/80 hover:bg-rose-500 text-white rounded-full backdrop-blur-md border border-rose-500/20"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-4">
                            <h4 className="font-bold text-white truncate text-sm mb-1">{item.title}</h4>
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                    {item.category}
                                </p>
                                <p className="text-[10px] text-slate-600">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

// Helper for empty state icon
const ImageIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
);
