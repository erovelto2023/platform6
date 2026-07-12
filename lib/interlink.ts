/**
 * Scans content text for occurrences of glossary terms, and wraps them in anchor links.
 * Ignores terms that are already inside HTML tags or attributes to prevent broken HTML.
 */
export function interlinkContent(
  content: string,
  glossary: Array<{ term: string; slug: string }>
): string {
  if (!content || !glossary || glossary.length === 0) return content;

  let linkedText = content;

  // Sort by term length descending to match compound terms (e.g. "Clicker Training") before sub-terms ("Clicker")
  const sortedGlossary = [...glossary].sort((a, b) => b.term.length - a.term.length);

  for (const item of sortedGlossary) {
    const escapedTerm = item.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    // Pattern matches the term at word boundaries, ensuring it is not inside an HTML tag
    // (?<!<[^>]*) matches text not preceded by an unclosed HTML tag
    // (?![^<]*>) matches text not followed by a closing HTML tag (meaning it is not inside a tag like <a href=...>)
    const regex = new RegExp(`\\b(${escapedTerm})\\b(?![^<]*>)(?<!<[^>]*)`, 'gi');

    // Replace occurrences with an anchor tag linking to the term in the glossary
    linkedText = linkedText.replace(
      regex,
      `<a href="#term-${item.slug}" class="text-indigo-600 hover:text-indigo-800 font-semibold underline decoration-indigo-400 decoration-2 transition">$1</a>`
    );
  }

  return linkedText;
}
