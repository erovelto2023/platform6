import { Schema, model, models } from 'mongoose';

const ContentTemplateSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    category: { type: String, required: true }, // e.g., "Written Content", "Social Media"
    subcategory: { type: String }, // e.g., "Blog & Article Types"
    description: { type: String },
    icon: { type: String }, // Lucide icon name

    // The "Master Prompt" controlled by Admin
    systemPrompt: { type: String, required: true },

    // Configuration for the User Input Form
    inputs: [{
        label: { type: String, required: true }, // e.g., "Target Audience"
        variableName: { type: String, required: true }, // e.g., "audience"
        type: {
            type: String,
            enum: ['text', 'textarea', 'select', 'number'],
            default: 'text'
        },
        placeholder: String,
        options: [String], // For select inputs
        required: { type: Boolean, default: true }
    }],

    isActive: { type: Boolean, default: true },
    isPremium: { type: Boolean, default: false }
}, { timestamps: true });

const ContentTemplate = models.ContentTemplate || model('ContentTemplate', ContentTemplateSchema);

export default ContentTemplate;
