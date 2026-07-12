import mongoose from 'mongoose';
import User from '@/lib/db/models/User';

// Re-export User model from platform6
export { User };

// 1. Author Schema
const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String },
  credentials: { type: String },
  avatarUrl: { type: String },
  verificationBadge: { type: Boolean, default: false }
});

export const Author = mongoose.models.Author || mongoose.model('Author', AuthorSchema);

// 2. Product Schema -> Renamed to PublishingProduct internally to prevent conflict with platform6's Product model
const PublishingProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['ebook', 'course', 'service'], required: true },
  price: { type: Number, required: true },
  stripePriceId: { type: String },
  description: { type: String },
  landingPageUrl: { type: String },
  gatewayId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentGateway' },
  curriculum: { type: String, default: '' }
});

export const Product = mongoose.models.PublishingProduct || mongoose.model('PublishingProduct', PublishingProductSchema);

// 3. Pillar Page Schema
const PillarPageSchema = new mongoose.Schema({
  keyword: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  metaDescription: { type: String, required: true },
  heroTitle: { type: String },
  heroSubtitle: { type: String },
  introductionText: { type: String },
  primaryProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'PublishingProduct' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  // Niche Branding Fields
  accentColor: { type: String, default: '' },          // Per-hub --hub-accent override (hex)
  icon: { type: String, default: '📄' },               // Emoji for hub card/badge
  category: { type: String, default: 'General' },      // Grouping label (Pets, Finance, etc.)
  isPublished: { type: Boolean, default: true },        // Public visibility toggle
  trustBadges: [{ type: String }],                      // Replaces hardcoded "Reviewed by DVMs"
  affiliateDisclosure: { type: String },                // Per-hub affiliate disclaimer
  coverImageUrl: { type: String },                      // Optional hero background image
  updatedAt: { type: Date, default: Date.now }
});

export const PillarPage = mongoose.models.PillarPage || mongoose.model('PillarPage', PillarPageSchema);

// 4. Blog Post Schema (Linked to Pillar)
const BlogPostSchema = new mongoose.Schema({
  pillarId: { type: mongoose.Schema.Types.ObjectId, ref: 'PillarPage', required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  isFeatured: { type: Boolean, default: false },
  readTime: { type: String, default: '5 mins' }
});

export const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

// 5. Glossary Schema (Linked to Pillar for semantic SEO)
const GlossarySchema = new mongoose.Schema({
  pillarId: { type: mongoose.Schema.Types.ObjectId, ref: 'PillarPage', required: true },
  term: { type: String, required: true },
  definition: { type: String, required: true },
  slug: { type: String, required: true }
});

GlossarySchema.index({ pillarId: 1, term: 1 }, { unique: true });

export const Glossary = mongoose.models.Glossary || mongoose.model('Glossary', GlossarySchema);

// 6. Directory Schema (Affiliate & Resource Links)
const DirectorySchema = new mongoose.Schema({
  pillarId: { type: mongoose.Schema.Types.ObjectId, ref: 'PillarPage', required: true },
  resourceName: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  affiliateUrl: { type: String },
  rating: { type: Number, default: 5 },
  isSponsored: { type: Boolean, default: false }
});

export const Directory = mongoose.models.Directory || mongoose.model('Directory', DirectorySchema);

// 8. Payment Gateway Schema
const PaymentGatewaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['stripe', 'simulate'], required: true },
  stripeSecretKey: { type: String },
  stripePublishableKey: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const PaymentGateway = mongoose.models.PaymentGateway || mongoose.model('PaymentGateway', PaymentGatewaySchema);

// 9. Product Funnel Schema
const ProductFunnelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  primaryProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'PublishingProduct', required: true },
  upsellProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'PublishingProduct' },
  downsellProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'PublishingProduct' },
  createdAt: { type: Date, default: Date.now }
});

export const ProductFunnel = mongoose.models.ProductFunnel || mongoose.model('ProductFunnel', ProductFunnelSchema);

// 10. Site Theme Schema — Singleton document storing all CSS design tokens
const SiteThemeSchema = new mongoose.Schema({
  name: { type: String, default: 'Default Dark' },
  isDefault: { type: Boolean, default: true },

  // -- Global Brand --
  colorPrimary: { type: String, default: '#6366f1' },
  colorPrimaryHover: { type: String, default: '#4f46e5' },
  colorAccent: { type: String, default: '#f59e0b' },
  colorSuccess: { type: String, default: '#10b981' },
  colorDanger: { type: String, default: '#ef4444' },

  // -- Global Surfaces --
  colorBg: { type: String, default: '#020617' },
  colorSurface: { type: String, default: '#0f172a' },
  colorSurface2: { type: String, default: '#1e293b' },
  colorBorder: { type: String, default: '#334155' },
  colorText: { type: String, default: '#f8fafc' },
  colorTextMuted: { type: String, default: '#94a3b8' },

  // -- Navigation Bar --
  navBg: { type: String, default: '#0f172a' },
  navBorder: { type: String, default: '#1e293b' },
  navText: { type: String, default: '#f8fafc' },
  navBrand: { type: String, default: '#6366f1' },

  // -- Hub / Content Page Hero --
  hubHeroFrom: { type: String, default: '#0f172a' },
  hubHeroTo: { type: String, default: '#1e1b4b' },
  hubHeroText: { type: String, default: '#f8fafc' },
  hubAccent: { type: String, default: '#6366f1' },

  // -- Checkout / Sales Page --
  checkoutBg: { type: String, default: '#020617' },
  checkoutCard: { type: String, default: '#0f172a' },
  checkoutBtn: { type: String, default: '#6366f1' },
  checkoutBtnHover: { type: String, default: '#4f46e5' },

  // -- Upsell Page --
  upsellBanner: { type: String, default: '#78350f' },
  upsellBannerText: { type: String, default: '#fef3c7' },
  upsellBtn: { type: String, default: '#f59e0b' },

  // -- Downsell Page --
  downsellBanner: { type: String, default: '#1e1b4b' },
  downsellBtn: { type: String, default: '#6366f1' },

  // -- Course / Product Viewer --
  courseBg: { type: String, default: '#020617' },
  courseHeader: { type: String, default: '#0f172a' },
  coursePlayBtn: { type: String, default: '#6366f1' },

  // -- Admin Panel --
  adminSidebar: { type: String, default: '#020617' },
  adminSidebarActive: { type: String, default: '#6366f1' },
  adminSurface: { type: String, default: '#0f172a' },

  updatedAt: { type: Date, default: Date.now }
});

export const SiteTheme = mongoose.models.SiteTheme || mongoose.model('SiteTheme', SiteThemeSchema);

// 11. StoryProject Schema (Story Hacker)
const StoryProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  isArchived: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Book Formatter Fields (Atticus Clone)
  subtitle: { type: String, default: '' },
  authorName: { type: String, default: '' },
  publisherName: { type: String, default: '' },
  publisherLink: { type: String, default: '' },
  copyrightText: { type: String, default: 'Copyright © 2026\n\nAll rights reserved.\n\nNo portion of this book may be reproduced in any form without written permission from the publisher or author, except as permitted by U.S. copyright law.' },
  coverImage: { type: String, default: '' },
  theme: { type: String, default: 'Aether' },
  manuscriptOrder: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const StoryProject = mongoose.models.StoryProject || mongoose.model('StoryProject', StoryProjectSchema);

// 12. StoryDocument Schema (Story Hacker)
const StoryDocumentSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoryProject', required: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Characters', 'worldbuilding', 'plot', 'manuscript', 'research', 'notes'],
    required: true 
  },
  content: { type: String, default: '' },
  aiAnalysis: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const StoryDocument = mongoose.models.StoryDocument || mongoose.model('StoryDocument', StoryDocumentSchema);

// 13. TemplateFamily Schema (Level 1 Folder)
const TemplateFamilySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  isSystem: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const TemplateFamily = mongoose.models.TemplateFamily || mongoose.model('TemplateFamily', TemplateFamilySchema);

// 14. TemplateSubgenre Schema (Level 2 Folder)
const TemplateSubgenreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'TemplateFamily', required: true },
  isSystem: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const TemplateSubgenre = mongoose.models.TemplateSubgenre || mongoose.model('TemplateSubgenre', TemplateSubgenreSchema);

// 15. StoryTemplate Schema (Story Hacker)
const StoryTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'TemplateFamily' },
  subgenreId: { type: mongoose.Schema.Types.ObjectId, ref: 'TemplateSubgenre' },
  isSystem: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { 
    type: String, 
    enum: ['Characters', 'Plots', 'worldbuilding', 'Themes', 'Style', 'Tropes', 'Blurb'],
    required: true 
  },
  content: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const StoryTemplate = mongoose.models.StoryTemplate || mongoose.model('StoryTemplate', StoryTemplateSchema);

// 16. ChatPersona Schema (Story Hacker)
const ChatPersonaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  systemPrompt: { type: String, required: true },
  isSystem: { type: Boolean, default: false },
  isDefault: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const ChatPersona = mongoose.models.ChatPersona || mongoose.model('ChatPersona', ChatPersonaSchema);

// 17. StoryChat Schema (Story Hacker)
const StoryChatSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoryProject', required: true },
  name: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true }
  }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const StoryChat = mongoose.models.StoryChat || mongoose.model('StoryChat', StoryChatSchema);

// 18. BookTheme Schema (Story Hacker Formatter)
const BookThemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isSystem: { type: Boolean, default: false }, // true for default templates like Dragon, Aether

  // Trim Size
  trimSize: { type: String, default: '5x8' },
  trimUnit: { type: String, enum: ['inches', 'mm'], default: 'inches' },

  // Typography
  bodyFont: { type: String, default: 'Palatino' },
  fontSize: { type: Number, default: 11 }, // pt
  lineSpacing: { type: Number, default: 1.25 },
  largePrint: { type: Boolean, default: false },
  
  // Print Layout
  marginInside: { type: Number, default: 0.875 },
  marginOutside: { type: Number, default: 0.5 },
  indentSize: { type: Number, default: 0.15 },
  alignment: { type: String, enum: ['justified', 'left'], default: 'justified' },
  hyphens: { type: Boolean, default: true },
  layoutPriority: { type: String, enum: ['widows', 'balanced', 'hybrid'], default: 'widows' },
  
  // Chapter Heading
  chapterNumberEnabled: { type: Boolean, default: true },
  
  chapterTitleEnabled: { type: Boolean, default: true },
  chapterHeadingFont: { type: String, default: 'Palatino' },
  chapterHeadingAlign: { type: String, enum: ['left', 'center', 'right'], default: 'center' },
  chapterHeadingStyle: { type: String, enum: ['Regular', 'Bold', 'Italic', 'Bold Italic'], default: 'Regular' },
  chapterHeadingSize: { type: Number, default: 24 },
  chapterHeadingWidth: { type: Number, default: 100 },
  
  chapterSubtitleEnabled: { type: Boolean, default: false },
  
  chapterImageEnabled: { type: Boolean, default: false },
  chapterIndividualImages: { type: Boolean, default: false },
  chapterImageGlobalUrl: { type: String, default: '' },
  chapterImagePlacement: { type: String, enum: ['Above Chapter #', 'Above Chapter Title', 'Below Chapter Title', 'Below Subtitle', 'Background Image'], default: 'Below Chapter Title' },
  chapterImageWidth: { type: Number, default: 100 },
  chapterImageAlign: { type: String, enum: ['left', 'center', 'right'], default: 'center' },
  
  chapterHeadingDropCap: { type: Boolean, default: false },
  
  // Subheading
  subheadingFont: { type: String, default: 'Palatino' },
  subheadingSize: { type: Number, default: 14 },
  subheadingAlign: { type: String, enum: ['left', 'center', 'right'], default: 'left' },
  
  // Scene Break
  sceneBreakType: { type: String, enum: ['text', 'image', 'blank'], default: 'text' },
  sceneBreakText: { type: String, default: '***' },
  sceneBreakImage: { type: String, default: '' },
  
  // Header / Footer
  headerLayout: { type: String, default: 'Author - Title' },
  headerFont: { type: String, default: 'Palatino' },
  headerSize: { type: Number, default: 10 },
  footerFont: { type: String, default: 'Palatino' },
  footerSize: { type: Number, default: 10 },
  
  // Notes
  pdfFootnotes: { type: String, enum: ['Footnotes', 'End of chapter', 'End of book'], default: 'Footnotes' },
  epubFootnotes: { type: String, enum: ['End of chapter', 'End of book'], default: 'End of chapter' },
  footnoteSize: { type: Number, default: 0.75 }, // relative multiplier e.g. 0.75x

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const BookTheme = mongoose.models.BookTheme || mongoose.model('BookTheme', BookThemeSchema);
