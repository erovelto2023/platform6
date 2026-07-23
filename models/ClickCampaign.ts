import mongoose, { Schema, Document } from "mongoose";

// 1. Brand Vault Schema
const BrandVaultSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    brandName: { type: String, required: true },
    brandVoice: { type: String, default: "Empowering, authoritative, friendly, authentic" },
    toneRules: { type: String, default: "Conversational, direct, no jargon, solution-oriented" },
    visualRules: { type: String, default: "Clean typography, high contrast, warm lighting, vibrant accents" },
    targetAudienceProfile: { type: String, default: "Aspiring entrepreneurs, side-hustlers, affiliate marketers" },
    primaryColor: { type: String, default: "#3b82f6" },
    secondaryColor: { type: String, default: "#10b981" },
    accentColor: { type: String, default: "#f59e0b" },
  },
  { timestamps: true }
);

// 2. Digital Asset Schema (DAM)
const DigitalAssetSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video", "logo", "palette", "document"], default: "image" },
    width: { type: Number, default: 1080 },
    height: { type: Number, default: 1080 },
    aspectRatio: { type: String, default: "1:1" },
    version: { type: String, default: "v1.0" },
    tags: [{ type: String }],
    category: { type: String, default: "Social Feed" },
    platformTarget: { type: String, default: "Meta" },
  },
  { timestamps: true }
);

// 3. Swipe File / Copy Vault Schema
const SwipeCopySchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    framework: { type: String, enum: ["AIDA", "PAS", "FAB", "4Ps", "Quest"], default: "AIDA" },
    platform: { type: String, default: "Meta" },
    rawAiCopy: { type: String, required: true },
    humanTouchCopy: { type: String, default: "" },
    performanceTag: { type: String, enum: ["Winner", "High CTR", "High Conversion", "Testing", "Draft"], default: "Draft" },
    historicalCtr: { type: Number, default: 0 },
    historicalConversionRate: { type: Number, default: 0 },
    headline: { type: String, default: "" },
    callToAction: { type: String, default: "" },
  },
  { timestamps: true }
);

// 4. Click Campaign Schema
const ClickCampaignSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    objective: { type: String, enum: ["Lead Generation", "Sales", "Brand Awareness", "Traffic", "Engagement"], default: "Lead Generation" },
    status: { type: String, enum: ["Draft", "Scheduled", "Active", "Paused", "Completed"], default: "Draft" },
    platforms: [{ type: String }],
    dailyBudget: { type: Number, default: 50 },
    totalBudget: { type: Number, default: 500 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    // Linked references & selections
    assetIds: [{ type: Schema.Types.ObjectId, ref: "DigitalAsset" }],
    copyIds: [{ type: Schema.Types.ObjectId, ref: "SwipeCopy" }],
    selectedAssetIds: [{ type: String }],
    selectedCopyIds: [{ type: String }],
    // Product & Strategy Details
    productName: { type: String, default: "" },
    productType: { type: String, default: "Digital Product / eBook" },
    targetAudience: { type: String, default: "" },
    corePainPoint: { type: String, default: "" },
    uniqueValue: { type: String, default: "" },
    // Step completion progress (1 through 7)
    completedSteps: [{ type: Number }],
    currentStep: { type: Number, default: 1 },
    // Pixel Verification State
    pixelChecklistState: { type: Schema.Types.Mixed, default: {} },
    // Keywords & Ad Group Mapping
    targetKeywords: [
      {
        keyword: String,
        matchType: { type: String, default: "Phrase" },
        intent: { type: String, default: "Transactional" },
        monthlyVolume: { type: Number, default: 1200 },
        estimatedCpc: { type: Number, default: 1.5 },
        headlines: [String],
        adCopy: [String],
      },
    ],
    // Metrics snapshot
    metrics: {
      spend: { type: Number, default: 0 },
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      ctr: { type: Number, default: 0 },
      cpc: { type: Number, default: 0 },
      cpa: { type: Number, default: 0 },
      roas: { type: Number, default: 0 },
    },
    gapAlerts: [{ type: String }],
  },
  { timestamps: true }
);

// 5. Keyword & Ad Group Schema
const KeywordItemSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    keyword: { type: String, required: true },
    matchType: { type: String, enum: ["Exact", "Phrase", "Broad"], default: "Phrase" },
    intent: { type: String, enum: ["Transactional", "Commercial", "Informational", "Navigational"], default: "Transactional" },
    monthlyVolume: { type: Number, default: 1200 },
    estimatedCpc: { type: Number, default: 1.5 },
    difficulty: { type: Number, default: 45 },
    associatedHeadlines: [{ type: String }],
    associatedAdCopy: [{ type: String }],
    negativeKeywords: [{ type: String }],
    targetPlatforms: [{ type: String }],
  },
  { timestamps: true }
);

export const BrandVault = mongoose.models.BrandVault || mongoose.model("BrandVault", BrandVaultSchema);
export const DigitalAsset = mongoose.models.DigitalAsset || mongoose.model("DigitalAsset", DigitalAssetSchema);
export const SwipeCopy = mongoose.models.SwipeCopy || mongoose.model("SwipeCopy", SwipeCopySchema);
export const ClickCampaign = mongoose.models.ClickCampaign || mongoose.model("ClickCampaign", ClickCampaignSchema);
export const KeywordItem = mongoose.models.KeywordItem || mongoose.model("KeywordItem", KeywordItemSchema);
