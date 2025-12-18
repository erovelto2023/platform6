"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    Plus,
    Star,
    MoreHorizontal,
    Copy,
    Trash2,
    Edit,
    Wand2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { toggleHeadlineFavorite, deleteHeadline } from "@/lib/actions/headline.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeadlineVaultClientProps {
    initialHeadlines: any[];
}

export default function HeadlineVaultClient({ initialHeadlines }: HeadlineVaultClientProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [platformFilter, setPlatformFilter] = useState<string | null>(null);
    const [emotionFilter, setEmotionFilter] = useState<string | null>(null);
    const [showFavorites, setShowFavorites] = useState(false);

    const filteredHeadlines = initialHeadlines.filter(headline => {
        const matchesQuery = headline.text.toLowerCase().includes(query.toLowerCase()) ||
            (headline.subheadline && headline.subheadline.toLowerCase().includes(query.toLowerCase()));
        const matchesPlatform = platformFilter ? headline.platform === platformFilter : true;
        const matchesEmotion = emotionFilter ? headline.emotion === emotionFilter : true;
        const matchesFavorite = showFavorites ? headline.isFavorite : true;

        return matchesQuery && matchesPlatform && matchesEmotion && matchesFavorite;
    });

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Headline copied!");
    };

    const handleToggleFavorite = async (id: string) => {
        try {
            await toggleHeadlineFavorite(id);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update favorite");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this headline?")) return;
        try {
            await deleteHeadline(id);
            toast.success("Headline deleted");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-indigo-100 font-medium mb-1">Total Headlines</p>
                                <h3 className="text-3xl font-bold">{initialHeadlines.length}</h3>
                            </div>
                            <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Copy className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 font-medium mb-1">Favorites</p>
                                <h3 className="text-3xl font-bold text-slate-900">
                                    {initialHeadlines.filter(h => h.isFavorite).length}
                                </h3>
                            </div>
                            <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                                <Star className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-dashed border-2 flex items-center justify-center p-6 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => router.push('/headlines/generate')}>
                    <div className="text-center">
                        <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Wand2 className="h-5 w-5" />
                        </div>
                        <p className="font-semibold text-indigo-600">Generate New</p>
                        <p className="text-xs text-slate-500">Using AI Frameworks</p>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1 w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search your vault..."
                        className="pl-10"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Select value={platformFilter || "all"} onValueChange={(val) => setPlatformFilter(val === "all" ? null : val)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Platforms</SelectItem>
                            <SelectItem value="Facebook">Facebook</SelectItem>
                            <SelectItem value="Email">Email</SelectItem>
                            <SelectItem value="Blog">Blog</SelectItem>
                            <SelectItem value="YouTube">YouTube</SelectItem>
                            <SelectItem value="TikTok">TikTok</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={emotionFilter || "all"} onValueChange={(val) => setEmotionFilter(val === "all" ? null : val)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Emotion" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Emotions</SelectItem>
                            <SelectItem value="Curiosity">Curiosity</SelectItem>
                            <SelectItem value="Fear">Fear</SelectItem>
                            <SelectItem value="Desire">Desire</SelectItem>
                            <SelectItem value="Urgency">Urgency</SelectItem>
                            <SelectItem value="Authority">Authority</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant={showFavorites ? "secondary" : "outline"}
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={showFavorites ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : ""}
                    >
                        <Star className={`h-4 w-4 mr-2 ${showFavorites ? "fill-current" : ""}`} />
                        Favorites
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHeadlines.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        <div className="mb-4">
                            <Search className="h-12 w-12 mx-auto text-slate-300" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No headlines found</h3>
                        <p className="mb-6">Try adjusting your filters or generate some new ones.</p>
                        <Button onClick={() => router.push('/headlines/generate')}>
                            <Wand2 className="h-4 w-4 mr-2" />
                            Generate Headlines
                        </Button>
                    </div>
                ) : (
                    filteredHeadlines.map((headline) => (
                        <Card key={headline._id} className="group hover:shadow-md transition-shadow relative">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {headline.platform && (
                                                <Badge variant="secondary" className="text-[10px] h-5">
                                                    {headline.platform}
                                                </Badge>
                                            )}
                                            {headline.emotion && (
                                                <Badge variant="outline" className="text-[10px] h-5">
                                                    {headline.emotion}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleCopy(headline.text)}>
                                                <Copy className="h-4 w-4 mr-2" /> Copy Text
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.push(`/headlines/${headline._id}`)}>
                                                <Edit className="h-4 w-4 mr-2" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(headline._id)}>
                                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardTitle className="text-lg leading-snug font-bold text-slate-800">
                                    {headline.text}
                                </CardTitle>
                                {headline.subheadline && (
                                    <CardDescription className="line-clamp-2 mt-2">
                                        {headline.subheadline}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between pt-4 border-t mt-2">
                                    <div className="text-xs text-slate-500">
                                        {headline.frameworkId ? "Framework-based" : "Custom"}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-8 w-8 ${headline.isFavorite ? "text-amber-500 hover:text-amber-600" : "text-slate-400 hover:text-amber-500"}`}
                                            onClick={() => handleToggleFavorite(headline._id)}
                                        >
                                            <Star className={`h-4 w-4 ${headline.isFavorite ? "fill-current" : ""}`} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={() => handleCopy(headline.text)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
