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

        metadata: {
            ipAddress: String,
            userAgent: String,
            timeTakenSeconds: Number,
        },

        status: {
            type: String,
            enum: ["In_Progress", "Completed"],
            default: "Completed",
        }
    },
    { timestamps: true }
);

// Index for faster lookups of a user's response to a specific survey
SurveyResponseSchema.index({ survey: 1, user: 1 });

const SurveyResponse = mongoose.models.SurveyResponse || mongoose.model("SurveyResponse", SurveyResponseSchema);

export default SurveyResponse;
