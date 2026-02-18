"use client";

import { useVideoEditorStore } from "@/hooks/use-video-editor-store";
// @ts-ignore
import BaseReactPlayer from "react-player";
const ReactPlayer = BaseReactPlayer as any;
import { useEffect, useRef, useState } from "react";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Maximize2,
    Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
export function VideoPreview() {
    const {
        clips,
        textClips,
        currentTime,
        setCurrentTime,
        isPlaying,
        setIsPlaying
    } = useVideoEditorStore();

    const playerRef = useRef<any>(null);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = useState(false);

    // Find the clip that should be playing at currentTime
    const activeClip = clips.find(c =>
        currentTime >= c.position &&
        currentTime < c.position + (c.duration * 1000)
    );

    // Find active text overlays
    const activeTextOverlays = textClips.filter(t =>
        currentTime >= t.position &&
        currentTime < t.position + t.duration
    );

    // Reset ready state when clip changes
    useEffect(() => {
        setIsReady(false);
    }, [activeClip?.id]);

    const handleProgress = (state: any) => {
        if (isPlaying && activeClip) {
            const clipRelativeTime = state.playedSeconds * 1000;
            const newAbsoluteTime = activeClip.position + clipRelativeTime;

            // Smoother time updates
            if (Math.abs(newAbsoluteTime - currentTime) > 50) {
                setCurrentTime(newAbsoluteTime);
            }
        }
    };

    const handleOnEnded = () => {
        // Find next clip or stop
        const nextClip = clips.find(c => c.position > currentTime);
        if (nextClip) {
            setCurrentTime(nextClip.position);
        } else {
            setIsPlaying(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col p-4 relative h-full">
            <div className="flex-1 bg-[#000] rounded-xl border border-[#303236] relative overflow-hidden flex items-center justify-center group shadow-2xl">
                {activeClip ? (
                    <div className="w-full h-full relative">
                        <ReactPlayer
                            ref={playerRef}
                            url={activeClip.url.startsWith('/') ? `${window.location.origin}${activeClip.url}` : activeClip.url}
                            playing={isPlaying && isReady}
                            controls={false}
                            width="100%"
                            height="100%"
                            volume={(activeClip.volume !== undefined ? activeClip.volume : 100) / 100}
                            onProgress={(state: any) => handleProgress(state)}
                            onReady={() => {
                                setIsReady(true);
                                setDuration(activeClip.duration * 1000);
                            }}
                            onEnded={handleOnEnded}
                            onError={(e: any) => console.error("Player Error:", e)}
                            progressInterval={50}
                            playsinline
                        />

                        {/* Text Overlays Layer */}
                        <div className="absolute inset-0 pointer-events-none z-10">
                            {activeTextOverlays.map(text => (
                                <div
                                    key={text.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 select-none"
                                    style={{
                                        left: `${text.style.x}%`,
                                        top: `${text.style.y}%`,
                                        fontSize: `${text.style.fontSize}px`,
                                        color: text.style.color,
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        width: 'max-content'
                                    }}
                                >
                                    {text.text}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-[#303236] flex flex-col items-center gap-2">
                        <Monitor className="w-16 h-16" />
                        <span className="text-xs uppercase font-bold tracking-widest">No Active Clip</span>
                    </div>
                )}

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-white hover:bg-white/10"
                                onClick={() => setIsPlaying(!isPlaying)}
                            >
                                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                            </Button>
                            <div className="flex flex-col">
                                <span className="text-sm font-mono text-white">
                                    {(currentTime / 1000).toFixed(2)}s / {(duration / 1000).toFixed(2)}s
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Volume2 className="w-5 h-5 text-white" />
                            <Maximize2 className="w-5 h-5 text-white cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple Bottom Controls */}
            <div className="h-14 flex items-center justify-center gap-6 mt-2">
                <Button variant="ghost" size="icon" className="text-[#ABABAD] hover:text-white">
                    <SkipBack className="w-5 h-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-white text-black hover:bg-white/90 shadow-xl"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                </Button>
                <Button variant="ghost" size="icon" className="text-[#ABABAD] hover:text-white">
                    <SkipForward className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
