"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SimpleHeroSlideshow } from "@/components/animations";
import { motion } from "framer-motion";
import {
    Users, BarChart3, Globe, Share2, Target,
    Handshake, Network, TrendingUp, CheckCircle2, ArrowRight,
    Facebook, Youtube
} from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";

export default function AffiliateCRMPage() {
    const heroSlides = [
        {
            title: 'Partnership Ecosystem Management',
            subtitle: 'Scale your leverage through professional relationships. A high-performance CRM built for elite partnership growth.',
            backgroundImage: '/heroimages/affiliate_premium.png',
            ctaText: 'Access CRM',
            ctaLink: '/sign-up',
        }
    ];

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
                <SimpleHeroSlideshow slides={heroSlides} autoplay={false} />

                {/* CRM Philosophy */}
                <section className="w-full py-24 bg-[#fefae0]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="max-w-4xl mx-auto text-center mb-24">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                            >
                                <span className="text-[#bc6c25] font-black tracking-widest text-xs mb-4 block uppercase underline decoration-2 underline-offset-4">Relational Capital</span>
                                <h2 className="text-4xl md:text-6xl font-black text-[#283618] mb-8 leading-tight">
                                    Strategic Growth Through Networks.
                                </h2>
                                <p className="text-xl text-[#283618]/60 leading-relaxed max-w-3xl mx-auto">
                                    Traditional marketing is expensive. Relational marketing is profound. K Business Academy provides the infrastructure to track, manage, and scale your partnership network with professional-grade precision.
                                </p>
                            </motion.div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-[#283618] p-12 rounded-[3.5rem] text-[#fefae0] relative"
                            >
                                <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#dda15e] rounded-full blur-[60px] opacity-30" />
                                <h3 className="text-3xl font-black mb-8">Ecosystem Metrics</h3>
                                <div className="space-y-8">
                                    {[
                                        { title: "Real-Time Attribution", icon: BarChart3, color: "#606c38" },
                                        { title: "Network Visualization", icon: Network, color: "#bc6c25" },
                                        { title: "Relational CRM", icon: Users, color: "#dda15e" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-6 items-center">
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: item.color }}>
                                                <item.icon size={28} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold">{item.title}</h4>
                                                <p className="text-sm opacity-60">High-fidelity data tracking for every connection.</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <div className="space-y-12">
                                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                                    <h3 className="text-3xl font-black text-[#283618] mb-6 underline decoration-[#dda15e] decoration-4 underline-offset-8">Professional Integration</h3>
                                    <p className="text-[#283618]/70 leading-relaxed">
                                        Our CRM isn't just about links. It's about data-driven partnership management. Integration is seamless, and attribution is absolute.
                                    </p>
                                </motion.div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        "Automated Payouts",
                                        "Tiered Commission",
                                        "Marketing Toolkit",
                                        "Priority Support",
                                        "Direct Messaging",
                                        "White-Label Options"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 size={20} className="text-[#606c38]" />
                                            <span className="font-bold text-[#283618]">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                                    <Link href="/sign-up">
                                        <Button className="bg-[#bc6c25] hover:bg-[#606c38] text-[#fefae0] h-16 px-10 rounded-2xl font-black text-lg transition-all group">
                                            Apply for Partnership <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust/Global Presence */}
                <section className="w-full py-24 bg-[#e2e7d1] rounded-t-[4rem]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-4xl font-black text-[#283618] mb-6">A Global Network of Operators</h2>
                            <p className="text-lg text-[#283618]/60">Our affiliate partners aren't "influencers." They are business operators, strategists, and leaders who recognize the value of system-based education.</p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                             {/* Icons represent prestigious global presence */}
                             <Globe size={48} className="text-[#283618]" />
                             <Target size={48} className="text-[#283618]" />
                             <Share2 size={48} className="text-[#283618]" />
                             <TrendingUp size={48} className="text-[#283618]" />
                             <Handshake size={48} className="text-[#283618]" />
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - Professional Theme */}
            <footer className="py-12 bg-[#283618] text-[#fefae0]/50 border-t border-[#fefae0]/5">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                        <div>
                            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                                <div className="w-8 h-8 bg-[#606c38] rounded flex items-center justify-center font-black text-[#fefae0]">K</div>
                                <span className="font-bold tracking-tighter text-[#fefae0]">K BUSINESS ACADEMY</span>
                            </div>
                            <p className="max-w-xs text-xs opacity-60">Leveraging relational infrastructure for systemic global growth.</p>
                        </div>
                        <nav className="flex gap-10">
                            <Link href="#" className="font-bold hover:text-[#dda15e] transition-colors text-sm">Agreement</Link>
                            <Link href="#" className="font-bold hover:text-[#dda15e] transition-colors text-sm">Ethics Code</Link>
                            <Link href="#" className="font-bold hover:text-[#dda15e] transition-colors text-sm">Dashboard</Link>
                            <Link href="#" className="font-bold hover:text-[#dda15e] transition-colors text-sm">Support</Link>
                        </nav>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <Link href="https://facebook.com/erovelto" target="_blank" className="bg-[#fefae0]/5 p-3 rounded-full hover:bg-[#606c38] transition-colors"><Facebook size={20} className="text-[#fefae0]" /></Link>
                            <Link href="https://youtube.com/@KBusinessAcademy" target="_blank" className="bg-[#fefae0]/5 p-3 rounded-full hover:bg-[#606c38] transition-colors"><Youtube size={20} className="text-[#fefae0]" /></Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
