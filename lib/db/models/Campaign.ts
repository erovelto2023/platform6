import { Schema, model, models } from 'mongoose';

const CampaignSchema = new Schema({
    // Basic Info
    name: {
        type: String,
        required: true,
    },
    description: String,

    // Dates
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },

    // Goals
    goal: {
        type: String,
        enum: ['traffic', 'leads', 'sales', 'engagement', 'awareness', 'launch'],
        required: true,
    },
    targetMetric: Number,

    // Organization
    funnelStage: {
        type: String,
        enum: ['top', 'middle', 'bottom'],
    },
    productId: {
        type: Schema.Types.ObjectId,
    },
    offerName: String,

    // Status
    status: {
        type: String,
        enum: ['planning', 'active', 'completed', 'paused'],
        default: 'planning',
    },

    // Analytics
    analytics: {
        totalPosts: { type: Number, default: 0 },
        totalReach: { type: Number, default: 0 },
        totalEngagement: { type: Number, default: 0 },
        totalClicks: { type: Number, default: 0 },
        totalConversions: { type: Number, default: 0 },
        totalRevenue: { type: Number, default: 0 },
    },

    // User
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

}, { timestamps: true });

// Indexes
CampaignSchema.index({ userId: 1, status: 1 });
CampaignSchema.index({ startDate: 1, endDate: 1 });

const Campaign = models.Campaign || model('Campaign', CampaignSchema);

export default Campaign;
