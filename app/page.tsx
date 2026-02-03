"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SimpleHeroSlideshow } from "@/components/animations";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, BookOpen, Box, Wrench, Search,
  Link as LinkIcon, Zap, Layers, Users, TrendingUp, PenTool,
  ShoppingCart, Image, Sparkles, Rocket, Target, Award, Shield,
  Check, X, Youtube, Facebook
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LandingPage() {
  // Hero slides configuration based on new copy
  const heroSlides = [
    {
      title: 'Simple. Scalable. Sustainable.',
      subtitle: 'Build once. Profit repeatedly. No burnout required.',
      backgroundImage: '/heroimages/eab09a8e-8f04-4422-9e63-e49b80dce334.png',
      ctaText: 'Start Building',
      ctaLink: '/sign-up',
    },
    {
      title: 'Beginner. Builder. Boss.',
      subtitle: 'Your journey starts with structure—not overwhelm.',
      backgroundImage: '/heroimages/8a24f949-58d0-4d2e-a22f-d28a58e111f0.png',
      ctaText: 'Start Now',
      ctaLink: '/sign-up',
    },
    {
      title: 'Research. Roadmap. Results.',
      subtitle: 'Skip the 200-hour niche deep dive. We hand you validated models ready to execute.',
      backgroundImage: '/heroimages/962464e7-62e7-4974-866e-52b2e00976f7.png',
      ctaText: 'View Niche Boxes',
      ctaLink: '/niche-boxes',
    },
    {
      title: 'Action. Analytics. Advancement.',
      subtitle: 'Stop guessing what works. Start building what converts.',
      backgroundImage: '/heroimages/a400fc81-bf6f-4c22-be56-c83b91b26693.png',
      ctaText: 'Join Today',
      ctaLink: '/sign-up',
    },
    {
      title: 'Structure. Software. Success.',
      subtitle: 'Courses without tools are theory. Tools without training are noise. We deliver both.',
      backgroundImage: '/heroimages/b5c8e145-1407-4ae8-b41a-b2d30d4fafc1.png',
      ctaText: 'Get Access',
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

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 font-sans">
      {/* Navbar - Dark Theme */}
      <header className="px-6 lg:px-10 h-16 flex items-center border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-white">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-500/50">
            K
          </div>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            K Business Academy
          </span>
        </div>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6 hidden md:flex">
          <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/courses">
            Courses
          </Link>
          <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/niche-boxes">
            Niche Boxes
          </Link>
          <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/blog">
            Blog
          </Link>

          <div className="flex items-center gap-3 border-l border-slate-700 pl-6 h-6 mx-2">
            <Link href="https://www.facebook.com/erovelto" target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4 text-slate-400 hover:text-blue-500 transition-colors" />
            </Link>
            <Link href="https://www.tiktok.com/@kbusinessacademy" target="_blank" rel="noopener noreferrer">
              <svg className="h-4 w-4 text-slate-400 hover:text-pink-500 transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </Link>
            <Link href="https://www.youtube.com/@KBusinessAcademy" target="_blank" rel="noopener noreferrer">
              <Youtube className="h-4 w-4 text-slate-400 hover:text-red-500 transition-colors" />
            </Link>
          </div>

          <Link href="/sign-in">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
              Log In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30">
              Get Started
            </Button>
          </Link>
        </nav>
        {/* Mobile Menu Button placeholder if needed */}
        <div className="ml-auto md:hidden">
          <Link href="/sign-up">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Animated Hero Section */}
        <SimpleHeroSlideshow slides={heroSlides} autoplay={true} interval={6000} />

        {/* Who This Is For */}
        <section className="w-full py-20 bg-slate-900 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 opacity-50" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl opacity-30" />

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Who This Is For
              </h2>
              <p className="text-center text-slate-400 mb-12 text-lg">
                Built for ambitious entrepreneurs ready to take action
              </p>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid sm:grid-cols-2 gap-4"
              >
                {[
                  { icon: Rocket, text: "Beginners who want clear step-by-step guidance" },
                  { icon: Target, text: "Entrepreneurs tired of piecing things together" },
                  { icon: Sparkles, text: "Creators, affiliates, and digital business owners" },
                  { icon: Shield, text: "Anyone who wants systems, not hype" },
                  { icon: Award, text: "Builders who want long-term, scalable income streams" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    transition={{ duration: 0.5 }}
                    className="flex items-start gap-4 p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm group"
                  >
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all shrink-0">
                      <item.icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <span className="font-medium text-slate-200">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-center mt-12 text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                If you want structure, direction, and execution, you're in the right place.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* What You Get Inside */}
        <section className="w-full py-24 bg-slate-950">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                What You Get Inside
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Everything you need to build and grow, under one roof.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-8 lg:grid-cols-2"
            >
              {/* Courses */}
              <motion.div
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BookOpen className="w-32 h-32 text-blue-500" />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/30 transition-colors">
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Online Courses</h3>
                  <p className="text-slate-400 mb-6">Structured, easy-to-follow courses designed to grow with you—from newbie foundations to advanced strategies.</p>
                  <ul className="space-y-3">
                    {[
                      "Getting started online (even from zero)",
                      "Niche selection and validation",
                      "Content creation & monetization",
                      "Affiliate marketing",
                      "Digital products and services",
                      "Scaling systems and automation"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Niche Boxes */}
              <motion.div
                variants={scaleIn}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Box className="w-32 h-32 text-purple-500" />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400 group-hover:text-purple-300 group-hover:bg-purple-500/30 transition-colors">
                    <Box className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Niche Business in a Box</h3>
                  <p className="text-slate-400 mb-6">Turnkey Business Models You Can Actually Use. Skip the research phase and jump straight into execution.</p>
                  <ul className="space-y-3">
                    {[
                      "In-depth niche breakdowns",
                      "Profitable business ideas & angles",
                      "Strategy videos explaining the niche",
                      "Step-by-step playbooks and roadmaps",
                      "Customer avatar & keyword research",
                      "Downloadable assets (guides, templates)"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Tools */}
              <motion.div
                variants={scaleIn}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition-all hover:shadow-2xl hover:shadow-orange-500/10 lg:col-span-2 group"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="shrink-0">
                    <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 text-orange-400">
                      <Wrench className="h-7 w-7" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4 text-white">Built-In Business Tools & Software</h3>
                    <p className="text-slate-400 mb-8">Run your business smarter with custom tools built directly into the platform.</p>

                    <div className="grid md:grid-cols-3 gap-6">
                      {[
                        { icon: ShoppingCart, title: "Amazon Product Engine", desc: "Search Amazon for products & generate affiliate-ready ideas." },
                        { icon: Image, title: "Pinterest Pin Generator", desc: "Create and manage pins to streamline content promotion." },
                        { icon: PenTool, title: "Workbook Designer", desc: "Design workbook pages, books, PDFs, and lead magnets." }
                      ].map((tool, i) => (
                        <div key={i} className="p-5 border border-slate-700/50 rounded-xl bg-slate-950/50 hover:bg-slate-900 transition-all hover:border-orange-500/30">
                          <div className="flex items-center gap-3 font-semibold mb-3 text-white">
                            <tool.icon className="h-5 w-5 text-orange-400" />
                            {tool.title}
                          </div>
                          <p className="text-sm text-slate-400">{tool.desc}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-center text-slate-500 mt-6">✨ New tools are added regularly to keep the platform modern and powerful.</p>
                  </div>
                </div>
              </motion.div>

              {/* Knowledgebase & Resources Split */}
              <motion.div
                variants={scaleIn}
                className="grid md:grid-cols-2 gap-8 lg:col-span-2"
              >
                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-teal-500/30 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Searchable Knowledgebase</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Access a growing knowledgebase of terms, definitions, and practical explanations. No more Googling basics—get clear answers fast.
                  </p>
                </div>
                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-pink-500/30 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
                      <LinkIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Resources Library</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    A vast collection of business resources, learning materials, tools, and guides. Practical information you can apply immediately.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* The Truth About Building Online */}
        <section className="w-full py-24 bg-slate-900 relative overflow-hidden">
          {/* Abstract Background */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-5xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
                <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">The Truth About Building Online</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                {[
                  { title: "Clarity cuts chaos.", subtitle: "One platform. One plan. Zero confusion." },
                  { title: "Tools don't build businesses.", subtitle: "Builders do. We just give you sharper tools." },
                  { title: "Stop renting attention.", subtitle: "Start owning assets. Courses, tools, and systems that compound while algorithms change." },
                  { title: "No gurus. No get-rich-quick.", subtitle: "Just get-to-work. Real businesses are built quietly, consistently, and systematically." },
                  { title: "Your first sale isn't luck.", subtitle: "It's leverage. Leverage our playbooks. Then build your own." },
                  { title: "Content without conversion is a hobby.", subtitle: "We teach you to build businesses—not audiences." },
                  { title: "The algorithm changes weekly.", subtitle: "Your business shouldn't. Build on platforms you own—not ones that own you." },
                  { title: "Stop collecting courses.", subtitle: "Start completing systems. One platform. One path. Real results." },
                  { title: "Ideas are cheap. Execution is currency.", subtitle: "We give you both—and the tools to deploy them fast." },
                  { title: "Your competition isn't other creators.", subtitle: "It's your own inconsistency. We fix that with structure." },
                  { title: "Traffic without monetization is entertainment.", subtitle: "We teach you to build revenue engines—not just content mills." },
                  { title: "Stop chasing trends. Start building foundations.", subtitle: "Trends fade. Assets appreciate." }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="group"
                  >
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 border-l-2 border-slate-700 pl-4 group-hover:border-purple-500 transition-colors">
                      {item.subtitle}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                variants={fadeInUp}
                className="mt-20 text-center space-y-4"
              >
                <p className="text-2xl md:text-3xl font-light text-white/90">
                  Confidence isn't faked. <br />
                  <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    It's earned through execution.
                  </span>
                </p>
                <p className="text-lg text-slate-400 font-medium tracking-wide uppercase mt-4">
                  Start small. Ship fast. Scale faster.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Why We Are Different (Comparison) */}
        <section className="w-full py-24 bg-slate-950 border-t border-slate-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why We Are Different</h2>
              <p className="text-slate-400">Stop playing the "Guru" game. Start building real assets.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-2 text-center border-b border-slate-800">
                <div className="p-6 bg-slate-900/50">
                  <h3 className="font-bold text-slate-400 uppercase tracking-wider text-sm">The "Guru" Way</h3>
                </div>
                <div className="p-6 bg-gradient-to-b from-purple-900/20 to-slate-900/50 border-l border-slate-800">
                  <h3 className="font-bold text-purple-400 uppercase tracking-wider text-sm">The K Business Academy Way</h3>
                </div>
              </div>

              {[
                { guru: "High-ticket courses ($2k–$10k)", kba: "Affordable, transparent monthly/yearly access" },
                { guru: "Rented attention (Social Media focus)", kba: "Owned assets (Systems you control)" },
                { guru: "\"Get-rich-quick\" hype", kba: "\"Get-to-work\" systematic building" },
                { guru: "Fragmented tools and subscriptions", kba: "One platform for education + tools + execution" },
                { guru: "Outdated theories", kba: "Continually updated strategies" }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-2 border-b border-slate-800 last:border-0 group hover:bg-slate-800/20 transition-colors">
                  <div className="p-6 md:p-8 flex items-center justify-center md:justify-start gap-4 text-slate-400">
                    <X className="w-5 h-5 text-red-500/50 shrink-0 hidden md:block" />
                    <span className="text-sm md:text-base">{row.guru}</span>
                  </div>
                  <div className="p-6 md:p-8 flex items-center justify-center md:justify-start gap-4 text-white bg-purple-500/5 border-l border-slate-800 font-medium">
                    <Check className="w-5 h-5 text-purple-400 shrink-0 hidden md:block" />
                    <span className="text-sm md:text-base">{row.kba}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-xl text-white">
                This isn't just another course site. <span className="text-purple-400 font-bold">It's a business-building ecosystem.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-24 bg-slate-900" id="pricing">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-slate-400 text-lg">
                Get full access to everything—courses, tools, niche boxes, and community.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
              {/* Monthly Plan */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col p-8 bg-slate-950 border border-slate-800 rounded-2xl hover:border-purple-500/30 transition-all"
              >
                <h3 className="text-2xl font-semibold text-white mb-2">Monthly Access</h3>
                <p className="text-slate-400 mb-6">Perfect for getting started.</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">$97</span>
                  <span className="text-slate-500 text-lg"> / month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {[
                    "Access to all courses",
                    "Unlimited use of business tools",
                    "New Niche Boxes every month",
                    "Private community access",
                    "Cancel anytime"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-slate-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up?plan=monthly" className="w-full">
                  <Button variant="outline" className="w-full h-12 text-lg border-slate-700 hover:bg-slate-800 hover:text-white text-white">
                    Get Started Monthly
                  </Button>
                </Link>
              </motion.div>

              {/* Yearly Plan */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col p-10 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl shadow-2xl shadow-purple-900/30 relative transform md:scale-105 border border-purple-500/20"
              >
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-2xl">
                  BEST VALUE
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Yearly Access</h3>
                <p className="text-purple-200 mb-6">Commit to your success & save.</p>
                <div className="mb-6">
                  <span className="text-6xl font-bold text-white">$997</span>
                  <span className="text-purple-200 text-lg"> / year</span>
                </div>
                <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-sm text-emerald-300 font-medium mb-8">
                  Includes 2 Months Free (Save $167)
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {[
                    "Everything in Monthly",
                    "Access to all courses",
                    "Unlimited use of business tools",
                    "New Niche Boxes every month",
                    "Private community access",
                    "Priority support",
                    "Commitment to long-term success"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up?plan=yearly" className="w-full">
                  <Button className="w-full h-14 text-lg bg-white text-purple-900 hover:bg-slate-100 font-bold shadow-xl">
                    Get Started Yearly
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-24 bg-slate-950">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-400">Got questions? We've got answers.</p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                { q: "Is this just another course?", a: "No. It’s a business-building ecosystem. We provide the tools and the blueprints (Niche Boxes) alongside the education." },
                { q: "Do I really get all courses for free?", a: "Yes. As long as you are a member, you never pay for a new training module again." },
                { q: "I’m a total beginner. Can I join?", a: "Absolutely. We specialize in taking you from \"understanding nothing\" to making your first sale using leverage, not luck." },
                { q: "What if the algorithm changes?", a: "That’s why we teach you to build foundations. Trends fade; assets appreciate. We focus on platforms you own." }
              ].map((item, i) => (
                <AccordionItem value={`item-${i}`} key={i} className="border border-slate-800 rounded-lg px-6 bg-slate-900">
                  <AccordionTrigger className="text-white hover:text-purple-400 text-left text-lg py-6">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-6 text-base leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-32 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight">
                Start Building Today
              </h2>
              <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed font-light">
                If you're serious about running an online business—and you want clarity, structure, tools, and ongoing support—K Business Academy is your home base.
              </p>
              <div className="flex flex-col items-center gap-8">
                <Link href="/sign-up">
                  <Button size="lg" className="bg-white text-purple-900 hover:bg-slate-100 text-xl px-16 h-16 rounded-full shadow-2xl shadow-white/10 font-bold transition-transform hover:scale-105">
                    Join K Business Academy
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
                <p className="text-base font-medium text-slate-400 tracking-wider uppercase">
                  Build smarter. Move faster. Grow with confidence.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-4 sm:flex-row py-10 w-full shrink-0 items-center px-4 md:px-6 border-t border-slate-800 bg-slate-950">
        <p className="text-sm text-slate-500">© 2025 K Business Academy. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-6 items-center">
          <Link
            href="https://www.facebook.com/erovelto"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2"
          >
            <Facebook className="h-5 w-5" />
            <span className="hidden sm:inline text-xs font-medium">Facebook</span>
          </Link>
          <Link
            href="https://www.tiktok.com/@kbusinessacademy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-pink-500 transition-colors flex items-center gap-2"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
            <span className="hidden sm:inline text-xs font-medium">TikTok</span>
          </Link>
          <Link
            href="https://www.youtube.com/@KBusinessAcademy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-red-500 transition-colors flex items-center gap-2"
          >
            <Youtube className="h-5 w-5" />
            <span className="hidden sm:inline text-xs font-medium">YouTube</span>
          </Link>
          <Link className="text-sm text-slate-500 hover:text-white transition-colors" href="#">
            Terms of Service
          </Link>
          <Link className="text-sm text-slate-500 hover:text-white transition-colors" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
