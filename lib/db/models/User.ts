import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'student'],
        default: 'student',
    },
    purchasedCourses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course',
    }],
    enrolledNiches: [{
        type: Schema.Types.ObjectId,
        ref: 'NicheBox',
    }],
    // Progress tracking: Map of Lesson ID -> Boolean (completed)
    progress: [{
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
        },
        completedLessons: [{
            type: Schema.Types.ObjectId,
            ref: 'Lesson', // Assuming Lesson is a subdocument but we can just store IDs
        }],
        progressPercentage: {
            type: Number,
            default: 0,
        }
    }],
    // Community Profile Fields
    bio: { type: String },
    coverImage: { type: String },
    avatar: { type: String }, // In case we want to override Clerk's
    socialLinks: {
        website: String,
        twitter: String,
        instagram: String,
        linkedin: String,
        facebook: String,
    },
    interests: [String],

    // Search & Profile Fields
    username: { type: String, unique: true, sparse: true },
    location: { type: String },
    skills: [String],
    lastActiveAt: { type: Date },
    isShadowBanned: { type: Boolean, default: false },
    searchSettings: {
        hideProfile: { type: Boolean, default: false },
    },

    // AI Configuration
    aiSettings: {
        provider: {
            type: String,
            enum: ['local', 'openrouter'],
            default: 'local'
        },
        apiKey: { type: String }, // For OpenRouter
        defaultModel: { type: String, default: 'deepseek-r1' }
    }
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default User;
