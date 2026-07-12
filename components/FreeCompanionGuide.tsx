'use client';

import { useState } from 'react';
import { Mail, Check, Loader2 } from 'lucide-react';

export default function FreeCompanionGuide({ keyword = 'Training', accentColor = '#6366f1' }: { keyword?: string; accentColor?: string }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    // Simulate database newsletter opt-in save
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setEmail('');
    }, 1500);
  };

  const description = keyword.toLowerCase().includes('dog') || keyword.toLowerCase().includes('pet')
    ? 'Grab our quick guide containing 15 behavioral quick-fixes for immediately handling excessive barking and chewing problems.'
    : `Grab our quick guide containing expert tips and strategies to master ${keyword.toLowerCase()} today.`;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-start gap-3">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
        >
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">📖 Free PDF Companion Guide</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-xl text-center space-y-1">
          <p className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" /> Guide Sent Successfully!
          </p>
          <p className="text-[10px] text-emerald-600">Please check your inbox (and spam folder) in a few minutes.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full text-xs px-3 py-2.5 border border-slate-250 rounded-xl focus:outline-none focus:ring-2 text-slate-800 placeholder-slate-450 bg-slate-50"
            style={{ '--tw-ring-color': accentColor } as any}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-100 hover:text-white transition duration-150 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            style={{ 
              color: '#334155',
              '--hover-bg': accentColor
            } as any}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentColor; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#334155'; }}
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              'Send Me The Ebook'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
