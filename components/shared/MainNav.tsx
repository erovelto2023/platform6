"use client";

import Link from "next/link";

export function MainNav() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <Link href="/" className="text-xl font-headline font-extrabold text-primary tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md flex items-center justify-center text-white shadow-md font-extrabold text-base">
            K
          </div>
          <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-orange-500 bg-clip-text text-transparent font-black tracking-tight">
            KBusiness Academy
          </span>
        </Link>
        <div className="hidden lg:flex items-center space-x-6 font-sans">
          <Link className="text-sm font-semibold text-slate-300 hover:text-blue-400 transition-colors" href="/courses">Courses</Link>
          <Link className="text-sm font-semibold text-slate-300 hover:text-blue-400 transition-colors" href="/catalog">Catalog</Link>
          <Link className="text-sm font-semibold text-slate-300 hover:text-blue-400 transition-colors" href="/resources">Resources</Link>
          <Link className="text-sm font-semibold text-slate-300 hover:text-blue-400 transition-colors" href="/tools">Tools</Link>
          <Link className="text-sm font-semibold text-slate-300 hover:text-blue-400 transition-colors" href="/dashboard">Dashboard</Link>
          <Link className="text-sm font-semibold text-slate-300 hover:text-blue-400 transition-colors" href="/blog">Blog</Link>
          <Link className="text-sm font-semibold text-slate-300 hover:text-blue-400 transition-colors" href="/glossary">Glossary</Link>
          <Link className="text-sm font-semibold text-slate-300 hover:text-blue-400 transition-colors" href="/questions">FAQs</Link>
        </div>
        <div className="flex items-center space-x-3 font-sans">
          <Link href="/sign-in">
            <button className="px-4 py-2 rounded-md text-slate-200 hover:text-white font-bold text-sm hover:bg-slate-800/60 transition-all cursor-pointer">Log In</button>
          </Link>
          <Link href="/sign-up">
            <button className="px-5 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer">Get Started</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
