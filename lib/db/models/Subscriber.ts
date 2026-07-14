import mongoose, { Schema, Model } from 'mongoose';

export interface ISubscriber {
    id: string; // unique ID or could just rely on _id
    email: string;
    name?: string;
    ipAddress?: string;
    subscribedAt: Date;
    status: 'active' | 'unsubscribed' | 'bounced' | 'complained';
    lists: mongoose.Types.ObjectId[];
}

const SubscriberSchema = new Schema<ISubscriber>({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    ipAddress: { type: String },
    subscribedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'unsubscribed', 'bounced', 'complained'], default: 'active' },
    lists: [{ type: Schema.Types.ObjectId, ref: 'MailingList' }]
}, { timestamps: true });

const Subscriber: Model<ISubscriber> = mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

export default Subscriber;
