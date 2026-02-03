import { Schema, model, models } from 'mongoose';

const CommunityPostSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    media: [{
        type: String, // URLs to images/videos
    }],
    visibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public',
    },
    reactions: {
        type: Map,
        of: String, // userId -> reactionType (like, love, laugh, wow, sad, angry)
        default: {},
    },
    reactionCounts: {
        like: { type: Number, default: 0 },
        love: { type: Number, default: 0 },
        laugh: { type: Number, default: 0 },
        wow: { type: Number, default: 0 },
        sad: { type: Number, default: 0 },
        angry: { type: Number, default: 0 },
    },
    commentCount: {
        type: Number,
        default: 0,
    },
    savedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
}, { timestamps: true });

const CommunityPost = models.CommunityPost || model('CommunityPost', CommunityPostSchema);

export default CommunityPost;
