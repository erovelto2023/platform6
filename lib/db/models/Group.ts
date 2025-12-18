import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["Public", "Closed", "Private", "Paid", "Course", "Event"],
            default: "Public",
        },
        category: {
            type: String,
            default: "General",
        },
        imageUrl: String,
        bannerUrl: String,

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Stats
        memberCount: {
            type: Number,
            default: 1,
        },
        threadCount: {
            type: Number,
            default: 0,
        },

        // Settings
        settings: {
            requiresApproval: { type: Boolean, default: false },
            isPaid: { type: Boolean, default: false },
            price: { type: Number, default: 0 },
            allowAnonymous: { type: Boolean, default: false },
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["Active", "Archived"],
            default: "Active",
        },
    },
    {
        timestamps: true,
    }
);

const Group = mongoose.models.Group || mongoose.model("Group", GroupSchema);

export default Group;
