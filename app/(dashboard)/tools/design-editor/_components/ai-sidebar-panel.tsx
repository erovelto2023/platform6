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

        // Show settings if keys are missing
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
            <div className="w-80 border-r bg-white flex flex-col h-full shadow-lg z-20 absolute left-20 top-0 bottom-0 animate-in slide-in-from-left-5">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="font-semibold flex items-center gap-2">
                        <Key className="h-4 w-4 text-indigo-500" />
                        API Configuration
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label>Replicate API Token</Label>
                        <Input
                            type="password"
                            placeholder="r8_..."
                            value={replicateKey}
                            onChange={(e) => setReplicateKey(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Required for Image Generation (FLUX)</p>
                    </div>
                    <div className="space-y-2">
                        <Label>OpenAI / DeepSeek Key</Label>
                        <Input
                            type="password"
                            placeholder="sk-..."
                            value={openaiKey}
                            onChange={(e) => setOpenaiKey(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Required for Text Generation</p>
                    </div>
                    <Button onClick={saveKeys} className="w-full">Save Keys</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-80 border-r bg-white flex flex-col h-full shadow-lg z-20 absolute left-20 top-0 bottom-0 animate-in slide-in-from-left-5">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    AI Assistant
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
                    <Settings className="h-4 w-4" />
                </Button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full grid grid-cols-2 mb-4">
                        <TabsTrigger value="image" className="gap-2">
                            <ImageIcon className="h-4 w-4" /> Image
                        </TabsTrigger>
                        <TabsTrigger value="text" className="gap-2">
                            <Type className="h-4 w-4" /> Text
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="image" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Describe your image</Label>
                            <Textarea
                                placeholder="A futuristic city with neon lights..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>

                        <Button
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
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
                                <div className="rounded-md overflow-hidden border bg-slate-100 flex items-center justify-center p-2">
                                    <img src={generatedImage} alt="Generated" className="max-h-60 object-contain rounded-sm" />
                                </div>
                                <Button onClick={() => onAddImage(generatedImage)} variant="secondary" className="w-full">
                                    Add to Canvas
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="text" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Describe your text</Label>
                            <Textarea
                                placeholder="A catchy headline for a coffee shop..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                        <Button
                            className="w-full"
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
