"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { createPage } from "@/lib/actions/page-builder.actions";
import { toast } from "sonner";
import pageTemplates from "@/lib/constants/page-templates";

export default function CreatePagePage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const template = selectedTemplate
                ? pageTemplates.find(t => t.id === selectedTemplate)
                : null;

            // Add order field to each section
            const sections = template?.sections.map((section, index) => ({
                ...section,
                order: index
            })) || [];

            const result = await createPage({
                name,
                slug,
                sections
            });

            if (result.success && result.page) {
                toast.success("Page created successfully!");
                router.push(`/admin/page-builder/${result.page._id}`);
            } else {
                toast.error(result.error || "Failed to create page");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleNameChange = (value: string) => {
        setName(value);
        if (!slug) {
            const generatedSlug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            setSlug(generatedSlug);
        }
    };

    // Group templates by category
    const groupedTemplates = pageTemplates.reduce((acc, template) => {
        if (!acc[template.category]) {
            acc[template.category] = [];
        }
        acc[template.category].push(template);
        return acc;
    }, {} as Record<string, typeof pageTemplates>);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/page-builder">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create New Page</h1>
                    <p className="text-muted-foreground mt-1">
                        Start from scratch or choose a template
                    </p>
                </div>
            </div>

            <Tabs defaultValue="template" className="w-full">
                <TabsList>
                    <TabsTrigger value="template">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Start from Template
                    </TabsTrigger>
                    <TabsTrigger value="blank">Start from Blank</TabsTrigger>
                </TabsList>

                {/* Template Selection */}
                <TabsContent value="template" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Choose a Template</CardTitle>
                            <CardDescription>
                                Select a pre-built page template to get started quickly
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {Object.entries(groupedTemplates).map(([category, templates]) => (
                                    <div key={category}>
                                        <h3 className="font-semibold mb-3">{category}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {templates.map((template) => (
                                                <Card
                                                    key={template.id}
                                                    className={`cursor-pointer transition-all hover:shadow-lg ${selectedTemplate === template.id
                                                        ? "ring-2 ring-primary"
                                                        : ""
                                                        }`}
                                                    onClick={() => {
                                                        setSelectedTemplate(template.id);
                                                        if (!name) {
                                                            handleNameChange(template.name);
                                                        }
                                                    }}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h4 className="font-semibold text-sm">
                                                                {template.name}
                                                            </h4>
                                                            {selectedTemplate === template.id && (
                                                                <Badge variant="default" className="text-xs">
                                                                    Selected
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mb-3">
                                                            {template.description}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {template.sections.length} sections
                                                            </Badge>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {selectedTemplate && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Page Details</CardTitle>
                                <CardDescription>
                                    Customize your page name and URL
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Page Name *</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => handleNameChange(e.target.value)}
                                            placeholder="e.g., About Us, Contact, Pricing"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug">URL Slug *</Label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">/p/</span>
                                            <Input
                                                id="slug"
                                                value={slug}
                                                onChange={(e) => setSlug(e.target.value)}
                                                placeholder="about-us"
                                                required
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            This will be the URL where your page is accessible
                                        </p>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button type="submit" disabled={loading || !name || !slug}>
                                            {loading ? "Creating..." : "Create Page"}
                                        </Button>
                                        <Link href="/admin/page-builder">
                                            <Button type="button" variant="outline">
                                                Cancel
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Blank Page */}
                <TabsContent value="blank">
                    <Card>
                        <CardHeader>
                            <CardTitle>Page Details</CardTitle>
                            <CardDescription>
                                Enter the basic information for your new page
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name-blank">Page Name *</Label>
                                    <Input
                                        id="name-blank"
                                        value={name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="e.g., About Us, Contact, Pricing"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug-blank">URL Slug *</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">/p/</span>
                                        <Input
                                            id="slug-blank"
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                            placeholder="about-us"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        This will be the URL where your page is accessible
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" disabled={loading || !name || !slug}>
                                        {loading ? "Creating..." : "Create Blank Page"}
                                    </Button>
                                    <Link href="/admin/page-builder">
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
