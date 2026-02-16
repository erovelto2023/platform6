import { Schema, model, models } from 'mongoose';

const ContentPostSchema = new Schema({
    // Basic Info
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    contentType: {
        type: String,
        enum: ['blog', 'social', 'reel', 'story', 'carousel', 'email', 'video', 'podcast', 'ad'],
        required: true,
    },

    // Scheduling
    status: {
        type: String,
        enum: ['idea', 'draft', 'review', 'scheduled', 'published', 'failed'],
        default: 'draft',
    },
    scheduledFor: {
        type: Date,
    },
    publishedAt: {
        type: Date,
    },

    // Platforms
    platforms: [{
        name: {
            type: String,
            enum: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'pinterest', 'youtube', 'threads', 'blog', 'email'],
        },
        status: {
            type: String,
            enum: ['pending', 'published', 'failed'],
            default: 'pending',
        },
        publishedId: String, // Platform-specific post ID
        publishedUrl: String,
        error: String,
        publishedAt: Date,
    }],

    // Strategy & Organization
    contentPillar: { // Keeping for backward compatibility, but prefer pillarId
        type: String,
        enum: ['education', 'promotion', 'engagement', 'authority', 'lifestyle', 'entertainment'],
    },
    pillarId: {
        type: Schema.Types.ObjectId,
        ref: 'PillarContent',
    },
    campaignId: {
        type: Schema.Types.ObjectId,
        ref: 'Campaign',
    },
    offerId: {
        type: Schema.Types.ObjectId,
        ref: 'Offer',
    },
    funnelStage: {
        type: String,
        enum: ['awareness', 'consideration', 'conversion', 'retention'],
    },
    estimatedEffort: {
        type: String,
        enum: ['low', 'medium', 'high'],
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
    },
    repurposedFrom: {
        type: Schema.Types.ObjectId,
        ref: 'ContentPost',
    },
    tags: [String],

    // Media
    media: [{
        type: {
            type: String,
            enum: ['image', 'video', 'gif', 'audio', 'document'],
        },
        url: String,
        thumbnail: String,
        alt: String,
    }],

    // Platform-specific content
    platformVariations: [{
        platform: String,
        caption: String,
        hashtags: [String],
        firstComment: String,
    }],

    // Engagement & Analytics
    analytics: {
        reach: Number,
        impressions: Number,
        engagement: Number,
        clicks: Number,
        shares: Number,
        saves: Number,
        comments: Number,
        likes: Number,
        conversions: Number,
        revenue: Number,
    },

    // Metadata
    userId: {
        type: String,
        required: true,
        index: true,
    },
    isEvergreen: {
        type: Boolean,
        default: false,
    },
    recycleFrequency: Number, // Days
    lastRecycled: Date,

}, { timestamps: true });

// Indexes
ContentPostSchema.index({ userId: 1, scheduledFor: 1 });
ContentPostSchema.index({ userId: 1, status: 1 });
ContentPostSchema.index({ campaignId: 1 });
ContentPostSchema.index({ scheduledFor: 1, status: 1 });

// Prevent Mongoose OverwriteModelError in development
if (models.ContentPost) {
    delete models.ContentPost;
}

const ContentPost = model('ContentPost', ContentPostSchema);

export default ContentPost;
