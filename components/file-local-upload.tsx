"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, File, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileLocalUploadProps {
    onChange: (url: string) => void;
    endpoint?: string; // Kept for compatibility with UploadThing calls
    value?: string;
    onUploadComplete?: (res: any[]) => void;
}

export const FileLocalUpload = ({
    onChange,
    value,
    onUploadComplete
}: FileLocalUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        setIsUploading(true);
        setProgress(0);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post("/api/upload", formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    setProgress(percentCompleted);
                },
            });

            const { url, name, size, type } = response.data;

            onChange(url);
            if (onUploadComplete) {
                onUploadComplete([{ url, name, size, type }]);
            }
            toast.success("File uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload file");
        } finally {
            setIsUploading(false);
        }
    }, [onChange, onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        multiple: false
    });

    if (value) {
        return (
            <div className="relative flex items-center p-2 rounded-md bg-slate-100 border border-slate-200">
                <File className="h-4 w-4 mr-2 text-slate-500" />
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-500 hover:underline line-clamp-1 flex-1"
                >
                    {value}
                </a>
                <Button
                    onClick={() => onChange("")}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-slate-200"
                >
                    <X className="h-4 w-4 text-slate-500" />
                </Button>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                "border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-2",
                isDragActive ? "border-purple-600 bg-purple-50" : "border-slate-200 hover:border-slate-300",
                isUploading && "pointer-events-none opacity-60"
            )}
        >
            <input {...getInputProps()} />

            {isUploading ? (
                <div className="w-full space-y-4 flex flex-col items-center">
                    <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                    <div className="w-full max-w-[200px] space-y-1 text-center">
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-slate-500">{progress}% uploaded</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-slate-600" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-slate-900">
                            {isDragActive ? "Drop file here" : "Click or drag file to upload"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Supported files: MP4, MP3, PNG, JPG, PDF (Max 512MB)
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};
