
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IVendor extends Document {
    businessId: mongoose.Types.ObjectId;
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
    taxId?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const VendorSchema = new Schema<IVendor>(
    {
        businessId: {
            type: Schema.Types.ObjectId,
            ref: "Business",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, "Vendor name is required"],
            trim: true,
        },
        contactPerson: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        taxId: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate vendor names within the same business
VendorSchema.index({ businessId: 1, name: 1 }, { unique: true });

const Vendor = models.Vendor || model<IVendor>("Vendor", VendorSchema);

export default Vendor;
