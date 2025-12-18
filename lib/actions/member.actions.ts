"use server";

import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import Friendship from "@/lib/db/models/Friendship";
import mongoose from "mongoose";

interface SearchMembersParams {
    query?: string;
    filters?: {
        role?: string;
        online?: boolean;
    };
    sort?: string;
    page?: number;
    limit?: number;
    currentUserId?: string;
}

export async function searchMembers({
    query,
    filters = {},
    sort = "relevance",
    page = 1,
    limit = 20,
    currentUserId
}: SearchMembersParams) {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    const searchConditions: any = {
        isShadowBanned: { $ne: true },
        "searchSettings.hideProfile": { $ne: true },
    };

    if (query) {
        const regex = new RegExp(query, "i");
        searchConditions.$or = [
            { firstName: regex },
            { lastName: regex },
            { username: regex },
            { bio: regex },
            { skills: { $in: [regex] } },
            { interests: { $in: [regex] } },
        ];
    }

    if (filters.role) {
        searchConditions.role = filters.role;
    }

    if (filters.online) {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        searchConditions.lastActiveAt = { $gte: fiveMinutesAgo };
    }

    let sortOptions: any = {};
    switch (sort) {
        case "newest":
            sortOptions = { createdAt: -1 };
            break;
        case "oldest":
            sortOptions = { createdAt: 1 };
            break;
        case "last_active":
            sortOptions = { lastActiveAt: -1 };
            break;
        case "alphabetical":
            sortOptions = { firstName: 1, lastName: 1 };
            break;
        default:
            sortOptions = { createdAt: -1 };
    }

    const members = await User.find(searchConditions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .select("-clerkId -email") // Exclude sensitive info
        .lean();

    const total = await User.countDocuments(searchConditions);

    // Enrich with friendship status if currentUserId is provided
    let enrichedMembers = members;
    if (currentUserId) {
        const friendships = await Friendship.find({
            $or: [{ requester: currentUserId }, { recipient: currentUserId }]
        });

        // Map user ID to status
        const statusMap = new Map();
        friendships.forEach((f: any) => {
            const otherId = f.requester.toString() === currentUserId ? f.recipient.toString() : f.requester.toString();
            let status = f.status;
            if (status === 'pending') {
                status = f.requester.toString() === currentUserId ? 'sent' : 'received';
            }
            statusMap.set(otherId, status);
        });

        enrichedMembers = members.map((member: any) => ({
            ...member,
            friendshipStatus: statusMap.get(member._id.toString()) || 'none',
            mutualFriendsCount: 0
        }));
    }

    return {
        data: JSON.parse(JSON.stringify(enrichedMembers)),
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalMembers: total
    };
}


