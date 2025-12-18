/**
 * Seed ALL Content Templates to Database
 * This includes all 48+ templates for comprehensive content creation
 * 
 * Usage: MONGODB_URI="your-uri" node scripts/seed-all-templates.js
 */

// Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');

// Content Template Schema
const ContentTemplateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    category: { type: String, required: true },
    subcategory: String,
    icon: String,
    systemPrompt: { type: String, required: true },
    inputs: [{
        label: { type: String, required: true },
        variableName: { type: String, required: true },
        type: { type: String, enum: ['text', 'textarea', 'select', 'number'], default: 'text' },
        placeholder: String,
        options: [String],
        required: { type: Boolean, default: true }
    }],
    isActive: { type: Boolean, default: true },
    isPremium: { type: Boolean, default: false },
}, { timestamps: true });

const ContentTemplate = mongoose.models.ContentTemplate || mongoose.model('ContentTemplate', ContentTemplateSchema);

// ALL Content Templates
const allTemplates = [
    // WRITTEN CONTENT - Blog & Article Types
    {
        name: "Blog Post",
        slug: "blog-post",
        description: "Standard blog post covering a specific topic.",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "FileText",
        systemPrompt: "Write a comprehensive blog post about {topic} for {audience}. Tone: {tone}. Include SEO keywords: {keywords}. Make it engaging and informative.",
        inputs: [
            { label: "Topic", variableName: "topic", type: "text", required: true, placeholder: "Blog topic" },
            { label: "Target Audience", variableName: "audience", type: "text", required: true, placeholder: "Who is this for?" },
            { label: "Tone", variableName: "tone", type: "select", required: false, options: ["Professional", "Casual", "Friendly", "Authoritative"] },
            { label: "Keywords", variableName: "keywords", type: "text", required: false, placeholder: "SEO keywords" },
        ],
        isActive: true,
    },
    {
        name: "How-to Guide",
        slug: "how-to-guide",
        description: "Step-by-step instructional content.",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "BookOpen",
        systemPrompt: "Create a detailed how-to guide on {topic}. Include clear steps, tips, and best practices for {audience}.",
        inputs: [
            { label: "Topic", variableName: "topic", type: "text", required: true, placeholder: "What to teach" },
            { label: "Target Audience", variableName: "audience", type: "text", required: true, placeholder: "Skill level" },
        ],
        isActive: true,
    },
    {
        name: "List Post",
        slug: "list-post",
        description: "Top 10, Best of, or numbered list format.",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "List",
        systemPrompt: "Create a list post: '{title}' with {count} items. Make each item valuable and actionable for {audience}.",
        inputs: [
            { label: "List Title", variableName: "title", type: "text", required: true, placeholder: "e.g., Top 10 Ways to..." },
            { label: "Number of Items", variableName: "count", type: "number", required: true, placeholder: "10" },
            { label: "Target Audience", variableName: "audience", type: "text", required: false, placeholder: "Who is this for?" },
        ],
        isActive: true,
    },
    {
        name: "Ultimate Guide",
        slug: "ultimate-guide",
        description: "The definitive resource on a topic.",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "BookMarked",
        systemPrompt: "Write the ultimate guide to {topic}. Cover everything from basics to advanced. Target audience: {audience}. Make it comprehensive and authoritative.",
        inputs: [
            { label: "Topic", variableName: "topic", type: "text", required: true, placeholder: "Main topic" },
            { label: "Target Audience", variableName: "audience", type: "text", required: true, placeholder: "Experience level" },
        ],
        isActive: true,
    },
    {
        name: "Beginner's Guide",
        slug: "beginners-guide",
        description: "Introductory content for novices.",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "GraduationCap",
        systemPrompt: "Create a beginner-friendly guide to {topic}. Explain concepts simply, avoid jargon, and include examples.",
        inputs: [
            { label: "Topic", variableName: "topic", type: "text", required: true, placeholder: "What to introduce" },
        ],
        isActive: true,
    },
    {
        name: "Case Study",
        slug: "case-study",
        description: "Real-world example of success or failure.",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "FileCheck",
        systemPrompt: "Write a case study about {subject}. Include: problem, solution, results, and key takeaways. Make it data-driven and compelling.",
        inputs: [
            { label: "Subject", variableName: "subject", type: "text", required: true, placeholder: "Company/project name" },
            { label: "Key Results", variableName: "results", type: "textarea", required: false, placeholder: "Main outcomes" },
        ],
        isActive: true,
    },
    {
        name: "Comparison Post",
        slug: "comparison-post",
        description: "Comparing two or more products or concepts.",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "Scale",
        systemPrompt: "Create a detailed comparison between {option1} and {option2}. Include pros, cons, pricing, features, and recommendations for different use cases.",
        inputs: [
            { label: "Option 1", variableName: "option1", type: "text", required: true, placeholder: "First option" },
            { label: "Option 2", variableName: "option2", type: "text", required: true, placeholder: "Second option" },
        ],
        isActive: true,
    },
    {
        name: "Review Article",
        slug: "review-article",
        description: "Detailed review of a product or service.",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "Star",
        systemPrompt: "Write an honest, detailed review of {product}. Cover features, pros, cons, pricing, and who it's best for.",
        inputs: [
            { label: "Product/Service", variableName: "product", type: "text", required: true, placeholder: "What to review" },
        ],
        isActive: true,
    },
    {
        name: "Opinion Piece",
        slug: "opinion-piece",
        description: "Thought leadership and personal perspective.",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "MessageSquare",
        systemPrompt: "Write an opinion piece on {topic}. Present a clear viewpoint, back it with reasoning and examples. Be thought-provoking.",
        inputs: [
            { label: "Topic", variableName: "topic", type: "text", required: true, placeholder: "Your opinion on..." },
        ],
        isActive: true,
    },
    {
        name: "News Article",
        slug: "news-article",
        description: "Reporting on recent events or updates.",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "Newspaper",
        systemPrompt: "Write a news article about {event}. Include who, what, when, where, why, and how. Keep it factual and timely.",
        inputs: [
            { label: "Event/News", variableName: "event", type: "text", required: true, placeholder: "What happened" },
        ],
        isActive: true,
    },
    {
        name: "Long-form Article",
        slug: "long-form-article",
        description: "In-depth article (1500+ words) exploring a subject comprehensively.",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "FileText",
        systemPrompt: "Write a comprehensive long-form article (1500+ words) on {topic}. Include research, examples, data, and expert insights.",
        inputs: [
            { label: "Topic", variableName: "topic", type: "text", required: true, placeholder: "Deep dive topic" },
        ],
        isActive: true,
    },
    {
        name: "Short-form Article",
        slug: "short-form-article",
        description: "Quick, punchy update or opinion piece (under 500 words).",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "FileText",
        systemPrompt: "Write a concise article (under 500 words) on {topic}. Get straight to the point, be impactful.",
        inputs: [
            { label: "Topic", variableName: "topic", type: "text", required: true, placeholder: "Quick topic" },
        ],
        isActive: true,
    },
    {
        name: "Pillar Content",
        slug: "pillar-content",
        description: "Core content that supports a broader topic cluster.",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "Columns",
        systemPrompt: "Create pillar content for {topic}. This should be comprehensive, link to related subtopics, and serve as the main resource.",
        inputs: [
            { label: "Main Topic", variableName: "topic", type: "text", required: true, placeholder: "Pillar topic" },
        ],
        isActive: true,
    },
    {
        name: "Evergreen Content",
        slug: "evergreen-content",
        description: "Timeless content that remains relevant.",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "TreePine",
        systemPrompt: "Write evergreen content on {topic}. Focus on timeless principles and avoid time-sensitive references.",
        inputs: [
            { label: "Topic", variableName: "topic", type: "text", required: true, placeholder: "Timeless topic" },
        ],
        isActive: true,
    },
    {
        name: "Myth-busting Article",
        slug: "myth-busting-article",
        description: "Debunking common misconceptions.",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "AlertCircle",
        systemPrompt: "Write a myth-busting article about {topic}. Identify common myths, explain why they're wrong, and provide the truth.",
        inputs: [
            { label: "Topic/Industry", variableName: "topic", type: "text", required: true, placeholder: "What myths to bust" },
        ],
        isActive: true,
    },
    {
        name: "Future Trends",
        slug: "future-trends",
        description: "Predictive content about industry direction.",
        category: "Written Content",
        subcategory: "Blog & Article Types",
        icon: "TrendingUp",
        systemPrompt: "Write about future trends in {industry}. Predict upcoming changes, innovations, and what to prepare for.",
        inputs: [
            { label: "Industry", variableName: "industry", type: "text", required: true, placeholder: "Industry/field" },
        ],
        isActive: true,
    },

    // WRITTEN CONTENT - Sales & Persuasion
    {
        name: "Product Description",
        slug: "product-description",
        description: "Compelling copy for e-commerce products.",
        category: "Written Content",
        subcategory: "Sales & Persuasion",
        icon: "ShoppingBag",
        systemPrompt: "Write a compelling product description for {product}. Highlight benefits, features, and include a strong call-to-action. Target: {audience}.",
        inputs: [
            { label: "Product Name", variableName: "product", type: "text", required: true, placeholder: "Product name" },
            { label: "Key Features", variableName: "features", type: "textarea", required: false, placeholder: "Main features" },
            { label: "Target Audience", variableName: "audience", type: "text", required: false, placeholder: "Who buys this" },
        ],
        isActive: true,
    },
    {
        name: "Landing Page Copy",
        slug: "landing-page-copy",
        description: "High-converting text for landing pages.",
        category: "Written Content",
        subcategory: "Sales & Persuasion",
        icon: "Target",
        systemPrompt: "Write high-converting landing page copy for {product}. Include: headline, subheadline, benefits, features, social proof, and strong CTA. Target: {audience}.",
        inputs: [
            { label: "Product/Service", variableName: "product", type: "text", required: true, placeholder: "What you're selling" },
            { label: "Target Audience", variableName: "audience", type: "text", required: true, placeholder: "Who is this for" },
        ],
        isActive: true,
    },
    {
        name: "Sales Letter",
        slug: "sales-letter",
        description: "Direct response sales copy.",
        category: "Written Content",
        subcategory: "Sales & Persuasion",
        icon: "Mail",
        systemPrompt: "Write a persuasive sales letter for {product}. Use AIDA framework (Attention, Interest, Desire, Action). Target: {audience}.",
        inputs: [
            { label: "Product/Offer", variableName: "product", type: "text", required: true, placeholder: "What you're selling" },
            { label: "Target Audience", variableName: "audience", type: "text", required: true, placeholder: "Who to target" },
        ],
        isActive: true,
    },
    {
        name: "VSL Script",
        slug: "vsl-script",
        description: "Script for a Video Sales Letter.",
        category: "Written Content",
        subcategory: "Sales & Persuasion",
        icon: "Video",
        systemPrompt: "Write a Video Sales Letter script for {product}. Include hook, problem, solution, proof, and offer. Length: {duration}.",
        inputs: [
            { label: "Product/Offer", variableName: "product", type: "text", required: true, placeholder: "What you're selling" },
            { label: "Duration", variableName: "duration", type: "select", required: false, options: ["5 minutes", "10 minutes", "15 minutes", "20+ minutes"] },
        ],
        isActive: true,
    },
    {
        name: "Email Sequence",
        slug: "email-sequence",
        description: "A series of emails for a specific campaign.",
        category: "Written Content",
        subcategory: "Sales & Persuasion",
        icon: "Mail",
        systemPrompt: "Create a {count}-email sequence for {goal}. Each email should build on the previous, leading to {cta}.",
        inputs: [
            { label: "Goal/Purpose", variableName: "goal", type: "text", required: true, placeholder: "e.g., Product launch" },
            { label: "Number of Emails", variableName: "count", type: "number", required: true, placeholder: "5" },
            { label: "Final CTA", variableName: "cta", type: "text", required: false, placeholder: "What action to take" },
        ],
        isActive: true,
    },
    {
        name: "Testimonial Page",
        slug: "testimonial-page",
        description: "Curated customer success stories.",
        category: "Written Content",
        subcategory: "Sales & Persuasion",
        icon: "Quote",
        systemPrompt: "Create testimonial page copy for {product}. Frame customer success stories to highlight transformation and results.",
        inputs: [
            { label: "Product/Service", variableName: "product", type: "text", required: true, placeholder: "What customers used" },
        ],
        isActive: true,
    },
    {
        name: "Advertorial",
        slug: "advertorial",
        description: "Editorial content designed to sell.",
        category: "Written Content",
        subcategory: "Sales & Persuasion",
        icon: "Newspaper",
        systemPrompt: "Write an advertorial for {product}. Make it look like editorial content while subtly promoting the product.",
        inputs: [
            { label: "Product/Service", variableName: "product", type: "text", required: true, placeholder: "What to promote" },
        ],
        isActive: true,
    },

    // EMAIL CONTENT
    {
        name: "Welcome Email",
        slug: "welcome-email",
        description: "First email to new subscribers.",
        category: "Email Content",
        subcategory: "General",
        icon: "Mail",
        systemPrompt: "Write a warm welcome email for new subscribers to {brand}. Set expectations, provide value, and include next steps.",
        inputs: [
            { label: "Brand/Company", variableName: "brand", type: "text", required: true, placeholder: "Your brand name" },
        ],
        isActive: true,
    },
    {
        name: "Newsletter",
        slug: "newsletter",
        description: "Regular update for subscribers.",
        category: "Email Content",
        subcategory: "General",
        icon: "Mail",
        systemPrompt: "Create a newsletter about {topic} for {audience}. Include: headline, main content, links, and CTA.",
        inputs: [
            { label: "Topic/Theme", variableName: "topic", type: "text", required: true, placeholder: "This week's topic" },
            { label: "Audience", variableName: "audience", type: "text", required: false, placeholder: "Subscriber type" },
        ],
        isActive: true,
    },
    {
        name: "Promotional Email",
        slug: "promotional-email",
        description: "Direct offer or sale announcement.",
        category: "Email Content",
        subcategory: "General",
        icon: "Tag",
        systemPrompt: "Write a promotional email for {offer}. Create urgency, highlight benefits, and include clear CTA.",
        inputs: [
            { label: "Offer/Promotion", variableName: "offer", type: "text", required: true, placeholder: "What's on sale" },
        ],
        isActive: true,
    },
    {
        name: "Abandoned Cart Email",
        slug: "abandoned-cart-email",
        description: "Recover lost sales.",
        category: "Email Content",
        subcategory: "General",
        icon: "ShoppingCart",
        systemPrompt: "Write an abandoned cart recovery email. Remind about {product}, address objections, offer incentive if needed.",
        inputs: [
            { label: "Product Left Behind", variableName: "product", type: "text", required: true, placeholder: "Cart items" },
        ],
        isActive: true,
    },
    {
        name: "Re-engagement Email",
        slug: "re-engagement-email",
        description: "Win back inactive subscribers.",
        category: "Email Content",
        subcategory: "General",
        icon: "RefreshCw",
        systemPrompt: "Write a re-engagement email to win back inactive subscribers. Be friendly, offer value, ask for feedback.",
        inputs: [
            { label: "Brand/List", variableName: "brand", type: "text", required: true, placeholder: "Your brand" },
        ],
        isActive: true,
    },
    {
        name: "Onboarding Sequence",
        slug: "onboarding-sequence",
        description: "Series to get new users started.",
        category: "Email Content",
        subcategory: "General",
        icon: "UserPlus",
        systemPrompt: "Create an onboarding email sequence for {product}. Help new users get started, see value quickly, and become active.",
        inputs: [
            { label: "Product/Service", variableName: "product", type: "text", required: true, placeholder: "What they signed up for" },
        ],
        isActive: true,
    },
    {
        name: "Cold Outreach Email",
        slug: "cold-outreach-email",
        description: "First contact with a prospect.",
        category: "Email Content",
        subcategory: "General",
        icon: "Send",
        systemPrompt: "Write a cold outreach email to {prospect} about {offer}. Be personalized, provide value, and include soft CTA.",
        inputs: [
            { label: "Prospect Type", variableName: "prospect", type: "text", required: true, placeholder: "Who you're reaching" },
            { label: "Your Offer", variableName: "offer", type: "text", required: true, placeholder: "What you're offering" },
        ],
        isActive: true,
    },

    // SOCIAL MEDIA
    {
        name: "Social Media Post",
        slug: "social-media-post",
        description: "General post for FB, LinkedIn, etc.",
        category: "Social Media",
        subcategory: "Short-Form",
        icon: "Share2",
        systemPrompt: "Create a {platform} post about {topic}. Tone: {tone}. Include relevant hashtags and engagement hook.",
        inputs: [
            { label: "Platform", variableName: "platform", type: "select", required: true, options: ["Facebook", "Instagram", "Twitter", "LinkedIn"] },
            { label: "Topic", variableName: "topic", type: "text", required: true, placeholder: "What to post about" },
            { label: "Tone", variableName: "tone", type: "select", required: false, options: ["Professional", "Casual", "Funny", "Inspirational"] },
        ],
        isActive: true,
    },
    {
        name: "Instagram Caption",
        slug: "instagram-caption",
        description: "Engaging text for IG photos/reels.",
        category: "Social Media",
        subcategory: "Short-Form",
        icon: "Instagram",
        systemPrompt: "Write an Instagram caption for {content}. Include hook, value, and relevant hashtags. Keep it engaging.",
        inputs: [
            { label: "Content Description", variableName: "content", type: "text", required: true, placeholder: "What's in the post" },
        ],
        isActive: true,
    },
    {
        name: "LinkedIn Post",
        slug: "linkedin-post",
        description: "Professional update or insight.",
        category: "Social Media",
        subcategory: "Short-Form",
        icon: "Linkedin",
        systemPrompt: "Create a LinkedIn post about {topic}. Be professional, provide value, and encourage discussion.",
        inputs: [
            { label: "Topic/Insight", variableName: "topic", type: "text", required: true, placeholder: "Professional topic" },
        ],
        isActive: true,
    },
    {
        name: "Twitter/X Thread",
        slug: "twitter-thread",
        description: "Multi-tweet story or lesson.",
        category: "Social Media",
        subcategory: "Short-Form",
        icon: "Twitter",
        systemPrompt: "Create a Twitter/X thread about {topic}. {count} tweets. Make each tweet valuable and connected.",
        inputs: [
            { label: "Topic", variableName: "topic", type: "text", required: true, placeholder: "Thread topic" },
            { label: "Number of Tweets", variableName: "count", type: "number", required: false, placeholder: "5" },
        ],
        isActive: true,
    },
    {
        name: "TikTok Caption",
        slug: "tiktok-caption",
        description: "Short, punchy text for video.",
        category: "Social Media",
        subcategory: "Short-Form",
        icon: "Music",
        systemPrompt: "Write a TikTok caption for {video}. Be catchy, use trending phrases, include hashtags.",
        inputs: [
            { label: "Video Description", variableName: "video", type: "text", required: true, placeholder: "What's in the video" },
        ],
        isActive: true,
    },
    {
        name: "Pinterest Pin Description",
        slug: "pinterest-pin",
        description: "SEO-optimized text for Pins.",
        category: "Social Media",
        subcategory: "Short-Form",
        icon: "Image",
        systemPrompt: "Write a Pinterest pin description for {content}. Include keywords, be descriptive, add CTA.",
        inputs: [
            { label: "Pin Content", variableName: "content", type: "text", required: true, placeholder: "What's in the pin" },
        ],
        isActive: true,
    },

    // VIDEO CONTENT
    {
        name: "YouTube Video Script",
        slug: "youtube-script",
        description: "Structure for a long-form video.",
        category: "Video Content",
        subcategory: "Scripts",
        icon: "Youtube",
        systemPrompt: "Write a YouTube video script about {topic}. Include: hook, intro, main content, and outro with CTA. Length: {duration}.",
        inputs: [
            { label: "Video Topic", variableName: "topic", type: "text", required: true, placeholder: "What's the video about" },
            { label: "Duration", variableName: "duration", type: "select", required: false, options: ["5-7 minutes", "10-12 minutes", "15-20 minutes", "20+ minutes"] },
        ],
        isActive: true,
    },
    {
        name: "TikTok/Reels Script",
        slug: "short-video-script",
        description: "Short, engaging script for vertical video.",
        category: "Video Content",
        subcategory: "Scripts",
        icon: "Smartphone",
        systemPrompt: "Write a {duration} TikTok/Reels script about {topic}. Hook in first 3 seconds, deliver value fast.",
        inputs: [
            { label: "Topic", variableName: "topic", type: "text", required: true, placeholder: "Video topic" },
            { label: "Duration", variableName: "duration", type: "select", required: false, options: ["15 seconds", "30 seconds", "60 seconds", "90 seconds"] },
        ],
        isActive: true,
    },
    {
        name: "Webinar Script",
        slug: "webinar-script",
        description: "Full structure for an educational webinar.",
        category: "Video Content",
        subcategory: "Scripts",
        icon: "Presentation",
        systemPrompt: "Create a webinar script for {topic}. Include: intro, main teaching points, Q&A prompts, and offer. Duration: {duration}.",
        inputs: [
            { label: "Webinar Topic", variableName: "topic", type: "text", required: true, placeholder: "What you're teaching" },
            { label: "Duration", variableName: "duration", type: "select", required: false, options: ["30 minutes", "45 minutes", "60 minutes", "90 minutes"] },
        ],
        isActive: true,
    },
    {
        name: "Product Demo Script",
        slug: "product-demo-script",
        description: "Walkthrough of product features.",
        category: "Video Content",
        subcategory: "Scripts",
        icon: "Monitor",
        systemPrompt: "Write a product demo script for {product}. Show key features, benefits, and use cases. Keep it clear and engaging.",
        inputs: [
            { label: "Product Name", variableName: "product", type: "text", required: true, placeholder: "Product to demo" },
        ],
        isActive: true,
    },
    {
        name: "Explainer Video Script",
        slug: "explainer-script",
        description: "Simple explanation of a complex topic.",
        category: "Video Content",
        subcategory: "Scripts",
        icon: "HelpCircle",
        systemPrompt: "Write an explainer video script for {topic}. Make complex ideas simple, use analogies, keep it under {duration}.",
        inputs: [
            { label: "Topic to Explain", variableName: "topic", type: "text", required: true, placeholder: "Complex topic" },
            { label: "Duration", variableName: "duration", type: "select", required: false, options: ["60 seconds", "90 seconds", "2 minutes", "3 minutes"] },
        ],
        isActive: true,
    },

    // COURSES
    {
        name: "Course Outline",
        slug: "course-outline",
        description: "Module and lesson breakdown.",
        category: "Courses",
        subcategory: "Curriculum",
        icon: "BookOpen",
        systemPrompt: "Create a course outline for {topic}. Include modules, lessons, and learning objectives. Target: {audience}.",
        inputs: [
            { label: "Course Topic", variableName: "topic", type: "text", required: true, placeholder: "What you're teaching" },
            { label: "Target Audience", variableName: "audience", type: "text", required: true, placeholder: "Student level" },
        ],
        isActive: true,
    },
    {
        name: "Lesson Script",
        slug: "lesson-script",
        description: "Content for a single video lesson.",
        category: "Courses",
        subcategory: "Curriculum",
        icon: "Video",
        systemPrompt: "Write a lesson script for {topic}. Include: intro, main teaching, examples, and summary. Duration: {duration}.",
        inputs: [
            { label: "Lesson Topic", variableName: "topic", type: "text", required: true, placeholder: "This lesson covers..." },
            { label: "Duration", variableName: "duration", type: "select", required: false, options: ["5 minutes", "10 minutes", "15 minutes", "20 minutes"] },
        ],
        isActive: true,
    },
    {
        name: "Course Worksheet",
        slug: "course-worksheet",
        description: "Homework or exercise for students.",
        category: "Courses",
        subcategory: "Curriculum",
        icon: "FileText",
        systemPrompt: "Create a worksheet for {lesson}. Include exercises, questions, and action items to reinforce learning.",
        inputs: [
            { label: "Lesson/Module", variableName: "lesson", type: "text", required: true, placeholder: "What lesson this supports" },
        ],
        isActive: true,
    },

    // LEAD MAGNETS
    {
        name: "E-Book Outline",
        slug: "ebook-outline",
        description: "Chapter breakdown for an ebook.",
        category: "Lead Magnets",
        subcategory: "Creation",
        icon: "Book",
        systemPrompt: "Create an ebook outline for {topic}. Include chapters, key points, and flow. Target: {audience}.",
        inputs: [
            { label: "Ebook Topic", variableName: "topic", type: "text", required: true, placeholder: "Ebook subject" },
            { label: "Target Audience", variableName: "audience", type: "text", required: false, placeholder: "Who will read this" },
        ],
        isActive: true,
    },
    {
        name: "White Paper",
        slug: "white-paper",
        description: "Authoritative report on a specific issue.",
        category: "Lead Magnets",
        subcategory: "Creation",
        icon: "FileText",
        systemPrompt: "Write a white paper on {topic}. Be authoritative, data-driven, and comprehensive. Target: {audience}.",
        inputs: [
            { label: "Topic/Issue", variableName: "topic", type: "text", required: true, placeholder: "Research topic" },
            { label: "Target Audience", variableName: "audience", type: "text", required: false, placeholder: "Industry/role" },
        ],
        isActive: true,
    },
    {
        name: "Quiz Questions",
        slug: "quiz-questions",
        description: "Engaging questions for a lead gen quiz.",
        category: "Lead Magnets",
        subcategory: "Creation",
        icon: "HelpCircle",
        systemPrompt: "Create {count} quiz questions about {topic}. Make them engaging and insightful. Include answer options.",
        inputs: [
            { label: "Quiz Topic", variableName: "topic", type: "text", required: true, placeholder: "Quiz subject" },
            { label: "Number of Questions", variableName: "count", type: "number", required: false, placeholder: "10" },
        ],
        isActive: true,
    },

    // VISUAL CONTENT
    {
        name: "Infographic Outline",
        slug: "infographic-outline",
        description: "Plan for a visual data representation.",
        category: "Visual Content",
        subcategory: "Ideas",
        icon: "BarChart",
        systemPrompt: "Create an infographic outline for {topic}. Include: title, key stats, visual flow, and takeaways.",
        inputs: [
            { label: "Topic/Data", variableName: "topic", type: "text", required: true, placeholder: "What to visualize" },
        ],
        isActive: true,
    },
    {
        name: "Slide Deck Outline",
        slug: "slide-deck-outline",
        description: "Structure for a presentation.",
        category: "Visual Content",
        subcategory: "Ideas",
        icon: "Presentation",
        systemPrompt: "Create a slide deck outline for {topic}. Include slide titles, key points, and visual suggestions.",
        inputs: [
            { label: "Presentation Topic", variableName: "topic", type: "text", required: true, placeholder: "What you're presenting" },
        ],
        isActive: true,
    },
    {
        name: "Checklist",
        slug: "checklist",
        description: "Actionable list of steps.",
        category: "Visual Content",
        subcategory: "Ideas",
        icon: "CheckSquare",
        systemPrompt: "Create a checklist for {goal}. Make it actionable, sequential, and complete.",
        inputs: [
            { label: "Goal/Process", variableName: "goal", type: "text", required: true, placeholder: "What to accomplish" },
        ],
        isActive: true,
    },

    // SEO & ADVERTISING
    {
        name: "SEO Meta Description",
        slug: "seo-meta-description",
        description: "Optimized meta descriptions for better CTR.",
        category: "SEO",
        subcategory: "On-Page",
        icon: "Search",
        systemPrompt: "Write an SEO meta description (max 160 chars) for {topic}. Include keywords: {keywords}. Make it click-worthy.",
        inputs: [
            { label: "Page Topic", variableName: "topic", type: "text", required: true, placeholder: "Page subject" },
            { label: "Keywords", variableName: "keywords", type: "text", required: false, placeholder: "Target keywords" },
        ],
        isActive: true,
    },
    {
        name: "Ad Copy",
        slug: "ad-copy",
        description: "Persuasive ad copy for paid campaigns.",
        category: "Advertising",
        subcategory: "Paid Ads",
        icon: "DollarSign",
        systemPrompt: "Write ad copy for {platform} promoting {product}. Include headline, description, and CTA. Target: {audience}.",
        inputs: [
            { label: "Platform", variableName: "platform", type: "select", required: true, options: ["Google Ads", "Facebook Ads", "Instagram Ads", "LinkedIn Ads"] },
            { label: "Product/Service", variableName: "product", type: "text", required: true, placeholder: "What you're advertising" },
            { label: "Target Audience", variableName: "audience", type: "text", required: false, placeholder: "Who should see this" },
        ],
        isActive: true,
    },
];

async function seedAllTemplates() {
    try {
        console.log('🌱 Starting comprehensive template seeding...');

        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI not found in environment variables');
        }

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        console.log(`📦 Seeding ${allTemplates.length} content templates`);

        let insertedCount = 0;
        let updatedCount = 0;

        for (const template of allTemplates) {
            try {
                const existing = await ContentTemplate.findOne({ slug: template.slug });
                if (existing) {
                    await ContentTemplate.updateOne(
                        { slug: template.slug },
                        { $set: { ...template, updatedAt: new Date() } }
                    );
                    updatedCount++;
                } else {
                    await ContentTemplate.create(template);
                    insertedCount++;
                }
            } catch (error) {
                console.error(`❌ Error with template ${template.slug}:`, error.message);
            }
        }

        console.log(`✅ Inserted ${insertedCount} new templates`);
        console.log(`✅ Updated ${updatedCount} existing templates`);

        const totalTemplates = await ContentTemplate.countDocuments();
        const categories = await ContentTemplate.distinct('category');

        console.log('\n📊 Summary:');
        console.log(`   Total content templates: ${totalTemplates}`);
        console.log(`   Categories: ${categories.join(', ')}`);

        console.log('\n🎉 All templates seeded successfully!');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedAllTemplates();
