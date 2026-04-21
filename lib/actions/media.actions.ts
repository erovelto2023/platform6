"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db/connect";
import Resource from "@/lib/db/models/Resource";
import { saveFile, deleteFile } from "@/lib/storage";
import { checkRole } from "@/lib/roles";

/**
 * Uploads a file to local storage and creates a database record.
 */
export async function uploadMedia(formData: FormData) {
    try {
        const isAdmin = await checkRole("admin");
        if (!isAdmin) throw new Error("Unauthorized");

        const file = formData.get("file") as File;
        if (!file) throw new Error("No file provided");

        const category = (formData.get("category") as string) || "General";
        const title = (formData.get("title") as string) || file.name;

        // Save to filesystem
        const url = await saveFile(file);

        // Determine type
        let type: "image" | "pdf" | "file" = "file";
        const mimeType = file.type;
        if (mimeType.startsWith("image/")) {
            type = "image";
        } else if (mimeType === "application/pdf") {
            type = "pdf";
        }

        await connectDB();
        const resource = await Resource.create({
            title,
            url,
            type,
            category,
            isPublished: true,
        });

        revalidatePath("/admin/media");
        return { success: true, data: JSON.parse(JSON.stringify(resource)) };
    } catch (error: any) {
        console.error("[uploadMedia] Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetches all resources.
 */
export async function getResources(query?: string) {
    try {
        await connectDB();
        
        let filter: any = {};
        if (query) {
            filter.title = { $regex: query, $options: "i" };
        }

        const resources = await Resource.find(filter).sort({ createdAt: -1 });
        return { success: true, data: JSON.parse(JSON.stringify(resources)) };
    } catch (error: any) {
        console.error("[getResources] Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Updates a resource record.
 */
export async function updateResource(id: string, data: any) {
    try {
        const isAdmin = await checkRole("admin");
        if (!isAdmin) throw new Error("Unauthorized");

        await connectDB();
        const resource = await Resource.findByIdAndUpdate(id, data, { new: true });

        revalidatePath("/admin/media");
        return { success: true, data: JSON.parse(JSON.stringify(resource)) };
    } catch (error: any) {
        console.error("[updateResource] Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Deletes a resource from DB and disk.
 */
export async function removeResource(id: string) {
    try {
        const isAdmin = await checkRole("admin");
        if (!isAdmin) throw new Error("Unauthorized");

        await connectDB();
        const resource = await Resource.findById(id);
        if (!resource) throw new Error("Resource not found");

        // Delete from disk
        await deleteFile(resource.url);

        // Delete from DB
        await Resource.findByIdAndDelete(id);

        revalidatePath("/admin/media");
        return { success: true };
    } catch (error: any) {
        console.error("[removeResource] Error:", error);
        return { success: false, error: error.message };
    }
}
