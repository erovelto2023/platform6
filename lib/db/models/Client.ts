import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
    businessId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone?: string;
    accountNumber?: string;
    contacts?: {
        name: string;
        email?: string;
        phone?: string;
        role?: string;
    }[];
    whatsapp?: string;
    website?: string;
    socials?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
        tiktok?: string;
        youtube?: string;
        wechat?: string;
        telegram?: string;
        messenger?: string;
        reddit?: string;
        threads?: string;
        pinterest?: string;
        snapchat?: string;
        discord?: string;
        twitch?: string;
        quora?: string;
        douyin?: string;
        kuaishou?: string;
        weibo?: string;
        line?: string;
        vk?: string;
    };
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
    {
        businessId: {
            type: Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: String,
        accountNumber: String,
        contacts: [
            {
                name: { type: String, required: true },
                email: String,
                phone: String,
                role: String,
            }
        ],
        whatsapp: String,
        website: String,
        socials: {
            facebook: String,
            twitter: String,
            linkedin: String,
            instagram: String,
            tiktok: String,
            youtube: String,
            wechat: String,
            telegram: String,
            messenger: String,
            reddit: String,
            threads: String,
            pinterest: String,
            snapchat: String,
            discord: String,
            twitch: String,
            quora: String,
            douyin: String,
            kuaishou: String,
            weibo: String,
            line: String,
            vk: String,
        },
        address: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },
        notes: String,
    },
    {
        timestamps: true,
    }
);

const Client = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);

export default Client;
