import { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
    },
    channelId: {
        type: Schema.Types.ObjectId,
        ref: 'Channel',
    },

    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
    },
    type: {
        type: String,
        enum: ['text', 'image', 'file', 'system'],
        default: 'text',
    },
    attachments: [{
        type: String, // URLs
    }],
    readBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    reactions: {
        type: Map,
        of: String, // UserId -> Emoji
        default: {},
    },
    replyTo: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
    },
    replyCount: {
        type: Number,
        default: 0,
    },
    lastReplyAt: {
        type: Date,
    },
    isEdited: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    mentions: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    isPinned: {
        type: Boolean,
        default: false,
    },
    pinnedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    bookmarkedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

MessageSchema.index({ conversationId: 1, createdAt: 1 });
MessageSchema.index({ channelId: 1, createdAt: 1 });
MessageSchema.index({ replyTo: 1, createdAt: 1 });

const Message = models.Message || model('Message', MessageSchema);

export default Message;
