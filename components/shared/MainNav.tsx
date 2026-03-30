"use client";

import Link from "next/link";

export function MainNav() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <Link href="/" className="text-xl font-headline font-black text-primary tracking-tight italic flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-sky-500/20 not-italic">
            K
          </div>
          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            K Business Academy
          </span>
        </Link>
        <div className="hidden lg:flex items-center space-x-6">
          <Link className="text-sm font-semibold text-slate-600 hover:text-accent transition-colors" href="/courses">Courses</Link>
          <Link className="text-sm font-semibold text-slate-600 hover:text-accent transition-colors" href="/library">Library</Link>
          <Link className="text-sm font-semibold text-slate-600 hover:text-accent transition-colors" href="/business-resources">Resources</Link>
          <Link className="text-sm font-semibold text-slate-600 hover:text-accent transition-colors" href="/affiliate-crm">Affiliate CRM</Link>
          <Link className="text-sm font-semibold text-slate-600 hover:text-accent transition-colors" href="/dashboard">Dashboard</Link>
          <Link className="text-sm font-semibold text-slate-600 hover:text-accent transition-colors" href="/blog">Blog</Link>
          <Link className="text-sm font-semibold text-slate-600 hover:text-accent transition-colors" href="/glossary">Glossary</Link>
          <Link className="text-sm font-semibold text-slate-600 hover:text-accent transition-colors" href="/locations">Market Intelligence</Link>
          <Link className="text-sm font-semibold text-slate-600 hover:text-accent transition-colors" href="/questions">FAQs</Link>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/sign-in">
            <button className="px-4 py-2 rounded-xl text-primary font-bold text-sm hover:bg-muted/50 transition-all">Log In</button>
          </Link>
          <Link href="/sign-up">
            <button className="px-5 py-2 rounded-xl bg-accent text-white font-bold text-sm shadow-lg shadow-accent/20 hover:opacity-90 transition-all">Get Started</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
