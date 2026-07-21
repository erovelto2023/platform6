import mongoose from "mongoose";

const pixelRuleSchema = new mongoose.Schema({
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

const pixelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  eventType: { 
    type: String, 
    enum: ["page_view", "click", "conversion", "purchase", "signup", "lead", "add_to_cart", "custom"],
    required: true 
  },
  customEventName: { type: String },
  platform: { 
    type: String, 
    enum: ["web", "mobile", "both"],
    default: "both"
  },
  pixelCode: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["active", "paused", "archived"],
    default: "active"
  },
  rules: [pixelRuleSchema],
  stats: {
    totalTriggers: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    lastTriggered: { type: Date },
  },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Pixel = mongoose.models.Pixel || mongoose.model("Pixel", pixelSchema);

export default Pixel;
