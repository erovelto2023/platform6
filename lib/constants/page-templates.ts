// Complete Page Templates Library
// Each template is a full page with pre-configured sections

export const pageTemplates = [
    // ==========================================
    // 1. MARKETING & CONVERSION PAGES
    // ==========================================
    {
        id: "sales-page-long",
        name: "Long-Form Sales Page",
        category: "Marketing & Conversion",
        description: "Complete sales page with hero, benefits, testimonials, pricing, and CTA",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "Transform Your Life Today",
                    subtitle: "The Ultimate Solution You've Been Waiting For",
                    buttonText: "Get Started Now"
                },
                style: { backgroundColor: "#4f46e5", textColor: "#ffffff" }
            },
            {
                templateId: "features-grid",
                content: {
                    title: "Why Choose Us",
                    subtitle: "Everything you need to succeed",
                    features: JSON.stringify([
                        { icon: "✨", title: "Feature 1", description: "Amazing benefit" },
                        { icon: "🚀", title: "Feature 2", description: "Incredible results" },
                        { icon: "💎", title: "Feature 3", description: "Premium quality" }
                    ])
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            },
            {
                templateId: "testimonials-slider",
                content: {
                    title: "What Our Customers Say",
                    testimonials: JSON.stringify([
                        { quote: "This changed my life!", author: "John Doe", role: "CEO", avatar: "" },
                        { quote: "Best investment ever", author: "Jane Smith", role: "Entrepreneur", avatar: "" }
                    ])
                },
                style: { backgroundColor: "#f9fafb", textColor: "#1f2937" }
            },
            {
                templateId: "pricing-table",
                content: {
                    title: "Choose Your Plan",
                    subtitle: "Start transforming your life today",
                    plans: JSON.stringify([
                        { name: "Basic", price: "$97", period: "/month", features: ["Feature 1", "Feature 2"], buttonText: "Get Started" },
                        { name: "Pro", price: "$197", period: "/month", popular: true, features: ["Everything in Basic", "Feature 3", "Feature 4"], buttonText: "Get Started" },
                        { name: "Premium", price: "$297", period: "/month", features: ["Everything in Pro", "Feature 5", "Priority Support"], buttonText: "Get Started" }
                    ])
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            },
            {
                templateId: "cta-bar",
                content: {
                    title: "Ready to Get Started?",
                    subtitle: "Join thousands of satisfied customers",
                    buttonText: "Start Your Free Trial"
                },
                style: { backgroundColor: "#10b981", textColor: "#ffffff" }
            }
        ]
    },

    {
        id: "sales-page-short",
        name: "Short-Form Sales Page",
        category: "Marketing & Conversion",
        description: "Quick, punchy sales page for fast conversions",
        sections: [
            {
                templateId: "hero-split",
                content: {
                    title: "Get Results in 30 Days",
                    subtitle: "Simple. Effective. Guaranteed.",
                    buttonText: "Buy Now",
                    imageUrl: ""
                },
                style: { backgroundColor: "#1f2937", textColor: "#ffffff" }
            },
            {
                templateId: "social-proof",
                content: {
                    title: "Trusted by 10,000+ Customers",
                    logos: JSON.stringify(["", "", "", ""])
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            },
            {
                templateId: "cta-bar",
                content: {
                    title: "Limited Time Offer",
                    subtitle: "Get 50% off today only",
                    buttonText: "Claim Your Discount"
                },
                style: { backgroundColor: "#ef4444", textColor: "#ffffff" }
            }
        ]
    },

    {
        id: "vsl-page",
        name: "Video Sales Page (VSL)",
        category: "Marketing & Conversion",
        description: "Video-focused sales page with minimal distractions",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "Watch This Video to Discover...",
                    subtitle: "The secret to [desired outcome]"
                },
                style: { backgroundColor: "#000000", textColor: "#ffffff" }
            },
            {
                templateId: "content-two-column",
                content: {
                    title: "Video Goes Here",
                    content: "Embed your VSL video above. Keep the page clean and focused on the video.",
                    imageUrl: "" // Video placeholder
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            },
            {
                templateId: "cta-bar",
                content: {
                    title: "Ready to Get Started?",
                    buttonText: "Yes! I Want This"
                },
                style: { backgroundColor: "#f59e0b", textColor: "#ffffff" }
            }
        ]
    },

    {
        id: "squeeze-page",
        name: "Squeeze Page",
        category: "Marketing & Conversion",
        description: "Simple lead capture page",
        sections: [
            {
                templateId: "hero-with-form",
                content: {
                    title: "Get Your Free Guide",
                    subtitle: "Enter your email to download instantly",
                    formTitle: "Download Now",
                    buttonText: "Send Me The Guide"
                },
                style: { backgroundColor: "#6366f1", textColor: "#ffffff" }
            }
        ]
    },

    {
        id: "thank-you-page",
        name: "Thank You Page",
        category: "Marketing & Conversion",
        description: "Post-opt-in confirmation page",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "Thank You!",
                    subtitle: "Check your email for your download link",
                    buttonText: "Go to Dashboard"
                },
                style: { backgroundColor: "#10b981", textColor: "#ffffff" }
            },
            {
                templateId: "content-two-column",
                content: {
                    title: "What Happens Next?",
                    content: "1. Check your email\n2. Download your guide\n3. Start implementing today",
                    buttonText: "Join Our Community"
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            }
        ]
    },

    {
        id: "upsell-page",
        name: "Upsell Page",
        category: "Marketing & Conversion",
        description: "One-time offer after purchase",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "Wait! Special One-Time Offer",
                    subtitle: "Add this to your order for 50% off",
                    buttonText: "Yes! Add This To My Order"
                },
                style: { backgroundColor: "#ef4444", textColor: "#ffffff" }
            },
            {
                templateId: "features-grid",
                content: {
                    title: "What You'll Get",
                    features: JSON.stringify([
                        { icon: "✅", title: "Bonus 1", description: "Value: $297" },
                        { icon: "✅", title: "Bonus 2", description: "Value: $197" },
                        { icon: "✅", title: "Bonus 3", description: "Value: $97" }
                    ])
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            }
        ]
    },

    // ==========================================
    // 2. CONTENT & AUTHORITY PAGES
    // ==========================================
    {
        id: "blog-post",
        name: "Blog Post Page",
        category: "Content & Authority",
        description: "Standard blog post layout",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "Blog Post Title",
                    subtitle: "Published on [Date] by [Author]"
                },
                style: { backgroundColor: "#f9fafb", textColor: "#1f2937" }
            },
            {
                templateId: "content-two-column",
                content: {
                    title: "Introduction",
                    content: "Your blog post content goes here. This is where you'll write your article.",
                    imageUrl: ""
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            },
            {
                templateId: "text-block",
                content: {
                    text: "Continue your article content here. Add as many text blocks as needed."
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            },
            {
                templateId: "cta-bar",
                content: {
                    title: "Want More Content Like This?",
                    subtitle: "Subscribe to our newsletter",
                    buttonText: "Subscribe Now"
                },
                style: { backgroundColor: "#4f46e5", textColor: "#ffffff" }
            }
        ]
    },

    {
        id: "case-study",
        name: "Case Study Page",
        category: "Content & Authority",
        description: "Detailed case study with results",
        sections: [
            {
                templateId: "hero-split",
                content: {
                    title: "How [Client] Achieved [Result]",
                    subtitle: "A detailed case study",
                    imageUrl: ""
                },
                style: { backgroundColor: "#1f2937", textColor: "#ffffff" }
            },
            {
                templateId: "stats-counter",
                content: {
                    title: "The Results",
                    stats: JSON.stringify([
                        { number: "300%", label: "Increase in Sales" },
                        { number: "50K+", label: "New Customers" },
                        { number: "90 Days", label: "Time to Results" }
                    ])
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            },
            {
                templateId: "content-two-column",
                content: {
                    title: "The Challenge",
                    content: "Describe the problem the client was facing...",
                    imageUrl: ""
                },
                style: { backgroundColor: "#f9fafb", textColor: "#1f2937" }
            },
            {
                templateId: "content-two-column",
                content: {
                    title: "The Solution",
                    content: "Explain how you solved it...",
                    imageUrl: ""
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            }
        ]
    },

    {
        id: "faq-page",
        name: "FAQ Page",
        category: "Content & Authority",
        description: "Frequently asked questions",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "Frequently Asked Questions",
                    subtitle: "Find answers to common questions"
                },
                style: { backgroundColor: "#f9fafb", textColor: "#1f2937" }
            },
            {
                templateId: "faq-accordion",
                content: {
                    title: "General Questions",
                    faqs: JSON.stringify([
                        { question: "How does it work?", answer: "It works by..." },
                        { question: "What's included?", answer: "You get..." },
                        { question: "Is there a guarantee?", answer: "Yes, we offer..." }
                    ])
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            }
        ]
    },

    // ==========================================
    // 3. BRAND, BUSINESS & CORPORATE PAGES
    // ==========================================
    {
        id: "homepage",
        name: "Homepage",
        category: "Brand & Business",
        description: "Complete homepage with all sections",
        sections: [
            {
                templateId: "hero-split",
                content: {
                    title: "Welcome to [Company Name]",
                    subtitle: "We help [target audience] achieve [desired outcome]",
                    buttonText: "Get Started",
                    imageUrl: ""
                },
                style: { backgroundColor: "#4f46e5", textColor: "#ffffff" }
            },
            {
                templateId: "social-proof",
                content: {
                    title: "Trusted by Leading Companies",
                    logos: JSON.stringify(["", "", "", "", ""])
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            },
            {
                templateId: "features-grid",
                content: {
                    title: "What We Offer",
                    subtitle: "Everything you need in one place",
                    features: JSON.stringify([
                        { icon: "🚀", title: "Fast", description: "Lightning quick results" },
                        { icon: "💎", title: "Premium", description: "Top quality service" },
                        { icon: "🔒", title: "Secure", description: "Your data is safe" }
                    ])
                },
                style: { backgroundColor: "#f9fafb", textColor: "#1f2937" }
            },
            {
                templateId: "testimonials-slider",
                content: {
                    title: "What Our Clients Say",
                    testimonials: JSON.stringify([
                        { quote: "Excellent service!", author: "Client 1", role: "CEO", avatar: "" },
                        { quote: "Highly recommended", author: "Client 2", role: "Founder", avatar: "" }
                    ])
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            },
            {
                templateId: "cta-bar",
                content: {
                    title: "Ready to Get Started?",
                    subtitle: "Join us today",
                    buttonText: "Sign Up Free"
                },
                style: { backgroundColor: "#10b981", textColor: "#ffffff" }
            }
        ]
    },

    {
        id: "about-us",
        name: "About Us Page",
        category: "Brand & Business",
        description: "Company story and mission",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "About Us",
                    subtitle: "Our story, mission, and values"
                },
                style: { backgroundColor: "#1f2937", textColor: "#ffffff" }
            },
            {
                templateId: "content-two-column",
                content: {
                    title: "Our Story",
                    content: "We started in [year] with a simple mission: to [mission statement]. Today, we serve [number] customers worldwide.",
                    imageUrl: ""
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            },
            {
                templateId: "team-grid",
                content: {
                    title: "Meet Our Team",
                    subtitle: "The people behind the company",
                    team: JSON.stringify([
                        { name: "John Doe", role: "CEO", image: "", bio: "Founder and visionary" },
                        { name: "Jane Smith", role: "CTO", image: "", bio: "Tech leader" }
                    ])
                },
                style: { backgroundColor: "#f9fafb", textColor: "#1f2937" }
            }
        ]
    },

    {
        id: "team-page",
        name: "Team Page",
        category: "Brand & Business",
        description: "Meet the team",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "Our Team",
                    subtitle: "Meet the people making it happen"
                },
                style: { backgroundColor: "#4f46e5", textColor: "#ffffff" }
            },
            {
                templateId: "team-grid",
                content: {
                    title: "Leadership",
                    team: JSON.stringify([
                        { name: "Person 1", role: "CEO", image: "", bio: "" },
                        { name: "Person 2", role: "CTO", image: "", bio: "" },
                        { name: "Person 3", role: "CMO", image: "", bio: "" }
                    ])
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            }
        ]
    },

    // ==========================================
    // 4. TRUST, PROOF & CREDIBILITY PAGES
    // ==========================================
    {
        id: "testimonials-page",
        name: "Testimonials Page",
        category: "Trust & Credibility",
        description: "Customer testimonials and reviews",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "What Our Customers Say",
                    subtitle: "Real results from real people"
                },
                style: { backgroundColor: "#10b981", textColor: "#ffffff" }
            },
            {
                templateId: "testimonials-slider",
                content: {
                    title: "Success Stories",
                    testimonials: JSON.stringify([
                        { quote: "Amazing results!", author: "Customer 1", role: "Business Owner", avatar: "" },
                        { quote: "Life changing", author: "Customer 2", role: "Entrepreneur", avatar: "" },
                        { quote: "Best decision ever", author: "Customer 3", role: "Freelancer", avatar: "" }
                    ])
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            }
        ]
    },

    {
        id: "social-proof-page",
        name: "Social Proof Page",
        category: "Trust & Credibility",
        description: "Logos, numbers, and credibility",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "Trusted by Thousands",
                    subtitle: "Join the companies that trust us"
                },
                style: { backgroundColor: "#1f2937", textColor: "#ffffff" }
            },
            {
                templateId: "social-proof",
                content: {
                    title: "Featured In",
                    logos: JSON.stringify(["", "", "", "", "", ""])
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            },
            {
                templateId: "stats-counter",
                content: {
                    title: "By The Numbers",
                    stats: JSON.stringify([
                        { number: "10,000+", label: "Happy Customers" },
                        { number: "50M+", label: "Revenue Generated" },
                        { number: "99%", label: "Satisfaction Rate" }
                    ])
                },
                style: { backgroundColor: "#f9fafb", textColor: "#1f2937" }
            }
        ]
    },

    // ==========================================
    // 5. E-COMMERCE PAGES
    // ==========================================
    {
        id: "product-page",
        name: "Product Page",
        category: "E-Commerce",
        description: "Single product showcase",
        sections: [
            {
                templateId: "hero-split",
                content: {
                    title: "Product Name",
                    subtitle: "The ultimate solution for [problem]",
                    buttonText: "Add to Cart",
                    imageUrl: ""
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            },
            {
                templateId: "features-grid",
                content: {
                    title: "Key Features",
                    features: JSON.stringify([
                        { icon: "✨", title: "Feature 1", description: "Benefit description" },
                        { icon: "🚀", title: "Feature 2", description: "Benefit description" },
                        { icon: "💎", title: "Feature 3", description: "Benefit description" }
                    ])
                },
                style: { backgroundColor: "#f9fafb", textColor: "#1f2937" }
            },
            {
                templateId: "testimonials-slider",
                content: {
                    title: "Customer Reviews",
                    testimonials: JSON.stringify([
                        { quote: "Love this product!", author: "Buyer 1", role: "Verified Purchase", avatar: "" }
                    ])
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            }
        ]
    },

    {
        id: "pricing-page",
        name: "Pricing Page",
        category: "E-Commerce",
        description: "Pricing table with plans",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "Simple, Transparent Pricing",
                    subtitle: "Choose the plan that's right for you"
                },
                style: { backgroundColor: "#4f46e5", textColor: "#ffffff" }
            },
            {
                templateId: "pricing-table",
                content: {
                    title: "Our Plans",
                    plans: JSON.stringify([
                        { name: "Starter", price: "$29", period: "/mo", features: ["Feature 1", "Feature 2"], buttonText: "Start Free" },
                        { name: "Professional", price: "$99", period: "/mo", popular: true, features: ["All Starter", "Feature 3", "Feature 4"], buttonText: "Get Started" },
                        { name: "Enterprise", price: "$299", period: "/mo", features: ["All Professional", "Feature 5", "Priority Support"], buttonText: "Contact Sales" }
                    ])
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            },
            {
                templateId: "faq-accordion",
                content: {
                    title: "Pricing FAQ",
                    faqs: JSON.stringify([
                        { question: "Can I change plans?", answer: "Yes, anytime" },
                        { question: "Is there a refund?", answer: "30-day money back guarantee" }
                    ])
                },
                style: { backgroundColor: "#f9fafb", textColor: "#1f2937" }
            }
        ]
    },

    // ==========================================
    // 6. AFFILIATE & MONETIZATION PAGES
    // ==========================================
    {
        id: "affiliate-review",
        name: "Affiliate Review Page",
        category: "Affiliate & Monetization",
        description: "Product review with affiliate links",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "[Product Name] Review 2024",
                    subtitle: "Is it worth it? My honest review"
                },
                style: { backgroundColor: "#1f2937", textColor: "#ffffff" }
            },
            {
                templateId: "content-two-column",
                content: {
                    title: "What Is [Product]?",
                    content: "Detailed overview of the product...",
                    imageUrl: ""
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            },
            {
                templateId: "features-grid",
                content: {
                    title: "Pros & Cons",
                    features: JSON.stringify([
                        { icon: "✅", title: "Pro 1", description: "Great feature" },
                        { icon: "✅", title: "Pro 2", description: "Another benefit" },
                        { icon: "❌", title: "Con 1", description: "Minor drawback" }
                    ])
                },
                style: { backgroundColor: "#f9fafb", textColor: "#1f2937" }
            },
            {
                templateId: "cta-bar",
                content: {
                    title: "Ready to Try [Product]?",
                    subtitle: "Get 20% off with my exclusive link",
                    buttonText: "Get [Product] Now"
                },
                style: { backgroundColor: "#10b981", textColor: "#ffffff" }
            }
        ]
    },

    {
        id: "comparison-page",
        name: "Product Comparison Page",
        category: "Affiliate & Monetization",
        description: "Compare multiple products",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "[Product A] vs [Product B] vs [Product C]",
                    subtitle: "Which one is right for you?"
                },
                style: { backgroundColor: "#4f46e5", textColor: "#ffffff" }
            },
            {
                templateId: "pricing-table",
                content: {
                    title: "Feature Comparison",
                    plans: JSON.stringify([
                        { name: "Product A", price: "$99", features: ["Feature 1", "Feature 2"], buttonText: "Learn More" },
                        { name: "Product B", price: "$149", popular: true, features: ["Feature 1", "Feature 2", "Feature 3"], buttonText: "Best Choice" },
                        { name: "Product C", price: "$199", features: ["All Features", "Premium Support"], buttonText: "Learn More" }
                    ])
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            }
        ]
    },

    // ==========================================
    // 7. WEBINAR & EVENT PAGES
    // ==========================================
    {
        id: "webinar-registration",
        name: "Webinar Registration Page",
        category: "Webinar & Events",
        description: "Register for live webinar",
        sections: [
            {
                templateId: "hero-with-form",
                content: {
                    title: "Free Live Webinar: [Topic]",
                    subtitle: "Learn how to [outcome] in just 60 minutes",
                    formTitle: "Save Your Spot",
                    buttonText: "Register Now (It's Free)"
                },
                style: { backgroundColor: "#ef4444", textColor: "#ffffff" }
            },
            {
                templateId: "features-grid",
                content: {
                    title: "What You'll Learn",
                    features: JSON.stringify([
                        { icon: "📚", title: "Topic 1", description: "Key takeaway" },
                        { icon: "💡", title: "Topic 2", description: "Key takeaway" },
                        { icon: "🎯", title: "Topic 3", description: "Key takeaway" }
                    ])
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            }
        ]
    },

    {
        id: "countdown-page",
        name: "Countdown Page",
        category: "Webinar & Events",
        description: "Launch countdown timer",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "Something Big Is Coming...",
                    subtitle: "Get ready for the launch"
                },
                style: { backgroundColor: "#000000", textColor: "#ffffff" }
            },
            {
                templateId: "countdown-timer",
                content: {
                    title: "Launching In",
                    endDate: "2024-12-31T23:59:59"
                },
                style: { backgroundColor: "#1f2937", textColor: "#ffffff" }
            },
            {
                templateId: "hero-with-form",
                content: {
                    title: "Be The First To Know",
                    subtitle: "Get notified when we launch",
                    formTitle: "Notify Me",
                    buttonText: "Get Early Access"
                },
                style: { backgroundColor: "#4f46e5", textColor: "#ffffff" }
            }
        ]
    },

    // ==========================================
    // 8. CONTACT & FORMS
    // ==========================================
    {
        id: "contact-page",
        name: "Contact Page",
        category: "Contact & Forms",
        description: "Contact form with info",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "Get In Touch",
                    subtitle: "We'd love to hear from you"
                },
                style: { backgroundColor: "#4f46e5", textColor: "#ffffff" }
            },
            {
                templateId: "contact-form",
                content: {
                    title: "Send Us A Message",
                    subtitle: "We'll respond within 24 hours",
                    buttonText: "Send Message"
                },
                style: { backgroundColor: "#ffffff", textColor: "#1f2937" }
            }
        ]
    },

    // ==========================================
    // 9. COMING SOON & ERROR PAGES
    // ==========================================
    {
        id: "coming-soon",
        name: "Coming Soon Page",
        category: "Utility Pages",
        description: "Pre-launch page",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "Coming Soon",
                    subtitle: "We're working on something amazing",
                    buttonText: "Notify Me"
                },
                style: { backgroundColor: "#6366f1", textColor: "#ffffff" }
            }
        ]
    },

    {
        id: "404-page",
        name: "404 Error Page",
        category: "Utility Pages",
        description: "Page not found",
        sections: [
            {
                templateId: "hero-centered",
                content: {
                    title: "404 - Page Not Found",
                    subtitle: "Oops! The page you're looking for doesn't exist",
                    buttonText: "Go Home"
                },
                style: { backgroundColor: "#1f2937", textColor: "#ffffff" }
            }
        ]
    }
];

export default pageTemplates;
