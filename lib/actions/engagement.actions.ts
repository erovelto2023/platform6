"use server";

import connectToDatabase from "@/lib/db/connect";
import Thread from "@/lib/db/models/Thread";
import UserThreadActivity from "@/lib/db/models/UserThreadActivity";
import { revalidatePath } from "next/cache";

// --- Get Activity ---

export async function getUserThreadActivity(threadId: string, userId: string) {
    await connectToDatabase();
    const activity = await UserThreadActivity.findOne({ thread: threadId, user: userId }).lean();
    return JSON.parse(JSON.stringify(activity));
}

// --- Actions ---

export async function toggleThreadSave(threadId: string, userId: string, path: string) {
    await connectToDatabase();

    const activity = await UserThreadActivity.findOne({ thread: threadId, user: userId });

    let isSaved = false;

    if (activity) {
        isSaved = !activity.isSaved;
        activity.isSaved = isSaved;
        activity.savedAt = isSaved ? new Date() : undefined;
        await activity.save();
    } else {
        isSaved = true;
        await UserThreadActivity.create({
            thread: threadId,
            user: userId,
            isSaved: true,
            savedAt: new Date(),
        });
    }

    // Update Thread Counter
    await Thread.findByIdAndUpdate(threadId, {
        $inc: { bookmarkCount: isSaved ? 1 : -1 }
    });

    revalidatePath(path);
    return { isSaved };
}

export async function toggleThreadCompletion(threadId: string, userId: string, path: string) {
    await connectToDatabase();

    const activity = await UserThreadActivity.findOne({ thread: threadId, user: userId });

    let isCompleted = false;

    if (activity) {
        isCompleted = !activity.isCompleted;
        activity.isCompleted = isCompleted;
        activity.completedAt = isCompleted ? new Date() : undefined;
        // If completing, set progress to 100
        if (isCompleted) activity.progress = 100;
        await activity.save();
    } else {
        isCompleted = true;
        await UserThreadActivity.create({
            thread: threadId,
            user: userId,
            isCompleted: true,
            completedAt: new Date(),
            progress: 100,
        });
    }

    // Update Thread Counter (specifically for resources)
    await Thread.findByIdAndUpdate(threadId, {
        $inc: { "resourceDetails.completionCount": isCompleted ? 1 : -1 }
    });

    revalidatePath(path);
    return { isCompleted };
}

export async function toggleThreadHelpful(threadId: string, userId: string, path: string) {
    await connectToDatabase();

    const activity = await UserThreadActivity.findOne({ thread: threadId, user: userId });

    let isHelpful = false;

    if (activity) {
        isHelpful = !activity.isHelpful;
        activity.isHelpful = isHelpful;
        await activity.save();
    } else {
        isHelpful = true;
        await UserThreadActivity.create({
            thread: threadId,
            user: userId,
            isHelpful: true,
        });
    }

    // Update Thread Counter (using upvoteCount for helpfulness)
    await Thread.findByIdAndUpdate(threadId, {
        $inc: { upvoteCount: isHelpful ? 1 : -1 }
    });

    revalidatePath(path);
    return { isHelpful };
}

export async function rateThread(threadId: string, userId: string, rating: number, path: string) {
    await connectToDatabase();

    const activity = await UserThreadActivity.findOne({ thread: threadId, user: userId });

    let oldRating = 0;
    let isNewRating = true;

    if (activity) {
        if (activity.rating) {
            oldRating = activity.rating;
            isNewRating = false;
        }
        activity.rating = rating;
        activity.ratedAt = new Date();
        await activity.save();
    } else {
        await UserThreadActivity.create({
            thread: threadId,
            user: userId,
            rating: rating,
            ratedAt: new Date(),
        });
    }

    // Recalculate Average Rating
    // This is the robust way: fetch all ratings
    const allRatings = await UserThreadActivity.find({
        thread: threadId,
        rating: { $exists: true, $ne: null }
    }).select("rating");

    const totalRating = allRatings.reduce((sum: number, item: any) => sum + item.rating, 0);
    const count = allRatings.length;
    const average = count > 0 ? totalRating / count : 0;

    await Thread.findByIdAndUpdate(threadId, {
        "resourceDetails.averageRating": average,
        "resourceDetails.ratingCount": count,
    });

    revalidatePath(path);
    return { rating, average, count };
}

export async function saveThreadNote(threadId: string, userId: string, note: string, path: string) {
    await connectToDatabase();

    const activity = await UserThreadActivity.findOne({ thread: threadId, user: userId });

    if (activity) {
        activity.personalNotes = note;
        await activity.save();
    } else {
        await UserThreadActivity.create({
            thread: threadId,
            user: userId,
            personalNotes: note,
        });
    }

    revalidatePath(path);
    return { success: true };
}

export async function updateThreadProgress(threadId: string, userId: string, progress: number) {
    await connectToDatabase();

    const activity = await UserThreadActivity.findOne({ thread: threadId, user: userId });

    if (activity) {
        activity.progress = progress;
        activity.lastAccessedAt = new Date();
        await activity.save();
    } else {
        await UserThreadActivity.create({
            thread: threadId,
            user: userId,
            progress: progress,
            lastAccessedAt: new Date(),
        });
    }

    // No revalidate needed usually for progress updates as they are frequent
    return { success: true };
}
