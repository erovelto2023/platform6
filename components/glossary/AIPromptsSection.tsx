"use client";

import { useState } from "react";
import { Copy, Check, Sparkles, Image, Lightbulb, Share2 } from "lucide-react";

interface AIPromptsSectionProps {
    term: string;
    imagePrompt?: string;
    productPrompt?: string;
    socialPrompt?: string;
}

export default function AIPromptsSection({ term, imagePrompt, productPrompt, socialPrompt }: AIPromptsSectionProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const prompts = [
        {
            title: "AI Image Prompt",
            description: "Use this in Midjourney, DALL-E, or Canva Magic Media to create perfect visuals for this topic.",
            content: imagePrompt || `A high-quality, professional 3D render or cinematic photograph representing ${term}, designed for a modern business and marketing blog background. Clean composition, vibrant but professional colors, 4k resolution.`,
            icon: <Image size={18} className="text-blue-500" />,
            bgColor: "bg-blue-50 dark:bg-blue-900/10",
            borderColor: "border-blue-100 dark:border-blue-900/30"
        },
        {
            title: "AI Product Idea Prompt",
            description: "Paste this into ChatGPT or Claude to brainstorm unique digital or physical products you can sell.",
            content: productPrompt || `I want to create a unique product related to "${term}". Please brainstorm 5 distinct product ideas, ranging from digital downloads (ebooks/templates) to physical goods. For each idea, explain the target audience and the primary value proposition.`,
            icon: <Lightbulb size={18} className="text-amber-500" />,
            bgColor: "bg-amber-50 dark:bg-amber-900/10",
            borderColor: "border-amber-100 dark:border-amber-900/30"
        },
        {
            title: "AI Content Strategy Prompt",
            description: "Use this to generate a viral social media strategy and content plan around this keyword.",
            content: socialPrompt || `Create a comprehensive 7-day social media content plan for "${term}". Include hooks for TikTok/Reels, educational captions for Instagram, and a thought-leadership thread for X (Twitter). Focus on how this topic helps small business owners.`,
            icon: <Share2 size={18} className="text-sky-500" />,
            bgColor: "bg-sky-50 dark:bg-sky-900/10",
            borderColor: "border-sky-100 dark:border-sky-900/30"
        }
    ];

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="mt-16 pt-12 border-t-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg text-white">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">AI Command Center</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Copy these prompts to kickstart your content and product creation.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {prompts.map((prompt, idx) => (
                    <div 
                        key={idx} 
                        className={`p-6 rounded-2xl border ${prompt.borderColor} ${prompt.bgColor} transition-all relative group`}
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-1">{prompt.icon}</div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{prompt.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{prompt.description}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => copyToClipboard(prompt.content, idx)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all shrink-0 ${
                                    copiedIndex === idx 
                                    ? "bg-emerald-500 text-white" 
                                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:shadow-md"
                                }`}
                            >
                                {copiedIndex === idx ? (
                                    <>
                                        <Check size={14} /> Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} /> Copy Prompt
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="mt-4 p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-white dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 font-mono italic leading-relaxed">
                            "{prompt.content}"
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
