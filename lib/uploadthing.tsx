import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Upload, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export interface UploadProps {
    endpoint?: string;
    onClientUploadComplete?: (res: { url: string; name: string; size: number }[]) => void;
    onUploadError?: (error: Error) => void;
    className?: string;
    appearance?: any;
    content?: any;
}

export const UploadDropzone = ({ endpoint, onClientUploadComplete, onUploadError, className }: UploadProps) => {
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
            if (endpoint) formData.append("endpoint", endpoint);

            const response = await axios.post("/api/upload", formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    setProgress(percentCompleted);
                }
            });

            if (onClientUploadComplete && response.data?.url) {
                onClientUploadComplete([{ url: response.data.url, name: response.data.name, size: response.data.size }]);
            }
        } catch (error: any) {
            if (onUploadError) onUploadError(new Error(error.response?.data || error.message || "Upload failed"));
        } finally {
            setIsUploading(false);
        }
    }, [endpoint, onClientUploadComplete, onUploadError]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });

    return (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300 hover:border-slate-400'} ${isUploading ? 'pointer-events-none opacity-70' : ''} ${className || ''}`}>
            <input {...getInputProps()} />
            {isUploading ? (
                <div className="w-full space-y-4 flex flex-col items-center">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                    <div className="w-full max-w-[200px] space-y-1 text-center">
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-slate-500">{progress}% uploaded</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center text-slate-500">
                    <Upload className="h-10 w-10 mb-2 text-indigo-500" />
                    <p className="font-medium text-indigo-600">{isDragActive ? "Drop here" : "Choose files or drag and drop"}</p>
                    <p className="text-xs mt-1">Upload locally (Max 512MB)</p>
                </div>
            )}
        </div>
    );
};

export const UploadButton = ({ endpoint, onClientUploadComplete, onUploadError, appearance }: UploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            if (endpoint) formData.append("endpoint", endpoint);

            const response = await axios.post("/api/upload", formData);

            if (onClientUploadComplete && response.data?.url) {
                onClientUploadComplete([{ url: response.data.url, name: response.data.name, size: response.data.size }]);
            }
        } catch (error: any) {
            if (onUploadError) onUploadError(new Error(error.response?.data || error.message || "Upload failed"));
        } finally {
            setIsUploading(false);
            e.target.value = ''; // reset
        }
    };

    const buttonClass = appearance?.button || "bg-indigo-600 hover:bg-indigo-700 text-white";

    return (
        <div className="relative inline-block">
            <Button disabled={isUploading} className={`${buttonClass} relative overflow-hidden`} type="button">
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                {isUploading ? "Uploading..." : "Upload File"}
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                />
            </Button>
        </div>
    );
};

export const useUploadThing = (endpoint?: string, options?: any) => {
    const [isUploading, setIsUploading] = useState(false);
    return { 
        startUpload: async (files: File[]) => {
            setIsUploading(true);
            try {
                const results = [];
                for (const file of files) {
                    const formData = new FormData();
                    formData.append("file", file);
                    if (endpoint) formData.append("endpoint", endpoint);
                    
                    const response = await axios.post("/api/upload", formData);
                    if (response.data?.url) {
                        results.push({ url: response.data.url, name: response.data.name, size: response.data.size });
                    }
                }
                if (options?.onClientUploadComplete) {
                    options.onClientUploadComplete(results);
                }
                return results;
            } catch (error: any) {
                if (options?.onUploadError) {
                    options.onUploadError(new Error(error.response?.data || error.message || "Upload failed"));
                }
                throw error;
            } finally {
                setIsUploading(false);
            }
        }, 
        isUploading 
    };
};
export const uploadFiles = async (endpoint: string, options: any) => [];
