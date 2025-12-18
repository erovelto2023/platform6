"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateOllamaContent, getModels } from "@/lib/actions/ollama.actions";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";

export function OllamaTest() {
    const [prompt, setPrompt] = useState("Write a tagline for a coffee shop.");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [models, setModels] = useState<any[]>([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [loadingModels, setLoadingModels] = useState(false);

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        setLoadingModels(true);
        try {
            const result = await getModels();
            if (result.success && result.data.length > 0) {
                setModels(result.data);
                // Default to deepseek-r1 if available, otherwise first model
                const defaultModel = result.data.find((m: any) => m.name.includes("deepseek"))?.name || result.data[0].name;
                setSelectedModel(defaultModel);
            } else {
                setModels([]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingModels(false);
        }
    };

    const handleGenerate = async () => {
        if (!selectedModel) {
            setResponse("Error: No model selected. Please install a model on your Ollama server.");
            return;
        }
        setLoading(true);
        setResponse("");
        try {
            const result = await generateOllamaContent(prompt, selectedModel);
            if (result.success) {
                setResponse(result.data);
            } else {
                setResponse("Error: " + result.error);
            }
        } catch (e) {
            setResponse("Error: " + String(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mt-8 border-indigo-200">
            <CardHeader className="bg-indigo-50/50">
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    Test Local AI (Ollama)
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">Model</label>
                    <div className="flex gap-2">
                        <Select value={selectedModel} onValueChange={setSelectedModel} disabled={loadingModels || models.length === 0}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={loadingModels ? "Loading models..." : (models.length === 0 ? "No models found" : "Select a model")} />
                            </SelectTrigger>
                            <SelectContent>
                                {models.map((model) => (
                                    <SelectItem key={model.name} value={model.name}>
                                        {model.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" onClick={fetchModels} disabled={loadingModels}>
                            <RefreshCw className={`h-4 w-4 ${loadingModels ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                    {models.length === 0 && !loadingModels && (
                        <p className="text-xs text-red-500 mt-1">
                            No models found. Run <code>ollama pull deepseek-r1</code> on your server.
                        </p>
                    )}
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">Prompt</label>
                    <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter a prompt..."
                        className="min-h-[100px]"
                    />
                </div>
                <Button onClick={handleGenerate} disabled={loading || !selectedModel} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        "Generate Response"
                    )}
                </Button>
                {response && (
                    <div className={`p-4 rounded-lg border mt-4 ${response.startsWith("Error:") ? "bg-red-50 border-red-200 text-red-800" : "bg-slate-50 border-slate-200"}`}>
                        <h4 className="font-semibold mb-2 text-sm opacity-75">Response:</h4>
                        <div className="whitespace-pre-wrap text-sm">{response}</div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
