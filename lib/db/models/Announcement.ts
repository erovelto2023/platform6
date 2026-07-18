import { Schema, model, models } from 'mongoose';

const AnnouncementSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    readBy: [{
        type: String, // clerkId of users who read it
    }],
    archivedBy: [{
        type: String, // clerkId of users who archived it
    }],
}, { timestamps: true });

const Announcement = models.Announcement || model('Announcement', AnnouncementSchema);

export default Announcement;
