import mongoose from "mongoose";

const ThreadSchema = new mongoose.Schema(
    {
        // --- Core Fields ---
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            sparse: true, // Allow nulls if slug generation fails initially
        },
        content: {
            type: String,
            required: true, // Rich text / markdown
        },
        type: {
            type: String,
            enum: ["Discussion", "Question", "Announcement", "Poll", "Resource", "Survey", "Media", "Win"],
            default: "Discussion",
        },
        // ... (existing fields)

        // 🏆 Win/Showcase Specifics
        winDetails: {
            type: {
                type: String,
                enum: ["Personal milestone", "Business win", "Learning breakthrough", "Health / mindset", "Community contribution", "Other"],
                default: "Personal milestone"
            },
            winDate: Date,
            proof: {
                type: { type: String, enum: ["Screenshot", "Link", "File", "None"], default: "None" },
                url: String,
            },
            reflection: {
                whatIDid: String,
                whatWorked: String,
                whatIdDoDifferently: String,
                biggestLesson: String,
            },
            impact: {
                inspiredBy: String,
                helpedBy: [String], // Could be user IDs or names
                resourcesUsed: String,
            },
            metrics: {
                before: String,
                after: String,
                type: String,
                timeToWin: String,
            },
            celebrations: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        },
        resourceDetails: {
            type: {
                type: String,
                enum: ["Link", "File", "Video", "Audio", "Document", "Tool", "Template", "Checklist", "Course", "Lesson"],
                default: "Link"
            },
            shortDescription: String,
            url: String,
            thumbnailUrl: String,

            // Link/Tool specific
            platform: String,
            pricing: { type: String, enum: ["Free", "Freemium", "Paid"], default: "Free" },
            isAffiliate: Boolean,

            // File specific
            fileType: String,
            fileSize: String,
            version: String,
            downloadCount: { type: Number, default: 0 },

            // Video/Audio specific
            duration: String,
            hostingPlatform: String,
            transcript: String,
            playbackType: { type: String, enum: ["Stream", "Download"], default: "Stream" },

            // Categorization
            category: String,
            subcategory: String,
            tags: [String],
            difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
            intendedOutcome: String,

            // Context
            howToUse: String,
            bestFor: String,
            prerequisites: String,
            estimatedTime: String,
            nextResource: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },

            // Stats & Ratings
            completionCount: { type: Number, default: 0 },
            averageRating: { type: Number, default: 0 },
            ratingCount: { type: Number, default: 0 },

            // Attribution
            source: String,
            license: String,
            usageRights: String,
            attributionText: String,
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["Draft", "Published", "Scheduled", "Archived", "Locked"],
            default: "Published",
        },
        visibility: {
            type: String,
            enum: ["Public", "Members", "Moderators", "Admins"],
            default: "Members",
        },

        // --- Metadata & Organization ---
        tags: [String],
        topics: [String],
        category: String,
        priority: {
            type: String,
            enum: ["Normal", "Featured", "Pinned"],
            default: "Normal",
        },
        language: { type: String, default: "en" },
        contentWarning: String,

        // --- Engagement & Signals ---
        views: { type: Number, default: 0 },
        replyCount: { type: Number, default: 0 },
        reactionCount: { type: Number, default: 0 },
        upvoteCount: { type: Number, default: 0 },
        bookmarkCount: { type: Number, default: 0 },
        shareCount: { type: Number, default: 0 },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Legacy simple like

        // --- Moderation ---
        isPinned: { type: Boolean, default: false },
        isLocked: { type: Boolean, default: false },
        isFeatured: { type: Boolean, default: false },
        approvalStatus: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Approved",
        },
        moderatorNotes: String,
        reportCount: { type: Number, default: 0 },

        // --- Type-Specific Fields (Stored in sub-objects for cleanliness) ---

        // 💬 Discussion Specifics
        discussion: {
            type: { type: String, enum: ["General", "Debate", "Feedback", "Brainstorm", "OffTopic"], default: "General" },
            goal: String,
            allowAnonymousReplies: { type: Boolean, default: false },
            isSolved: { type: Boolean, default: false }, // Moved from root
        },

        // 📢 Announcement Specifics
        announcement: {
            type: { type: String, enum: ["Update", "Event", "Warning", "Release", "Reminder"], default: "Update" },
            importance: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
            expirationDate: Date,
            acknowledgmentRequired: { type: Boolean, default: false },
            acknowledgedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
            cta: {
                text: String,
                url: String,
            },
        },

        // 📦 Resource Specifics
        resource: {
            type: { type: String, enum: ["File", "Link", "Video", "Audio", "Doc", "Tool"], default: "Link" },
            url: String,
            fileSize: String,
            fileType: String,
            difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
            estimatedReadTime: Number, // in minutes
        },

        // ❓ Question Specifics
        question: {
            type: { type: String, enum: ["HowTo", "Troubleshooting", "Opinion", "Conceptual"], default: "HowTo" },
            difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
            isSolved: { type: Boolean, default: false },
            acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: "Reply" },
            bountyPoints: { type: Number, default: 0 },
        },

        // 📊 Poll Specifics
        poll: {
            question: String,
            options: [{
                text: String,
                votes: { type: Number, default: 0 },
                voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
            }],
            allowMultipleVotes: { type: Boolean, default: false },
            allowOptionAdditions: { type: Boolean, default: false },
            endDate: Date,
            anonymousVotes: { type: Boolean, default: false },
        },

        // --- Timestamps ---
        lastActivityAt: {
            type: Date,
            default: Date.now,
        },
        publishedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Thread = mongoose.models.Thread || mongoose.model("Thread", ThreadSchema);

export default Thread;
