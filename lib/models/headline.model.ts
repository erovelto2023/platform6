import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHeadlinePattern {
  _id?: string;
  name: string;
  category: "promise_timeframe" | "insecurity" | "secret_discovery" | "transformation" | "warning" | "command" | "list" | "curiosity" | "social_proof" | "comparison";
  template: string;
  description: string;
  psychology: string;
  inputFields: {
    name: string;
    label: string;
    placeholder: string;
    type: "text" | "number" | "select";
    options?: string[];
  }[];
  examples: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGeneratedHeadline {
  _id?: string;
  patternId: string;
  patternName: string;
  headline: string;
  inputs: Record<string, any>;
  platform?: string;
  campaignId?: string;
  isSaved: boolean;
  tags: string[];
  performance?: {
    impressions?: number;
    clicks?: number;
    ctr?: number;
    conversions?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const HeadlinePatternSchema = new Schema<IHeadlinePattern>(
  {
    name: { type: String, required: true },
    category: { 
      type: String, 
      enum: ["promise_timeframe", "insecurity", "secret_discovery", "transformation", "warning", "command", "list", "curiosity", "social_proof", "comparison"],
      required: true 
    },
    template: { type: String, required: true },
    description: { type: String, required: true },
    psychology: { type: String, required: true },
    inputFields: [{
      name: { type: String, required: true },
      label: { type: String, required: true },
      placeholder: { type: String, required: true },
      type: { type: String, enum: ["text", "number", "select"], required: true },
      options: [String]
    }],
    examples: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const GeneratedHeadlineSchema = new Schema<IGeneratedHeadline>(
  {
    patternId: { type: String, required: true },
    patternName: { type: String, required: true },
    headline: { type: String, required: true },
    inputs: { type: Schema.Types.Mixed, required: true },
    platform: { type: String },
    campaignId: { type: String },
    isSaved: { type: Boolean, default: false },
    tags: [{ type: String }],
    performance: {
      impressions: { type: Number },
      clicks: { type: Number },
      ctr: { type: Number },
      conversions: { type: Number },
    },
  },
  { timestamps: true }
);

const HeadlinePattern: Model<IHeadlinePattern> = mongoose.models.HeadlinePattern || mongoose.model<IHeadlinePattern>("HeadlinePattern", HeadlinePatternSchema);
const GeneratedHeadline: Model<IGeneratedHeadline> = mongoose.models.GeneratedHeadline || mongoose.model<IGeneratedHeadline>("GeneratedHeadline", GeneratedHeadlineSchema);

export { HeadlinePattern, GeneratedHeadline };
