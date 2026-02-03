import mongoose from "mongoose";

const DocPageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String }, // HTML or Markdown
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "DocBook", required: true },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "DocChapter" }, // Optional, can be direct child of book
    order: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPublished: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.DocPage || mongoose.model("DocPage", DocPageSchema);
