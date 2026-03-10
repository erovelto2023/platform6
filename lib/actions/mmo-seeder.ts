"use server";

import connectToDatabase from "@/lib/db/connect";
import GlossaryTerm from "@/lib/db/models/GlossaryTerm";
import { slugify, makeUniqueSlug } from "@/lib/utils/slugify";
import { revalidatePath } from "next/cache";

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

export async function seedMMOGlossary() {
  try {
    await connectToDatabase();
    
    // Get existing terms to avoid duplicates by term name
    const existingTerms = await GlossaryTerm.find({}, { term: 1, slug: 1 }).lean();
    const existingTermNames = new Set(existingTerms.map((t: any) => t.term.toLowerCase()));
    const existingSlugs = existingTerms.map((t: any) => t.slug).filter(Boolean);

    let createdCount = 0;
    const newTerms = [];

    for (const group of MMO_GLOSSARY_DATA) {
      for (const termName of group.terms) {
        if (!existingTermNames.has(termName.toLowerCase())) {
          const baseSlug = slugify(termName);
          const slug = makeUniqueSlug(baseSlug, existingSlugs);
          existingSlugs.push(slug);

          newTerms.push({
            id: `g-mmo-${Date.now()}-${createdCount}`,
            term: termName,
            slug,
            category: group.category,
            niche: group.category, // Keep sync for legacy
            shortDefinition: `Learn the fundamentals of ${termName} in the context of making money online.`,
            definition: `Detailed guide for ${termName} coming soon.`,
            status: "Draft",
            aiTrainingEligible: true
          });
          createdCount++;
        }
      }
    }

    if (newTerms.length > 0) {
      await GlossaryTerm.insertMany(newTerms);
    }

    revalidatePath("/admin/glossary");
    revalidatePath("/glossary");
    
    return { success: true, count: newTerms.length };
  } catch (error: any) {
    console.error("Error seeding MMO glossary:", error);
    return { error: error.message || "Failed to seed glossary" };
  }
}
