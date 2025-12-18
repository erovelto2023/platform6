"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getUserSettings, updateAISettings } from "@/lib/actions/user.actions";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getModels } from "@/lib/actions/ollama.actions";

export default function AISettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [localModels, setLocalModels] = useState<string[]>([]);
    const [settings, setSettings] = useState({
        provider: "local",
        apiKey: "",
        defaultModel: "deepseek-r1"
    });

    useEffect(() => {
        async function loadSettings() {
            const [data, models] = await Promise.all([
                getUserSettings(),
                getModels()
            ]);

            if (data) {
                setSettings({
                    provider: data.provider || "local",
                    apiKey: data.apiKey || "",
                    defaultModel: data.defaultModel || "deepseek-r1"
                });
            }

            if (models && models.success && Array.isArray(models.data) && models.data.length > 0) {
                const modelNames = models.data.map((m: any) => m.name);
                setLocalModels(modelNames);

                // If current default model is not in the list, or is the old default 'deepseek-r1' which might not exist
                // Set it to the first available model
                if (data && (!data.defaultModel || !modelNames.includes(data.defaultModel))) {
                    setSettings(prev => ({ ...prev, defaultModel: modelNames[0] }));
                } else if (!data && modelNames.length > 0) {
                    setSettings(prev => ({ ...prev, defaultModel: modelNames[0] }));
                }
            }

            setIsLoading(false);
        }
        loadSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateAISettings(settings);
            toast.success("AI Settings updated successfully");
        } catch (error) {
            toast.error("Failed to update settings");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-2">AI Configuration</h1>
            <p className="text-slate-500 mb-8">Choose how you want to power the AI features in K Business.</p>

            <Card>
                <CardHeader>
                    <CardTitle>AI Provider</CardTitle>
                    <CardDescription>
                        Select the AI service you want to use.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <RadioGroup
                        value={settings.provider}
                        onValueChange={(val) => setSettings({ ...settings, provider: val })}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <div className={`border rounded-lg p-4 cursor-pointer transition-all ${settings.provider === 'local' ? 'border-indigo-600 bg-indigo-50' : 'hover:border-slate-300'}`}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="local" id="local" />
                                <Label htmlFor="local" className="font-semibold cursor-pointer">Hosted (Ollama)</Label>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 pl-6">
                                Free, private, and runs on your hosted server. Requires Ollama to be running.
                            </p>
                        </div>

                        <div className={`border rounded-lg p-4 cursor-pointer transition-all ${settings.provider === 'openrouter' ? 'border-indigo-600 bg-indigo-50' : 'hover:border-slate-300'}`}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="openrouter" id="openrouter" />
                                <Label htmlFor="openrouter" className="font-semibold cursor-pointer">OpenRouter (Cloud)</Label>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 pl-6">
                                Access top models like GPT-4, Claude 3, etc. Requires an API Key.
                            </p>
                        </div>
                    </RadioGroup>

                    {settings.provider === 'openrouter' && (
                        <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <Label>OpenRouter API Key</Label>
                                <Input
                                    type="password"
                                    value={settings.apiKey}
                                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                                    placeholder="sk-or-..."
                                />
                                <p className="text-xs text-slate-500">
                                    Get your key from <a href="https://openrouter.ai/keys" target="_blank" className="text-indigo-600 hover:underline">openrouter.ai</a>
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Default Model</Label>
                                <Input
                                    value={settings.defaultModel}
                                    onChange={(e) => setSettings({ ...settings, defaultModel: e.target.value })}
                                    placeholder="e.g. openai/gpt-4-turbo"
                                />
                            </div>
                        </div>
                    )}

                    {settings.provider === 'local' && (
                        <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <Label>Hosted Model Name</Label>
                                <Select
                                    value={settings.defaultModel}
                                    onValueChange={(val) => setSettings({ ...settings, defaultModel: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {localModels.map((model) => (
                                            <SelectItem key={model} value={model}>
                                                {model}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-slate-500">
                                    Select a model from your hosted Ollama instance.
                                </p>
                            </div>
                        </div>
                    )}

                    <Button className="w-full" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Configuration
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
