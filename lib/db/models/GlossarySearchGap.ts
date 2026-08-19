import mongoose, { Schema, Model } from 'mongoose';

export interface IGlossarySearchGap {
    _id?: string;
    query: string;
    searchCount: number;
    lastSearchedAt: Date;
    status: 'pending' | 'created' | 'dismissed';
    createdTermSlug?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const GlossarySearchGapSchema = new Schema<IGlossarySearchGap>({
    query: { type: String, required: true, unique: true, lowercase: true, trim: true },
    searchCount: { type: Number, default: 1 },
    lastSearchedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'created', 'dismissed'], default: 'pending' },
    createdTermSlug: { type: String }
}, { timestamps: true });

const GlossarySearchGap: Model<IGlossarySearchGap> = mongoose.models.GlossarySearchGap || mongoose.model<IGlossarySearchGap>('GlossarySearchGap', GlossarySearchGapSchema);

export default GlossarySearchGap;
