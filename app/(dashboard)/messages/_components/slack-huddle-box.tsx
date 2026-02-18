"use client";

import { useEffect, useState } from "react";
import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer,
    ControlBar,
    useTracks,
    ParticipantTile,
    TrackLoop
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { X, Minus, Maximize2, Mic, MicOff, Video, VideoOff, PhoneOff, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SlackHuddleBoxProps {
    token: string;
    wsUrl: string;
    roomName: string;
    onClose: () => void;
    currentUser: any;
}

export function SlackHuddleBox({
    token,
    wsUrl,
    roomName,
    onClose,
    currentUser
}: SlackHuddleBoxProps) {
    const [isMinimized, setIsMinimized] = useState(false);

    if (!token) return null;

    return (
        <div className={cn(
            "fixed bottom-4 right-4 z-50 bg-[#1A1D21] border border-[#303236] rounded-xl shadow-2xl transition-all duration-300 overflow-hidden flex flex-col",
            isMinimized ? "w-64 h-14" : "w-[320px] h-[450px]"
        )}>
            {/* Header */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-[#303236] bg-[#1A1D21] flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-[#2EB67D] flex items-center justify-center">
                        <Headphones className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                            Huddle in #{roomName}
                        </span>
                        <span className="text-[10px] text-[#ABABAD]">Active</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-[#ABABAD] hover:text-white hover:bg-[#2C2E31]"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-[#E01E5A] hover:bg-[#E01E5A]/10"
                        onClick={onClose}
                    >
                        <PhoneOff className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div className={cn(
                "flex-1 relative bg-[#0B0D0F]",
                isMinimized && "hidden"
            )}>
                <LiveKitRoom
                    video={false} // Default to audio only for Huddles
                    audio={true}
                    token={token}
                    serverUrl={wsUrl}
                    onDisconnected={onClose}
                    data-lk-theme="default"
                    className="h-full"
                >
                    <div className="flex flex-col h-full">
                        <div className="flex-1 p-4">
                            {/* Simple list of participants */}
                            <HuddleParticipants />
                        </div>

                        {/* Custom Control Bar at bottom of box */}
                        <div className="p-4 bg-[#1A1D21] border-t border-[#303236]">
                            <ControlBar
                                variation="minimal"
                                controls={{ leave: false, settings: false }}
                                className="!border-none !p-0 !bg-transparent justify-center gap-4"
                            />
                        </div>
                    </div>
                    <RoomAudioRenderer />
                </LiveKitRoom>
            </div>
        </div>
    );
}

function HuddleParticipants() {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: false },
            { source: Track.Source.Microphone, withPlaceholder: false },
        ]
    );

    return (
        <div className="grid grid-cols-2 gap-3 h-full overflow-y-auto content-start">
            {tracks.map((trackReference) => (
                <ParticipantTile
                    key={`${trackReference.participant.identity}_${trackReference.source}`}
                    trackRef={trackReference}
                    className="aspect-square !bg-[#1A1D21] !border-[#303236] rounded-lg overflow-hidden"
                />
            ))}
        </div>
    );
}
