import { Schema, model, models } from 'mongoose';

const AssignmentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    points: {
        type: Number,
        default: 100,
    },
    instructions: {
        type: String,
    },
    attachments: [{
        name: { type: String, required: true },
        url: { type: String, required: true }
    }],
    submissions: [{
        userId: {
            type: String, // clerkId
            required: true,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        content: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        grade: {
            type: String,
        }
    }]
}, { timestamps: true });

const Assignment = models.Assignment || model('Assignment', AssignmentSchema);

export default Assignment;
