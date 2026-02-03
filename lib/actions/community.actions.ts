"use server";

import { revalidatePath } from "next/cache";
import connectToDatabase from "../db/connect";
import CommunityPost from "../db/models/CommunityPost";
import CommunityComment from "../db/models/CommunityComment";
import User from "../db/models/User";
import Friendship from "../db/models/Friendship";
import { currentUser } from "@clerk/nextjs/server";
import { notifyLike, notifyComment, notifyFriendRequest, notifyFriendAccepted } from "./notification-helpers";

// --- Profile Actions ---

export async function getUserProfile(userId: string) {
    await connectToDatabase();
    const user = await User.findById(userId).select('firstName lastName email bio coverImage avatar socialLinks interests createdAt');
    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
}

export async function updateUserProfile(userId: string, data: any) {
    await connectToDatabase();
    const user = await User.findByIdAndUpdate(userId, data, { new: true });
    revalidatePath(`/community/profile/${userId}`);
    return JSON.parse(JSON.stringify(user));
}

// --- Post Actions ---

export async function createPost(data: { userId: string; content: string; media?: string[]; video?: string; feeling?: string; visibility?: string }) {
    await connectToDatabase();
    const post = await CommunityPost.create(data);
    revalidatePath("/community");
    revalidatePath(`/community/profile/${data.userId}`);
    return JSON.parse(JSON.stringify(post));
}

export async function getPosts(filter: any = {}, limit = 10, skip = 0) {
    await connectToDatabase();
    const posts = await CommunityPost.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'firstName lastName avatar clerkId')
        .lean();

    return JSON.parse(JSON.stringify(posts));
}

export async function getCommunityPhotos(userId: string, limit = 9) {
    await connectToDatabase();
    const posts = await CommunityPost.find({
        userId: userId,
        media: { $exists: true, $ne: [] }
    })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('media');

    const photos: string[] = [];
    for (const post of posts) {
        if (post.media && Array.isArray(post.media)) {
            photos.push(...post.media);
        }
    }
    return photos.slice(0, limit);
}


export async function getPopularPosts(limit = 10) {
    await connectToDatabase();

    const posts = await CommunityPost.aggregate([
        {
            $addFields: {
                totalReactions: {
                    $add: [
                        { $ifNull: ["$reactionCounts.like", 0] },
                        { $ifNull: ["$reactionCounts.love", 0] },
                        { $ifNull: ["$reactionCounts.laugh", 0] },
                        { $ifNull: ["$reactionCounts.wow", 0] },
                        { $ifNull: ["$reactionCounts.sad", 0] },
                        { $ifNull: ["$reactionCounts.angry", 0] }
                    ]
                }
            }
        },
        {
            $addFields: {
                popularityScore: {
                    $add: [
                        "$totalReactions",
                        { $multiply: [{ $ifNull: ["$commentCount", 0] }, 2] } // Comments are worth 2x
                    ]
                }
            }
        },
        { $sort: { popularityScore: -1, createdAt: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDoc"
            }
        },
        {
            $unwind: "$userDoc"
        },
        {
            $addFields: {
                "userId": {
                    "_id": "$userDoc._id",
                    "firstName": "$userDoc.firstName",
                    "lastName": "$userDoc.lastName",
                    "avatar": "$userDoc.avatar",
                    "clerkId": "$userDoc.clerkId"
                }
            }
        },
        {
            $project: {
                userDoc: 0,
                popularityScore: 0,
                totalReactions: 0
            }
        }
    ]);

    return JSON.parse(JSON.stringify(posts));
}

export async function deletePost(postId: string, userId: string) {
    await connectToDatabase();
    const post = await CommunityPost.findById(postId);
    if (!post) throw new Error("Post not found");
    if (post.userId.toString() !== userId) throw new Error("Unauthorized");

    await CommunityPost.findByIdAndDelete(postId);
    await CommunityComment.deleteMany({ postId });

    revalidatePath("/community");
    revalidatePath(`/community/profile/${userId}`);
    return { success: true };
}

// --- Reaction Actions ---

export async function toggleReaction(postId: string, userId: string, reactionType: string) {
    await connectToDatabase();
    const post = await CommunityPost.findById(postId);
    if (!post) throw new Error("Post not found");

    // Ensure reactions map exists
    if (!post.reactions) {
        post.reactions = new Map();
    }

    const currentReaction = post.reactions.get(userId);

    if (currentReaction === reactionType) {
        // Remove reaction
        post.reactions.delete(userId);
        post.reactionCounts[reactionType]--;
    } else {
        // Add or change reaction
        if (currentReaction) {
            post.reactionCounts[currentReaction]--;
        }
        post.reactions.set(userId, reactionType);
        post.reactionCounts[reactionType]++;
    }

    await post.save();

    // Notify if adding a reaction (not removing)
    const newReaction = post.reactions.get(userId);
    if (newReaction) {
        await notifyLike(post.userId.toString(), userId, postId);
    }

    revalidatePath("/community");
    return { success: true };
}

// --- Comment Actions ---

export async function addComment(data: { userId: string; postId: string; content: string; parentId?: string }) {
    await connectToDatabase();
    const comment = await CommunityComment.create(data);

    // Update comment count on post
    const post = await CommunityPost.findByIdAndUpdate(data.postId, { $inc: { commentCount: 1 } });

    // Notify post author
    if (post) {
        await notifyComment(post.userId.toString(), data.userId, data.postId);
    }

    revalidatePath("/community");
    return JSON.parse(JSON.stringify(comment));
}

export async function deleteComment(commentId: string, userId: string) {
    await connectToDatabase();
    const comment = await CommunityComment.findById(commentId);
    if (!comment) throw new Error("Comment not found");

    // Check ownership (or if user owns the post, but keeping it simple for now)
    if (comment.userId.toString() !== userId) throw new Error("Unauthorized");

    await CommunityComment.findByIdAndDelete(commentId);
    await CommunityPost.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } });

    revalidatePath("/community");
    return { success: true };
}

export async function getComments(postId: string) {
    await connectToDatabase();
    const comments = await CommunityComment.find({ postId })
        .sort({ createdAt: 1 })
        .populate('userId', 'firstName lastName avatar clerkId')
        .lean();

    return JSON.parse(JSON.stringify(comments));
}

export async function getSavedPosts(userId: string) {
    await connectToDatabase();
    const posts = await CommunityPost.find({ savedBy: userId })
        .sort({ createdAt: -1 })
        .populate('userId', 'firstName lastName avatar clerkId')
        .lean();

    return JSON.parse(JSON.stringify(posts));
}

export async function toggleSavePost(postId: string, userId: string) {
    await connectToDatabase();
    const post = await CommunityPost.findById(postId);
    if (!post) throw new Error("Post not found");

    const savedIndex = post.savedBy?.indexOf(userId) ?? -1;
    let isSaved = false;

    if (savedIndex > -1) {
        // Unsave
        post.savedBy.splice(savedIndex, 1);
        isSaved = false;
    } else {
        // Save
        if (!post.savedBy) post.savedBy = [];
        post.savedBy.push(userId);
        isSaved = true;
    }

    await post.save();
    revalidatePath("/community");
    return { success: true, isSaved };
}

export async function getFriendsActivity(userId: string) {
    await connectToDatabase();
    // Get friends first
    const friendships = await Friendship.find({
        $or: [{ requester: userId }, { recipient: userId }],
        status: 'accepted'
    });

    const friendIds = friendships.map(f =>
        f.requester.toString() === userId ? f.recipient : f.requester
    );

    const posts = await CommunityPost.find({ userId: { $in: friendIds } })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate('userId', 'firstName lastName avatar clerkId')
        .lean();

    return JSON.parse(JSON.stringify(posts));
}


// --- Friend Actions ---

export async function sendFriendRequest(requesterId: string, recipientId: string) {
    await connectToDatabase();
    const existing = await Friendship.findOne({
        $or: [
            { requester: requesterId, recipient: recipientId },
            { requester: recipientId, recipient: requesterId }
        ]
    });

    if (existing) throw new Error("Friendship or request already exists");

    const friendship = await Friendship.create({
        requester: requesterId,
        recipient: recipientId,
        status: 'pending'
    });

    await notifyFriendRequest(recipientId, requesterId);

    return JSON.parse(JSON.stringify(friendship));
}

export async function getFriends(userId: string) {
    await connectToDatabase();
    const friendships = await Friendship.find({
        $or: [{ requester: userId }, { recipient: userId }],
        status: 'accepted'
    }).populate('requester recipient', 'firstName lastName avatar clerkId bio');

    // Map to just the friend user objects
    const friends = friendships.map(f => {
        if (f.requester._id.toString() === userId) return f.recipient;
        return f.requester;
    });

    return JSON.parse(JSON.stringify(friends));
}

export async function getSuggestedUsers(userId: string, limit = 10) {
    await connectToDatabase();

    // Get list of existing friends/requests to exclude
    const friendships = await Friendship.find({
        $or: [{ requester: userId }, { recipient: userId }]
    });

    const excludedIds = friendships.map(f =>
        f.requester.toString() === userId ? f.recipient.toString() : f.requester.toString()
    );
    excludedIds.push(userId); // Exclude self

    const users = await User.find({ _id: { $nin: excludedIds } })
        .limit(limit)
        .select('firstName lastName avatar clerkId bio');

    return JSON.parse(JSON.stringify(users));
}

export async function searchUsers(query: string, currentUserId: string) {
    await connectToDatabase();
    const regex = new RegExp(query, 'i');

    const users = await User.find({
        $or: [
            { firstName: regex },
            { lastName: regex },
            { email: regex }
        ]
    }).select('firstName lastName avatar clerkId bio');

    // Check friendship status for each user
    const usersWithStatus = await Promise.all(users.map(async (user) => {
        const status = await checkFriendshipStatus(currentUserId, user._id);
        return { ...user.toObject(), friendshipStatus: status };
    }));

    return JSON.parse(JSON.stringify(usersWithStatus));
}

export async function checkFriendshipStatus(currentUserId: string, targetUserId: string) {
    await connectToDatabase();
    const friendship = await Friendship.findOne({
        $or: [
            { requester: currentUserId, recipient: targetUserId },
            { requester: targetUserId, recipient: currentUserId }
        ]
    });

    if (!friendship) return 'none';
    if (friendship.status === 'accepted') return 'friends';
    if (friendship.status === 'pending') {
        return friendship.requester.toString() === currentUserId ? 'sent' : 'received';
    }
    return 'none';
}

export async function getFriendRequests(userId: string) {
    await connectToDatabase();
    const requests = await Friendship.find({
        recipient: userId,
        status: 'pending'
    }).populate('requester', 'firstName lastName avatar clerkId bio');

    return JSON.parse(JSON.stringify(requests));
}

export async function acceptFriendRequest(requestId: string) {
    await connectToDatabase();
    const friendship = await Friendship.findByIdAndUpdate(requestId, { status: 'accepted' });

    if (friendship) {
        await notifyFriendAccepted(friendship.requester.toString(), friendship.recipient.toString());
    }

    revalidatePath("/community/friends");
    revalidatePath("/community/members");
    return { success: true };
}

export async function rejectFriendRequest(requestId: string) {
    await connectToDatabase();
    await Friendship.findByIdAndDelete(requestId);
    revalidatePath("/community/friends");
    revalidatePath("/community/members");
    return { success: true };
}
