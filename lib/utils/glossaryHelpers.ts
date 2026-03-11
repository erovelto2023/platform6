import { getGlossaryTerms } from "@/lib/actions/glossary.actions";
import { autoLinkGlossaryTerms } from "./glossaryAutoLink";
import { getReadingTimeEstimate } from "./readingTime";

/**
 * Enhanced auto-linking function that fetches terms and applies linking
 */
export async function processContentWithGlossary(content: string, currentSlug?: string): Promise<string> {
  try {
    const { terms } = await getGlossaryTerms({ limit: 1000 });
    const termsForLinking = terms.map((term: any) => ({
      term: term.term,
      slug: term.slug
    }));
    
    return autoLinkGlossaryTerms(content, termsForLinking, currentSlug);
  } catch (error) {
    console.error('Error processing content with glossary:', error);
    return content;
  }
}

/**
 * Get glossary statistics for dashboard/analytics
 */
export async function getGlossaryStats() {
  try {
    const { terms } = await getGlossaryTerms({ limit: 0 });
    
    const stats = {
      totalTerms: terms.length,
      categories: new Set(terms.map((t: any) => t.category || 'General')).size,
      averageReadingTime: 0,
      difficultyDistribution: {
        Beginner: 0,
        Intermediate: 0,
        Advanced: 0
      },
      featuredTerms: terms.filter((t: any) => t.isFeatured).length,
      termsWithTags: terms.filter((t: any) => t.tags && t.tags.length > 0).length
    };

    // Calculate average reading time
    const totalReadingTime = terms.reduce((sum: number, term: any) => {
      return sum + parseInt(getReadingTimeEstimate(term).split(' ')[0]) || 0;
    }, 0);
    stats.averageReadingTime = Math.round(totalReadingTime / terms.length);

    // Calculate difficulty distribution
    terms.forEach((term: any) => {
      const difficulty = term.contentLevel || term.skillRequired || 'Beginner';
      if (stats.difficultyDistribution[difficulty as keyof typeof stats.difficultyDistribution] !== undefined) {
        stats.difficultyDistribution[difficulty as keyof typeof stats.difficultyDistribution]++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error getting glossary stats:', error);
    return null;
  }
}

/**
 * Get random terms for "Term of the Day" or similar features
 */
export async function getRandomTerms(count: number = 5) {
  try {
    const { terms } = await getGlossaryTerms({ limit: 1000 });
    const shuffled = [...terms].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  } catch (error) {
    console.error('Error getting random terms:', error);
    return [];
  }
}

/**
 * Search terms with advanced filtering
 */
export async function searchGlossaryTerms(query: string, filters: {
  category?: string;
  difficulty?: string;
  tags?: string[];
} = {}) {
  try {
    const { terms } = await getGlossaryTerms({ limit: 1000 });
    
    return terms.filter((term: any) => {
      const matchesQuery = !query || 
        term.term.toLowerCase().includes(query.toLowerCase()) ||
        term.shortDefinition?.toLowerCase().includes(query.toLowerCase()) ||
        term.definition?.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !filters.category || term.category === filters.category;
      const matchesDifficulty = !filters.difficulty || 
        term.contentLevel === filters.difficulty || 
        term.skillRequired === filters.difficulty;
      const matchesTags = !filters.tags?.length || 
        filters.tags.some(tag => term.tags?.includes(tag)) ||
        filters.tags.includes(term.category || '');
      
      return matchesQuery && matchesCategory && matchesDifficulty && matchesTags;
    });
  } catch (error) {
    console.error('Error searching glossary terms:', error);
    return [];
  }
}
