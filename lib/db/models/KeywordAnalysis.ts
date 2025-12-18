import mongoose, { Schema, Document } from "mongoose";

export interface IKeywordAnalysis extends Document {
    userId: string;
    keyword: string;
    searchIntent: string;
    targetAudience: string;
    contentIdeas: Array<{
        title: string;
        type: string;
    }>;
    secondaryKeywords: string[];
    difficultyAnalysis: string;
    monetizationIdeas: string[];
    createdAt: Date;
}

const KeywordAnalysisSchema = new Schema<IKeywordAnalysis>({
    userId: { type: String, required: true, index: true },
    keyword: { type: String, required: true },
    searchIntent: { type: String },
    targetAudience: { type: String },
    contentIdeas: [{
        title: String,
        type: String
    }],
    secondaryKeywords: [String],
    difficultyAnalysis: { type: String },
    monetizationIdeas: [String],
    createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate compilation
export default mongoose.models.KeywordAnalysis || mongoose.model<IKeywordAnalysis>("KeywordAnalysis", KeywordAnalysisSchema);
