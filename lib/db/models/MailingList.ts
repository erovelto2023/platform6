import mongoose, { Schema, Model } from 'mongoose';

export interface IMailingList {
    name: string;
    description?: string;
    slug: string;
    subscriberCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const MailingListSchema = new Schema<IMailingList>({
    name: { type: String, required: true },
    description: { type: String },
    slug: { type: String, required: true, unique: true },
    subscriberCount: { type: Number, default: 0 },
}, { timestamps: true });

const MailingList: Model<IMailingList> = mongoose.models.MailingList || mongoose.model<IMailingList>('MailingList', MailingListSchema);

export default MailingList;
