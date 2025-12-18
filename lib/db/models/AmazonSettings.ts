import { Schema, model, models } from 'mongoose';

const AmazonSettingsSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    accessKey: { type: String, default: "" },
    secretKey: { type: String, default: "" },
    partnerTag: { type: String, default: "" },
    region: { type: String, default: "US" }, // US, UK, CA, etc.
    isMockMode: { type: Boolean, default: false },
}, { timestamps: true });

const AmazonSettings = models.AmazonSettings || model('AmazonSettings', AmazonSettingsSchema);

export default AmazonSettings;
