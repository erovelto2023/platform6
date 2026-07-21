import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
    id: { type: String },
    text: { type: String, required: true },
    imageUrl: { type: String },
    points: { type: Number, default: 0 },
    category: { type: String },
    nextQuestionId: { type: String }, // For branching/conditional logic ("outcome_id" or question "id" or "next")
}, { _id: false });

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
            "boolean",
            "image_choice"
        ],
        required: true,
    },
    text: { type: String, required: true },
    description: { type: String },
    options: [mongoose.Schema.Types.Mixed], // Can be array of strings or array of OptionSchema objects
    correctAnswer: { type: mongoose.Schema.Types.Mixed }, // String or Array for quiz grading
    explanation: { type: String }, // Explanation for answer
    points: { type: Number, default: 1 }, // Points for quiz questions
    required: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    validation: {
        min: Number,
        max: Number,
    },
    // Branching logic default override
    defaultNextQuestionId: { type: String },
});

const OutcomeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    minScore: { type: Number, default: 0 },
    maxScore: { type: Number, default: 100 },
    matchingCategory: { type: String },
    ctaText: { type: String, default: "Get Started Now" },
    ctaUrl: { type: String },
    redirectUrl: { type: String },
}, { _id: false });

const LeadFieldSchema = new mongoose.Schema({
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, default: "text" },
    required: { type: Boolean, default: true },
    builtIn: { type: Boolean, default: false },
}, { _id: false });

const SurveySchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

        context: {
            type: {
                type: String,
                enum: ["Global", "Group", "Course", "NicheBox"],
                default: "Global",
            },
            entityId: { type: mongoose.Schema.Types.ObjectId },
        },

        status: {
            type: String,
            enum: ["Draft", "Active", "Closed", "Archived"],
            default: "Draft",
        },

        subtype: {
            type: String,
            enum: ["Survey", "Poll", "Quiz"],
            default: "Survey",
        },

        questions: [QuestionSchema],
        outcomes: [OutcomeSchema],

        // Theme & Styling
        theme: {
            preset: { type: String, default: "Clean Pro" },
            primaryColor: { type: String, default: "#6366f1" },
            secondaryColor: { type: String, default: "#0f172a" },
            textColor: { type: String, default: "#f8fafc" },
            fontFamily: { type: String, default: "Inter" },
            borderRadius: { type: Number, default: 12 },
            shadowIntensity: { type: String, default: "Soft" },
            backgroundStyle: { type: String, default: "Dark Gradient" },
        },

        // Lead Capture Configuration
        leadCapture: {
            enabled: { type: Boolean, default: true },
            position: { type: String, enum: ["before_results", "before_start"], default: "before_results" },
            headline: { type: String, default: "Where should we send your results?" },
            subheadline: { type: String, default: "Enter your details below to unlock your custom breakdown." },
            fields: [LeadFieldSchema],
            requireConsent: { type: Boolean, default: true },
            consentText: { type: String, default: "I agree to receive communications regarding my quiz results and related offers." },
        },

        settings: {
            quizMode: { type: Boolean, default: false },
            passingScore: { type: Number, default: 70 },
            showCorrectAnswersAfterSubmit: { type: Boolean, default: true },
            timeLimitMinutes: { type: Number, default: 0 },
            allowAnonymous: { type: Boolean, default: true },
            showResultsAfterSubmit: { type: Boolean, default: true },
            maxResponses: { type: Number },
            startDate: { type: Date },
            endDate: { type: Date },
            redirectUrl: { type: String },
            webhookUrl: { type: String },
            emailNotifications: { type: Boolean, default: false },
            notificationEmails: { type: String },
        },

        stats: {
            responseCount: { type: Number, default: 0 },
            completionRate: { type: Number, default: 0 },
            averageTimeSeconds: { type: Number, default: 0 },
            averageScore: { type: Number, default: 0 },
            leadsCapturedCount: { type: Number, default: 0 },
        }
    },
    { timestamps: true }
);

if (mongoose.models.Survey) {
    delete mongoose.models.Survey;
}
const Survey = mongoose.model("Survey", SurveySchema);

export default Survey;
