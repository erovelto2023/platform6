"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Network,
    Lightbulb,
    Layers,
    Bot,
    Globe,
    Key,
    Download,
    Play,
    Plus,
    FileText,
    RefreshCw,
    ChevronRight,
    ChevronDown,
    Settings
} from "lucide-react";
import { toast } from "sonner";

// --- Mock Data ---

const MOCK_PAA_TREE = [
    {
        id: "root",
        question: "How to start a garden?",
        children: [
            {
                id: "1",
                question: "What is the easiest vegetable to grow?",
                children: [
                    { id: "1-1", question: "Which vegetables grow in 30 days?" },
                    { id: "1-2", question: "What vegetables can you plant in May?" }
                ]
            },
            {
                id: "2",
                question: "When should I start my garden?",
                children: [
                    { id: "2-1", question: "Is it too late to plant a garden now?" }
                ]
            },
            {
                id: "3",
                question: "How much does it cost to start a small garden?",
                children: []
            }
        ]
    }
];

const MOCK_INSIGHTS = [
    { keyword: "best gardening tools for beginners", source: "Google", volume: 1200, cpc: 1.50 },
    { keyword: "gardening tools list with pictures", source: "Google", volume: 880, cpc: 0.90 },
    { keyword: "professional gardening tools names", source: "Bing", volume: 450, cpc: 1.20 },
    { keyword: "japanese gardening tools amazon", source: "Amazon", volume: 2100, cpc: 0.85 },
    { keyword: "gardening tools for seniors", source: "Google", volume: 320, cpc: 1.10 },
];

const MOCK_GROUPS = [
    { name: "Beginner Tools", count: 15 },
    { name: "Vegetable Planting", count: 24 },
    { name: "Soil Preparation", count: 8 },
    { name: "Pest Control", count: 12 },
];

// --- Components ---

const PAANode = ({ node, level = 0 }: { node: any, level?: number }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="select-none">
            <div
                className="flex items-center gap-2 py-1 px-2 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                style={{ marginLeft: `${level * 20}px` }}
                onClick={() => setExpanded(!expanded)}
            >
                {node.children && node.children.length > 0 ? (
                    expanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />
                ) : <div className="w-4" />}
                <span className="font-medium text-slate-700">{node.question}</span>
                <Badge variant="outline" className="ml-auto text-xs font-normal text-slate-400">Level {level}</Badge>
            </div>
            {expanded && node.children && (
                <div>
                    {node.children.map((child: any) => (
                        <PAANode key={child.id} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function InsightAnalyzerPage() {
    const [activeTab, setActiveTab] = useState("paa");
    const [isProcessing, setIsProcessing] = useState(false);
    const [paaResults, setPaaResults] = useState<any[]>([]);
    const [insightResults, setInsightResults] = useState<any[]>([]);

    const handlePAASearch = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setPaaResults(MOCK_PAA_TREE);
            setIsProcessing(false);
            toast.success("Extracted 8 PAA questions");
        }, 1500);
    };

    const handleInsightSearch = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setInsightResults(MOCK_INSIGHTS);
            setIsProcessing(false);
            toast.success("Generated 50+ insight keywords");
        }, 1500);
    };

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <Network className="h-8 w-8 text-indigo-600" />
                        Insight Analyzer
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Uncover longtail keywords, PAA insights, and generate high-ranking content.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Key className="h-4 w-4 mr-2" />
                        API Settings
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <Play className="h-4 w-4 mr-2" />
                        Quick Start
                    </Button>
                </div>
            </div>

            {/* Main Tools Area */}
            <Tabs defaultValue="paa" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white border p-1 h-14 w-full md:w-auto justify-start overflow-x-auto shadow-sm">
                    <TabsTrigger value="paa" className="h-12 px-6 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 flex gap-2">
                        <Network className="h-4 w-4" />
                        PAA Extractor
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="h-12 px-6 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 flex gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Insight Generator
                    </TabsTrigger>
                    <TabsTrigger value="groups" className="h-12 px-6 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 flex gap-2">
                        <Layers className="h-4 w-4" />
                        Group Generator
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="h-12 px-6 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 flex gap-2">
                        <Bot className="h-4 w-4" />
                        AI Content
                    </TabsTrigger>
                </TabsList>

                {/* Tool #1: PAA Extractor */}
                <TabsContent value="paa" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Controls */}
                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle>Extraction Settings</CardTitle>
                                <CardDescription>Configure your PAA search parameters.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Target Keyword</Label>
                                    <Input placeholder="e.g. organic gardening" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Depth Level</Label>
                                        <Select defaultValue="2">
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Level 1 (Basic)</SelectItem>
                                                <SelectItem value="2">Level 2 (Deep)</SelectItem>
                                                <SelectItem value="4">Level 4 (Deeper)</SelectItem>
                                                <SelectItem value="8">Level 8 (Max)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Language</Label>
                                        <Select defaultValue="en">
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="es">Spanish</SelectItem>
                                                <SelectItem value="fr">French</SelectItem>
                                                <SelectItem value="de">German</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Country</Label>
                                    <Select defaultValue="us">
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="us">United States</SelectItem>
                                            <SelectItem value="uk">United Kingdom</SelectItem>
                                            <SelectItem value="ca">Canada</SelectItem>
                                            <SelectItem value="au">Australia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button className="w-full" onClick={handlePAASearch} disabled={isProcessing}>
                                    {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                                    Extract Questions
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Results */}
                        <Card className="lg:col-span-2 min-h-[500px]">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Question Tree</CardTitle>
                                    <CardDescription>Interactive view of People Also Asked data.</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" disabled={paaResults.length === 0}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export CSV
                                    </Button>
                                    <Button variant="outline" size="sm" disabled={paaResults.length === 0}>
                                        <FileText className="h-4 w-4 mr-2" />
                                        Send to AI
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {paaResults.length > 0 ? (
                                    <div className="border rounded-lg p-4 bg-slate-50 min-h-[400px]">
                                        {paaResults.map(node => (
                                            <PAANode key={node.id} node={node} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 border-2 border-dashed rounded-lg">
                                        <Network className="h-16 w-16 mb-4 opacity-20" />
                                        <p>Enter a keyword to generate the PAA tree.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tool #2: Insight Generator */}
                <TabsContent value="insights" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle>Generator Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Seed Keyword</Label>
                                    <Input placeholder="e.g. best running shoes" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Sources</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline" size="sm" className="justify-start bg-slate-50 border-indigo-200 text-indigo-700">Google</Button>
                                        <Button variant="outline" size="sm" className="justify-start">Bing</Button>
                                        <Button variant="outline" size="sm" className="justify-start">YouTube</Button>
                                        <Button variant="outline" size="sm" className="justify-start">Amazon</Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Modifiers</Label>
                                    <Select defaultValue="questions">
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="questions">Questions (who, what, where...)</SelectItem>
                                            <SelectItem value="prepositions">Prepositions (for, with, near...)</SelectItem>
                                            <SelectItem value="comparisons">Comparisons (vs, or, like...)</SelectItem>
                                            <SelectItem value="alphabet">Alphabet (a-z)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button className="w-full" onClick={handleInsightSearch} disabled={isProcessing}>
                                    {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Lightbulb className="h-4 w-4 mr-2" />}
                                    Generate Insights
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Keyword Insights</CardTitle>
                                <CardDescription>Longtail opportunities found from autocomplete data.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {insightResults.length > 0 ? (
                                    <div className="border rounded-md">
                                        <div className="grid grid-cols-12 gap-4 p-3 bg-slate-100 font-medium text-sm border-b">
                                            <div className="col-span-6">Keyword</div>
                                            <div className="col-span-2">Source</div>
                                            <div className="col-span-2">Vol</div>
                                            <div className="col-span-2">CPC</div>
                                        </div>
                                        <div className="divide-y max-h-[500px] overflow-y-auto">
                                            {insightResults.map((item, i) => (
                                                <div key={i} className="grid grid-cols-12 gap-4 p-3 text-sm hover:bg-slate-50">
                                                    <div className="col-span-6 font-medium">{item.keyword}</div>
                                                    <div className="col-span-2 text-slate-500">{item.source}</div>
                                                    <div className="col-span-2">{item.volume}</div>
                                                    <div className="col-span-2">${item.cpc.toFixed(2)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 border-2 border-dashed rounded-lg">
                                        <Lightbulb className="h-16 w-16 mb-4 opacity-20" />
                                        <p>Run the generator to uncover hidden keywords.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tool #3: Group Generator */}
                <TabsContent value="groups" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Input Keywords</CardTitle>
                                <CardDescription>Paste your list of keywords to group.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea className="min-h-[300px]" placeholder="Paste keywords here (one per line)..." />
                                <Button className="w-full">
                                    <Layers className="h-4 w-4 mr-2" />
                                    Group Keywords
                                </Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Keyword Groups</CardTitle>
                                <CardDescription>Semantically grouped clusters.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    {MOCK_GROUPS.map((group, i) => (
                                        <div key={i} className="border rounded p-4 hover:shadow-sm transition-shadow bg-slate-50 cursor-pointer">
                                            <div className="font-semibold text-lg mb-1">{group.name}</div>
                                            <div className="text-sm text-slate-500">{group.count} keywords</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tool #4: AI Content */}
                <TabsContent value="ai" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Content Generator</CardTitle>
                            <CardDescription>Turn your insights into high-ranking content.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Topic / Question</Label>
                                        <Input placeholder="e.g. How to start a garden" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Content Type</Label>
                                        <Select defaultValue="article">
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="article">Long-form Article</SelectItem>
                                                <SelectItem value="listicle">Listicle</SelectItem>
                                                <SelectItem value="guide">How-to Guide</SelectItem>
                                                <SelectItem value="faq">FAQ Section</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tone</Label>
                                        <Select defaultValue="informative">
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="informative">Informative</SelectItem>
                                                <SelectItem value="casual">Casual</SelectItem>
                                                <SelectItem value="professional">Professional</SelectItem>
                                                <SelectItem value="persuasive">Persuasive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                        <Bot className="h-4 w-4 mr-2" />
                                        Generate Content
                                    </Button>
                                </div>
                                <div className="border rounded-lg bg-slate-50 p-4 min-h-[300px] flex items-center justify-center text-slate-400">
                                    Generated content will appear here...
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
