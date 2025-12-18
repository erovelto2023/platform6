export const DEFAULT_CONTENT_TEMPLATES = [
    // 1. Written Content (Text-Based)
    {
        category: "Written Content",
        subcategory: "Blog & Article Types",
        templates: [
            { name: "Blog Post", description: "Standard blog post covering a specific topic." },
            { name: "Long-form Article", description: "In-depth article (1500+ words) exploring a subject comprehensively." },
            { name: "Short-form Article", description: "Quick, punchy update or opinion piece (under 500 words)." },
            { name: "List Post", description: "Top 10, Best of, or numbered list format." },
            { name: "How-to Guide", description: "Step-by-step instructional content." },
            { name: "Ultimate Guide", description: "The definitive resource on a topic." },
            { name: "Beginner’s Guide", description: "Introductory content for novices." },
            { name: "Case Study", description: "Real-world example of success or failure." },
            { name: "Opinion Piece", description: "Thought leadership and personal perspective." },
            { name: "News Article", description: "Reporting on recent events or updates." },
            { name: "Evergreen Content", description: "Timeless content that remains relevant." },
            { name: "Pillar Content", description: "Core content that supports a broader topic cluster." },
            { name: "Comparison Post", description: "Comparing two or more products or concepts." },
            { name: "Review Article", description: "Detailed review of a product or service." },
            { name: "Myth-busting Article", description: "Debunking common misconceptions." },
            { name: "Future Trends", description: "Predictive content about industry direction." }
        ]
    },
    {
        category: "Written Content",
        subcategory: "Sales & Persuasion",
        templates: [
            { name: "Advertorial", description: "Editorial content designed to sell." },
            { name: "Sales Letter", description: "Direct response sales copy." },
            { name: "Landing Page Copy", description: "High-converting text for landing pages." },
            { name: "Product Description", description: "Compelling copy for e-commerce products." },
            { name: "Testimonial Page", description: "Curated customer success stories." },
            { name: "VSL Script", description: "Script for a Video Sales Letter." },
            { name: "Email Sequence", description: "A series of emails for a specific campaign." }
        ]
    },
    // 2. Email Content
    {
        category: "Email Content",
        subcategory: "General",
        templates: [
            { name: "Newsletter", description: "Regular update for subscribers." },
            { name: "Welcome Email", description: "First email to new subscribers." },
            { name: "Onboarding Sequence", description: "Series to get new users started." },
            { name: "Promotional Email", description: "Direct offer or sale announcement." },
            { name: "Abandoned Cart Email", description: "Recover lost sales." },
            { name: "Re-engagement Email", description: "Win back inactive subscribers." },
            { name: "Cold Outreach Email", description: "First contact with a prospect." }
        ]
    },
    // 3. Social Media Content
    {
        category: "Social Media",
        subcategory: "Short-Form",
        templates: [
            { name: "Social Media Post", description: "General post for FB, LinkedIn, etc." },
            { name: "Twitter/X Thread", description: "Multi-tweet story or lesson." },
            { name: "Instagram Caption", description: "Engaging text for IG photos/reels." },
            { name: "LinkedIn Post", description: "Professional update or insight." },
            { name: "TikTok Caption", description: "Short, punchy text for video." },
            { name: "Pinterest Pin Description", description: "SEO-optimized text for Pins." }
        ]
    },
    // 4. Video Content
    {
        category: "Video Content",
        subcategory: "Scripts",
        templates: [
            { name: "YouTube Video Script", description: "Structure for a long-form video." },
            { name: "TikTok/Reels Script", description: "Short, engaging script for vertical video." },
            { name: "Explainer Video Script", description: "Simple explanation of a complex topic." },
            { name: "Product Demo Script", description: "Walkthrough of product features." },
            { name: "Webinar Script", description: "Full structure for an educational webinar." }
        ]
    },
    // 6. Visual & Interactive
    {
        category: "Visual Content",
        subcategory: "Ideas",
        templates: [
            { name: "Infographic Outline", description: "Plan for a visual data representation." },
            { name: "Slide Deck Outline", description: "Structure for a presentation." },
            { name: "Checklist", description: "Actionable list of steps." }
        ]
    },
    // 7. Lead Magnets
    {
        category: "Lead Magnets",
        subcategory: "Creation",
        templates: [
            { name: "E-Book Outline", description: "Chapter breakdown for an ebook." },
            { name: "White Paper", description: "Authoritative report on a specific issue." },
            { name: "Quiz Questions", description: "Engaging questions for a lead gen quiz." }
        ]
    },
    // 8. Courses
    {
        category: "Courses",
        subcategory: "Curriculum",
        templates: [
            { name: "Course Outline", description: "Module and lesson breakdown." },
            { name: "Lesson Script", description: "Content for a single video lesson." },
            { name: "Course Worksheet", description: "Homework or exercise for students." }
        ]
    }
];

export const DEFAULT_SYSTEM_PROMPT = `You are an expert content creator. Your goal is to write a high-quality {{template_name}} based on the user's inputs.

Topic: {{topic}}
Target Audience: {{audience}}
Tone: {{tone}}
Goal: {{goal}}
Additional Context: {{context}}

Please follow these guidelines:
1. Adhere strictly to the requested format: {{template_name}}.
2. Match the requested tone: {{tone}}.
3. Focus on the goal: {{goal}}.
4. Provide a complete, polished draft.
`;

export const DEFAULT_INPUTS = [
    { label: "Topic / Keyword", variableName: "topic", type: "text", required: true, placeholder: "e.g. Vegan Protein Powder" },
    { label: "Target Audience", variableName: "audience", type: "text", required: true, placeholder: "e.g. Busy moms, Gym goers" },
    { label: "Tone", variableName: "tone", type: "select", options: ["Professional", "Casual", "Witty", "Urgent", "Empathetic", "Authoritative"], required: true },
    { label: "Goal", variableName: "goal", type: "select", options: ["Traffic", "Leads", "Sales", "Engagement", "Brand Awareness"], required: true },
    { label: "Additional Context", variableName: "context", type: "textarea", required: false, placeholder: "Any specific points to include..." }
];
