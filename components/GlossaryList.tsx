'use client';

import { useState } from 'react';
import { Search, BookOpen, Hash } from 'lucide-react';

interface GlossaryItem {
  _id: string;
  term: string;
  definition: string;
  slug: string;
}

export default function GlossaryList({ glossary, keyword = 'Training', accentColor = '#22d3ee' }: { glossary: GlossaryItem[]; keyword?: string; accentColor?: string }) {
  const [search, setSearch] = useState('');

  const filteredGlossary = glossary.filter((item) =>
    item.term.toLowerCase().includes(search.toLowerCase()) ||
    item.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="glossary" className="bg-slate-900 text-slate-100 p-8 rounded-3xl shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span 
            className="text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-1 rounded-md border"
            style={{
              color: accentColor,
              backgroundColor: `${accentColor}15`,
              borderColor: `${accentColor}30`
            }}
          >
            Semantic Dictionary
          </span>
          <h2 className="text-2xl font-bold mt-3">2. {keyword} Glossary</h2>
          <p className="text-xs text-slate-400 mt-1">
            Essential vocabulary terms every student of {keyword.toLowerCase()} must comprehend.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search glossary terms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 text-white placeholder-slate-500"
            style={{ '--tw-ring-color': accentColor } as any}
          />
        </div>
      </div>

      {filteredGlossary.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-xs">
          No glossary terms match your search "{search}".
        </div>
      ) : (
        <div className="divide-y divide-slate-800">
          {filteredGlossary.map((item) => (
            <div
              key={item._id}
              id={`term-${item.slug}`}
              className="py-5 scroll-mt-24 group transition duration-150"
            >
              <dt 
                className="font-bold text-base flex items-center gap-1.5"
                style={{ color: accentColor }}
              >
                <Hash className="w-4 h-4 opacity-50" />
                {item.term}
              </dt>
              <dd className="text-sm text-slate-350 mt-1.5 leading-relaxed pl-5 border-l border-slate-800">
                {item.definition}
              </dd>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
