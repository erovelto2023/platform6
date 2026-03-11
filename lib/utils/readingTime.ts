/**
 * Estimates reading time for glossary term content
 * Based on average reading speed of 200-250 words per minute
 */

export function calculateReadingTime(content: string): number {
  if (!content) return 0;
  
  // Remove HTML tags and count words
  const plainText = content.replace(/<[^>]*>/g, '');
  const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Average reading speed: 225 words per minute
  const wordsPerMinute = 225;
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, readingTimeMinutes); // Minimum 1 minute
}

export function formatReadingTime(minutes: number): string {
  if (minutes === 1) return '1 min read';
  if (minutes < 60) return `${minutes} min read`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) return `${hours} hour read`;
  return `${hours}h ${remainingMinutes}m read`;
}

export function getReadingTimeEstimate(term: {
  definition?: string;
  shortDefinition?: string;
  expandedExplanation?: string;
  howItWorks?: string;
  benefits?: string;
  commonPractices?: string;
  misconceptions?: string;
  warningsOrNotes?: string;
}): string {
  const allContent = [
    term.definition,
    term.shortDefinition,
    term.expandedExplanation,
    term.howItWorks,
    term.benefits,
    term.commonPractices,
    term.misconceptions,
    term.warningsOrNotes
  ].filter(Boolean).join(' ');
  
  const minutes = calculateReadingTime(allContent);
  return formatReadingTime(minutes);
}
