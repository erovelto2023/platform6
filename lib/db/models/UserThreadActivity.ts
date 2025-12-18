import mongoose from "mongoose";

const UserThreadActivitySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    thread: { type: mongoose.Schema.Types.ObjectId, ref: "Thread", required: true },

    // Actions
    isSaved: { type: Boolean, default: false },
    savedAt: Date,

    isCompleted: { type: Boolean, default: false },
    completedAt: Date,

    isHelpful: { type: Boolean, default: false },

    rating: { type: Number, min: 1, max: 5 },
    ratedAt: Date,

    // Progress for resources (video/audio/course)
    progress: { type: Number, min: 0, max: 100, default: 0 },
    lastAccessedAt: Date,

    // Personal
    personalNotes: String,
}, { timestamps: true });

// Compound index to ensure unique user-thread pair
UserThreadActivitySchema.index({ user: 1, thread: 1 }, { unique: true });

const UserThreadActivity = mongoose.models.UserThreadActivity || mongoose.model("UserThreadActivity", UserThreadActivitySchema);

export default UserThreadActivity;
