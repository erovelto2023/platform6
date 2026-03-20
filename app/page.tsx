"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CheckCircle2, Box, Wrench, 
  Rocket, ChevronDown, Share2, Globe, MessagesSquare,
  School, Palette, HardHat
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MainNav } from "@/components/shared/MainNav";

export default function LandingPage() {
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
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      {/* Top Navigation Bar */}
      <MainNav />

      <main className="flex-1">
        {/* Hero Section */}
        <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-muted/30">
          <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
          </div>
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center lg:text-left">
            <div className="max-w-4xl mx-auto lg:mx-0">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent text-xs font-black tracking-widest uppercase mb-6"
              >
                The New Standard
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-headline font-black text-primary leading-[1] tracking-tighter mb-8 italic"
              >
                Research. <br/>
                <span className="text-accent underline decoration-muted/30">Roadmap.</span> Results.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-secondary leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0 font-medium"
              >
                Skip the 200-hour niche deep dive. We hand you validated models ready to execute.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <Link href="/sign-up">
                  <button className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-lg hover:bg-accent transition-all shadow-2xl shadow-primary/20 uppercase tracking-widest">
                    Start Building Today
                  </button>
                </Link>
                <Link href="/courses">
                  <button className="px-10 py-5 bg-white text-primary border-2 border-muted rounded-2xl font-black text-lg hover:bg-muted transition-all uppercase tracking-widest">
                    Explore Curriculum
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Who This Is For */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center md:text-left">
              <h2 className="text-4xl font-headline font-black text-primary mb-4 italic uppercase">Who This Is For</h2>
              <p className="text-xl text-secondary max-w-xl font-medium">If you want structure, direction, and execution, you're in the right place.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Beginners", icon: School, text: "Starting from scratch with zero noise and a clear path to your first dollar.", color: "bg-blue-500/10 text-blue-600" },
                { title: "Entrepreneurs", icon: Rocket, text: "Scaling existing ventures with advanced frameworks and systems thinking.", color: "bg-purple-500/10 text-purple-600" },
                { title: "Creators", icon: Palette, text: "Turning personal brands into institutional assets with sustainable revenue models.", color: "bg-pink-500/10 text-pink-600" },
                { title: "Builders", icon: HardHat, text: "Architecting complex businesses using validated data and strategic execution.", color: "bg-orange-500/10 text-orange-600" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8 }}
                  className="p-8 bg-white border border-muted/50 rounded-3xl shadow-sm hover:shadow-xl hover:border-accent/30 transition-all group"
                >
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-headline font-black text-primary mb-3 italic">{item.title}</h3>
                  <p className="text-secondary leading-relaxed font-medium">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get Inside (Bento Grid) */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-headline font-black text-primary mb-4 italic uppercase">What You Get Inside</h2>
              <p className="text-secondary font-medium uppercase tracking-widest text-sm">Elite Assets & Execution Protocols</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              {/* Courses Card */}
              <div className="md:col-span-2 md:row-span-1 bg-muted/30 rounded-3xl p-10 flex flex-col md:flex-row gap-8 items-center border border-muted group overflow-hidden">
                <div className="flex-1">
                  <span className="text-accent font-black text-xs uppercase tracking-widest mb-4 block">Curated Knowledge</span>
                  <h3 className="text-3xl font-headline font-black mb-4 italic">Premium Online Training</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-secondary font-medium">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      HD Video modules covering end-to-end execution.
                    </li>
                    <li className="flex items-center gap-3 text-secondary font-medium">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      Downloadable blueprints & step-by-step checklists.
                    </li>
                  </ul>
                </div>
                <div className="hidden md:block w-1/2 h-full bg-white rounded-2xl shadow-2xl border border-muted group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                   <div className="p-4">
                      <div className="w-full h-4 bg-muted/50 rounded-full mb-4" />
                      <div className="w-2/3 h-4 bg-muted/30 rounded-full mb-8" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-video bg-muted/20 rounded-lg" />
                        <div className="aspect-video bg-muted/20 rounded-lg" />
                      </div>
                   </div>
                </div>
              </div>

              {/* Box Card */}
              <div className="bg-primary text-white rounded-3xl p-8 flex flex-col justify-between border border-primary overflow-hidden relative group">
                <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-accent/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <Box className="w-12 h-12 mb-6 text-accent" />
                  <h3 className="text-3xl font-headline font-black mb-4 italic">Niche Business in a Box</h3>
                  <p className="text-white/70 font-medium">Stop guessing. We provide the niche, the audience data, and the monetization strategy.</p>
                </div>
                <Link href="/niche-boxes" className="relative z-10">
                  <button className="w-full py-4 bg-white text-primary font-black rounded-2xl hover:bg-accent hover:text-white transition-all uppercase tracking-widest">
                    Claim Your Box
                  </button>
                </Link>
              </div>

              {/* Tools Card */}
              <div className="bg-white border-2 border-muted/50 rounded-3xl p-8 flex flex-col justify-between group hover:border-accent transition-all">
                <div>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 text-accent">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-headline font-black mb-3 italic">Built-In Business Tools</h3>
                  <p className="text-secondary text-sm font-medium">Financial modeling sheets, CRM templates, and automated marketing flows ready to deploy.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-black text-primary/40 group-hover:text-accent transition-colors">
                    <ChevronDown className="w-4 h-4" /> Revenue Forecaster
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black text-primary/40 group-hover:text-accent transition-colors">
                    <ChevronDown className="w-4 h-4" /> Lean Operations Matrix
                  </div>
                </div>
              </div>

              {/* Knowledgebase Card */}
              <div className="md:col-span-2 bg-accent text-white rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10 border border-accent relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="hidden sm:block shrink-0 relative z-10">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl animate-pulse" />
                    <div className="w-14 h-14 bg-white/10 rounded-2xl" />
                    <div className="w-14 h-14 bg-white/5 rounded-2xl" />
                    <div className="w-14 h-14 bg-white/30 rounded-2xl" />
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-headline font-black mb-4 italic">Searchable Knowledgebase</h3>
                  <p className="text-white/80 mb-6 max-w-lg font-medium">A living library of every problem we've solved. Search for "LinkedIn Ads" or "Entity Setup" and get instant expert answers.</p>
                  <div className="flex gap-4">
                    <div className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black border border-white/20">1,200+ ARTICLES</div>
                    <div className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black border border-white/20">DAILY UPDATES</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Truth Section */}
        <section className="py-24 bg-muted/10 border-y border-muted/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-5xl font-headline font-black text-primary mb-8 leading-tight italic uppercase">The Truth About <br/>Building Online</h2>
                <div className="space-y-12">
                  {[
                    { id: "01", title: "Clarity Cuts Chaos", desc: "More information is not the answer. Filtered, actionable data is the only way to move forward without burnout." },
                    { id: "02", title: "Tools Don't Build Businesses", desc: "Buying the software won't save you. Having the operational logic behind the software will." },
                    { id: "03", title: "Validated Models Only", desc: "We don't teach \"maybe.\" We teach frameworks that have already generated millions in revenue." }
                  ].map((truth, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="text-accent font-headline font-black text-5xl opacity-20 group-hover:opacity-100 transition-opacity italic">{truth.id}</div>
                      <div>
                        <h4 className="text-2xl font-black text-primary mb-2 italic">{truth.title}</h4>
                        <p className="text-secondary font-medium text-lg leading-relaxed">{truth.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] bg-muted rounded-[3rem] overflow-hidden shadow-2xl relative">
                  <img 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c"
                    alt="Modern Architecture"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20">
                    <p className="italic text-white font-bold text-xl leading-relaxed">"The difference between a hobby and a business is a repeatable roadmap."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advantage Section (Table) */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-4xl font-headline font-black text-center mb-16 italic uppercase underline decoration-accent/30 underline-offset-8">The Academy Advantage</h2>
            <div className="bg-white rounded-3xl overflow-hidden border-2 border-muted shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-8 text-xs font-black uppercase tracking-widest text-secondary">Operational Feature</th>
                      <th className="p-8 text-xs font-black uppercase tracking-widest text-red-500">The "Guru" Way</th>
                      <th className="p-8 text-xs font-black uppercase tracking-widest text-accent">The K Academy Way</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted">
                    {[
                      { f: "Initial Cost", guru: "$2,997+ Premium", kba: "Everything is Free" },
                      { f: "Core Focus", guru: "Vague Inspiration", kba: "Direct Execution" },
                      { f: "Ongoing Support", guru: "Upsell for Access", kba: "Open Knowledgebase" },
                      { f: "Learning Pace", guru: "Drip-fed Content", kba: "Full Library Access" }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-muted/30 transition-colors">
                        <td className="p-8 font-black text-primary italic">{row.f}</td>
                        <td className="p-8 text-secondary font-medium">{row.guru}</td>
                        <td className="p-8 text-primary font-black uppercase tracking-tighter text-lg underline decoration-accent/10">{row.kba}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section (Banner) */}
        <section className="py-24 bg-accent text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]" />
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-headline font-black mb-8 italic uppercase tracking-tighter">Education Should <br/>Be Borderless.</h2>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-medium opacity-90 leading-relaxed italic">
              We believe elite business education shouldn't have a paywall. That's why everything inside K Business Academy is free to access.
            </p>
            <div className="bg-white/10 backdrop-blur-3xl p-10 rounded-[2.5rem] max-w-2xl mx-auto border border-white/20 shadow-2xl">
              <h3 className="text-3xl font-black mb-4 italic">PAY WHAT YOU WANT</h3>
              <p className="mb-8 font-medium opacity-80">If you find value in our blueprints, consider a contribution to help us keep the servers running and the content updated.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/p/pay-your-price">
                  <button className="px-10 py-4 bg-white text-accent font-black rounded-2xl hover:scale-105 transition-all uppercase tracking-widest shadow-xl shadow-black/20">Contribute</button>
                </Link>
                <Link href="/about">
                  <button className="px-10 py-4 bg-transparent border-2 border-white/40 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest">Learn More</button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white border-b border-muted">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl font-headline font-black text-center mb-16 italic uppercase underline decoration-muted underline-offset-12">F.A.Q</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                { q: "Is it really free?", a: "Yes. Every course, tool, and article is accessible without a credit card. We operate on a value-first, donation-based model." },
                { q: "How often is the content updated?", a: "We update the knowledgebase daily and release major course updates quarterly to reflect the changing digital landscape." },
                { q: "Do I need prior experience?", a: "No. We have specific tracks designed for absolute beginners to take them from zero to operational." }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-muted/10 rounded-2xl px-6 border-none">
                  <AccordionTrigger className="text-xl font-black text-primary hover:text-accent italic py-8">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-secondary text-lg font-medium pb-8 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 bg-primary text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h2 className="text-6xl md:text-8xl font-headline font-black mb-8 tracking-tighter italic uppercase">Ready To Execute?</h2>
            <p className="text-2xl font-medium text-white/70 mb-12 max-w-2xl mx-auto">Join 10,000+ ambitious creators building the future of online business.</p>
            <Link href="/sign-up">
              <button className="px-16 py-6 bg-accent text-white rounded-[2rem] font-black text-2xl shadow-3xl shadow-accent/40 hover:scale-105 transition-all uppercase tracking-widest">
                Join K Business Academy
              </button>
            </Link>
            <p className="mt-8 text-sm font-black text-white/30 uppercase tracking-[0.3em]">No credit card required • Instant access</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-20 px-6 border-t border-muted">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-1">
            <div className="text-3xl font-headline font-black text-primary mb-6 italic tracking-tighter">K ACADEMY</div>
            <p className="text-secondary font-medium leading-relaxed">Elevating professional growth through radical transparency and validated business models.</p>
          </div>
          <div className="space-y-6">
            <h4 className="font-black text-primary uppercase tracking-widest text-sm">Resources</h4>
            <ul className="text-base space-y-4 text-secondary font-medium">
              <li><Link className="hover:text-accent transition-colors" href="/courses">Courses</Link></li>
              <li><Link className="hover:text-accent transition-colors" href="/library">Library</Link></li>
              <li><Link className="hover:text-accent transition-colors" href="/glossary">Knowledgebase</Link></li>
              <li><Link className="hover:text-accent transition-colors" href="/business-resources">Business Tools</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-black text-primary uppercase tracking-widest text-sm">Company</h4>
            <ul className="text-base space-y-4 text-secondary font-medium">
              <li><Link className="hover:text-accent transition-colors" href="/about">About</Link></li>
              <li><Link className="hover:text-accent transition-colors" href="/mission">Mission</Link></li>
              <li><Link className="hover:text-accent transition-colors" href="/p/pay-your-price">Donations</Link></li>
              <li><Link className="hover:text-accent transition-colors" href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-black text-primary uppercase tracking-widest text-sm">Legal</h4>
            <ul className="text-base space-y-4 text-secondary font-medium">
              <li><Link className="hover:text-accent transition-colors" href="#">Terms</Link></li>
              <li><Link className="hover:text-accent transition-colors" href="#">Privacy</Link></li>
              <li><Link className="hover:text-accent transition-colors" href="#">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-muted flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-secondary font-black text-xs uppercase tracking-widest opacity-50">© 2025 K Business Academy. Elevating professional growth.</p>
          <div className="flex gap-8">
            <Link className="text-primary hover:text-accent transition-colors" href="#"><Globe className="w-6 h-6" /></Link>
            <Link className="text-primary hover:text-accent transition-colors" href="#"><Share2 className="w-6 h-6" /></Link>
            <Link className="text-primary hover:text-accent transition-colors" href="#"><MessagesSquare className="w-6 h-6" /></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
