
import { Schema, model, models } from 'mongoose';

const PillarContentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    topic: String,
    format: {
        type: String,
        enum: ['blog', 'video', 'podcast', 'whitepaper', 'webinar', 'course', 'other'],
    },
    mainContentId: {
        type: Schema.Types.ObjectId,
        ref: 'ContentPost',
    },
    repurposeCount: {
        type: Number,
        default: 0,
    },
    userId: {
        type: String,
        required: true,
        index: true,
    },
    businessId: {
        type: String,
        required: true,
        index: true,
    },
}, { timestamps: true });

// Prevent Mongoose OverwriteModelError
if (models.PillarContent) {
    delete models.PillarContent;
}

const PillarContent = model('PillarContent', PillarContentSchema);

export default PillarContent;
