import mongoose from "mongoose";

const segmentRuleSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ["behavior", "demographic", "psychographic", "technographic", "geographic"],
    required: true 
  },
  field: { type: String, required: true },
  operator: { 
    type: String, 
    enum: ["equals", "not_equals", "contains", "not_contains", "greater_than", "less_than", "between", "in_last", "not_in_last"],
    required: true 
  },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  description: { type: String },
}, { _id: false });

const audienceSegmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ["active", "paused", "archived"],
    default: "active"
  },
  type: { 
    type: String, 
    enum: ["custom", "lookalike", "retargeting", "exclusion"],
    required: true 
  },
  platform: { 
    type: String, 
    enum: ["all", "meta", "google", "tiktok", "linkedin", "email"],
    default: "all"
  },
  rules: [segmentRuleSchema],
  estimatedSize: { type: Number, default: 0 },
  actualSize: { type: Number, default: 0 },
  matchRate: { type: Number, default: 0 },
  performance: {
    ctr: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    cpa: { type: Number, default: 0 },
    roas: { type: Number, default: 0 },
  },
  lookalikeSource: { type: String },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const AudienceSegment = mongoose.models.AudienceSegment || mongoose.model("AudienceSegment", audienceSegmentSchema);

export default AudienceSegment;
