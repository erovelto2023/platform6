import mongoose, { Schema, Document } from "mongoose";

export interface ISwipeEmail extends Document {
  title: string;
  category: string;
  niche: string;
  sellingPrice: string;
  subjectLine: string;
  preheader: string;
  bodyCopy: string;
  ctaText: string;
  tags: string[];
  conversionNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmailTemplate extends Document {
  name: string;
  category: string;
  subjectLine: string;
  preheader: string;
  bodyCopy: string;
  ctaText: string;
  whenToUse: string;
  whyItWorks: string;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SwipeEmailSchema = new Schema<ISwipeEmail>(
  {
    title: { type: String, required: true },
    category: { type: String, default: "Prospecting" },
    niche: { type: String, default: "General" },
    sellingPrice: { type: String, default: "$47.00" },
    subjectLine: { type: String, required: true },
    preheader: { type: String, default: "" },
    bodyCopy: { type: String, required: true },
    ctaText: { type: String, default: "Click Here Now" },
    tags: [{ type: String }],
    conversionNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

const EmailTemplateSchema = new Schema<IEmailTemplate>(
  {
    name: { type: String, required: true },
    category: { type: String, default: "Prospecting" },
    subjectLine: { type: String, required: true },
    preheader: { type: String, default: "" },
    bodyCopy: { type: String, required: true },
    ctaText: { type: String, default: "Click Here Now" },
    whenToUse: { type: String, default: "" },
    whyItWorks: { type: String, default: "" },
    isCustom: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SwipeEmail =
  mongoose.models.SwipeEmail || mongoose.model<ISwipeEmail>("SwipeEmail", SwipeEmailSchema);

export const EmailTemplate =
  mongoose.models.EmailTemplate || mongoose.model<IEmailTemplate>("EmailTemplate", EmailTemplateSchema);
