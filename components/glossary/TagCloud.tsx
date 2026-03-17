"use client";

import { useMemo } from 'react';
import Link from 'next/link';

interface Props {
  terms: Array<{
    slug: string;
    tags?: string[];
    category?: string;
  }>;
  onSelectTag?: (tag: string) => void;
  activeTag?: string;
}

export default function TagCloud({ terms, onSelectTag, activeTag }: Props) {
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    
    terms.forEach(term => {
      // Add category as a tag
      if (term.category) {
        counts.set(term.category, (counts.get(term.category) || 0) + 1);
      }
      
      // Add all tags
      term.tags?.forEach(tag => {
        if (tag && tag.trim()) {
          counts.set(tag.trim(), (counts.get(tag.trim()) || 0) + 1);
        }
      });
    });
    
    return Array.from(counts.entries())
      .filter(([_, count]) => count >= 2) // Only show tags with 2+ terms
      .sort((a, b) => b[1] - a[1]) // Sort by frequency
      .slice(0, 50); // Limit to top 50 tags
  }, [terms]);

  const getTagSize = (count: number) => {
    const maxCount = Math.max(...tagCounts.map(([_, c]) => c));
    const minCount = Math.min(...tagCounts.map(([_, c]) => c));
    const range = maxCount - minCount || 1;
    const normalized = (count - minCount) / range;
    
    if (normalized > 0.8) return 'text-2xl font-bold';
    if (normalized > 0.6) return 'text-xl font-semibold';
    if (normalized > 0.4) return 'text-lg font-medium';
    if (normalized > 0.2) return 'text-base';
    return 'text-sm';
  };

  const getTagColor = (index: number) => {
    const colors = [
      'text-emerald-600 hover:text-emerald-700',
      'text-blue-600 hover:text-blue-700',
      'text-purple-600 hover:text-purple-700',
      'text-orange-600 hover:text-orange-700',
      'text-pink-600 hover:text-pink-700',
      'text-teal-600 hover:text-teal-700',
      'text-indigo-600 hover:text-indigo-700',
      'text-rose-600 hover:text-rose-700',
    ];
    return colors[index % colors.length];
  };

  if (tagCounts.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Popular Tags</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center">No tags available yet. Add tags to glossary terms to see them here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
      <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Popular Tags</h3>
      <div className="flex flex-wrap gap-3 items-center">
        {tagCounts.map(([tag, count], index) => {
          const isActive = activeTag === tag;
          const TagElement = onSelectTag ? 'button' : Link;
          const tagProps = onSelectTag 
            ? { onClick: () => onSelectTag(tag), type: 'button' as const } 
            : { href: `/glossary?tag=${encodeURIComponent(tag)}` };

          return (
            <TagElement
              key={tag}
              {...(tagProps as any)}
              className={`${getTagSize(count)} ${getTagColor(index)} block transition-all duration-200 underline-offset-2 hover:underline px-2 py-1 rounded-lg ${
                isActive ? 'bg-emerald-100 dark:bg-emerald-900/40 ring-2 ring-emerald-500 underline' : ''
              }`}
            >
              {tag}
              <span className="text-xs font-normal opacity-60 ml-1">({count})</span>
            </TagElement>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Click any tag to see all related terms. Size indicates popularity.
        </p>
      </div>
    </div>
  );
}
