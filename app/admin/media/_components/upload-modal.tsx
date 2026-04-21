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
    Shield
} from "lucide-react";
import { uploadMedia } from "@/lib/actions/media.actions";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const UploadModal = ({ isOpen, onClose, onSuccess }: UploadModalProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
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
            formData.append("category", "General");

            const result = await uploadMedia(formData);
            if (result.success) {
                successCount++;
            } else {
                toast.error(`Failed to upload ${file.name}: ${result.error}`);
            }
            setUploadProgress(((i + 1) / files.length) * 100);
        }

        if (successCount > 0) {
            toast.success(`Successfully uploaded ${successCount} asset(s)`);
            onSuccess();
            onClose();
            setFiles([]);
        }
        setIsUploading(false);
        setUploadProgress(0);
    };

    return (
        <Dialog open={isOpen} onOpenChange={isUploading ? undefined : onClose}>
            <DialogContent className="bg-[#0A0D14] border-slate-800 text-white sm:max-w-[600px] p-0 overflow-hidden rounded-[32px]">
                <div className="p-8 space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
                            <Upload className="h-6 w-6 text-[#6366F1]" />
                            Upload Assets
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Select images or files to add to your media center. Files are stored securely on your server.
                        </DialogDescription>
                    </DialogHeader>

                    {!isUploading ? (
                        <div className="space-y-6">
                            <div 
                                {...getRootProps()} 
                                className={`
                                    border-2 border-dashed rounded-[24px] p-12 transition-all cursor-pointer
                                    flex flex-col items-center justify-center gap-4
                                    ${isDragActive ? "border-[#6366F1] bg-[#6366F1]/10" : "border-slate-800 hover:border-slate-700 bg-[#111622]"}
                                `}
                            >
                                <input {...getInputProps()} />
                                <div className="p-4 bg-slate-900 rounded-2xl">
                                    <Upload className={`h-8 w-8 ${isDragActive ? "text-[#6366F1]" : "text-slate-600"}`} />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-white">
                                        {isDragActive ? "Drop files here" : "Drag & drop files here"}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">or click to browse your computer</p>
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 py-1 bg-slate-900 rounded">Images</span>
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 py-1 bg-slate-900 rounded">PDFs</span>
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 py-1 bg-slate-900 rounded">Archives</span>
                                </div>
                            </div>

                            {files.length > 0 && (
                                <div className="bg-[#111622] border border-slate-800 rounded-2xl p-4 max-h-[200px] overflow-y-auto space-y-2">
                                    <AnimatePresence>
                                        {files.map((file, idx) => (
                                            <motion.div 
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center justify-between p-3 bg-slate-900 rounded-xl"
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <FileIcon className="h-4 w-4 text-[#6366F1] shrink-0" />
                                                    <span className="text-sm font-medium truncate">{file.name}</span>
                                                    <span className="text-[10px] text-slate-500 shrink-0">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                </div>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFiles(files.filter((_, i) => i !== idx));
                                                    }}
                                                    className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-slate-500 bg-[#111622] p-4 rounded-2xl border border-slate-800/50">
                                <Shield className="h-4 w-4 text-[#6366F1]" />
                                <p className="text-xs">Assets will be stored in your private server directory with secure public access enabled.</p>
                            </div>

                            <div className="flex gap-4">
                                <Button 
                                    variant="ghost" 
                                    onClick={onClose}
                                    className="flex-1 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleUpload}
                                    disabled={files.length === 0}
                                    className="flex-1 bg-[#6366F1] hover:bg-[#5850EC] text-white rounded-xl h-12 font-bold uppercase tracking-wider shadow-lg shadow-[#6366F1]/20"
                                >
                                    Start Upload
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 space-y-8 flex flex-col items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#6366F1] blur-2xl opacity-20 animate-pulse"></div>
                                <Loader2 className="h-16 w-16 text-[#6366F1] animate-spin relative z-10" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-bold text-white">Uploading...</h3>
                                <p className="text-slate-500">Please wait while your files are being processed and stored.</p>
                            </div>
                            <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                                <motion.div 
                                    className="bg-[#6366F1] h-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <p className="text-xs font-bold text-[#6366F1] uppercase tracking-widest">{Math.round(uploadProgress)}% Complete</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
