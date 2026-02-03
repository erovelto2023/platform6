import { Schema, model, models } from 'mongoose';

const NotificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: [
            'friend_request',
            'friend_accepted',
            'message',
            'reaction',
            'like',
            'comment',
            'reply',
            'mention',
            'follow',
            'post_share',
            'group_invite',
            'event_invite',
            'system'
        ],
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    relatedId: {
        type: Schema.Types.ObjectId, // Could be ConversationId, FriendshipId, etc.
    },
    content: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    link: {
        type: String, // Optional direct link
    }
}, { timestamps: true });

NotificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = models.Notification || model('Notification', NotificationSchema);

export default Notification;
