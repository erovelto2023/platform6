import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContentEntry extends Document {
    pageTypeSlug: string;
    title: string;
    slug: string;
    data: Record<string, any>;
    metaTitle?: string;
    metaDescription?: string;
    isPublished: boolean;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const ContentEntrySchema = new Schema<IContentEntry>({
    pageTypeSlug: { type: String, required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    data: { type: Schema.Types.Mixed, default: {} },
    metaTitle: { type: String },
    metaDescription: { type: String },
    isPublished: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
}, { timestamps: true });

const ContentEntry: Model<IContentEntry> = mongoose.models.ContentEntry || mongoose.model<IContentEntry>("ContentEntry", ContentEntrySchema);

export default ContentEntry;
