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
            fileUrl: "#", // Default
        });

        revalidatePath("/admin/resources");
        return resource;
    } catch (error) {
        console.error("Create resource error:", error);
        return null;
    }
}

export async function getResources() {
    try {
        await connectDB();
        const resources = await Resource.find({}).sort({ createdAt: -1 });
        return resources;
    } catch (error) {
        console.error("Get resources error:", error);
        return [];
    }
}

export async function getResource(resourceId: string) {
    try {
        await connectDB();
        const resource = await Resource.findById(resourceId);
        return resource;
    } catch (error) {
        console.error("Get resource error:", error);
        return null;
    }
}

interface IResourceUpdate {
    title?: string;
    description?: string;
    fileUrl?: string;
    isPublished?: boolean;
    [key: string]: unknown;
}

export async function updateResource(resourceId: string, values: IResourceUpdate) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const resource = await Resource.findByIdAndUpdate(resourceId, {
            ...values,
        }, { new: true });

        revalidatePath(`/admin/resources/${resourceId}`);
        revalidatePath("/resources");
        return resource;
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
