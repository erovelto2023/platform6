"use client";

import { useVideoEditorStore } from "@/hooks/use-video-editor-store";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Scissors, Trash2, GripVertical, ChevronRight } from "lucide-react";

export function VideoTimeline() {
    const {
        clips,
        currentTime,
        setCurrentTime,
        setIsPlaying,
        removeClip,
        updateClip
    } = useVideoEditorStore();

    const timelineRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Zoom level: pixels per second
    const zoom = 50;
    const totalDuration = clips.length > 0
        ? (clips[clips.length - 1].position + clips[clips.length - 1].duration * 1000) / 1000
        : 60;

    const handleTimelineClick = (e: React.MouseEvent) => {
        if (!timelineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
        const newTime = (x / zoom) * 1000;
        setCurrentTime(newTime);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Timeline Header / Rulers */}
            <div className="h-10 border-b border-[#303236] bg-[#1A1D21] flex items-center px-4 justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/20 border border-[#303236]">
                        <Scissors className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Split</span>
                    </div>
                </div>
                <div className="text-[10px] font-mono text-[#ABABAD]">
                    {(currentTime / 1000).toFixed(2)}s / {(totalDuration).toFixed(2)}s
                </div>
            </div>

            {/* Scrollable Tracks Area */}
            <div
                ref={timelineRef}
                className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[#0B0D0F]"
                onClick={handleTimelineClick}
            >
                {/* Time Rulers */}
                <div className="absolute top-0 left-0 h-6 w-full flex border-b border-[#303236]/30 pointer-events-none">
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

                {/* Main Video Track */}
                <div className="mt-10 h-24 relative px-0 flex items-center">
                    {clips.map((clip) => (
                        <div
                            key={clip.id}
                            className={cn(
                                "h-16 rounded-lg border border-blue-500/30 bg-blue-500/10 absolute flex items-center px-3 gap-2 group cursor-pointer hover:bg-blue-500/20 transition-colors",
                            )}
                            style={{
                                left: (clip.position / 1000) * zoom,
                                width: clip.duration * zoom
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentTime(clip.position);
                            }}
                        >
                            <GripVertical className="w-3 h-3 text-blue-500/40" />
                            <span className="text-[10px] font-bold truncate text-white uppercase">{clip.name}</span>

                            <div className="absolute top-0 right-0 h-full w-2 bg-blue-500/20 opacity-0 group-hover:opacity-100 cursor-ew-resize rounded-r-lg" />
                            <div className="absolute top-0 left-0 h-full w-2 bg-blue-500/20 opacity-0 group-hover:opacity-100 cursor-ew-resize rounded-l-lg" />
                        </div>
                    ))}
                </div>

                {/* Playhead */}
                <div
                    className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-50 pointer-events-none"
                    style={{ left: (currentTime / 1000) * zoom }}
                >
                    <div className="absolute top-0 -left-[5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500" />
                </div>
            </div>

            {/* Scrollbar Mock */}
            <div className="h-8 bg-[#1A1D21] border-t border-[#303236] flex items-center px-4">
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
