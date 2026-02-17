
import { Schema, model, models } from 'mongoose';

const ChannelSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    workspaceId: { // Future-proofing for multi-workspace if needed, optional for now
        type: String,
    }
}, { timestamps: true });

// Ensure channel names are unique? Maybe per workspace, but for now global or just let them duplicate.
// Slack allows duplicates but usually unique slugs. We'll keep it simple for now.

const Channel = models.Channel || model('Channel', ChannelSchema);

export default Channel;
