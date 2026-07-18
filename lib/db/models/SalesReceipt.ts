import mongoose, { Schema, Document } from 'mongoose';

export interface ISalesReceiptItem {
    productService?: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface ISalesReceipt extends Document {
    businessId: mongoose.Types.ObjectId;
    clientId?: mongoose.Types.ObjectId;
    receiptNumber: string;
    date: Date;
    paymentMethod: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'other';
    depositTo?: string;
    referenceNo?: string;
    email?: string;
    billingAddress?: string;
    items: ISalesReceiptItem[];
    subtotal: number;
    tax: number;
    total: number;
    message?: string;
    createdAt: Date;
    updatedAt: Date;
}

const SalesReceiptItemSchema = new Schema<ISalesReceiptItem>({
    productService: String,
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    rate: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
}, { _id: false });

const SalesReceiptSchema = new Schema<ISalesReceipt>({
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
    receiptNumber: { type: String, required: true, unique: true },
    date: { type: Date, required: true, default: Date.now },
    paymentMethod: { type: String, enum: ['cash', 'check', 'credit_card', 'bank_transfer', 'other'], default: 'cash' },
    depositTo: String,
    referenceNo: String,
    email: String,
    billingAddress: String,
    items: [SalesReceiptItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    message: String,
}, { timestamps: true });

const SalesReceipt = mongoose.models.SalesReceipt || mongoose.model<ISalesReceipt>('SalesReceipt', SalesReceiptSchema);
export default SalesReceipt;
