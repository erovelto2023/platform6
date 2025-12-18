import { Schema, model, models } from 'mongoose';

const AmazonTemplateSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['box', 'list', 'table', 'widget'], default: 'box' },
    content: { type: String, required: true }, // HTML/JSX template string with placeholders
    isPublic: { type: Boolean, default: false },
}, { timestamps: true });

const AmazonTemplate = models.AmazonTemplate || model('AmazonTemplate', AmazonTemplateSchema);

export default AmazonTemplate;
