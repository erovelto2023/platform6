
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IContentItem extends Document {
    businessId: string;
    title: string;
    type: 'video' | 'blog' | 'social' | 'email' | 'other';
    status: 'idea' | 'planned' | 'in-progress' | 'published';
    scheduledAt: Date;
    keywords: string[];
    headline: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

const ContentItemSchema = new Schema<IContentItem>(
    {
        businessId: {
            type: String,
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['video', 'blog', 'social', 'email', 'other'],
            default: 'blog',
        },
        status: {
            type: String,
            enum: ['idea', 'planned', 'in-progress', 'published'],
            default: 'idea',
        },
        scheduledAt: {
            type: Date,
            required: true,
        },
        keywords: {
            type: [String],
            default: [],
        },
        headline: {
            type: String,
            default: '',
        },
        notes: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

const ContentItem = models.ContentItem || model<IContentItem>("ContentItem", ContentItemSchema);

export default ContentItem;
