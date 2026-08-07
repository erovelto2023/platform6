"use client";

import React, { useState, useEffect } from "react";

interface BoardPatternPreviewProps {
    patternId: string;
}

export const BoardPatternPreview: React.FC<BoardPatternPreviewProps> = ({ patternId }) => {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const loadSvg = async () => {
            try {
                let fileName: string;
                let filePath: string;

                if (patternId.startsWith("board-")) {
                    // Handle game board patterns
                    const boardNumber = patternId.replace("board-", "");
                    fileName = `board_${boardNumber}_crystalized.svg`;
                    filePath = `/board-game-pieces/${fileName}`;
                } else if (patternId.startsWith("piece-")) {
                    // Handle board pieces with simplified file name mapping
                    const pieceName = patternId.replace("piece-", "");
                    // Special cases for files that don't match the pattern
                    const specialCases: Record<string, string> = {
                        "x-part": "xpart",
                        "y-section": "ysection",
                    };
                    const baseName = specialCases[pieceName] || pieceName.replace(/-/g, "_");
                    fileName = `${baseName}_crystalized.svg`;
                    filePath = `/board-game-pieces/${fileName}`;
                } else {
                    throw new Error("Unknown pattern ID format");
                }

                const fullPath = window.location.origin + filePath;
                const response = await fetch(fullPath);
                if (!response.ok) {
                    throw new Error(`Failed to load SVG: ${response.statusText}`);
                }
                const svgText = await response.text();
                setSvgContent(svgText);
                setError(false);
            } catch (err) {
                console.error("Error loading SVG:", err);
                setError(true);
                setSvgContent(null);
            }
        };

        loadSvg();
    }, [patternId]);

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
                <span className="text-xs">SVG Error</span>
            </div>
        );
    }

    if (!svgContent) {
        return (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
                <div className="animate-spin w-4 h-4 border-2 border-slate-300 border-t-indigo-500 rounded-full" />
            </div>
        );
    }

    return (
        <div 
            className="w-full h-full flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
};
