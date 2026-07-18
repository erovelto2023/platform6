import mongoose, { Schema, Document } from 'mongoose';

export interface IBillItem {
    category: string;
    description?: string;
    amount: number;
}

export interface IBill extends Document {
    businessId: mongoose.Types.ObjectId;
    vendorId: mongoose.Types.ObjectId;
    billNumber?: string;
    billDate: Date;
    dueDate: Date;
    terms?: string;
    mailingAddress?: string;
    refNo?: string;
    items: IBillItem[];
    total: number;
    status: 'open' | 'paid' | 'overdue' | 'partial';
    memo?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BillItemSchema = new Schema<IBillItem>({
    category: { type: String, required: true },
    description: String,
    amount: { type: Number, required: true, min: 0 },
}, { _id: false });

const BillSchema = new Schema<IBill>({
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    billNumber: String,
    billDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },
    terms: String,
    mailingAddress: String,
    refNo: String,
    items: [BillItemSchema],
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['open', 'paid', 'overdue', 'partial'], default: 'open' },
    memo: String,
}, { timestamps: true });

const Bill = mongoose.models.Bill || mongoose.model<IBill>('Bill', BillSchema);
export default Bill;
