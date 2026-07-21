"use client";

import React, { useState } from "react";
import {
  Zap, Mail, FileText, Share2, Mic, Brain,
  ChevronDown, ChevronUp, Copy, Check, Sparkles,
  Target, BarChart3, Eye, Heart, Shield, TrendingUp,
  MessageSquare, BookOpen, Lightbulb, Star, AlertCircle,
  Users, Layers, ArrowRight, Clock, DollarSign, Award,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface CopyFramework {
  id: string;
  acronym: string;
  name: string;
  category: FrameworkCategory;
  tagline: string;
  bestFor: string;
  structure: { label: string; description: string; example: string }[];
  psychPrinciple?: string;
  appTip?: string;
  proTip?: string;
  complexity: "Beginner" | "Intermediate" | "Advanced";
}

export type FrameworkCategory =
  | "Direct Response & Paid Ads"
  | "Email Marketing & Nurture"
  | "Landing Pages & Sales Pages"
  | "Social Media Organic"
  | "Brand Voice & Messaging"
  | "Psychological Triggers";

// ─── 40+ Framework Data ──────────────────────────────────────────────────────
export const allFrameworks: CopyFramework[] = [
  // ── 1. Direct Response & Paid Advertising ──────────────────────────────
  {
    id: "aida",
    acronym: "AIDA",
    name: "Attention, Interest, Desire, Action",
    category: "Direct Response & Paid Ads",
    tagline: "The universal standard for short-form ads.",
    bestFor: "Meta Ads, Pinterest Pins, TikTok Ads, Google Search Ads",
    complexity: "Beginner",
    structure: [
      { label: "Attention", description: "Stop the scroll instantly. Lead with your boldest claim or most disruptive hook.", example: "Stop juggling 10 tools just to run one campaign." },
      { label: "Interest", description: "Introduce the problem/solution with relevant context that makes them want more.", example: "Most marketers waste 15+ hours/week logging into separate platforms." },
      { label: "Desire", description: "Paint the transformation. Show the outcome, not just the feature.", example: "Launch fully optimized campaigns in under 10 minutes from one dashboard." },
      { label: "Action", description: "A single, specific, low-friction CTA that feels inevitable.", example: "Click to start your free 14-day trial →" },
    ],
    proTip: "Front-load your Attention hook in the first 3 seconds for video ads. For static ads, your headline IS your Attention step.",
  },
  {
    id: "pas",
    acronym: "PAS",
    name: "Problem, Agitation, Solution",
    category: "Direct Response & Paid Ads",
    tagline: "Best for pain-point niches; validates struggle before offering relief.",
    bestFor: "Meta Ads, TikTok UGC Ads, Email Subject Lines, Retargeting",
    complexity: "Beginner",
    structure: [
      { label: "Problem", description: "Name the exact pain your audience is experiencing right now.", example: "Your Pinterest pins are getting zero impressions." },
      { label: "Agitation", description: "Twist the knife — show the consequence of inaction. Make them feel the cost.", example: "While you're posting horizontal images, competitors' vertical pins dominate mobile feeds and steal your clicks." },
      { label: "Solution", description: "Present your product as the inevitable answer to the pain you just agitated.", example: "Switch to our 2:3 vertical pin templates with smart aspect ratio detection — and start winning." },
    ],
    psychPrinciple: "Loss Aversion: People are more motivated to avoid pain than to gain reward. Amplify the cost of inaction before offering relief.",
    proTip: "Don't rush to Solution. Spend 60% of your copy on Problem + Agitation. The deeper the wound, the stronger the relief.",
  },
  {
    id: "bab",
    acronym: "BAB",
    name: "Before, After, Bridge",
    category: "Direct Response & Paid Ads",
    tagline: "Ideal for transformation-based offers and income/lifestyle results.",
    bestFor: "Facebook Ads, YouTube Pre-roll, Course Sales, Affiliate Marketing",
    complexity: "Beginner",
    structure: [
      { label: "Before", description: "Describe their current painful reality in vivid, relatable detail.", example: "You're manually resizing ad creatives for 6 different platforms every week." },
      { label: "After", description: "Paint the desired outcome. Be specific with numbers and timelines.", example: "Imagine auto-exporting aspect-ratio-perfect ads for every platform in 90 seconds." },
      { label: "Bridge", description: "Your product/service is the mechanism that closes the gap between Before and After.", example: "The KB Academy Campaign Manager's Smart DAM does this automatically." },
    ],
    proTip: "Use real customer numbers in the After step. 'From $0 to $5k/mo in 90 days' outperforms vague promises every time.",
  },
  {
    id: "four-us",
    acronym: "4 U's",
    name: "Urgent, Unique, Ultra-specific, Useful",
    category: "Direct Response & Paid Ads",
    tagline: "A headline scoring framework — grade your headline before spending $1.",
    bestFor: "Google Search Ads, Email Subject Lines, Ad Headlines, Landing Page H1",
    complexity: "Intermediate",
    structure: [
      { label: "Urgent", description: "Does the headline create a reason to act NOW vs. later?", example: "⏰ Check: 'Closing in 24 hours' vs. 'Available now'" },
      { label: "Unique", description: "Does it offer something competitors cannot easily claim?", example: "🏆 Check: 'Automatic aspect ratio detection' vs. 'Easy to use'" },
      { label: "Ultra-specific", description: "Can you add a number, timeframe, or data point to increase credibility?", example: "📊 Check: 'Cut creative time by 73%' vs. 'Save time'" },
      { label: "Useful", description: "Does the reader immediately understand what's in it for them?", example: "💡 Check: 'Launch cross-platform ads in 10 min' vs. 'Better marketing software'" },
    ],
    appTip: "Headline Grader: Score your headline 1–4 (one point per U). Headlines scoring 3–4 are worth testing. Below 2 = rewrite.",
    proTip: "Ultra-specific is the most neglected U. Adding a precise number ('47%' vs. 'almost half') instantly elevates trust.",
  },
  {
    id: "acc",
    acronym: "ACC",
    name: "Awareness, Comprehension, Conviction",
    category: "Direct Response & Paid Ads",
    tagline: "Moves users from knowing a problem exists to believing your solution works.",
    bestFor: "Cold-traffic display ads, awareness campaigns, YouTube explainers",
    complexity: "Intermediate",
    structure: [
      { label: "Awareness", description: "Confirm the problem exists — many audiences don't even name their pain yet.", example: "Most marketers don't know that mismatched ad aspect ratios reduce CTR by 40%." },
      { label: "Comprehension", description: "Help them understand WHY the problem happens and HOW it affects them.", example: "When you upload a 1:1 image to a 9:16 TikTok slot, the algorithm suppresses it automatically." },
      { label: "Conviction", description: "Build belief that YOUR specific solution is the right remedy through proof.", example: "Over 4,000 campaigns managed, zero aspect ratio errors. See the case studies →" },
    ],
    psychPrinciple: "Belief Formation: You cannot convert someone who doesn't first believe the problem is real and your solution works.",
  },
  {
    id: "pppp",
    acronym: "PPPP",
    name: "Picture, Promise, Prove, Push",
    category: "Direct Response & Paid Ads",
    tagline: "Visual-first framework perfect for Instagram & Pinterest image ads.",
    bestFor: "Instagram Feed Ads, Pinterest Promoted Pins, Visual Email Newsletters",
    complexity: "Intermediate",
    structure: [
      { label: "Picture", description: "Open with a vivid scene that places the reader inside the desired outcome.", example: "Picture your affiliate dashboard showing $5,247 in commissions — and it's only Tuesday." },
      { label: "Promise", description: "State the specific transformation your product delivers.", example: "With KB Academy's Campaign Manager, that outcome is exactly what our members achieve." },
      { label: "Prove", description: "Back the promise with data, testimonials, or case studies immediately.", example: "'I went from $0 to $4,800 in my first 60 days following Eric's exact framework.' – Sarah M." },
      { label: "Push", description: "A confident, direct call to action with no ambiguity.", example: "Join 4,000+ affiliate marketers already inside. Start your free trial now." },
    ],
    proTip: "The Picture step should appear IN the visual creative, not just the caption. The best ads start storytelling before the copy is even read.",
  },
  {
    id: "oath",
    acronym: "OATH",
    name: "Oblivious, Apathetic, Thinking, Hurting",
    category: "Direct Response & Paid Ads",
    tagline: "Awareness-level framework — tailor copy to where your audience actually is.",
    bestFor: "Audience segmentation, retargeting ladders, funnel-stage ad copy",
    complexity: "Advanced",
    structure: [
      { label: "Oblivious", description: "Audience doesn't know the problem exists. Lead with education, not selling.", example: "Most marketers don't realize mismatched ad sizes are costing them 40% of their clicks." },
      { label: "Apathetic", description: "They know the problem but don't care yet. Show them the cost of inaction.", example: "You know your CTR is low — but did you know one fix could double it this week?" },
      { label: "Thinking", description: "They're aware and considering solutions. Give them a reason to choose YOU now.", example: "Comparing campaign tools? Here's why 4,000 marketers chose KB Academy over [Competitor]." },
      { label: "Hurting", description: "They're in acute pain and need relief NOW. Be direct and remove all friction.", example: "Frustrated with wasted ad spend? Fix it in 10 minutes — start your free trial." },
    ],
    appTip: "Map each retargeting audience to an OATH level. Cold audiences = Oblivious copy. Abandoned cart = Hurting copy. Never mix levels.",
  },
  {
    id: "slap",
    acronym: "SLAP",
    name: "Stop, Look, Act, Purchase",
    category: "Direct Response & Paid Ads",
    tagline: "Mobile-optimized variant of AIDA for thumb-stopping feeds.",
    bestFor: "TikTok Ads, Instagram Reels Ads, Mobile-first Facebook Ads",
    complexity: "Beginner",
    structure: [
      { label: "Stop", description: "Interrupt the scroll. First 1–2 seconds must be visually or verbally jarring.", example: "POV: You spent $500 on ads and got 3 clicks." },
      { label: "Look", description: "Earn sustained attention — hook them into the content mid-frame.", example: "I made one change to my image aspect ratio and my CTR tripled overnight." },
      { label: "Act", description: "Give them a micro-action (swipe up, follow, save) before the hard sell.", example: "Save this for when you're ready to fix your ads →" },
      { label: "Purchase", description: "The final, friction-free conversion ask.", example: "Get instant access — free 14-day trial, no credit card required." },
    ],
    proTip: "In mobile feeds, 'Stop' is visual, not verbal. A contrasting color, unexpected movement, or text overlay on frame 1 outperforms voice-led intros.",
  },
  {
    id: "quest",
    acronym: "QUEST",
    name: "Qualify, Understand, Educate, Stimulate, Transition",
    category: "Direct Response & Paid Ads",
    tagline: "Filters bad leads early — great for high-intent search ads and VSLs.",
    bestFor: "Google Search Ads, YouTube Video Sales Letters, High-Ticket Sales",
    complexity: "Advanced",
    structure: [
      { label: "Qualify", description: "Pre-select the right audience upfront. Repel bad leads, attract ideal ones.", example: "This is for affiliate marketers already making $500/mo who want to scale." },
      { label: "Understand", description: "Demonstrate deep empathy for their specific situation.", example: "I know you're spending hours resizing creatives, tracking pixel issues, and losing money to fragmented tools." },
      { label: "Educate", description: "Teach them something valuable that re-frames how they see the problem.", example: "The #1 reason campaigns underperform isn't budget — it's asset-copy mismatch." },
      { label: "Stimulate", description: "Build desire by showing the transformation through proof and vision.", example: "Watch how Sarah automated her entire campaign pipeline in under 45 minutes." },
      { label: "Transition", description: "Bridge naturally from education to the offer. Feel like advice, not a pitch.", example: "If that sounds like the system you've been looking for, here's how to get started." },
    ],
  },
  {
    id: "adp",
    acronym: "ADP",
    name: "Attention, Desire, Proof",
    category: "Direct Response & Paid Ads",
    tagline: "Simplified AIDA for platforms with strict character limits.",
    bestFor: "Twitter/X Ads, TikTok Captions, Google Smart Ads, SMS Marketing",
    complexity: "Beginner",
    structure: [
      { label: "Attention", description: "Your hook — make it visceral and immediate.", example: "I 10x'd my ad CTR changing one number." },
      { label: "Desire", description: "The outcome they want — name it fast.", example: "From 0.8% to 8.4% CTR in 7 days." },
      { label: "Proof", description: "One data point or source that makes it believable.", example: "47 students replicated this → link in bio" },
    ],
    proTip: "On X/Twitter, Proof and Desire can swap order. Lead with a surprising outcome number, then explain it.",
  },

  // ── 2. Email Marketing & Nurture Sequences ─────────────────────────────
  {
    id: "app-email",
    acronym: "APP",
    name: "Awareness, Problem, Positioning",
    category: "Email Marketing & Nurture",
    tagline: "Perfect for Day 1 welcome emails — establish relevance instantly.",
    bestFor: "Welcome sequences, Day 1 onboarding emails, Newsletter first editions",
    complexity: "Beginner",
    structure: [
      { label: "Awareness", description: "Confirm they made the right decision joining. Validate their interest.", example: "You just made a smart move — most marketers never figure out what you're about to learn." },
      { label: "Problem", description: "Name the core frustration your brand exists to solve.", example: "The #1 problem online entrepreneurs face: fragmented tools eating 15+ hours/week." },
      { label: "Positioning", description: "Establish your unique mechanism and why it's different.", example: "We built the Campaign Manager to consolidate everything — DAM, copy vault, analytics — in one place." },
    ],
    proTip: "APP works because subscribers are warmest in the first 24 hours. Strike while engagement is highest.",
  },
  {
    id: "fab",
    acronym: "FAB",
    name: "Features, Advantages, Benefits",
    category: "Email Marketing & Nurture",
    tagline: "Converts feature-listers into buyers by bridging specs to emotion.",
    bestFor: "Product announcement emails, feature highlight nurture, upgrade campaigns",
    complexity: "Beginner",
    structure: [
      { label: "Feature", description: "State what the product/feature IS.", example: "The Smart DAM automatically detects image aspect ratios." },
      { label: "Advantage", description: "Explain what it DOES better than alternatives.", example: "It eliminates the need to manually resize creatives for each platform." },
      { label: "Benefit", description: "Reveal the emotional/financial impact for THE READER.", example: "You'll save 5+ hours every week and stop losing money on suppressed mismatched ads." },
    ],
    appTip: "AI Integration: Auto-translate feature bullet points → emotional FAB benefits. Input: 'Smart aspect ratio detection.' Output: full FAB sequence.",
    proTip: "Most marketers stop at Feature or Advantage. The money is in the Benefit. Always bridge to 'what this means for YOUR life/business.'",
  },
  {
    id: "storybrand",
    acronym: "StoryBrand",
    name: "Character → Problem → Guide → Plan → Success",
    category: "Email Marketing & Nurture",
    tagline: "Position yourself as the mentor, not the hero. Customers are the hero.",
    bestFor: "Founder story emails, brand narrative sequences, high-ticket sales emails",
    complexity: "Advanced",
    structure: [
      { label: "Character", description: "Your customer is the hero, not you. Define their goal vividly.", example: "You want a marketing system that works without you logging into 8 different platforms." },
      { label: "Problem", description: "Three levels of conflict: External (tool fragmentation), Internal (overwhelm/doubt), Philosophical (it shouldn't be this hard).", example: "Every time you log into a new platform, you waste 20 minutes. And worse — you start doubting if you're cut out for this." },
      { label: "Guide", description: "You appear as the empathetic mentor with a plan. Not the hero — the Yoda.", example: "After helping 4,000 marketers escape the tool overwhelm cycle, I built the exact system they needed." },
      { label: "Plan", description: "Give them a simple 3-step path forward. Reduce friction of entry.", example: "Step 1: Connect your platforms. Step 2: Upload your assets. Step 3: Launch in 10 minutes." },
      { label: "Success", description: "Paint the transformation they'll achieve by following the plan.", example: "You launch your campaigns confidently, track everything in one place, and grow without the chaos." },
    ],
    psychPrinciple: "Identity Narrative: Humans are drawn to stories where they are the protagonist. Centering your customer (not your brand) as the hero dramatically increases emotional resonance.",
  },
  {
    id: "pastor",
    acronym: "PASTOR",
    name: "Problem, Amplify, Story, Transformation, Offer, Response",
    category: "Email Marketing & Nurture",
    tagline: "Ray Edwards' framework for high-ticket email sales sequences.",
    bestFor: "High-ticket offer emails, product launch sequences, long-form sales emails",
    complexity: "Advanced",
    structure: [
      { label: "Problem", description: "Open with the exact problem in their language, not yours.", example: "You're spending money on ads that nobody sees because the platforms suppress mismatched creatives." },
      { label: "Amplify", description: "Expand the consequences of leaving the problem unsolved.", example: "Every week this continues, you're flushing an average of $340 in suppressed ad spend — $17,000+ per year." },
      { label: "Story", description: "Tell a real transformation story (yours or a student's) that mirrors their situation.", example: "Sarah was in the same spot in February. Here's what happened when she switched systems..." },
      { label: "Transformation", description: "Paint the specific outcome readers will achieve.", example: "Within 30 days: 73% reduction in wasted ad spend, 4.2% average CTR, and 5 hours/week back." },
      { label: "Offer", description: "Present the offer clearly, with all components and value stacked.", example: "Campaign Manager Pro: DAM + Copy Vault + Analytics + Email Sequences. One platform. $99/mo." },
      { label: "Response", description: "Tell them EXACTLY what to do next. One action.", example: "Click below to activate your free 14-day trial. No credit card required." },
    ],
    proTip: "The Story step is the separator between PASTOR and generic sales emails. Skip it and you're just writing another pitch. Include it and you create emotional momentum.",
  },
  {
    id: "three-two-one",
    acronym: "3-2-1",
    name: "3 Problems, 2 Solutions, 1 CTA",
    category: "Email Marketing & Nurture",
    tagline: "Structured nurture email that educates before selling.",
    bestFor: "Mid-sequence nurture emails, newsletter value editions, re-engagement",
    complexity: "Beginner",
    structure: [
      { label: "3 Problems", description: "List three specific problems your audience faces. Be precise — no generic pain points.", example: "1. Aspect ratio mismatches suppressing ad reach. 2. Disconnected asset libraries. 3. Manual analytics spreadsheets." },
      { label: "2 Solutions", description: "Offer two possible ways to solve the problems (one free, one paid).", example: "Solution A: Build a manual SOP checklist (free but slow). Solution B: Use our automated Campaign Manager." },
      { label: "1 CTA", description: "One focused conversion ask. Never two CTAs in one email.", example: "Try the automated solution free for 14 days →" },
    ],
    proTip: "The 3 Problems act as self-qualification. If readers nod 'yes' to all three, they're highly qualified. Use this framework for list reactivation.",
  },
  {
    id: "soap",
    acronym: "SOAP",
    name: "Story, Offer, Authority, Proof",
    category: "Email Marketing & Nurture",
    tagline: "Blends storytelling with hard social proof for credibility + conversion.",
    bestFor: "Sales emails, affiliate launch sequences, limited-time offer promotions",
    complexity: "Intermediate",
    structure: [
      { label: "Story", description: "Open with a 3–5 sentence story — a real moment of struggle or discovery.", example: "Last October, I lost $2,400 in one week on Facebook ads that were never shown. The reason? Wrong image dimensions." },
      { label: "Offer", description: "Transition naturally from the story into your offer as the solution.", example: "That experience is why I built the aspect ratio auto-checker into Campaign Manager Pro." },
      { label: "Authority", description: "Establish credibility — results, credentials, years of experience.", example: "After managing 4,000+ campaigns for students across 14 countries, I know what breaks first." },
      { label: "Proof", description: "Stack social proof: testimonials, case studies, data.", example: "'I eliminated aspect ratio errors completely in week one.' – Marcus T., affiliate marketer since 2024" },
    ],
  },
  {
    id: "reasons-why",
    acronym: "REASONS WHY",
    name: "List-Based Persuasion",
    category: "Email Marketing & Nurture",
    tagline: "Builds logical conviction in skeptical subscribers through enumerated proof.",
    bestFor: "Pre-launch emails, objection-heavy niches, B2B email sequences",
    complexity: "Beginner",
    structure: [
      { label: "Setup", description: "Frame the list with the decision or action you want them to take.", example: "5 reasons why switching to Campaign Manager Pro is the best decision you'll make this month:" },
      { label: "List Items (3–7)", description: "Each item should speak to a different objection, benefit, or proof point.", example: "1. Your ads will reach more people (no more suppression errors).\n2. You'll cut creative production time by 73%.\n3. Your analytics will finally make sense.\n4. You'll stop paying for 6 tools you could replace with one.\n5. Your first campaign using our system could launch today." },
      { label: "CTA", description: "A closing statement that makes the decision feel obvious.", example: "If even 2 of these resonate, it's worth trying free for 14 days." },
    ],
    proTip: "Start your list with the most compelling point (not the least). Many people scan lists; your #1 item determines whether they read on.",
  },
  {
    id: "open-loop",
    acronym: "OPEN LOOP",
    name: "Curiosity Gap Framework",
    category: "Email Marketing & Nurture",
    tagline: "Creates curiosity gaps that psychologically compel email opens and click-throughs.",
    bestFor: "Email subject lines, episode teasers, social series, content hooks",
    complexity: "Intermediate",
    structure: [
      { label: "Open the Loop", description: "Introduce an incomplete idea, question, or promise in your subject line or opener.", example: "Subject: The one ad mistake I almost made that would have cost me $10k..." },
      { label: "Build Tension", description: "Maintain the gap throughout the body — tease but don't fully resolve.", example: "I almost hit publish on a campaign with the wrong settings. And then I noticed something..." },
      { label: "Partial Reveal", description: "Give enough to reward their reading without fully closing the loop.", example: "The fix was a 4-second change — but it saved my entire launch." },
      { label: "Close with a Hook to Next Action", description: "Resolve just enough to earn a click or the next open.", example: "I'll show you exactly what that change was inside the tutorial → [link]" },
    ],
    psychPrinciple: "Zeigarnik Effect: People remember and feel compelled to complete unfinished tasks or thoughts. Open loops create involuntary mental engagement.",
  },

  // ── 3. Landing Pages & Sales Pages ─────────────────────────────────────
  {
    id: "great-leads",
    acronym: "GREAT LEADS",
    name: "6 Lead Types (Direct, Indirect, News, How-To, Question, Command)",
    category: "Landing Pages & Sales Pages",
    tagline: "Choose the right opening based on audience warmth and offer type.",
    bestFor: "Course sales pages, lead magnet opt-ins, webinar registrations",
    complexity: "Advanced",
    structure: [
      { label: "Direct Lead", description: "State the offer and biggest benefit immediately. Best for warm audiences.", example: "Join 4,000 marketers managing all their ad campaigns from one dashboard. Free trial below." },
      { label: "Indirect Lead", description: "Intrigue before the offer. Best for cold traffic. Create curiosity first.", example: "What if every ad creative you uploaded was automatically perfect for every platform?" },
      { label: "News Lead", description: "Frame your offer around a recent event, trend, or development.", example: "New Meta algorithm update suppresses mismatched creatives. Here's how to protect your campaigns." },
      { label: "How-To Lead", description: "Promise to teach something valuable. Positions you as an authority guide.", example: "How to cut your ad creative production time by 73% using one automated workflow." },
      { label: "Question Lead", description: "Ask a question the audience can only answer 'yes' to.", example: "Are you tired of logging into 6 different platforms just to manage one campaign?" },
      { label: "Command Lead", description: "Open with a direct instruction that implies immediate value.", example: "Stop resizing your ad creatives manually. Your campaign manager should do it for you." },
    ],
    appTip: "Match lead type to funnel stage: Cold traffic → Indirect/Question. Warm retargeting → Direct/Command. Viral content traffic → News lead.",
  },
  {
    id: "care",
    acronym: "CARE",
    name: "Connect, Analyze, Respond, Explain",
    category: "Landing Pages & Sales Pages",
    tagline: "Empathy-first sales page structure for sensitive niches.",
    bestFor: "Health & wellness courses, financial recovery offers, mental health adjacent content",
    complexity: "Intermediate",
    structure: [
      { label: "Connect", description: "Open with deep empathy — meet them exactly where they are emotionally.", example: "If you've been pouring money into ads and feeling like you're the problem, you're not alone." },
      { label: "Analyze", description: "Help them understand the real root cause of their struggle.", example: "The issue isn't your budget or your creativity — it's that no one taught you the right system." },
      { label: "Respond", description: "Show how your solution directly addresses the root cause.", example: "Campaign Manager Pro was built specifically for marketers who are overwhelmed, not undertrained." },
      { label: "Explain", description: "Walk through exactly how it works, step by step, with zero jargon.", example: "Step 1: Connect your ad accounts. Step 2: Upload your creative library. Step 3: Launch with one click." },
    ],
    proTip: "Never skip Connect in sensitive markets. Prospects in high-stress niches need to feel heard before they'll believe you have answers.",
  },
  {
    id: "spin",
    acronym: "SPIN",
    name: "Situation, Problem, Implication, Need-Payoff",
    category: "Landing Pages & Sales Pages",
    tagline: "Consultative selling framework for high-value offers over $500.",
    bestFor: "High-ticket landing pages, B2B sales pages, coaching/consulting offers",
    complexity: "Advanced",
    structure: [
      { label: "Situation", description: "Establish context about where the reader currently is.", example: "You're running paid ads on 2–3 platforms and manually managing creative assets in separate folders." },
      { label: "Problem", description: "Surface the pain that exists within that situation.", example: "This manual approach is causing creative mismatch errors, suppressed reach, and wasted spend." },
      { label: "Implication", description: "Expand the problem's impact across their business — amplify the downstream cost.", example: "Every week you continue this way, you're losing an average of $340 in suppressed ad visibility and 5 hours of productive time." },
      { label: "Need-Payoff", description: "Let the reader arrive at wanting your solution — guide them to ask for it.", example: "What would your business look like if this entire workflow ran automatically, perfectly, every time?" },
    ],
    psychPrinciple: "Socratic Discovery: People are more committed to solutions they feel they discovered themselves. SPIN guides them to their own conclusion.",
  },
  {
    id: "grab",
    acronym: "G.R.A.B.",
    name: "Grab Attention, Relate to Pain, Assert Solution, Build Credibility",
    category: "Landing Pages & Sales Pages",
    tagline: "Fast-converting landing page flow for direct response offers.",
    bestFor: "Lead magnet pages, free-trial landing pages, affiliate bridge pages",
    complexity: "Intermediate",
    structure: [
      { label: "Grab Attention", description: "Headline that stops and orients the reader immediately.", example: "Finally: One Dashboard for Every Ad, Every Platform, Every Campaign." },
      { label: "Relate to Pain", description: "Mirror their exact situation to build instant rapport.", example: "You didn't start marketing to spend 15 hours a week managing software. But here you are." },
      { label: "Assert Solution", description: "Confidently introduce your offer as the mechanism of relief.", example: "Campaign Manager Pro consolidates your entire ad workflow into one intelligent system." },
      { label: "Build Credibility", description: "Social proof, stats, or authority signal directly beneath the offer.", example: "4,000+ marketers. $12M in managed ad spend. 97% satisfaction rate." },
    ],
  },
  {
    id: "velvet-rope",
    acronym: "VELVET ROPE",
    name: "Exclusivity & Scarcity Architecture",
    category: "Landing Pages & Sales Pages",
    tagline: "Creates exclusivity and scarcity without being manipulative.",
    bestFor: "Mastermind waitlists, cohort-based courses, limited-seat offers",
    complexity: "Intermediate",
    structure: [
      { label: "Exclusivity Qualifier", description: "Define who this is specifically for — and who it's NOT for.", example: "This program is for affiliate marketers already earning $1k+/mo who want to scale past $10k." },
      { label: "Legitimate Scarcity", description: "State a real, honest reason for limited availability.", example: "We limit each cohort to 50 students so every member gets personalized feedback on their campaigns." },
      { label: "FOMO Validation", description: "Show what happens when someone is accepted (not just when they miss out).", example: "Last cohort: 47/50 spots filled in 9 hours. Waitlist members got priority access." },
      { label: "Trust Bridge", description: "Guarantee, transparency, or explanation that prevents manipulation feeling.", example: "Not the right fit? We'll tell you — and recommend a better path for your stage." },
    ],
    psychPrinciple: "Scarcity + Social Proof: Limited availability signals quality, not pressure, when paired with honest qualification.",
  },
  {
    id: "risk-reversal",
    acronym: "RISK REVERSAL",
    name: "Guarantee, Proof & Anxiety Elimination",
    category: "Landing Pages & Sales Pages",
    tagline: "Stacked guarantees, testimonials, and proof to eliminate purchase anxiety.",
    bestFor: "Sales page trust sections, checkout pages, objection-handling blocks",
    complexity: "Intermediate",
    structure: [
      { label: "Named Guarantee", description: "Give your guarantee a compelling name and specific terms.", example: "The '10-Minute Launch Guarantee': If you can't launch your first campaign in 10 minutes, we'll personally onboard you for free." },
      { label: "Proof Stack", description: "Layer multiple types of proof: data, testimonials, case studies, media mentions.", example: "4,000 members | 97% retention rate | Featured in Affiliate Marketing Weekly | Student case studies below." },
      { label: "Objection Preemption", description: "Name the top 3 objections and answer them before they're asked.", example: "'Is this for beginners?' Yes — step-by-step setup takes 10 minutes. 'What if I'm not tech-savvy?' Our onboarding handles everything." },
      { label: "Confidence Closing", description: "End your trust section with a forward-leaning, confident CTA.", example: "You've seen the proof. You know the guarantee. The only risk now is waiting." },
    ],
  },
  {
    id: "value-ladder",
    acronym: "VALUE LADDER",
    name: "Tiered Copy Architecture",
    category: "Landing Pages & Sales Pages",
    tagline: "Maps copy to each tier of your offer for maximum LTV.",
    bestFor: "Funnel architectures, course ecosystems, subscription product families",
    complexity: "Advanced",
    structure: [
      { label: "Free Tier", description: "Lead magnet copy: solve one problem completely, create appetite for more.", example: "Free: The Ad Aspect Ratio Cheat Sheet. Solve platform confusion instantly." },
      { label: "Low-Ticket", description: "Entry-product copy: position as the fastest path to first win.", example: "$47: Campaign Starter Pack — everything you need for your first $1k campaign." },
      { label: "Mid-Ticket", description: "Core offer copy: comprehensive system with community/support.", example: "$99/mo: Campaign Manager Pro — full DAM, swipe vault, analytics, email sequences." },
      { label: "High-Ticket", description: "Premium copy: transformation + proximity + speed.", example: "$2,997: Affiliate Accelerator Mastermind — done-with-you campaign system + weekly coaching." },
    ],
    appTip: "Each tier's copy should make the next tier feel like a natural upgrade, not an upsell. Never let a tier feel 'complete' — leave a compelling gap.",
  },

  // ── 4. Social Media Organic Content ────────────────────────────────────
  {
    id: "hook-value-cta",
    acronym: "HOOK-VALUE-CTA",
    name: "Hook → Value → Call to Action",
    category: "Social Media Organic",
    tagline: "Modern social standard: 3-second hook → actionable insight → low-friction ask.",
    bestFor: "Instagram, LinkedIn, TikTok, YouTube Shorts, Twitter/X threads",
    complexity: "Beginner",
    structure: [
      { label: "Hook", description: "First 3 seconds/words must earn the next 10. Disrupt, contradict, or quantify.", example: "I cut my ad creative time by 73%. Here's the exact system:" },
      { label: "Value", description: "Deliver a complete, actionable insight that works even without clicking the link.", example: "1. Upload all creative assets once → DAM auto-tags aspect ratios.\n2. Select your platform → System recommends matching assets.\n3. Launch — no resize errors, no suppression." },
      { label: "CTA", description: "One low-friction ask. Never 'buy now.' Prefer save, share, follow, or comment.", example: "Save this and come back when you're ready to cut your creative time in half." },
    ],
    proTip: "The CTA should match the post's energy. Educational posts earn 'Save.' Inspiring posts earn 'Share.' Controversial posts earn 'Comment.' Mixing them kills engagement.",
  },
  {
    id: "real",
    acronym: "R.E.A.L.",
    name: "Relatable, Educational, Aspirational, Logical",
    category: "Social Media Organic",
    tagline: "Multi-trigger content framework covering all four buyer motivations.",
    bestFor: "Content pillars, monthly content calendars, brand authority building",
    complexity: "Intermediate",
    structure: [
      { label: "Relatable", description: "Content that mirrors the audience's current reality — builds identity connection.", example: "When your ad account says 'Learning Phase' but your wallet says 'Already learned enough'." },
      { label: "Educational", description: "Teach something specific and actionable — earns saves and shares.", example: "How to check if your Facebook Pixel is firing correctly in 60 seconds [step-by-step]" },
      { label: "Aspirational", description: "Paint the future state — drives follows and emotional investment.", example: "What your mornings look like when your campaigns are optimized and running themselves." },
      { label: "Logical", description: "Data, frameworks, and structured reasoning — earns B2B engagement and reposts.", example: "Why a 4% CTR on cold traffic is better than a 12% CTR on retargeting [math breakdown]" },
    ],
    proTip: "Build your content calendar with all four R.E.A.L. types every month. Brands that only post Educational content see engagement plateau within 90 days.",
  },
  {
    id: "gap-framework",
    acronym: "THE GAP",
    name: "Gap Framework: Current State vs. Desired Outcome",
    category: "Social Media Organic",
    tagline: "Highlights distance between where they are and where they want to be.",
    bestFor: "Instagram carousels, LinkedIn posts, email subject lines, ad copy",
    complexity: "Beginner",
    structure: [
      { label: "Current State (Pain)", description: "Describe where they are vividly — make them feel recognized.", example: "Right now: Downloading assets from 4 folders, resizing in Canva, uploading to 3 separate ad managers." },
      { label: "Desired State (Dream)", description: "Describe where they want to be — be specific with outcomes.", example: "What you want: One upload, auto-formatted for every platform, launched before your coffee gets cold." },
      { label: "Gap Insight", description: "Name the specific barrier keeping them stuck — the 'missing link.'", example: "The gap isn't effort. It's that no one tool was built to bridge creative management with campaign launch." },
      { label: "Bridge", description: "Introduce your solution as the mechanism that closes the gap.", example: "Campaign Manager Pro was built for exactly this gap. Fill it for free →" },
    ],
    proTip: "The Gap Framework works because revealing the gap feels like a diagnosis. People trust their doctors more than their salespeople.",
  },
  {
    id: "past-social",
    acronym: "P.A.S.T.",
    name: "Problem, Agitate, Solution, Testimonial",
    category: "Social Media Organic",
    tagline: "Social-proof-enhanced PAS. The testimonial seals the deal on organic posts.",
    bestFor: "Instagram posts, Facebook organic, LinkedIn case study posts",
    complexity: "Beginner",
    structure: [
      { label: "Problem", description: "Name the exact pain — one sentence, no jargon.", example: "You're losing ad money every week to platform suppression — and you don't even know it." },
      { label: "Agitate", description: "Show what staying stuck really costs them.", example: "That's $17,000/year in suppressed reach if you're running even a $500/month budget." },
      { label: "Solution", description: "Name your mechanism — keep it benefit-focused.", example: "One automated aspect ratio check before every campaign launch fixes this permanently." },
      { label: "Testimonial", description: "Drop a real quote that mirrors the audience's situation.", example: "'This single fix saved my Q3 campaign.' – Marcus T., affiliate marketer" },
    ],
  },
  {
    id: "listicle",
    acronym: "LISTICLE",
    name: "Numbered Value + Personal Story",
    category: "Social Media Organic",
    tagline: "Scannable format combined with human touch storytelling — your signature style.",
    bestFor: "LinkedIn newsletters, Twitter/X threads, Instagram carousels, email digests",
    complexity: "Beginner",
    structure: [
      { label: "Hook Number", description: "Lead with the list count in a surprising or specific framing.", example: "7 things I wish I knew before spending $50,000 on Facebook ads:" },
      { label: "List Items", description: "Each item should deliver a complete insight — not just a phrase.", example: "1. Aspect ratio matters more than copy.\n2. Retargeting burns out after 7 days.\n3. Lookalike audiences need 1,000+ customer data points." },
      { label: "Personal Story Anchor", description: "Tie 1–2 list items to a real experience to humanize the content.", example: "Number 1 cost me $2,400 in one suppressed campaign. Here's what I found:" },
      { label: "Closing CTA", description: "End with an engagement-driving ask or value reinforcement.", example: "Save this. Future you will thank you." },
    ],
    proTip: "The personal story anchor is what separates your listicles from AI-generated lists. It's the fingerprint that builds trust and following.",
  },
  {
    id: "myth-buster",
    acronym: "MYTH-BUSTER",
    name: "Belief Pattern Interrupt",
    category: "Social Media Organic",
    tagline: "Challenges common beliefs to create pattern interrupts and establish authority.",
    bestFor: "LinkedIn thought leadership, Twitter/X threads, YouTube scripts, podcast intros",
    complexity: "Intermediate",
    structure: [
      { label: "State the Myth", description: "Name a widely-held belief your audience holds as true.", example: "Myth: You need a big budget to run effective paid ads." },
      { label: "Acknowledge Why They Believe It", description: "Validate that the belief makes sense given their experience.", example: "This makes sense — every guru you follow seems to be running $10k/month campaigns." },
      { label: "Bust the Myth", description: "Present the counter-evidence with data, logic, or case study.", example: "Reality: Our top-performing campaign in 2024 launched with $14/day. It outperformed $200/day competitors." },
      { label: "New Belief Installation", description: "Close by installing the correct belief they should carry forward.", example: "What matters isn't budget size. It's asset quality, targeting precision, and creative-copy alignment." },
    ],
    psychPrinciple: "Pattern Interruption: Violating a held belief creates cognitive dissonance that demands resolution. Your content becomes the resolution.",
  },
  {
    id: "bab-social",
    acronym: "BEFORE-AFTER-BRIDGE",
    name: "Visual Transformation Posts",
    category: "Social Media Organic",
    tagline: "Visual transformation posts with caption storytelling for organic reach.",
    bestFor: "Instagram carousels, TikTok before/after videos, Facebook community posts",
    complexity: "Beginner",
    structure: [
      { label: "Before", description: "Show/describe the painful starting point with emotional honesty.", example: "Before: 8 browser tabs. 3 Canva windows. 2 ad managers. 1 massive headache." },
      { label: "After", description: "Show/describe the transformed result — make it visual and specific.", example: "After: One dashboard. All assets tagged. All campaigns live. 11 AM coffee still warm." },
      { label: "Bridge", description: "Name the mechanism that made the transformation possible — your system.", example: "Bridge: Campaign Manager Pro → unified DAM + one-click launch. That's it." },
    ],
  },
  {
    id: "question-insight-action",
    acronym: "QUESTION-INSIGHT-ACTION",
    name: "Engagement-First Framework",
    category: "Social Media Organic",
    tagline: "Saves mental labor by prompting audience interaction before delivering insight.",
    bestFor: "Instagram Stories, LinkedIn polls, Twitter/X openers, community posts",
    complexity: "Beginner",
    structure: [
      { label: "Question", description: "Open with a question your audience instantly has an opinion about.", example: "How many marketing platforms are you currently paying for monthly? (Comment below)" },
      { label: "Insight", description: "Deliver a data point or insight that reframes the answer they just gave.", example: "The average online marketer pays for 7.3 separate marketing tools. That's $400–900/month in overlap." },
      { label: "Action", description: "Bridge the insight to an immediate, relevant action they can take today.", example: "I made a tool consolidation calculator. Drop 'CALC' in the comments and I'll send it." },
    ],
    proTip: "The Question does two things: it generates comments (algorithm signal) and it primes the audience to care about your Insight.",
  },

  // ── 5. Brand Voice & Messaging Architecture ────────────────────────────
  {
    id: "golden-circle",
    acronym: "GOLDEN CIRCLE",
    name: "Why → How → What",
    category: "Brand Voice & Messaging",
    tagline: "Simon Sinek's framework for mission-driven brand messaging.",
    bestFor: "Brand guidelines, About pages, pitch decks, founder story content",
    complexity: "Intermediate",
    structure: [
      { label: "Why (Purpose)", description: "Your mission, belief, and reason for existing — beyond profit.", example: "We believe online entrepreneurs deserve a marketing system as smart as their ambitions." },
      { label: "How (Differentiator)", description: "Your unique process or approach that makes the Why possible.", example: "By consolidating every marketing tool — DAM, copy vault, analytics, email sequences — into one intelligent platform." },
      { label: "What (Offering)", description: "What you actually sell — stated last because Why is what earns trust.", example: "Campaign Manager Pro: the all-in-one command center for affiliate marketers and online entrepreneurs." },
    ],
    psychPrinciple: "Limbic Resonance: The Why speaks to the brain's decision-making center (limbic system) before engaging rational thinking. People buy why you do it, not what you do.",
  },
  {
    id: "brand-archetypes",
    acronym: "ARCHETYPES",
    name: "12 Jungian Brand Personality Types",
    category: "Brand Voice & Messaging",
    tagline: "Defines consistent voice and personality across all marketing assets.",
    bestFor: "Brand identity development, tone guidelines, voice calibration",
    complexity: "Advanced",
    structure: [
      { label: "The Hero", description: "Voice: Bold, confident, achievement-oriented. Brands like: Nike, Army.", example: "Conquer your marketing challenges. No excuses. No limits." },
      { label: "The Mentor/Sage", description: "Voice: Wise, educational, trustworthy, authoritative. Brands like: Google, TED.", example: "Everything you need to know about launching your first campaign — explained simply." },
      { label: "The Outlaw/Rebel", description: "Voice: Disruptive, direct, anti-status-quo. Brands like: Harley Davidson, Dollar Shave Club.", example: "Most marketing tools are overpriced and underbuilt. We fixed that." },
      { label: "The Everyman", description: "Voice: Relatable, inclusive, no-jargon. Brands like: IKEA, eBay.", example: "Marketing made simple. For real people running real businesses." },
      { label: "The Explorer", description: "Voice: Curious, adventurous, freedom-loving. Brands like: REI, Jeep, National Geographic.", example: "Discover the campaign strategy that outperforms what everyone else is doing." },
      { label: "The Creator", description: "Voice: Innovative, expressive, imaginative. Brands like: Apple, Adobe.", example: "Your ideas deserve a canvas as bold as your vision. Build it here." },
    ],
    appTip: "Select your primary archetype and one secondary archetype. Your KB Academy brand maps to: Primary = Mentor/Sage, Secondary = Everyman (accessible expertise).",
    proTip: "Archetype consistency is what makes brands feel trustworthy. Inconsistent voice across platforms = brand confusion = reduced conversions.",
  },
  {
    id: "message-matrix",
    acronym: "MESSAGE MATRIX",
    name: "Audience × Pain × Solution × Proof",
    category: "Brand Voice & Messaging",
    tagline: "Ensures no persona is overlooked. Systematizes every message combination.",
    bestFor: "Multi-segment product launches, agency campaign planning, content calendar architecture",
    complexity: "Advanced",
    structure: [
      { label: "Audience Segment", description: "Define each distinct persona who buys your product.", example: "Segment A: Beginner affiliate marketers (0–$1k/mo). Segment B: Scaling marketers ($1k–$10k/mo)." },
      { label: "Pain Point", description: "The specific pain each segment experiences most acutely.", example: "Segment A pain: Overwhelmed, don't know where to start. Segment B pain: Fragmented tools slowing scaling." },
      { label: "Solution Angle", description: "The specific product feature that solves their segment's primary pain.", example: "Segment A: 10-minute guided wizard. Segment B: Advanced analytics + multi-campaign dashboard." },
      { label: "Proof Type", description: "The most persuasive proof format for each segment.", example: "Segment A: Student journey stories. Segment B: ROI data and case study metrics." },
    ],
  },
  {
    id: "tone-slider",
    acronym: "TONE SLIDER",
    name: "Voice Calibration Framework",
    category: "Brand Voice & Messaging",
    tagline: "Calibrates AI output to match brand voice. Critical for human touch workflow.",
    bestFor: "AI copy review, brand guidelines, content team alignment, agency briefs",
    complexity: "Intermediate",
    structure: [
      { label: "Formal ↔ Casual", description: "Where does your brand sit on the professional-to-conversational scale?", example: "KB Academy: 30% Formal (builds authority) / 70% Casual (builds connection). Output: 'Here's what you need to know' not 'Please review the following information.'" },
      { label: "Empathetic ↔ Direct", description: "Balance between emotional validation and confident direction.", example: "Nurture emails: 80% empathetic. Sales emails: 60% direct. Ads: 80% direct." },
      { label: "Playful ↔ Serious", description: "When and how much humor, lightness, or levity is appropriate.", example: "Social posts: Allow playfulness. Sales pages: Keep serious. Support emails: Warm but not playful." },
      { label: "Aspirational ↔ Practical", description: "Balance between inspiring vision and concrete, actionable instruction.", example: "Brand content: 50/50. How-to content: 80% practical. Brand story content: 80% aspirational." },
    ],
    appTip: "Use this slider to calibrate every AI-generated piece before publishing. AI defaults to neutral — your brand needs a position on every axis.",
  },
  {
    id: "voice-tone-grid",
    acronym: "VOICE & TONE GRID",
    name: "Context-Appropriate Tone Mapping",
    category: "Brand Voice & Messaging",
    tagline: "Maps appropriate tone by context across every touchpoint.",
    bestFor: "Content team guidelines, agency briefs, multi-platform content strategy",
    complexity: "Intermediate",
    structure: [
      { label: "Nurture Emails", description: "Tone: Warm, supportive, encouraging, educational.", example: "'I've been there. Here's what finally worked for me — and for 4,000 members just like you.'" },
      { label: "Sales Pages/Emails", description: "Tone: Confident, outcomes-focused, proof-backed, direct.", example: "'This is the system that has generated $12M in managed ad spend. It works.'" },
      { label: "Social Media Organic", description: "Tone: Relatable, conversational, pattern-interrupting, value-first.", example: "'Unpopular opinion: You don't need more traffic. You need better assets. Here's why:'" },
      { label: "Paid Ad Copy", description: "Tone: Urgent, specific, benefit-led, friction-free.", example: "'73% less creative time. One dashboard. Free for 14 days.'" },
      { label: "Customer Support / Onboarding", description: "Tone: Patient, clear, empowering, solution-focused.", example: "'You've got this. Let's walk through it step by step — it takes 10 minutes.'" },
    ],
  },

  // ── 6. Psychological Trigger Frameworks ────────────────────────────────
  {
    id: "cialdini",
    acronym: "CIALDINI'S 7",
    name: "7 Principles of Influence",
    category: "Psychological Triggers",
    tagline: "Embed persuasion triggers systematically across every campaign touchpoint.",
    bestFor: "Campaign strategy, sales page design, objection handling, offer structuring",
    complexity: "Advanced",
    structure: [
      { label: "Reciprocity", description: "Give before you ask. Free value creates psychological obligation.", example: "Free aspect ratio cheat sheet → then introduce paid product." },
      { label: "Scarcity", description: "Genuine limitations increase perceived value and urgency.", example: "'Only 50 cohort seats — 43 filled.' (Must be real — fake scarcity destroys trust.)" },
      { label: "Authority", description: "Credentials, media mentions, and data establish expertise credibility.", example: "'Featured in Affiliate Marketing Weekly | $12M in managed ad spend | 4,000+ members'" },
      { label: "Consistency", description: "Small agreements lead to larger commitments — micro-conversions first.", example: "Free download → free trial → paid subscription. Each step locks in consistency." },
      { label: "Liking", description: "People buy from those they like. Personal stories and shared values build liking.", example: "Founder story email that shares a real failure builds more liking than any testimonial." },
      { label: "Social Proof", description: "Visible community size and peer outcomes reduce purchase anxiety.", example: "'Join 4,000 marketers already using Campaign Manager Pro.'" },
      { label: "Unity", description: "Shared identity creates deepest connection — 'we are the same tribe.'", example: "'Built by a former affiliate marketer, for affiliate marketers. Not for ad agencies.'" },
    ],
    psychPrinciple: "Systematic Influence: These triggers work because they are cognitive shortcuts the human brain uses automatically. Applied ethically, they accelerate aligned decisions.",
  },
  {
    id: "loss-aversion",
    acronym: "LOSS AVERSION",
    name: "Negative Framing Framework",
    category: "Psychological Triggers",
    tagline: "'Don't lose X' outperforms 'Gain X' in most purchase contexts.",
    bestFor: "Ad copy, email subject lines, offer framing, CTA buttons",
    complexity: "Beginner",
    structure: [
      { label: "Identify the Loss", description: "Name exactly what they're already losing (not what they could gain).", example: "You're losing $340/week in suppressed ad reach. Not hypothetically — this week." },
      { label: "Quantify the Loss", description: "Make the loss specific, measurable, and time-bound.", example: "$340/week = $17,680/year in invisible wasted ad spend." },
      { label: "Loss-Framed CTA", description: "Frame the action as stopping a loss, not starting a gain.", example: "Stop losing ad reach → Start your free trial (Not: 'Gain more reach')" },
      { label: "Gain Validation", description: "After the loss-frame, briefly confirm the positive outcome too.", example: "Fix the leak → then watch your ROAS climb." },
    ],
    psychPrinciple: "Prospect Theory (Kahneman): Losses loom approximately 2x larger than equivalent gains in human decision-making. Loss-framed copy triggers stronger urgency.",
  },
  {
    id: "anchoring",
    acronym: "ANCHORING",
    name: "Price & Value Expectation Setting",
    category: "Psychological Triggers",
    tagline: "Sets price and value expectations before revealing your offer.",
    bestFor: "Sales pages, pricing sections, email sequences, webinar closes",
    complexity: "Intermediate",
    structure: [
      { label: "High Anchor", description: "Establish the comparison value first — what they'd pay for alternatives.", example: "An agency charges $5,000/month to manage what you can do yourself in this platform." },
      { label: "Middle Anchor", description: "Optional: Show a 'good but incomplete' alternative.", example: "Cobbling together 6 separate tools costs you $400–900/month and still doesn't do this automatically." },
      { label: "Your Offer Reveal", description: "Your price now feels dramatically reasonable against the anchors.", example: "Campaign Manager Pro: $99/month. Everything those agencies charge $5k for, automated." },
      { label: "Value Stacking", description: "List every component's individual value before the bundle price.", example: "DAM ($297 value) + Copy Vault ($197 value) + Analytics ($147 value) + Email Sequences ($197 value) = $838 value. Your price: $99/month." },
    ],
  },
  {
    id: "future-pacing",
    acronym: "FUTURE PACING",
    name: "Transformation Visualization",
    category: "Psychological Triggers",
    tagline: "Guides the reader to vividly imagine life after the transformation.",
    bestFor: "Sales page closing sections, webinar closes, high-ticket pitch decks",
    complexity: "Intermediate",
    structure: [
      { label: "Time Jump", description: "Transport them forward in time — be specific.", example: "Picture yourself 30 days from now." },
      { label: "New Reality Detail", description: "Describe their transformed daily experience in sensory detail.", example: "You open your laptop. One dashboard. Your campaigns are live across Meta, Pinterest, and TikTok — all perfectly formatted, all tracking correctly." },
      { label: "Emotional State", description: "Name the feeling, not just the outcome.", example: "No more chaos. No more second-guessing. Just clarity — and your first profitable month behind you." },
      { label: "Return + Bridge", description: "Bring them back to the present and show the first step.", example: "That's 30 days away. The first step is 10 minutes. Start your free trial →" },
    ],
    psychPrinciple: "Mental Simulation: The brain processes imagined future experiences similarly to real ones. Future pacing makes the transformation feel like a memory, not a promise.",
  },
  {
    id: "objection-preemption",
    acronym: "OBJECTION PREEMPTION",
    name: "Top 3 Objections Answered Before Asked",
    category: "Psychological Triggers",
    tagline: "Identifies and answers top objections before they're raised — saves mental labor.",
    bestFor: "Sales pages, checkout pages, sales email sequences, webinar Q&A sections",
    complexity: "Intermediate",
    structure: [
      { label: "Identify Top 3 Objections", description: "Survey customers, review support tickets, or poll your list for the real blockers.", example: "1. 'Is this for beginners?' 2. 'I don't have time to learn a new tool.' 3. 'What if it doesn't work for my niche?'" },
      { label: "Answer Each Preemptively", description: "Address each objection before the reader asks it — cite proof or demonstration.", example: "'Is this for beginners?' → Our 10-minute wizard guides you through the entire setup. 947 first-time marketers launched their first campaign in under 15 minutes last month." },
      { label: "Objection-to-Benefit Flip", description: "Transform the objection into a selling point.", example: "'New tool to learn' → We built it specifically so you'd never have to manage 6 other tools again. This replaces learning, not adds to it." },
      { label: "Residual Anxiety Close", description: "Acknowledge any remaining doubt and address it with your guarantee.", example: "Still uncertain? Our 30-day full refund policy means you have zero risk testing this." },
    ],
    appTip: "Add your top 3 objections to the Brand Vault. Your AI Co-Pilot can then preempt them automatically in every piece of copy it generates.",
  },
  {
    id: "momentum-stacking",
    acronym: "MOMENTUM STACKING",
    name: "Micro-Win → Commitment → Conversion",
    category: "Psychological Triggers",
    tagline: "Builds trust through small wins that lead incrementally to the core conversion.",
    bestFor: "Email welcome sequences, onboarding flows, webinar funnels, community growth",
    complexity: "Advanced",
    structure: [
      { label: "Micro-Win 1 (Day 0–1)", description: "Deliver an immediate, actionable win within the first interaction.", example: "Day 0: Free aspect ratio cheat sheet. Immediate practical value." },
      { label: "Micro-Win 2 (Day 2–3)", description: "Slightly larger win that requires minor engagement.", example: "Day 2: Free campaign planning worksheet. Takes 15 minutes — delivers real strategy." },
      { label: "Investment Request", description: "Once they've succeeded twice, invite them into a slightly deeper commitment.", example: "Day 4: 'You've already started — want to see the full system that automates all of this?'" },
      { label: "Conversion", description: "The offer now feels like a natural progression of wins, not a cold ask.", example: "Day 5: Free trial offer. They've already won twice. The trial is the next micro-win." },
    ],
    psychPrinciple: "Commitment & Consistency + Progress Effect: Each small commitment makes the next one easier. People feel invested and continue to validate past decisions through forward action.",
  },
];

// ─── Category Config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<FrameworkCategory, { icon: React.ElementType; color: string; bg: string; border: string; badge: string }> = {
  "Direct Response & Paid Ads": { icon: Zap, color: "text-amber-400", bg: "bg-amber-950/50", border: "border-amber-800/50", badge: "bg-amber-950 text-amber-300 border-amber-800/40" },
  "Email Marketing & Nurture": { icon: Mail, color: "text-sky-400", bg: "bg-sky-950/50", border: "border-sky-800/50", badge: "bg-sky-950 text-sky-300 border-sky-800/40" },
  "Landing Pages & Sales Pages": { icon: FileText, color: "text-violet-400", bg: "bg-violet-950/50", border: "border-violet-800/50", badge: "bg-violet-950 text-violet-300 border-violet-800/40" },
  "Social Media Organic": { icon: Share2, color: "text-rose-400", bg: "bg-rose-950/50", border: "border-rose-800/50", badge: "bg-rose-950 text-rose-300 border-rose-800/40" },
  "Brand Voice & Messaging": { icon: Mic, color: "text-emerald-400", bg: "bg-emerald-950/50", border: "border-emerald-800/50", badge: "bg-emerald-950 text-emerald-300 border-emerald-800/40" },
  "Psychological Triggers": { icon: Brain, color: "text-purple-400", bg: "bg-purple-950/50", border: "border-purple-800/50", badge: "bg-purple-950 text-purple-300 border-purple-800/40" },
};

const COMPLEXITY_CONFIG: Record<string, { color: string; dot: string }> = {
  Beginner: { color: "text-emerald-400", dot: "bg-emerald-400" },
  Intermediate: { color: "text-amber-400", dot: "bg-amber-400" },
  Advanced: { color: "text-rose-400", dot: "bg-rose-400" },
};

// ─── Framework Card ───────────────────────────────────────────────────────────
const FrameworkCard: React.FC<{ fw: CopyFramework }> = ({ fw }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedStep, setCopiedStep] = useState<string | null>(null);
  const catConfig = CATEGORY_CONFIG[fw.category];
  const complexConfig = COMPLEXITY_CONFIG[fw.complexity];
  const CatIcon = catConfig.icon;

  const copyStep = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(id);
    setTimeout(() => setCopiedStep(null), 1500);
  };

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isExpanded ? `${catConfig.bg} ${catConfig.border} shadow-xl` : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left flex items-start justify-between gap-3"
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className={`p-2 rounded-xl ${catConfig.bg} border ${catConfig.border} shrink-0`}>
            <CatIcon className={`w-4 h-4 ${catConfig.color}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-mono font-extrabold text-sm ${catConfig.color}`}>{fw.acronym}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${complexConfig.color} border-slate-700 bg-slate-900 flex items-center gap-1`}>
                <span className={`w-1.5 h-1.5 rounded-full ${complexConfig.dot}`} />
                {fw.complexity}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{fw.name}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{fw.tagline}</div>
          </div>
        </div>
        <div className="shrink-0 mt-1">
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-5 border-t border-slate-800/60 pt-4">
          {/* Best For */}
          <div className="flex items-start gap-2 text-xs">
            <Target className={`w-3.5 h-3.5 ${catConfig.color} shrink-0 mt-0.5`} />
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">Best For</span>
              <span className="text-slate-200">{fw.bestFor}</span>
            </div>
          </div>

          {/* Structure Steps */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3 h-3" /> Framework Structure:
            </div>
            {fw.structure.map((step, idx) => (
              <div key={step.label} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full ${catConfig.bg} border ${catConfig.border} flex items-center justify-center text-[10px] font-bold ${catConfig.color}`}>
                        {idx + 1}
                      </span>
                      <span className={`text-xs font-extrabold ${catConfig.color} font-mono`}>{step.label}</span>
                    </div>
                    <button
                      onClick={() => copyStep(step.example, `${fw.id}-${idx}`)}
                      className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                      title="Copy example"
                    >
                      {copiedStep === `${fw.id}-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{step.description}</p>
                  <div className="text-[11px] text-slate-200 bg-slate-950 border border-slate-700/60 rounded-lg px-3 py-2 italic leading-relaxed">
                    "{step.example}"
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Psych Principle */}
          {fw.psychPrinciple && (
            <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-3.5 flex items-start gap-2 text-xs">
              <Brain className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block mb-0.5">Psychological Principle</span>
                <span className="text-purple-200">{fw.psychPrinciple}</span>
              </div>
            </div>
          )}

          {/* App Tip */}
          {fw.appTip && (
            <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3.5 flex items-start gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block mb-0.5">App Feature / AI Integration</span>
                <span className="text-amber-200">{fw.appTip}</span>
              </div>
            </div>
          )}

          {/* Pro Tip */}
          {fw.proTip && (
            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3.5 flex items-start gap-2 text-xs">
              <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-0.5">Pro Tip</span>
                <span className="text-emerald-200">{fw.proTip}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Headline Grader (4 U's Tool) ────────────────────────────────────────────
const HeadlineGrader: React.FC = () => {
  const [headline, setHeadline] = useState("");
  const [scores, setScores] = useState({ urgent: 0, unique: 0, ultraSpecific: 0, useful: 0 });

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const grade = total === 4 ? { label: "🏆 Gold: Test immediately", color: "text-amber-400" }
    : total === 3 ? { label: "✅ Strong: Worth split testing", color: "text-emerald-400" }
    : total === 2 ? { label: "⚠️ Moderate: Needs one more U", color: "text-amber-400" }
    : { label: "❌ Weak: Rewrite before spending", color: "text-rose-400" };

  const toggleScore = (key: keyof typeof scores) => setScores(s => ({ ...s, [key]: s[key] === 1 ? 0 : 1 }));

  return (
    <div className="bg-slate-900 border border-amber-800/40 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Star className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-bold text-slate-100">4 U's Headline Grader</span>
        <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded font-mono ml-auto">Score: {total}/4</span>
      </div>

      <input
        type="text"
        placeholder="Paste your headline here to grade it..."
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500"
      />

      <div className="grid grid-cols-2 gap-2.5">
        {(["urgent", "unique", "ultraSpecific", "useful"] as const).map((key) => {
          const labels = { urgent: "⏰ Urgent", unique: "🏆 Unique", ultraSpecific: "📊 Ultra-Specific", useful: "💡 Useful" };
          const descriptions = {
            urgent: "Creates a reason to act NOW",
            unique: "Competitors can't claim this",
            ultraSpecific: "Contains a number or data point",
            useful: "Reader knows what's in it for them",
          };
          const isOn = scores[key] === 1;
          return (
            <button
              key={key}
              onClick={() => toggleScore(key)}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${isOn ? "bg-amber-950/70 border-amber-700 shadow-md" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}
            >
              <div className={`font-bold ${isOn ? "text-amber-300" : "text-slate-300"}`}>{labels[key]}</div>
              <div className={`text-[10px] mt-0.5 ${isOn ? "text-amber-400/80" : "text-slate-500"}`}>{descriptions[key]}</div>
              <div className={`mt-1.5 text-[10px] font-bold ${isOn ? "text-emerald-400" : "text-slate-600"}`}>{isOn ? "✓ PASS" : "○ Not yet"}</div>
            </button>
          );
        })}
      </div>

      {headline && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
          <div className={`text-sm font-bold ${grade.color}`}>{grade.label}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {total < 2 && "Try adding a specific number and a reason to act today."}
            {total === 2 && "Add either a unique mechanism or a specific urgency trigger."}
            {total === 3 && "One more U will make this a winner. Which is weakest?"}
            {total === 4 && "All 4 U's present — this headline is ready to test on paid traffic."}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const CopywritingFrameworks: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FrameworkCategory | "All">("All");
  const [selectedComplexity, setSelectedComplexity] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"library" | "grader">("library");

  const categories = ["All", ...Object.keys(CATEGORY_CONFIG)] as (FrameworkCategory | "All")[];

  const filtered = allFrameworks.filter((fw) => {
    const matchCat = selectedCategory === "All" || fw.category === selectedCategory;
    const matchComplex = selectedComplexity === "All" || fw.complexity === selectedComplexity;
    const matchSearch = !searchQuery ||
      fw.acronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fw.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fw.bestFor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchComplex && matchSearch;
  });

  const categoryCounts = Object.keys(CATEGORY_CONFIG).reduce((acc, cat) => {
    acc[cat] = allFrameworks.filter(fw => fw.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-slate-100">Copywriting Frameworks Master Library</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {allFrameworks.length}+ battle-tested frameworks across 6 categories: Paid Ads, Email, Sales Pages, Social, Brand Voice & Psych Triggers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("library")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeView === "library" ? "bg-purple-600 text-white" : "bg-slate-950 border border-slate-700 text-slate-300 hover:text-white"}`}
          >
            📚 Framework Library
          </button>
          <button
            onClick={() => setActiveView("grader")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeView === "grader" ? "bg-amber-600 text-white" : "bg-slate-950 border border-slate-700 text-slate-300 hover:text-white"}`}
          >
            ⭐ 4 U's Headline Grader
          </button>
        </div>
      </div>

      {/* Category Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(Object.entries(CATEGORY_CONFIG) as [FrameworkCategory, typeof CATEGORY_CONFIG[FrameworkCategory]][]).map(([cat, config]) => {
          const CatIcon = config.icon;
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(isActive ? "All" : cat); setActiveView("library"); }}
              className={`p-3 rounded-2xl border text-left transition-all ${isActive ? `${config.bg} ${config.border} shadow-lg` : "bg-slate-900 border-slate-800 hover:border-slate-700"}`}
            >
              <CatIcon className={`w-4 h-4 ${config.color} mb-2`} />
              <div className="text-[10px] font-bold text-slate-200 leading-tight">{cat}</div>
              <div className={`text-lg font-extrabold mt-1 ${config.color}`}>{categoryCounts[cat]}</div>
              <div className="text-[9px] text-slate-500">frameworks</div>
            </button>
          );
        })}
      </div>

      {activeView === "grader" ? (
        <HeadlineGrader />
      ) : (
        <>
          {/* Filters */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={`Search ${allFrameworks.length} frameworks...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2">
              {["All", "Beginner", "Intermediate", "Advanced"].map((level) => {
                const cfg = level !== "All" ? COMPLEXITY_CONFIG[level] : null;
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedComplexity(level)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${selectedComplexity === level ? "bg-purple-600 text-white" : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"}`}
                  >
                    {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                    {level}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-500 shrink-0">
              {filtered.length} of {allFrameworks.length} shown
            </div>
          </div>

          {/* Framework Grid */}
          {selectedCategory === "All" && !searchQuery && selectedComplexity === "All" ? (
            // Grouped by category when no filters active
            <div className="space-y-8">
              {(Object.keys(CATEGORY_CONFIG) as FrameworkCategory[]).map((cat) => {
                const catFrameworks = allFrameworks.filter(fw => fw.category === cat);
                const catConfig = CATEGORY_CONFIG[cat];
                const CatIcon = catConfig.icon;
                return (
                  <div key={cat} className="space-y-3">
                    <div className={`flex items-center gap-3 p-4 rounded-2xl border ${catConfig.bg} ${catConfig.border}`}>
                      <CatIcon className={`w-5 h-5 ${catConfig.color}`} />
                      <div>
                        <div className={`text-sm font-bold ${catConfig.color}`}>{cat}</div>
                        <div className="text-[11px] text-slate-400">{catFrameworks.length} frameworks — click any to expand</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {catFrameworks.map(fw => <FrameworkCard key={fw.id} fw={fw} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Flat filtered grid
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {filtered.length > 0 ? (
                filtered.map(fw => <FrameworkCard key={fw.id} fw={fw} />)
              ) : (
                <div className="col-span-2 text-center py-16 text-slate-500">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <div className="text-sm font-semibold">No frameworks match your filters</div>
                  <div className="text-xs mt-1">Try clearing the search or switching category</div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
