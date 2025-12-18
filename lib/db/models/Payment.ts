import { Schema, model, models } from 'mongoose';

const PaymentSchema = new Schema({
    stripePaymentId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    clerkId: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'usd',
    },
    status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed', 'refunded'],
        default: 'pending',
    },
    productType: {
        type: String,
        enum: ['course', 'niche_box', 'subscription', 'other'],
    },
    productId: {
        type: Schema.Types.ObjectId,
    },
    customerEmail: {
        type: String,
    },
    metadata: {
        type: Schema.Types.Mixed,
    },
}, { timestamps: true });

const Payment = models.Payment || model('Payment', PaymentSchema);

export default Payment;
