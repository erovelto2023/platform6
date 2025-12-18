// Affiliate Page Section Templates

export const SECTION_TEMPLATES = {
    hero: {
        id: "hero",
        name: "Hero Section",
        description: "Eye-catching introduction with headline and CTA",
        category: "Header",
        defaultContent: {
            title: "Product Name - Honest Review",
            subtitle: "Everything you need to know before you buy",
            buttonText: "Get Started Now",
        },
    },
    introduction: {
        id: "introduction",
        name: "Introduction",
        description: "Brief overview of the product and review",
        category: "Content",
        defaultContent: {
            title: "What is [Product]?",
            content: "Introduction content goes here",
        },
    },
    features: {
        id: "features",
        name: "Features Grid",
        description: "Highlight key features in a grid layout",
        category: "Features",
        defaultContent: {
            title: "Key Features",
            features: [],
        },
    },
    proscons: {
        id: "proscons",
        name: "Pros & Cons",
        description: "Balanced view of advantages and disadvantages",
        category: "Analysis",
        defaultContent: {
            title: "Pros & Cons",
            pros: [],
            cons: [],
        },
    },
    comparison: {
        id: "comparison",
        name: "Comparison Table",
        description: "Compare with competing products",
        category: "Analysis",
        defaultContent: {
            title: "How Does It Compare?",
            comparisonData: [],
        },
    },
    pricing: {
        id: "pricing",
        name: "Pricing",
        description: "Pricing tiers and plans",
        category: "Conversion",
        defaultContent: {
            title: "Pricing Plans",
            plans: [],
        },
    },
    coupon: {
        id: "coupon",
        name: "Coupon/Discount",
        description: "Special offer or discount code",
        category: "Conversion",
        defaultContent: {
            title: "Exclusive Discount",
            code: "SAVE20",
            discount: "20% Off",
        },
    },
    video: {
        id: "video",
        name: "Video Review",
        description: "Embedded video content",
        category: "Media",
        defaultContent: {
            title: "Watch Our Review",
            videoUrl: "",
        },
    },
    cta: {
        id: "cta",
        name: "Call to Action",
        description: "Strong conversion-focused CTA",
        category: "Conversion",
        defaultContent: {
            title: "Ready to Get Started?",
            buttonText: "Try It Now",
        },
    },
    faq: {
        id: "faq",
        name: "FAQ",
        description: "Frequently asked questions",
        category: "Content",
        defaultContent: {
            title: "Frequently Asked Questions",
            faqs: [],
        },
    },
    author: {
        id: "author",
        name: "Author Note",
        description: "Personal note from the reviewer",
        category: "Trust",
        defaultContent: {
            title: "From the Author",
            content: "",
            authorName: "",
            authorTitle: "",
        },
    },
    conclusion: {
        id: "conclusion",
        name: "Conclusion",
        description: "Final thoughts and recommendation",
        category: "Content",
        defaultContent: {
            title: "Final Verdict",
            rating: 4.5,
            content: "",
        },
    },
} as const;

export type SectionTemplateKey = keyof typeof SECTION_TEMPLATES;
