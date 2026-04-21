"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Image as ImageIcon, Box } from "lucide-react";
import { UploadModal } from "./upload-modal";
import { useState } from "react";

interface MediaHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onUploadSuccess: () => void;
    stats: {
        total: number;
        images: number;
        files: number;
    };
}

export const MediaHeader = ({ searchQuery, onSearchChange, onUploadSuccess, stats }: MediaHeaderProps) => {
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#6366F1]/10 rounded-lg">
                            <Box className="h-6 w-6 text-[#6366F1]" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white uppercase">Media Center</h1>
                    </div>
                    <p className="text-slate-400 text-sm">Manage and secure your large digital product assets</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-6 bg-[#111622] px-6 py-3 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-3 pr-6 border-r border-slate-800">
                            <ImageIcon className="h-4 w-4 text-emerald-400" />
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Images</p>
                                <p className="text-lg font-bold text-white">{stats.images}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Box className="h-4 w-4 text-[#6366F1]" />
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Total Assets</p>
                                <p className="text-lg font-bold text-white">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <Button 
                        onClick={() => setIsUploadOpen(true)}
                        className="bg-[#6366F1] hover:bg-[#5850EC] text-white rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest shadow-lg shadow-[#6366F1]/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        New Upload
                    </Button>
                </div>
            </div>

            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-[#6366F1] transition-colors" />
                <Input 
                    placeholder="Search by title or filename..." 
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-[#111622] border-slate-800 h-16 pl-14 pr-6 rounded-2xl text-lg text-white placeholder:text-slate-600 focus:border-[#6366F1] focus:ring-[#6366F1]/20 transition-all"
                />
            </div>

            <UploadModal 
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onSuccess={onUploadSuccess}
            />
        </div>
    );
};
