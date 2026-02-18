import { Schema, model, models } from 'mongoose';

const ClipSchema = new Schema({
    id: { type: String, required: true },
    url: { type: String, required: true },
    name: { type: String },
    type: { type: String, enum: ['video', 'audio', 'image'], default: 'video' },
    startTime: { type: Number, default: 0 }, // Trim start
    endTime: { type: Number },           // Trim end
    duration: { type: Number },          // Original duration
    position: { type: Number, default: 0 }, // Position on timeline (ms)
    width: { type: Number },
    height: { type: Number },
});

const VideoProjectSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled Project',
    },
    description: {
        type: String,
    },
    clips: [ClipSchema],
    status: {
        type: String,
        enum: ['draft', 'rendering', 'completed', 'failed'],
        default: 'draft',
    },
    exportUrl: {
        type: String,
    },
    outputPath: {
        type: String, // Local path on VPS during rendering
    },
    lastRenderedAt: {
        type: Date,
    },
    renderError: {
        type: String,
    }
}, { timestamps: true });

const VideoProject = models.VideoProject || model('VideoProject', VideoProjectSchema);

export default VideoProject;
