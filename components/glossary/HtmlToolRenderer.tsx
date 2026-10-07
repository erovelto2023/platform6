"use client";

import React, { useRef, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface HtmlToolRendererProps {
    htmlCode: string;
    name?: string;
    description?: string;
    className?: string;
}

export default function HtmlToolRenderer({ htmlCode, name, description, className = "" }: HtmlToolRendererProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    if (!htmlCode || !htmlCode.trim()) return null;

    return (
        <div className={`p-6 bg-slate-950 border border-cyan-800/80 rounded-3xl shadow-xl space-y-4 font-sans ${isFullscreen ? 'fixed inset-4 z-50 overflow-hidden flex flex-col' : className}`}>
            {name && (
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
                    <div>
                        <h4 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                            {name}
                        </h4>
                        {description && (
                            <p className="text-xs text-slate-400 mt-0.5 font-mono">{description}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-md border border-cyan-800">
                            Interactive Tool
                        </span>
                        <button 
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-cyan-800/50"
                            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        >
                            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </div>
                </div>
            )}

            <div className={`html-tool-content rounded-xl overflow-hidden border border-slate-800 bg-slate-900 ${isFullscreen ? 'flex-1' : 'h-[600px]'}`}>
                <iframe 
                    srcDoc={htmlCode}
                    className="w-full h-full border-none"
                    title={name || "Interactive HTML Tool"}
                    sandbox="allow-scripts allow-same-origin allow-downloads allow-popups allow-forms"
                />
            </div>
        </div>
    );
}
