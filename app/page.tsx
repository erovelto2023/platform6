import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, CheckCircle2, Layout, ShieldCheck,
  BookOpen, Box, Wrench, Search, Link as LinkIcon,
  Zap, Layers, Users, TrendingUp, PenTool, ShoppingCart, Image
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="px-6 lg:px-10 h-16 flex items-center border-b bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-900">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white">K</div>
          K Business Academy
        </div>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/courses">
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
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white to-indigo-50">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 mb-6">
              Build, Launch, and Scale <br className="hidden md:inline" />
              <span className="text-indigo-600">Online Businesses</span> — All in One Place
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-slate-600 mb-8 leading-relaxed">
              Stop guessing. Stop jumping between tools. <br />
              Start building real online businesses with clarity, confidence, and support.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 h-12">
                  Join K Business Academy
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="text-lg px-8 h-12">
                  Explore Platform
                </Button>
              </Link>
            </div>
            <p className="mt-8 text-sm text-slate-500 max-w-2xl mx-auto">
              K Business Academy is an all-in-one online community and training platform designed for entrepreneurs who want to start, grow, and scale profitable online businesses—without overwhelm, confusion, or wasted time.
            </p>
          </div>
        </section>

        {/* Who Is It For */}
        <section className="w-full py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-10">Who K Business Academy Is For</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  "Beginners who want clear step-by-step guidance",
                  "Entrepreneurs tired of piecing things together",
                  "Creators, affiliates, and digital business owners",
                  "Anyone who wants systems, not hype",
                  "Builders who want long-term, scalable income streams"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                    <span className="font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-center mt-8 text-lg font-medium text-indigo-900">
                If you want structure, direction, and execution, you’re in the right place.
              </p>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="w-full py-16 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">What You Get Inside K Business Academy</h2>
            <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">Everything you need to build and grow, under one roof.</p>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Courses */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Online Courses (Beginner to Advanced)</h3>
                <p className="text-slate-600 mb-6">Structured, easy-to-follow courses designed to grow with you—from newbie foundations to advanced strategies.</p>
                <ul className="space-y-3">
                  {[
                    "Getting started online (even from zero)",
                    "Niche selection and validation",
                    "Content creation & monetization",
                    "Affiliate marketing",
                    "Digital products and services",
                    "Scaling systems and automation"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Niche Boxes */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <Box className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Niche Business in a Box</h3>
                <p className="text-slate-600 mb-6">Turnkey Business Models You Can Actually Use. Skip the research phase and jump straight into execution.</p>
                <ul className="space-y-3">
                  {[
                    "In-depth niche breakdowns",
                    "Profitable business ideas & angles",
                    "Strategy videos explaining the niche",
                    "Step-by-step playbooks and roadmaps",
                    "Customer avatar & keyword research",
                    "Downloadable assets (guides, templates)"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition lg:col-span-2">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                  <Wrench className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Built-In Business Tools & Software</h3>
                <p className="text-slate-600 mb-8">Run your business smarter with custom tools built directly into the platform.</p>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2 font-semibold mb-2">
                      <ShoppingCart className="h-4 w-4 text-slate-600" /> Amazon Product Engine
                    </div>
                    <p className="text-sm text-slate-500">Search Amazon for products & generate affiliate-ready ideas.</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2 font-semibold mb-2">
                      <Image className="h-4 w-4 text-slate-600" /> Pinterest Pin Generator
                    </div>
                    <p className="text-sm text-slate-500">Create and manage pins to streamline content promotion.</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2 font-semibold mb-2">
                      <PenTool className="h-4 w-4 text-slate-600" /> Workbook Designer
                    </div>
                    <p className="text-sm text-slate-500">Design workbook pages, books, PDFs, and lead magnets.</p>
                  </div>
                </div>
                <p className="text-xs text-center text-slate-400 mt-4">✨ New tools are added regularly to keep the platform modern and powerful.</p>
              </div>

              {/* Knowledgebase & Resources */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                  <Search className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Searchable Knowledgebase</h3>
                <p className="text-slate-600">Access a growing knowledgebase of terms, definitions, and practical explanations. No more Googling basics—get clear answers fast.</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                  <LinkIcon className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Resources Library</h3>
                <p className="text-slate-600">A vast collection of business resources, learning materials, tools, and guides. Practical information you can apply immediately.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Different */}
        <section className="w-full py-16 bg-indigo-900 text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why K Business Academy Is Different</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
              {[
                { icon: Layers, text: "One platform instead of 10 subscriptions" },
                { icon: Zap, text: "Education + tools + execution" },
                { icon: Users, text: "Beginner-friendly, but scalable" },
                { icon: TrendingUp, text: "Continually updated content" },
                { icon: ShieldCheck, text: "Built for real businesses—not trends" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-white/10 rounded-full">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <p className="font-medium">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="text-center mt-12 text-xl font-light opacity-90">
              This isn’t just another course site. <br />
              <span className="font-bold">It’s a business-building ecosystem.</span>
            </p>
          </div>
        </section>

        {/* Imagine This */}
        <section className="w-full py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-8">Imagine This…</h2>
            <div className="grid gap-4 text-left md:grid-cols-2">
              {[
                "You know exactly what niche to pursue",
                "You have a clear roadmap instead of confusion",
                "You’re using tools designed for your business model",
                "You’re building assets that compound over time",
                "You’re part of a system that grows with you"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full shrink-0" />
                  <span className="text-lg text-slate-700">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xl font-bold text-indigo-900">That’s what K Business Academy is built to deliver.</p>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-16 bg-slate-50" id="pricing">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
            <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">
              Get full access to everything—courses, tools, niche boxes, and community.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Monthly Plan */}
              <div className="flex flex-col p-8 bg-white border rounded-2xl shadow-sm hover:shadow-md transition relative">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Monthly Access</h3>
                <p className="text-slate-500 mb-6">Perfect for getting started.</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">$97</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    "Access to all courses",
                    "Unlimited use of business tools",
                    "New Niche Boxes every month",
                    "Private community access",
                    "Cancel anytime"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up?plan=monthly" className="w-full">
                  <Button variant="outline" className="w-full h-12 text-lg border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                    Get Started Monthly
                  </Button>
                </Link>
              </div>

              {/* Yearly Plan */}
              <div className="flex flex-col p-8 bg-indigo-900 text-white border-indigo-900 rounded-2xl shadow-xl relative transform md:-translate-y-4">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  BEST VALUE
                </div>
                <h3 className="text-xl font-semibold mb-2">Yearly Access</h3>
                <p className="text-indigo-200 mb-6">Commit to your success & save.</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$997</span>
                  <span className="text-indigo-200">/year</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    "Access to all courses",
                    "Unlimited use of business tools",
                    "New Niche Boxes every month",
                    "Private community access",
                    "2 months free (save $167)",
                    "Priority support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-indigo-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up?plan=yearly" className="w-full">
                  <Button className="w-full h-12 text-lg bg-emerald-500 hover:bg-emerald-600 text-white border-none">
                    Get Started Yearly
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-20 bg-slate-50 border-t">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Start Building Today</h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-8">
              If you’re serious about running an online business—and you want clarity, structure, tools, and ongoing support—K Business Academy is your home base.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-xl px-10 h-14 shadow-lg shadow-indigo-200">
                  Join K Business Academy
                </Button>
              </Link>
              <p className="text-sm font-medium text-slate-500">Build smarter. Move faster. Grow with confidence.</p>
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
