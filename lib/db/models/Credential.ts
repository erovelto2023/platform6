
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ICredential extends Document {
    businessId: mongoose.Types.ObjectId;
    vendorId?: mongoose.Types.ObjectId;
    serviceName: string;
    url?: string;
    username?: string;
    password?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CredentialSchema = new Schema<ICredential>(
    {
        businessId: {
            type: Schema.Types.ObjectId,
            ref: "Business",
            required: true,
            index: true,
        },
        vendorId: {
            type: Schema.Types.ObjectId,
            ref: "Vendor",
            index: true,
        },
        serviceName: {
            type: String,
            required: [true, "Service name is required"],
            trim: true,
        },
        url: {
            type: String,
            trim: true,
        },
        username: {
            type: String,
            trim: true,
        },
        password: {
            type: String, // Plain text as requested for MVP "hidden but copyable"
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

const Credential = models.Credential || model<ICredential>("Credential", CredentialSchema);

export default Credential;
