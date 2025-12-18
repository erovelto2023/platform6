import { Schema, model, models } from 'mongoose';

const HeadlineFrameworkSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    template: { type: String, required: true }, // e.g. "How to [Result] Without [Pain]"

    // Metadata
    category: { type: String }, // e.g. "How-To", "Listicle", "Secret"
    emotionalTriggers: [{ type: String }],
    bestPlatforms: [{ type: String }],

    // Examples
    examples: [{ type: String }],

    // System
    isSystem: { type: Boolean, default: true }, // True for default frameworks
    createdBy: { type: String }, // Clerk ID if user-created

}, { timestamps: true });

const HeadlineFramework = models.HeadlineFramework || model('HeadlineFramework', HeadlineFrameworkSchema);
export default HeadlineFramework;
