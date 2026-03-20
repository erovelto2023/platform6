import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICPAListing extends Document {
  name: string;
  firmName?: string;
  licenseNumber?: string;
  jurisdiction?: string; // State/State Board
  licenseStatus?: string;
  address?: string;
  city: string;
  state: string; // 2-letter code or full name
  zipCode?: string;
  phone?: string;
  fax?: string;
  website?: string;
  email?: string;
  services?: string[]; // e.g., ["Tax Preparation", "Audit", "Small Business"]
  notes?: string;
  isFirm: boolean;
  slug: string; // for URL: /locations/ca/los-angeles/tax-directory/firm-name
  boardUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CPAListingSchema = new Schema<ICPAListing>(
  {
    name: { type: String, required: true },
    firmName: { type: String },
    licenseNumber: { type: String },
    jurisdiction: { type: String },
    licenseStatus: { type: String },
    address: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String },
    phone: { type: String },
    fax: { type: String },
    website: { type: String },
    email: { type: String },
    services: { type: [String], default: [] },
    notes: { type: String },
    isFirm: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true },
    boardUrl: { type: String },
  },
  { timestamps: true }
);

// Indexes for fast lookup on location pages
CPAListingSchema.index({ state: 1, city: 1 });
CPAListingSchema.index({ slug: 1 });

const CPAListing: Model<ICPAListing> = 
  mongoose.models.CPAListing || mongoose.model<ICPAListing>("CPAListing", CPAListingSchema);

export default CPAListing;
