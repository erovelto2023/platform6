"use server";

import connectToDatabase from "@/lib/db/connect";
import Tool from "@/lib/db/models/Tool";
import { revalidatePath } from "next/cache";

export async function getTools(enabledOnly = false) {
    try {
        await connectToDatabase();

        const query = enabledOnly ? { isEnabled: true } : {};
        const tools = await Tool.find(query).sort({ order: 1, name: 1 }).lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(tools))
        };
    } catch (error) {
        console.error("[GET_TOOLS]", error);
        return {
            success: false,
            error: "Failed to fetch tools"
        };
    }
}

export async function getTool(id: string) {
    try {
        await connectToDatabase();
        const tool = await Tool.findById(id).lean();

        if (!tool) {
            return {
                success: false,
                error: "Tool not found"
            };
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(tool))
        };
    } catch (error) {
        console.error("[GET_TOOL]", error);
        return {
            success: false,
            error: "Failed to fetch tool"
        };
    }
}

export async function updateTool(id: string, data: any) {
    try {
        await connectToDatabase();

        const tool = await Tool.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!tool) {
            return {
                success: false,
                error: "Tool not found"
            };
        }

        revalidatePath("/tools");
        revalidatePath("/admin/tools");

        return {
            success: true,
            data: JSON.parse(JSON.stringify(tool))
        };
    } catch (error) {
        console.error("[UPDATE_TOOL]", error);
        return {
            success: false,
            error: "Failed to update tool"
        };
    }
}

export async function toggleToolStatus(id: string) {
    try {
        await connectToDatabase();

        const tool = await Tool.findById(id);
        if (!tool) {
            return {
                success: false,
                error: "Tool not found"
            };
        }

        tool.isEnabled = !tool.isEnabled;
        await tool.save();

        revalidatePath("/tools");
        revalidatePath("/admin/tools");

        return {
            success: true,
            data: JSON.parse(JSON.stringify(tool))
        };
    } catch (error) {
        console.error("[TOGGLE_TOOL_STATUS]", error);
        return {
            success: false,
            error: "Failed to toggle tool status"
        };
    }
}



export async function seedTools() {
    try {
        await connectToDatabase();

        const tools = [
            {
                name: "Amazon Engine",
                slug: "amazon-product-engine",
                description: "Search products, generate affiliate links, and create displays.",
                icon: "ShoppingCart",
                gradient: "from-orange-400 to-yellow-500",
                path: "/tools/amazon-product-engine",
                isEnabled: true,
                order: 2
            },
            {
                name: "Pin Inspector",
                slug: "pin-inspector",
                description: "Analyze Pinterest trends, keywords, and top performing pins.",
                icon: "Search",
                gradient: "from-red-500 to-red-700",
                path: "/tools/pin-inspector",
                isEnabled: true,
                order: 3
            },
            {
                name: "Workbook Designer",
                slug: "workbook-designer",
                description: "Design professional workbooks, journals, and printables.",
                icon: "LayoutTemplate",
                gradient: "from-indigo-500 to-purple-600",
                path: "/tools/workbook-designer",
                isEnabled: true,
                order: 4
            },
            {
                name: "Headline Studio",
                slug: "headline-studio",
                description: "Generate, organize, and optimize marketing headlines with AI.",
                icon: "FileText",
                gradient: "from-violet-500 to-fuchsia-600",
                path: "/headlines",
                isEnabled: true,
                order: 5
            },
            {
                name: "Insights Analyzer",
                slug: "insights-analyzer",
                description: "Deep dive into your data with advanced analytics and reporting.",
                icon: "BarChart3",
                gradient: "from-emerald-500 to-teal-600",
                path: "/tools/insights-analyzer",
                isEnabled: true,
                order: 6
            },
            {
                name: "Keyword Explorer",
                slug: "keyword-explorer",
                description: "Comprehensive keyword research with live data and competitive analysis.",
                icon: "Globe",
                gradient: "from-blue-600 to-cyan-500",
                path: "/tools/keyword-explorer",
                isEnabled: true,
                order: 7
            },
            {
                name: "Wholesale Directory",
                slug: "wholesale-directory",
                description: "Find and manage wholesale suppliers for your business.",
                icon: "ShoppingBag",
                gradient: "from-cyan-500 to-blue-600",
                path: "/tools/wholesale-directory",
                isEnabled: true,
                order: 8
            },
            {
                name: "Design Editor",
                slug: "design-editor",
                description: "A free, easy-to-use graphic design editor.",
                icon: "LayoutTemplate",
                gradient: "from-pink-500 to-rose-500",
                path: "/tools/design-editor",
                isEnabled: true,
                order: 9
            }
        ];

        // Seed Core Tools
        console.log("Seeding Core Tools...");
        for (const toolData of tools) {
            await Tool.findOneAndUpdate(
                { slug: toolData.slug },
                { $setOnInsert: toolData },
                { upsert: true, new: true }
            );
        }


        // (We don't have a single entry for PDF Suite in the tools list, it's a collection)

        // Cleanup: Remove Content Planner, Whiteboard, and Graphite
        await Tool.deleteOne({ slug: "whiteboard" });
        await Tool.deleteOne({ slug: "graphite" });


        revalidatePath("/tools");
        revalidatePath("/admin/tools");


        return {
            success: true,
            message: `Core tools seeded successfully.`
        };
    } catch (error) {
        console.error("[SEED_TOOLS]", error);
        return {
            success: false,
            error: "Failed to seed tools: " + (error as Error).message
        };
    }
}
