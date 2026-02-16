import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface IInvoice extends Document {
    businessId: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    invoiceNumber: string;
    date: Date;
    dueDate: Date;
    items: IInvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
    {
        description: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        rate: {
            type: Number,
            required: true,
            min: 0,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
    {
        businessId: {
            type: Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
            index: true,
        },
        clientId: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        items: [InvoiceItemSchema],
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        tax: {
            type: Number,
            default: 0,
            min: 0,
        },
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['draft', 'sent', 'paid', 'overdue'],
            default: 'draft',
        },
        notes: String,
    },
    {
        timestamps: true,
    }
);

const Invoice = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default Invoice;
