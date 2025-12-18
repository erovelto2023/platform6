import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true }, // HTML content
    excerpt: { type: String },
    imageUrl: { type: String },
    author: { type: String, default: "K Business Academy" },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    tags: [{ type: String }],
    categories: [{ type: String }],
    accessLevel: { type: String, enum: ["public", "members", "paid"], default: "public" },
    featured: { type: Boolean, default: false },
    seoTitle: { type: String },
    seoDescription: { type: String },
    canonicalUrl: { type: String },
    ogImage: { type: String },
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
