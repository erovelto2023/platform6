"use client";

import { useEffect, useState, useRef } from "react";

export function MarkdownRenderer({ content }: { content: string }) {
    const [mounted, setMounted] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        setMounted(true);
        
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'iframe-resize' && iframeRef.current) {
                iframeRef.current.style.height = `${event.data.height + 50}px`;
            }
        };
        
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    if (!mounted) {
        return <div className="animate-pulse">Loading content...</div>;
    }

    // Check if content is HTML (starts with <!DOCTYPE or <html or contains HTML tags)
    const isHTML = content.trim().startsWith('<!DOCTYPE') ||
        content.trim().startsWith('<html') ||
        /<[a-z][\s\S]*>/i.test(content);

    if (isHTML) {
        // Render raw HTML isolated securely in an iframe so its `<style>` tags don't break Tailwind
        const injectedContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <base target="_blank">
                <style>
                    body { 
                        margin: 0; 
                        padding: 0; 
                        background: white; 
                        overflow-y: hidden;
                    }
                </style>
            </head>
            <body>
                ${content}
                <script>
                    function sendHeight() {
                        const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
                        window.parent.postMessage({ type: 'iframe-resize', height: height }, '*');
                    }
                    window.onload = sendHeight;
                    // Listen to DOM changes if images load late
                    new MutationObserver(sendHeight).observe(document.body, { childList: true, subtree: true, attributes: true });
                    setInterval(sendHeight, 1000); // Fallback heartbeat
                </script>
            </body>
            </html>
        `;

        return (
            <iframe
                ref={iframeRef}
                title="Document Viewer"
                srcDoc={injectedContent}
                className="w-full border-none bg-white min-h-[800px]"
                sandbox="allow-same-origin allow-scripts allow-popups"
            />
        );
    }

    // For non-HTML content, render as plain text with basic formatting
    return (
        <div className="whitespace-pre-wrap p-8">
            {content}
        </div>
    );
}
