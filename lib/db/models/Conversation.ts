import { Schema, model, models } from 'mongoose';

const ConversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
    },
    unreadCounts: {
        type: Map,
        of: Number,
        default: {},
    },
    isGroup: {
        type: Boolean,
        default: false,
    },
    groupName: {
        type: String,
    },
    groupImage: {
        type: String,
    },
    admins: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    archivedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    mutedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

// Index for fetching user's conversations efficiently
ConversationSchema.index({ participants: 1, lastMessageAt: -1 });

const Conversation = models.Conversation || model('Conversation', ConversationSchema);

export default Conversation;
