"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

import Course from "@/lib/db/models/Course";

export async function getProgress(courseId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return null;

        await connectDB();

        const user = await User.findOne({ clerkId: userId });

        // If user doesn't exist, return empty progress
        if (!user) {
            return {
                progressPercentage: 0,
                completedLessons: []
            };
        }

        // Find progress for this specific course
        interface IProgress {
            courseId: mongoose.Types.ObjectId;
            completedLessons: mongoose.Types.ObjectId[];
        }

        const progressArray = Array.isArray(user.progress) ? user.progress : [];
        const courseProgress = progressArray.find((p: IProgress) => p.courseId.toString() === courseId);

        // Convert ObjectIds to strings for the client
        const completedLessons = courseProgress?.completedLessons.map((id: mongoose.Types.ObjectId) => id.toString()) || [];

        // Calculate percentage
        const course = await Course.findById(courseId);

        if (!course) {
            return {
                progressPercentage: 0,
                completedLessons
            };
        }

        let totalLessons = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        course.modules.forEach((module: { lessons: any[] }) => {
            totalLessons += module.lessons.length;
        });

        const progressPercentage = totalLessons === 0 ? 0 : (completedLessons.length / totalLessons) * 100;

        return {
            progressPercentage,
            completedLessons
        };
    } catch (error) {
        console.error("Get progress error:", error);
        return null;
    }
}

export async function markLessonComplete(courseId: string, lessonId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const user = await User.findOne({ clerkId: userId });
        if (!user) return { error: "User not found" };

        // Ensure progress is an array (handle potential schema migration issues)
        if (!Array.isArray(user.progress)) {
            user.progress = [];
        }

        // Check if progress entry exists for this course
        interface IProgress {
            courseId: mongoose.Types.ObjectId;
            completedLessons: mongoose.Types.ObjectId[];
        }
        const courseProgress = user.progress.find((p: IProgress) => p.courseId.toString() === courseId);

        if (!courseProgress) {
            // Create new progress entry
            user.progress.push({
                courseId,
                completedLessons: [lessonId],
                progressPercentage: 0
            });
        } else {
            // Add lesson if not already completed
            const isCompleted = courseProgress.completedLessons.some((id: mongoose.Types.ObjectId) => id.toString() === lessonId);
            if (!isCompleted) {
                courseProgress.completedLessons.push(lessonId);
            }
        }

        await user.save();

        revalidatePath(`/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Mark complete error:", error);
        return { error: "Something went wrong" };
    }
}

export async function markLessonIncomplete(courseId: string, lessonId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const user = await User.findOne({ clerkId: userId });
        if (!user) return { error: "User not found" };

        if (!Array.isArray(user.progress)) {
            return { success: true };
        }

        const courseProgress = user.progress.find((p: { courseId: mongoose.Types.ObjectId; completedLessons: mongoose.Types.ObjectId[] }) => p.courseId.toString() === courseId);

        if (courseProgress) {
            courseProgress.completedLessons = courseProgress.completedLessons.filter((id: mongoose.Types.ObjectId) => id.toString() !== lessonId);
            await user.save();
        }

        revalidatePath(`/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Mark incomplete error:", error);
        return { error: "Something went wrong" };
    }
}
