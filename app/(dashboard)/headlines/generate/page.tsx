"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Wand2, Loader2, Save, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { createHeadline } from "@/lib/actions/headline.actions";

// Mock AI generation for now (replace with actual API call)
const generateMockHeadlines = async (params: any) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay

    const base = [
        `The Secret to ${params.outcome || "Success"} That Experts Won't Tell You`,
        `How to ${params.outcome || "Win"} Without ${params.pain || "Struggling"}`,
        `Why ${params.audience || "People"} Fail at ${params.topic || "Everything"} (And How to Fix It)`,
        `7 Ways to ${params.outcome || "Improve"} in 30 Days`,
        `Stop ${params.pain || "Wasting Time"} — Start ${params.outcome || "Winning"} Today`
    ];

    return base.map(text => ({
        text,
        score: Math.floor(Math.random() * 30) + 70,
        emotion: params.emotion || "Curiosity",
        platform: params.platform || "General"
    }));
};

export default function GenerateHeadlinesPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [generatedHeadlines, setGeneratedHeadlines] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        topic: "",
        audience: "",
        outcome: "",
        pain: "",
        platform: "Facebook",
        emotion: "Curiosity",
        tone: "Professional",
        count: 5
    });

    const handleGenerate = async () => {
        if (!formData.topic || !formData.outcome) {
            toast.error("Please fill in the Topic and Desired Outcome fields.");
            return;
        }

        setIsLoading(true);
        try {
            // In a real app, this would call a server action that calls OpenAI/Anthropic
            const results = await generateMockHeadlines(formData);
            setGeneratedHeadlines(results);
            toast.success("Headlines generated!");
        } catch (error) {
            toast.error("Failed to generate headlines");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (headline: any) => {
        try {
            await createHeadline("user_placeholder", { // userId will be handled by server action auth check ideally, but we pass it here or let server handle
                text: headline.text,
                emotion: headline.emotion,
                platform: headline.platform,
                aiGenerated: true,
                sourcePrompt: `Topic: ${formData.topic}, Outcome: ${formData.outcome}`
            });
            toast.success("Saved to Vault");
            router.refresh();
        } catch (error) {
            toast.error("Failed to save");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Vault
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Column */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Generator Inputs</CardTitle>
                            <CardDescription>Define your target and goals.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Product / Topic</Label>
                                <Input
                                    placeholder="e.g. Weight Loss Course"
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Target Audience</Label>
                                <Input
                                    placeholder="e.g. Busy Moms"
                                    value={formData.audience}
                                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Desired Outcome</Label>
                                <Input
                                    placeholder="e.g. Lose 10lbs in 30 days"
                                    value={formData.outcome}
                                    onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Pain Point to Avoid</Label>
                                <Input
                                    placeholder="e.g. Giving up pizza"
                                    value={formData.pain}
                                    onChange={(e) => setFormData({ ...formData, pain: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label>Platform</Label>
                                    <Select value={formData.platform} onValueChange={(val) => setFormData({ ...formData, platform: val })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Facebook">Facebook</SelectItem>
                                            <SelectItem value="Email">Email</SelectItem>
                                            <SelectItem value="Blog">Blog</SelectItem>
                                            <SelectItem value="YouTube">YouTube</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Emotion</Label>
                                    <Select value={formData.emotion} onValueChange={(val) => setFormData({ ...formData, emotion: val })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Curiosity">Curiosity</SelectItem>
                                            <SelectItem value="Fear">Fear</SelectItem>
                                            <SelectItem value="Desire">Desire</SelectItem>
                                            <SelectItem value="Urgency">Urgency</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700" onClick={handleGenerate} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="h-4 w-4 mr-2" />
                                        Generate Headlines
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-2 space-y-6">
                    {generatedHeadlines.length === 0 ? (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-slate-50 text-slate-400">
                            <Wand2 className="h-12 w-12 mb-4 opacity-20" />
                            <p className="font-medium">Ready to generate ideas.</p>
                            <p className="text-sm">Fill out the form to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Generated Results</h3>
                                <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isLoading}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Regenerate
                                </Button>
                            </div>

                            {generatedHeadlines.map((headline, index) => (
                                <Card key={index} className="group hover:border-indigo-200 transition-all">
                                    <CardContent className="p-4 flex items-start justify-between gap-4">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                                                    {headline.emotion}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    Score: {headline.score}/100
                                                </span>
                                            </div>
                                            <p className="text-lg font-medium text-slate-900">{headline.text}</p>
                                        </div>
                                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="sm" onClick={() => handleSave(headline)}>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => {
                                                navigator.clipboard.writeText(headline.text);
                                                toast.success("Copied!");
                                            }}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
