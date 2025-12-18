"use server";

import connectDB from "@/lib/db/connect";
import PageTheme from "@/lib/db/models/PageTheme";
import { revalidatePath } from "next/cache";

export async function getThemes() {
    try {
        await connectDB();
        const themes = await PageTheme.find().sort({ isDefault: -1, createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(themes));
    } catch (error) {
        console.error("Error fetching themes:", error);
        return [];
    }
}

export async function getDefaultTheme() {
    try {
        await connectDB();
        let theme = await PageTheme.findOne({ isDefault: true }).lean();

        // Create default theme if none exists
        if (!theme) {
            theme = await PageTheme.create({
                name: "Default Theme",
                isDefault: true,
                colors: {
                    primary: "#4f46e5",
                    secondary: "#10b981",
                    accent: "#f59e0b",
                    background: "#ffffff",
                    text: "#1f2937",
                    muted: "#6b7280",
                },
                typography: {
                    fontFamily: "Inter, sans-serif",
                    fontSize: {
                        base: "16px",
                        h1: "3rem",
                        h2: "2.25rem",
                        h3: "1.875rem",
                    },
                },
                spacing: {
                    sectionPadding: "5rem 1.5rem",
                    containerMaxWidth: "1200px",
                },
            });
        }

        return JSON.parse(JSON.stringify(theme));
    } catch (error) {
        console.error("Error fetching default theme:", error);
        return null;
    }
}

export async function createTheme(data: any) {
    try {
        await connectDB();
        const theme = await PageTheme.create(data);
        revalidatePath("/admin/page-builder/themes");
        return { success: true, theme: JSON.parse(JSON.stringify(theme)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateTheme(id: string, data: any) {
    try {
        await connectDB();
        const theme = await PageTheme.findByIdAndUpdate(id, data, { new: true });
        revalidatePath("/admin/page-builder/themes");
        return { success: true, theme: JSON.parse(JSON.stringify(theme)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function setDefaultTheme(id: string) {
    try {
        await connectDB();
        // Remove default from all themes
        await PageTheme.updateMany({}, { isDefault: false });
        // Set new default
        const theme = await PageTheme.findByIdAndUpdate(id, { isDefault: true }, { new: true });
        revalidatePath("/admin/page-builder/themes");
        return { success: true, theme: JSON.parse(JSON.stringify(theme)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteTheme(id: string) {
    try {
        await connectDB();
        const theme = await PageTheme.findById(id);
        if (theme?.isDefault) {
            return { success: false, error: "Cannot delete default theme" };
        }
        await PageTheme.findByIdAndDelete(id);
        revalidatePath("/admin/page-builder/themes");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
