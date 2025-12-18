import mongoose from "mongoose";

const SavedSupplierSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Clerk ID
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    notes: { type: String },
    status: { type: String, default: 'saved' }, // 'saved', 'contacted', 'approved'
    savedAt: { type: Date, default: Date.now }
});

// Compound index to prevent duplicate saves
SavedSupplierSchema.index({ userId: 1, supplierId: 1 }, { unique: true });

export default mongoose.models.SavedSupplier || mongoose.model("SavedSupplier", SavedSupplierSchema);
