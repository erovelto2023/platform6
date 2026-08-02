'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Image as ImageIcon, Type, Wand2, Settings, Key } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface AISidebarPanelProps {
    onAddImage: (url: string) => void;
    onAddText: (text: string) => void;
}

export default function AISidebarPanel({ onAddImage, onAddText }: AISidebarPanelProps) {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("image");

    // API Keys State
    const [replicateKey, setReplicateKey] = useState("");
    const [openaiKey, setOpenaiKey] = useState("");
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const storedReplicate = localStorage.getItem("k_replicate_key");
        const storedOpenAI = localStorage.getItem("k_openai_key");
        if (storedReplicate) setReplicateKey(storedReplicate);
        if (storedOpenAI) setOpenaiKey(storedOpenAI);

        if (!storedReplicate && !storedOpenAI) {
            setShowSettings(true);
        }
    }, []);

    const saveKeys = () => {
        if (replicateKey) localStorage.setItem("k_replicate_key", replicateKey);
        if (openaiKey) localStorage.setItem("k_openai_key", openaiKey);
        setShowSettings(false);
    };

    const handleGenerateImage = async () => {
        if (!prompt) return;
        if (!replicateKey) {
            alert("Please provide a Replicate API Key in Settings.");
            setShowSettings(true);
            return;
        }

        setIsGenerating(true);
        setGeneratedImage(null);

        try {
            const res = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Replicate-Token': replicateKey
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            if (data.success && data.imageUrl) {
                setGeneratedImage(data.imageUrl);
            } else {
                console.error("Image generation failed:", data.error);
                alert("Failed to generate image: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            alert("Error generating image");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateText = async () => {
        if (!prompt) return;
        if (!openaiKey) {
            alert("Please provide an OpenAI/DeepSeek API Key in Settings.");
            setShowSettings(true);
            return;
        }

        setIsGenerating(true);

        try {
            const res = await fetch('/api/generate-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-OpenAI-Key': openaiKey
                },
                body: JSON.stringify({
                    prompt: `Generate short, creative text content for a design based on: ${prompt}. Keep it under 20 words.`
                }),
            });

            const data = await res.json();
            if (data.success && data.content) {
                onAddText(data.content);
            } else {
                console.error("Text generation failed:", data.error);
                alert("Failed to generate text: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            alert("Error generating text");
        } finally {
            setIsGenerating(false);
        }
    }

    if (showSettings) {
        return (
            <div className="w-80 border-r border-slate-800 bg-slate-900 flex flex-col h-full shadow-2xl z-20 absolute left-20 top-0 bottom-0 text-slate-100 animate-in slide-in-from-left-5">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="font-bold text-xs font-mono uppercase tracking-wider text-orange-400 flex items-center gap-2">
                        <Key className="h-4 w-4 text-amber-400" />
                        API Configuration
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-mono text-slate-300 font-bold uppercase">Replicate API Token</Label>
                        <Input
                            type="password"
                            placeholder="r8_..."
                            value={replicateKey}
                            onChange={(e) => setReplicateKey(e.target.value)}
                            className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs focus:border-orange-500"
                        />
                        <p className="text-[11px] font-mono text-slate-400">Required for Image Generation (FLUX)</p>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-mono text-slate-300 font-bold uppercase">OpenAI / DeepSeek Key</Label>
                        <Input
                            type="password"
                            placeholder="sk-..."
                            value={openaiKey}
                            onChange={(e) => setOpenaiKey(e.target.value)}
                            className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs focus:border-orange-500"
                        />
                        <p className="text-[11px] font-mono text-slate-400">Required for Text Generation</p>
                    </div>
                    <Button onClick={saveKeys} className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider cursor-pointer">
                        Save Keys
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-80 border-r border-slate-800 bg-slate-900 flex flex-col h-full shadow-2xl z-20 absolute left-20 top-0 bottom-0 text-slate-100 animate-in slide-in-from-left-5">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h2 className="font-bold text-xs font-mono uppercase tracking-wider text-orange-400 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    AI Design Assistant
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="text-slate-400 hover:text-white">
                    <Settings className="h-4 w-4" />
                </Button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full grid grid-cols-2 mb-4 bg-slate-950 border border-slate-800 p-1 rounded-xl">
                        <TabsTrigger value="image" className="gap-2 text-xs font-mono font-bold text-slate-300 data-[state=active]:bg-orange-500 data-[state=active]:text-slate-950">
                            <ImageIcon className="h-3.5 w-3.5" /> Image
                        </TabsTrigger>
                        <TabsTrigger value="text" className="gap-2 text-xs font-mono font-bold text-slate-300 data-[state=active]:bg-orange-500 data-[state=active]:text-slate-950">
                            <Type className="h-3.5 w-3.5" /> Text
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="image" className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-mono text-slate-300 font-bold uppercase">Describe your image</Label>
                            <Textarea
                                placeholder="A futuristic city with neon lights..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="min-h-[100px] bg-slate-950 border-slate-800 text-slate-100 text-xs focus:border-orange-500 resize-none"
                            />
                        </div>

                        <Button
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider cursor-pointer"
                            onClick={handleGenerateImage}
                            disabled={isGenerating || !prompt}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-4 w-4" /> Generate Image
                                </>
                            )}
                        </Button>

                        {generatedImage && (
                            <div className="mt-4 space-y-2 animate-in fade-in-50">
                                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-2">
                                    <img src={generatedImage} alt="Generated" className="max-h-60 object-contain rounded-lg" />
                                </div>
                                <Button onClick={() => onAddImage(generatedImage)} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-mono">
                                    Add to Canvas
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="text" className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-mono text-slate-300 font-bold uppercase">Describe your text</Label>
                            <Textarea
                                placeholder="A catchy headline for a coffee shop..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="min-h-[100px] bg-slate-950 border-slate-800 text-slate-100 text-xs focus:border-orange-500 resize-none"
                            />
                        </div>
                        <Button
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider cursor-pointer"
                            onClick={handleGenerateText}
                            disabled={isGenerating || !prompt}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-4 w-4" /> Generate Content
                                </>
                            )}
                        </Button>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
