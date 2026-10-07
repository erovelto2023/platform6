"use client";

import React, { useEffect, useRef } from 'react';
import { CustomHTMLRenderer } from '@/components/CustomHTMLRenderer';

interface HtmlToolRendererProps {
    htmlCode: string;
    name?: string;
    description?: string;
    className?: string;
}

export default function HtmlToolRenderer({ htmlCode, name, description, className = "" }: HtmlToolRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !htmlCode) return;

        // Parse and execute scripts inside htmlCode if any exist
        const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
        let match;
        const scriptsToExecute: string[] = [];
        const externalScripts: string[] = [];

        // Extract script tags
        while ((match = scriptRegex.exec(htmlCode)) !== null) {
            const scriptTag = match[0];
            const srcMatch = scriptTag.match(/src=["']([^"']+)["']/i);
            if (srcMatch && srcMatch[1]) {
                externalScripts.push(srcMatch[1]);
            } else if (match[1] && match[1].trim()) {
                scriptsToExecute.push(match[1]);
            }
        }

        // Load external scripts first
        externalScripts.forEach(src => {
            const scriptEl = document.createElement('script');
            scriptEl.src = src;
            scriptEl.async = true;
            containerRef.current?.appendChild(scriptEl);
        });

        // Execute inline scripts inside container context
        scriptsToExecute.forEach(code => {
            try {
                const scriptEl = document.createElement('script');
                scriptEl.textContent = code;
                containerRef.current?.appendChild(scriptEl);
            } catch (err) {
                console.error("Error executing custom HTML Tool script:", err);
            }
        });

    }, [htmlCode]);

    if (!htmlCode || !htmlCode.trim()) return null;

    return (
        <div className={`p-6 bg-slate-950 border border-cyan-800/80 rounded-3xl shadow-xl space-y-4 font-sans ${className}`}>
            {name && (
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                        <h4 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                            {name}
                        </h4>
                        {description && (
                            <p className="text-xs text-slate-400 mt-0.5 font-mono">{description}</p>
                        )}
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-md border border-cyan-800">
                        Interactive Tool
                    </span>
                </div>
            )}

            <div ref={containerRef} className="html-tool-content overflow-x-auto">
                <CustomHTMLRenderer html={htmlCode} />
            </div>
        </div>
    );
}
