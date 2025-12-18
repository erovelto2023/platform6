"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Repeat, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformPreviewProps {
    platform: string;
    content: string;
    image?: string;
    authorName?: string;
    authorHandle?: string;
    authorImage?: string;
    date?: Date;
}

export function PlatformPreview({
    platform,
    content,
    image,
    authorName = "Your Brand",
    authorHandle = "@yourbrand",
    authorImage,
    date = new Date(),
}: PlatformPreviewProps) {

    // Facebook Preview
    if (platform === "facebook") {
        return (
            <Card className="max-w-[500px] mx-auto overflow-hidden border shadow-sm">
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={authorImage} />
                            <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">{authorName}</p>
                            <p className="text-xs text-slate-500">Just now · 🌎</p>
                        </div>
                    </div>
                    <MoreHorizontal className="h-5 w-5 text-slate-500" />
                </div>
                <div className="px-4 pb-3 text-sm whitespace-pre-wrap">
                    {content || "Your post content will appear here..."}
                </div>
                {image && (
                    <div className="bg-slate-100 aspect-video w-full flex items-center justify-center overflow-hidden">
                        <img src={image} alt="Post content" className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="p-3 border-t flex items-center justify-between text-slate-500">
                    <div className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:bg-slate-50 px-4 py-2 rounded-lg flex-1 justify-center">
                        <Heart className="h-5 w-5" /> Like
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:bg-slate-50 px-4 py-2 rounded-lg flex-1 justify-center">
                        <MessageCircle className="h-5 w-5" /> Comment
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:bg-slate-50 px-4 py-2 rounded-lg flex-1 justify-center">
                        <Share2 className="h-5 w-5" /> Share
                    </div>
                </div>
            </Card>
        );
    }

    // Instagram Preview
    if (platform === "instagram") {
        return (
            <Card className="max-w-[400px] mx-auto overflow-hidden border shadow-sm">
                <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={authorImage} />
                            <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold text-sm">{authorHandle.replace('@', '')}</p>
                    </div>
                    <MoreHorizontal className="h-5 w-5 text-slate-900" />
                </div>
                <div className="bg-slate-100 aspect-square w-full flex items-center justify-center overflow-hidden">
                    {image ? (
                        <img src={image} alt="Post content" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-slate-400 text-sm">No image selected</div>
                    )}
                </div>
                <div className="p-3">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                            <Heart className="h-6 w-6" />
                            <MessageCircle className="h-6 w-6" />
                            <Send className="h-6 w-6" />
                        </div>
                        <Bookmark className="h-6 w-6" />
                    </div>
                    <div className="text-sm">
                        <span className="font-semibold mr-2">{authorHandle.replace('@', '')}</span>
                        <span className="whitespace-pre-wrap">{content || "Your caption..."}</span>
                    </div>
                </div>
            </Card>
        );
    }

    // Twitter/X Preview
    if (platform === "twitter") {
        return (
            <Card className="max-w-[500px] mx-auto overflow-hidden border shadow-sm p-4">
                <div className="flex gap-3">
                    <Avatar>
                        <AvatarImage src={authorImage} />
                        <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm">{authorName}</span>
                            <span className="text-slate-500 text-sm">{authorHandle}</span>
                            <span className="text-slate-500 text-sm">· Just now</span>
                        </div>
                        <div className="text-[15px] whitespace-pre-wrap mb-3">
                            {content || "What's happening?"}
                        </div>
                        {image && (
                            <div className="rounded-xl overflow-hidden border mb-3">
                                <img src={image} alt="Post content" className="w-full h-auto" />
                            </div>
                        )}
                        <div className="flex items-center justify-between text-slate-500 max-w-md">
                            <MessageCircle className="h-4 w-4" />
                            <Repeat className="h-4 w-4" />
                            <Heart className="h-4 w-4" />
                            <Share2 className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    // LinkedIn Preview
    if (platform === "linkedin") {
        return (
            <Card className="max-w-[500px] mx-auto overflow-hidden border shadow-sm">
                <div className="p-3 flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={authorImage} />
                        <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{authorName}</p>
                        <p className="text-xs text-slate-500">Just now • 🌐</p>
                    </div>
                </div>
                <div className="px-3 pb-2 text-sm whitespace-pre-wrap">
                    {content || "Start a post..."}
                </div>
                {image && (
                    <div className="bg-slate-100 aspect-video w-full flex items-center justify-center overflow-hidden">
                        <img src={image} alt="Post content" className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="p-2 border-t flex items-center justify-between text-slate-600 px-4">
                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-slate-100 p-2 rounded">
                        <Heart className="h-5 w-5" />
                        <span className="text-xs font-medium">Like</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-slate-100 p-2 rounded">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-xs font-medium">Comment</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-slate-100 p-2 rounded">
                        <Repeat className="h-5 w-5" />
                        <span className="text-xs font-medium">Repost</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-slate-100 p-2 rounded">
                        <Send className="h-5 w-5" />
                        <span className="text-xs font-medium">Send</span>
                    </div>
                </div>
            </Card>
        );
    }

    // Default Fallback
    return (
        <Card className="p-4 border shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Preview for {platform}</p>
            <div className="whitespace-pre-wrap">{content}</div>
        </Card>
    );
}
