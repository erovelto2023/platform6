import mongoose, { Schema, Document } from 'mongoose';

export interface IEstimateItem {
    productService?: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface IEstimate extends Document {
    businessId: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    estimateNumber: string;
    date: Date;
    expirationDate?: Date;
    acceptedBy?: string;
    acceptedDate?: Date;
    items: IEstimateItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: 'pending' | 'accepted' | 'declined' | 'expired' | 'invoiced';
    notes?: string;
    message?: string;
    createdAt: Date;
    updatedAt: Date;
}

const EstimateItemSchema = new Schema<IEstimateItem>({
    productService: String,
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    rate: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
}, { _id: false });

const EstimateSchema = new Schema<IEstimate>({
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    estimateNumber: { type: String, required: true, unique: true },
    date: { type: Date, required: true, default: Date.now },
    expirationDate: Date,
    acceptedBy: String,
    acceptedDate: Date,
    items: [EstimateItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'accepted', 'declined', 'expired', 'invoiced'], default: 'pending' },
    notes: String,
    message: String,
}, { timestamps: true });

const Estimate = mongoose.models.Estimate || mongoose.model<IEstimate>('Estimate', EstimateSchema);
export default Estimate;
