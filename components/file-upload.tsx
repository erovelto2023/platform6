"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import { X, FileIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
    endpoint: keyof typeof ourFileRouter;
    value: string;
    onChange: (url?: string) => void;
    fileType?: "image" | "video" | "audio" | "pdf" | "any";
}

export const FileUpload = ({
    endpoint,
    value,
    onChange,
    fileType = "any"
}: FileUploadProps) => {
    if (value) {
        const isImage = fileType === "image" || (fileType === "any" && value.match(/\.(jpg|jpeg|png|gif|webp)$/i));

        return (
            <div className="relative flex items-center p-4 mt-2 rounded-md border bg-slate-50/50">
                {isImage ? (
                    <div className="relative w-20 h-20 rounded-md overflow-hidden mr-4 shrink-0">
                        <Image
                            fill
                            src={value}
                            alt="Upload"
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 mr-4 shrink-0">
                        <FileIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                )}
                <div className="flex-1 truncate text-sm text-slate-600 min-w-0">
                    <a href={value} target="_blank" rel="noopener noreferrer" className="hover:underline truncate block">
                        {value}
                    </a>
                </div>
                <Button
                    onClick={() => onChange("")}
                    variant="ghost"
                    type="button"
                    className="h-8 w-8 p-0 text-slate-500 hover:text-red-500 shrink-0 ml-2"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
                toast.success("Upload completed");
            }}
            onUploadError={(error: Error) => {
                toast.error(`Upload failed: ${error.message}`);
            }}
            className="w-full border-slate-200 bg-slate-50/50 ut-label:text-indigo-600 ut-button:bg-indigo-600 ut-button:ut-readying:bg-indigo-600/50"
        />
    );
}
