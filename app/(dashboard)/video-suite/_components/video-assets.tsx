"use client";

import { useVideoEditorStore } from "@/hooks/use-video-editor-store";
import { UploadButton } from "@/lib/uploadthing";
import {
    Film,
    Image as ImageIcon,
    Music,
    Plus,
    Trash2,
    Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export function VideoAssets() {
    const { clips, addClip, removeClip, setActiveClipId } = useVideoEditorStore();

    const handleUploadComplete = (res: any) => {
        if (res && res.length > 0) {
            res.forEach((file: any) => {
                const newClip: any = {
                    id: uuidv4(),
                    url: file.url,
                    name: file.name,
                    type: file.type?.startsWith('image') ? 'image' :
                        file.type?.startsWith('audio') ? 'audio' : 'video',
                    startTime: 0,
                    endTime: 10, // Default 10s if duration unknown
                    duration: 10,
                    position: clips.length > 0
                        ? clips[clips.length - 1].position + clips[clips.length - 1].duration * 1000
                        : 0
                };
                addClip(newClip);
            });
            toast.success("Assets added to library");
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-[#303236] flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#ABABAD]">Assets</h3>
                <UploadButton
                    endpoint="courseAttachment"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={(error: Error) => {
                        toast.error(`Upload failed: ${error.message}`);
                    }}
                    appearance={{
                        button: "bg-purple-600 hover:bg-purple-700 text-white text-[10px] h-7 px-3",
                        allowedContent: "hidden"
                    }}
                    content={{
                        button({ ready }) {
                            if (ready) return "Upload";
                            return "Preparing...";
                        }
                    }}
                />
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {clips.map((clip) => (
                    <div
                        key={clip.id}
                        className="group bg-[#2C2E31] border border-[#303236] rounded-lg p-2 hover:border-purple-500/50 transition-all cursor-pointer"
                        onClick={() => setActiveClipId(clip.id)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded bg-black flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                                {clip.type === 'video' && <Film className="w-5 h-5 text-blue-400" />}
                                {clip.type === 'audio' && <Music className="w-5 h-5 text-green-400" />}
                                {clip.type === 'image' && <ImageIcon className="w-5 h-5 text-yellow-400" />}

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Plus className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-bold truncate pr-6">{clip.name}</p>
                                <p className="text-[9px] text-[#ABABAD] uppercase tracking-tighter">
                                    {clip.type} | {(clip.duration || 0).toFixed(1)}s
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-[#606060] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeClip(clip.id);
                                }}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                ))}

                {clips.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                        <Film className="w-8 h-8 text-[#303236] mb-2" />
                        <p className="text-[10px] text-[#ABABAD]">Upload videos or images to start editing</p>
                    </div>
                )}
            </div>
        </div>
    );
}
