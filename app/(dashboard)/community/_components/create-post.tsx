"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Smile, Video, X } from "lucide-react";
import { useState } from "react";
import { createPost } from "@/lib/actions/community.actions";
import { toast } from "react-hot-toast";
import { UploadButton } from "@/lib/uploadthing";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface CreatePostProps {
    user: any;
}

const FEELINGS = ["🤩 Happy", "😎 Cool", "🥳 Excited", "😴 Tired", "🤔 Thinking", "😤 Frustrated", "🤒 Sick", "🥰 Loved"];

export function CreatePost({ user }: CreatePostProps) {
    const [content, setContent] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [feeling, setFeeling] = useState<string | null>(null);
    const [showVideoInput, setShowVideoInput] = useState(false);

    const handlePost = async () => {
        if (!content.trim() && !mediaUrl && !videoUrl) return;

        setIsPosting(true);
        try {
            await createPost({
                userId: user._id,
                content,
                media: mediaUrl ? [mediaUrl] : [],
                video: videoUrl || undefined,
                feeling: feeling || undefined,
                visibility: 'public'
            });
            setContent("");
            setMediaUrl(null);
            setVideoUrl(null);
            setFeeling(null);
            setShowVideoInput(false);
            toast.success("Post created!");
        } catch (error) {
            toast.error("Failed to create post");
        } finally {
            setIsPosting(false);
        }
    };

    const applyStarter = (type: 'win' | 'feedback' | 'help' | 'sprint') => {
        if (type === 'win') {
            setFeeling("🥳 Excited");
            setContent("🏆 MY BIG WIN TODAY:\n\n🔑 KEY LEARNING:\n\n🚀 NEXT STEP:\n\n#ShareAWin");
        } else if (type === 'feedback') {
            setFeeling("🤔 Thinking");
            setContent("🌐 MY FUNNEL LINK:\n\n🎯 TARGET AUDIENCE:\n\n❓ MY QUESTIONS:\n\n#FunnelFeedback");
        } else if (type === 'help') {
            setFeeling("😤 Frustrated");
            setContent("💻 THE PROBLEM:\n\n💥 ERROR MESSAGE:\n\n⚙️ MY TECH STACK:\n\n#TechHelp");
        } else if (type === 'sprint') {
            setFeeling("🤩 Happy");
            setContent("📦 MY SPRINT FOCUS:\n\n📈 GOAL:\n\n⏰ TIMELINE:\n\n#DropshippingSprint");
        }
    };

    return (
        <Card className="mb-6 border border-slate-800 bg-slate-900 shadow-xl text-slate-100">
            <CardContent className="p-4 md:p-5">
                <div className="flex gap-4">
                    <Avatar className="h-10 w-10 border border-slate-800 bg-slate-950">
                        <AvatarImage src={user.avatar || user.imageUrl} />
                        <AvatarFallback className="text-orange-400 font-bold">{user.firstName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        {/* Post starters */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            <button 
                                type="button" 
                                onClick={() => applyStarter('win')}
                                className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-800/80 transition cursor-pointer flex items-center gap-1"
                            >
                                🏆 Share a Win
                            </button>
                            <button 
                                type="button" 
                                onClick={() => applyStarter('feedback')}
                                className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-blue-950/80 hover:bg-blue-900/80 text-blue-400 border border-blue-800/80 transition cursor-pointer flex items-center gap-1"
                            >
                                💬 Funnel Feedback
                            </button>
                            <button 
                                type="button" 
                                onClick={() => applyStarter('help')}
                                className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-rose-950/80 hover:bg-rose-900/80 text-rose-400 border border-rose-800/80 transition cursor-pointer flex items-center gap-1"
                            >
                                🛠️ Tech Help
                            </button>
                            <button 
                                type="button" 
                                onClick={() => applyStarter('sprint')}
                                className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-amber-950/80 hover:bg-amber-900/80 text-amber-400 border border-amber-800/80 transition cursor-pointer flex items-center gap-1"
                            >
                                ⚡ Active Sprint
                            </button>
                        </div>

                        <div className="mb-2">
                            {feeling && (
                                <span className="text-xs font-mono text-amber-400 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-full flex items-center gap-1 w-fit mb-2">
                                    is feeling {feeling}
                                    <button onClick={() => setFeeling(null)} className="hover:text-rose-400 ml-1 cursor-pointer"><X className="h-3 w-3" /></button>
                                </span>
                            )}
                            <Textarea
                                placeholder="Share a win, ask for funnel feedback, or post a tech question..."
                                className="border border-slate-800 resize-none bg-slate-950 focus-visible:ring-1 focus-visible:ring-orange-500 min-h-[90px] text-slate-100 text-xs placeholder:text-slate-500 rounded-xl p-3"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        {/* Media Previews */}
                        {mediaUrl && (
                            <div className="relative mt-2 mb-2 rounded-xl overflow-hidden border border-slate-800 w-fit max-h-[200px]">
                                <img src={mediaUrl} alt="Upload preview" className="h-full object-cover" />
                                <button
                                    onClick={() => setMediaUrl(null)}
                                    className="absolute top-1 right-1 bg-slate-950/80 text-slate-200 rounded-full p-1 hover:bg-slate-950 cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {/* Video Input */}
                        {showVideoInput && (
                            <div className="flex gap-2 items-center mt-2 mb-2">
                                <Input
                                    placeholder="Paste YouTube or Vimeo link..."
                                    value={videoUrl || ""}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    className="h-9 text-xs font-mono bg-slate-950 border-slate-800 text-slate-100 focus:border-orange-500"
                                />
                                <Button size="sm" variant="ghost" onClick={() => { setShowVideoInput(false); setVideoUrl(null); }} className="text-slate-400 hover:text-white">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
                            <div className="flex gap-2 items-center">
                                {/* Image Upload */}
                                <UploadButton
                                    endpoint="communityPostImage"
                                    onClientUploadComplete={(res) => {
                                        setMediaUrl(res[0].url || res[0].url);
                                        toast.success("File uploaded");
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast.error(`Upload failed: ${error.message}`);
                                    }}
                                    appearance={{
                                        button: {
                                            background: "transparent",
                                            color: "rgb(203 213 225)",
                                            height: "36px",
                                            padding: "8px 12px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            border: "none",
                                            boxShadow: "none",
                                            cursor: "pointer",
                                        },
                                        allowedContent: {
                                            display: "none"
                                        }
                                    }}
                                    content={{
                                        button: (
                                            <div className="flex items-center gap-1.5 hover:text-orange-400 transition">
                                                <ImageIcon className="h-4 w-4 text-orange-400" />
                                                <span>Upload File</span>
                                            </div>
                                        )
                                    }}
                                />

                                {/* Video Link Toggle */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-slate-300 hover:text-orange-400 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                                    onClick={() => setShowVideoInput(!showVideoInput)}
                                >
                                    <Video className="h-4 w-4 text-orange-400" />
                                    <span>Video</span>
                                </Button>

                                {/* Feeling / Activity Popover */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-300 hover:text-orange-400 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Smile className="h-4 w-4 text-amber-400" />
                                            <span>Feeling</span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-56 p-2 bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
                                        <div className="grid grid-cols-2 gap-1">
                                            {FEELINGS.map((f) => (
                                                <button
                                                    key={f}
                                                    type="button"
                                                    onClick={() => setFeeling(f)}
                                                    className="text-xs text-left p-1.5 hover:bg-slate-800 rounded-lg transition font-mono cursor-pointer"
                                                >
                                                    {f}
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <Button
                                onClick={handlePost}
                                disabled={isPosting || (!content.trim() && !mediaUrl && !videoUrl)}
                                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider px-5 py-2 rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                            >
                                {isPosting ? "Posting..." : "Post"}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
