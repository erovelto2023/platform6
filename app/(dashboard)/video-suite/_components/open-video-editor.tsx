"use client";

import { useEffect, useRef, useState } from "react";
import { Studio, Video, Audio, Image, Text, Compositor } from "openvideo";
import { Button } from "@/components/ui/button";
import {
    Play,
    Pause,
    Save,
    Download,
    Loader2,
    Film,
    Type,
    Settings2,
    Plus,
    Music,
    Image as ImageIcon,
    Trash2,
    Monitor
} from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { updateVideoProject } from "@/lib/actions/video.actions";
import { FileLocalUpload } from "@/components/file-local-upload";
import { cn } from "@/lib/utils";

interface OpenVideoEditorProps {
    initialData?: any;
}

export function OpenVideoEditor({ initialData }: OpenVideoEditorProps) {
    const params = useParams();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const studioRef = useRef<Studio | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [activeTab, setActiveTab] = useState<'media' | 'text'>('media');
    const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
    const zoom = 50; // px per second
    const [v, setV] = useState(0); // Force re-render for internal state updates

    useEffect(() => {
        if (!canvasRef.current || studioRef.current) return;

        const studio = new Studio({
            width: 1280,
            height: 720,
            canvas: canvasRef.current,
            bgColor: "#1A1D21"
        });

        studioRef.current = studio;

        if (initialData) {
            studio.loadFromJSON(initialData).then(() => {
                setIsReady(true);
                setV(v => v + 1);
            });
        } else {
            setIsReady(true);
        }

        studio.on("play", ({ isPlaying }) => setIsPlaying(isPlaying));
        studio.on("pause", ({ isPlaying }) => setIsPlaying(isPlaying));
        studio.on("clip:added", () => setV(v => v + 1));
        studio.on("clip:removed", () => setV(v => v + 1));
        studio.on("selection:created", ({ selected }) => {
            if (selected.length > 0) setSelectedClipId(selected[0].id);
            else setSelectedClipId(null);
        });
        studio.on("selection:cleared", () => setSelectedClipId(null));

        // Sync time for UI
        const interval = setInterval(() => {
            if (studio.isPlaying) setV(v => v + 1);
        }, 100);

        return () => {
            clearInterval(interval);
            studio.destroy();
            studioRef.current = null;
        };
    }, [initialData]);

    const handleAddMedia = async (res: any[]) => {
        if (!studioRef.current || !res || res.length === 0) return;

        for (const file of res) {
            let clip;
            if (file.type?.startsWith('video')) {
                clip = new Video(file.url);
            } else if (file.type?.startsWith('audio')) {
                clip = new Audio(file.url);
            } else if (file.type?.startsWith('image')) {
                clip = new Image(file.url);
            }

            if (clip) {
                // Add to a track. Create one if none exist.
                if (studioRef.current.tracks.length === 0) {
                    studioRef.current.addTrack({ name: "Track 1", type: "video" });
                }
                const trackId = studioRef.current.tracks[0].id;
                await studioRef.current.addClip(clip, { trackId });
            }
        }
        toast.success("Assets added to project");
        setV(prev => prev + 1);
    };

    const handleAddText = async () => {
        if (!studioRef.current) return;
        if (studioRef.current.tracks.length === 0) {
            studioRef.current.addTrack({ name: "Track 1", type: "video" });
        }
        const textClip = new Text("New Text");
        const trackId = studioRef.current.tracks[0].id;
        await studioRef.current.addClip(textClip, { trackId });
        toast.success("Text added");
        setV(prev => prev + 1);
    };

    const handleTogglePlay = () => {
        if (!studioRef.current) return;
        if (isPlaying) {
            studioRef.current.pause();
        } else {
            studioRef.current.play();
        }
    };

    const handleSave = async () => {
        if (!studioRef.current || !params?.projectId) return;
        setIsSaving(true);
        try {
            const data = studioRef.current.exportToJSON();
            await updateVideoProject(params?.projectId as string, {
                studioData: data
            });
            toast.success("Project saved");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save project");
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = async () => {
        if (!studioRef.current) return;
        setIsExporting(true);
        const toastId = toast.loading("Preparing export...");
        try {
            const data = studioRef.current.exportToJSON();
            const compositor = new Compositor({
                width: 1280,
                height: 720,
                fps: 30,
            });

            await compositor.loadFromJSON(data);
            toast.loading("Rendering video in browser...", { id: toastId });

            const stream = compositor.output();
            const reader = stream.getReader();
            const chunks: Uint8Array[] = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) chunks.push(value);
            }

            const blob = new Blob(chunks as any, { type: "video/mp4" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `project-${params?.projectId || 'export'}.mp4`;
            a.click();

            toast.success("Export complete!", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Export failed", { id: toastId });
        } finally {
            setIsExporting(false);
        }
    };

    const handleTimelineClick = (e: React.MouseEvent) => {
        if (!studioRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left + e.currentTarget.scrollLeft;
        const time = (x / zoom) * 1000000; // OpenVideo uses microseconds
        studioRef.current.seek(time);
        setV(v => v + 1);
    };

    const totalDurationSeconds = Math.max(
        (studioRef.current?.maxDuration || 0) / 1000000,
        30
    );

    return (
        <div className="flex-1 flex flex-col bg-[#0B0D0F]">
            {/* Header / Toolbar */}
            <div className="h-14 border-b border-[#303236] bg-[#1A1D21] flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleTogglePlay}
                        className="text-white hover:bg-white/10"
                    >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="text-[#ABABAD] hover:text-white gap-2"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                    </Button>
                    <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2"
                        disabled={isExporting}
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebars */}
                <div className="w-16 border-r border-[#303236] bg-[#1A1D21] flex flex-col items-center py-4 gap-4">
                    <button
                        onClick={() => setActiveTab('media')}
                        className={cn("p-3 rounded-xl transition-all", activeTab === 'media' ? "bg-purple-600 text-white" : "text-[#ABABAD] hover:bg-white/5")}
                    >
                        <Film className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setActiveTab('text')}
                        className={cn("p-3 rounded-xl transition-all", activeTab === 'text' ? "bg-purple-600 text-white" : "text-[#ABABAD] hover:bg-white/5")}
                    >
                        <Type className="w-5 h-5" />
                    </button>
                    <button
                        className="p-3 rounded-xl text-[#ABABAD] hover:bg-white/5 transition-all"
                    >
                        <Settings2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Tab Content */}
                <div className="w-72 border-r border-[#303236] bg-[#1A1D21] flex flex-col">
                    {activeTab === 'media' && (
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b border-[#303236] flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#ABABAD]">Media</h3>
                                <div className="w-24">
                                    <FileLocalUpload onUploadComplete={handleAddMedia} onChange={() => { }} />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {studioRef.current?.clips.map(clip => (
                                    <div
                                        key={clip.id}
                                        className={cn(
                                            "bg-[#2C2E31] p-2 rounded flex items-center justify-between group cursor-pointer border border-transparent hover:border-purple-500/50",
                                            selectedClipId === clip.id && "border-purple-500 bg-purple-500/10"
                                        )}
                                        onClick={() => studioRef.current?.selectClip(clip)}
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            {clip.type === 'video' ? <Film className="w-4 h-4 text-blue-400 shrink-0" /> :
                                                clip.type === 'audio' ? <Music className="w-4 h-4 text-green-400 shrink-0" /> :
                                                    <ImageIcon className="w-4 h-4 text-yellow-400 shrink-0" />}
                                            <span className="text-[10px] truncate">{clip.name || clip.id}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-red-500 opacity-0 group-hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                studioRef.current?.removeClip(clip.id).then(() => setV(v + 1));
                                            }}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'text' && (
                        <div className="p-4 flex flex-col gap-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ABABAD]">Text</h3>
                            <Button className="w-full bg-purple-600 hover:bg-purple-700 h-10 gap-2" onClick={handleAddText}>
                                <Plus className="w-4 h-4" /> Add Text
                            </Button>
                        </div>
                    )}
                </div>

                {/* Canvas Area */}
                <div className="flex-1 flex flex-col bg-black relative">
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="relative aspect-video w-full max-w-4xl bg-[#1A1D21] rounded-lg overflow-hidden shadow-2xl border border-[#303236]">
                            <canvas ref={canvasRef} className="w-full h-full" />
                            {!isReady && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Properties Panel (Contextual) */}
                <div className="w-72 border-l border-[#303236] bg-[#1A1D21] flex flex-col">
                    <div className="p-4 border-b border-[#303236]">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#ABABAD]">Properties</h3>
                    </div>
                    {selectedClipId ? (
                        <div className="p-4 space-y-4">
                            <span className="text-[10px] text-purple-400 uppercase font-bold">Selected: {selectedClipId.slice(0, 8)}</span>
                            {/* Further properties can be added here */}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#404040]">
                            <Monitor className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-[10px] uppercase font-bold tracking-widest">Select an element to edit</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Timeline Area */}
            <div className="h-[250px] border-t border-[#303236] bg-[#1A1D21] flex flex-col overflow-hidden">
                <div className="h-10 border-b border-[#303236] flex items-center px-6 justify-between bg-[#0B0D0F]">
                    <span className="text-[10px] text-[#ABABAD] uppercase font-bold tracking-widest">Timeline</span>
                    <div className="text-[10px] font-mono text-[#ABABAD]">
                        {((studioRef.current?.currentTime || 0) / 1000000).toFixed(2)}s / {(totalDurationSeconds).toFixed(2)}s
                    </div>
                </div>
                <div
                    className="flex-1 overflow-x-auto relative bg-[#0B0D0F] scrollbar-thin scrollbar-thumb-[#303236]"
                    onClick={handleTimelineClick}
                >
                    {/* Time Ruler */}
                    <div className="sticky top-0 h-6 border-b border-[#303236]/30 flex z-30 pointer-events-none bg-[#0B0D0F]">
                        {Array.from({ length: Math.ceil(totalDurationSeconds) + 1 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0 border-l border-[#303236]/30 h-full pl-1 text-[8px] text-[#404040]" style={{ width: zoom }}>
                                {i}s
                            </div>
                        ))}
                    </div>

                    <div className="relative" style={{ width: totalDurationSeconds * zoom }}>
                        {studioRef.current?.tracks.map((track, i) => (
                            <div key={track.id} className="h-14 border-b border-[#303236]/20 relative flex items-center">
                                <div className="absolute left-2 top-0.5 text-[8px] uppercase text-[#202020] font-black z-10">T{i + 1}</div>
                                {track.clipIds.map(clipId => {
                                    const clip = studioRef.current?.getClipById(clipId);
                                    if (!clip) return null;
                                    return (
                                        <div
                                            key={clip.id}
                                            className={cn(
                                                "absolute h-10 rounded border flex items-center px-2 gap-2 cursor-pointer transition-all bg-opacity-20",
                                                clip.type === 'video' ? "bg-blue-500 border-blue-500/50" :
                                                    clip.type === 'text' ? "bg-purple-500 border-purple-500/50" :
                                                        "bg-green-500 border-green-500/50",
                                                selectedClipId === clip.id && "bg-opacity-40 border-white ring-1 ring-white/20"
                                            )}
                                            style={{
                                                left: (clip.display.from / 1000000) * zoom,
                                                width: (clip.duration / 1000000) * zoom
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                studioRef.current?.selectClip(clip);
                                            }}
                                        >
                                            <span className="text-[9px] font-bold truncate text-white uppercase">{clip.name || clip.type}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                        {/* Playhead */}
                        <div
                            className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-50 pointer-events-none shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                            style={{ left: ((studioRef.current?.currentTime || 0) / 1000000) * zoom }}
                        >
                            <div className="absolute top-0 -left-[5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
