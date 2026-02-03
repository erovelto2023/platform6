import mongoose from "mongoose";

const DocChapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true }, // Not unique globally, but unique per book? Let's generic slug.
    description: { type: String },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "DocBook", required: true },
    order: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

// Ensure unique slug per book if needed, but for now simple index
DocChapterSchema.index({ bookId: 1, slug: 1 });

export default mongoose.models.DocChapter || mongoose.model("DocChapter", DocChapterSchema);
