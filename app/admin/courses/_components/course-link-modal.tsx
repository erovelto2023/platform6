"use client";

import { useState } from "react";
import { Link2, Copy, Check, Code, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface CourseLinkModalProps {
    courseId: string;
    courseTitle: string;
}

export function CourseLinkModal({ courseId, courseTitle }: CourseLinkModalProps) {
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://kbusinessacademy.com";
    const directUrl = `${baseUrl}/catalog/${courseId}`;

    const htmlAnchorCode = `<a href="${directUrl}" target="_blank">Access ${courseTitle}</a>`;
    const htmlButtonCode = `<a href="${directUrl}" style="display:inline-block;padding:12px 24px;background:#f97316;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:bold;font-family:sans-serif;">Take ${courseTitle}</a>`;

    const copyToClipboard = (text: string, format: string) => {
        navigator.clipboard.writeText(text);
        setCopiedFormat(format);
        toast.success(`Copied ${format} to clipboard!`);
        setTimeout(() => setCopiedFormat(null), 2500);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-slate-900 border-slate-800 text-orange-400 hover:text-amber-300 hover:bg-slate-800 font-mono text-xs cursor-pointer flex items-center gap-1.5"
                >
                    <Link2 className="h-3.5 w-3.5" />
                    Get Link Code
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-xl font-sans">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase font-mono tracking-tight text-slate-100 flex items-center gap-2">
                        <Code className="h-5 w-5 text-orange-400" />
                        Course Embed & Link Code
                    </DialogTitle>
                    <DialogDescription className="text-xs font-mono text-slate-400">
                        Copy direct URLs, HTML links, or buttons for <span className="text-amber-300 font-bold">{courseTitle}</span> to paste into any page or email.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 pt-2">
                    {/* 1. Direct URL */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
                            <span>1. Direct Course URL</span>
                            <a href={directUrl} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline flex items-center gap-1">
                                Test Link <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="text" 
                                readOnly 
                                value={directUrl} 
                                className="w-full bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs rounded-xl px-3 py-2 focus:outline-none"
                            />
                            <Button 
                                onClick={() => copyToClipboard(directUrl, "URL")}
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-400 text-slate-950 font-mono text-xs font-black uppercase shrink-0"
                            >
                                {copiedFormat === "URL" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* 2. HTML Text Link */}
                    <div className="space-y-2">
                        <label className="block text-xs font-mono font-bold text-slate-300">2. HTML Text Link Code</label>
                        <div className="flex items-center gap-2">
                            <textarea 
                                readOnly 
                                rows={2}
                                value={htmlAnchorCode} 
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs rounded-xl px-3 py-2 focus:outline-none resize-none"
                            />
                            <Button 
                                onClick={() => copyToClipboard(htmlAnchorCode, "HTML Link")}
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-400 text-slate-950 font-mono text-xs font-black uppercase shrink-0"
                            >
                                {copiedFormat === "HTML Link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* 3. HTML Button Code */}
                    <div className="space-y-2">
                        <label className="block text-xs font-mono font-bold text-slate-300">3. HTML Button Code</label>
                        <div className="flex items-center gap-2">
                            <textarea 
                                readOnly 
                                rows={3}
                                value={htmlButtonCode} 
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs rounded-xl px-3 py-2 focus:outline-none resize-none"
                            />
                            <Button 
                                onClick={() => copyToClipboard(htmlButtonCode, "HTML Button")}
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-400 text-slate-950 font-mono text-xs font-black uppercase shrink-0"
                            >
                                {copiedFormat === "HTML Button" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
