"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Copy, Check } from "lucide-react";
import { searchAmazonProducts } from "@/lib/actions/amazon.actions";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import toast from "react-hot-toast";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debugInfo, setDebugInfo] = useState<any>(null);

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const onSearch = async () => {
        if (!query) return;
        setIsLoading(true);
        setDebugInfo(null);
        try {
            const response = await searchAmazonProducts(query);
            if (response?.success) {
                setResults(response.products || []);
                // @ts-ignore
                if (response.debug) setDebugInfo(response.debug);
            } else {
                toast.error(response?.error || "Search failed");
                if (response?.error) setDebugInfo({ error: response.error });
            }
        } catch (error: any) {
            toast.error("Something went wrong");
            setDebugInfo({ error: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const onCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-3xl font-bold">Product Search</h1>
                <p className="text-muted-foreground">
                    Search Amazon products and generate affiliate links.
                </p>
            </div>

            <div className="flex gap-x-2">
                <Input
                    placeholder="Enter keyword or ASIN..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                />
                <Button onClick={onSearch} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
            </div>

            {debugInfo && (
                <div className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto max-h-60 text-xs font-mono">
                    <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
                    <Card key={product.asin} className="overflow-hidden flex flex-col">
                        <div className="relative aspect-square w-full bg-white p-4 flex items-center justify-center">
                            <div className="relative h-full w-full">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base line-clamp-2 h-12">
                                {product.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-lg text-orange-600">{product.price}</span>
                                <span className="text-sm text-slate-500">{product.rating} ★ ({product.reviewCount})</span>
                            </div>
                            <p className="text-xs text-slate-400">ASIN: {product.asin}</p>
                        </CardContent>
                        <CardFooter className="p-4 bg-slate-50 border-t flex gap-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => onCopy(product.productUrl, product.asin)}
                            >
                                {copiedId === product.asin ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                Copy Link
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                {results.length === 0 && !isLoading && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No results found. Try searching for something.
                    </div>
                )}
            </div>
        </div>
    );
}
