import mongoose, { Schema, Model } from 'mongoose';

export interface ISubscriber {
    id: string; // email as ID or random
    email: string;
    subscribedAt: Date;
    status: 'active' | 'unsubscribed';
}

const SubscriberSchema = new Schema<ISubscriber>({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'unsubscribed'], default: 'active' }
}, { timestamps: true });

const Subscriber: Model<ISubscriber> = mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

export default Subscriber;
