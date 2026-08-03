import { Schema, model, models } from 'mongoose';

const CompetitorSwipeSchema = new Schema({
    userId: { type: String, required: true, index: true },
    competitorId: { type: String, default: '', index: true },
    competitorName: { type: String, default: '' },
    title: { type: String, required: true },
    platform: { 
        type: String, 
        default: 'Meta / Facebook' 
    },
    hookType: { 
        type: String, 
        default: 'Problem / Solution' 
    },
    adCopyText: { type: String, default: '' },
    mediaUrl: { type: String, default: '' },
    landingPageUrl: { type: String, default: '' },
    notes: { type: String, default: '' },
    rating: { type: Number, default: 5, min: 1, max: 5 }
}, { timestamps: true });

const CompetitorSwipe = models.CompetitorSwipe || model('CompetitorSwipe', CompetitorSwipeSchema);

export default CompetitorSwipe;
