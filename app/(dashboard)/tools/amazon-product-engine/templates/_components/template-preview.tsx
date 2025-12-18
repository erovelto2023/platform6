"use client";

import { useState, useEffect } from "react";

interface TemplatePreviewProps {
    content: string;
}

export const TemplatePreview = ({ content }: TemplatePreviewProps) => {
    const [previewHtml, setPreviewHtml] = useState("");

    // Mock data for preview
    const mockData = {
        title: "Apple MacBook Air M2 Chip (13-inch, 8GB RAM, 256GB SSD Storage)",
        image: "https://m.media-amazon.com/images/I/71TPda7cwUL._AC_SL1500_.jpg",
        price: "$999.00",
        rating: "4.8",
        link: "#",
        asin: "B08N5WRWNW"
    };

    useEffect(() => {
        let html = content;
        Object.entries(mockData).forEach(([key, value]) => {
            html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });
        setPreviewHtml(html);
    }, [content]);

    return (
        <div className="border rounded-lg p-4 bg-white">
            <div className="text-xs text-muted-foreground mb-2 uppercase font-bold tracking-wider">
                Live Preview
            </div>
            <div
                className="preview-container"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
        </div>
    );
};
