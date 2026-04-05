"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Star, 
  Menu, 
  X,
  Zap,
  Search,
  PieChart,
  Calculator,
  Share2,
  Calendar,
  MessageSquare,
  Package,
  LifeBuoy,
  Wrench,
  Library,
  GraduationCap,
  ArrowRight,
  Globe,
  Award,
  Users,
  BarChart3
} from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      title: "Exclusive Library",
      desc: "Books and documents written by professionals to guide your online business journey.",
      icon: <Library className="text-blue-400" />,
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Marketing & Demographics",
      desc: "Search the entire country by state. Get detailed information on who is looking for your products.",
      icon: <PieChart className="text-purple-400" />,
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      title: "Accounting Platform",
      desc: "A complete QuickBooks Clone. Manage all of your customers, clients, and products in one place.",
      icon: <Calculator className="text-emerald-400" />,
      color: "from-emerald-500/20 to-teal-500/20"
    },
    {
      title: "Affiliate CRM",
      desc: "Access thousands of pre-vetted products to sell. No more searching for hours for the right niche.",
      icon: <Share2 className="text-orange-400" />,
      color: "from-orange-500/20 to-red-500/20"
    },
    {
      title: "Online Courses",
      desc: "Thousands of self-paced courses. Learn everything from AI to advanced Internet Marketing.",
      icon: <GraduationCap className="text-indigo-400" />,
      color: "from-indigo-500/20 to-blue-500/20"
    },
    {
      title: "Booking & Content Calendar",
      desc: "Manage client sessions and plan your social media content with our integrated scheduling system.",
      icon: <Calendar className="text-rose-400" />,
      color: "from-rose-500/20 to-orange-500/20"
    },
    {
      title: "Online Community",
      desc: "A private social network to communicate with members and build lasting industry relationships.",
      icon: <Users className="text-sky-400" />,
      color: "from-sky-500/20 to-indigo-500/20"
    },
    {
      title: "Messaging & Slack Clone",
      desc: "Live class interactions and instant messaging to get real-time answers during your journey.",
      icon: <MessageSquare className="text-violet-400" />,
      color: "from-violet-500/20 to-purple-500/20"
    },
    {
      title: "Business in a Box",
      desc: "Done-for-you starter kits and niche skeletons. Take these and start your product journey instantly.",
      icon: <Package className="text-amber-400" />,
      color: "from-amber-500/20 to-yellow-500/20"
    },
    {
      title: "Support Ticket System",
      desc: "Dedicated help desk to ensure you never get stuck. We are with you every step of the way.",
      icon: <LifeBuoy className="text-red-400" />,
      color: "from-red-500/20 to-rose-500/20"
    },
    {
      title: "Custom Tools & Apps",
      desc: "Proprietary versions of popular apps so you don't have to spend thousands on external subscriptions.",
      icon: <Wrench className="text-gray-400" />,
      color: "from-gray-500/20 to-slate-500/20"
    },
    {
      title: "And Much More...",
      desc: "K Business Academy is a living tool. You get instant access to everything we develop in the future.",
      icon: <Zap className="text-yellow-400" />,
      color: "from-yellow-500/20 to-orange-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-blue-500/30">
      {/* --- HEADER --- */}
      <nav className="fixed w-full z-[100] bg-[#0B0E23]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">Business Academy</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex space-x-8 text-slate-300 text-sm font-medium">
                <a href="#features" className="hover:text-white transition-colors">Features</a>
                <a href="#database" className="hover:text-white transition-colors">Keywords</a>
                <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              </div>
              <div className="flex items-center gap-4">
                <SignedOut>
                  <Link href="/sign-in">
                    <button className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link href="/sign-up">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/20">
                      Get Started
                    </button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/20">
                      Go to Dashboard
                    </button>
                  </Link>
                </SignedIn>
              </div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0B0E23] border-b border-white/10 p-4 space-y-4">
            <a href="#features" className="block text-slate-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#database" className="block text-slate-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Keywords</a>
            <a href="#pricing" className="block text-slate-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <SignedOut>
                <Link href="/sign-in" className="w-full">
                  <button className="w-full text-center py-3 text-slate-300 font-medium">Login</button>
                </Link>
                <Link href="/sign-up" className="w-full">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Get Started</button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="w-full">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Go to Dashboard</button>
                </Link>
              </SignedIn>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-[#0B0E23] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full"></div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Everything you need in one place
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight"
          >
            The Ultimate Business <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">
              Operating System
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-10 leading-relaxed"
          >
            Ditch the thousands in monthly subscriptions. Access 12+ proprietary tools, 
            9M+ keywords, and an elite community of online entrepreneurs.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <SignedOut>
              <Link href="/sign-up">
                <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-600/20">
                  Explore All Features <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-600/20">
                  Go to Dashboard <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </SignedIn>
            <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold border border-white/10 transition-all flex items-center justify-center gap-2">
              <Play size={18} fill="currentColor" /> See Platform Tour
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="rounded-2xl border border-white/10 bg-[#161B33]/50 p-2 md:p-4 backdrop-blur-sm shadow-2xl overflow-hidden">
              <div className="rounded-xl overflow-hidden bg-white/5 grid grid-cols-12 h-[300px] md:h-[500px]">
                <div className="hidden md:block col-span-2 border-r border-white/5 p-4 text-left">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-blue-500/20 rounded"></div>
                      <div className="h-2 w-2/3 bg-slate-700 rounded"></div>
                      <div className="h-2 w-3/4 bg-slate-700 rounded"></div>
                    </div>
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center gap-2 opacity-50"><Library size={12}/> <div className="h-1.5 w-12 bg-slate-700 rounded"></div></div>
                      <div className="flex items-center gap-2 text-blue-400"><Calculator size={12}/> <div className="h-1.5 w-16 bg-blue-500/50 rounded"></div></div>
                      <div className="flex items-center gap-2 opacity-50"><Calendar size={12}/> <div className="h-1.5 w-14 bg-slate-700 rounded"></div></div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-10 p-6 text-left">
                  <div className="flex justify-between items-center mb-8">
                    <div className="h-6 w-32 bg-white/10 rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded-full bg-white/10"></div>
                      <div className="h-8 w-8 rounded-full bg-blue-500"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="h-24 rounded-xl bg-white/5 border border-white/5 p-4">
                      <p className="text-[10px] text-slate-500 font-bold mb-2 uppercase">Keyword Database</p>
                      <div className="text-xl font-bold text-white">9.2M+</div>
                      <div className="h-1 w-full bg-slate-700 rounded mt-2 overflow-hidden">
                        <div className="h-full w-3/4 bg-blue-500"></div>
                      </div>
                    </div>
                    <div className="h-24 rounded-xl bg-white/5 border border-white/5 p-4">
                      <p className="text-[10px] text-slate-500 font-bold mb-2 uppercase">Revenue Ledger</p>
                      <div className="text-xl font-bold text-emerald-400">$12,450</div>
                      <div className="h-1 w-full bg-slate-700 rounded mt-2"></div>
                    </div>
                    <div className="h-24 rounded-xl bg-white/5 border border-white/5 p-4">
                      <p className="text-[10px] text-slate-500 font-bold mb-2 uppercase">CRM Leads</p>
                      <div className="text-xl font-bold text-purple-400">1,204</div>
                      <div className="h-1 w-full bg-slate-700 rounded mt-2"></div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 h-48 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 gap-2 p-4 opacity-20">
                      {Array.from({length: 32}).map((_, i) => <div key={i} className="bg-white/20 rounded"></div>)}
                    </div>
                    <div className="relative text-center">
                      <Search className="text-blue-400 w-10 h-10 mx-auto mb-2" />
                      <div className="text-sm font-bold text-blue-200 tracking-widest uppercase">Platform Ready</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- NICHE KEYWORD DATABASE SECTION --- */}
      <section id="database" className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
                <Search size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                9 Million+ Niche <br />
                Keyword Database
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                The ultimate keyword research resource. Explore hundreds of niches with granular data you won't find anywhere else.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Definitions & Target Audiences",
                  "Monetization Strategies",
                  "Video Explanations & Case Studies",
                  "Getting Started Checklists",
                  "Content & Blog Ideas",
                  "Pinterest & YouTube Roadmap"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CheckCircle2 size={18} className="text-blue-600 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
                Search the Database <ChevronRight size={18} />
              </button>
            </div>
            <div className="flex-1 relative">
              <div className="absolute -inset-4 bg-blue-100/50 rounded-[3rem] blur-3xl"></div>
              <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black uppercase tracking-tight">Trending Niche</div>
                    <div className="px-3 py-1 bg-slate-50 text-slate-400 rounded-md text-[10px] font-black uppercase tracking-tight">SEO Score: 98</div>
                  </div>
                  <BarChart3 size={20} className="text-slate-300" />
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">Keyword Analysis</h4>
                    <p className="font-bold text-slate-800">"AI-Driven Sustainable Fashion"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-600 rounded-xl text-white">
                      <p className="text-[10px] font-bold opacity-70 uppercase mb-1">Monthly Search</p>
                      <p className="text-xl font-black">450,000</p>
                    </div>
                    <div className="p-4 bg-indigo-600 rounded-xl text-white">
                      <p className="text-[10px] font-bold opacity-70 uppercase mb-1">Competition</p>
                      <p className="text-xl font-black">Low</p>
                    </div>
                  </div>
                  <div className="p-4 border border-dashed border-slate-200 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Target Audience</p>
                    <p className="text-sm text-slate-600 italic">"Eco-conscious Gen-Z founders looking for scalable tech solutions..."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ALL FEATURES GRID --- */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">The All-In-One Ecosystem</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Stop stitching together dozens of tools. We've built everything you need to run, track, and scale your online business from a single login.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative p-8 bg-white rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 rounded-[2rem] transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-white transition-all duration-500">
                    {React.cloneElement(f.icon as React.ReactElement<any>, { size: 28 })}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{f.desc}</p>
                  <div className="flex items-center text-xs font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    Explore Tool <ChevronRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DASHBOARD DETAIL SECTION (ACCOUNTING/CRM) --- */}
      <section className="py-24 bg-[#0B0E23]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 order-2 md:order-1 relative">
            <div className="absolute -inset-10 bg-purple-600/10 blur-[100px] rounded-full"></div>
            <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-white font-bold tracking-tight">K-Accounting Suite</h4>
                <div className="h-6 w-24 bg-white/10 rounded-full"></div>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Active Customers", val: "2,405", p: "+12%" },
                  { label: "Quarterly Revenue", val: "$142,000", p: "+8%" },
                  { label: "Affiliate Payouts", val: "$34,200", p: "-2%" }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-slate-400 text-sm font-medium">{stat.label}</span>
                    <div className="text-right">
                      <div className="text-white font-bold">{stat.val}</div>
                      <div className={`text-[10px] font-bold ${stat.p.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{stat.p}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-white/5 flex gap-2">
                <SignedOut>
                  <Link href="/sign-up" className="flex-1">
                    <button className="w-full bg-blue-600 py-3 rounded-xl text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors">Start Scaling Today</button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard" className="flex-1">
                    <button className="w-full bg-blue-600 py-3 rounded-xl text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors">Go to Dashboard</button>
                  </Link>
                </SignedIn>
                <button className="px-4 py-3 bg-white/5 rounded-xl text-white hover:bg-white/10 transition-all"><Share2 size={18}/></button>
              </div>
            </div>
          </div>
          <div className="flex-1 order-1 md:order-2 space-y-6">
            <div className="inline-block px-4 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-500/20 mb-2">
              Financial Control
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Accounting & CRM <br /> Built Into the Core
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Don't waste time switching between QuickBooks, HubSpot, and Excel. Manage your entire customer lifecycle, billing, and affiliate network from one unified dashboard.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                  <Calculator size={20} className="text-blue-400" />
                </div>
                <div>
                  <h5 className="text-white font-bold">QuickBooks Clone</h5>
                  <p className="text-slate-500 text-sm">Full double-entry bookkeeping without the high monthly cost.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                  <Share2 size={20} className="text-purple-400" />
                </div>
                <div>
                  <h5 className="text-white font-bold">Affiliate Engine</h5>
                  <p className="text-slate-500 text-sm">Access thousands of pre-negotiated products to start selling today.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">One Price. All Features.</h2>
            <p className="text-slate-500">No hidden costs. No upsells. Just everything you need to win.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl transition-all h-full flex flex-col">
              <h3 className="text-xl font-bold mb-2 text-slate-900">Foundations</h3>
              <p className="text-slate-500 text-sm mb-8">Access to library and core courses.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 text-sm font-medium flex-1">
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-600" /> Online Courses</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-600" /> Glossary</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-600" /> Marketing & Demographics</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-600" /> Messaging & Slack Clone</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-600" /> Support Ticket System</li>
              </ul>
              <SignedOut>
                <Link href="/sign-up">
                  <button className="w-full py-4 rounded-xl border border-slate-200 font-bold hover:bg-slate-900 hover:text-white transition-all">Get Started</button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="w-full py-4 rounded-xl border border-slate-200 font-bold hover:bg-slate-900 hover:text-white transition-all">Go to Dashboard</button>
                </Link>
              </SignedIn>
            </div>

            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl z-10 text-white h-full flex flex-col hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -top-4 right-8 bg-yellow-400 text-slate-900 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider">Full Access</div>
              <h3 className="text-xl font-bold mb-2 text-white">Mastery Elite</h3>
              <p className="text-blue-100/70 text-sm mb-8">The entire business ecosystem.</p>
              <div className="mb-8 text-white">
                <span className="text-4xl font-bold">$97</span>
                <span className="opacity-70">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 text-sm font-medium flex-1">
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-white" /> Online Courses</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-white" /> 9M+ Keyword Database</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-white" /> Marketing & Demographics</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-white" /> Messaging & Slack Clone</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-white" /> Support Ticket System</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-white" /> Accounting & Affiliate CRM</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-white" /> Booking & Content Calendar</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-white" /> Community & Messaging</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-white" /> Custom Tools and Apps</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-white" /> Businesses in a Box</li>
              </ul>
              <SignedOut>
                <Link href="/sign-up">
                  <button className="w-full py-4 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all shadow-lg active:scale-95">Get Started Now</button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="w-full py-4 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all shadow-lg active:scale-95">Go to Dashboard</button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-16">Raving Academy Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              { name: "James Wilson", role: "Niche Creator", quote: "The Keyword Database saved me hundreds of hours. I found my next 6 months of content in one afternoon." },
              { name: "Sarah Patel", role: "Agency Owner", quote: "Replacing Slack and QuickBooks with K Business Academy tools paid for the membership 10x over." },
              { name: "Tom Baker", role: "Solo-Founder", quote: "The Business in a Box starter kits are incredible. I had my store skeleton ready in 2 hours." },
              { name: "Linda Wu", role: "Affiliate Marketer", quote: "Finally, a CRM that actually gives me products to sell instead of just tracking leads." },
            ].map((t, idx) => (
              <div key={idx} className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-full hover:-translate-y-1 transition-transform duration-300">
                <div>
                  <div className="flex gap-1 mb-4 text-yellow-400">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 italic font-medium leading-relaxed">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-xs">
                    {t.name[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-800">{t.name}</h5>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="relative rounded-[3rem] overflow-hidden bg-[#0B0E23] p-12 md:p-24 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Build Your Brilliance Now</h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto font-medium">
                Join the living, breathing community at K Business Academy. Your membership includes every tool we build in the future.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                />
                <button className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                  Send
                </button>
              </div>
              <p className="mt-6 text-xs text-slate-500 font-black uppercase tracking-[0.25em]">Join the Elite Membership today</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 text-slate-500 pt-20 pb-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <span className="text-slate-900 font-bold text-xl tracking-tight">Business Academy</span>
              </div>
              <p className="max-w-xs mb-8 text-sm leading-relaxed font-medium">
                The most complete infrastructure for digital entrepreneurs. From education to operations, we have you covered.
              </p>
              <div className="flex gap-4">
                {[Globe, Users, Award].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h6 className="text-slate-900 font-extrabold mb-6 uppercase text-xs tracking-widest">Features</h6>
              <ul className="space-y-4 text-sm font-bold secondary-text">
                <li className="hover:text-blue-600 cursor-pointer transition-colors">9M+ Keywords</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Accounting Clone</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Affiliate CRM</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Messaging Center</li>
              </ul>
            </div>
            <div>
              <h6 className="text-slate-900 font-extrabold mb-6 uppercase text-xs tracking-widest">Resources</h6>
              <ul className="space-y-4 text-sm font-bold secondary-text">
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Book Library</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Online Courses</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Business in a Box</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Market Reports</li>
              </ul>
            </div>
            <div>
              <h6 className="text-slate-900 font-extrabold mb-6 uppercase text-xs tracking-widest">Company</h6>
              <ul className="space-y-4 text-sm font-bold secondary-text">
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Success Stories</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Support Center</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Privacy</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Terms</li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-10 border-t border-slate-200 text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">
            Copyright © 2026 K Business Academy. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
