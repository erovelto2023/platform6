"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";

interface ImageUploadButtonProps {
    onUploadComplete: (url: string) => void;
    onUploadError?: (error: Error) => void;
}

export const ImageUploadButton = ({ onUploadComplete, onUploadError }: ImageUploadButtonProps) => {
    return (
        <div className="flex items-center gap-2">
            <UploadButton
                endpoint="courseThumbnail"
                onClientUploadComplete={(res) => {
                    onUploadComplete(res[0].url);
                }}
                onUploadError={(error: Error) => {
                    onUploadError?.(error);
                }}
                appearance={{
                    button: "bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors ut-ready:bg-indigo-600 ut-uploading:bg-indigo-700 ut-uploading:cursor-not-allowed",
                    container: "w-auto",
                    allowedContent: "hidden",
                }}
                content={{
                    button({ ready, isUploading }) {
                        if (isUploading) return "Uploading...";
                        if (ready) return (
                            <div className="flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                Upload Image
                            </div>
                        );
                        return "Getting ready...";
                    },
                }}
            />
        </div>
    );
};
