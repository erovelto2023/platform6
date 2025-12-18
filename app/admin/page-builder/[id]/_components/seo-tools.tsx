"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Globe, Twitter, Facebook } from "lucide-react";
import { toast } from "sonner";

interface SEOData {
    metaTitle?: string;
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    keywords?: string;
    canonicalUrl?: string;
}

interface SEOToolsProps {
    pageSlug: string;
    seoData: SEOData;
    onSave: (data: SEOData) => void;
}

export function SEOTools({ pageSlug, seoData, onSave }: SEOToolsProps) {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<SEOData>(seoData);

    const updateField = (field: keyof SEOData, value: string) => {
        setData({ ...data, [field]: value });
    };

    const handleSave = () => {
        onSave(data);
        toast.success("SEO settings saved");
        setOpen(false);
    };

    const getPreviewUrl = () => {
        return `${window.location.origin}/p/${pageSlug}`;
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    SEO
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>SEO Settings</DialogTitle>
                    <DialogDescription>
                        Optimize your page for search engines and social media
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="basic">
                            <Search className="w-4 h-4 mr-2" />
                            Basic
                        </TabsTrigger>
                        <TabsTrigger value="opengraph">
                            <Facebook className="w-4 h-4 mr-2" />
                            Facebook
                        </TabsTrigger>
                        <TabsTrigger value="twitter">
                            <Twitter className="w-4 h-4 mr-2" />
                            Twitter
                        </TabsTrigger>
                        <TabsTrigger value="preview">
                            <Globe className="w-4 h-4 mr-2" />
                            Preview
                        </TabsTrigger>
                    </TabsList>

                    {/* Basic SEO */}
                    <TabsContent value="basic" className="space-y-4">
                        <div>
                            <Label htmlFor="metaTitle">Meta Title</Label>
                            <Input
                                id="metaTitle"
                                value={data.metaTitle || ""}
                                onChange={(e) => updateField("metaTitle", e.target.value)}
                                placeholder="Page Title - Brand Name"
                                maxLength={60}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                {data.metaTitle?.length || 0}/60 characters
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="metaDescription">Meta Description</Label>
                            <Textarea
                                id="metaDescription"
                                value={data.metaDescription || ""}
                                onChange={(e) => updateField("metaDescription", e.target.value)}
                                placeholder="A compelling description of your page..."
                                rows={3}
                                maxLength={160}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                {data.metaDescription?.length || 0}/160 characters
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                            <Input
                                id="keywords"
                                value={data.keywords || ""}
                                onChange={(e) => updateField("keywords", e.target.value)}
                                placeholder="keyword1, keyword2, keyword3"
                            />
                        </div>

                        <div>
                            <Label htmlFor="canonicalUrl">Canonical URL</Label>
                            <Input
                                id="canonicalUrl"
                                value={data.canonicalUrl || getPreviewUrl()}
                                onChange={(e) => updateField("canonicalUrl", e.target.value)}
                                placeholder={getPreviewUrl()}
                            />
                        </div>
                    </TabsContent>

                    {/* Open Graph (Facebook) */}
                    <TabsContent value="opengraph" className="space-y-4">
                        <div>
                            <Label htmlFor="ogTitle">OG Title</Label>
                            <Input
                                id="ogTitle"
                                value={data.ogTitle || data.metaTitle || ""}
                                onChange={(e) => updateField("ogTitle", e.target.value)}
                                placeholder="Title for Facebook shares"
                            />
                        </div>

                        <div>
                            <Label htmlFor="ogDescription">OG Description</Label>
                            <Textarea
                                id="ogDescription"
                                value={data.ogDescription || data.metaDescription || ""}
                                onChange={(e) => updateField("ogDescription", e.target.value)}
                                placeholder="Description for Facebook shares"
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label htmlFor="ogImage">OG Image URL</Label>
                            <Input
                                id="ogImage"
                                value={data.ogImage || ""}
                                onChange={(e) => updateField("ogImage", e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                            {data.ogImage && (
                                <div className="mt-2 border rounded-lg overflow-hidden">
                                    <img src={data.ogImage} alt="OG Preview" className="w-full h-auto" />
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Twitter Card */}
                    <TabsContent value="twitter" className="space-y-4">
                        <div>
                            <Label htmlFor="twitterTitle">Twitter Title</Label>
                            <Input
                                id="twitterTitle"
                                value={data.twitterTitle || data.ogTitle || data.metaTitle || ""}
                                onChange={(e) => updateField("twitterTitle", e.target.value)}
                                placeholder="Title for Twitter shares"
                            />
                        </div>

                        <div>
                            <Label htmlFor="twitterDescription">Twitter Description</Label>
                            <Textarea
                                id="twitterDescription"
                                value={data.twitterDescription || data.ogDescription || data.metaDescription || ""}
                                onChange={(e) => updateField("twitterDescription", e.target.value)}
                                placeholder="Description for Twitter shares"
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label htmlFor="twitterImage">Twitter Image URL</Label>
                            <Input
                                id="twitterImage"
                                value={data.twitterImage || data.ogImage || ""}
                                onChange={(e) => updateField("twitterImage", e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                            {data.twitterImage && (
                                <div className="mt-2 border rounded-lg overflow-hidden">
                                    <img src={data.twitterImage} alt="Twitter Preview" className="w-full h-auto" />
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Preview */}
                    <TabsContent value="preview" className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-3">Google Search Preview</h3>
                            <Card className="p-4">
                                <div className="text-blue-600 text-xl hover:underline cursor-pointer">
                                    {data.metaTitle || "Your Page Title"}
                                </div>
                                <div className="text-green-700 text-sm mt-1">
                                    {getPreviewUrl()}
                                </div>
                                <div className="text-gray-600 text-sm mt-2">
                                    {data.metaDescription || "Your meta description will appear here..."}
                                </div>
                            </Card>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3">Facebook Share Preview</h3>
                            <Card className="p-4">
                                {data.ogImage && (
                                    <div className="mb-3 border rounded overflow-hidden">
                                        <img src={data.ogImage} alt="OG" className="w-full h-48 object-cover" />
                                    </div>
                                )}
                                <div className="font-semibold">
                                    {data.ogTitle || data.metaTitle || "Your Page Title"}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {data.ogDescription || data.metaDescription || "Description"}
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                    {new URL(getPreviewUrl()).hostname}
                                </div>
                            </Card>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3">Twitter Card Preview</h3>
                            <Card className="p-4 border-2">
                                {data.twitterImage && (
                                    <div className="mb-3 border rounded overflow-hidden">
                                        <img src={data.twitterImage} alt="Twitter" className="w-full h-48 object-cover" />
                                    </div>
                                )}
                                <div className="font-semibold">
                                    {data.twitterTitle || data.ogTitle || data.metaTitle || "Your Page Title"}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {data.twitterDescription || data.ogDescription || data.metaDescription || "Description"}
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                    {new URL(getPreviewUrl()).hostname}
                                </div>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save SEO Settings
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
