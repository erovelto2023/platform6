"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import Script from "next/script";

interface VideoPlayerProps {
    videoUrl: string;
    isLocked: boolean;
}

export const VideoPlayer = ({
    videoUrl,
    isLocked,
}: VideoPlayerProps) => {
    const getYouTubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = getYouTubeId(videoUrl);
    const isGroove = videoUrl.includes("groove.cm") || videoUrl.includes("groovevideo");
    const isGrooveEmbed = videoUrl.includes("<groovevideo-widget");
    const isVideoPlayerGG = videoUrl.includes("videoplayer.gg");

    return (
        <div className="relative aspect-video">
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary rounded-md z-10">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">
                        This chapter is locked
                    </p>
                </div>
            )}
            {!isLocked && (
                <div className="h-full w-full bg-black rounded-md overflow-hidden">
                    {youtubeId ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        />
                    ) : isGrooveEmbed ? (
                        <div className="w-full h-full flex items-center justify-center bg-black">
                            <Script src="https://widget.groovevideo.com/widget/app.js" strategy="lazyOnload" />
                            <div
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{ __html: videoUrl }}
                            />
                        </div>
                    ) : isGroove ? (
                        <iframe
                            src={videoUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        />
                    ) : isVideoPlayerGG ? (
                        <iframe
                            src={videoUrl.includes("?") ? videoUrl : `${videoUrl}?embed=true`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                        />
                    ) : (
                        <video
                            src={videoUrl}
                            controls
                            className="w-full h-full"
                        />
                    )}
                </div>
            )}
        </div>
    )
}
