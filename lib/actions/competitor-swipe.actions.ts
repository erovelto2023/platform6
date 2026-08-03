"use server";

import { auth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/db/connect';
import CompetitorSwipe from '@/lib/db/models/CompetitorSwipe';
import { revalidatePath } from 'next/cache';

export async function createSwipe(data: {
    title: string;
    competitorId?: string;
    competitorName?: string;
    platform?: string;
    hookType?: string;
    adCopyText?: string;
    mediaUrl?: string;
    landingPageUrl?: string;
    notes?: string;
    rating?: number;
}) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();

        const swipe = await CompetitorSwipe.create({
            userId,
            ...data
        });

        revalidatePath('/tools/competition-black-book/ad-swipe');
        return { success: true, swipe: JSON.parse(JSON.stringify(swipe)) };
    } catch (error: any) {
        console.error("createSwipe error:", error);
        return { success: false, error: error.message || "Failed to save swipe" };
    }
}

export async function getSwipes(competitorId?: string) {
    try {
        const { userId } = await auth();
        if (!userId) return [];

        await connectToDatabase();

        const filter: any = { userId };
        if (competitorId) filter.competitorId = competitorId;

        const swipes = await CompetitorSwipe.find(filter).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(swipes));
    } catch (error) {
        console.error("getSwipes error:", error);
        return [];
    }
}

export async function updateSwipe(id: string, data: Partial<any>) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();

        const swipe = await CompetitorSwipe.findOneAndUpdate(
            { _id: id, userId },
            { $set: data },
            { new: true }
        );

        revalidatePath('/tools/competition-black-book/ad-swipe');
        return { success: true, swipe: JSON.parse(JSON.stringify(swipe)) };
    } catch (error: any) {
        console.error("updateSwipe error:", error);
        return { success: false, error: error.message || "Failed to update swipe" };
    }
}

export async function deleteSwipe(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();

        await CompetitorSwipe.deleteOne({ _id: id, userId });
        revalidatePath('/tools/competition-black-book/ad-swipe');
        return { success: true };
    } catch (error: any) {
        console.error("deleteSwipe error:", error);
        return { success: false, error: error.message || "Failed to delete swipe" };
    }
}
