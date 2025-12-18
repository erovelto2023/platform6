import { Schema, model, models } from 'mongoose';

const CommunityEventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String }, // 'Online' or physical address
    link: { type: String }, // Meeting link if online
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    coverImage: { type: String },
    category: { type: String, default: 'General' },
}, { timestamps: true });

const CommunityEvent = models.CommunityEvent || model('CommunityEvent', CommunityEventSchema);

export default CommunityEvent;
