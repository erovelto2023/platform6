import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorCreditItem {
    category: string;
    description?: string;
    amount: number;
}

export interface IVendorCredit extends Document {
    businessId: mongoose.Types.ObjectId;
    vendorId: mongoose.Types.ObjectId;
    paymentDate: Date;
    refNo?: string;
    mailingAddress?: string;
    items: IVendorCreditItem[];
    total: number;
    memo?: string;
    createdAt: Date;
    updatedAt: Date;
}

const VendorCreditItemSchema = new Schema<IVendorCreditItem>({
    category: { type: String, required: true },
    description: String,
    amount: { type: Number, required: true, min: 0 },
}, { _id: false });

const VendorCreditSchema = new Schema<IVendorCredit>({
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    paymentDate: { type: Date, required: true, default: Date.now },
    refNo: String,
    mailingAddress: String,
    items: [VendorCreditItemSchema],
    total: { type: Number, required: true, min: 0 },
    memo: String,
}, { timestamps: true });

const VendorCredit = mongoose.models.VendorCredit || mongoose.model<IVendorCredit>('VendorCredit', VendorCreditSchema);
export default VendorCredit;
