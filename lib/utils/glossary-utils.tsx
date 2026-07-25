import React from 'react';
import Link from 'next/link';

/**
 * Automatically wraps glossary terms found in text with Links.
 * Simple & effective SEO navigation enhancer.
 */
export function autoLinkContent(text: string, termMap: Map<string, string>) {
    if (!text) return text;

    const terms = Array.from(termMap.keys()).sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`\\b(${terms.map(t => escapeRegExp(t)).join('|')})\\b`, 'gi');
    const result: (string | React.ReactNode)[] = [];

    text.split(pattern).forEach((part, i) => {
        const lowerPart = part.toLowerCase();
        const slug = termMap.get(lowerPart) || termMap.get(part);

        if (slug) {
            result.push(
                <Link 
                    key={i} 
                    href={`/glossary/${slug}`}
                    className="text-cyan-400 font-bold hover:underline decoration-cyan-500/50 underline-offset-4 transition-colors"
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
            return `<a href="/glossary/${slug}" class="text-cyan-400 font-bold hover:underline decoration-cyan-500/50 underline-offset-4 transition-colors">${match}</a>`;
        }
        return match;
    });
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
