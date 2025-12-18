"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Eye, Globe, GlobeLock, Monitor, Tablet, Smartphone } from "lucide-react";
import Link from "next/link";
import { getPage, updatePage, publishPage } from "@/lib/actions/page-builder.actions";
import { toast } from "sonner";
import { TemplateLibrary } from "./_components/template-library";
import { PageCanvas } from "./_components/page-canvas";
import { ContentEditor } from "./_components/content-editor";
import { StyleEditor } from "./_components/style-editor";
import { defaultTemplates } from "@/lib/constants/page-builder-templates";

// DEBUG: Check if templates are loading
console.log("🔍 Page Builder Templates Debug:");
console.log("  - Total templates:", defaultTemplates?.length || 0);
console.log("  - First template:", defaultTemplates?.[0]?.name || "NONE");
if (!defaultTemplates || defaultTemplates.length === 0) {
    console.error("❌ TEMPLATES NOT LOADED! Check build output.");
} else {
    console.log("✅ Templates loaded successfully");
}


interface Section {
    _id?: string;
    templateId: string;
    content: { [key: string]: string | string[] };
    style: {
        backgroundColor?: string;
        textColor?: string;
        padding?: string;
        margin?: string;
        fontSize?: string;
        fontWeight?: string;
        textAlign?: "left" | "center" | "right";
        borderRadius?: string;
        maxWidth?: string;
    };
    order: number;
}

interface PageData {
    _id: string;
    name: string;
    slug: string;
    sections: Section[];
    isPublished: boolean;
}

type ViewMode = "desktop" | "tablet" | "mobile";

export default function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [pageId, setPageId] = useState<string>("");
    const [page, setPage] = useState<PageData | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [editorMode, setEditorMode] = useState<"content" | "style">("content");
    const [pageName, setPageName] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>("desktop");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    useEffect(() => {
        params.then(({ id }) => {
            setPageId(id);
            loadPage(id);
        });
    }, []);

    // Auto-save effect
    useEffect(() => {
        if (!hasUnsavedChanges || !page) return;

        const autoSaveTimer = setTimeout(() => {
            handleSave(true);
        }, 30000);

        return () => clearTimeout(autoSaveTimer);
    }, [hasUnsavedChanges, sections, pageName]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave(false);
            }

            if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedSectionId) {
                e.preventDefault();
                handleDuplicateSection(selectedSectionId);
            }

            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedSectionId) {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    if (confirm('Delete this section?')) {
                        handleDeleteSection(selectedSectionId);
                    }
                }
            }

            if (e.key === 'Escape' && selectedSectionId) {
                setSelectedSectionId(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedSectionId, sections, page]);

    // Track changes
    useEffect(() => {
        if (page) {
            setHasUnsavedChanges(true);
        }
    }, [sections, pageName]);

    const loadPage = async (id: string) => {
        try {
            const data = await getPage(id);
            if (data) {
                setPage(data);
                setSections(data.sections || []);
                setPageName(data.name);
                setLastSaved(new Date(data.updatedAt));
            }
        } catch (error) {
            toast.error("Failed to load page");
        } finally {
            setLoading(false);
        }
    };

    const handleAddTemplate = (template: any) => {
        const newSection: Section = {
            templateId: template.id,
            content: { ...template.defaultContent },
            style: { ...template.defaultStyle },
            order: sections.length,
        };
        setSections([...sections, newSection]);
    };

    const handleMoveSection = (id: string, direction: "up" | "down") => {
        const index = sections.findIndex((s) => s._id === id || sections.indexOf(s) === parseInt(id));
        if (index === -1) return;

        const newSections = [...sections];
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newSections.length) return;
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        newSections.forEach((section, i) => (section.order = i));

        setSections(newSections);
    };

    const handleDuplicateSection = (id: string) => {
        const index = sections.findIndex((s) => (s._id || sections.indexOf(s).toString()) === id);
        if (index === -1) return;

        const sectionToDuplicate = sections[index];
        const duplicatedSection: Section = {
            templateId: sectionToDuplicate.templateId,
            content: { ...sectionToDuplicate.content },
            style: { ...sectionToDuplicate.style },
            order: index + 1,
        };

        const newSections = [
            ...sections.slice(0, index + 1),
            duplicatedSection,
            ...sections.slice(index + 1),
        ];

        newSections.forEach((section, i) => (section.order = i));
        setSections(newSections);
        toast.success("Section duplicated");
    };

    const handleDeleteSection = (id: string) => {
        setSections(sections.filter((s, i) => (s._id || i.toString()) !== id));
        if (selectedSectionId === id) {
            setSelectedSectionId(null);
        }
    };

    const handleReorderSections = useCallback((reorderedSections: Section[]) => {
        const sectionsWithUpdatedOrder = reorderedSections.map((section, index) => ({
            ...section,
            order: index,
        }));
        setSections(sectionsWithUpdatedOrder);
    }, []);

    const handleContentChange = (content: any) => {
        if (!selectedSectionId) return;
        setSections(sections.map((s, i) =>
            (s._id || i.toString()) === selectedSectionId ? { ...s, content } : s
        ));
    };

    const handleStyleChange = (style: any) => {
        if (!selectedSectionId) return;
        setSections(sections.map((s, i) =>
            (s._id || i.toString()) === selectedSectionId ? { ...s, style } : s
        ));
    };

    const handleSave = async (isAutoSave = false) => {
        if (!page) return;
        setSaving(true);

        try {
            const result = await updatePage(page._id, {
                name: pageName,
                sections,
            });

            if (result.success) {
                if (!isAutoSave) {
                    toast.success("Page saved successfully!");
                }
                if (result.page) {
                    setPage(result.page);
                    setSections(result.page.sections || []);
                    setLastSaved(new Date());
                    setHasUnsavedChanges(false);
                }
            } else {
                toast.error(result.error || "Failed to save page");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!page) return;

        try {
            const result = await publishPage(page._id, !page.isPublished);
            if (result.success && result.page) {
                setPage(result.page);
                toast.success(result.page.isPublished ? "Page published!" : "Page unpublished");
            } else {
                toast.error(result.error || "Failed to update publish status");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const selectedSection = sections.find((s, i) => (s._id || i.toString()) === selectedSectionId);

    const getLastSavedText = () => {
        if (!lastSaved) return "";
        const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
        if (seconds < 60) return "Saved just now";
        if (seconds < 3600) return `Saved ${Math.floor(seconds / 60)}m ago`;
        return `Saved ${Math.floor(seconds / 3600)}h ago`;
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading page...</p>
                </div>
            </div>
        );
    }

    if (!page) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Page not found</h2>
                    <Link href="/admin/page-builder">
                        <Button>Back to Pages</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="h-16 border-b flex items-center justify-between px-6 bg-white shadow-sm z-30">
                <div className="flex items-center gap-4">
                    <Link href="/admin/page-builder">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <Input
                        value={pageName}
                        onChange={(e) => setPageName(e.target.value)}
                        className="w-64"
                        placeholder="Page name"
                    />
                    <div className="text-xs text-muted-foreground">
                        {saving ? "Saving..." : hasUnsavedChanges ? "Unsaved changes" : getLastSavedText()}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Responsive Preview Toggle */}
                    <div className="flex items-center gap-1 border rounded-lg p-1">
                        <Button
                            variant={viewMode === "desktop" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("desktop")}
                            className="h-8 px-3"
                        >
                            <Monitor className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "tablet" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("tablet")}
                            className="h-8 px-3"
                        >
                            <Tablet className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "mobile" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("mobile")}
                            className="h-8 px-3"
                        >
                            <Smartphone className="w-4 h-4" />
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePublish}
                    >
                        {page.isPublished ? (
                            <>
                                <GlobeLock className="w-4 h-4 mr-2" />
                                Unpublish
                            </>
                        ) : (
                            <>
                                <Globe className="w-4 h-4 mr-2" />
                                Publish
                            </>
                        )}
                    </Button>
                    {page.isPublished && (
                        <Link href={`/p/${page.slug}`} target="_blank">
                            <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Button>
                        </Link>
                    )}
                    <Button onClick={() => handleSave(false)} disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Template Library */}
                <div className="w-72 overflow-hidden border-r bg-slate-50">
                    <TemplateLibrary
                        templates={defaultTemplates}
                        onAddTemplate={handleAddTemplate}
                    />
                </div>

                {/* Canvas */}
                <div className="flex-1 overflow-hidden">
                    <PageCanvas
                        sections={sections}
                        templates={defaultTemplates}
                        selectedSectionId={selectedSectionId}
                        viewMode={viewMode}
                        onSelectSection={setSelectedSectionId}
                        onMoveSection={handleMoveSection}
                        onDuplicateSection={handleDuplicateSection}
                        onDeleteSection={handleDeleteSection}
                        onReorderSections={handleReorderSections}
                    />
                </div>

                {/* Editor Panel */}
                {selectedSection && (
                    <div className="w-80 border-l flex flex-col bg-white shadow-xl">
                        <div className="h-14 border-b flex items-center px-4 bg-slate-50">
                            <Button
                                variant={editorMode === "content" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setEditorMode("content")}
                                className="mr-2"
                            >
                                Content
                            </Button>
                            <Button
                                variant={editorMode === "style" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setEditorMode("style")}
                            >
                                Style
                            </Button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            {editorMode === "content" ? (
                                <ContentEditor content={selectedSection.content} onContentChange={handleContentChange} />
                            ) : (
                                <StyleEditor style={selectedSection.style} onStyleChange={handleStyleChange} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
