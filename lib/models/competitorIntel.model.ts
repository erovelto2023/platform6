import mongoose from "mongoose";

const competitorAdSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  adFormat: { type: String, required: true },
  headline: { type: String },
  creative: { type: String },
  firstSeen: { type: Date },
  lastSeen: { type: Date },
  estimatedSpend: { type: Number, default: 0 },
  estimatedImpressions: { type: Number, default: 0 },
  engagementRate: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ["active", "inactive", "archived"],
    default: "active"
  },
}, { _id: false });

const competitorCampaignSchema = new mongoose.Schema({
  competitorName: { type: String, required: true },
  campaignName: { type: String, required: true },
  platform: { type: String, required: true },
  objective: { type: String },
  startDate: { type: Date },
  estimatedDailySpend: { type: Number, default: 0 },
  estimatedTotalSpend: { type: Number, default: 0 },
  targeting: [{ type: String }],
  creatives: [competitorAdSchema],
  status: { 
    type: String, 
    enum: ["active", "paused", "ended"],
    default: "active"
  },
}, { _id: false });

const competitorAlertSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ["new_campaign", "budget_increase", "creative_change", "strategy_shift"],
    required: true 
  },
  competitorName: { type: String, required: true },
  message: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  acknowledged: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const competitorIntelSchema = new mongoose.Schema({
  competitorName: { type: String, required: true },
  website: { type: String },
  campaigns: [competitorCampaignSchema],
  alerts: [competitorAlertSchema],
  status: { 
    type: String, 
    enum: ["active", "paused", "archived"],
    default: "active"
  },
  lastUpdated: { type: Date, default: Date.now },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const CompetitorIntel = mongoose.models.CompetitorIntel || mongoose.model("CompetitorIntel", competitorIntelSchema);

export default CompetitorIntel;
