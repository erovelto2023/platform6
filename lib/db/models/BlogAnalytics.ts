import { Schema, model, models } from 'mongoose';

const BlogAnalyticsSchema = new Schema({
    // Blog post reference
    articleId: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
    },
    articleTitle: {
        type: String,
        required: true,
    },
    articleSlug: {
        type: String,
        required: true,
    },

    // Visitor tracking
    visitorId: {
        type: String, // Unique cookie ID
        required: true,
    },
    sessionId: {
        type: String, // Session identifier
        required: true,
    },

    // Visit details
    visitedAt: {
        type: Date,
        default: Date.now,
    },

    // Referrer information
    referrer: {
        type: String, // Full referrer URL
    },
    referrerDomain: {
        type: String, // Extracted domain
    },
    referrerType: {
        type: String,
        enum: ['direct', 'search', 'social', 'email', 'referral', 'unknown'],
        default: 'unknown',
    },

    // Search engine data
    searchEngine: {
        type: String, // google, bing, etc.
    },
    searchKeywords: {
        type: String, // If available from URL params
    },

    // UTM parameters
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    utmTerm: String,
    utmContent: String,

    // User journey
    previousPage: {
        type: String, // Previous page on your site
    },
    nextPage: {
        type: String, // Next page they visited
    },
    timeOnPage: {
        type: Number, // Seconds spent on page
    },
    scrollDepth: {
        type: Number, // Percentage scrolled (0-100)
    },

    // Device & browser info
    userAgent: String,
    deviceType: {
        type: String,
        enum: ['mobile', 'tablet', 'desktop', 'unknown'],
        default: 'unknown',
    },
    browser: String,
    os: String,

    // Location (from IP)
    ipAddress: String,
    country: String,
    city: String,

    // Page metadata
    pageUrl: String,

}, { timestamps: true });

// Indexes for faster queries
BlogAnalyticsSchema.index({ articleId: 1, visitedAt: -1 });
BlogAnalyticsSchema.index({ visitorId: 1 });
BlogAnalyticsSchema.index({ sessionId: 1 });
BlogAnalyticsSchema.index({ visitedAt: -1 });

const BlogAnalytics = models.BlogAnalytics || model('BlogAnalytics', BlogAnalyticsSchema);

export default BlogAnalytics;
