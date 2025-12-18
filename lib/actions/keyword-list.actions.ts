"use server";

import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db/connect";
import { KeywordList } from "@/lib/db/models/KeywordList";
import { revalidatePath } from "next/cache";

export async function createKeywordList(name: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();

        const newList = await KeywordList.create({
            userId,
            name,
            keywords: []
        });

        revalidatePath("/tools/keyword-explorer");
        return JSON.parse(JSON.stringify(newList));
    } catch (error) {
        console.error("Error creating keyword list:", error);
        throw new Error("Failed to create keyword list");
    }
}

export async function getUserKeywordLists() {
    try {
        const { userId } = await auth();
        if (!userId) return [];

        await connectToDatabase();

        const lists = await KeywordList.find({ userId }).sort({ updatedAt: -1 });
        return JSON.parse(JSON.stringify(lists));
    } catch (error) {
        console.error("Error fetching keyword lists:", error);
        return [];
    }
}

export async function addKeywordsToList(listId: string, keywords: any[]) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();

        const list = await KeywordList.findOne({ _id: listId, userId });
        if (!list) throw new Error("List not found");

        // Filter out duplicates that are already in the list
        const existingKeywords = new Set(list.keywords.map((k: any) => k.keyword));
        const newKeywords = keywords.filter((k: any) => !existingKeywords.has(k.keyword));

        if (newKeywords.length > 0) {
            list.keywords.push(...newKeywords);
            list.updatedAt = new Date();
            await list.save();
        }

        revalidatePath("/tools/keyword-explorer");
        return { success: true, addedCount: newKeywords.length };
    } catch (error) {
        console.error("Error adding keywords to list:", error);
        throw new Error("Failed to add keywords to list");
    }
}

export async function deleteKeywordList(listId: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();

        await KeywordList.findOneAndDelete({ _id: listId, userId });
        revalidatePath("/tools/keyword-explorer");
        return { success: true };
    } catch (error) {
        console.error("Error deleting keyword list:", error);
        throw new Error("Failed to delete keyword list");
    }
}
