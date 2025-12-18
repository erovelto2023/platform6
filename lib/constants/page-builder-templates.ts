import type { Template } from "@/lib/types"

export const defaultTemplates: Template[] = [
  // Hero Sections
  {
    id: "hero-centered",
    name: "Hero - Centered",
    category: "hero",
    componentType: "HeroCentered",
    defaultContent: {
      title: "Build Something Amazing",
      subtitle: "The best platform to bring your ideas to life",
      buttonText: "Get Started",
      buttonLink: "#",
    },
    defaultStyle: {
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
      padding: "6rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "hero-split",
    name: "Hero - Split",
    category: "hero",
    componentType: "HeroSplit",
    defaultContent: {
      title: "Transform Your Business Today",
      subtitle: "Powerful tools to help you succeed",
      buttonText: "Start Free Trial",
      buttonLink: "#",
      imageUrl: "/placeholder.svg?height=600&width=800",
    },
    defaultStyle: {
      backgroundColor: "#0f0f1a",
      textColor: "#ffffff",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "hero-video-bg",
    name: "Hero - Video Background",
    category: "hero",
    componentType: "HeroVideoBg",
    defaultContent: {
      title: "Experience Innovation",
      subtitle: "Watch your vision come to life",
      buttonText: "Watch Demo",
      buttonLink: "#",
      videoUrl: "/placeholder-video.mp4",
    },
    defaultStyle: {
      backgroundColor: "#000000",
      textColor: "#ffffff",
      padding: "8rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "hero-with-form",
    name: "Hero - With Form",
    category: "hero",
    componentType: "HeroWithForm",
    defaultContent: {
      title: "Start Your Free Trial",
      subtitle: "No credit card required. Get started in minutes.",
      formTitle: "Create Your Account",
      buttonText: "Get Started",
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "hero-social-proof",
    name: "Hero - Social Proof",
    category: "hero",
    componentType: "HeroSocialProof",
    defaultContent: {
      title: "Trusted by 10,000+ Companies",
      subtitle: "Join the world's leading brands",
      buttonText: "Get Started",
      buttonLink: "#",
      logos: JSON.stringify([
        "/placeholder.svg?height=60&width=120",
        "/placeholder.svg?height=60&width=120",
        "/placeholder.svg?height=60&width=120",
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "hero-minimal",
    name: "Hero - Minimal",
    category: "hero",
    componentType: "HeroMinimal",
    defaultContent: {
      title: "Simply Better",
      subtitle: "Clean. Simple. Powerful.",
      buttonText: "Learn More",
      buttonLink: "#",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      padding: "8rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "hero-product-launch",
    name: "Hero - Product Launch",
    category: "hero",
    componentType: "HeroProductLaunch",
    defaultContent: {
      title: "Introducing the Future",
      subtitle: "Available now. Limited time offer.",
      buttonText: "Pre-Order Now",
      buttonLink: "#",
      imageUrl: "/placeholder.svg?height=500&width=800",
      badge: "New Release",
    },
    defaultStyle: {
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "hero-webinar",
    name: "Hero - Webinar",
    category: "hero",
    componentType: "HeroWebinar",
    defaultContent: {
      title: "Live Webinar: Master Your Craft",
      subtitle: "Join 5,000+ attendees learning from industry experts",
      date: "March 25, 2024 at 2:00 PM EST",
      buttonText: "Register Now",
      buttonLink: "#",
    },
    defaultStyle: {
      backgroundColor: "#0f0f1a",
      textColor: "#ffffff",
      padding: "5rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "hero-app-download",
    name: "Hero - App Download",
    category: "hero",
    componentType: "HeroAppDownload",
    defaultContent: {
      title: "Download Our App",
      subtitle: "Available on iOS and Android",
      buttonText: "Download Now",
      buttonLink: "#",
      appStoreUrl: "#",
      playStoreUrl: "#",
      imageUrl: "/placeholder.svg?height=600&width=400",
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "hero-course",
    name: "Hero - Course",
    category: "hero",
    componentType: "HeroCourse",
    defaultContent: {
      title: "Master Web Development",
      subtitle: "Learn from industry professionals",
      price: "$99",
      originalPrice: "$199",
      buttonText: "Enroll Now",
      buttonLink: "#",
      features: JSON.stringify(["50+ Hours of Content", "Lifetime Access", "Certificate"]),
    },
    defaultStyle: {
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
      padding: "5rem 1.5rem",
    },
  },

  // Features Sections
  {
    id: "features-grid",
    name: "Features Grid",
    category: "features",
    componentType: "FeaturesGrid",
    defaultContent: {
      title: "Everything You Need",
      subtitle: "Powerful features to grow your business",
      features: JSON.stringify([
        { icon: "⚡", title: "Fast Performance", description: "Lightning-fast load times" },
        { icon: "🔒", title: "Secure", description: "Enterprise-grade security" },
        { icon: "📱", title: "Mobile Ready", description: "Works on all devices" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "feature-comparison",
    name: "Feature Comparison",
    category: "features",
    componentType: "FeatureComparison",
    defaultContent: {
      title: "Compare Our Plans",
      subtitle: "Find the perfect plan for your needs",
      features: JSON.stringify([
        { name: "Feature 1", basic: true, pro: true, enterprise: true },
        { name: "Feature 2", basic: false, pro: true, enterprise: true },
        { name: "Feature 3", basic: false, pro: false, enterprise: true },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "tabbed-features",
    name: "Tabbed Features",
    category: "features",
    componentType: "TabbedFeatures",
    defaultContent: {
      title: "Explore Our Features",
      tabs: JSON.stringify([
        {
          name: "Analytics",
          title: "Powerful Analytics",
          description: "Track every metric that matters",
          imageUrl: "/placeholder.svg?height=400&width=600",
        },
        {
          name: "Integration",
          title: "Seamless Integration",
          description: "Connect with your favorite tools",
          imageUrl: "/placeholder.svg?height=400&width=600",
        },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },

  // Social Proof Sections
  {
    id: "testimonials-slider",
    name: "Testimonials Slider",
    category: "testimonials",
    componentType: "TestimonialsSlider",
    defaultContent: {
      title: "What Our Customers Say",
      testimonials: JSON.stringify([
        {
          quote: "This product changed everything!",
          author: "John Doe",
          role: "CEO, Company",
          avatar: "/placeholder.svg?height=60&width=60",
        },
        {
          quote: "Best investment we ever made.",
          author: "Jane Smith",
          role: "CTO, Startup",
          avatar: "/placeholder.svg?height=60&width=60",
        },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
      padding: "5rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "logo-bar",
    name: "Logo Bar",
    category: "social-proof",
    componentType: "LogoBar",
    defaultContent: {
      title: "Trusted by Industry Leaders",
      logos: JSON.stringify([
        "/placeholder.svg?height=60&width=120",
        "/placeholder.svg?height=60&width=120",
        "/placeholder.svg?height=60&width=120",
        "/placeholder.svg?height=60&width=120",
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "3rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "before-after-showcase",
    name: "Before/After Showcase",
    category: "social-proof",
    componentType: "BeforeAfter",
    defaultContent: {
      title: "See The Difference",
      beforeImage: "/before-text.png",
      afterImage: "/after-text.png",
      beforeLabel: "Before",
      afterLabel: "After",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "guarantee-section",
    name: "Guarantee Section",
    category: "social-proof",
    componentType: "GuaranteeSection",
    defaultContent: {
      title: "100% Money Back Guarantee",
      subtitle: "Try it risk-free for 30 days",
      description: "If you're not completely satisfied, we'll refund every penny. No questions asked.",
      buttonText: "Get Started Now",
      buttonLink: "#",
    },
    defaultStyle: {
      backgroundColor: "#f0f9ff",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "awards-certifications",
    name: "Awards & Certifications",
    category: "social-proof",
    componentType: "AwardsCertifications",
    defaultContent: {
      title: "Award-Winning Solution",
      subtitle: "Recognized by industry leaders",
      awards: JSON.stringify([
        { name: "Best Product 2024", organization: "Tech Awards", imageUrl: "/placeholder.svg?height=80&width=80" },
        { name: "Top Innovator", organization: "Business Today", imageUrl: "/placeholder.svg?height=80&width=80" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
      padding: "4rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "trust-badges",
    name: "Trust Badges",
    category: "social-proof",
    componentType: "TrustBadges",
    defaultContent: {
      badges: JSON.stringify([
        { icon: "🔒", label: "SSL Secure" },
        { icon: "✓", label: "Verified" },
        { icon: "⭐", label: "5-Star Rated" },
        { icon: "💳", label: "Secure Payment" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "2rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "customer-love-wall",
    name: "Customer Love Wall",
    category: "social-proof",
    componentType: "CustomerLoveWall",
    defaultContent: {
      title: "Loved by Customers Worldwide",
      quotes: JSON.stringify([
        { text: "Amazing!", author: "Sarah" },
        { text: "Best decision ever", author: "Mike" },
        { text: "Highly recommended", author: "Emily" },
        { text: "Game changer", author: "David" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "live-activity-feed",
    name: "Live Activity Feed",
    category: "social-proof",
    componentType: "LiveActivityFeed",
    defaultContent: {
      title: "Join thousands taking action right now",
      activities: JSON.stringify([
        { user: "John from NYC", action: "just signed up", time: "2 min ago" },
        { user: "Sarah from LA", action: "made a purchase", time: "5 min ago" },
        { user: "Mike from Chicago", action: "left a 5-star review", time: "8 min ago" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "3rem 1.5rem",
    },
  },
  {
    id: "video-testimonial",
    name: "Video Testimonial",
    category: "testimonials",
    componentType: "VideoTestimonial",
    defaultContent: {
      title: "Hear From Our Customers",
      videoUrl: "/placeholder-video.mp4",
      thumbnail: "/video-thumbnail-testimonial.jpg",
      author: "Jessica Smith",
      role: "Marketing Director",
      company: "TechCorp",
    },
    defaultStyle: {
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "community-proof",
    name: "Community Proof",
    category: "social-proof",
    componentType: "CommunityProof",
    defaultContent: {
      title: "Join Our Thriving Community",
      members: "50,000+",
      posts: "125,000+",
      countries: "150+",
      description: "Connect with thousands of professionals worldwide",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },

  // Pricing Sections
  {
    id: "pricing-table",
    name: "Pricing Table",
    category: "pricing",
    componentType: "PricingTable",
    defaultContent: {
      title: "Simple, Transparent Pricing",
      subtitle: "Choose the plan that fits your needs",
      plans: JSON.stringify([
        {
          name: "Basic",
          price: "$9",
          period: "/month",
          features: ["Feature 1", "Feature 2", "Feature 3"],
          buttonText: "Get Started",
          buttonLink: "#",
        },
        {
          name: "Pro",
          price: "$29",
          period: "/month",
          features: ["All Basic features", "Feature 4", "Feature 5", "Priority Support"],
          buttonText: "Get Started",
          buttonLink: "#",
          popular: true,
        },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "comparison-pricing",
    name: "Comparison Pricing",
    category: "pricing",
    componentType: "ComparisonPricing",
    defaultContent: {
      title: "Find Your Perfect Plan",
      plans: JSON.stringify([
        { name: "Starter", price: "$9", features: ["5 Projects", "5GB Storage"] },
        { name: "Pro", price: "$29", features: ["Unlimited Projects", "100GB Storage", "Priority Support"] },
        {
          name: "Enterprise",
          price: "$99",
          features: ["Everything in Pro", "Custom Integration", "Dedicated Manager"],
        },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },

  // Content Sections
  {
    id: "content-two-column",
    name: "Content - Two Column",
    category: "content",
    componentType: "ContentTwoColumn",
    defaultContent: {
      title: "Why Choose Us",
      content: "We provide the best solution for your needs with unmatched quality and support.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      buttonText: "Learn More",
      buttonLink: "#",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "text-block",
    name: "Text Block",
    category: "content",
    componentType: "TextBlock",
    defaultContent: {
      text: "This is a simple text block. Add your content here.",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "3rem 1.5rem",
      textAlign: "left",
      maxWidth: "800px",
    },
  },
  {
    id: "rich-text",
    name: "Rich Text",
    category: "content",
    componentType: "RichText",
    defaultContent: {
      title: "Main Heading",
      content:
        "This is a rich text section with multiple paragraphs. You can include bold text, lists, and more formatted content here.",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
      maxWidth: "900px",
    },
  },
  {
    id: "headline-subheadline",
    name: "Headline + Subheadline",
    category: "content",
    componentType: "HeadlineSubheadline",
    defaultContent: {
      headline: "Make Your Mark",
      subheadline: "Stand out from the crowd with our innovative solution",
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "long-form-content",
    name: "Long Form Content",
    category: "content",
    componentType: "LongFormContent",
    defaultContent: {
      title: "Complete Guide",
      content: "This is where your long-form article or blog post content goes. You can write extensively here.",
      author: "John Doe",
      date: "March 15, 2024",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
      maxWidth: "800px",
    },
  },
  {
    id: "feature-list",
    name: "Feature List",
    category: "content",
    componentType: "FeatureList",
    defaultContent: {
      title: "What's Included",
      features: JSON.stringify(["Feature One", "Feature Two", "Feature Three", "Feature Four"]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "icon-text",
    name: "Icon + Text",
    category: "content",
    componentType: "IconText",
    defaultContent: {
      items: JSON.stringify([
        { icon: "⚡", title: "Fast", text: "Lightning-fast performance" },
        { icon: "🔒", title: "Secure", text: "Bank-level security" },
        { icon: "📱", title: "Mobile", text: "Works everywhere" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "numbered-steps",
    name: "Numbered Steps",
    category: "content",
    componentType: "NumberedSteps",
    defaultContent: {
      title: "How It Works",
      steps: JSON.stringify([
        { title: "Sign Up", description: "Create your free account" },
        { title: "Set Up", description: "Configure your preferences" },
        { title: "Launch", description: "Start using immediately" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "timeline",
    name: "Timeline",
    category: "content",
    componentType: "Timeline",
    defaultContent: {
      title: "Our Journey",
      events: JSON.stringify([
        { year: "2020", title: "Founded", description: "Started with a vision" },
        { year: "2022", title: "Growth", description: "Reached 10,000 users" },
        { year: "2024", title: "Today", description: "Leading the industry" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "how-it-works",
    name: "How It Works",
    category: "content",
    componentType: "HowItWorks",
    defaultContent: {
      title: "Simple Process",
      subtitle: "Get started in three easy steps",
      steps: JSON.stringify([
        { number: 1, title: "Sign Up", description: "Create your account in seconds" },
        { number: 2, title: "Customize", description: "Set up your preferences" },
        { number: 3, title: "Succeed", description: "Start achieving your goals" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "about-us",
    name: "About Us",
    category: "content",
    componentType: "AboutUs",
    defaultContent: {
      title: "About Our Company",
      content: "We are dedicated to providing the best service to our customers.",
      imageUrl: "/diverse-office-team.png",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "about-story",
    name: "About Story",
    category: "content",
    componentType: "AboutStory",
    defaultContent: {
      title: "Our Story",
      story: "It all started with a simple idea...",
      imageUrl: "/founders-working.jpg",
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "mission-vision",
    name: "Mission & Vision",
    category: "content",
    componentType: "MissionVision",
    defaultContent: {
      missionTitle: "Our Mission",
      mission: "To empower businesses worldwide",
      visionTitle: "Our Vision",
      vision: "A world where technology serves humanity",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "values",
    name: "Values",
    category: "content",
    componentType: "Values",
    defaultContent: {
      title: "Our Core Values",
      values: JSON.stringify([
        { title: "Integrity", description: "We do what's right" },
        { title: "Innovation", description: "We push boundaries" },
        { title: "Excellence", description: "We deliver quality" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "bio-team-intro",
    name: "Bio/Team Intro",
    category: "content",
    componentType: "BioTeamIntro",
    defaultContent: {
      title: "Meet Our Team",
      description: "Passionate professionals dedicated to your success",
      members: JSON.stringify([
        { name: "Jane Doe", role: "CEO", imageUrl: "/professional-headshot.png" },
        { name: "John Smith", role: "CTO", imageUrl: "/placeholder.svg?height=200&width=200" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    category: "content",
    componentType: "KnowledgeBase",
    defaultContent: {
      title: "Help Center",
      categories: JSON.stringify([
        { name: "Getting Started", articles: ["How to sign up", "First steps", "Account setup"] },
        { name: "Features", articles: ["Feature A guide", "Feature B tutorial"] },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "documentation",
    name: "Documentation",
    category: "content",
    componentType: "Documentation",
    defaultContent: {
      title: "API Documentation",
      sections: JSON.stringify([
        { title: "Introduction", content: "Getting started with our API" },
        { title: "Authentication", content: "How to authenticate requests" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "glossary",
    name: "Glossary",
    category: "content",
    componentType: "Glossary",
    defaultContent: {
      title: "Glossary",
      terms: JSON.stringify([
        { term: "API", definition: "Application Programming Interface" },
        { term: "SDK", definition: "Software Development Kit" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
    },
  },

  // Media Sections
  {
    id: "image-gallery",
    name: "Image Gallery",
    category: "media",
    componentType: "ImageGallery",
    defaultContent: {
      title: "Our Gallery",
      images: JSON.stringify([
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "image-block",
    name: "Image Block",
    category: "media",
    componentType: "ImageBlock",
    defaultContent: {
      imageUrl: "/placeholder.svg?height=400&width=800",
      caption: "Image caption goes here",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "lightbox-gallery",
    name: "Lightbox Gallery",
    category: "media",
    componentType: "LightboxGallery",
    defaultContent: {
      title: "View Our Work",
      images: JSON.stringify([
        { src: "/placeholder.svg?height=400&width=600", caption: "Project 1" },
        { src: "/placeholder.svg?height=400&width=600", caption: "Project 2" },
        { src: "/placeholder.svg?height=400&width=600", caption: "Project 3" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "slider-carousel",
    name: "Slider/Carousel",
    category: "media",
    componentType: "SliderCarousel",
    defaultContent: {
      slides: JSON.stringify([
        { imageUrl: "/placeholder.svg?height=400&width=800", title: "Slide 1", caption: "First slide" },
        { imageUrl: "/placeholder.svg?height=400&width=800", title: "Slide 2", caption: "Second slide" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "video-embed",
    name: "Video Embed",
    category: "media",
    componentType: "VideoEmbed",
    defaultContent: {
      title: "Watch Our Video",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    defaultStyle: {
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "audio-player",
    name: "Audio Player",
    category: "media",
    componentType: "AudioPlayer",
    defaultContent: {
      title: "Listen to Our Podcast",
      audioUrl: "/placeholder-audio.mp3",
      description: "Latest episode of our podcast",
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "podcast-episode",
    name: "Podcast Episode",
    category: "media",
    componentType: "PodcastEpisode",
    defaultContent: {
      title: "Episode 42: Innovation Today",
      description: "Join us as we explore the latest trends in technology",
      audioUrl: "/placeholder-audio.mp3",
      coverArt: "/placeholder.svg?height=300&width=300",
      duration: "45:30",
      releaseDate: "March 15, 2024",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "image-text-split",
    name: "Image + Text Split",
    category: "media",
    componentType: "ImageTextSplit",
    defaultContent: {
      title: "Our Approach",
      text: "We combine innovation with practicality to deliver results",
      imageUrl: "/placeholder.svg?height=400&width=600",
      imagePosition: "right",
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "image-hotspots",
    name: "Image Hotspots",
    category: "media",
    componentType: "ImageHotspots",
    defaultContent: {
      imageUrl: "/placeholder.svg?height=600&width=800",
      hotspots: JSON.stringify([
        { x: 30, y: 40, title: "Feature A", description: "Amazing feature" },
        { x: 60, y: 50, title: "Feature B", description: "Another great feature" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "animated-media",
    name: "Animated Media",
    category: "media",
    componentType: "AnimatedMedia",
    defaultContent: {
      title: "Watch It In Action",
      animationUrl: "/placeholder-animation.json",
      type: "lottie",
    },
    defaultStyle: {
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
      padding: "5rem 1.5rem",
      textAlign: "center",
    },
  },

  // Team Sections
  {
    id: "team-grid",
    name: "Team Grid",
    category: "team",
    componentType: "TeamGrid",
    defaultContent: {
      title: "Meet Our Team",
      subtitle: "The people behind our success",
      members: JSON.stringify([
        {
          name: "John Doe",
          role: "CEO & Founder",
          bio: "Visionary leader",
          imageUrl: "/placeholder.svg?height=200&width=200",
        },
        {
          name: "Jane Smith",
          role: "CTO",
          bio: "Tech innovator",
          imageUrl: "/placeholder.svg?height=200&width=200",
        },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },

  // Blog Sections
  {
    id: "blog-grid",
    name: "Blog Grid",
    category: "blog",
    componentType: "BlogGrid",
    defaultContent: {
      title: "Latest from Our Blog",
      posts: JSON.stringify([
        {
          title: "Getting Started",
          excerpt: "Learn the basics...",
          imageUrl: "/placeholder.svg?height=200&width=400",
          date: "March 15, 2024",
          link: "#",
        },
        {
          title: "Advanced Tips",
          excerpt: "Take it to the next level...",
          imageUrl: "/placeholder.svg?height=200&width=400",
          date: "March 10, 2024",
          link: "#",
        },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },

  // FAQ Section
  {
    id: "faq-accordion",
    name: "FAQ Accordion",
    category: "faq",
    componentType: "FaqAccordion",
    defaultContent: {
      title: "Frequently Asked Questions",
      faqs: JSON.stringify([
        { question: "How does it work?", answer: "It's simple and easy to use..." },
        { question: "What's included?", answer: "Everything you need to succeed..." },
        { question: "Is there support?", answer: "24/7 customer support available..." },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },

  // CTA Sections
  {
    id: "call-to-action",
    name: "Call to Action",
    category: "cta",
    componentType: "CallToAction",
    defaultContent: {
      title: "Ready to Get Started?",
      subtitle: "Join thousands of happy customers today",
      buttonText: "Start Free Trial",
      buttonLink: "#",
    },
    defaultStyle: {
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
      padding: "5rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "cta-bar",
    name: "CTA Bar",
    category: "cta",
    componentType: "CtaBar",
    defaultContent: {
      text: "Limited Time Offer - Get 50% Off!",
      buttonText: "Claim Deal",
      buttonLink: "#",
    },
    defaultStyle: {
      backgroundColor: "#ff6b6b",
      textColor: "#ffffff",
      padding: "1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "cta-button-grid",
    name: "CTA Button Grid",
    category: "cta",
    componentType: "CtaButtonGrid",
    defaultContent: {
      title: "Choose Your Path",
      buttons: JSON.stringify([
        { text: "For Individuals", link: "#", style: "primary" },
        { text: "For Teams", link: "#", style: "secondary" },
        { text: "For Enterprise", link: "#", style: "outline" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
      textAlign: "center",
    },
  },

  // Form Sections
  {
    id: "contact-form",
    name: "Contact Form",
    category: "forms",
    componentType: "ContactForm",
    defaultContent: {
      title: "Get In Touch",
      subtitle: "We'd love to hear from you",
      buttonText: "Send Message",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "newsletter-signup",
    name: "Newsletter Signup",
    category: "forms",
    componentType: "NewsletterSignup",
    defaultContent: {
      title: "Stay Updated",
      subtitle: "Subscribe to our newsletter for the latest updates",
      buttonText: "Subscribe",
      placeholder: "Enter your email",
    },
    defaultStyle: {
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
      padding: "4rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "lead-capture",
    name: "Lead Capture Form",
    category: "forms",
    componentType: "LeadCapture",
    defaultContent: {
      title: "Get Your Free Guide",
      subtitle: "Enter your details to download",
      buttonText: "Download Now",
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "optin-signup",
    name: "Opt-in Signup",
    category: "forms",
    componentType: "OptinSignup",
    defaultContent: {
      title: "Join 10,000+ Subscribers",
      subtitle: "Get weekly tips delivered to your inbox",
      buttonText: "Yes, I Want In",
      privacy: "We respect your privacy. Unsubscribe anytime.",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "multi-step-form",
    name: "Multi-Step Form",
    category: "forms",
    componentType: "MultiStep",
    defaultContent: {
      title: "Complete Your Profile",
      steps: JSON.stringify([
        { title: "Step 1", fields: ["Name", "Email"] },
        { title: "Step 2", fields: ["Company", "Role"] },
        { title: "Step 3", fields: ["Preferences"] },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "quiz-assessment",
    name: "Quiz/Assessment",
    category: "forms",
    componentType: "QuizAssessment",
    defaultContent: {
      title: "Find Your Perfect Plan",
      questions: JSON.stringify([
        { question: "What's your team size?", options: ["1-5", "6-20", "21+"] },
        { question: "What's your goal?", options: ["Growth", "Efficiency", "Scale"] },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "demo-request",
    name: "Demo Request",
    category: "forms",
    componentType: "DemoRequest",
    defaultContent: {
      title: "Schedule a Demo",
      subtitle: "See our platform in action",
      buttonText: "Book Demo",
    },
    defaultStyle: {
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
      padding: "5rem 1.5rem",
    },
  },

  // Process/Steps
  {
    id: "process-steps",
    name: "Process Steps",
    category: "process",
    componentType: "ProcessSteps",
    defaultContent: {
      title: "Our Process",
      steps: JSON.stringify([
        { number: 1, title: "Discover", description: "We learn about your needs" },
        { number: 2, title: "Design", description: "We create the solution" },
        { number: 3, title: "Deliver", description: "We launch your project" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },

  // Stats
  {
    id: "stats-section",
    name: "Stats Section",
    category: "stats",
    componentType: "StatsSection",
    defaultContent: {
      title: "By The Numbers",
      stats: JSON.stringify([
        { value: "10K+", label: "Happy Customers" },
        { value: "99%", label: "Satisfaction Rate" },
        { value: "24/7", label: "Support Available" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
      padding: "5rem 1.5rem",
      textAlign: "center",
    },
  },

  // Timer
  {
    id: "countdown-timer",
    name: "Countdown Timer",
    category: "timer",
    componentType: "CountdownTimer",
    defaultContent: {
      title: "Limited Time Offer",
      endDate: "2024-12-31T23:59:59",
      buttonText: "Claim Offer",
      buttonLink: "#",
    },
    defaultStyle: {
      backgroundColor: "#ff6b6b",
      textColor: "#ffffff",
      padding: "4rem 1.5rem",
      textAlign: "center",
    },
  },

  // Social Proof (Logo Cloud)
  {
    id: "logo-cloud",
    name: "Logo Cloud",
    category: "social-proof",
    componentType: "LogoCloud",
    defaultContent: {
      title: "Trusted by Leading Companies",
      logos: JSON.stringify([
        "/placeholder.svg?height=60&width=120",
        "/placeholder.svg?height=60&width=120",
        "/placeholder.svg?height=60&width=120",
        "/placeholder.svg?height=60&width=120",
        "/placeholder.svg?height=60&width=120",
        "/placeholder.svg?height=60&width=120",
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
      textAlign: "center",
    },
  },

  // Headers
  {
    id: "global-header",
    name: "Global Header",
    category: "headers",
    componentType: "GlobalHeader",
    defaultContent: {
      logo: "Logo",
      menuItems: JSON.stringify([
        { text: "Home", link: "#" },
        { text: "Features", link: "#" },
        { text: "Pricing", link: "#" },
        { text: "Contact", link: "#" },
      ]),
      ctaText: "Get Started",
      ctaLink: "#",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "1rem 1.5rem",
    },
  },
  {
    id: "sticky-header",
    name: "Sticky Header",
    category: "headers",
    componentType: "StickyHeader",
    defaultContent: {
      logo: "Logo",
      menuItems: JSON.stringify([
        { text: "Home", link: "#" },
        { text: "About", link: "#" },
        { text: "Services", link: "#" },
      ]),
      ctaText: "Sign Up",
      ctaLink: "#",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "1rem 1.5rem",
    },
  },
  {
    id: "announcement-bar",
    name: "Announcement Bar",
    category: "headers",
    componentType: "AnnouncementBar",
    defaultContent: {
      message: "🎉 New feature just launched! Check it out →",
      link: "#",
      dismissible: "true",
    },
    defaultStyle: {
      backgroundColor: "#4f46e5",
      textColor: "#ffffff",
      padding: "0.75rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "mega-menu",
    name: "Mega Menu",
    category: "headers",
    componentType: "MegaMenu",
    defaultContent: {
      logo: "Logo",
      sections: JSON.stringify([
        {
          title: "Products",
          items: ["Product A", "Product B", "Product C"],
        },
        {
          title: "Solutions",
          items: ["Solution X", "Solution Y", "Solution Z"],
        },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "1rem 1.5rem",
    },
  },

  // Footers
  {
    id: "footer",
    name: "Footer",
    category: "footer",
    componentType: "Footer",
    defaultContent: {
      companyName: "Company Name",
      description: "Building amazing products for everyone",
      links: JSON.stringify([
        { title: "Product", items: ["Features", "Pricing", "Updates"] },
        { title: "Company", items: ["About", "Blog", "Careers"] },
        { title: "Legal", items: ["Privacy", "Terms", "Contact"] },
      ]),
      social: JSON.stringify([
        { name: "Twitter", url: "#" },
        { name: "LinkedIn", url: "#" },
        { name: "GitHub", url: "#" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
      padding: "4rem 1.5rem 2rem",
    },
  },
  {
    id: "sub-footer",
    name: "Sub Footer",
    category: "footer",
    componentType: "SubFooter",
    defaultContent: {
      copyright: "© 2025 Company Name. All rights reserved.",
      links: JSON.stringify([
        { text: "Privacy Policy", link: "#" },
        { text: "Terms of Service", link: "#" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#0f0f1a",
      textColor: "#999999",
      padding: "1.5rem",
      textAlign: "center",
    },
  },

  // Layout/Structure
  {
    id: "sidebar-layout",
    name: "Sidebar Layout",
    category: "layout",
    componentType: "SidebarLayout",
    defaultContent: {
      sidebarTitle: "Navigation",
      sidebarItems: JSON.stringify(["Item 1", "Item 2", "Item 3"]),
      mainContent: "Main content goes here",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "2rem 1.5rem",
    },
  },
  {
    id: "section-wrapper",
    name: "Section Wrapper",
    category: "layout",
    componentType: "SectionWrapper",
    defaultContent: {
      content: "Wrapped content",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
      maxWidth: "1200px",
    },
  },
  {
    id: "full-width-section",
    name: "Full Width Section",
    category: "layout",
    componentType: "FullWidthSection",
    defaultContent: {
      content: "Full width content",
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 0",
    },
  },
  {
    id: "boxed-section",
    name: "Boxed Section",
    category: "layout",
    componentType: "BoxedSection",
    defaultContent: {
      content: "Boxed content with padding",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
      maxWidth: "800px",
    },
  },
  {
    id: "split-layout",
    name: "Split Layout (50/50)",
    category: "layout",
    componentType: "SplitLayout",
    defaultContent: {
      leftContent: "Left side content",
      rightContent: "Right side content",
      ratio: "50/50",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "grid-2-col",
    name: "2-Column Grid",
    category: "layout",
    componentType: "Grid2Col",
    defaultContent: {
      items: JSON.stringify(["Item 1", "Item 2", "Item 3", "Item 4"]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "grid-3-col",
    name: "3-Column Grid",
    category: "layout",
    componentType: "Grid3Col",
    defaultContent: {
      items: JSON.stringify(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "grid-4-col",
    name: "4-Column Grid",
    category: "layout",
    componentType: "Grid4Col",
    defaultContent: {
      items: JSON.stringify(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8"]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "masonry-grid",
    name: "Masonry Grid",
    category: "layout",
    componentType: "MasonryGrid",
    defaultContent: {
      items: JSON.stringify([
        { content: "Item 1", height: "200px" },
        { content: "Item 2", height: "300px" },
        { content: "Item 3", height: "250px" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "card-grid",
    name: "Card Grid",
    category: "layout",
    componentType: "CardGrid",
    defaultContent: {
      cards: JSON.stringify([
        { title: "Card 1", content: "Description" },
        { title: "Card 2", content: "Description" },
        { title: "Card 3", content: "Description" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "row-stack",
    name: "Row/Stack",
    category: "layout",
    componentType: "RowStack",
    defaultContent: {
      items: JSON.stringify(["Item 1", "Item 2", "Item 3"]),
      direction: "row",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "2rem 1.5rem",
    },
  },
  {
    id: "spacer-divider",
    name: "Spacer/Divider",
    category: "layout",
    componentType: "SpacerDivider",
    defaultContent: {
      type: "line",
      height: "2px",
    },
    defaultStyle: {
      backgroundColor: "transparent",
      textColor: "#cccccc",
      padding: "2rem 1.5rem",
    },
  },
  {
    id: "background-section",
    name: "Background Section",
    category: "layout",
    componentType: "BackgroundSection",
    defaultContent: {
      content: "Content with custom background",
      backgroundType: "gradient",
      backgroundValue: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    defaultStyle: {
      textColor: "#ffffff",
      padding: "6rem 1.5rem",
      textAlign: "center",
    },
  },

  // Conversion/Sales
  {
    id: "offer-stack",
    name: "Offer Stack",
    category: "conversion",
    componentType: "OfferStack",
    defaultContent: {
      title: "Everything You Get",
      items: JSON.stringify([
        { name: "Main Product", value: "$299" },
        { name: "Bonus #1", value: "$99" },
        { name: "Bonus #2", value: "$149" },
      ]),
      totalValue: "$547",
      yourPrice: "$99",
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "bonus-stack",
    name: "Bonus Stack",
    category: "conversion",
    componentType: "BonusStack",
    defaultContent: {
      title: "Plus These Exclusive Bonuses",
      bonuses: JSON.stringify([
        { title: "Bonus #1", description: "Amazing value", value: "$99" },
        { title: "Bonus #2", description: "Incredible resource", value: "$149" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "scarcity-section",
    name: "Scarcity Section",
    category: "conversion",
    componentType: "ScarcitySection",
    defaultContent: {
      title: "Only 5 Spots Remaining!",
      message: "This offer expires in:",
      urgency: "Don't miss out on this limited opportunity",
    },
    defaultStyle: {
      backgroundColor: "#ff6b6b",
      textColor: "#ffffff",
      padding: "3rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "upsell-crosssell",
    name: "Upsell/Cross-sell",
    category: "conversion",
    componentType: "UpsellCrosssell",
    defaultContent: {
      title: "You Might Also Like",
      products: JSON.stringify([
        { name: "Premium Package", price: "$199", image: "/placeholder.svg?height=200&width=200" },
        { name: "Pro Add-on", price: "$49", image: "/placeholder.svg?height=200&width=200" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "checkout-embed",
    name: "Checkout Embed",
    category: "conversion",
    componentType: "CheckoutEmbed",
    defaultContent: {
      title: "Complete Your Purchase",
      productName: "Premium Plan",
      price: "$99/month",
      buttonText: "Buy Now",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "payment-button",
    name: "Payment Button",
    category: "conversion",
    componentType: "PaymentButton",
    defaultContent: {
      buttonText: "Buy Now - $99",
      guarantee: "30-Day Money Back Guarantee",
      secure: "Secure Checkout with SSL Encryption",
    },
    defaultStyle: {
      backgroundColor: "#f8f9fa",
      textColor: "#1a1a2e",
      padding: "3rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "lead-magnet-optin",
    name: "Lead Magnet Opt-in",
    category: "conversion",
    componentType: "LeadMagnetOptin",
    defaultContent: {
      title: "Download Your Free Guide",
      subtitle: "Learn the secrets to success in just 10 pages",
      imageUrl: "/ebook-cover.png",
      buttonText: "Get Instant Access",
      privacy: "We never share your email. Unsubscribe anytime.",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a2e",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "product-grid",
    name: "Product Grid",
    category: "ecommerce",
    componentType: "ProductGrid",
    defaultContent: {
      title: "Our Products",
      products: JSON.stringify([
        { name: "Product 1", description: "High quality product", price: "99.99", image: "/diverse-products-still-life.png" },
        { name: "Product 2", description: "Premium edition", price: "149.99", image: "/diverse-products-still-life.png" },
        { name: "Product 3", description: "Best value", price: "79.99", image: "/diverse-products-still-life.png" },
        { name: "Product 4", description: "Limited edition", price: "199.99", image: "/diverse-products-still-life.png" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f9fafb",
      textColor: "#111827",
      padding: "5rem 1.5rem",
      textAlign: "center",
    },
  },
  {
    id: "featured-product",
    name: "Featured Product",
    category: "ecommerce",
    componentType: "FeaturedProduct",
    defaultContent: {
      title: "Premium Wireless Headphones",
      badge: "New Release",
      description: "Experience crystal-clear sound with our latest noise-cancelling technology",
      price: "299.99",
      originalPrice: "399.99",
      image: "/premium-headphones.png",
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#111827",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "product-comparison",
    name: "Product Comparison",
    category: "ecommerce",
    componentType: "ProductComparison",
    defaultContent: {
      title: "Compare Our Products",
      products: JSON.stringify([
        { name: "Basic", features: [true, false, false, false] },
        { name: "Pro", features: [true, true, true, false] },
        { name: "Enterprise", features: [true, true, true, true] },
      ]),
      features: JSON.stringify(["Feature 1", "Feature 2", "Feature 3", "Feature 4"]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#111827",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "product-highlights",
    name: "Product Highlights",
    category: "ecommerce",
    componentType: "ProductHighlights",
    defaultContent: {
      title: "Why Choose This Product",
      highlights: JSON.stringify([
        { icon: "⚡", title: "Fast Performance", description: "Optimized for speed and efficiency" },
        { icon: "🔒", title: "Secure", description: "Enterprise-grade security built-in" },
        { icon: "🎨", title: "Beautiful Design", description: "Sleek and modern aesthetic" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f9fafb",
      textColor: "#111827",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "product-specs",
    name: "Product Specifications",
    category: "ecommerce",
    componentType: "ProductSpecs",
    defaultContent: {
      title: "Technical Specifications",
      specs: JSON.stringify([
        { label: "Dimensions", value: "10 x 5 x 2 inches" },
        { label: "Weight", value: "1.2 lbs" },
        { label: "Material", value: "Aluminum & Glass" },
        { label: "Color Options", value: "Black, Silver, Gold" },
        { label: "Warranty", value: "2 Years" },
        { label: "Battery Life", value: "Up to 24 hours" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#111827",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "add-to-cart",
    name: "Add to Cart Section",
    category: "ecommerce",
    componentType: "AddToCart",
    defaultContent: {
      title: "Add to Cart",
      buttonText: "Add to Cart - $299.99",
      description: "Free shipping on orders over $100. 30-day money-back guarantee.",
    },
    defaultStyle: {
      backgroundColor: "#f9fafb",
      textColor: "#111827",
      padding: "3rem 1.5rem",
    },
  },
  {
    id: "cart-summary",
    name: "Cart Summary",
    category: "ecommerce",
    componentType: "CartSummary",
    defaultContent: {
      title: "Order Summary",
      items: JSON.stringify([
        { name: "Wireless Headphones", quantity: 1, price: "299.99" },
        { name: "Carrying Case", quantity: 1, price: "49.99" },
      ]),
      subtotal: "349.98",
      shipping: "9.99",
      tax: "28.00",
      total: "387.97",
      buttonText: "Proceed to Checkout",
    },
    defaultStyle: {
      backgroundColor: "#f9fafb",
      textColor: "#111827",
      padding: "3rem 1.5rem",
    },
  },
  {
    id: "bundle-offers",
    name: "Bundle Offers",
    category: "ecommerce",
    componentType: "BundleOffers",
    defaultContent: {
      title: "Special Bundle Offers",
      bundles: JSON.stringify([
        {
          badge: "Best Value",
          name: "Complete Bundle",
          price: "399",
          savings: "150",
          items: ["Main Product", "Premium Case", "Extra Accessories", "1 Year Extended Warranty"],
        },
        {
          badge: "Popular",
          name: "Starter Bundle",
          price: "299",
          savings: "80",
          items: ["Main Product", "Basic Case", "Standard Accessories"],
        },
        {
          badge: "Essential",
          name: "Basic Bundle",
          price: "249",
          savings: "40",
          items: ["Main Product", "Basic Accessories"],
        },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#111827",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "related-products",
    name: "Related Products",
    category: "ecommerce",
    componentType: "RelatedProducts",
    defaultContent: {
      title: "You May Also Like",
      products: JSON.stringify([
        { name: "Product A", price: "129.99", image: "/diverse-products-still-life.png" },
        { name: "Product B", price: "89.99", image: "/diverse-products-still-life.png" },
        { name: "Product C", price: "149.99", image: "/diverse-products-still-life.png" },
        { name: "Product D", price: "99.99", image: "/diverse-products-still-life.png" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f9fafb",
      textColor: "#111827",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "recently-viewed",
    name: "Recently Viewed",
    category: "ecommerce",
    componentType: "RecentlyViewed",
    defaultContent: {
      title: "Recently Viewed Products",
      products: JSON.stringify([
        { name: "Smart Watch", price: "249.99", image: "/modern-smartwatch.png" },
        { name: "Laptop Stand", price: "49.99", image: "/laptop-stand.png" },
        { name: "Wireless Mouse", price: "79.99", image: "/wireless-mouse.png" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#111827",
      padding: "4rem 1.5rem",
    },
  },
  {
    id: "subscription-plans",
    name: "Subscription Plans",
    category: "ecommerce",
    componentType: "SubscriptionPlans",
    defaultContent: {
      title: "Choose Your Plan",
      subtitle: "Select the perfect subscription for your needs",
      plans: JSON.stringify([
        {
          name: "Basic",
          price: "9.99",
          interval: "month",
          popular: false,
          features: ["5 Projects", "10GB Storage", "Basic Support", "Monthly Updates"],
        },
        {
          name: "Pro",
          price: "29.99",
          interval: "month",
          popular: true,
          features: ["Unlimited Projects", "100GB Storage", "Priority Support", "Daily Updates", "Advanced Features"],
        },
        {
          name: "Enterprise",
          price: "99.99",
          interval: "month",
          popular: false,
          features: [
            "Unlimited Everything",
            "1TB Storage",
            "24/7 Dedicated Support",
            "Real-time Updates",
            "Custom Features",
            "SLA Guarantee",
          ],
        },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#f9fafb",
      textColor: "#111827",
      padding: "5rem 1.5rem",
    },
  },
  {
    id: "digital-download",
    name: "Digital Download Section",
    category: "ecommerce",
    componentType: "DigitalDownload",
    defaultContent: {
      title: "Download Your Files",
      note: "Your downloads will be available for 7 days. Please save them to your device.",
      files: JSON.stringify([
        { name: "User Guide.pdf", size: "2.4 MB", icon: "📄" },
        { name: "Installation Files.zip", size: "156 MB", icon: "📦" },
        { name: "License Key.txt", size: "1 KB", icon: "🔑" },
        { name: "Quick Start Video.mp4", size: "45 MB", icon: "🎥" },
      ]),
    },
    defaultStyle: {
      backgroundColor: "#ffffff",
      textColor: "#111827",
      padding: "4rem 1.5rem",
    },
  },
]
