"use client";

import { useEffect, useState } from "react";

export function MarkdownRenderer({ content }: { content: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="animate-pulse">Loading content...</div>;
    }

    // Check if content is HTML (starts with <!DOCTYPE or <html or contains HTML tags)
    const isHTML = content.trim().startsWith('<!DOCTYPE') ||
        content.trim().startsWith('<html') ||
        /<[a-z][\s\S]*>/i.test(content);

    if (isHTML) {
        // Render raw HTML directly
        return (
            <div
                dangerouslySetInnerHTML={{ __html: content }}
                className="html-content"
            />
        );
    }

    // For non-HTML content, render as plain text with basic formatting
    return (
        <div className="whitespace-pre-wrap">
            {content}
        </div>
    );
}
