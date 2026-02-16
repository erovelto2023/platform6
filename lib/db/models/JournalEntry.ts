import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJournalEntryLine {
    accountId: string; // Reference to Account
    description?: string;
    debit: number;
    credit: number;
}

export interface IJournalEntry extends Document {
    businessId: string;
    date: Date;
    description: string;
    reference?: string; // e.g., "ADJ-001"
    lines: IJournalEntryLine[];
    createdAt: Date;
    updatedAt: Date;
}

const JournalEntryLineSchema = new Schema({
    accountId: {
        type: String, // We'll store the account ID as a string for now, or ObjectId if we refer to an Account model
        required: true,
    },
    description: {
        type: String,
    },
    debit: {
        type: Number,
        default: 0,
        min: 0,
    },
    credit: {
        type: Number,
        default: 0,
        min: 0,
    },
});

const JournalEntrySchema = new Schema(
    {
        businessId: {
            type: String,
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        description: {
            type: String,
            required: true,
        },
        reference: {
            type: String,
        },
        lines: {
            type: [JournalEntryLineSchema],
            validate: [
                function (lines: IJournalEntryLine[]) {
                    return lines.length >= 2;
                },
                'Journal entry must have at least two lines',
            ],
        },
    },
    {
        timestamps: true,
    }
);

// Virtual for total (just for convenience, though strictly not needed as they should match)
JournalEntrySchema.virtual('totalAmount').get(function () {
    return this.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
});

// Pre-save validation to ensure debits equal credits
JournalEntrySchema.pre('save', async function () {
    const totalDebit = this.lines.reduce((sum: any, line: any) => sum + (line.debit || 0), 0);
    const totalCredit = this.lines.reduce((sum: any, line: any) => sum + (line.credit || 0), 0);

    // Allow for small floating point differences
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
        throw new Error(`Journal entry must balance. Total Debits: ${totalDebit}, Total Credits: ${totalCredit}`);
    }
});

const JournalEntry: Model<IJournalEntry> =
    mongoose.models.JournalEntry || mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);

export default JournalEntry;
