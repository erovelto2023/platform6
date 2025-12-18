"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Star, StarOff, Sparkles } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Template {
    id: string;
    name: string;
    category: string;
    componentType: string;
    defaultContent: any;
    defaultStyle: any;
    thumbnail?: string;
    isPremium?: boolean;
}

interface TemplateLibraryProps {
    templates: Template[];
    onAddTemplate: (template: Template) => void;
}

export function TemplateLibrary({ templates, onAddTemplate }: TemplateLibraryProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"name" | "category" | "recent">("category");

    // Get unique categories
    const categories = useMemo(() => {
        const cats = Array.from(new Set(templates.map((t) => t.category)));
        return cats.sort();
    }, [templates]);

    // Filter and sort templates
    const filteredTemplates = useMemo(() => {
        let filtered = templates;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (t) =>
                    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.componentType.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (filterCategory !== "all") {
            if (filterCategory === "favorites") {
                filtered = filtered.filter((t) => favorites.includes(t.id));
            } else {
                filtered = filtered.filter((t) => t.category === filterCategory);
            }
        }

        // Sort
        if (sortBy === "name") {
            filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "category") {
            filtered = [...filtered].sort((a, b) => a.category.localeCompare(b.category));
        }

        return filtered;
    }, [templates, searchQuery, filterCategory, sortBy, favorites]);

    // Group by category
    const categorizedTemplates = useMemo(() => {
        return filteredTemplates.reduce((acc, template) => {
            if (!acc[template.category]) {
                acc[template.category] = [];
            }
            acc[template.category].push(template);
            return acc;
        }, {} as Record<string, Template[]>);
    }, [filteredTemplates]);

    const toggleFavorite = (templateId: string) => {
        setFavorites((prev) =>
            prev.includes(templateId)
                ? prev.filter((id) => id !== templateId)
                : [...prev, templateId]
        );
    };

    const categoryNames: Record<string, string> = {
        hero: "Hero Sections",
        features: "Features",
        testimonials: "Testimonials",
        "social-proof": "Social Proof",
        pricing: "Pricing",
        content: "Content",
        media: "Media",
        team: "Team",
        blog: "Blog",
        faq: "FAQ",
        cta: "Call to Action",
        forms: "Forms",
        process: "Process",
        stats: "Stats",
        timer: "Timer",
        headers: "Headers",
        footer: "Footer",
        layout: "Layout",
        conversion: "Conversion",
        ecommerce: "E-commerce",
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            hero: "🎯",
            features: "✨",
            testimonials: "💬",
            "social-proof": "⭐",
            pricing: "💰",
            content: "📝",
            media: "🎬",
            team: "👥",
            blog: "📰",
            faq: "❓",
            cta: "🎯",
            forms: "📋",
            process: "🔄",
            stats: "📊",
            timer: "⏰",
            headers: "🔝",
            footer: "🔚",
            layout: "📐",
            conversion: "🚀",
            ecommerce: "🛒",
        };
        return icons[category] || "📦";
    };

    return (
        <ScrollArea className="h-full">
            <div className="p-4">
                {/* Header */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-1">Template Library</h2>
                    <p className="text-xs text-muted-foreground">
                        {filteredTemplates.length} of {templates.length} templates
                    </p>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search templates..."
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="favorites">
                                <Star className="w-3 h-3 inline mr-1" />
                                Favorites
                            </SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {categoryNames[cat] || cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                        <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="category">Category</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="recent">Recent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Templates */}
                {filteredTemplates.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Search className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No templates found</p>
                    </div>
                ) : (
                    <Accordion type="multiple" className="space-y-2">
                        {Object.entries(categorizedTemplates).map(([category, categoryTemplates]) => (
                            <AccordionItem
                                key={category}
                                value={category}
                                className="border rounded-lg bg-white shadow-sm"
                            >
                                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <span className="text-lg">{getCategoryIcon(category)}</span>
                                        <span>{categoryNames[category] || category}</span>
                                        <Badge variant="secondary" className="ml-auto mr-2 text-xs">
                                            {categoryTemplates.length}
                                        </Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-2 pb-2">
                                    <div className="space-y-2 pt-2">
                                        {categoryTemplates.map((template) => (
                                            <Card
                                                key={template.id}
                                                className="group hover:shadow-md hover:border-primary/50 transition-all cursor-pointer overflow-hidden relative"
                                            >
                                                {/* Favorite Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(template.id);
                                                    }}
                                                    className="absolute top-2 right-2 z-10 p-1 bg-white/90 rounded-full hover:bg-white transition-colors"
                                                >
                                                    {favorites.includes(template.id) ? (
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    ) : (
                                                        <StarOff className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </button>

                                                {/* Premium Badge */}
                                                {template.isPremium && (
                                                    <div className="absolute top-2 left-2 z-10">
                                                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                                            <Sparkles className="w-3 h-3 mr-1" />
                                                            Premium
                                                        </Badge>
                                                    </div>
                                                )}

                                                {/* Template Preview */}
                                                <div
                                                    className="h-24 bg-gradient-to-br from-slate-100 to-slate-50 border-b flex items-center justify-center relative overflow-hidden"
                                                    style={{
                                                        backgroundColor: template.defaultStyle?.backgroundColor || "#f8f9fa",
                                                    }}
                                                    onClick={() => onAddTemplate(template)}
                                                >
                                                    <div className="absolute inset-0 opacity-10">
                                                        <div
                                                            className="h-full w-full"
                                                            style={{
                                                                backgroundImage: `linear-gradient(${template.defaultStyle?.textColor || "#000"
                                                                    } 1px, transparent 1px), linear-gradient(90deg, ${template.defaultStyle?.textColor || "#000"
                                                                    } 1px, transparent 1px)`,
                                                                backgroundSize: "20px 20px",
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <div className="relative z-10 text-center px-2">
                                                        <div
                                                            className="text-xs font-semibold truncate"
                                                            style={{ color: template.defaultStyle?.textColor || "#000" }}
                                                        >
                                                            {template.defaultContent?.title || template.name}
                                                        </div>
                                                        {template.defaultContent?.subtitle && (
                                                            <div
                                                                className="text-[10px] opacity-70 truncate mt-1"
                                                                style={{ color: template.defaultStyle?.textColor || "#000" }}
                                                            >
                                                                {template.defaultContent.subtitle}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Template Info */}
                                                <div className="p-3" onClick={() => onAddTemplate(template)}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm truncate">{template.name}</p>
                                                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                                                                {template.componentType}
                                                            </p>
                                                        </div>
                                                        <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </div>
        </ScrollArea>
    );
}
