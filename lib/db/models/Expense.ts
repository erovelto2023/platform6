import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
    businessId: mongoose.Types.ObjectId;
    date: Date;
    vendor: string;
    category: string;
    amount: number;
    accountId?: mongoose.Types.ObjectId;
    description?: string;
    receipt?: string;
    paymentMethod?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
    {
        businessId: {
            type: Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        vendor: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        accountId: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
        },
        description: String,
        receipt: String,
        paymentMethod: String,
    },
    {
        timestamps: true,
    }
);

const Expense = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
