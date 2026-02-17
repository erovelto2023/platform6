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
    isEdited: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

MessageSchema.index({ conversationId: 1, createdAt: 1 });

const Message = models.Message || model('Message', MessageSchema);

export default Message;
