'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SimpleHeroSlideshow } from "@/components/animations";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/shared/SiteHeader";
import {
    BookOpen, Clock, Layers, Video, FileText, FolderOpen, RefreshCw,
    Zap, TrendingUp, ShieldCheck, CheckCircle2, Target, Rocket, Award,
    ChevronRight, Binary, GraduationCap
} from "lucide-react";

export default function CoursesPage() {
    // Hero slides for courses page
    const heroSlides = [
        {
            title: 'The Execution Engine.',
            subtitle: "Easy step-by-step videos you can watch at your own pace. All with clear workbooks and plans.",
            backgroundImage: '/heroimages/courses_premium.png',
            ctaText: 'Start Learning',
            ctaLink: '/sign-up',
        }
    ];

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#fefae0]">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero section */}
                <SimpleHeroSlideshow slides={heroSlides} autoplay={false} />

                {/* The K Academy Philosophy */}
                <section className="w-full py-24 bg-[#fefae0]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col md:flex-row gap-16 items-center">
                            <motion.div 
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="md:w-1/2"
                            >
                                <Badge className="bg-[#dda15e]/10 text-[#bc6c25] border-[#bc6c25]/20 mb-6 px-4 py-1 uppercase tracking-widest font-black">STEP-BY-STEP COURSES</Badge>
                                <h2 className="text-4xl md:text-5xl font-black text-[#283618] leading-[1.1] mb-8">
                                    Simple Lessons for Digital Marketers.
                                </h2>
                                <p className="text-xl text-[#283618]/70 leading-relaxed mb-8">
                                    Most courses are confusing. Ours are built for beginners. Whether you want to make your first dollar or build a big brand, we give you the simple steps to get it done.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { title: "Foundational Mechanics", icon: Binary },
                                        { title: "Systemic Scaling", icon: TrendingUp },
                                        { title: "Operational Excellence", icon: ShieldCheck },
                                        { title: "Strategic Leverage", icon: Target }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#606c38]/10 rounded-lg flex items-center justify-center text-[#606c38]">
                                                <item.icon size={20} />
                                            </div>
                                            <span className="font-bold text-[#283618]">{item.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="md:w-1/2 p-8 bg-[#e2e7d1] rounded-[2.5rem] border-2 border-[#606c38]/10 relative"
                            >
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#dda15e] rounded-full flex items-center justify-center text-[#fefae0] font-black text-2xl shadow-xl">100%</div>
                                <h3 className="text-2xl font-black text-[#283618] mb-6 underline decoration-[#dda15e] decoration-4 underline-offset-8">Our Promise to You</h3>
                                <ul className="space-y-6">
                                    {[
                                        { title: "Updated Lessons", desc: "Our lessons are always new. If we don't have a video on a topic you need? Tell us, and we’ll build it for you." },
                                        { title: "No Fluff", desc: "Every video is short and packed with real steps. We don't waste your time with useless talk." },
                                        { title: "Easy Plans", desc: "Blueprints and worksheets that help you start building your business right away." }
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4">
                                            <div className="mt-1.5"><CheckCircle2 size={18} className="text-[#606c38]" /></div>
                                            <div>
                                                <h4 className="font-bold text-[#283618]">{item.title}</h4>
                                                <p className="text-sm text-[#283618]/60">{item.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Multimodal Section */}
                <section className="w-full py-24 bg-[#283618] text-[#fefae0] rounded-t-[3rem]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-5xl font-black mb-6">A Multi-Dimensional Learning Ecosystem</h2>
                            <p className="text-lg opacity-70">We recognize that true mastery requires seeing concepts from multiple angles. Our curriculum is delivered across four mission-critical formats.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: Video, title: "Deep-Dive Video", desc: "Visual walkthroughs of complex systems and strategic execution." },
                                { icon: FileText, title: "Technical Manuals", desc: "High-level written curriculum for reference and implementation." },
                                { icon: FolderOpen, title: "Operational Assets", desc: "Downloadable blueprints, templates, and calculators." },
                                { icon: RefreshCw, title: "Iterative Updates", desc: "Live curriculum that adapts to the current market climate." }
                            ].map((item, i) => (
                                <div key={i} className="bg-[#606c38]/20 p-8 rounded-[2rem] border border-[#fefae0]/10 hover:border-[#dda15e] transition-all group">
                                    <div className="w-14 h-14 bg-[#dda15e] rounded-2xl flex items-center justify-center text-[#283618] mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                        <item.icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-black mb-3">{item.title}</h3>
                                    <p className="text-sm opacity-60 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Certification/Trust Section */}
                <section className="w-full py-24 bg-[#fefbe7]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="bg-[#606c38] rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 text-[#fefae0] relative overflow-hidden">
                            <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-[#bc6c25]/20 rounded-full blur-[80px]" />
                            <div className="md:w-2/3 relative z-10">
                                <h2 className="text-4xl md:text-6xl font-black leading-tight mb-8">Ready to Build for $497/yr?</h2>
                                <p className="text-xl opacity-80 mb-10 leading-relaxed">
                                    Get every video lesson, join our weekly live classes, and get all the unannounced bonuses we release.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href="/sign-up">
                                        <Button className="bg-[#bc6c25] hover:bg-[#dda15e] text-[#fefae0] px-10 h-16 rounded-2xl font-black text-lg transition-all shadow-2xl">
                                            Enroll in the Academy
                                        </Button>
                                    </Link>
                                    <Link href="/library">
                                        <Button variant="outline" className="border-[#fefae0]/30 text-[#fefae0] hover:bg-[#fefae0]/10 px-10 h-16 rounded-2xl font-black text-lg backdrop-blur-sm">
                                            View Library
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="md:w-1/3 flex flex-col gap-6 relative z-10">
                                <div className="bg-[#fefae0]/10 p-6 rounded-2xl backdrop-blur-md border border-[#fefae0]/10">
                                    <GraduationCap className="text-[#dda15e] mb-4" size={40} />
                                    <p className="italic opacity-80 font-medium">"The most comprehensive approach to business operations I've found online. No games, just growth."</p>
                                </div>
                                <div className="flex items-center gap-4 text-sm font-bold ml-4">
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-[#606c38] bg-[#dda15e]" />)}
                                    </div>
                                    <span>Joined by 12,000+ Students</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - Professional Theme */}
            <footer className="py-12 bg-[#283618] text-[#fefae0]/50 border-t border-[#fefae0]/5">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2 grayscale brightness-200 opacity-50">
                            <div className="w-8 h-8 bg-[#606c38] rounded flex items-center justify-center font-black text-[#fefae0]">K</div>
                            <span className="font-bold tracking-tighter">K BUSINESS ACADEMY</span>
                        </div>
                        <nav className="flex gap-10">
                            <Link href="#" className="text-sm font-bold hover:text-[#dda15e] transition-colors">Curriculum</Link>
                            <Link href="#" className="text-sm font-bold hover:text-[#dda15e] transition-colors">Ethics</Link>
                            <Link href="#" className="text-sm font-bold hover:text-[#dda15e] transition-colors">Privacy</Link>
                            <Link href="#" className="text-sm font-bold hover:text-[#dda15e] transition-colors">Support</Link>
                        </nav>
                        <p className="text-xs font-medium uppercase tracking-widest">© 2026 K Business Academy</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
            {children}
        </span>
    );
}
