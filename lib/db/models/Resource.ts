import { Schema, model, models } from 'mongoose';

const ResourceSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Resource = models.Resource || model('Resource', ResourceSchema);

export default Resource;
