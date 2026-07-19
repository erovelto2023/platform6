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
        <Card className="mb-6 border border-slate-150 shadow-sm">
            <CardContent className="p-4">
                <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || user.imageUrl} />
                        <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        {/* Post starters */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            <button 
                                type="button" 
                                onClick={() => applyStarter('win')}
                                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition cursor-pointer flex items-center gap-1"
                            >
                                🏆 Share a Win
                            </button>
                            <button 
                                type="button" 
                                onClick={() => applyStarter('feedback')}
                                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition cursor-pointer flex items-center gap-1"
                            >
                                💬 Funnel Feedback
                            </button>
                            <button 
                                type="button" 
                                onClick={() => applyStarter('help')}
                                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer flex items-center gap-1"
                            >
                                🛠️ Tech Help
                            </button>
                            <button 
                                type="button" 
                                onClick={() => applyStarter('sprint')}
                                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition cursor-pointer flex items-center gap-1"
                            >
                                ⚡ Active Sprint
                            </button>
                        </div>

                        <div className="mb-2">
                            {feeling && (
                                <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full flex items-center gap-1 w-fit mb-2">
                                    is feeling {feeling}
                                    <button onClick={() => setFeeling(null)} className="hover:text-red-500 ml-1 cursor-pointer"><X className="h-3 w-3" /></button>
                                </span>
                            )}
                            <Textarea
                                placeholder="Share a win, ask for funnel feedback, or post a tech question..."
                                className="border-none resize-none bg-slate-50 focus-visible:ring-0 min-h-[90px] text-slate-700 placeholder-slate-400"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        {/* Media Previews */}
                        {mediaUrl && (
                            <div className="relative mt-2 mb-2 rounded-lg overflow-hidden border w-fit max-h-[200px]">
                                <img src={mediaUrl} alt="Upload preview" className="h-full object-cover" />
                                <button
                                    onClick={() => setMediaUrl(null)}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
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
                                    className="h-8 text-sm"
                                />
                                <Button size="sm" variant="ghost" onClick={() => { setShowVideoInput(false); setVideoUrl(null); }}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <div className="flex gap-2">
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
                                            color: "rgb(100 116 139)",
                                            height: "36px",
                                            padding: "8px 12px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            border: "none",
                                            boxShadow: "none",
                                            transition: "colors 0.2s",
                                        },
                                        allowedContent: {
                                            display: "none"
                                        }
                                    }}
                                    content={{
                                        button: () => (
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <ImageIcon className="h-5 w-5" />
                                                <span>Photo</span>
                                            </div>
                                        )
                                    }}
                                />

                                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-indigo-600" onClick={() => setShowVideoInput(!showVideoInput)}>
                                    <Video className="h-5 w-5 mr-2" />
                                    Video
                                </Button>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-yellow-600">
                                            <Smile className="h-5 w-5 mr-2" />
                                            Feeling
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 p-2" align="start">
                                        <div className="grid grid-cols-2 gap-1">
                                            {FEELINGS.map(f => (
                                                <button
                                                    key={f}
                                                    className="text-left px-2 py-1 hover:bg-slate-100 rounded text-sm"
                                                    onClick={() => setFeeling(f)}
                                                >
                                                    {f}
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <Button
                                className="bg-indigo-600 hover:bg-indigo-700"
                                disabled={(!content.trim() && !mediaUrl && !videoUrl) || isPosting}
                                onClick={handlePost}
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
