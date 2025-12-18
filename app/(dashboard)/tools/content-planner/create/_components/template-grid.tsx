"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Mail, Video, Share2, Layout } from "lucide-react";
import TemplateWizard from "./template-wizard";

interface TemplateGridProps {
    templates: any[];
    initialValues?: Record<string, any>;
    initialCategory?: string;
}

export default function TemplateGrid({ templates, initialValues, initialCategory }: TemplateGridProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

    const categories = ["All", ...Array.from(new Set(templates.map(t => t.category)))];

    const filteredTemplates = templates.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getIcon = (category: string) => {
        switch (category) {
            case "Written Content": return <FileText className="h-5 w-5 text-blue-500" />;
            case "Email Content": return <Mail className="h-5 w-5 text-purple-500" />;
            case "Video Content": return <Video className="h-5 w-5 text-red-500" />;
            case "Social Media": return <Share2 className="h-5 w-5 text-pink-500" />;
            default: return <Layout className="h-5 w-5 text-slate-500" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(cat)}
                            className="whitespace-nowrap"
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search templates..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                    <Card
                        key={template._id}
                        className="cursor-pointer hover:shadow-md transition-all hover:border-indigo-200 group"
                        onClick={() => setSelectedTemplate(template)}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                                    {getIcon(template.category)}
                                </div>
                                {template.isPremium && <Badge variant="secondary" className="text-xs">Pro</Badge>}
                            </div>
                            <CardTitle className="mt-3 text-lg">{template.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-3">{template.description}</p>
                            <Badge variant="outline" className="text-xs font-normal text-slate-400">
                                {template.subcategory}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500">No templates found matching your criteria.</p>
                </div>
            )}

            {/* Wizard Modal */}
            {selectedTemplate && (
                <TemplateWizard
                    template={selectedTemplate}
                    onClose={() => setSelectedTemplate(null)}
                    initialValues={initialValues}
                />
            )}
        </div>
    );
}
