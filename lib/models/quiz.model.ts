import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["multiple-choice", "true-false", "short-answer", "essay"],
        default: "multiple-choice"
    },
    question: { type: String, required: true },
    options: [{ type: String }], // For multiple choice
    correctAnswer: { type: mongoose.Schema.Types.Mixed }, // Can be index (number) or text (string)
    explanation: { type: String },
    points: { type: Number, default: 1 },
    order: { type: Number, default: 0 },
    imageUrl: { type: String },
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    questions: [questionSchema],
    category: { type: String },
    tags: [{ type: String }],
    difficulty: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner"
    },
    timeLimit: { type: Number }, // in minutes, null for no limit
    passingScore: { type: Number, default: 70 }, // percentage
    randomizeQuestions: { type: Boolean, default: false },
    randomizeOptions: { type: Boolean, default: false },
    showResults: {
        type: String,
        enum: ["immediately", "after-completion", "never"],
        default: "after-completion"
    },
    allowRetakes: { type: Boolean, default: true },
    maxRetakes: { type: Number }, // null for unlimited
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    createdBy: { type: String }, // Clerk user ID
    thumbnail: { type: String },
    accessLevel: {
        type: String,
        enum: ["public", "members", "paid"],
        default: "public"
    },
    totalAttempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
}, { timestamps: true });

const quizAttemptSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    userId: { type: String, required: true }, // Clerk user ID
    answers: [{
        questionId: mongoose.Schema.Types.ObjectId,
        answer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
        pointsEarned: Number,
    }],
    score: { type: Number, required: true },
    totalPoints: { type: Number, required: true },
    percentage: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    timeSpent: { type: Number }, // in seconds
    completedAt: { type: Date, default: Date.now },
    startedAt: { type: Date },
}, { timestamps: true });

// Indexes for better query performance
quizSchema.index({ slug: 1 });
quizSchema.index({ createdBy: 1 });
quizSchema.index({ isPublished: 1 });
quizSchema.index({ category: 1 });

quizAttemptSchema.index({ quizId: 1, userId: 1 });
quizAttemptSchema.index({ userId: 1 });
quizAttemptSchema.index({ completedAt: -1 });

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
const QuizAttempt = mongoose.models.QuizAttempt || mongoose.model("QuizAttempt", quizAttemptSchema);

export { Quiz, QuizAttempt, questionSchema };
export default Quiz;
