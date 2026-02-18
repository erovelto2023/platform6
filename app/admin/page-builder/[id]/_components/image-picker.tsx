"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadButton } from "@/lib/uploadthing";
import { Image, Link as LinkIcon, Upload } from "lucide-react";
import { toast } from "sonner";

interface ImagePickerProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export function ImagePicker({ value, onChange, label = "Image" }: ImagePickerProps) {
    const [urlInput, setUrlInput] = useState(value || "");

    const handleUrlSubmit = () => {
        onChange(urlInput);
        toast.success("Image URL updated");
    };

    return (
        <div className="space-y-3">
            <Label className="text-sm">{label}</Label>

            <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" className="text-xs">
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                    </TabsTrigger>
                    <TabsTrigger value="url" className="text-xs">
                        <LinkIcon className="w-3 h-3 mr-1" />
                        URL
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-3">
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <UploadButton
                            endpoint="pageBuilderImage"
                            onClientUploadComplete={(res) => {
                                if (res && res[0]) {
                                    onChange(res[0].ufsUrl || res[0].url);
                                    toast.success("Image uploaded!");
                                }
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`Upload failed: ${error.message}`);
                            }}
                            appearance={{
                                button: "ut-ready:bg-primary ut-uploading:cursor-not-allowed ut-uploading:bg-primary/50 bg-primary text-white text-sm px-4 py-2 rounded-md",
                                allowedContent: "text-xs text-muted-foreground",
                            }}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="url" className="space-y-3">
                    <div className="flex gap-2">
                        <Input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="flex-1"
                        />
                        <Button onClick={handleUrlSubmit} size="sm">
                            Set
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Preview */}
            {value && (
                <div className="relative group">
                    <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                            onChange("");
                            setUrlInput("");
                            toast.success("Image removed");
                        }}
                    >
                        Remove
                    </Button>
                </div>
            )}
        </div>
    );
}
