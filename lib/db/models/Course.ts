import { Schema, model, models } from 'mongoose';

const AttachmentSchema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
});

const LessonSchema = new Schema({
    title: { type: String, required: true },
    type: {
        type: String,
        enum: ['video', 'text', 'audio', 'download'],
        default: 'video',
    },
    content: { type: String }, // For text lessons
    videoUrl: { type: String }, // For video/audio
    fileUrl: { type: String }, // For download
    fileName: { type: String },
    attachments: [AttachmentSchema],
    isFreePreview: { type: Boolean, default: false },
});

const ModuleSchema = new Schema({
    title: { type: String, required: true },
    lessons: [LessonSchema],
});

const CourseSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    thumbnail: { type: String },
    description: { type: String },
    price: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    modules: [ModuleSchema],
}, { timestamps: true });

const Course = models.Course || model('Course', CourseSchema);

export default Course;
