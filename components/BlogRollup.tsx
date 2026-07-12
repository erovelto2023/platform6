'use client';

import { useState } from 'react';
import { BookOpen, X, Clock, HelpCircle } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  isFeatured: boolean;
  readTime: string;
}

export default function BlogRollup({ posts, keyword = 'Training', accentColor = '#6366f1' }: { posts: BlogPost[]; keyword?: string; accentColor?: string }) {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  return (
    <section id="blog" className="space-y-6">
      <div className="flex items-baseline justify-between border-b border-slate-200 pb-3">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">1. Deep-Dive {keyword} Guides</h2>
        <span 
          className="text-xs font-bold px-3 py-1 rounded-full border"
          style={{
            color: accentColor,
            backgroundColor: `${accentColor}10`,
            borderColor: `${accentColor}25`
          }}
        >
          {posts.length} {posts.length === 1 ? 'Article' : 'Articles'} Available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            onClick={() => setActivePost(post)}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition duration-200 flex flex-col justify-between cursor-pointer group"
          >
            <div className="p-6 space-y-3">
              <span 
                className="text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider border"
                style={
                  post.isFeatured
                    ? { backgroundColor: '#fef3c7', color: '#b45309', borderColor: '#fde68a' }
                    : { backgroundColor: `${accentColor}12`, color: accentColor, borderColor: `${accentColor}25` }
                }
              >
                {post.isFeatured ? 'Featured Guide' : `${keyword} Lesson`}
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:opacity-80 transition duration-205">
                {post.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Read Time: {post.readTime}
              </span>
              <span 
                className="group-hover:translate-x-1 transition-transform duration-200 font-semibold flex items-center gap-1"
                style={{ color: accentColor }}
              >
                Read Article &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to read the full article */}
      {activePost && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" style={{ color: accentColor }} />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Article Viewer &bull; {activePost.readTime}
                </span>
              </div>
              <button
                onClick={() => setActivePost(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-350 text-slate-600 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {activePost.title}
              </h3>
              
              <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 flex gap-2 items-center text-xs text-amber-800">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Tip:</strong> Underlined terms link directly to their definitions in the glossary below.
                </span>
              </div>

              {/* Render the pre-interlinked HTML */}
              <div
                className="text-slate-800 leading-relaxed text-sm md:text-base space-y-4 font-normal whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: activePost.content }}
                onClick={(e) => {
                  // If a link is clicked, close the modal so the user jumps to the glossary section smoothly
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
                    setActivePost(null);
                  }
                }}
              />
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActivePost(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-xl text-xs transition"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
