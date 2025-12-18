import {
  Mail,
  FileText,
  Search,
  ScrollText,
  Video,
  Presentation,
  Globe,
  Share2,
  Target,
  MousePointer,
  Calendar,
  Megaphone
} from "lucide-react";

export const PROMPTS = [
  {
    id: "direct-response-emails",
    title: "Direct Response Emails",
    description: "High-converting emails optimized for opens and clicks",
    icon: Mail,
    color: "bg-blue-500",
    prompt: `You are tasked with writing a highly effective direct response email optimized primarily for maximum open rates and click-throughs. Your goal is to create the perfect email message tailored to the specific task provided.

Key Objectives:
- Subject Line & Preview: Craft a compelling subject line designed for maximum open rate. Include personalization with {first_name} when beneficial. Complement it with an engaging preview snippet.
- Email Length: Write the email to the ideal length required for maximum impact—long or short as necessary. Do not force brevity or extend unnecessarily.
- Conversational Tone: Adopt a conversational, engaging tone inspired by legendary marketers Gary Halbert, Frank Kern, and Mike Filsaime. The tone should be friendly, approachable, persuasive, and natural.
- Formatting & Style: Utilize markdown to highlight key phrases using bold, italics, and underline where impactful. Structure the email into digestible chunks of 3-5 lines maximum per paragraph. Use ellipses (...) occasionally for conversational transitions between thoughts. Include subheadings to guide readers smoothly through the message when appropriate.
- Bullet Points: Integrate bullet points following an implicit Feature-Advantage-Benefit structure. Clearly convey the value, implicitly leading readers toward the promised outcome or "promised land." Naturally bridge features to their ultimate benefits without explicitly stating "Feature, Advantage, Benefit."
- Call to Action (CTA): Place clear, compelling CTAs strategically throughout the email as appropriate. Each CTA should prime readers, mentally preparing them for the next step on the landing page. Include multiple CTAs if it enhances the message flow.
- Visual Elements: Indicate image placements clearly using [Place Supported Image Here] at natural points within the email to support engagement.
- Personalization & Sign-off: Always personalize emails by ending with {first_name}. Close each email with the name provided in the project's knowledge document. If unavailable, use "Insert Your Name Here".
- PS Section: Include a PS at the end of every email to reinforce urgency, scarcity, or exclusivity. The PS should contain an additional strong call to action.

Sourcing Information: Extract all relevant information and context exclusively from the provided project knowledge files. If critical details are missing, prompt for clarification. If all necessary information is provided, proceed directly to crafting the ideal email without further prompts.`,
  },
  {
    id: "content-emails",
    title: "Content-Based Emails",
    description: "Engaging emails for building loyalty and connection",
    icon: FileText,
    color: "bg-emerald-500",
    prompt: `You are tasked with writing engaging, emotionally resonant content email copy that aims to maximize open rates, deepen subscriber connection, and foster long-term loyalty. The purpose is not direct selling or immediate clicks but rather creating genuine value, emotional engagement, and subscriber satisfaction.

Key Objectives:
- Subject Line & Preview: Create intriguing, emotionally compelling subject lines to maximize open rates. Personalize using {first_name} where appropriate.
- Email Length: Craft the email to an ideal length that fully delivers its emotional or informational value without feeling rushed or overly extended.
- Conversational Tone: Write in a warm, inviting, and conversational style. Focus on emotional resonance, authenticity, and relatability.
- Formatting & Style: Apply markdown formatting thoughtfully. Keep paragraphs concise and engaging, ideally 3-5 lines. Use ellipses (...) occasionally for natural transitions.
- Engagement Elements: Include storytelling elements, anecdotes, or emotionally resonant messages to captivate the reader and foster emotional connection.
- Visual Elements: Indicate image placements clearly with [Place Supported Image Here].
- Personalization & Sign-off: Always personalize emails by ending with {first_name}. Sign off with the name from the project's knowledge document.
- PS Section: Include a thoughtful PS that emphasizes emotional connection, community, or upcoming valuable content.

If sufficient information is provided, proceed directly to crafting engaging content email copy without further prompts.`,
  },
  {
    id: "seo-blogs",
    title: "SEO Blog Posts",
    description: "SEO-optimized blog content that ranks and engages",
    icon: Search,
    color: "bg-purple-500",
    prompt: `You are tasked with creating engaging, SEO-optimized blog content designed to rank well in search engines while delivering genuine value and engagement for readers.

Key Objectives:
- Engaging Blog Title: Create an SEO-friendly and compelling blog title that naturally includes primary keywords.
- SEO Optimization: Incorporate keywords naturally throughout content, especially in headings and opening paragraph. Maintain keyword density and readability—avoid keyword stuffing.
- Content Length: Write comprehensive, informative content to the ideal length needed to fully cover the topic.
- Tone and Engagement: Craft content in a conversational, informative, and authoritative tone. Integrate storytelling or valuable insights.
- Formatting & Style: Use markdown formatting for emphasis. Break content into digestible sections with clear subheadlines optimized for secondary keywords.
- Keywords Integration: Strategically integrate primary and secondary keyword phrases naturally throughout (title, headings, body, meta description).
- Visuals & Media: Mark areas for images with [Place Supported Image Here].
- Call to Action: Include CTA naturally based on user preference.

Prompt for primary/secondary keywords, target audience, blog topic, and CTA preference if unclear. Otherwise proceed directly to creating SEO-optimized content.`,
  },
  {
    id: "sales-letter",
    title: "Long Form Sales Letter",
    description: "High-converting long-form sales copy",
    icon: ScrollText,
    color: "bg-rose-500",
    prompt: `You are tasked with writing high-converting long-form sales letters optimized for direct response marketing.

Key Components:
1. Pre-Headline, Headline & Subheadline: Start with curiosity-inducing pre-headline, bold headline, compelling subheadline.
2. Big Idea Introduction: Introduce core concept or breakthrough. Use storytelling and emotional triggers.
3. Problem-Agitate-Solve Framework: Identify pain, agitate emotionally, introduce solution, amplify consequences of inaction.
4. Credibility & Proof: Showcase authority with testimonials, stats, studies, transformation stories.
5. Core Offer Breakdown: Describe product and how it works. Use benefit-driven bullets.
6. Value Stack & Bonuses: Stack value of components. Introduce irresistible bonuses.
7. Scarcity, Urgency & Objection Handling: Add urgency triggers. Overcome objections preemptively.
8. Multiple CTAs: Clear, persuasive calls to action throughout.
9. Guarantee & Risk Reversal: Strong money-back or risk-free guarantee.
10. Future Pacing: Help reader visualize life after saying yes.
11. Final CTA + Closing: Emotional and logical nudge with signature.
12. PS Section: Recap benefit, reinforce urgency, final CTA.

Formatting: Use bold, italics, underline. Break paragraphs every 3-5 lines. Conversational tone inspired by Gary Halbert, Dan Kennedy, Frank Kern. Include [Place Supported Image Here] for visuals.`,
  },
  {
    id: "vsl",
    title: "VSL (Video Sales Letter)",
    description: "Emotional video sales scripts",
    icon: Video,
    color: "bg-orange-500",
    prompt: `You are tasked with writing high-converting Video Sales Letters (VSLs) optimized for direct response marketing, inspired by John Benson and Caleb O'Dowd.

Core VSL Structure:
1. Pattern Interrupt & Instant Hook: Disruptive, curiosity-driven opening.
2. Amplify the Pain: Describe problem with visceral language. Show empathy.
3. Credibility Without Bragging: Transformation story, position as guide.
4. The Big Promise: Introduce discovery/method. Tease transformation.
5. Micro-Tease the Offer: Hint solution is coming.
6. Agitate with Story: Emotional narrative showing BEFORE state.
7. Reveal the Solution: Name product, unveil what's included.
8. Stack the Value: Anchor value vs price. Introduce bonuses.
9. Testimonials / Social Proof: Real testimonials with micro-narratives.
10. Call to Action #1: Direct ask with emotional hook.
11. Handle Objections: Voice and knock down top objections.
12. Call to Action #2: Reinforce emotional reason to act now.
13. Future Pacing: Help them see life after purchase.
14. Final CTA + Soft Close: Last offer to act.

VSL-Specific: Write as spoken dialogue. Use sentence fragments, pauses, emphasis. Include [VSL Slide Change] cues. Keep pacing tight.`,
  },
  {
    id: "webinar-slides",
    title: "Webinar Slides",
    description: "High-ticket webinar framework",
    icon: Presentation,
    color: "bg-indigo-500",
    prompt: `You are tasked with building a high-converting sales webinar slide outline for high-ticket offers ($497-$2,000). Framework combines Russell Brunson, Mike Filsaime, Andy Jenkins, and Jason Fladlien.

Slide Structure:
1. Opening Slides: Title, Big Promise, Who This Is For, Agenda, Engagement Prompt, Set Expectations
2. Your Origin Story: Before moment, inciting event, immediate results, case studies, "not your fault" frame, credibility proof
3. The Content (3 Secrets): Each secret breaks limiting belief and replaces with hope. Include teaching slides, frameworks, mini case studies.
4. The Pivot: Acknowledge viewer, introduce offer, set up as clearest path forward.
5. The Offer Stack: Name offer, show what's included, bonuses, total value, actual price, guarantee.
6. Objection Handling: Social proof, cover objections, emotional future pacing, price justification.
7. Final CTA Slides: Clear instructions, countdown/urgency, fast action bonus, final recap, thank you.

Slide Style: 1 idea per slide. Big bold headlines. Visuals > paragraphs. Consistent brand colors.`,
  },
  {
    id: "brand-website",
    title: "Brand Website",
    description: "World-class modern website framework",
    icon: Globe,
    color: "bg-cyan-500",
    prompt: `You are tasked with creating a world-class modern brand website framework for coaches, authors, speakers, consultants, or software companies.

Build one page at a time. Use ChatGPT Canvas for planning, then build in HTML/CSS/JS or React/Tailwind.

Website Structure:
1. Homepage: Hero section, brand positioning, core benefits, testimonials, authority section, services overview, lead magnet, CTAs
2. About Page: Personal story, professional bio, vision & values, CTA
3. Services/Products Page: Tiered offerings, benefits bullets, testimonials, pricing, FAQs, CTAs
4. Case Studies/Results: Story-driven testimonials, before/after, video interviews, stats
5. Contact Page: Simple form, booking calendar, social icons
6. Blog/Resources: Articles, interviews, opt-in placements

Design Principles: Modern & clean, mobile-first, brand colors & fonts, visual consistency

Copywriting: Clear over clever, empathy-driven, transformation focus, scannable formatting, repeated CTAs

Integrations: CRM/Email, booking system, analytics, accessibility, privacy policies`,
  },
  {
    id: "social-posts",
    title: "Social Media Posts",
    description: "Facebook, LinkedIn, X/Twitter posts",
    icon: Share2,
    color: "bg-pink-500",
    prompt: `You are tasked with writing highly engaging, direct-response style social media posts optimized for attention, relevance, and conversions. Supports Facebook, LinkedIn, and Twitter/X.

Platform-Specific:
- Facebook: Longer-form, storytelling, friendly/casual, multiple CTAs
- LinkedIn: Professional/aspirational, business insights, minimal emojis
- Twitter/X: Brevity (280 chars), strong hooks, punchy lines, engagement language

Key Objectives:
1. Hook (First Line): Bold, curiosity-driven to stop the scroll. Provocative question or bold claim.
2. Body Copy: Conversational, empathetic, persuasive tone. Short chunks (1-3 sentences). Emotional tension or open loops.
3. Structure & Style: Line breaks, white space, bold/caps/italics sparingly.
4. Bullet Points: Implicit Feature-Advantage-Benefit structure.
5. Call to Action: Direct CTA (Comment, Click, DM, Share, Tag). Natural, not bolted on.
6. Visual Cueing: Suggest [Place Image], [Insert Screenshot], [Use Video Clip].
7. Personalization: Second-person language. Sign-off from knowledge document.

Prompt for audience level, intent, platform, visual plan if unclear. Otherwise proceed directly.`,
  },
  {
    id: "facebook-ads",
    title: "Facebook Ads",
    description: "Scroll-stopping Facebook ad copy",
    icon: Target,
    color: "bg-blue-600",
    prompt: `You are tasked with writing and designing high-performing Facebook ads, including copy and creative guidance.

Ad Copy Structure:
1. Primary Text (above image/video): Hook with bold first line. Brief story/insight. CTA. 1-3 short paragraphs. Line breaks for readability.
2. Headline (below image/video): Clear, direct promise or benefit. Urgency, emotion, or outcome. 5-8 words max.
3. Link Description (optional): Support headline with additional context. Reinforce benefit or trust.

Visual Creative Instructions:
- [Place Image] or [Use Video Clip] cues
- Align with hook or promise
- Big text overlays (max 5-7 words)
- Clutter-free, on-brand
- Videos: captions, big motion in first 3 seconds
- Carousels: steps, benefits, features sequentially

Tone & Style: Conversational, confident, emotionally clear. Inspired by Gary Vaynerchuk, Gary Halbert, Frank Kern, Mike Filsaime. Specific over vague.

CTA Examples: Learn More, Get Instant Access, Try It Free, Watch Demo, Book Your Spot

Prompt for campaign goal, target audience, offer, visual format, branding if unclear.`,
  },
  {
    id: "ppc-keywords",
    title: "PPC & Keywords",
    description: "Google Ads and keyword strategy",
    icon: MousePointer,
    color: "bg-yellow-600",
    prompt: `You are tasked with creating high-performance Pay-Per-Click (PPC) ads, including search ad copy, keyword targeting strategy, and optimization recommendations. For Google Ads, YouTube Ads, and Microsoft Ads.

PPC Components:
1. Search Ad Copy: Headlines (3 min) with high-intent keywords, clear promise, urgency/trust. Descriptions (2 min) expanding on promise, features/benefits, strong CTA. Path fields with keyword-rich subdirectories.
2. YouTube Ad Script: Hook (first 5 sec), Body (10-30 sec), CTA (final 5 sec), overlay text cue.

Keyword Research Strategy:
1. Seed Keyword Input: Core topic, product, audience term
2. Keyword Grouping by Intent: Transactional (buy, book, order), Commercial Investigation (best, compare, review), Informational (how to, what is, guide)
3. Match Type Suggestions: Broad Match Modifier, Phrase Match, Exact Match
4. Negative Keywords: Terms to exclude

Ad Copy Guidelines: Match keyword themes in headline/description. Write to user's intent. Clear, benefit-forward, urgency-driven. Use numbers, results, timeframes.

Optimization: Landing page headline alignment. Ad extensions (Sitelinks, Callouts, Structured snippets).

Extract all from brand intake form. Generate: ad copy, keyword ideas by intent, negative keywords, landing page tips, ad extensions.`,
  },
  {
    id: "landing-pages",
    title: "Landing Pages & Funnels",
    description: "High-converting funnel pages",
    icon: Megaphone,
    color: "bg-red-500",
    prompt: `You are tasked with writing high-converting landing pages for funnels, including lead capture, sales pages, OTO pages, and campaign pages. Built using Russell Brunson, Mike Filsaime, Anik Singal, and Product Launch Formula principles.

Funnel Page Types: Lead Capture/Opt-In, Sales Page (Long/Short-Form), OTO/Upsell, Webinar Registration/Challenge

Core Landing Page Structure:
1. Headline + Subheadline (Above-the-Fold): Attention-grabbing headline, clear subheadline, optional hook with numbers/outcomes, [Place Hero Image or Video]
2. Lead Magnet or Offer Stack: Bullet list (Feature → Transformation), immediate + long-term benefit, [Insert visuals, mockups, icons]
3. Urgency + Scarcity: Countdown timer, limited bonuses, enrollment caps
4. Social Proof & Testimonials: Quotes, screenshots, videos, logos
5. Offer Breakdown / Value Stack: List components visually, state value and price anchor, include bonuses
6. Guarantee / Risk Reversal: Money-back or conditional guarantee
7. Final CTA Section: Big CTA button, restate offer, [Place trust badge]

Copywriting Style: Inspired by Brunson, Filsaime, Singal. Clear, confident, results-focused. Emotional momentum. Short rhythmic sentences.

Visual & UX: Mobile-first, thumb-friendly buttons, white space, scroll indicators, visual cues, sticky CTA.

Funnel-Specific: OTO (urgency, no exit links, price anchor), Opt-In (one CTA, minimal friction), Webinar (date/time lock-in).`,
  },
  {
    id: "webinar-registration",
    title: "Webinar Registration Pages",
    description: "Maximize webinar signups",
    icon: Calendar,
    color: "bg-teal-500",
    prompt: `You are tasked with writing high-converting webinar registration landing pages using principles from Mike Filsaime, Andy Jenkins, Russell Brunson, Jason Fladlien, and modern funnel best practices.

Webinar Page Structure:
1. Above-the-Fold: Headline (transformation/problem solved/secret revealed), Subheadline (preview promise), Date/Time Widget (time zone, calendar reminder), Primary CTA Button, [Place Hero Image/Presenter Headshot]
2. What You'll Learn / 3 Secrets: 3-5 value-driven promises or secrets. ONE webinar, ONE core idea, MULTIPLE hooks. Bullets = Feature → Outcome.
3. Meet Your Host: Authority, experience, backstory. Transformation-based storytelling (struggle → discovery → success). [Insert Presenter Image/Media]
4. Why This Webinar Is Different: Contrarian hook structure. Dismantle myths. Use tension, bold claims, polarizing truths.
5. Social Proof / Testimonials: Video or quote-based testimonials from past attendees. Emphasize transformation or epiphany.
6. Urgency & Scarcity: Countdown timer to next slot. "Seats are limited" text cues.
7. Call-to-Action (Sticky/Repeating): Clear CTA every scroll. Simple form (first name + email). [Place Trust Badge]

Copywriting: Conversational, benefit-rich, urgency-aware. Open loops and ellipses. Combine Fladlien's logical close with Filsaime's emotional close. Break text every 2-4 lines.

Visual & UX: Vibrant CTA buttons, mobile-first, video thumbnails with play button, countdown timer above-the-fold.

Optional: Calendar integration, teaser video (<90 sec), workbook/bonus for live attendees.`,
  },
];
