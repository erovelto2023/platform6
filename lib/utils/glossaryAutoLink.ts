/**
 * Auto-links glossary terms within an HTML string.
 * Pass in allTerms from getGlossaryTerms(), and HTML content to scan.
 * Returns the HTML with first occurrence of each term wrapped in an <a> tag.
 */
export function autoLinkGlossaryTerms(
    html: string,
    terms: Array<{ term: string; slug: string }>,
    currentSlug?: string
): string {
    if (!html || !terms?.length) return html;

    // Sort longest terms first to prevent partial matches (e.g. "Email" before "Email Marketing")
    const sorted = [...terms]
        .filter(t => t.slug !== currentSlug)
        .sort((a, b) => b.term.length - a.term.length);

    let result = html;
    const linked = new Set<string>();

    for (const { term, slug } of sorted) {
        if (linked.has(slug)) continue;
        // Match the term as a whole word, first occurrence only, case-insensitive
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?<![\\w>])${escaped}(?![\\w<])`, 'i');
        const replaced = result.replace(
            regex,
            (match) => {
                linked.add(slug);
                return `<a href="/glossary/${slug}" class="glossary-autolink" title="${term}">${match}</a>`;
            }
        );
        if (replaced !== result) {
            result = replaced;
        }
    }

    return result;
}
