"use client";

import { useState } from "react";
import { 
    LayoutGrid, 
    HardDrive, 
    Plus, 
    Settings, 
    Activity,
    ShieldCheck
} from "lucide-react";
import MediaLibrary from "./_components/MediaLibrary";
import AssetWarehouse from "./_components/AssetWarehouse";
import { UploadModal } from "./_components/upload-modal";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function MediaCenterPage() {
    const [activeTab, setActiveTab] = useState<"library" | "warehouse">("library");
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0A0D14] text-white p-6 lg:p-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1 bg-[#6366F1] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                        <h1 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">
                            Media <span className="text-[#6366F1]">Command</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] ml-4">
                        Secure Asset Management System v2.0
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-4 mr-4 px-6 py-3 bg-[#111622] rounded-2xl border border-slate-800">
                        <div className="flex flex-col items-end">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Server Status</p>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide mt-1">Operational</p>
                        </div>
                        <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
                    </div>
                    
                    <Button 
                        onClick={() => setIsUploadOpen(true)}
                        className="bg-[#6366F1] hover:bg-[#5850EC] text-white rounded-2xl px-8 h-14 font-black uppercase tracking-widest shadow-2xl shadow-[#6366F1]/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Upload Files
                    </Button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
                <button 
                    onClick={() => setActiveTab("library")}
                    className={`
                        relative flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all
                        ${activeTab === "library" ? "bg-[#6366F1] text-white shadow-xl shadow-[#6366F1]/20" : "bg-[#111622] text-slate-500 hover:text-white border border-slate-800"}
                    `}
                >
                    <LayoutGrid className="h-4 w-4" />
                    Image Gallery
                    {activeTab === "library" && (
                        <motion.div layoutId="tab-indicator" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#6366F1] rounded-full" />
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab("warehouse")}
                    className={`
                        relative flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all
                        ${activeTab === "warehouse" ? "bg-[#6366F1] text-white shadow-xl shadow-[#6366F1]/20" : "bg-[#111622] text-slate-500 hover:text-white border border-slate-800"}
                    `}
                >
                    <HardDrive className="h-4 w-4" />
                    Digital Warehouse
                    {activeTab === "warehouse" && (
                        <motion.div layoutId="tab-indicator" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#6366F1] rounded-full" />
                    )}
                </button>
                
                <div className="ml-auto flex items-center gap-6 pr-4">
                    <div className="flex flex-col items-end">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Storage Policy</p>
                        <div className="flex items-center gap-2 mt-1">
                            <ShieldCheck className="h-3 w-3 text-[#6366F1]" />
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Local Encrypted</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === "library" ? (
                        <MediaLibrary />
                    ) : (
                        <AssetWarehouse />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Modals */}
            <UploadModal 
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onSuccess={() => {
                    // Logic to refresh components is handled by their internal useEffect on focus/refresh
                }}
            />
        </div>
    );
}
