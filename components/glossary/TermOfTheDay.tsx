"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Share2, Sparkles, Bookmark } from 'lucide-react';

interface Props {
  terms: Array<{
    slug: string;
    term: string;
    shortDefinition: string;
    category?: string;
    imageUrl?: string;
  }>;
}

export default function TermOfTheDay({ terms }: Props) {
  const [termOfTheDay, setTermOfTheDay] = useState<any>(null);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // Select term based on current date for consistency
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % terms.length;
    
    if (terms.length > 0) {
      const selected = terms[index];
      setTermOfTheDay(selected);
      setShareUrl(`${window.location.origin}/glossary/${selected.slug}`);
    }
  }, [terms]);

  const handleShare = async () => {
    if (navigator.share && termOfTheDay) {
      try {
        await navigator.share({
          title: `Term of the Day: ${termOfTheDay.term}`,
          text: `${termOfTheDay.term}: ${termOfTheDay.shortDefinition}`,
          url: shareUrl,
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!termOfTheDay) {
    return (
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-white/20 rounded w-2/3 mb-3"></div>
          <div className="h-4 bg-white/20 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 text-white/80 font-bold text-sm uppercase tracking-wider mb-4">
          <Calendar size={16} />
          Term of the Day
          <Sparkles size={14} className="text-yellow-300" />
        </div>

        {/* Term Content */}
        <Link href={`/glossary/${termOfTheDay.slug}`} className="block group">
          <h3 className="text-3xl font-black mb-3 group-hover:text-yellow-300 transition-colors">
            {termOfTheDay.term}
          </h3>
          {termOfTheDay.category && (
            <span className="inline-block text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 font-semibold mb-3">
              {termOfTheDay.category}
            </span>
          )}
          <p className="text-white/90 leading-relaxed mb-6">
            {termOfTheDay.shortDefinition}
          </p>
          <div className="text-sm font-semibold text-white/80 group-hover:text-yellow-300 transition-colors">
            Learn more →
          </div>
        </Link>

        {/* Share Actions */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/20">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
          >
            <Share2 size={16} />
            Share
          </button>
          <Link
            href={`/glossary/bookmarks`}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
          >
            <Bookmark size={16} />
            Save
          </Link>
        </div>
      </div>
    </div>
  );
}
