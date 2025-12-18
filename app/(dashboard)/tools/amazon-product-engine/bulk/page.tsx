"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { Copy, Trash2, Upload, FileSpreadsheet } from "lucide-react";

interface Product {
    title: string;
    imageUrl: string;
    affiliateUrl: string;
    asin: string;
    rating: string;
    description: string;
}

export default function BulkEditorPage() {
    const [stagedProducts, setStagedProducts] = useState<Product[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [adStyle, setAdStyle] = useState("comparison");
    const [generatedCode, setGeneratedCode] = useState("");

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const csv = event.target?.result as string;
            const lines = csv.split(/\r\n|\n/);
            if (lines.length < 2) {
                toast.error("CSV is empty or invalid.");
                return;
            }

            const header = lines[0].split(',').map(h => h.toLowerCase().trim().replace(/"/g, ''));
            const headerMap = {
                title: header.indexOf('title'),
                description: header.indexOf('description'),
                imageUrl: header.indexOf('imageurl'),
                rating: header.indexOf('rating'),
                affiliateUrl: header.indexOf('affiliateurl')
            };

            if (headerMap.title === -1 || headerMap.imageUrl === -1 || headerMap.affiliateUrl === -1) {
                toast.error("CSV missing required columns: Title, ImageURL, AffiliateURL");
                return;
            }

            const newProducts: Product[] = [];
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                // Simple CSV split (doesn't handle commas in quotes perfectly, but matches provided logic)
                const data = lines[i].split(',');

                const affiliateUrl = data[headerMap.affiliateUrl];
                const asinMatch = affiliateUrl ? affiliateUrl.match(/\/dp\/([A-Z0-9]{10})/) : null;

                const product: Product = {
                    title: data[headerMap.title]?.replace(/"/g, '') || "",
                    imageUrl: data[headerMap.imageUrl]?.replace(/"/g, '') || "",
                    affiliateUrl: affiliateUrl?.replace(/"/g, '') || "",
                    description: headerMap.description > -1 ? data[headerMap.description]?.replace(/"/g, '') : "",
                    rating: headerMap.rating > -1 ? data[headerMap.rating]?.replace(/"/g, '') : "0",
                    asin: asinMatch ? asinMatch[1] : "N/A"
                };

                if (product.title && product.imageUrl && product.affiliateUrl) {
                    newProducts.push(product);
                }
            }

            setStagedProducts(prev => [...prev, ...newProducts]);
            toast.success(`Imported ${newProducts.length} products.`);
        };
        reader.readAsText(file);
    };

    const toggleSelection = (index: number) => {
        setSelectedIndices(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const toggleAll = () => {
        if (selectedIndices.length === stagedProducts.length) {
            setSelectedIndices([]);
        } else {
            setSelectedIndices(stagedProducts.map((_, i) => i));
        }
    };

    const generateCode = () => {
        if (selectedIndices.length === 0) {
            toast.error("Please select at least one product.");
            return;
        }

        const selectedProducts = selectedIndices.map(i => stagedProducts[i]);
        let html = "";

        if (adStyle === "comparison") {
            if (selectedProducts.length < 2 || selectedProducts.length > 5) {
                toast.error("Comparison charts require 2-5 products.");
                return;
            }

            // Generate Comparison Chart HTML
            const headers = selectedProducts.map(p =>
                `<th style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center; vertical-align: top;">
                    <a href="${p.affiliateUrl}" target="_blank" rel="noopener noreferrer">
                        <img src="${p.imageUrl}" alt="${p.title}" style="width: 120px; height: 120px; object-fit: contain; margin: 0 auto 12px; display: block;">
                    </a>
                    <h4 style="margin: 0 0 8px 0; font-size: 1rem; font-weight: 600;">
                        <a href="${p.affiliateUrl}" target="_blank" rel="noopener noreferrer" style="color: #0073aa; text-decoration: none;">${p.title}</a>
                    </h4>
                    <div>${p.rating} Stars</div>
                </th>`
            ).join('');

            const buttons = selectedProducts.map(p =>
                `<td style="padding: 12px; text-align: center; border-bottom: 1px solid #ddd; vertical-align: middle;">
                    <a href="${p.affiliateUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #f0c14b; color: #111; padding: 10px 16px; border-radius: 4px; text-decoration: none; font-weight: 500; border: 1px solid #a88734;">
                        Buy on Amazon
                    </a>
                </td>`
            ).join('');

            html = `<!-- Comparison Chart Start -->
<div style="width: 100%; overflow-x: auto; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; background-color: #fff;">
    <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead><tr>${headers}</tr></thead>
        <tbody><tr>${buttons}</tr></tbody>
    </table>
</div>
<!-- Comparison Chart End -->`;

        } else {
            // Individual Boxes
            html = selectedProducts.map(p => `
<!-- Product Box Start -->
<div style="border: 1px solid #e0e0e0; padding: 16px; border-radius: 8px; max-width: 800px; margin: 20px auto; background-color: #fff; display: flex; gap: 24px; align-items: center;">
    <div style="flex: 0 0 150px;">
        <a href="${p.affiliateUrl}" target="_blank"><img src="${p.imageUrl}" alt="${p.title}" style="width: 100%; height: auto;"></a>
    </div>
    <div style="flex: 1;">
        <h3 style="margin-top: 0;"><a href="${p.affiliateUrl}" target="_blank" style="color: #0073aa; text-decoration: none;">${p.title}</a></h3>
        <p>${p.description}</p>
        <a href="${p.affiliateUrl}" target="_blank" style="display: inline-block; background-color: #f0c14b; color: #111; padding: 10px 16px; border-radius: 4px; text-decoration: none; border: 1px solid #a88734;">Buy on Amazon</a>
    </div>
</div>
<!-- Product Box End -->`).join('\n');
        }

        setGeneratedCode(html);
        toast.success("Code generated!");
    };

    const copyCode = () => {
        navigator.clipboard.writeText(generatedCode);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-3xl font-bold">Bulk Editor</h1>
                <p className="text-muted-foreground">
                    Upload products via CSV and generate comparison charts or bulk product boxes.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Controls & Table */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Upload Products</CardTitle>
                            <CardDescription>
                                Import a CSV file with columns: Title, ImageURL, AffiliateURL.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    className="cursor-pointer"
                                />
                                <a
                                    href="data:text/csv;charset=utf-8,Title,Description,ImageURL,Rating,AffiliateURL%0AExample%20Product,Great%20Item,https://example.com/img.jpg,4.5,https://amazon.com/dp/B00000"
                                    download="sample.csv"
                                    className="text-sm text-blue-600 hover:underline whitespace-nowrap"
                                >
                                    Download Sample CSV
                                </a>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>2. Staged Products</CardTitle>
                            <Button variant="outline" size="sm" onClick={() => setStagedProducts([])}>
                                <Trash2 className="h-4 w-4 mr-2" /> Clear All
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md max-h-[400px] overflow-y-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">
                                                <Checkbox
                                                    checked={stagedProducts.length > 0 && selectedIndices.length === stagedProducts.length}
                                                    onCheckedChange={toggleAll}
                                                />
                                            </TableHead>
                                            <TableHead className="w-[80px]">Image</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead className="text-right">ASIN</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stagedProducts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                    No products staged. Upload a CSV to get started.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            stagedProducts.map((product, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedIndices.includes(index)}
                                                            onCheckedChange={() => toggleSelection(index)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <img src={product.imageUrl} alt="" className="h-10 w-10 object-contain rounded border bg-white" />
                                                    </TableCell>
                                                    <TableCell className="font-medium truncate max-w-[200px]" title={product.title}>
                                                        {product.title}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-xs">
                                                        {product.asin}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Generation & Output */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>3. Generate Code</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Ad Style</Label>
                                <Select value={adStyle} onValueChange={setAdStyle}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="comparison">Comparison Chart (Horizontal)</SelectItem>
                                        <SelectItem value="individual">Individual Boxes (Vertical)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button className="w-full" onClick={generateCode}>
                                Generate HTML
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>Output</CardTitle>
                            <Button variant="ghost" size="sm" onClick={copyCode} disabled={!generatedCode}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="preview" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="preview">Preview</TabsTrigger>
                                    <TabsTrigger value="code">HTML Code</TabsTrigger>
                                </TabsList>
                                <TabsContent value="preview">
                                    <div className="border rounded-md p-4 bg-slate-50 min-h-[300px] overflow-auto">
                                        {generatedCode ? (
                                            <div dangerouslySetInnerHTML={{ __html: generatedCode }} />
                                        ) : (
                                            <div className="text-center text-muted-foreground mt-20">
                                                Preview will appear here...
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="code">
                                    <Textarea
                                        value={generatedCode}
                                        readOnly
                                        className="font-mono text-xs min-h-[300px]"
                                    />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
