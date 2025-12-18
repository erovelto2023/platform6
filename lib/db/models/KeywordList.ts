import mongoose from "mongoose";

const KeywordListSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    keywords: [{
        keyword: { type: String, required: true },
        volume: { type: Number, default: 0 },
        difficulty: { type: Number, default: 0 },
        cpc: { type: String, default: "0.00" },
        addedAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

export const KeywordList = mongoose.models.KeywordList || mongoose.model("KeywordList", KeywordListSchema);
