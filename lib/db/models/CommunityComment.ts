import { Schema, model, models } from 'mongoose';

const CommunityCommentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'CommunityPost',
        required: true,
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'CommunityComment',
        default: null, // For nested comments
    },
    content: {
        type: String,
        required: true,
    },
    reactions: {
        type: Map,
        of: String, // userId -> reactionType
        default: {},
    },
}, { timestamps: true });

const CommunityComment = models.CommunityComment || model('CommunityComment', CommunityCommentSchema);

export default CommunityComment;
