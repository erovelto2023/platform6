"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Download, Filter, Eye, Heart, Share2, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { searchPins } from "@/lib/actions/pinterest.actions";

// Mock Data for Demonstration
const MOCK_PINS = [
    { id: 1, title: "10 Healthy Dinner Ideas", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80", saves: 12500, repins: 3400, comments: 45, score: 98, trend: "up" },
    { id: 2, title: "Minimalist Living Room Decor", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80", saves: 8900, repins: 2100, comments: 32, score: 92, trend: "up" },
    { id: 3, title: "Summer Fashion Trends 2025", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80", saves: 15600, repins: 5600, comments: 120, score: 99, trend: "up" },
    { id: 4, title: "Easy DIY Garden Projects", image: "https://images.unsplash.com/photo-1416879115533-1963fa35beac?w=300&q=80", saves: 4500, repins: 890, comments: 15, score: 85, trend: "stable" },
    { id: 5, title: "Keto Diet Meal Plan", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&q=80", saves: 22000, repins: 8900, comments: 340, score: 100, trend: "up" },
];

const MOCK_KEYWORDS = [
    { keyword: "healthy dinner ideas", volume: "450K", competition: "High", cpc: "$1.20" },
    { keyword: "easy dinner recipes", volume: "300K", competition: "Medium", cpc: "$0.85" },
    { keyword: "weeknight dinners", volume: "150K", competition: "Low", cpc: "$0.50" },
    { keyword: "vegetarian dinner", volume: "200K", competition: "Medium", cpc: "$0.95" },
    { keyword: "quick meals", volume: "180K", competition: "Medium", cpc: "$0.75" },
];

export default function PinInspectorPage() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("pins");

    const handleSearch = async () => {
        if (!query) return;
        setIsSearching(true);

        try {
            const apiResults = await searchPins(query);

            if (apiResults && apiResults.length > 0) {
                setResults(apiResults);
                toast.success(`Found ${apiResults.length} pins from API`);
            } else {
                // Fallback to mock for demo if API returns nothing (common in empty sandbox)
                console.log("API returned 0 results, using mock data");
                const mockFiltered = MOCK_PINS.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));
                setResults(mockFiltered.length > 0 ? mockFiltered : MOCK_PINS);
                toast.info("Showing demo data (No API results found in sandbox)");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch from Pinterest API");
            setResults(MOCK_PINS);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <Search className="h-8 w-8 text-red-600" />
                        Pin Inspector
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Uncover top-performing pins, boards, and keywords to explode your traffic.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                    <Button variant="default" className="bg-red-600 hover:bg-red-700">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Trends
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex gap-2">
                            <Input
                                placeholder="Enter a keyword (e.g. 'home decor', 'fitness')..."
                                className="h-12 text-lg"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select defaultValue="us">
                                <SelectTrigger className="w-[140px] h-12">
                                    <SelectValue placeholder="Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="us">United States</SelectItem>
                                    <SelectItem value="uk">United Kingdom</SelectItem>
                                    <SelectItem value="ca">Canada</SelectItem>
                                    <SelectItem value="au">Australia</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button className="h-12 px-8 bg-slate-900 hover:bg-slate-800" onClick={handleSearch} disabled={isSearching}>
                                {isSearching ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="h-4 w-4 mr-2" />
                                        Analyze
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Area */}
            <Tabs defaultValue="pins" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white border p-1 h-12 w-full md:w-auto justify-start overflow-x-auto">
                    <TabsTrigger value="pins" className="h-10 px-6 data-[state=active]:bg-red-50 data-[state=active]:text-red-700">Top Pins</TabsTrigger>
                    <TabsTrigger value="boards" className="h-10 px-6 data-[state=active]:bg-red-50 data-[state=active]:text-red-700">Boards</TabsTrigger>
                    <TabsTrigger value="people" className="h-10 px-6 data-[state=active]:bg-red-50 data-[state=active]:text-red-700">People</TabsTrigger>
                    <TabsTrigger value="keywords" className="h-10 px-6 data-[state=active]:bg-red-50 data-[state=active]:text-red-700">Keywords</TabsTrigger>
                    <TabsTrigger value="trends" className="h-10 px-6 data-[state=active]:bg-red-50 data-[state=active]:text-red-700">Trends</TabsTrigger>
                </TabsList>

                <TabsContent value="pins" className="space-y-6">
                    {/* Filters */}
                    <div className="flex gap-4 items-center pb-4 overflow-x-auto">
                        <Button variant="outline" size="sm" className="h-8 border-dashed">
                            <Filter className="h-3 w-3 mr-2" />
                            Filter Results
                        </Button>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200">Saves &gt; 1000</Badge>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200">Last 30 Days</Badge>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200">Has Video</Badge>
                    </div>

                    {/* Pins Grid/Table */}
                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                            {results.map((pin) => (
                                <Card key={pin.id} className="group hover:shadow-md transition-all overflow-hidden border-slate-200">
                                    <div className="relative aspect-[2/3] bg-slate-100 overflow-hidden">
                                        <img src={pin.image} alt={pin.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                                            Score: {pin.score}
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-3 h-12 leading-snug">
                                            {pin.title}
                                        </h3>

                                        <div className="grid grid-cols-3 gap-2 text-center mb-4">
                                            <div className="bg-slate-50 p-2 rounded">
                                                <div className="text-xs text-slate-500 mb-1 flex justify-center"><Heart className="h-3 w-3" /></div>
                                                <div className="font-bold text-sm">{pin.saves.toLocaleString()}</div>
                                            </div>
                                            <div className="bg-slate-50 p-2 rounded">
                                                <div className="text-xs text-slate-500 mb-1 flex justify-center"><Share2 className="h-3 w-3" /></div>
                                                <div className="font-bold text-sm">{pin.repins.toLocaleString()}</div>
                                            </div>
                                            <div className="bg-slate-50 p-2 rounded">
                                                <div className="text-xs text-slate-500 mb-1 flex justify-center"><MessageCircle className="h-3 w-3" /></div>
                                                <div className="font-bold text-sm">{pin.comments}</div>
                                            </div>
                                        </div>

                                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white h-8 text-xs" variant="default">
                                            View on Pinterest <ExternalLink className="h-3 w-3 ml-2" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">Enter a keyword to start analyzing</h3>
                            <p className="text-slate-500">We'll find the best performing content for you.</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="keywords">
                    <Card>
                        <CardHeader>
                            <CardTitle>Related Keywords</CardTitle>
                            <CardDescription>High volume search terms related to your query.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Keyword</TableHead>
                                        <TableHead>Search Volume</TableHead>
                                        <TableHead>Competition</TableHead>
                                        <TableHead>CPC</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_KEYWORDS.map((kw, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium">{kw.keyword}</TableCell>
                                            <TableCell>{kw.volume}</TableCell>
                                            <TableCell>
                                                <Badge variant={kw.competition === "High" ? "destructive" : kw.competition === "Medium" ? "secondary" : "outline"}>
                                                    {kw.competition}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{kw.cpc}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">Copy</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="boards">
                    <div className="text-center py-20 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                        <p className="text-slate-500">Board analysis coming soon.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
