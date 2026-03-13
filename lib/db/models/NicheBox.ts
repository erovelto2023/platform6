import mongoose from 'mongoose';

// SEO Keyword Schema
const SEOKeywordSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  searchVolume: { type: String, default: '' },
  searchIntent: { type: String, default: '' },
  serpFeatures: { type: String, default: '' },
  cpc: { type: String, default: '' },
  competitionDifficulty: { type: String, default: '' }
}, { _id: false });

// Market Trend Schema
const MarketTrendSchema = new mongoose.Schema({
  query: { type: String, default: '' },
  search: { type: String, default: '' },
  interest: { type: String, default: '' },
  increase: { type: String, default: '' }
}, { _id: false });

// Content Asset Schema
const ContentAssetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  type: { type: String, default: 'Document' },
  fileUrl: { type: String, default: '' },
  link: { type: String, default: '' },
  fileName: { type: String, default: '' },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

// Business Model Schema
const BusinessModelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  profitPotential: { type: String, default: '' }
}, { _id: false });

// Recommended Tool Schema
const RecommendedToolSchema = new mongoose.Schema({
  toolName: { type: String, required: true },
  cost: { type: String, default: '' },
  purpose: { type: String, default: '' },
  priority: { type: String, default: 'Medium' },
  affiliateLink: { type: String, default: '' }
}, { _id: false });

// Customer Avatar Schema
const CustomerAvatarSchema = new mongoose.Schema({
  demographics: {
    age: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    educationLevel: { type: String, default: '' },
    incomeLevel: { type: String, default: '' },
    familyStatus: { type: String, default: '' }
  },
  psychographics: {
    coreValues: { type: String, default: '' },
    beliefs: { type: String, default: '' },
    interestsHobbies: { type: String, default: '' },
    lifestyleTraits: { type: String, default: '' },
    personalityType: { type: String, default: '' }
  },
  professional: {
    occupation: { type: String, default: '' },
    industry: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    dailyResponsibilities: { type: String, default: '' }
  },
  psychology: {
    painPoints: { type: String, default: '' },
    frustrations: { type: String, default: '' },
    biggestChallenges: { type: String, default: '' },
    obstaclesToSuccess: { type: String, default: '' },
    primaryGoals: { type: String, default: '' },
    deepestDesires: { type: String, default: '' },
    aspirations: { type: String, default: '' },
    fears: { type: String, default: '' },
    whatKeepsThemUpAtNight: { type: String, default: '' },
    commonObjections: { type: String, default: '' },
    buyingHesitations: { type: String, default: '' }
  },
  informationDiet: {
    favoriteBlogsWebsites: { type: String, default: '' },
    topPodcasts: { type: String, default: '' },
    gurusInfluencers: { type: String, default: '' },
    primarySocialMedia: { type: String, default: '' },
    booksMagazines: { type: String, default: '' }
  },
  buyingBehavior: {
    decisionMakingProcess: { type: String, default: '' },
    priceSensitivity: { type: String, default: '' },
    keyPurchasingDrivers: { type: String, default: '' },
    brandAffinities: { type: String, default: '' }
  }
}, { _id: false });

// Roadmap Phase Schema
const RoadmapPhaseSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  duration: { type: String, default: '4 weeks' },
  budget: { type: String, default: '$500' },
  description: { type: String, default: '' },
  tasks: [{ type: String, default: '' }]
}, { _id: false });

// Content Ideas Schema
const ContentIdeasSchema = new mongoose.Schema({
  social: { type: String, default: '' },
  video: { type: String, default: '' },
  products: { type: String, default: '' },
  articles: { type: String, default: '' },
  questions: { type: String, default: '' },
  audience: { type: String, default: '' },
  visual: { type: String, default: '' },
  pinterest: { type: String, default: '' },
  youtube: { type: String, default: '' },
  tiktok: { type: String, default: '' },
  instagram: { type: String, default: '' },
  instagramReel: { type: String, default: '' },
  facebook: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  podcast: { type: String, default: '' },
  shortForm: { type: String, default: '' },
  longForm: { type: String, default: '' },
  liveStream: { type: String, default: '' },
  amazon: { type: String, default: '' },
  etsy: { type: String, default: '' },
  digital: { type: String, default: '' },
  printOnDemand: { type: String, default: '' },
  merchandise: { type: String, default: '' },
  course: { type: String, default: '' },
  miniCourse: { type: String, default: '' },
  membership: { type: String, default: '' },
  subscription: { type: String, default: '' },
  bundle: { type: String, default: '' },
  template: { type: String, default: '' },
  printable: { type: String, default: '' },
  blogPost: { type: String, default: '' },
  article: { type: String, default: '' },
  guide: { type: String, default: '' },
  tutorial: { type: String, default: '' },
  caseStudy: { type: String, default: '' },
  listicle: { type: String, default: '' },
  opinion: { type: String, default: '' },
  beginnerGuide: { type: String, default: '' },
  advancedStrategy: { type: String, default: '' },
  stepByStep: { type: String, default: '' },
  comparison: { type: String, default: '' },
  review: { type: String, default: '' },
  toolsList: { type: String, default: '' },
  leadMagnet: { type: String, default: '' },
  ebook: { type: String, default: '' },
  workbook: { type: String, default: '' },
  checklist: { type: String, default: '' },
  cheatSheet: { type: String, default: '' },
  framework: { type: String, default: '' },
  swipeFile: { type: String, default: '' },
  resourceList: { type: String, default: '' },
  toolkit: { type: String, default: '' },
  faq: { type: String, default: '' },
  beginnerQuestions: { type: String, default: '' },
  advancedQuestions: { type: String, default: '' },
  expertQuestions: { type: String, default: '' },
  troubleshooting: { type: String, default: '' },
  problemSolving: { type: String, default: '' },
  mythVsFact: { type: String, default: '' },
  debate: { type: String, default: '' },
  whatVsWhy: { type: String, default: '' },
  howTo: { type: String, default: '' },
  whenTo: { type: String, default: '' },
  whereTo: { type: String, default: '' },
  trending: { type: String, default: '' },
  seasonal: { type: String, default: '' },
  evergreen: { type: String, default: '' },
  communityDiscussion: { type: String, default: '' },
  forumThread: { type: String, default: '' },
  poll: { type: String, default: '' },
  survey: { type: String, default: '' },
  ama: { type: String, default: '' },
  painPoints: { type: String, default: '' },
  problems: { type: String, default: '' },
  goals: { type: String, default: '' },
  desires: { type: String, default: '' },
  objections: { type: String, default: '' },
  mistakes: { type: String, default: '' },
  fears: { type: String, default: '' },
  contentSeries: { type: String, default: '' },
  challenge: { type: String, default: '' },
  daily: { type: String, default: '' },
  weekly: { type: String, default: '' },
  educationalSeries: { type: String, default: '' },
  storytelling: { type: String, default: '' },
  infographic: { type: String, default: '' },
  visualGuide: { type: String, default: '' },
  dataVisualization: { type: String, default: '' },
  mindMap: { type: String, default: '' },
  flowchart: { type: String, default: '' },
  brandStory: { type: String, default: '' },
  founderStory: { type: String, default: '' },
  behindScenes: { type: String, default: '' },
  dayInLife: { type: String, default: '' },
  processBreakdown: { type: String, default: '' },
  industryTrend: { type: String, default: '' },
  marketAnalysis: { type: String, default: '' },
  futurePredictions: { type: String, default: '' },
  innovation: { type: String, default: '' },
  toolList: { type: String, default: '' },
  resourceRoundup: { type: String, default: '' },
  softwareComparison: { type: String, default: '' },
  workflow: { type: String, default: '' },
  habit: { type: String, default: '' },
  productivity: { type: String, default: '' },
  goalSetting: { type: String, default: '' },
  mindset: { type: String, default: '' },
  successPrinciples: { type: String, default: '' },
  mythBusting: { type: String, default: '' },
  commonMistakes: { type: String, default: '' },
  beginnerPitfalls: { type: String, default: '' },
  expertSecrets: { type: String, default: '' },
  littleKnownTips: { type: String, default: '' }
}, { _id: false });

// Research Schema
const ResearchSchema = new mongoose.Schema({
  marketOverview: { type: String, default: '' },
  topTrends: [MarketTrendSchema],
  risingTrends: [MarketTrendSchema],
  opportunities: [{ type: String }]
}, { _id: false });

// Main NicheBox Schema
const NicheBoxSchema = new mongoose.Schema({
  // Form 1 - Niche Setup
  nicheName: { type: String, required: true },
  nicheSlug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  competition: { type: String, enum: ['Low', 'Medium', 'Hard', 'Master'], default: 'Medium' },
  marketSize: { type: String, default: '' },
  growthRate: { type: String, default: '' },
  
  // Form 2 - Research
  research: ResearchSchema,
  
  // Form 2.5 - Avatar
  customerAvatar: CustomerAvatarSchema,

  // Form 3 - SEO Keywords
  keywords: [SEOKeywordSchema],
  
  // Form 4 - Content Assets
  assets: [ContentAssetSchema],
  
  // Form 5 - Roadmap
  phases: [RoadmapPhaseSchema],

  // Form 6 - Business Models
  businessModels: [BusinessModelSchema],

  // Form 7 - Recommended Tools
  recommendedTools: [RecommendedToolSchema],
  
  // Form 8 - Content Ideas
  ideas: ContentIdeasSchema,
  
  // Additional Meta
  estimatedValue: { type: String, default: '' },
  thumbnailImage: { type: String, default: '' },
  heroImage: { type: String, default: '' },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  featured: { type: Boolean, default: false },
  downloadCount: { type: Number, default: 0 }
});

// Removed redundant pre('save') hook that caused 'next is not a function'

// Clear mongoose model in development to ensure HMR picks up schema changes
if (mongoose.models.NicheBox) {
  delete mongoose.models.NicheBox;
}

// Create and export the model
const NicheBox = mongoose.models.NicheBox || mongoose.model('NicheBox', NicheBoxSchema);

export default NicheBox;
