"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { updatePageContent } from "@/lib/actions/docs.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Eye, Code } from "lucide-react";
import "easymde/dist/easymde.min.css";

// Dynamic import to avoid SSR issues
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
    ssr: false,
});

export function MarkdownEditor({ page }: { page: any }) {
    const router = useRouter();
    const [content, setContent] = useState(page.content || "");
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(true);

    const editorOptions = useMemo(() => ({
        spellChecker: false,
        placeholder: "Start writing your documentation...",
        status: false,
        toolbar: [
            "bold", "italic", "heading", "|",
            "quote", "unordered-list", "ordered-list", "|",
            "link", "image", "table", "|",
            "preview", "side-by-side", "fullscreen", "|",
            "guide"
        ] as any,
        sideBySideFullscreen: false,
        previewRender: (text: string) => {
            // This will be handled by our custom preview pane
            return text;
        },
    }), []);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            await updatePageContent(page._id, content);
            toast.success("Page saved successfully!");
            router.refresh();
        } catch (error) {
            toast.error("Failed to save page");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    }, [page._id, content, router]);

    const onChange = useCallback((value: string) => {
        setContent(value);
    }, []);

    return (
        <div className="flex flex-col h-full w-full bg-white">
            {/* Header */}
            <header className="flex items-center justify-between border-b bg-white px-4 py-3 shrink-0">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="gap-2"
                    >
                        <ArrowLeft size={16} /> Back
                    </Button>
                    <div>
                        <h1 className="font-bold text-base">{page.title}</h1>
                        <p className="text-xs text-slate-500">
                            {page.bookId?.title || "Untitled Book"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                        className="gap-2"
                    >
                        {showPreview ? <Code size={16} /> : <Eye size={16} />}
                        {showPreview ? "Editor Only" : "Show Preview"}
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        size="sm"
                        className="gap-2"
                    >
                        <Save size={16} />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </header>

            {/* Editor Area */}
            <div className="flex-1 overflow-hidden">
                <div className={`grid h-full ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-0`}>
                    {/* Editor */}
                    <div className="h-full overflow-y-auto border-r">
                        <SimpleMDE
                            value={content}
                            onChange={onChange}
                            options={editorOptions}
                        />
                    </div>

                    {/* Preview */}
                    {showPreview && (
                        <div className="h-full overflow-y-auto bg-white">
                            <div className="w-full h-full">
                                {(() => {
                                    const isHTML = content.trim().startsWith('<!DOCTYPE') ||
                                        content.trim().startsWith('<html') ||
                                        /<[a-z][\s\S]*>/i.test(content);

                                    if (isHTML) {
                                        return (
                                            <div
                                                dangerouslySetInnerHTML={{ __html: content || "*Start typing to see preview...*" }}
                                                className="html-content w-full h-full"
                                            />
                                        );
                                    }

                                    return (
                                        <div className="whitespace-pre-wrap prose prose-slate max-w-none p-4">
                                            {content || "*Start typing to see preview...*"}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
