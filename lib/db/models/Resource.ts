import { Schema, model, models } from 'mongoose';

const ResourceSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    url: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['file', 'link', 'video', 'image', 'pdf'],
        default: 'file',
    },
    category: {
        type: String,
        default: 'General',
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Resource = models.Resource || model('Resource', ResourceSchema);

export default Resource;
