import { Schema, model, models } from 'mongoose';

const CampaignSchema = new Schema({
    // Basic Info
    name: {
        type: String,
        required: true,
    },
    description: String,
    type: {
        type: String,
        enum: ['launch', 'evergreen', 'promo', 'theme', 'newsletter', 'other'],
        default: 'other',
    },

    // Dates
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },

    // Goals
    revenueGoal: Number,
    trafficFocus: String,
    notes: String,

    // Relations
    primaryOfferId: {
        type: Schema.Types.ObjectId,
        ref: 'Offer',
    },

    // Status
    status: {
        type: String,
        enum: ['planning', 'active', 'completed', 'paused'],
        default: 'planning',
    },

    // User
    userId: {
        type: String,
        required: true,
        index: true,
    },
    businessId: {
        type: String,
        required: true,
        index: true,
    },

}, { timestamps: true });

// Indexes
CampaignSchema.index({ userId: 1, status: 1 });
CampaignSchema.index({ startDate: 1, endDate: 1 });

const Campaign = models.Campaign || model('Campaign', CampaignSchema);

export default Campaign;
