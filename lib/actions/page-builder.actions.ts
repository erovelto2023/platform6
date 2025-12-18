"use server";

import connectDB from "@/lib/db/connect";
import WebPage from "@/lib/db/models/WebPage";
import { revalidatePath } from "next/cache";

export async function getPages() {
    try {
        await connectDB();
        const pages = await WebPage.find().sort({ updatedAt: -1 }).lean();
        return JSON.parse(JSON.stringify(pages));
    } catch (error) {
        console.error("Error fetching pages:", error);
        return [];
    }
}

export async function getPage(id: string) {
    try {
        await connectDB();
        const page = await WebPage.findById(id).lean();
        return JSON.parse(JSON.stringify(page));
    } catch (error) {
        console.error("Error fetching page:", error);
        return null;
    }
}

export async function getPageBySlug(slug: string) {
    try {
        await connectDB();
        const page = await WebPage.findOne({ slug, isPublished: true }).lean();
        return JSON.parse(JSON.stringify(page));
    } catch (error) {
        console.error("Error fetching page by slug:", error);
        return null;
    }
}

export async function createPage(data: {
    name: string;
    slug?: string;
    sections?: any[];
}) {
    try {
        await connectDB();

        const slug = data.slug || data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const page = await WebPage.create({
            name: data.name,
            slug,
            sections: data.sections || [],
            isPublished: false,
        });

        revalidatePath("/admin/page-builder");
        return { success: true, page: JSON.parse(JSON.stringify(page)) };
    } catch (error: any) {
        console.error("Error creating page:", error);
        return { success: false, error: error.message };
    }
}

export async function updatePage(id: string, data: any) {
    try {
        await connectDB();

        const page = await WebPage.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true }
        );

        revalidatePath("/admin/page-builder");
        revalidatePath(`/admin/page-builder/${id}`);
        if (page?.slug) {
            revalidatePath(`/p/${page.slug}`);
        }

        return { success: true, page: JSON.parse(JSON.stringify(page)) };
    } catch (error: any) {
        console.error("Error updating page:", error);
        return { success: false, error: error.message };
    }
}

export async function deletePage(id: string) {
    try {
        await connectDB();
        await WebPage.findByIdAndDelete(id);
        revalidatePath("/admin/page-builder");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting page:", error);
        return { success: false, error: error.message };
    }
}

export async function publishPage(id: string, publish: boolean) {
    try {
        await connectDB();
        const page = await WebPage.findByIdAndUpdate(
            id,
            { isPublished: publish },
            { new: true }
        );

        revalidatePath("/admin/page-builder");
        if (page?.slug) {
            revalidatePath(`/p/${page.slug}`);
        }

        return { success: true, page: JSON.parse(JSON.stringify(page)) };
    } catch (error: any) {
        console.error("Error publishing page:", error);
        return { success: false, error: error.message };
    }
}
