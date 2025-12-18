"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Globe, Search, TrendingUp, DollarSign, BarChart2, Loader2, Download, Copy, Settings, List, Plus, CheckSquare, Square, Bot, Eye, ArrowRight, Target, Zap, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { getKeywordSuggestions, analyzeKeywordWithAI, generateMoreContentIdeas } from "@/lib/actions/keyword.actions";


import { createKeywordList, getUserKeywordLists, addKeywordsToList } from "@/lib/actions/keyword-list.actions";
import { getSerpAnalysis, type SerpAnalysisResult } from "@/lib/actions/serp.actions";
import { getCompetitorAnalysis, getKeywordGapAnalysis, type CompetitorAnalysisResult, type KeywordGapResult } from "@/lib/actions/competitor.actions";
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function KeywordExplorerPage() {
    // --- Discovery State ---
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isDeepSearch, setIsDeepSearch] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [searchedKeyword, setSearchedKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [apiKey, setApiKey] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
    const [userLists, setUserLists] = useState<any[]>([]);
    const [isListDialogOpen, setIsListDialogOpen] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [selectedListId, setSelectedListId] = useState("");
    const [matchType, setMatchType] = useState<'broad' | 'phrase' | 'exact'>('broad');
    const [includeQuestions, setIncludeQuestions] = useState(false);
    const [includePrepositions, setIncludePrepositions] = useState(false);
    const [serpData, setSerpData] = useState<SerpAnalysisResult | null>(null);
    const [isSerpOpen, setIsSerpOpen] = useState(false);
    const [isAnalyzingSerp, setIsAnalyzingSerp] = useState(false);
    const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
    const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
    const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
    const [analyzingKeyword, setAnalyzingKeyword] = useState("");

    // --- Competitor State ---
    const [compDomain, setCompDomain] = useState("");
    const [myDomain, setMyDomain] = useState("");
    const [compResults, setCompResults] = useState<CompetitorAnalysisResult | null>(null);
    const [gapResults, setGapResults] = useState<KeywordGapResult | null>(null);
    const [isAnalyzingComp, setIsAnalyzingComp] = useState(false);
    const [activeGapTab, setActiveGapTab] = useState("shared");

    useEffect(() => {
        loadUserLists();
    }, []);

    const loadUserLists = async () => {
        const lists = await getUserKeywordLists();
        setUserLists(lists);
    };

    // --- Discovery Handlers ---
    const handleSearch = async () => {
        if (!query) return;
        setIsSearching(true);
        setSearchedKeyword(query);
        setCurrentPage(1);
        setSelectedKeywords(new Set());

        try {
            const options = {
                deep: isDeepSearch,
                questions: includeQuestions,
                prepositions: includePrepositions,
                matchType,
                apiKey
            };
            const data = await getKeywordSuggestions(query, options);
            setResults(data);
            if (data.length === 0) {
                toast.info("No suggestions found. Try a broader term.");
            } else {
                toast.success(`Found ${data.length} keyword ideas`);
            }
        } catch (error) {
            toast.error("Failed to fetch keywords");
        } finally {
            setIsSearching(false);
        }
    };

    const handleAnalyzeSerp = async (keyword: string) => {
        setIsAnalyzingSerp(true);
        setIsSerpOpen(true);
        setSerpData(null);
        try {
            const data = await getSerpAnalysis(keyword);
            setSerpData(data);
        } catch (error) {
            toast.error("Failed to analyze SERP");
        } finally {
            setIsAnalyzingSerp(false);
        }
    };

    const handleAiAnalyze = async (keyword: string) => {
        setIsAnalyzingAI(true);
        setAnalyzingKeyword(keyword);
        setIsAiDialogOpen(true);
        setAiAnalysisResult(null);
        try {
            const result = await analyzeKeywordWithAI(keyword);
            setAiAnalysisResult(result);
        } catch (error) {
            toast.error("Failed to analyze keyword with AI");
            setIsAiDialogOpen(false);
        } finally {
            setIsAnalyzingAI(false);
        }
    };

    const handleCreateContent = (topic: string, metadata?: any, contentType?: string) => {
        const params = new URLSearchParams();
        params.set('topic', topic);
        if (metadata) {
            if (metadata.intent) params.set('intent', metadata.intent);
            if (metadata.audience) params.set('audience', metadata.audience);
            if (metadata.keywords) params.set('keywords', metadata.keywords);
        }

        // Map content type to category
        if (contentType) {
            if (contentType.toLowerCase().includes('blog')) params.set('category', 'Written Content');
            else if (contentType.toLowerCase().includes('video')) params.set('category', 'Video Content');
            else if (contentType.toLowerCase().includes('guide')) params.set('category', 'Written Content');
            else if (contentType.toLowerCase().includes('social')) params.set('category', 'Social Media');
            else if (contentType.toLowerCase().includes('email')) params.set('category', 'Email Content');
        }

        // Open in new tab
        window.open(`/tools/content-planner/create?${params.toString()}`, '_blank');
    };

    const handleGetMoreIdeas = async () => {
        if (!analyzingKeyword || !aiAnalysisResult) return;

        setIsAnalyzingAI(true);
        try {
            const existingTitles = aiAnalysisResult.contentIdeas.map((idea: any) => idea.title);
            const newIdeas = await generateMoreContentIdeas(analyzingKeyword, existingTitles);

            if (newIdeas && newIdeas.length > 0) {
                setAiAnalysisResult((prev: any) => ({
                    ...prev,
                    contentIdeas: [...prev.contentIdeas, ...newIdeas]
                }));
                toast.success("Added new content ideas");
            } else {
                toast.info("No new unique ideas found");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate more ideas");
        } finally {
            setIsAnalyzingAI(false);
        }
    };

    const handleDownloadAnalysisPDF = async (keyword: string, result: any) => {
        try {
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF();

            doc.setFontSize(20);
            doc.text(`Keyword Analysis: ${keyword}`, 20, 20);

            doc.setFontSize(14);
            doc.text("Search Intent", 20, 40);
            doc.setFontSize(12);
            doc.text(doc.splitTextToSize(result.searchIntent, 170), 20, 50);

            doc.setFontSize(14);
            doc.text("Target Audience", 20, 80);
            doc.setFontSize(12);
            doc.text(doc.splitTextToSize(result.targetAudience, 170), 20, 90);

            doc.setFontSize(14);
            doc.text("Content Ideas", 20, 120);
            let y = 130;
            result.contentIdeas.forEach((idea: any) => {
                doc.setFontSize(12);
                doc.text(`• ${idea.title} (${idea.type})`, 20, y);
                y += 10;
            });

            y += 10;
            doc.setFontSize(14);
            doc.text("Secondary Keywords", 20, y);
            y += 10;
            doc.setFontSize(12);
            const keywords = result.secondaryKeywords?.join(", ") || "None";
            doc.text(doc.splitTextToSize(keywords, 170), 20, y);

            y += 20;
            doc.setFontSize(14);
            doc.text("Monetization Ideas", 20, y);
            y += 10;
            doc.setFontSize(12);
            const monetization = result.monetizationIdeas?.join(", ") || "None";
            doc.text(doc.splitTextToSize(monetization, 170), 20, y);

            y += 20;
            doc.setFontSize(14);
            doc.text("Difficulty Analysis", 20, y);
            y += 10;
            doc.setFontSize(10);
            doc.setFont("helvetica", 'italic');
            doc.text(doc.splitTextToSize(`"${result.difficultyAnalysis}"`, 170), 20, y);

            // Footer Blurb
            y = 280; // Bottom of page
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text("Generated by KBusiness Keyword Explorer", 105, y, { align: "center" });

            doc.save(`${keyword.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_analysis.pdf`);
            toast.success("Report downloaded");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate PDF");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const toggleKeywordSelection = (keyword: string) => {
        const newSelection = new Set(selectedKeywords);
        if (newSelection.has(keyword)) {
            newSelection.delete(keyword);
        } else {
            newSelection.add(keyword);
        }
        setSelectedKeywords(newSelection);
    };

    const toggleSelectAll = () => {
        if (selectedKeywords.size === currentItems.length) {
            setSelectedKeywords(new Set());
        } else {
            const newSelection = new Set(selectedKeywords);
            currentItems.forEach(item => newSelection.add(item.keyword));
            setSelectedKeywords(newSelection);
        }
    };

    const handleCreateList = async () => {
        if (!newListName) return;
        try {
            const newList = await createKeywordList(newListName);
            setUserLists([newList, ...userLists]);
            setSelectedListId(newList._id);
            setNewListName("");
            toast.success("List created");
        } catch (error) {
            toast.error("Failed to create list");
        }
    };

    const handleAddToList = async () => {
        if (!selectedListId) {
            toast.error("Please select a list");
            return;
        }
        const keywordsToAdd = results.filter(r => selectedKeywords.has(r.keyword));
        try {
            const result = await addKeywordsToList(selectedListId, keywordsToAdd);
            toast.success(`Added ${result.addedCount} keywords to list`);
            setIsListDialogOpen(false);
            setSelectedKeywords(new Set());
        } catch (error) {
            toast.error("Failed to add keywords to list");
        }
    };

    // --- Competitor Handlers ---
    const handleCompetitorAnalysis = async () => {
        if (!compDomain) return;
        setIsAnalyzingComp(true);
        setCompResults(null);
        setGapResults(null);
        try {
            const data = await getCompetitorAnalysis(compDomain);
            setCompResults(data);

            if (myDomain) {
                const gapData = await getKeywordGapAnalysis(myDomain, compDomain);
                setGapResults(gapData);
            }
            toast.success("Competitor analysis complete");
        } catch (error) {
            toast.error("Failed to analyze competitor");
        } finally {
            setIsAnalyzingComp(false);
        }
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(results.length / itemsPerPage);

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <Globe className="h-8 w-8 text-blue-600" />
                        Keyword Explorer
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Discover profitable keywords and analyze competitors.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => toast.info("AI Ideas coming soon!")}>
                        <Bot className="h-4 w-4 mr-2" />
                        AI Ideas
                    </Button>
                    <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
                        <Settings className="h-4 w-4 mr-2" />
                        API Settings
                    </Button>
                </div>
            </div>

            {/* API Settings */}
            {showSettings && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-blue-900">Keywords Everywhere API Key (Optional)</label>
                            <div className="flex gap-2">
                                <Input
                                    type="password"
                                    placeholder="Enter your API key to fetch real volume/CPC data..."
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="bg-white"
                                />
                                <Button variant="secondary" onClick={() => setShowSettings(false)}>Save</Button>
                            </div>
                            <p className="text-xs text-blue-700">
                                Without an API key, we will show estimated mock data for demonstration.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Tabs defaultValue="discovery" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="discovery">Keyword Discovery</TabsTrigger>
                    <TabsTrigger value="competitor">Competitor Analysis</TabsTrigger>
                </TabsList>

                {/* --- DISCOVERY TAB --- */}
                <TabsContent value="discovery" className="space-y-6">
                    {/* Search Bar & Options */}
                    <Card className="border-slate-200 shadow-sm bg-slate-50/50">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex gap-4 max-w-4xl mx-auto">
                                <Input
                                    placeholder="Enter seed keywords (comma separated)..."
                                    className="h-12 text-lg bg-white"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700" onClick={handleSearch} disabled={isSearching}>
                                    {isSearching ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="h-4 w-4 mr-2" />
                                            Search
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Label>Match Type:</Label>
                                    <Select value={matchType} onValueChange={(v: any) => setMatchType(v)}>
                                        <SelectTrigger className="h-8 w-[100px] bg-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="broad">Broad</SelectItem>
                                            <SelectItem value="phrase">Phrase</SelectItem>
                                            <SelectItem value="exact">Exact</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="deepSearch"
                                        checked={isDeepSearch}
                                        onChange={(e) => setIsDeepSearch(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="deepSearch" className="cursor-pointer select-none">
                                        Alphabet Soup (A-Z, 0-9)
                                    </label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="questions"
                                        checked={includeQuestions}
                                        onChange={(e) => setIncludeQuestions(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="questions" className="cursor-pointer select-none">
                                        Questions (Who, What...)
                                    </label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="prepositions"
                                        checked={includePrepositions}
                                        onChange={(e) => setIncludePrepositions(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="prepositions" className="cursor-pointer select-none">
                                        Prepositions (For, With...)
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {results.length > 0 && (
                        <div className="space-y-6">
                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500">Total Keywords</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{results.length.toLocaleString()}</div>
                                        <div className="text-xs text-slate-500 flex items-center mt-1">
                                            Variations found
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500">Avg. Difficulty</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{Math.round(results.reduce((acc, curr) => acc + curr.difficulty, 0) / results.length)}%</div>
                                        <div className="text-xs text-slate-500 flex items-center mt-1">
                                            Competition Level
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500">Avg. CPC</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">${(results.reduce((acc, curr) => acc + parseFloat(curr.cpc), 0) / results.length).toFixed(2)}</div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            Average bid
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500">Total Volume</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{results.reduce((acc, curr) => acc + curr.volume, 0).toLocaleString()}</div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            Combined traffic
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Main Results Table */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Keyword Variations</CardTitle>
                                        <CardDescription>
                                            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, results.length)} of {results.length} keywords related to "{searchedKeyword}"
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" disabled={selectedKeywords.size === 0}>
                                                    <List className="h-4 w-4 mr-2" />
                                                    Add to List ({selectedKeywords.size})
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add Keywords to List</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label>Select Existing List</Label>
                                                        <Select value={selectedListId} onValueChange={setSelectedListId}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a list..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {userLists.map(list => (
                                                                    <SelectItem key={list._id} value={list._id}>{list.name} ({list.keywords.length})</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="relative">
                                                        <div className="absolute inset-0 flex items-center">
                                                            <span className="w-full border-t" />
                                                        </div>
                                                        <div className="relative flex justify-center text-xs uppercase">
                                                            <span className="bg-background px-2 text-muted-foreground">Or create new</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>New List Name</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                placeholder="My Awesome List"
                                                                value={newListName}
                                                                onChange={(e) => setNewListName(e.target.value)}
                                                            />
                                                            <Button size="icon" onClick={handleCreateList} disabled={!newListName}>
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button onClick={handleAddToList} disabled={!selectedListId}>
                                                        Add Keywords
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="outline" size="sm">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export CSV
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[50px]">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleSelectAll}>
                                                        {selectedKeywords.size > 0 && selectedKeywords.size === currentItems.length ? (
                                                            <CheckSquare className="h-4 w-4" />
                                                        ) : (
                                                            <Square className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="w-[30%]">Keyword</TableHead>
                                                <TableHead>Intent</TableHead>
                                                <TableHead>Volume</TableHead>
                                                <TableHead>Traffic Pot.</TableHead>
                                                <TableHead>KD %</TableHead>
                                                <TableHead>CPC</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentItems.map((item, i) => (
                                                <TableRow key={i} className="group">
                                                    <TableCell>
                                                        <div
                                                            className="cursor-pointer"
                                                            onClick={() => toggleKeywordSelection(item.keyword)}
                                                        >
                                                            {selectedKeywords.has(item.keyword) ? (
                                                                <CheckSquare className="h-4 w-4 text-blue-600" />
                                                            ) : (
                                                                <Square className="h-4 w-4 text-slate-300" />
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-blue-600 hover:underline cursor-pointer">
                                                                {item.keyword}
                                                            </span>
                                                            <span className="text-xs text-slate-400">
                                                                {item.contentType} • {item.funnelStage}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={
                                                            (typeof item.intent === 'string' ? item.intent : (item.intent as any)?.intent) === 'Transactional' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                                                (typeof item.intent === 'string' ? item.intent : (item.intent as any)?.intent) === 'Commercial' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                                    'bg-slate-100 text-slate-700 border-slate-200'
                                                        }>
                                                            {typeof item.intent === 'string' ? item.intent : (item.intent as any)?.intent || 'Informational'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{item.volume.toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span>{item.trafficPotential.toLocaleString()}</span>
                                                            <span className="text-[10px] text-slate-400">~{item.ctrEstimate}% CTR</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={item.difficulty > 70 ? "destructive" : item.difficulty > 40 ? "secondary" : "outline"} className={item.difficulty <= 40 ? "bg-green-100 text-green-800 border-green-200" : ""}>
                                                                {item.difficulty}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span>${item.cpc}</span>
                                                            <span className="text-[10px] text-slate-400">
                                                                Score: {item.monetizationScore}/100
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button variant="ghost" size="icon" onClick={() => handleAiAnalyze(item.keyword)} title="AI Analysis">
                                                                <Bot className="h-4 w-4 text-indigo-500 hover:text-indigo-700" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => handleCreateContent(item.keyword)} title="Create Content">
                                                                <Sparkles className="h-4 w-4 text-pink-500 hover:text-pink-700" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => handleAnalyzeSerp(item.keyword)} title="Analyze SERP">
                                                                <Eye className="h-4 w-4 text-slate-400 hover:text-blue-600" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(item.keyword)} title="Copy">
                                                                <Copy className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="text-sm text-slate-500">
                                                Page {currentPage} of {totalPages}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                    disabled={currentPage === 1}
                                                >
                                                    Previous
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                {/* --- COMPETITOR TAB --- */}
                <TabsContent value="competitor" className="space-y-6">
                    <Card className="border-slate-200 shadow-sm bg-slate-50/50">
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                                <div className="space-y-2">
                                    <Label>Competitor Domain</Label>
                                    <Input
                                        placeholder="example.com"
                                        className="h-12 text-lg bg-white"
                                        value={compDomain}
                                        onChange={(e) => setCompDomain(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Your Domain (Optional for Gap Analysis)</Label>
                                    <Input
                                        placeholder="mydomain.com"
                                        className="h-12 text-lg bg-white"
                                        value={myDomain}
                                        onChange={(e) => setMyDomain(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <Button className="h-12 px-8 bg-purple-600 hover:bg-purple-700" onClick={handleCompetitorAnalysis} disabled={isAnalyzingComp || !compDomain}>
                                    {isAnalyzingComp ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Analyzing Competitor...
                                        </>
                                    ) : (
                                        <>
                                            <Target className="h-4 w-4 mr-2" />
                                            Analyze Competitor
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {compResults && (
                        <div className="space-y-6">
                            {/* Competitor Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500">Domain Authority</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{compResults.domainAuthority}</div>
                                        <Progress value={compResults.domainAuthority} className="h-2 mt-2" />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500">Organic Traffic</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{compResults.organicTraffic.toLocaleString()}</div>
                                        <div className="text-xs text-slate-500 mt-1">Est. monthly visits</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500">Organic Keywords</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{compResults.organicKeywords.toLocaleString()}</div>
                                        <div className="text-xs text-slate-500 mt-1">Ranking keywords</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500">Paid Traffic</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{compResults.paidTraffic.toLocaleString()}</div>
                                        <div className="text-xs text-slate-500 mt-1">Est. paid visits</div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Traffic History Chart */}
                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Traffic History</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={compResults.trafficHistory}>
                                                <defs>
                                                    <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="organic" stroke="#8884d8" fillOpacity={1} fill="url(#colorOrganic)" />
                                                <Area type="monotone" dataKey="paid" stroke="#82ca9d" fillOpacity={0.3} fill="#82ca9d" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                {/* Top Pages */}
                                <Card className="lg:col-span-1">
                                    <CardHeader>
                                        <CardTitle>Top Pages</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {compResults.topPages.map((page, i) => (
                                                <div key={i} className="flex flex-col space-y-1 border-b pb-2 last:border-0">
                                                    <a href={page.url} target="_blank" className="text-sm font-medium text-blue-600 hover:underline truncate">
                                                        {page.url.replace(`https://${compResults.domain}`, '')}
                                                    </a>
                                                    <div className="flex justify-between text-xs text-slate-500">
                                                        <span>Top Kw: {page.topKeyword}</span>
                                                        <span>{page.estimatedTraffic.toLocaleString()} visits</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Top Keywords Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Organic Keywords</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Keyword</TableHead>
                                                <TableHead>Pos</TableHead>
                                                <TableHead>Volume</TableHead>
                                                <TableHead>KD</TableHead>
                                                <TableHead>Traffic</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {compResults.topKeywords.map((kw, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="font-medium">{kw.keyword}</TableCell>
                                                    <TableCell>{kw.position}</TableCell>
                                                    <TableCell>{kw.volume.toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={kw.difficulty > 50 ? "secondary" : "outline"}>{kw.difficulty}</Badge>
                                                    </TableCell>
                                                    <TableCell>{kw.traffic.toLocaleString()}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            {/* Keyword Gap Analysis */}
                            {gapResults && (
                                <Card className="border-purple-200 bg-purple-50/30">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Zap className="h-5 w-5 text-purple-600" />
                                            Keyword Gap Analysis
                                        </CardTitle>
                                        <CardDescription>
                                            Comparing <strong>{myDomain}</strong> vs <strong>{compDomain}</strong>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Tabs value={activeGapTab} onValueChange={setActiveGapTab}>
                                            <TabsList className="grid w-full grid-cols-5">
                                                <TabsTrigger value="shared">Shared ({gapResults.shared.length})</TabsTrigger>
                                                <TabsTrigger value="missing">Missing ({gapResults.missing.length})</TabsTrigger>
                                                <TabsTrigger value="weak">Weak ({gapResults.weak.length})</TabsTrigger>
                                                <TabsTrigger value="strong">Strong ({gapResults.strong.length})</TabsTrigger>
                                                <TabsTrigger value="unique">Unique ({gapResults.unique.length})</TabsTrigger>
                                            </TabsList>

                                            {['shared', 'missing', 'weak', 'strong', 'unique'].map((tab) => (
                                                <TabsContent key={tab} value={tab} className="mt-4">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Keyword</TableHead>
                                                                <TableHead>Volume</TableHead>
                                                                <TableHead>KD</TableHead>
                                                                <TableHead>Competitor URL</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {(gapResults as any)[tab].map((kw: any, i: number) => (
                                                                <TableRow key={i}>
                                                                    <TableCell className="font-medium">{kw.keyword}</TableCell>
                                                                    <TableCell>{kw.volume.toLocaleString()}</TableCell>
                                                                    <TableCell>{kw.difficulty}</TableCell>
                                                                    <TableCell className="text-xs text-slate-500 truncate max-w-[200px]">{kw.url}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TabsContent>
                                            ))}
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* AI Analysis Dialog */}
            <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="flex items-center gap-2">
                                <Bot className="h-5 w-5 text-indigo-600" />
                                AI Analysis: {analyzingKeyword}
                            </DialogTitle>
                            {aiAnalysisResult && (
                                <Button variant="outline" size="sm" onClick={() => handleDownloadAnalysisPDF(analyzingKeyword, aiAnalysisResult)}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Report
                                </Button>
                            )}
                        </div>
                    </DialogHeader>

                    {isAnalyzingAI ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
                            <p className="text-slate-500">Analyzing keyword intent and strategy...</p>
                        </div>
                    ) : aiAnalysisResult ? (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="bg-indigo-50 border-indigo-100">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-indigo-900">Search Intent</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-indigo-800">{aiAnalysisResult.searchIntent}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-pink-50 border-pink-100">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-pink-900">Target Audience</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-pink-800">{aiAnalysisResult.targetAudience}</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-yellow-500" />
                                    Content Ideas
                                </h3>
                                <div className="grid gap-3">
                                    {aiAnalysisResult.contentIdeas?.map((idea: any, i: number) => (
                                        <div key={i} className="p-3 border rounded-lg hover:bg-slate-50 flex justify-between items-center group">
                                            <div>
                                                <div className="font-medium">{idea.title}</div>
                                                <div className="text-xs text-slate-500">{idea.type}</div>
                                            </div>
                                            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100" onClick={() => handleCreateContent(idea.title, {
                                                intent: aiAnalysisResult.searchIntent,
                                                audience: aiAnalysisResult.targetAudience,
                                                keywords: aiAnalysisResult.secondaryKeywords?.join(", ")
                                            }, idea.type)}>
                                                Create This
                                            </Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full mt-2" onClick={handleGetMoreIdeas}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Get More Ideas
                                    </Button>

                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm text-slate-500 uppercase">Secondary Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {aiAnalysisResult.secondaryKeywords?.map((kw: string, i: number) => (
                                            <Badge key={i} variant="secondary">{kw}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm text-slate-500 uppercase">Monetization</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {aiAnalysisResult.monetizationIdeas?.map((idea: string, i: number) => (
                                            <Badge key={i} variant="outline" className="border-green-200 bg-green-50 text-green-700">{idea}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 italic">
                                "{aiAnalysisResult.difficultyAnalysis}"
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            Failed to load analysis.
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* SERP Analysis Sheet (Shared) */}
            <Sheet open={isSerpOpen} onOpenChange={setIsSerpOpen}>
                <SheetContent className="min-w-[800px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5 text-blue-600" />
                            SERP Analysis: {serpData?.keyword}
                        </SheetTitle>
                        <SheetDescription>
                            Top 10 ranking pages and competitive metrics.
                        </SheetDescription>
                    </SheetHeader>

                    {isAnalyzingSerp ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                            <p className="text-slate-500">Analyzing search results...</p>
                        </div>
                    ) : serpData ? (
                        <div className="mt-6 space-y-6">
                            {/* SERP Features */}
                            <div className="flex gap-2 flex-wrap">
                                {serpData.features.featuredSnippet && (
                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                        Featured Snippet
                                    </Badge>
                                )}
                                {serpData.features.peopleAlsoAsk.length > 0 && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                                        People Also Ask
                                    </Badge>
                                )}
                                {serpData.features.videoCarousel && (
                                    <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                                        Video Pack
                                    </Badge>
                                )}
                                {serpData.features.imagePack && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                                        Image Pack
                                    </Badge>
                                )}
                            </div>

                            {/* Difficulty Score */}
                            <Card className="bg-slate-50">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">SERP Difficulty</p>
                                        <p className="text-2xl font-bold text-slate-900">{serpData.difficultyScore}/100</p>
                                    </div>
                                    <div className="w-1/2">
                                        <Progress value={serpData.difficultyScore} className="h-2" />
                                        <p className="text-xs text-slate-400 mt-1 text-right">Based on DA of top 10</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Ranking Table */}
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">#</TableHead>
                                            <TableHead className="w-[40%]">Result</TableHead>
                                            <TableHead>DA</TableHead>
                                            <TableHead>PA</TableHead>
                                            <TableHead>Links</TableHead>
                                            <TableHead>Words</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {serpData.results.map((result) => (
                                            <TableRow key={result.position}>
                                                <TableCell className="font-medium">{result.position}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <a href={result.url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline line-clamp-1">
                                                            {result.title}
                                                        </a>
                                                        <p className="text-xs text-green-700 line-clamp-1">{result.url}</p>
                                                        <div className="flex gap-1 mt-1">
                                                            {result.keywordInTitle && <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">Title Match</Badge>}
                                                            {result.keywordInUrl && <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">URL Match</Badge>}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className={`font-bold ${result.da > 50 ? 'text-green-600' : result.da > 30 ? 'text-yellow-600' : 'text-slate-600'}`}>
                                                        {result.da}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{result.pa}</TableCell>
                                                <TableCell>{result.backlinks.toLocaleString()}</TableCell>
                                                <TableCell>{result.wordCount.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* PAA Section */}
                            {serpData.features.peopleAlsoAsk.length > 0 && (
                                <div>
                                    <h3 className="font-medium mb-2">People Also Ask</h3>
                                    <div className="space-y-2">
                                        {serpData.features.peopleAlsoAsk.map((q, i) => (
                                            <div key={i} className="p-3 bg-slate-50 rounded border text-sm">
                                                {q}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </SheetContent>
            </Sheet>
        </div >
    );
}
