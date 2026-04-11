"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Users, Tag, BookOpen } from 'lucide-react';

interface Props {
  currentTerm: {
    slug: string;
    category?: string;
    tags?: string[];
    relatedTermIds?: string[];
  };
  allTerms: Array<{
    slug: string;
    term: string;
    shortDefinition: string;
    category?: string;
    tags?: string[];
  }>;
}

export default function RelatedTerms({ currentTerm, allTerms }: Props) {
  const relatedTerms = useMemo(() => {
    const related = new Set<string>();
    const relatedTermsList: Array<{ term: string; slug: string; shortDefinition: string; reason: string }> = [];

    // Add explicitly related terms
    currentTerm.relatedTermIds?.forEach(slug => {
      if (slug !== currentTerm.slug) related.add(slug);
    });

    // Find terms with same category
    if (currentTerm.category) {
      allTerms.forEach(term => {
        if (term.slug !== currentTerm.slug && term.category === currentTerm.category) {
          if (!related.has(term.slug)) {
            related.add(term.slug);
            relatedTermsList.push({
              term: term.term,
              slug: term.slug,
              shortDefinition: term.shortDefinition,
              reason: 'Same category'
            });
          }
        }
      });
    }

    // Find terms with shared tags
    currentTerm.tags?.forEach(tag => {
      allTerms.forEach(term => {
        if (term.slug !== currentTerm.slug && term.tags?.includes(tag)) {
          if (!related.has(term.slug)) {
            related.add(term.slug);
            relatedTermsList.push({
              term: term.term,
              slug: term.slug,
              shortDefinition: term.shortDefinition,
              reason: `Shared tag: ${tag}`
            });
          }
        }
      });
    });

    // Sort by relevance and limit to 6
    return relatedTermsList
      .sort((a, b) => {
        // Prioritize explicitly related terms
        const aIsExplicit = currentTerm.relatedTermIds?.includes(a.slug) ? 1 : 0;
        const bIsExplicit = currentTerm.relatedTermIds?.includes(b.slug) ? 1 : 0;
        if (aIsExplicit !== bIsExplicit) return bIsExplicit - aIsExplicit;
        
        // Then by same category
        const aSameCategory = a.reason === 'Same category' ? 1 : 0;
        const bSameCategory = b.reason === 'Same category' ? 1 : 0;
        if (aSameCategory !== bSameCategory) return bSameCategory - aSameCategory;
        
        return 0;
      })
      .slice(0, 6);
  }, [currentTerm, allTerms]);

  if (relatedTerms.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen size={20} />
          Related Terms
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
          No related terms found for this entry.
        </p>
      </div>
    );
  }

  const getReasonIcon = (reason: string) => {
    if (reason === 'Same category') return <Tag size={14} className="text-blue-500" />;
    if (reason.startsWith('Shared tag')) return <Users size={14} className="text-sky-500" />;
    return <ArrowRight size={14} className="text-indigo-500" />;
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
        <BookOpen size={20} />
        Related Terms
      </h3>
      
      <div className="space-y-3">
        {relatedTerms.map((relatedTerm) => (
          <Link
            key={relatedTerm.slug}
            href={`/glossary/${relatedTerm.slug}`}
            className="block p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getReasonIcon(relatedTerm.reason)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors truncate">
                  {relatedTerm.term}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {relatedTerm.shortDefinition}
                </p>
                <p className="text-xs text-slate-400 mt-1 italic">
                  {relatedTerm.reason}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Link
          href="/glossary"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
        >
          Browse all terms →
        </Link>
      </div>
    </div>
  );
}
