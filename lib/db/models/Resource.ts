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
    altText: {
        type: String,
    },
    tags: {
        type: [String],
        default: [],
    },
    thumbnailUrl: {
        type: String,
    },
    fileSizeBytes: {
        type: Number,
        default: 0,
    },
    mimeType: {
        type: String,
    },
    storedFilename: {
        type: String,
    },
    originalFilename: {
        type: String,
    },
    downloadCount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published',
    },
    category: {
        type: String,
        default: 'General',
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Resource = models.Resource || model('Resource', ResourceSchema);

export default Resource;
