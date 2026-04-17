import { Schema, model, models } from 'mongoose';

const PartnerCommissionSchema = new Schema({
    partnerId: {
        type: Schema.Types.ObjectId,
        ref: 'PartnerAccount',
        required: true,
        index: true,
    },
    referrerUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    referredUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'Payment',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'paid', 'cancelled'],
        default: 'pending',
    },
    eligibleDate: {
        type: Date,
        required: true,
        description: 'Date when commission becomes eligible for payout (30 days after sale)',
    },
    notes: {
        type: String,
    }
}, { timestamps: true });

const PartnerCommission = models.PartnerCommission || model('PartnerCommission', PartnerCommissionSchema);

export default PartnerCommission;
