"use client";

import React, { useEffect, useRef } from 'react';

interface CustomHTMLRendererProps {
    html: string;
    className?: string;
}

export const CustomHTMLRenderer: React.FC<CustomHTMLRendererProps> = ({ html, className }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Find all script tags in the provided HTML
        const scripts = containerRef.current.querySelectorAll('script');
        
        scripts.forEach((oldScript) => {
            const newScript = document.createElement('script');
            
            // Copy all attributes from the old script to the new one
            Array.from(oldScript.attributes).forEach((attr) => {
                newScript.setAttribute(attr.name, attr.value);
            });

            // If it's an inline script, copy the content
            if (oldScript.innerHTML) {
                newScript.innerHTML = oldScript.innerHTML;
            }

            // Replace the old script with the new one to trigger execution
            oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
    }, [html]);

    return (
        <div 
            ref={containerRef}
            className={className}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};
