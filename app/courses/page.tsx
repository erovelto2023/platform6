import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    BookOpen, Clock, Layers, Video, FileText, FolderOpen, RefreshCw,
    Zap, TrendingUp, ShieldCheck, CheckCircle2
} from "lucide-react";

export default function CoursesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <header className="px-6 lg:px-10 h-16 flex items-center border-b bg-white sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-xl text-indigo-900">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white">K</div>
                        K Business Academy
                    </Link>
                </div>
                <nav className="ml-auto flex items-center gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4 text-indigo-600" href="/courses">
                        Courses
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/niche-boxes">
                        Niche Boxes
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/blog">
                        Blog
                    </Link>
                    <Link href="/sign-in">
                        <Button variant="ghost" size="sm">Log In</Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-16 md:py-24 bg-gradient-to-b from-indigo-50 to-white">
                    <div className="container px-4 md:px-6 mx-auto text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 mb-6">
                            Learn at Your Pace. <br className="hidden md:inline" />
                            Build with <span className="text-indigo-600">Confidence</span>. <br className="hidden md:inline" />
                            Grow with <span className="text-indigo-600">Clarity</span>.
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-slate-600 mb-8 leading-relaxed">
                            Online Business Courses Designed to Take You from Beginner to Expert. <br />
                            No hype. No rushed learning. Just clear, structured education you can apply immediately.
                        </p>
                    </div>
                </section>

                {/* Self-Paced Learning */}
                <section className="w-full py-16 bg-white">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Self-Paced Learning That Fits Your Life</h2>
                                <p className="text-slate-600 mb-6">
                                    Our courses are 100% self-paced, so you stay in control of your learning experience.
                                    Whether you have 20 minutes or two hours, you can make meaningful progress every time you log in.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Learn when it works for you",
                                        "Revisit lessons anytime",
                                        "Move fast or slow—your choice",
                                        "No deadlines, no pressure"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-indigo-600" />
                                            <span className="text-slate-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
                                <h3 className="text-xl font-bold mb-4">Built for Beginners — Powerful Enough for Experts</h3>
                                <p className="text-slate-600 mb-6">
                                    Our course structure is designed to meet you where you are and guide you forward step by step.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 font-bold text-indigo-600">1</div>
                                        <div>
                                            <h4 className="font-semibold">Newbies</h4>
                                            <p className="text-sm text-slate-500">Get clear foundations and guidance</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 font-bold text-indigo-600">2</div>
                                        <div>
                                            <h4 className="font-semibold">Intermediate</h4>
                                            <p className="text-sm text-slate-500">Gain deeper understanding and strategy</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 font-bold text-indigo-600">3</div>
                                        <div>
                                            <h4 className="font-semibold">Advanced</h4>
                                            <p className="text-sm text-slate-500">Refine systems, execution, and scalability</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Multiple Formats */}
                <section className="w-full py-16 bg-slate-50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Multiple Learning Formats for Real Understanding</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: Video, title: "Video Lessons", desc: "Walkthroughs and explanations that break concepts down clearly and visually." },
                                { icon: FileText, title: "Text-Based Lessons", desc: "Structured written lessons for clarity, reference, and deeper understanding." },
                                { icon: FolderOpen, title: "Resources & Materials", desc: "Guides, checklists, frameworks, and supporting materials." },
                                { icon: RefreshCw, title: "Repeatable Learning", desc: "Return to lessons anytime as your business grows and your needs change." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                        <item.icon className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Practical Education */}
                <section className="w-full py-16 bg-white">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-6">Practical, Action-Driven Education</h2>
                            <p className="text-lg text-slate-600 mb-8">
                                These courses aren’t just about learning—they’re about doing. <br />
                                You’ll learn how concepts fit together, how strategies are applied in real-world scenarios, and how to turn knowledge into actual progress.
                            </p>
                            <div className="grid sm:grid-cols-3 gap-6 text-left">
                                {[
                                    "Understand the “why” behind what you’re doing",
                                    "Build confidence through clarity",
                                    "Take action without guesswork"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                        <span className="font-medium text-slate-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Learning System */}
                <section className="w-full py-16 bg-indigo-900 text-white">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">A Learning System That Grows With You</h2>
                                <p className="text-indigo-200 mb-6">
                                    As online business evolves, so does K Business Academy. Your membership becomes more valuable over time—not outdated.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        "New lessons added regularly",
                                        "Courses expanded and refined",
                                        "Content updated to stay relevant",
                                        "Learning paths that evolve"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-indigo-400" />
                                            <span className="text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm">
                                <h3 className="text-2xl font-bold mb-4">Learn Without Overwhelm</h3>
                                <ul className="space-y-4 mb-6">
                                    <li className="flex items-center gap-3 text-indigo-100">
                                        <ShieldCheck className="h-5 w-5" /> No complicated jargon
                                    </li>
                                    <li className="flex items-center gap-3 text-indigo-100">
                                        <ShieldCheck className="h-5 w-5" /> No information overload
                                    </li>
                                    <li className="flex items-center gap-3 text-indigo-100">
                                        <ShieldCheck className="h-5 w-5" /> No unrealistic expectations
                                    </li>
                                </ul>
                                <p className="text-indigo-200 italic">
                                    "Just organized, structured learning that makes sense—especially if you’ve ever felt lost trying to figure things out on your own."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Foundation */}
                <section className="w-full py-16 bg-white">
                    <div className="container px-4 md:px-6 mx-auto text-center max-w-4xl">
                        <h2 className="text-3xl font-bold mb-6">This Is More Than Courses</h2>
                        <h3 className="text-xl text-indigo-600 font-semibold mb-6">It’s a Foundation for Long-Term Success</h3>
                        <p className="text-lg text-slate-600 mb-8">
                            When you learn through K Business Academy, you’re not just consuming content—you’re building a knowledge base you can rely on for years to come.
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <section className="w-full py-20 bg-slate-50 border-t">
                    <div className="container px-4 md:px-6 mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
                        <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-8">
                            If you’re ready to learn at your own pace, build real skills, and grow with confidence—K Business Academy is ready when you are.
                        </p>
                        <div className="flex flex-col items-center gap-4">
                            <Link href="/sign-up">
                                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-xl px-10 h-14 shadow-lg shadow-indigo-200">
                                    Join K Business Academy
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 K Business Academy. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    );
}
