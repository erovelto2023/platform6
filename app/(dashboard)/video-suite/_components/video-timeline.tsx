"use client";

import { useVideoEditorStore } from "@/hooks/use-video-editor-store";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Scissors, Trash2, GripVertical, ChevronRight } from "lucide-react";

export function VideoTimeline() {
    const {
        clips,
        textClips,
        currentTime,
        setCurrentTime,
        setIsPlaying,
        removeClip,
        updateClip,
        splitClip,
        activeClipId,
        setActiveClipId,
        activeTextId,
        setActiveTextId
    } = useVideoEditorStore();

    const timelineRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Zoom level: pixels per second
    const zoom = 50;
    const totalDuration = Math.max(
        ...clips.map(c => (c.position + c.duration * 1000) / 1000),
        ...textClips.map(t => (t.position + t.duration) / 1000),
        60
    );

    const handleTimelineClick = (e: React.MouseEvent) => {
        if (!timelineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
        const newTime = (x / zoom) * 1000;
        setCurrentTime(newTime);
    };

    const handleSplit = () => {
        const targetClip = clips.find(c =>
            currentTime >= c.position &&
            currentTime < c.position + (c.duration * 1000)
        );
        if (targetClip) {
            splitClip(targetClip.id, currentTime);
            toast.success("Clip split");
        } else {
            toast.error("Playhead must be over a clip to split");
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Timeline Header / Rulers */}
            <div className="h-10 border-b border-[#303236] bg-[#1A1D21] flex items-center px-4 justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1.5 px-2 py-1 h-7 rounded bg-black/20 border border-[#303236] text-blue-400 hover:text-blue-300"
                        onClick={handleSplit}
                    >
                        <Scissors className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Split</span>
                    </Button>
                </div>
                <div className="text-[10px] font-mono text-[#ABABAD]">
                    {(currentTime / 1000).toFixed(2)}s / {(totalDuration).toFixed(2)}s
                </div>
            </div>

            {/* Scrollable Tracks Area */}
            <div
                ref={timelineRef}
                className="flex-1 overflow-x-auto overflow-y-auto relative bg-[#0B0D0F] scrollbar-thin scrollbar-thumb-[#303236]"
                onClick={handleTimelineClick}
            >
                {/* Time Rulers */}
                <div className="sticky top-0 left-0 h-6 w-full flex border-b border-[#303236]/30 bg-[#0B0D0F] z-20 pointer-events-none">
                    {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 border-l border-[#303236]/50 h-full pl-1 text-[8px] text-[#404040]"
                            style={{ width: zoom }}
                        >
                            {i}s
                        </div>
                    ))}
                </div>

                {/* Tracks Area Container */}
                <div className="relative min-h-full" style={{ width: totalDuration * zoom }}>

                    {/* Video Track */}
                    <div className="h-20 border-b border-[#303236]/30 relative flex items-center">
                        <div className="absolute left-2 top-1 text-[8px] uppercase text-[#404040] font-bold">Video 1</div>
                        {clips.map((clip) => (
                            <div
                                key={clip.id}
                                className={cn(
                                    "h-14 rounded border flex items-center px-3 gap-2 group cursor-pointer transition-all",
                                    activeClipId === clip.id
                                        ? "bg-blue-600/30 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                        : "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20"
                                )}
                                style={{
                                    left: (clip.position / 1000) * zoom,
                                    width: clip.duration * zoom,
                                    position: 'absolute'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveClipId(clip.id);
                                    setCurrentTime(clip.position);
                                }}
                            >
                                <GripVertical className="w-3 h-3 text-blue-500/40" />
                                <span className="text-[10px] font-bold truncate text-white uppercase">{clip.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* Text Track */}
                    <div className="h-16 border-b border-[#303236]/30 relative flex items-center">
                        <div className="absolute left-2 top-1 text-[8px] uppercase text-[#404040] font-bold">Text 1</div>
                        {textClips.map((text) => (
                            <div
                                key={text.id}
                                className={cn(
                                    "h-10 rounded border flex items-center px-3 gap-2 group cursor-pointer transition-all",
                                    activeTextId === text.id
                                        ? "bg-purple-600/30 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                        : "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20"
                                )}
                                style={{
                                    left: (text.position / 1000) * zoom,
                                    width: (text.duration / 1000) * zoom,
                                    position: 'absolute'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTextId(text.id);
                                    setCurrentTime(text.position);
                                }}
                            >
                                <span className="text-[10px] font-bold truncate text-white italic">"{text.text}"</span>
                            </div>
                        ))}
                    </div>

                    {/* Playhead */}
                    <div
                        className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-50 pointer-events-none"
                        style={{ left: (currentTime / 1000) * zoom }}
                    >
                        <div className="absolute top-0 -left-[5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500 shadow-lg" />
                    </div>
                </div>
            </div>

            {/* Scrollbar Mock */}
            <div className="h-4 bg-[#1A1D21] border-t border-[#303236] flex items-center px-4">
                <div className="w-full h-1 bg-[#2C2E31] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-purple-600 transition-all duration-300"
                        style={{ width: `${Math.min(100, (currentTime / (totalDuration * 1000 || 1)) * 100)}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
