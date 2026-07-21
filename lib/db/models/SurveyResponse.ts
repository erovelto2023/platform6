import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
    questionId: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed }, // Can be string, number, array of strings, etc.
});

const SurveyResponseSchema = new mongoose.Schema(
    {
        survey: { type: mongoose.Schema.Types.ObjectId, ref: "Survey", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Nullable for anonymous

        answers: [AnswerSchema],

        // Quiz scoring stats (if survey is a Quiz)
        score: { type: Number, default: 0 },
        maxScore: { type: Number, default: 0 },
        passed: { type: Boolean, default: false },
        outcomeId: { type: String }, // Calculated outcome ID (bucket or point range)

        // Lead capture info
        leadData: {
            name: String,
            email: String,
            phone: String,
            company: String,
            customFields: { type: Map, of: String },
        },

        metadata: {
            ipAddress: String,
            userAgent: String,
            timeTakenSeconds: Number,
            completedQuestionsCount: Number,
        },

        status: {
            type: String,
            enum: ["In_Progress", "Completed"],
            default: "Completed",
        }
    },
    { timestamps: true }
);

SurveyResponseSchema.index({ survey: 1, user: 1 });

if (mongoose.models.SurveyResponse) {
    delete mongoose.models.SurveyResponse;
}

const SurveyResponse = mongoose.model("SurveyResponse", SurveyResponseSchema);

export default SurveyResponse;
