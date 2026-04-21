"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
    Upload, 
    File as FileIcon, 
    X, 
    CheckCircle2, 
    Loader2,
    Shield,
    Tag,
    ChevronDown
} from "lucide-react";
import { uploadMedia } from "@/lib/actions/media.actions";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CATEGORIES = [
    "General",
    "Course Content",
    "Lead Magnets",
    "Graphics",
    "Documents",
    "Workshop Assets",
    "Bonus Materials"
];

export const UploadModal = ({ isOpen, onClose, onSuccess }: UploadModalProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [category, setCategory] = useState("General");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
    });

    const handleUpload = async () => {
        if (files.length === 0) return;

        setIsUploading(true);
        let successCount = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", file.name);
            formData.append("category", category);

            const result = await uploadMedia(formData);
            if (result.success) {
                successCount++;
            } else {
                toast.error(`Failed to upload ${file.name}: ${result.error}`);
            }
            setUploadProgress(((i + 1) / files.length) * 100);
        }

        if (successCount > 0) {
            toast.success(`Successfully uploaded ${successCount} asset(s) to ${category}`);
            onSuccess();
            onClose();
            setFiles([]);
            setCategory("General");
        }
        setIsUploading(false);
        setUploadProgress(0);
    };

    return (
        <Dialog open={isOpen} onOpenChange={isUploading ? undefined : onClose}>
            <DialogContent className="bg-[#0A0D14] border-slate-800 text-white sm:max-w-[650px] p-0 overflow-hidden rounded-[32px] shadow-2xl shadow-indigo-500/10">
                <div className="p-8 space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold uppercase tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-[#6366F1]/10 rounded-xl">
                                <Upload className="h-6 w-6 text-[#6366F1]" />
                            </div>
                            Upload Assets
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-base">
                            Select images or files to add to your media center. Files up to 100MB are supported.
                        </DialogDescription>
                    </DialogHeader>

                    {!isUploading ? (
                        <div className="space-y-6">
                            {/* Category Selector */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1 flex items-center gap-2">
                                    <Tag className="h-3 w-3" />
                                    Target Category
                                </label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="w-full bg-[#111622] border-slate-800 h-14 rounded-2xl focus:ring-[#6366F1]/20">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#111622] border-slate-800 text-white rounded-2xl">
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat} className="focus:bg-[#6366F1] focus:text-white rounded-xl cursor-pointer py-3">
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div 
                                {...getRootProps()} 
                                className={`
                                    border-2 border-dashed rounded-[32px] p-12 transition-all cursor-pointer
                                    flex flex-col items-center justify-center gap-4
                                    ${isDragActive ? "border-[#6366F1] bg-[#6366F1]/10" : "border-slate-800 hover:border-slate-700 bg-[#111622]"}
                                `}
                            >
                                <input {...getInputProps()} />
                                <div className="p-5 bg-slate-900 rounded-2xl shadow-inner">
                                    <Upload className={`h-10 w-10 ${isDragActive ? "text-[#6366F1]" : "text-slate-600"}`} />
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-white">
                                        {isDragActive ? "Drop files here" : "Drag & drop files here"}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">or click to browse your computer</p>
                                </div>
                            </div>

                            {files.length > 0 && (
                                <div className="bg-[#111622] border border-slate-800 rounded-[24px] p-4 max-h-[250px] overflow-y-auto space-y-2 custom-scrollbar">
                                    <AnimatePresence>
                                        {files.map((file, idx) => (
                                            <motion.div 
                                                key={idx}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50"
                                            >
                                                <div className="flex items-center gap-4 overflow-hidden">
                                                    <div className="p-2 bg-slate-800 rounded-lg shrink-0">
                                                        <FileIcon className="h-4 w-4 text-[#6366F1]" />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm font-bold truncate text-white">{file.name}</p>
                                                        <p className="text-[10px] text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFiles(files.filter((_, i) => i !== idx));
                                                    }}
                                                    className="p-2 hover:bg-rose-500/10 rounded-xl text-slate-500 hover:text-rose-500 transition-colors"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}

                            <div className="flex items-center gap-3 text-slate-500 bg-[#6366F1]/5 p-5 rounded-[24px] border border-[#6366F1]/10">
                                <Shield className="h-5 w-5 text-[#6366F1]" />
                                <p className="text-xs leading-relaxed">
                                    Assets will be stored in your <span className="text-white font-bold">private VPS directory</span> with secure public access enabled via unique identifiers.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <Button 
                                    variant="ghost" 
                                    onClick={onClose}
                                    className="flex-1 rounded-2xl border border-slate-800 hover:bg-slate-800 text-slate-400 h-14 font-bold"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleUpload}
                                    disabled={files.length === 0}
                                    className="flex-[1.5] bg-[#6366F1] hover:bg-[#5850EC] text-white rounded-2xl h-14 font-black uppercase tracking-[0.1em] shadow-xl shadow-[#6366F1]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Initialize Upload
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 space-y-10 flex flex-col items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#6366F1] blur-[60px] opacity-30 animate-pulse"></div>
                                <div className="relative z-10 p-8 bg-slate-900 rounded-full border border-slate-800 shadow-2xl">
                                    <Loader2 className="h-16 w-16 text-[#6366F1] animate-spin" />
                                </div>
                            </div>
                            <div className="text-center space-y-3">
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Processing Warp Stream</h3>
                                <p className="text-slate-500 font-medium">Your assets are being digitized and stored in the secure vault.</p>
                            </div>
                            <div className="w-full max-w-md px-4 space-y-4">
                                <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden border border-slate-800 shadow-inner p-1">
                                    <motion.div 
                                        className="bg-[#6366F1] h-full rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency: 99.9%</p>
                                    <p className="text-[10px] font-black text-[#6366F1] uppercase tracking-[0.2em]">{Math.round(uploadProgress)}% STABLE</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
