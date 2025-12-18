import { Schema, model, models } from 'mongoose';

const PlatformConnectionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    platform: {
        type: String,
        enum: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'pinterest', 'youtube', 'threads', 'blog', 'email'],
        required: true,
    },
    // Auth Data
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: String,
    expiresAt: Date,

    // Profile Info
    profileId: String, // The ID on the platform (e.g., Facebook Page ID)
    profileName: String,
    profileUsername: String,
    profileImage: String,

    // Configuration
    settings: {
        defaultHashtags: [String],
        autoPublish: { type: Boolean, default: false },
    },

    isConnected: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

// Ensure one connection per platform per user (can be modified later for multiple pages)
PlatformConnectionSchema.index({ userId: 1, platform: 1 }, { unique: true });

const PlatformConnection = models.PlatformConnection || model('PlatformConnection', PlatformConnectionSchema);

export default PlatformConnection;
