"use server";

import connectToDatabase from "@/lib/db/connect";
import Group from "@/lib/db/models/Group";
import GroupMember from "@/lib/db/models/GroupMember";
import Thread from "@/lib/db/models/Thread";
import Reply from "@/lib/db/models/Reply";
import User from "@/lib/db/models/User";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { currentUser } from "@clerk/nextjs/server";

// --- Group Actions ---

export async function createGroup(data: any) {
    await connectToDatabase();

    // Create slug from name
    const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const group = await Group.create({ ...data, slug });

    // Add creator as Admin
    await GroupMember.create({
        group: (group as any)._id,
        user: data.createdBy,
        role: "Admin",
        status: "Active",
    });

    revalidatePath("/admin/groups");
    revalidatePath("/community/groups");
    return JSON.parse(JSON.stringify(group));
}

export async function getGroups(filter: any = {}) {
    await connectToDatabase();
    const groups = await Group.find(filter).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(groups));
}

export async function getGroupsWithMembership(userId: string) {
    await connectToDatabase();

    // Fetch all active groups
    const groups = await Group.find({ status: { $ne: 'Archived' } }).sort({ isFeatured: -1, memberCount: -1 }).lean();

    // Fetch user memberships
    const memberships = await GroupMember.find({ user: userId });
    const joinedGroupIds = memberships.map(m => m.group.toString());

    const result = groups.map((group: any) => ({
        ...group,
        joined: joinedGroupIds.includes(group._id.toString())
    }));

    return JSON.parse(JSON.stringify(result));
}


export async function getGroup(slug: string) {
    await connectToDatabase();
    const group = await Group.findOne({ slug }).lean();
    if (!group) return null;
    return JSON.parse(JSON.stringify(group));
}

export async function getGroupById(id: string) {
    await connectToDatabase();
    const group = await Group.findById(id).lean();
    if (!group) return null;
    return JSON.parse(JSON.stringify(group));
}

export async function joinGroup(groupId: string, userId: string) {
    await connectToDatabase();

    const existingMember = await GroupMember.findOne({ group: groupId, user: userId });
    if (existingMember) return { success: false, message: "Already a member" };

    await GroupMember.create({
        group: groupId,
        user: userId,
        role: "Member",
        status: "Active", // Or Pending based on group settings
    });

    await Group.findByIdAndUpdate(groupId, { $inc: { memberCount: 1 } });

    revalidatePath(`/community/groups/${groupId}`);
    return { success: true };
}

// --- Thread Actions ---

export async function createThread(data: any) {
    try {
        await connectToDatabase();

        // Map flat form data to nested schema structure
        const threadData: any = {
            ...data,
            // Let Mongoose handle casting to ObjectId
            discussion: data.type === 'Discussion' ? {
                category: data.category
            } : undefined,
            resource: data.type === 'Resource' ? {
                url: data.resourceUrl
            } : undefined,
            poll: data.type === 'Poll' ? {
                question: data.title,
                options: Array.isArray(data.pollOptions)
                    ? data.pollOptions
                        .filter((o: any) => typeof o === 'string' && o.trim() !== "")
                        .map((text: string) => ({ text, votes: 0, voters: [] }))
                    : [],
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
            } : undefined,
            winDetails: data.type === 'Win' ? {
                type: data.winType,
                winDate: data.winDate ? new Date(data.winDate) : new Date(),
                proof: {
                    type: data.proofType || 'None',
                    url: data.proofUrl,
                },
                reflection: {
                    whatIDid: data.whatIDid,
                    whatWorked: data.whatWorked,
                    whatIdDoDifferently: data.whatIdDoDifferently,
                    biggestLesson: data.biggestLesson,
                },
                impact: {
                    inspiredBy: data.inspiredBy,
                    helpedBy: data.helpedBy ? data.helpedBy.split(',').map((s: string) => s.trim()) : [],
                    resourcesUsed: data.resourcesUsed,
                },
                metrics: {
                    before: data.metricBefore,
                    after: data.metricAfter,
                    type: data.metricType,
                    timeToWin: data.timeToWin,
                }
            } : undefined,
            resourceDetails: data.type === 'Resource' ? {
                type: data.resourceType || 'Link',
                shortDescription: data.resourceShortDesc,
                url: data.resourceUrl,
                thumbnailUrl: data.resourceThumbnail,

                platform: data.resourcePlatform,
                pricing: data.resourcePricing,
                isAffiliate: data.resourceIsAffiliate,

                fileType: data.resourceFileType,
                fileSize: data.resourceFileSize,
                version: data.resourceVersion,

                duration: data.resourceDuration,
                hostingPlatform: data.resourceHosting,
                transcript: data.resourceTranscript,
                playbackType: data.resourcePlayback,

                category: data.resourceCategory,
                subcategory: data.resourceSubcategory,
                tags: data.resourceTags ? data.resourceTags.split(',').map((s: string) => s.trim()) : [],
                difficulty: data.resourceDifficulty,
                intendedOutcome: data.resourceOutcome,

                howToUse: data.resourceHowTo,
                bestFor: data.resourceBestFor,
                prerequisites: data.resourcePrereq,
                estimatedTime: data.resourceTime,

                source: data.resourceSource,
                license: data.resourceLicense,
                usageRights: data.resourceRights,
                attributionText: data.resourceAttribution,
            } : undefined,
        };

        const thread = await Thread.create(threadData);

        await Group.findByIdAndUpdate(data.group, { $inc: { threadCount: 1 } });

        revalidatePath(`/community/groups/${data.groupSlug}`);
        return JSON.parse(JSON.stringify(thread));
    } catch (error) {
        console.error("Error creating thread:", error);
        throw error; // Re-throw so client receives the error
    }
}

export async function getThreads(groupId: string, limit = 10, skip = 0, filter: any = {}) {
    await connectToDatabase();

    const query: any = { group: new mongoose.Types.ObjectId(groupId), ...filter };

    const threads = await Thread.find(query)
        .sort({ isPinned: -1, lastActivityAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "firstName lastName avatar clerkId")
        .lean();

    return JSON.parse(JSON.stringify(threads));
}

export async function getThread(threadId: string) {
    await connectToDatabase();
    const thread = await Thread.findById(threadId)
        .populate("author", "firstName lastName avatar clerkId")
        .lean();

    if (!thread) return null;

    // Increment views
    await Thread.findByIdAndUpdate(threadId, { $inc: { views: 1 } });

    return JSON.parse(JSON.stringify(thread));
}

export async function deleteThread(threadId: string, groupSlug: string) {
    await connectToDatabase();
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) throw new Error("User not found");

    const thread = await Thread.findById(threadId);
    if (!thread) throw new Error("Thread not found");

    // Check permissions: Author or Group Admin
    const isAuthor = thread.author.toString() === dbUser._id.toString();

    let isAdmin = false;
    if (!isAuthor) {
        const member = await GroupMember.findOne({ group: thread.group, user: dbUser._id });
        isAdmin = member?.role === "Admin" || member?.role === "Moderator";
    }

    if (!isAuthor && !isAdmin) {
        throw new Error("Unauthorized to delete this thread");
    }

    // Delete thread
    await Thread.findByIdAndDelete(threadId);

    // Delete replies
    await Reply.deleteMany({ thread: threadId });

    // Decrement thread count
    await Group.findByIdAndUpdate(thread.group, { $inc: { threadCount: -1 } });

    revalidatePath(`/community/groups/${groupSlug}`);
    return { success: true };
}

// --- Reply Actions ---

export async function createReply(data: any) {
    await connectToDatabase();

    const reply = await Reply.create(data);

    // Update thread stats
    await Thread.findByIdAndUpdate(data.thread, {
        $inc: { replyCount: 1 },
        lastActivityAt: new Date(),
    });

    revalidatePath(`/community/groups/${data.groupSlug}/threads/${data.thread}`);
    return JSON.parse(JSON.stringify(reply));
}

export async function getReplies(threadId: string) {
    await connectToDatabase();
    const replies = await Reply.find({ thread: threadId })
        .sort({ createdAt: 1 })
        .populate("author", "firstName lastName avatar clerkId")
        .lean();

    return JSON.parse(JSON.stringify(replies));
}

// --- Member Actions ---

export async function getGroupMember(groupId: string, userId: string) {
    await connectToDatabase();
    const member = await GroupMember.findOne({ group: groupId, user: userId }).lean();
    return JSON.parse(JSON.stringify(member));
}

export async function getGroupMembers(groupId: string) {
    await connectToDatabase();
    const members = await GroupMember.find({ group: groupId })
        .populate("user", "firstName lastName avatar clerkId")
        .sort({ role: 1, createdAt: 1 }) // Admins first, then by join date
        .lean();

    // Filter out members where user might have been deleted
    const validMembers = members.filter((member: any) => member.user);

    // Calculate post counts for each member in this group
    const membersWithStats = await Promise.all(
        validMembers.map(async (member: any) => {
            const threadCount = await Thread.countDocuments({
                group: groupId,
                author: member.user._id
            });
            return {
                ...member,
                postCount: threadCount
            };
        })
    );

    return JSON.parse(JSON.stringify(membersWithStats));
}

export async function votePoll(threadId: string, optionIndex: number, userId: string, groupSlug: string) {
    await connectToDatabase();

    const thread = await Thread.findById(threadId);
    if (!thread || !thread.poll) throw new Error("Poll not found");

    // Check if user already voted
    const hasVoted = thread.poll.options.some((opt: any) => opt.voters.includes(userId));
    if (hasVoted && !thread.poll.allowMultipleVotes) {
        throw new Error("You have already voted in this poll");
    }

    // Add vote
    const option = thread.poll.options[optionIndex];
    if (!option.voters.includes(userId)) {
        option.voters.push(userId);
        option.votes += 1;
    }

    await thread.save();

    revalidatePath(`/community/groups/${groupSlug}/threads/${threadId}`);
    return JSON.parse(JSON.stringify(thread));
}

export async function markAsSolved(threadId: string, replyId: string, groupSlug: string) {
    await connectToDatabase();

    // Update thread
    await Thread.findByIdAndUpdate(threadId, {
        "question.isSolved": true,
        "question.acceptedAnswer": replyId,
        isSolved: true,
    });

    // Update reply
    // First, unmark any previously accepted answer
    await Reply.updateMany({ thread: threadId }, { isAcceptedAnswer: false });

    // Mark new accepted answer
    await Reply.findByIdAndUpdate(replyId, { isAcceptedAnswer: true });

    revalidatePath(`/community/groups/${groupSlug}/threads/${threadId}`);
    return { success: true };
}

export async function updateGroup(groupId: string, data: any) {
    await connectToDatabase();

    // If name changes, we might want to update slug, but usually slug is permanent.
    // For now, let's allow updating other fields.

    const group = await Group.findByIdAndUpdate(groupId, data, { new: true });

    revalidatePath(`/admin/groups/${groupId}`);
    revalidatePath(`/community/groups/${group.slug}`);
    revalidatePath("/community/groups");

    return JSON.parse(JSON.stringify(group));
}

export async function updateGroupMemberRole(groupId: string, userId: string, role: string) {
    await connectToDatabase();

    await GroupMember.findOneAndUpdate(
        { group: groupId, user: userId },
        { role }
    );

    revalidatePath(`/admin/groups/${groupId}`);
    revalidatePath(`/community/groups`); // Revalidate generally

    return { success: true };
}

export async function removeGroupMember(groupId: string, userId: string) {
    await connectToDatabase();

    await GroupMember.findOneAndDelete({ group: groupId, user: userId });
    await Group.findByIdAndUpdate(groupId, { $inc: { memberCount: -1 } });

    revalidatePath(`/admin/groups/${groupId}`);

    return { success: true };
}
