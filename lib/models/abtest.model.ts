import mongoose from "mongoose";

const abTestVariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["headline", "creative", "offer", "cta", "landing_page", "email_subject"],
    required: true 
  },
  content: { type: String, required: true },
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  ctr: { type: Number, default: 0 },
  conversionRate: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  isWinner: { type: Boolean, default: false },
  confidence: { type: Number, default: 0 },
}, { _id: false });

const abTestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ["draft", "running", "completed", "paused"],
    default: "draft"
  },
  type: { 
    type: String, 
    enum: ["headline", "creative", "offer", "cta", "landing_page", "email_subject"],
    required: true 
  },
  platform: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  targetAudience: { type: String },
  variants: [abTestVariantSchema],
  winnerId: { type: mongoose.Schema.Types.ObjectId },
  statisticalSignificance: { type: Number, default: 0 },
  minSampleSize: { type: Number, default: 1000 },
  currentSampleSize: { type: Number, default: 0 },
  autoWinner: { type: Boolean, default: true },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const ABTest = mongoose.models.ABTest || mongoose.model("ABTest", abTestSchema);

export default ABTest;
