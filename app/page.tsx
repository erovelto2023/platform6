'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SimpleHeroSlideshow } from "@/components/animations";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, BookOpen, Box, Wrench, Search,
  Link as LinkIcon, Zap, Layers, Users, TrendingUp, PenTool,
  ShoppingCart, Image, Sparkles, Rocket, Target, Award, Shield
} from "lucide-react";

export default function LandingPage() {
  // Hero slides configuration with real images and powerful messaging
  const heroSlides = [
    {
      title: 'Clarity. Confidence. Creation.',
      subtitle: 'Stop consuming content. Start building assets that pay you while you sleep.',
      backgroundImage: '/heroimages/3eeba56d-f561-4cde-bf77-80373ff8a65d.png',
      ctaText: 'Start Building',
      ctaLink: '/sign-up',
    },
    {
      title: 'Strategy. Systems. Scale.',
      subtitle: 'No more shiny objects. Just one platform where learning becomes revenue.',
      backgroundImage: '/heroimages/48f75e7d-3cf0-41e1-a88d-9e0d0d0464dc.png',
      ctaText: 'Explore Platform',
      ctaLink: '/courses',
    },
    {
      title: 'Foundation. Framework. Freedom.',
      subtitle: 'From zero to profitable—not by chance, but by design.',
      backgroundImage: '/heroimages/5aadcd74-4927-46f2-b6b7-df3606468ca4.png',
      ctaText: 'Get Started',
      ctaLink: '/sign-up',
    },
    {
      title: 'Plan. Produce. Profit.',
      subtitle: 'Your business shouldn\'t run on hope. It should run on systems.',
      backgroundImage: '/heroimages/5e214005-ec9c-46ba-aed1-06f6513e19d3.png',
      ctaText: 'Learn How',
      ctaLink: '/courses',
    },
    {
      title: 'Tools. Training. Traction.',
      subtitle: 'Everything under one roof—so you can focus on what actually moves the needle.',
      backgroundImage: '/heroimages/7f5992c2-df29-4544-bee3-8dd1993ec09d.png',
      ctaText: 'See Tools',
      ctaLink: '/courses',
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
    },
    {
      title: 'Simple. Scalable. Sustainable.',
      subtitle: 'Build once. Profit repeatedly. No burnout required.',
      backgroundImage: '/heroimages/eab09a8e-8f04-4422-9e63-e49b80dce334.png',
      ctaText: 'Start Building',
      ctaLink: '/sign-up',
    },
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
    <div className="flex flex-col min-h-screen bg-slate-950">
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
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/courses">
            Courses
          </Link>
          <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/niche-boxes">
            Niche Boxes
          </Link>
          <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/blog">
            Blog
          </Link>
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
      </header>

      <main className="flex-1">
        {/* Animated Hero Section */}
        <SimpleHeroSlideshow slides={heroSlides} autoplay={true} interval={6000} />

        {/* Who Is It For - Dark Theme with Animations */}
        <section className="w-full py-20 bg-slate-900 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 opacity-50" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
                      <item.icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <span className="font-medium text-slate-200 flex-1">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-center mt-10 text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                If you want structure, direction, and execution, you're in the right place.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* What You Get - Dark Theme */}
        <section className="w-full py-20 bg-slate-950">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
                What You Get Inside
              </h2>
              <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto text-lg">
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
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/20 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-7 w-7 text-white" />
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
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Niche Boxes */}
              <motion.div
                variants={scaleIn}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/20 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
                  <Box className="h-7 w-7 text-white" />
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
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Tools */}
              <motion.div
                variants={scaleIn}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition-all hover:shadow-2xl hover:shadow-orange-500/20 lg:col-span-2 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/50 group-hover:scale-110 transition-transform">
                  <Wrench className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Built-In Business Tools & Software</h3>
                <p className="text-slate-400 mb-8">Run your business smarter with custom tools built directly into the platform.</p>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: ShoppingCart, title: "Amazon Product Engine", desc: "Search Amazon for products & generate affiliate-ready ideas." },
                    { icon: Image, title: "Pinterest Pin Generator", desc: "Create and manage pins to streamline content promotion." },
                    { icon: PenTool, title: "Workbook Designer", desc: "Design workbook pages, books, PDFs, and lead magnets." }
                  ].map((tool, i) => (
                    <div key={i} className="p-5 border border-slate-700 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 transition-all hover:border-orange-500/30">
                      <div className="flex items-center gap-3 font-semibold mb-3 text-white">
                        <tool.icon className="h-5 w-5 text-orange-400" />
                        {tool.title}
                      </div>
                      <p className="text-sm text-slate-400">{tool.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-center text-slate-500 mt-6">✨ New tools are added regularly to keep the platform modern and powerful.</p>
              </motion.div>

              {/* Knowledgebase */}
              <motion.div
                variants={scaleIn}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-teal-500/50 transition-all hover:shadow-2xl hover:shadow-teal-500/20 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/50 group-hover:scale-110 transition-transform">
                  <Search className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Searchable Knowledgebase</h3>
                <p className="text-slate-400">Access a growing knowledgebase of terms, definitions, and practical explanations. No more Googling basics—get clear answers fast.</p>
              </motion.div>

              {/* Resources */}
              <motion.div
                variants={scaleIn}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-pink-500/50 transition-all hover:shadow-2xl hover:shadow-pink-500/20 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/50 group-hover:scale-110 transition-transform">
                  <LinkIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Resources Library</h3>
                <p className="text-slate-400">A vast collection of business resources, learning materials, tools, and guides. Practical information you can apply immediately.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Manifesto Section - Powerful One-Liners */}
        <section className="w-full py-24 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-5xl mx-auto"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                The Truth About Building Online
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    title: "Clarity cuts chaos.",
                    subtitle: "One platform. One plan. Zero confusion."
                  },
                  {
                    title: "Tools don't build businesses.",
                    subtitle: "Builders do. We just give you sharper tools."
                  },
                  {
                    title: "Stop renting attention.",
                    subtitle: "Start owning assets. Courses, tools, and systems that compound while algorithms change."
                  },
                  {
                    title: "No gurus. No get-rich-quick.",
                    subtitle: "Just get-to-work. Real businesses are built quietly, consistently, and systematically."
                  },
                  {
                    title: "Your first sale isn't luck.",
                    subtitle: "It's leverage. Leverage our playbooks. Then build your own."
                  },
                  {
                    title: "Content without conversion is a hobby.",
                    subtitle: "We teach you to build businesses—not audiences."
                  },
                  {
                    title: "The algorithm changes weekly.",
                    subtitle: "Your business shouldn't. Build on platforms you own—not ones that own you."
                  },
                  {
                    title: "Stop collecting courses.",
                    subtitle: "Start completing systems. One platform. One path. Real results."
                  },
                  {
                    title: "Ideas are cheap. Execution is currency.",
                    subtitle: "We give you both—and the tools to deploy them fast."
                  },
                  {
                    title: "Your competition isn't other creators.",
                    subtitle: "It's your own inconsistency. We fix that with structure."
                  },
                  {
                    title: "Traffic without monetization is entertainment.",
                    subtitle: "We teach you to build revenue engines—not just content mills."
                  },
                  {
                    title: "Stop chasing trends. Start building foundations.",
                    subtitle: "Trends fade. Assets appreciate."
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-all group"
                  >
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                variants={fadeInUp}
                className="mt-16 text-center"
              >
                <p className="text-2xl font-light text-white/90 mb-8">
                  Confidence isn't faked. <br />
                  <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    It's earned through execution.
                  </span>
                </p>
                <p className="text-lg text-slate-400">
                  Start small. Ship fast. Scale faster.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Why Different - Gradient Section */}
        <section className="w-full py-20 bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
            >
              Why We're Different
            </motion.h2>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center"
            >
              {[
                { icon: Layers, text: "One platform instead of 10 subscriptions" },
                { icon: Zap, text: "Education + tools + execution" },
                { icon: Users, text: "Beginner-friendly, but scalable" },
                { icon: TrendingUp, text: "Continually updated content" },
                { icon: Shield, text: "Built for real businesses—not trends" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className="p-5 bg-white/10 backdrop-blur-sm rounded-2xl group-hover:bg-white/20 transition-all group-hover:scale-110">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-medium text-white/90">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center mt-16 text-2xl font-light text-white/90"
            >
              This isn't just another course site. <br />
              <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                It's a business-building ecosystem.
              </span>
            </motion.p>
          </div>
        </section>

        {/* Pricing Section - Dark Theme */}
        <section className="w-full py-20 bg-slate-950" id="pricing">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
                Simple, Transparent Pricing
              </h2>
              <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto text-lg">
                Get full access to everything—courses, tools, niche boxes, and community.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Monthly Plan */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col p-8 bg-slate-900 border border-slate-700 rounded-2xl hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/20 relative"
              >
                <h3 className="text-2xl font-semibold text-white mb-2">Monthly Access</h3>
                <p className="text-slate-400 mb-6">Perfect for getting started.</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">$97</span>
                  <span className="text-slate-400">/month</span>
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
                      <CheckCircle2 className="h-5 w-5 text-purple-400 shrink-0" />
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
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col p-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl shadow-purple-500/50 relative transform md:-translate-y-4"
              >
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-xl">
                  BEST VALUE
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Yearly Access</h3>
                <p className="text-purple-100 mb-6">Commit to your success & save.</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">$997</span>
                  <span className="text-purple-100">/year</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {[
                    "Access to all courses",
                    "Unlimited use of business tools",
                    "New Niche Boxes every month",
                    "Private community access",
                    "2 months free (save $167)",
                    "Priority support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white">
                      <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up?plan=yearly" className="w-full">
                  <Button className="w-full h-12 text-lg bg-white text-purple-600 hover:bg-slate-100 font-semibold shadow-xl">
                    Get Started Yearly
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA - Gradient */}
        <section className="w-full py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl" />

          <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Start Building Today
              </h2>
              <p className="max-w-2xl mx-auto text-xl text-slate-300 mb-10 leading-relaxed">
                If you're serious about running an online business—and you want clarity, structure, tools, and ongoing support—K Business Academy is your home base.
              </p>
              <div className="flex flex-col items-center gap-6">
                <Link href="/sign-up">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xl px-12 h-16 shadow-2xl shadow-purple-500/50 group">
                    Join K Business Academy
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <p className="text-sm font-medium text-slate-400">
                  Build smarter. Move faster. Grow with confidence.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer - Dark Theme */}
      <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-slate-800 bg-slate-950">
        <p className="text-xs text-slate-500">© 2025 K Business Academy. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs text-slate-500 hover:text-slate-300 transition-colors" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs text-slate-500 hover:text-slate-300 transition-colors" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
