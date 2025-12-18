"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import Course from "@/lib/db/models/Course";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

export async function createModule(courseId: string, title: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const course = await Course.findById(courseId);
        if (!course) return { error: "Course not found" };

        // Add new module to the modules array
        course.modules.push({
            title,
            lessons: [],
        });

        await course.save();

        revalidatePath(`/admin/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Create module error:", error);
        return { error: "Something went wrong" };
    }
}

export async function reorderModules(courseId: string, updateData: { id: string; position: number }[]) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const course = await Course.findById(courseId);
        if (!course) return { error: "Course not found" };

        // Create a map of current modules for easy access
        // Note: Mongoose subdocuments have _id.
        // We need to reorder the `course.modules` array based on the input.

        // This is a bit tricky with subdocuments array. 
        // We'll create a new array based on the order.

        // First, let's verify we have all modules
        // Actually, the updateData might only contain IDs.

        // A simpler approach for array reorder in Mongoose:
        // 1. Get current modules
        // 2. Sort them based on the new positions provided in updateData

        // However, updateData usually comes from dnd-kit as a list of IDs in the new order.
        // Let's assume updateData is just the list of IDs in the new order for simplicity?
        // The prompt says "updateData: { id: string; position: number }[]".

        // Let's just sort the array in place if we can match IDs.

        // Define a minimal interface for the module structure we expect
        interface IModule {
            _id: mongoose.Types.ObjectId;
            title: string;
            lessons: unknown[]; // Keeping lessons as unknown[] for now as we don't need deep structure here
        }

        const modulesMap = new Map<string, IModule>(course.modules.map((m: IModule) => [m._id.toString(), m]));

        const newModulesArray: IModule[] = [];

        // Sort updateData by position to be sure
        updateData.sort((a, b) => a.position - b.position);

        for (const item of updateData) {
            const courseModule = modulesMap.get(item.id);
            if (courseModule) {
                newModulesArray.push(courseModule);
                modulesMap.delete(item.id);
            }
        }

        // If there are any leftovers (shouldn't be if frontend is correct), append them
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, courseModule] of modulesMap) {
            newModulesArray.push(courseModule);
        }

        course.modules = newModulesArray;
        await course.save();

        revalidatePath(`/admin/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Reorder modules error:", error);
        return { error: "Something went wrong" };
    }
}

export async function updateModule(courseId: string, moduleId: string, values: { title?: string; isPublished?: boolean }) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        // We use the positional operator $ to update a specific element in the array
        const updateQuery: Record<string, string> = {};
        if (values.title) updateQuery["modules.$.title"] = values.title;
        // if (values.isPublished !== undefined) updateQuery["modules.$.isPublished"] = values.isPublished; // Schema doesn't have isPublished on Module yet, but good to have logic ready.

        await Course.updateOne(
            { _id: courseId, "modules._id": moduleId },
            { $set: updateQuery }
        );

        revalidatePath(`/admin/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Update module error:", error);
        return { error: "Something went wrong" };
    }
}

export async function deleteModule(courseId: string, moduleId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        await Course.updateOne(
            { _id: courseId },
            { $pull: { modules: { _id: moduleId } } }
        );

        revalidatePath(`/admin/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Delete module error:", error);
        return { error: "Something went wrong" };
    }
}
