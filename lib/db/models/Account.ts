import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
    businessId: mongoose.Types.ObjectId;
    name: string;
    type: string; // 'Bank', 'Credit Card', 'Cash', 'Other'
    balance?: number; // Optional initial balance
    isDefault?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>(
    {
        businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
        name: { type: String, required: true },
        type: { type: String, required: true, default: 'Bank' },
        balance: { type: Number, default: 0 },
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);
