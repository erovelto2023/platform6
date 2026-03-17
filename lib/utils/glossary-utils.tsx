import React from 'react';
import Link from 'next/link';

/**
 * Automatically wraps glossary terms found in text with Links.
 * This is a simple but effective SEO and navigation enhancer.
 */
export function autoLinkContent(text: string, termMap: Map<string, string>) {
    if (!text) return text;

    // Sort terms by length descending to avoid partial matches (e.g., "SEO" vs "SEO Expert")
    const terms = Array.from(termMap.keys()).sort((a, b) => b.length - a.length);
    
    // Create a regex that matches terms, avoiding terms inside existing HTML attributes or tags
    // This is a simplified version; for complex HTML, a more robust parser would be needed.
    // However, since definition fields are usually plain text or simple markdown, this works.
    const pattern = new RegExp(`\\b(${terms.map(t => escapeRegExp(t)).join('|')})\\b`, 'gi');

    const parts = text.split(pattern);
    const result: (string | React.ReactNode)[] = [];

    text.split(pattern).forEach((part, i) => {
        // Every second part is a match due to capturing group in regex
        const lowerPart = part.toLowerCase();
        const slug = termMap.get(lowerPart) || termMap.get(part);

        if (slug) {
            result.push(
                <Link 
                    key={i} 
                    href={`/glossary/${slug}`}
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline decoration-2 underline-offset-4"
                >
                    {part}
                </Link>
            );
        } else {
            result.push(part);
        }
    });

    return result;
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
