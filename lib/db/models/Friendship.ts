import { Schema, model, models } from 'mongoose';

const FriendshipSchema = new Schema({
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'blocked'],
        default: 'pending',
    },
    blockedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    mutedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

// Ensure unique friendship request between two users
FriendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

const Friendship = models.Friendship || model('Friendship', FriendshipSchema);

export default Friendship;
