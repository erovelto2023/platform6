"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CheckCircle2, Box, Wrench, 
  Rocket, ChevronDown, Share2, Globe, MessagesSquare,
  School, Palette, HardHat, ArrowRight, ShieldCheck, Zap,
  PlayCircle, Users, BookOpen, Star, Book, MessageCircle, Layout
} from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";

export default function LandingPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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
    <div className="flex flex-col min-h-screen bg-[#fefae0] font-medium text-[#283618]">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden bg-gradient-to-br from-[#606c38] to-[#283618] text-[#fefae0]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.h1 
                variants={fadeInUp}
                className="text-[clamp(2.5rem,8vw,5.5rem)] font-black text-[#283618] leading-[0.9] tracking-tighter mb-8"
              >
                From Newbie <br/>To Expert.
              </motion.h1>
              <motion.p 
                variants={fadeInUp}
                className="text-xl md:text-2xl text-[#283618]/60 font-bold mb-10 max-w-2xl leading-relaxed"
              >
                The #1 Online School for Digital Marketers. <br/>
                Tired of the Hype? Empty Promises? <br/>
                K Business Academy is built for beginners like you.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/courses">
                  <button className="px-10 py-5 bg-[#283618] text-[#fefae0] rounded-2xl font-black text-lg hover:shadow-2xl transition-all uppercase tracking-widest flex items-center gap-2">
                    Join the New Standard <ArrowRight size={20} />
                  </button>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-[#dda15e]/20 blur-[100px] rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" 
                alt="Academy Excellence" 
                className="rounded-[4rem] shadow-2xl relative z-10 border-4 border-[#283618]/10 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          </div>
        </section>

        {/* TRIPLE FEATURE CARDS */}
        <section className="relative z-20 px-6 pb-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "3,000+ Tactical Lessons", desc: "Every module is built for immediate execution.", color: "bg-[#606c38]" },
              { icon: Users, title: "Expert Instruction", desc: "Learn from builders who have actually scaled businesses.", color: "bg-[#283618]" },
              { icon: ShieldCheck, title: "Lifetime Registry Access", desc: "One-time enrollment, permanent data updates.", color: "bg-[#dda15e]" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="bg-white p-10 rounded-[3rem] shadow-xl border border-[#283618]/5 flex flex-col items-center text-center group hover:scale-105 transition-all"
              >
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-[#fefae0] mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform`}>
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-3 italic">{item.title}</h3>
                <p className="text-[#283618]/60 font-bold italic">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* THE ANTI-GURU MANIFESTO */}
        <section className="py-32 px-6 bg-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-7xl font-black text-[#283618] mb-10 tracking-tight">The Anti-Guru Manifesto.</h2>
            <p className="text-2xl md:text-4xl font-bold text-[#606c38] leading-tight mb-12 italic">
                "Stop Buying Hype. Start Building Your Business."
            </p>
            <div className="text-lg md:text-2xl text-[#283618]/70 space-y-8 leading-relaxed font-medium">
                <p>
                    Most online courses sell you a dream, but they don't give you the tools to finish the job. We're different. We focus on steps that actually work.
                </p>
                <p>
                    No more "Shiny Object" traps. No more empty promises. Just the facts you need to succeed as a digital marketer.
                </p>
            </div>
          </div>
        </section>

        {/* YOUR UNFAIR ADVANTAGE: THE INFRASTRUCTURE */}
        <section className="py-24 px-6 bg-[#fefae0]/50">
          <div className="max-w-7xl mx-auto text-center mb-20">
            <h2 className="text-5xl font-black text-[#283618] italic uppercase tracking-tighter mb-4">Your Unfair Advantage</h2>
            <p className="text-[#283618]/40 font-black uppercase tracking-[0.3em] text-xs">The Tools You've Been Missing</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: "The Execution Engine", desc: "Easy step-by-step video courses that show you exactly what to do.", icon: <Zap />, href: "/courses" },
              { title: "Answers Library", desc: "Quick fixes and worksheets for when you need an answer right now.", icon: <Book />, href: "/library" },
              { title: "Research Database", desc: "Stop guessing. See real data for every state so you know what people are buying.", icon: <Globe />, href: "/locations" },
              { title: "Mind-Reader DB", desc: "Learn exactly what your customers are searching for online.", icon: <MessageCircle />, href: "/questions" },
              { title: "Curated Affiliate CRM", desc: "The best products to promote. We only show you what actually pays well.", icon: <Users />, href: "/affiliate-crm" },
              { title: "Operational Infrastructure", desc: "Don't start from zero. Use our templates and tools to go faster.", icon: <Layout />, href: "/business-resources" }
            ].map((feature, i) => (
              <Link key={i} href={feature.href} className="bg-white p-10 rounded-[3rem] shadow-sm border border-[#283618]/5 hover:shadow-2xl transition-all group">
                <div className="w-12 h-12 bg-[#606c38] rounded-xl mb-8 group-hover:scale-110 transition-transform flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 italic leading-tight group-hover:text-[#606c38] transition-colors">{feature.title}</h3>
                <p className="text-[#283618]/50 font-bold italic leading-relaxed text-sm">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* WHY WE ARE DIFFERENT */}
        <section className="py-32 bg-white px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop" 
                alt="Architecture" 
                className="rounded-[4rem] shadow-2xl border-4 border-[#283618]/5 grayscale aspect-square object-cover"
              />
              <div className="absolute -bottom-10 -right-10 bg-[#dda15e] p-10 rounded-[3rem] text-[#283618] shadow-2xl max-w-xs">
                <p className="font-black italic text-xl">"Education should be available to everyone no matter their budget."</p>
              </div>
            </div>
            <div>
              <h2 className="text-5xl font-black text-[#283618] mb-10 italic uppercase leading-[1.1] tracking-tighter">We’ve Evolved <br/>Beyond the Kindle.</h2>
              <div className="text-xl text-[#283618]/70 font-bold italic leading-relaxed space-y-6">
                <p>While we started as the premier destination for Amazon and KDP, the market moved—and so did we. We realized that to truly win today, you need a holistic approach to Digital Marketing.</p>
                <p>We’ve rebuilt the Academy from the ground up to be a student-first ecosystem. Whether you are a "Newbie" looking for your first dollar or a "Builder" architecting a complex brand, we provide the raw data and validated protocols you need to execute.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING REALITY CHECK */}
        <section className="py-32 bg-[#fefae0] px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#606c38] rounded-[3rem] p-12 md:p-24 text-[#fefae0] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#bc6c25]/20 rounded-full blur-[100px] -mr-48 -mt-48" />
              <div className="relative z-10 max-w-3xl">
                <h2 className="text-4xl md:text-7xl font-black mb-10 leading-[0.9]">Why $497 a year?</h2>
                <p className="text-xl md:text-2xl font-bold opacity-80 mb-12 leading-relaxed">
                    Because real tools and research aren't free. This price pays for our weekly live classes and deep-dive research so you can win. No gated secrets. No hidden fees. Just everything you need to build your empire.
                </p>
                <Link href="/sign-up">
                  <button className="px-14 py-6 bg-[#dda15e] text-[#283618] rounded-2xl font-black text-2xl hover:bg-[#fefae0] transition-all uppercase tracking-widest shadow-2xl shadow-black/40">Join the Academy</button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* LEARN NEW SKILLS CHECKLIST */}
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#606c38] rounded-full flex items-center justify-center text-[#fefae0] shadow-2xl rotate-12 z-20">
                <Zap size={32} />
              </div>
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop" 
                alt="Skills" 
                className="rounded-[5rem] shadow-2xl border-8 border-[#fefae0] grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute -bottom-10 -right-10 hidden sm:block">
                <div className="w-40 h-40 bg-[#dda15e] rounded-[3rem] p-8 flex items-center justify-center text-[#283618] shadow-2xl animate-bounce">
                  <PlayCircle size={64} className="fill-current"/>
                </div>
              </div>
            </div>
            
            <div>
              <span className="text-[#bc6c25] font-black tracking-[0.3em] text-xs uppercase mb-6 block underline decoration-4 underline-offset-8 decoration-[#dda15e]/30">Practical Wisdom</span>
              <h2 className="text-5xl font-black text-[#283618] mb-8 italic uppercase leading-[1.1] tracking-tighter">Learn Skills That <br/>Actually Move The Needle.</h2>
              <p className="text-xl text-[#283618]/50 font-bold mb-12 italic leading-relaxed">
                We've stripped away the fluff and academic filler. Everything you learn inside K Business Academy is designed for one thing: real-world execution.
              </p>
              <ul className="space-y-6">
                {[
                  "No generic 'guru' advice. Path-tested frameworks only.",
                  "Daily registry updates to keep track of market shifts.",
                  "A supportive ecosystem of builders and operators.",
                  "Zero hidden costs. Open education for everyone."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-lg font-bold italic text-[#283618]/70">
                    <div className="mt-1 bg-[#606c38] text-[#fefae0] rounded-full p-1 shadow-lg">
                      <CheckCircle2 size={18} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className="mt-12 inline-block">
                <button className="px-10 py-5 bg-[#283618] text-[#fefae0] rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-[#606c38] transition-all shadow-xl shadow-black/10">Start Your Journey</button>
              </Link>
            </div>
          </div>
        </section>

        {/* EXPLORE TOP SUBJECTS GRID */}
        <section className="py-32 px-6 bg-[#fefae0]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-[#283618] italic uppercase tracking-tighter">Explore Specialist Subjects</h2>
              <p className="text-[#283618]/40 font-black uppercase tracking-[0.3em] text-xs mt-4">Focused Intelligence Clusters</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { title: "Infrastructure", img: "https://images.unsplash.com/photo-1497366216548-37526070297c" },
                { title: "Operations", img: "https://images.unsplash.com/photo-1542744094-3a31f272c490" },
                { title: "Marketing", img: "https://images.unsplash.com/photo-1551288049-bbbda536339a" },
                { title: "Sales", img: "https://images.unsplash.com/photo-1557804506-669a67965ba0" },
                { title: "Systems", img: "https://images.unsplash.com/photo-1518770660439-4636190af475" },
                { title: "Content", img: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f" },
                { title: "Analytics", img: "https://images.unsplash.com/photo-1551288049-bbbda536339a" },
                { title: "Automation", img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e" }
              ].map((sub, i) => (
                <Link key={i} href="/library" className="group h-48 relative rounded-[2.5rem] overflow-hidden border border-[#283618]/5 shadow-sm block">
                  <img src={sub.img} alt={sub.title} className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-[#283618]/60 group-hover:bg-[#283618]/20 transition-all duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl font-black text-[#fefae0] uppercase tracking-widest">{sub.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-16">
              <Link href="/library" className="text-[#283618] font-black text-sm uppercase tracking-widest border-b-2 border-[#bc6c25] pb-2 hover:text-[#bc6c25] transition-all">View Full Curriculum Registry</Link>
            </div>
          </div>
        </section>

        {/* LEARNER OUTCOMES (BLOB SECTION) */}
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="lg:order-last">
              <h2 className="text-5xl font-black text-[#283618] mb-8 italic uppercase leading-none tracking-tighter">Tangible Outcomes <br/>For Real Operators.</h2>
              <p className="text-xl text-[#283618]/50 font-bold mb-10 italic">We don't just teach. We build the architecture for your success.</p>
              <div className="space-y-8">
                {[
                  { title: "Direct Operational Clarity", desc: "Know exactly what to do when you log in every Monday morning." },
                  { title: "Institutional Infrastructure", desc: "Build systems that work for you, not the other way around." },
                  { title: "Vetted Partnership Access", desc: "Connect with resources verified by our internal audit team." }
                ].map((outcome, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="bg-[#fefae0] w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border border-[#283618]/5 group-hover:bg-[#606c38] group-hover:text-[#fefae0] transition-all">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#283618] mb-2 italic">{outcome.title}</h4>
                      <p className="text-[#283618]/50 font-bold italic leading-relaxed">{outcome.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative flex justify-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#606c38]/5 rounded-full blur-[80px]" />
              <div className="relative z-10 w-full max-w-lg aspect-[4/5] rounded-[8rem] overflow-hidden border-8 border-[#fefae0] shadow-2xl rotate-2">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop" alt="Outcomes" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              </div>
            </div>
          </div>
        </section>

        {/* COMMUNITY EXPERTS */}
        <section className="py-32 px-6 bg-[#fefae0]/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-5xl font-black text-[#283618] italic uppercase tracking-tighter">The Strategy Council</h2>
              <p className="text-[#283618]/40 font-black uppercase tracking-[0.3em] text-xs mt-4">Vetted Operators & Industry Leaders</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { name: "Julian K.", role: "Lead Architect", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop" },
                { name: "Sarah M.", role: "Market Intelligence", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop" },
                { name: "Daniel V.", role: "Operations Specialist", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" },
                { name: "Elena R.", role: "Systems Engineer", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" }
              ].map((expert, i) => (
                <div key={i} className="text-center group">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white shadow-2xl mb-8 group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0">
                    <img src={expert.img} alt={expert.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-black text-[#283618] mb-2 italic underline decoration-transparent group-hover:decoration-[#bc6c25] transition-all decoration-4 underline-offset-4">{expert.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#283618]/40 italic">{expert.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TAKE THE NEXT STEP (FINAL CTA) */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto bg-[#283618] rounded-[5rem] overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-2xl relative">
            <div className="p-12 lg:p-24 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-[#fefae0] italic uppercase leading-none tracking-tighter mb-10">Get Started. <br/>Scale Higher.</h2>
              <p className="text-xl text-[#fefae0]/60 font-bold mb-14 italic leading-relaxed">
                Take the next step towards your professional goals. Join the K Business Academy infrastructure today and gain unrestricted access to our entire registry.
              </p>
              <Link href="/sign-up">
                <button className="px-14 py-6 bg-[#dda15e] text-[#283618] rounded-2xl font-black text-xl hover:bg-[#fefae0] transition-all uppercase tracking-widest shadow-2xl shadow-black/40">Join the Academy</button>
              </Link>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-l from-[#283618]/0 to-[#283618]" />
              <img src="https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?q=80&w=1000&auto=format&fit=crop" alt="Success" className="w-full h-full object-cover grayscale opacity-50" />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#283618] text-[#fefae0]/40 py-24 px-6 border-t border-[#fefae0]/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="md:col-span-1">
            <div className="text-3xl font-black text-[#fefae0] mb-8 italic tracking-tighter uppercase">K Academy</div>
            <p className="text-sm font-bold leading-relaxed italic mb-8">Professional excellence through radical transparency and systematic roadmaps.</p>
            <div className="flex gap-6">
              {[Globe, Share2, MessagesSquare].map((Icon, i) => (
                <Link key={i} href="#" className="hover:text-[#dda15e] transition-colors"><Icon size={24}/></Link>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <h4 className="font-black text-[#fefae0] uppercase tracking-[0.2em] text-xs">Resources</h4>
            <ul className="text-[10px] space-y-4 font-black uppercase tracking-widest">
              <li><Link className="hover:text-[#dda15e] transition-colors" href="/courses">Execution Tracks</Link></li>
              <li><Link className="hover:text-[#dda15e] transition-colors" href="/library">Academy Library</Link></li>
              <li><Link className="hover:text-[#dda15e] transition-colors" href="/questions">Intelligence Hub</Link></li>
              <li><Link className="hover:text-[#dda15e] transition-colors" href="/business-resources">Operational Tools</Link></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="font-black text-[#fefae0] uppercase tracking-[0.2em] text-xs">Support</h4>
            <ul className="text-[10px] space-y-4 font-black uppercase tracking-widest">
              <li><Link className="hover:text-[#dda15e] transition-colors" href="/contact">Help Center</Link></li>
              <li><Link className="hover:text-[#dda15e] transition-colors" href="/about">Methodology</Link></li>
              <li><Link className="hover:text-[#dda15e] transition-colors" href="/p/pay-your-price">Donations</Link></li>
              <li><Link className="hover:text-[#dda15e] transition-colors" href="#">System Status</Link></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="font-black text-[#fefae0] uppercase tracking-[0.2em] text-xs">Company</h4>
            <ul className="text-[10px] space-y-4 font-black uppercase tracking-widest">
              <li><Link className="hover:text-[#dda15e] transition-colors" href="/about">About Us</Link></li>
              <li><Link className="hover:text-[#dda15e] transition-colors" href="#">Ethics Code</Link></li>
              <li><Link className="hover:text-[#dda15e] transition-colors" href="#">Privacy Protocol</Link></li>
              <li><Link className="hover:text-[#dda15e] transition-colors" href="#">Careers</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-[#fefae0]/10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">© 2026 K Business Academy Governance. Systemic Results.</p>
        </div>
      </footer>
    </div>
  );
}
