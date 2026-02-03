import mongoose from "mongoose";

const DocBookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    shelfId: { type: mongoose.Schema.Types.ObjectId, ref: "DocShelf" }, // Optional
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.DocBook || mongoose.model("DocBook", DocBookSchema);
