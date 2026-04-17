import { Schema, model, models } from 'mongoose';

const PartnerPayoutSchema = new Schema({
    partnerId: {
        type: Schema.Types.ObjectId,
        ref: 'PartnerAccount',
        required: true,
        index: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    method: {
        type: String,
        enum: ['paypal', 'stripe', 'other'],
        default: 'paypal',
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
    },
    payoutEmail: {
        type: String,
        required: true,
    },
    transactionId: {
        type: String,
        description: 'Reference ID from external payment processor (manual entry)',
    },
    paidAt: {
        type: Date,
    },
    notes: {
        type: String,
    }
}, { timestamps: true });

const PartnerPayout = models.PartnerPayout || model('PartnerPayout', PartnerPayoutSchema);

export default PartnerPayout;
