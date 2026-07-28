import Link from "next/link";
import { Metadata } from "next";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { StateComparisonMatrix } from "@/components/locations/state-comparison-matrix";
import { ArrowLeft, Scale, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Compare US States Side-by-Side | State Facts & Market Intelligence",
  description: "Compare US states side-by-side on population, land area, statehood rank, official emblems, timezones, and business metrics.",
};

export default function CompareStatesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      <SiteHeader />

      <main className="flex-1 mt-16 pb-20">
        {/* Dark Hero Header */}
        <section className="w-full py-14 md:py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <Link 
              href="/locations"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-all mb-8 font-mono font-bold uppercase tracking-wider text-xs group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to All States
            </Link>

            <div className="text-left max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest mb-6">
                <Sparkles size={14} /> Side-by-Side Research Tool
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-100 uppercase leading-tight">
                US State <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent underline decoration-cyan-500/40 decoration-8 underline-offset-8">Comparison Matrix</span>
              </h1>
              <p className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                Compare US state facts, official emblems, geographical dimensions, demographics, and timezones side-by-side.
              </p>
            </div>
          </div>
        </section>

        {/* Matrix Section */}
        <section className="w-full py-12 bg-slate-950">
          <div className="container px-4 md:px-6 mx-auto">
            <StateComparisonMatrix />
          </div>
        </section>
      </main>
    </div>
  );
}
