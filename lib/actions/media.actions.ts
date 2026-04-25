"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db/connect";
import Resource from "@/lib/db/models/Resource";
import { saveFile, deleteFile } from "@/lib/storage";
import { checkRole } from "@/lib/roles";
import { auth } from "@clerk/nextjs/server";
import { escapeRegExp } from "@/lib/utils";

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

        // Determine type and mimeType
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
            mimeType,
            fileSizeBytes: file.size,
            originalFilename: file.name,
            storedFilename: url.split('/').pop(),
            isPublished: true,
            status: 'published',
            altText: title,
            thumbnailUrl: type === 'image' ? url : undefined,
        });

        revalidatePath("/admin/media");
        return { success: true, data: JSON.parse(JSON.stringify(resource)) };
    } catch (error: any) {
        console.error("[uploadMedia] Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetches all resources with filtering.
 */
export async function getResources(options: { 
    query?: string; 
    category?: string; 
    type?: string; 
    status?: string;
} = {}) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectDB();
        
        let filter: any = {};
        if (options.query) {
            const safeQuery = escapeRegExp(options.query);
            filter.$or = [
                { title: { $regex: safeQuery, $options: "i" } },
                { tags: { $regex: safeQuery, $options: "i" } }
            ];
        }
        if (options.category && options.category !== 'all') {
            filter.category = options.category;
        }
        if (options.type && options.type !== 'all') {
            filter.type = options.type;
        }
        if (options.status && options.status !== 'all') {
            filter.status = options.status;
        }

        const resources = await Resource.find(filter).sort({ createdAt: -1 }).lean();
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
        
        // Handle tags if they come as a string
        if (data.tags && typeof data.tags === 'string') {
            data.tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        }

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
        try {
            await deleteFile(resource.url);
        } catch (err) {
            console.warn(`File already deleted from disk or not found: ${resource.url}`);
        }

        // Delete from DB
        await Resource.findByIdAndDelete(id);

        revalidatePath("/admin/media");
        return { success: true };
    } catch (error: any) {
        console.error("[removeResource] Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Increment download count
 */
export async function incrementDownload(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectDB();
        await Resource.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
