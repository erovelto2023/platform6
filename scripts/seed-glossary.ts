import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not found in .env.local');
  process.exit(1);
}

const terms = [
  {
    id: "term_001",
    term: "Acquisition Deals",
    slug: "acquisition-deals",
    shortDefinition: "The strategic process where one company purchases another to gain control, expand market share, or acquire talent/technology.",
    definition: "Acquisition deals are the lifeblood of corporate growth and strategic expansion. In these transactions, an acquiring company purchases a target company's assets or stock. This can range from small strategic 'acqui-hires' of talented engineering teams to multi-billion dollar mergers that reshape entire industries. Unlike mergers where companies combine as equals, acquisitions have a clear buyer and seller, though the transition can be friendly or hostile depending on board approval.",
    expandedExplanation: "In the modern economy, acquisitions are often driven by 'Buy vs Build' logic. Large tech giants like Google or Meta often acquire smaller startups because it is faster and more reliable than developing the same technology internally. These deals involve complex valuation models including Discounted Cash Flow (DCF), comparable company analysis, and precedent transactions. The 'Deal Lifecycle' typically spans 3 to 18 months, covering everything from the initial 'Letter of Intent' (LOI) to the final post-merger integration (PMI).",
    category: "Business Strategy",
    status: "Published",
    difficulty: "Intermediate",
    
    // Meaning & Context
    origin: "Rooted in early 20th-century industrial consolidations, the 'Modern Acquisition' era began in the 1980s with the rise of Leveraged Buyouts (LBOs) and private equity firms like KKR.",
    traditionalMeaning: "Historically, acquisitions were primarily used for 'Horizontal Integration' (buying competitors) to achieve monopoly-like scale in manufacturing.",
    whyItMatters: "For entrepreneurs, an acquisition is the ultimate 'exit' strategy. It provides liquidity for founders and investors, while for the economy, it ensures that capital and talent flow toward the most efficient management structures.",
    modernUsage: "Today, tech giants like Google and Meta use rapid acquisition deals to eliminate competition and acquire top-tier talent (acqui-hiring).",
    scientificPerspective: "Econometric studies show that 70-90% of M&A deals fail to meet their initial financial targets.",
    culturalNotes: "In high-trust societies, acquisitions are often handshake deals; in low-trust environments, they require thousands of pages of legal documentation.",
    
    // Application
    howItWorks: "The process starts with identifying synergy. The acquirer performs 'Financial Due Diligence' to verify numbers, 'Legal Due Diligence' to check for liabilities, and finally signs a 'Purchase Agreement'. Payment can be Cash, Stock, or a combination (Earn-outs).",
    bestFor: "Serial entrepreneurs, CEOs of scaling startups, and Private Equity associates looking to maximize ROI via portfolio expansion.",
    whoUsesIt: "Venture capitalists, investment bankers, serial entrepreneurs, and corporate development officers.",
    useCases: "Microsoft's $68.7B acquisition of Activision Blizzard to dominate the gaming sector, or Meta's $1B purchase of Instagram which secured their dominance in social mobile photos.",
    commonPractices: "Using Escrow accounts to hold funds during transition, hiring premium M&A advisors (Goldman Sachs, Morgan Stanley), and setting strict 'Non-Compete' clauses for exiting founders.",
    realExamples: "WhatsApp (acquired by Facebook), LinkedIn (acquired by Microsoft), and Beats by Dre (acquired by Apple).",
    
    // Perspectives
    beginnerExplanation: "Imagine you own a lemonade stand and you buy your neighbor's stand to own the whole block. That is an acquisition.",
    advancedPerspective: "Strategic buyers must account for WACC (Weighted Average Cost of Capital) and ensure that the IRR of the deal exceeding the cost of capital to avoid value destruction.",
    
    // Trust & Transparency
    sources: "Harvard Business Review, Investopedia, SEC Filings.",
    warningsOrNotes: "Antitrust laws (like the Sherman Act) can block large acquisitions if they create a monopoly.",
    misconceptions: "People often think all acquisitions are 'hostile'. In reality, most are friendly mergers negotiated between boards.",
    commonMistakes: "Overestimating synergies, ignoring cultural fit (the #1 reason deals fail), and failing to perform adequate due diligence on 'Hidden Liabilities'.",

    // Stats for Sidebar
    skillRequired: "Advanced",
    startupCost: "$100+",
    timeToFirstDollar: "6-18 Months",
    platformPreference: "LinkedIn, PitchBook, or Flippa for smaller deals",
    
    // Checklist
    gettingStartedChecklist: [
      "Define your 'Investment Thesis' (What is your goal?)",
      "Assemble a 'Deal Team' (Lawyer, Accountant, Broker)",
      "Secure financing (Debt, Equity, or Cash reserves)",
      "Perform multi-month Due Diligence (Financial, Legal, Technical)",
      "Draft and sign the Letter of Intent (LOI)",
      "Complete the Purchase Agreement and Close the Deal",
      "Initiate Post-Merger Integration (PMI) to align cultures"
    ],
    takeaways: [
      "Acquisitions are faster than organic growth.",
      "Due Diligence is non-negotiable.",
      "Culture determines the long-term success of the deal.",
      "Cash is king, but stock swaps minimize immediate taxes."
    ],
    
    // SEO & Social
    metaTitle: "Acquisition Deals: Execute Strategic M&A for Growth",
    metaDescription: "Master the art of acquisition deals. Learn how companies buy growth, the due diligence process, and real-world M&A examples.",
    keywords: ["M&A", "Acquisition", "Corporate Finance", "Exit Strategy"],
    
    // FAQs
    faqs: [
      {
        question: "What is the difference between a merger and an acquisition?",
        answer: "A merger is a 'marriage' of equals to form a new entity, while an acquisition is one company taking over another."
      },
      {
        question: "How long does a typical deal take?",
        answer: "Mid-market deals usually take 6-12 months from first meeting to closing."
      }
    ],
    
    // Prompts
    imagePrompt: "High-end corporate boardroom, cinematic lighting, indigo color palette, 8k, professional M&A atmosphere.",
    productPrompt: "Create a 5-step M&A Due Diligence Checklist Template for Notion.",
    socialPrompt: "Write a viral LinkedIn thread about the failure of the AOL-Time Warner merger.",
    
    relatedTermIds: ["term_002"],
    synonyms: ["M&A", "Buyout", "Takeover", "Corporate Merger"],
    niche: "Business Strategy"
  },
  {
    id: "term_002",
    term: "Affiliate Marketing",
    slug: "affiliate-marketing",
    shortDefinition: "A performance-based marketing strategy where a business rewards affiliates for each customer brought by their efforts.",
    definition: "Affiliate marketing is the process by which an affiliate earns a commission for marketing another person's or company's products. The affiliate simply searches for a product they enjoy, then promotes that product and earns a piece of the profit from each sale they make. The sales are tracked via affiliate links from one website to another.",
    category: "Business Strategy",
    status: "Published",
    difficulty: "Beginner",
    readingTime: "4 min",
    lastUpdated: new Date(),
    expandedExplanation: "This is a cornerstone of the modern internet economy. It allows brands to scale their marketing without upfront cost (only paying for performance) while allowing creators to monetize their audience.",
    bestFor: "Content creators, bloggers, and influencers.",
    whoUsesIt: "Amazon Associates, niche site owners, and SaaS companies.",
    faqs: [
      {
        question: "Is affiliate marketing free to start?",
        answer: "Usually, yes. Most affiliate programs are free to join."
      }
    ]
  }
];

const dummyUser = {
    clerkId: "user_3Bj6dEmUZDloX8iV0KxAgq1PIMS",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: [],
    notificationSettings: {
        mentions: true,
        directMessages: true,
        announcements: true,
        emailNotifications: false
    }
};

const MMO_GLOSSARY_DATA = [
  {
    category: "Business Models",
    terms: [
      "Affiliate Marketing", "Dropshipping", "Print on Demand (POD)", "Digital Products", "Online Courses",
      "Membership Sites", "Coaching/Consulting", "Freelancing", "SaaS (Software as a Service)", "Blogging",
      "YouTube Channel", "Podcasting", "Newsletter/Monetized Email", "Stock Photography/Digital Assets", "App Development"
    ]
  },
  {
    category: "Monetization Methods",
    terms: [
      "Ad Revenue (AdSense, Mediavine)", "Sponsorships", "Brand Deals", "Commission-Based Sales",
      "Recurring Revenue/Subscriptions", "One-Time Product Sales", "Lead Generation", "CPA (Cost Per Action)",
      "CPL (Cost Per Lead)", "Revenue Sharing", "Licensing Content", "White Labeling", "Reselling Rights (PLR/MRR)",
      "Donations/Tips (Ko-fi, Patreon)", "Crowdfunding"
    ]
  },
  {
    category: "Platforms & Channels",
    terms: [
      "Shopify", "WordPress", "Etsy", "Amazon FBA", "eBay", "TikTok Shop", "Instagram Shopping",
      "Pinterest Affiliate", "LinkedIn Consulting", "Substack", "Teachable/Thinkific", "Kajabi",
      "Gumroad", "ClickFunnels", "Stan Store"
    ]
  },
  {
    category: "Tools & Software",
    terms: [
      "Email Marketing (ConvertKit, MailerLite)", "SEO Tools (Ahrefs, SEMrush)", "Keyword Research Tools",
      "Social Media Schedulers (Buffer, Later)", "Canva/Design Tools", "Landing Page Builders",
      "Analytics Platforms (Google Analytics, Hotjar)", "Payment Processors (Stripe, PayPal)", "CRM Systems",
      "AI Content Tools", "Automation Tools (Zapier, Make)", "Webinar Platforms", "Community Platforms (Circle, Discord)",
      "Link-in-Bio Tools", "Tracking/Attribution Software"
    ]
  },
  {
    category: "Marketing Strategies",
    terms: [
      "Content Marketing", "SEO (Search Engine Optimization)", "Pinterest Marketing", "TikTok Growth Strategy",
      "Email Funnels", "Lead Magnets", "Webinars", "Retargeting Ads", "Influencer Collaborations",
      "Community Building", "Viral Loops/Referral Marketing", "Organic Social Growth", "Paid Ads (Meta, Google, TikTok)",
      "Copywriting Frameworks (AIDA, PAS)", "Storytelling for Conversion"
    ]
  },
  {
    category: "Skills & Concepts",
    terms: [
      "Niche Selection", "Audience Research", "Customer Avatar", "Value Ladder", "Sales Funnel",
      "Conversion Rate Optimization (CRO)", "A/B Testing", "Evergreen Content", "Trend-Jacking", "Personal Branding"
    ]
  },
  {
    category: "Revenue & Metrics",
    terms: [
      "RPM/CPM (Revenue Per Mille)", "LTV (Lifetime Value)", "CAC (Customer Acquisition Cost)",
      "ROI (Return on Investment)", "Break-Even Point", "Passive Income Ratio", "Churn Rate"
    ]
  },
  {
    category: "Growth & Scaling",
    terms: [
      "Outsourcing/Virtual Assistants", "Systems & SOPs", "Repurposing Content", "Cross-Promotion",
      "Joint Ventures", "Product Launches", "Evergreen Funnels", "Exit Strategy/Acquisition"
    ]
  }
];

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}

function makeUniqueSlug(slug: string, existingSlugs: string[]): string {
    if (!existingSlugs.includes(slug)) return slug;

    let counter = 1;
    let newSlug = `${slug}-${counter}`;
    while (existingSlugs.includes(newSlug)) {
        counter++;
        newSlug = `${slug}-${counter}`;
    }
    return newSlug;
}

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected successfully.');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is not active.');
    }
    const glossaryCollection = db.collection('glossaryterms');
    const userCollection = db.collection('users');

    // 1. Seed Glossary
    console.log('Cleaning existing glossary collection...');
    await glossaryCollection.deleteMany({});
    
    // Seed initial detailed terms
    const seededTerms: any[] = [...terms];
    const existingTermNames = new Set(seededTerms.map(t => t.term.toLowerCase()));
    const existingSlugs = seededTerms.map(t => t.slug).filter(Boolean);

    // Add MMO glossary terms
    let createdCount = 0;
    for (const group of MMO_GLOSSARY_DATA) {
      for (const termName of group.terms) {
        if (!existingTermNames.has(termName.toLowerCase())) {
          const baseSlug = slugify(termName);
          const slug = makeUniqueSlug(baseSlug, existingSlugs);
          existingSlugs.push(slug);

          seededTerms.push({
            id: `g-mmo-${Date.now()}-${createdCount}`,
            term: termName,
            slug,
            category: group.category,
            niche: group.category,
            shortDefinition: `Learn the fundamentals of ${termName} in the context of making money online.`,
            definition: `Detailed guide for ${termName} coming soon.`,
            status: "Published",
            difficulty: "Beginner",
            skillRequired: "Beginner",
            startupCost: "$0",
            timeToFirstDollar: "1-3 Months",
            isFeatured: false,
            views: 0,
            recommendedTools: [],
            createdAt: new Date(),
            updatedAt: new Date()
          });
          createdCount++;
        }
      }
    }

    console.log(`Seeding ${seededTerms.length} glossary terms with FULL depth...`);
    await glossaryCollection.insertMany(seededTerms.map(t => {
        // Ensure every term has default values if missing
        return {
            views: 0,
            isFeatured: false,
            recommendedTools: [],
            status: "Published",
            difficulty: "Beginner",
            skillRequired: "Beginner",
            startupCost: "$0",
            timeToFirstDollar: "1-3 Months",
            createdAt: new Date(),
            updatedAt: new Date(),
            ...t
        };
    }));
    console.log('✅ Glossary terms seeded.');

    // 2. Seed User
    console.log(`Checking for user ${dummyUser.clerkId}...`);
    await userCollection.updateOne(
        { clerkId: dummyUser.clerkId },
        { $setOnInsert: dummyUser },
        { upsert: true }
    );
    console.log(`✅ Success! Local user record ensured.`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seed();
