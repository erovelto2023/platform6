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
    const pattern = new RegExp(`\\b(${terms.map(t => escapeRegExp(t)).join('|')})\\b`, 'gi');

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
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline decoration-2 underline-offset-4"
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

/**
 * Generates an HTML string version of the auto-linked content.
 */
export function autoLinkContentHTML(text: string, termMap: Map<string, string>): string {
    if (!text) return "";

    const terms = Array.from(termMap.keys()).sort((a, b) => b.length - a.length);
    if (terms.length === 0) return text;

    const pattern = new RegExp(`\\b(${terms.map(t => escapeRegExp(t)).join('|')})\\b`, 'gi');

    return text.replace(pattern, (match) => {
        const lowerMatch = match.toLowerCase();
        const slug = termMap.get(lowerMatch) || termMap.get(match);

        if (slug) {
            return `<a href="/glossary/${slug}" class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline decoration-2 underline-offset-4">${match}</a>`;
        }
        return match;
    });
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
