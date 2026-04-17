import { Schema, model, models } from 'mongoose';

const PartnerAccountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    affiliateCode: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'suspended'],
        default: 'active',
    },
    commissionType: {
        type: String,
        enum: ['percentage', 'flat'],
        default: 'percentage',
    },
    commissionValue: {
        type: Number,
        default: 45, // 45% default
    },
    totalEarnings: {
        type: Number,
        default: 0,
    },
    balance: {
        type: Number,
        default: 0,
    },
    payoutEmail: {
        type: String,
    },
    payoutMethod: {
        type: String,
        enum: ['paypal', 'stripe', 'other'],
        default: 'paypal',
    }
}, { timestamps: true });

const PartnerAccount = models.PartnerAccount || model('PartnerAccount', PartnerAccountSchema);

export default PartnerAccount;
