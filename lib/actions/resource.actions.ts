"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import Resource from "@/lib/db/models/Resource";
import { revalidatePath } from "next/cache";

export async function createResource(title: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const resource = await Resource.create({
            title,
            url: "#", // Default
            type: "file",
            category: "General",
        });

        revalidatePath("/admin/resources");
        return JSON.parse(JSON.stringify(resource));
    } catch (error) {
        console.error("Create resource error:", error);
        return null;
    }
}

export async function getResources() {
    try {
        await connectDB();
        const resources = await Resource.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(resources));
    } catch (error) {
        console.error("Get resources error:", error);
        return [];
    }
}

export async function getResource(resourceId: string) {
    try {
        await connectDB();
        const resource = await Resource.findById(resourceId).lean();
        return JSON.parse(JSON.stringify(resource));
    } catch (error) {
        console.error("Get resource error:", error);
        return null;
    }
}

interface IResourceUpdate {
    title?: string;
    description?: string;
    url?: string;
    type?: 'file' | 'link' | 'video' | 'image' | 'pdf';
    category?: string;
    isPublished?: boolean;
}

export async function updateResource(resourceId: string, values: IResourceUpdate) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const resource = await Resource.findByIdAndUpdate(resourceId, {
            ...values,
        }, { new: true }).lean();

        revalidatePath(`/admin/resources/${resourceId}`);
        revalidatePath("/admin/resources");
        revalidatePath("/resources");
        return JSON.parse(JSON.stringify(resource));
    } catch (error) {
        console.error("Update resource error:", error);
        return null;
    }
}

export async function deleteResource(resourceId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        await Resource.findByIdAndDelete(resourceId);

        revalidatePath("/admin/resources");
        revalidatePath("/resources");
        return { success: true };
    } catch (error) {
        console.error("Delete resource error:", error);
        return { error: "Something went wrong" };
    }
}
