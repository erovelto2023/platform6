import mongoose from "mongoose";

const DocShelfSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    color: { type: String, default: "#3b82f6" }, // Default blue
    isPublished: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.models.DocShelf || mongoose.model("DocShelf", DocShelfSchema);
