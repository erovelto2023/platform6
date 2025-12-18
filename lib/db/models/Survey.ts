import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    id: { type: String, required: true }, // UUID for stable reference
    type: {
        type: String,
        enum: [
            "short_text",
            "long_text",
            "multiple_choice",
            "checkbox",
            "dropdown",
            "rating",
            "date",
            "number",
            "boolean"
        ],
        required: true,
    },
    text: { type: String, required: true },
    description: { type: String },
    options: [{ type: String }], // For choice-based questions
    required: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    validation: {
        min: Number,
        max: Number,
    },
});

const SurveySchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        // Context: Where this survey belongs (e.g., a specific Group or Course)
        context: {
            type: {
                type: String,
                enum: ["Global", "Group", "Course", "NicheBox"],
                default: "Global",
            },
            entityId: { type: mongoose.Schema.Types.ObjectId }, // ID of the group/course
        },

        status: {
            type: String,
            enum: ["Draft", "Active", "Closed", "Archived"],
            default: "Draft",
        },

        subtype: {
            type: String,
            enum: ["Survey", "Poll"],
            default: "Survey",
        },

        questions: [QuestionSchema],

        settings: {
            allowAnonymous: { type: Boolean, default: false },
            showResultsAfterSubmit: { type: Boolean, default: false },
            maxResponses: { type: Number },
            startDate: { type: Date },
            endDate: { type: Date },
            redirectUrl: { type: String },
        },

        stats: {
            responseCount: { type: Number, default: 0 },
            completionRate: { type: Number, default: 0 },
            averageTimeSeconds: { type: Number, default: 0 },
        }
    },
    { timestamps: true }
);

// Force recompilation of model to pick up schema changes
if (mongoose.models.Survey) {
    delete mongoose.models.Survey;
}
const Survey = mongoose.model("Survey", SurveySchema);

export default Survey;
