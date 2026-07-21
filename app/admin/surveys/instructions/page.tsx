import { Button } from "@/components/ui/button";
import { BookOpen, HelpCircle, PlayCircle, CheckCircle2, ArrowRight, Zap, Layers, Sparkles, Shield, Share2 } from "lucide-react";
import Link from "next/link";

export default function QuizInstructionsPage() {
    return (
        <div className="p-6 max-w-6xl mx-auto text-slate-100 space-y-8">
            {/* Top Bar Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                <div>
                    <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-1">
                        <BookOpen className="h-4 w-4" /> Instructional & Support Hub
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">Instructions & Tutorials</h1>
                    <p className="text-slate-400 text-sm mt-1">Learn how to craft high-converting quiz funnels, branch questions, and capture leads.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/surveys/create">
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30">
                            <Zap className="mr-2 h-4 w-4" /> Create Quiz Funnel
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Video Tutorial Banner */}
            <div className="bg-gradient-to-r from-indigo-900/50 via-slate-900 to-purple-900/40 rounded-2xl p-6 border border-indigo-500/30 shadow-2xl flex flex-wrap md:flex-nowrap items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full w-fit">
                        <PlayCircle className="h-4 w-4 text-indigo-400" /> Video Tutorial
                    </div>
                    <h2 className="text-2xl font-bold text-white">Getting Started with Quiz Funnels</h2>
                    <p className="text-slate-300 text-sm max-w-2xl">
                        Watch this 5-minute masterclass on creating interactive quiz funnels that convert 3x higher than standard landing pages.
                    </p>
                </div>
                <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold shrink-0 shadow-xl">
                    <PlayCircle className="mr-2 h-5 w-5 text-indigo-600" /> Watch Video Walkthrough
                </Button>
            </div>

            {/* Core Features & Doctor Analogy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold text-white">What is a Quiz Funnel?</h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        QuizFunnels is an interactive platform for creating custom quizzes and surveys that drive engagement and capture qualified leads. Instead of static forms, use dynamic conversations to understand your audience.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span><strong>13+ Specialized Quiz Templates</strong> for lead capture & product recommendation</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span><strong>Image Choice & Multi-Select</strong> interactive question types</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span><strong>Branching Logic Engine</strong> to route questions dynamically per response</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span><strong>Gated Lead Capture</strong> before personalized result delivery</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-amber-950/20 to-slate-900 rounded-2xl border border-amber-500/20 p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Layers className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Pro Tip: The Doctor Analogy</h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Think of your quiz like a doctor's visit:
                    </p>
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-amber-500/20 space-y-2 text-xs text-slate-300">
                        <p>💡 <strong>Questions</strong> are the check-up (gathering info & diagnosing struggles).</p>
                        <p>🎯 <strong>Outcomes</strong> are the diagnosis and prescription (tailored recommendation + action link).</p>
                        <p> Don't just say <em>"You scored 50%"</em>. Tell them <em>"You have a solid foundation, but here are the 3 action steps to reach the next level..."</em></p>
                    </div>
                </div>
            </div>

            {/* Quick Start Guide Steps */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
                <h3 className="text-xl font-bold text-white">4-Step Quick Start Guide</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/60 space-y-2">
                        <div className="text-2xl font-black text-indigo-400">01</div>
                        <h4 className="font-bold text-white text-base">Select Template</h4>
                        <p className="text-slate-400 text-xs">Choose from Lead Qualifier, Product Match, or Knowledge Assessment templates.</p>
                    </div>
                    <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/60 space-y-2">
                        <div className="text-2xl font-black text-indigo-400">02</div>
                        <h4 className="font-bold text-white text-base">Customize Theme</h4>
                        <p className="text-slate-400 text-xs">Set primary brand colors, font family, border radius, and preview live on mobile.</p>
                    </div>
                    <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/60 space-y-2">
                        <div className="text-2xl font-black text-indigo-400">03</div>
                        <h4 className="font-bold text-white text-base">Configure Gated Lead Form</h4>
                        <p className="text-slate-400 text-xs">Capture name, email, and custom fields right before showing result outcomes.</p>
                    </div>
                    <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/60 space-y-2">
                        <div className="text-2xl font-black text-indigo-400">04</div>
                        <h4 className="font-bold text-white text-base">Build Outcomes & Share</h4>
                        <p className="text-slate-400 text-xs">Define score ranges or category buckets and direct users to targeted product CTAs.</p>
                    </div>
                </div>
            </div>

            {/* Embed & Compliance Guidance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold">
                        <Share2 className="h-5 w-5" /> Embedding Anywhere
                    </div>
                    <p className="text-slate-300 text-sm">
                        You can embed your quiz on any website, landing page, or LMS lesson. Use direct share links or iframe embed codes provided in your Quiz Builder.
                    </p>
                </div>
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <Shield className="h-5 w-5" /> GDPR & Compliance
                    </div>
                    <p className="text-slate-300 text-sm">
                        Our lead capture form comes with optional explicit consent toggles to comply with GDPR & CCPA privacy regulations automatically.
                    </p>
                </div>
            </div>
        </div>
    );
}
