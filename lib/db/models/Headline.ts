import { Schema, model, models } from 'mongoose';

const HeadlineSchema = new Schema({
    userId: { type: String, required: true, index: true }, // Clerk ID
    text: { type: String, required: true },
    subheadline: { type: String },

    // Classification
    type: { type: String }, // Curiosity, Benefit, Fear, etc.
    frameworkId: { type: Schema.Types.ObjectId, ref: 'HeadlineFramework' },
    emotion: { type: String }, // Curiosity, Desire, Fear, etc.
    industry: { type: String },
    platform: { type: String }, // Facebook, Email, Blog, etc.
    funnelStage: { type: String }, // Awareness, Consideration, etc.
    audienceLevel: { type: String }, // Beginner, Intermediate, Advanced
    tone: { type: String },

    // Organization
    folderId: { type: String }, // Optional folder grouping
    tags: [{ type: String }],
    isFavorite: { type: Boolean, default: false },

    // Performance / Stats
    stats: {
        ctr: { type: Number },
        openRate: { type: Number },
        conversionRate: { type: Number },
        notes: { type: String }
    },

    // AI Metadata
    aiGenerated: { type: Boolean, default: false },
    sourcePrompt: { type: String }, // What generated this

}, { timestamps: true });

HeadlineSchema.index({ text: 'text' });

const Headline = models.Headline || model('Headline', HeadlineSchema);
export default Headline;
