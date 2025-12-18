import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        thread: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread",
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        parentReply: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reply",
            default: null,
        },

        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        isAcceptedAnswer: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const Reply = mongoose.models.Reply || mongoose.model("Reply", ReplySchema);

export default Reply;
