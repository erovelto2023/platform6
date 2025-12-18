"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import NicheBox from "@/lib/db/models/NicheBox";
import { revalidatePath } from "next/cache";

export async function createNicheBox(title: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        const nicheBox = await NicheBox.create({
            title,
            slug,
        });

        revalidatePath("/admin/niche-boxes");
        return { success: true, id: nicheBox._id.toString() };
    } catch (error) {
        console.error("Create niche box error:", error);
        return { error: "Something went wrong" };
    }
}

export async function getNicheBoxes() {
    try {
        await connectDB();
        const niches = await NicheBox.find({}).sort({ createdAt: -1 });
        return niches.map(niche => ({
            ...niche.toObject(),
            _id: niche._id.toString(),
            createdAt: niche.createdAt.toISOString(),
            updatedAt: niche.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Get niche boxes error:", error);
        return [];
    }
}

export async function getNicheBox(nicheId: string) {
    try {
        await connectDB();
        const niche = await NicheBox.findById(nicheId);
        if (!niche) return null;
        return JSON.parse(JSON.stringify(niche));
    } catch (error) {
        console.error("Get niche box error:", error);
        return null;
    }
}

interface INicheBoxUpdate {
    title?: string;
    description?: string;
    thumbnail?: string;
    isPublished?: boolean;
    price?: number;
    [key: string]: unknown;
}

export async function updateNicheBox(nicheId: string, values: INicheBoxUpdate) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const niche = await NicheBox.findByIdAndUpdate(
            nicheId,
            { ...values },
            { new: true }
        );

        revalidatePath(`/admin/niche-boxes/${nicheId}`);
        return { success: true, niche: JSON.parse(JSON.stringify(niche)) };
    } catch (error) {
        console.error("Update niche box error:", error);
        return { error: "Something went wrong" };
    }
}

export async function addKeyword(nicheId: string, keywordData: { keyword: string; volume: number; difficulty: string }) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };
        await connectDB();

        await NicheBox.findByIdAndUpdate(nicheId, {
            $push: { keywords: keywordData }
        });

        revalidatePath(`/admin/niche-boxes/${nicheId}`);
        return { success: true };
    } catch {
        return { error: "Error adding keyword" };
    }
}

export async function removeKeyword(nicheId: string, keywordId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };
        await connectDB();

        await NicheBox.findByIdAndUpdate(nicheId, {
            $pull: { keywords: { _id: keywordId } }
        });

        revalidatePath(`/admin/niche-boxes/${nicheId}`);
        return { success: true };
    } catch {
        return { error: "Error removing keyword" };
    }
}

export async function addDownload(nicheId: string, downloadData: { title: string; url: string; type: string }) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };
        await connectDB();

        await NicheBox.findByIdAndUpdate(nicheId, {
            $push: { downloads: downloadData }
        });

        revalidatePath(`/admin/niche-boxes/${nicheId}`);
        return { success: true };
    } catch {
        return { error: "Error adding download" };
    }
}

export async function removeDownload(nicheId: string, downloadId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };
        await connectDB();

        await NicheBox.findByIdAndUpdate(nicheId, {
            $pull: { downloads: { _id: downloadId } }
        });

        revalidatePath(`/admin/niche-boxes/${nicheId}`);
        return { success: true };
    } catch {
        return { error: "Error removing download" };
    }
}

export async function addBusinessIdea(nicheId: string, idea: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };
        await connectDB();

        await NicheBox.findByIdAndUpdate(nicheId, {
            $push: { businessIdeas: idea }
        });

        revalidatePath(`/admin/niche-boxes/${nicheId}`);
        return { success: true };
    } catch {
        return { error: "Error adding idea" };
    }
}

export async function removeBusinessIdea(nicheId: string, idea: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };
        await connectDB();

        await NicheBox.findByIdAndUpdate(nicheId, {
            $pull: { businessIdeas: idea }
        });

        revalidatePath(`/admin/niche-boxes/${nicheId}`);
        return { success: true };
    } catch {
        return { error: "Error removing idea" };
    }
}

export async function addVideo(nicheId: string, videoData: { title: string; url: string }) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };
        await connectDB();

        await NicheBox.findByIdAndUpdate(nicheId, {
            $push: { videos: videoData }
        });

        revalidatePath(`/admin/niche-boxes/${nicheId}`);
        revalidatePath(`/niche-boxes/${nicheId}`);
        return { success: true };
    } catch {
        return { error: "Error adding video" };
    }
}

export async function removeVideo(nicheId: string, videoId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };
        await connectDB();

        await NicheBox.findByIdAndUpdate(nicheId, {
            $pull: { videos: { _id: videoId } }
        });

        revalidatePath(`/admin/niche-boxes/${nicheId}`);
        revalidatePath(`/niche-boxes/${nicheId}`);
        return { success: true };
    } catch {
        return { error: "Error removing video" };
    }
}
