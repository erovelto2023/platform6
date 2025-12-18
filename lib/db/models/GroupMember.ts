import mongoose from "mongoose";

const GroupMemberSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["Admin", "Moderator", "Member"],
            default: "Member",
        },
        status: {
            type: String,
            enum: ["Active", "Pending", "Banned"],
            default: "Active",
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure a user can only be a member of a group once
GroupMemberSchema.index({ group: 1, user: 1 }, { unique: true });

const GroupMember = mongoose.models.GroupMember || mongoose.model("GroupMember", GroupMemberSchema);

export default GroupMember;
