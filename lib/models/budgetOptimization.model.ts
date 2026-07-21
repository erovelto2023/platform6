import mongoose from "mongoose";

const budgetAllocationSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  currentBudget: { type: Number, required: true },
  recommendedBudget: { type: Number, required: true },
  currentROAS: { type: Number, default: 0 },
  projectedROAS: { type: Number, default: 0 },
  change: { type: Number, default: 0 },
  changePercent: { type: Number, default: 0 },
  confidence: { type: Number, default: 0 },
  reason: { type: String },
}, { _id: false });

const optimizationRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["auto_shift", "bid_adjustment", "pause_underperformer", "scale_winner"],
    required: true 
  },
  condition: { type: String, required: true },
  action: { type: String, required: true },
  threshold: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["active", "paused"],
    default: "active"
  },
  lastTriggered: { type: Date },
  totalSavings: { type: Number, default: 0 },
}, { _id: false });

const budgetOptimizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalBudget: { type: Number, required: true },
  allocations: [budgetAllocationSchema],
  rules: [optimizationRuleSchema],
  status: { 
    type: String, 
    enum: ["active", "paused", "draft"],
    default: "draft"
  },
  lastOptimized: { type: Date },
  nextOptimization: { type: Date },
  totalSavings: { type: Number, default: 0 },
  roiImprovement: { type: Number, default: 0 },
  autoOptimize: { type: Boolean, default: false },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const BudgetOptimization = mongoose.models.BudgetOptimization || mongoose.model("BudgetOptimization", budgetOptimizationSchema);

export default BudgetOptimization;
