"use server";

import connectToDatabase from "@/lib/db/connect";
import HtmlCodeTool, { IHtmlCodeTool } from "@/lib/db/models/HtmlCodeTool";
import { revalidatePath } from "next/cache";

export async function getHtmlCodeTools() {
    try {
        await connectToDatabase();
        const tools = await HtmlCodeTool.find({}).sort({ createdAt: -1 }).lean();
        return {
            success: true,
            data: JSON.parse(JSON.stringify(tools))
        };
    } catch (error: any) {
        console.error("Error fetching HTML code tools:", error);
        return { success: false, error: error.message || "Failed to fetch HTML code tools", data: [] };
    }
}

export async function getHtmlCodeToolById(id: string) {
    try {
        await connectToDatabase();
        const tool = await HtmlCodeTool.findById(id).lean();
        if (!tool) return { success: false, error: "Tool not found" };
        return {
            success: true,
            data: JSON.parse(JSON.stringify(tool))
        };
    } catch (error: any) {
        console.error("Error fetching HTML code tool by ID:", error);
        return { success: false, error: error.message || "Failed to fetch tool" };
    }
}

export async function getHtmlCodeToolsByIds(ids: string[]) {
    try {
        if (!ids || ids.length === 0) return { success: true, data: [] };
        await connectToDatabase();
        const tools = await HtmlCodeTool.find({ _id: { $in: ids }, isActive: true }).lean();
        return {
            success: true,
            data: JSON.parse(JSON.stringify(tools))
        };
    } catch (error: any) {
        console.error("Error fetching HTML code tools by IDs:", error);
        return { success: false, error: error.message || "Failed to fetch tools", data: [] };
    }
}

export async function createHtmlCodeTool(data: Partial<IHtmlCodeTool>) {
    try {
        await connectToDatabase();
        if (!data.name || !data.htmlCode) {
            return { success: false, error: "Name and HTML Code are required." };
        }

        const baseSlug = (data.slug || data.name)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        let uniqueSlug = baseSlug || `tool-${Date.now()}`;
        const existing = await HtmlCodeTool.findOne({ slug: uniqueSlug });
        if (existing) {
            uniqueSlug = `${uniqueSlug}-${Date.now().toString().slice(-4)}`;
        }

        const newTool = await HtmlCodeTool.create({
            name: data.name,
            slug: uniqueSlug,
            description: data.description || "",
            htmlCode: data.htmlCode,
            category: data.category || "General",
            isActive: data.isActive !== undefined ? data.isActive : true
        });

        revalidatePath("/admin/html-code-tools");
        revalidatePath("/glossary");

        return {
            success: true,
            data: JSON.parse(JSON.stringify(newTool))
        };
    } catch (error: any) {
        console.error("Error creating HTML code tool:", error);
        return { success: false, error: error.message || "Failed to create tool" };
    }
}

export async function updateHtmlCodeTool(id: string, data: Partial<IHtmlCodeTool>) {
    try {
        await connectToDatabase();
        if (!id) return { success: false, error: "ID is required" };

        const updateFields: any = { ...data };
        if (data.name && !data.slug) {
            updateFields.slug = data.name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
        }

        const updated = await HtmlCodeTool.findByIdAndUpdate(id, updateFields, { new: true }).lean();
        if (!updated) return { success: false, error: "Tool not found" };

        revalidatePath("/admin/html-code-tools");
        revalidatePath("/glossary");

        return {
            success: true,
            data: JSON.parse(JSON.stringify(updated))
        };
    } catch (error: any) {
        console.error("Error updating HTML code tool:", error);
        return { success: false, error: error.message || "Failed to update tool" };
    }
}

export async function deleteHtmlCodeTool(id: string) {
    try {
        await connectToDatabase();
        if (!id) return { success: false, error: "ID is required" };

        const deleted = await HtmlCodeTool.findByIdAndDelete(id);
        if (!deleted) return { success: false, error: "Tool not found" };

        revalidatePath("/admin/html-code-tools");
        revalidatePath("/glossary");

        return { success: true };
    } catch (error: any) {
        console.error("Error deleting HTML code tool:", error);
        return { success: false, error: error.message || "Failed to delete tool" };
    }
}
