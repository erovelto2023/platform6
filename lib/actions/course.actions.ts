"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import Course from "@/lib/db/models/Course";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

export async function createCourse(title: string) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return {
                error: "Unauthorized",
            };
        }

        await connectDB();

        // Create a slug from the title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        const course = await Course.create({
            title,
            slug,
            userId,
        });

        revalidatePath("/admin/courses");
        return { success: true, id: course._id.toString() };
    } catch (error) {
        console.error("Course creation error:", error);
        return {
            error: "Something went wrong",
        };
    }
}

export async function getCourses() {
    try {
        await connectDB();
        const courses = await Course.find({}).sort({ createdAt: -1 });
        // Convert _id to string to pass to client
        return courses.map(course => ({
            ...course.toObject(),
            _id: course._id.toString(),
            createdAt: course.createdAt.toISOString(),
            updatedAt: course.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Get courses error:", error);
        return [];
    }
}

interface ICourseUpdate {
    title?: string;
    description?: string;
    thumbnail?: string;
    price?: number;
    isPublished?: boolean;
    [key: string]: unknown;
}

export async function updateCourse(courseId: string, values: ICourseUpdate) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { error: "Unauthorized" };
        }

        await connectDB();

        const course = await Course.findByIdAndUpdate(
            courseId,
            { ...values },
            { new: true }
        );

        revalidatePath(`/admin/courses/${courseId}`);
        return { success: true, course: JSON.parse(JSON.stringify(course)) };
    } catch (error) {
        console.error("Course update error:", error);
        return { error: "Something went wrong" };
    }
}

export async function publishCourse(courseId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const course = await Course.findById(courseId);
        if (!course) return { error: "Course not found" };

        // Check required fields before publishing
        const hasModules = course.modules.length > 0;
        const hasTitle = !!course.title;
        const hasDescription = !!course.description;
        const hasThumbnail = !!course.thumbnail;
        // const hasPrice = course.price !== undefined; // Price can be 0

        if (!hasModules || !hasTitle || !hasDescription || !hasThumbnail) {
            return { error: "Missing required fields" };
        }

        course.isPublished = true;
        await course.save();

        revalidatePath(`/admin/courses/${courseId}`);
        return { success: true, course: JSON.parse(JSON.stringify(course)) };
    } catch (error) {
        console.error("Publish course error:", error);
        return { error: "Something went wrong" };
    }
}

export async function unpublishCourse(courseId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const course = await Course.findByIdAndUpdate(
            courseId,
            { isPublished: false },
            { new: true }
        );

        revalidatePath(`/admin/courses/${courseId}`);
        return { success: true, course: JSON.parse(JSON.stringify(course)) };
    } catch (error) {
        console.error("Unpublish course error:", error);
        return { error: "Something went wrong" };
    }
}

export async function deleteCourse(courseId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const course = await Course.findByIdAndDelete(courseId);
        if (!course) return { error: "Course not found" };

        revalidatePath("/admin/courses");
        return { success: true };
    } catch (error) {
        console.error("Delete course error:", error);
        return { error: "Something went wrong" };
    }
}

export async function getCourse(courseId: string) {
    try {
        await connectDB();
        const course = await Course.findById(courseId);
        if (!course) return null;
        return JSON.parse(JSON.stringify(course));
    } catch (error) {
        console.error("Get course error:", error);
        return null;
    }
}

import User from "@/lib/db/models/User";

export async function getDashboardCourses() {
    try {
        const { userId } = await auth();
        if (!userId) return { completedCourses: [], coursesInProgress: [] };

        await connectDB();

        const user = await User.findOne({ clerkId: userId });
        const courses = await Course.find({ isPublished: true }).sort({ createdAt: -1 });

        const coursesWithProgress = await Promise.all(
            courses.map(async (course) => {
                const courseProgress = user?.progress?.find((p: { courseId: mongoose.Types.ObjectId }) => p.courseId.toString() === course._id.toString());
                const completedLessons = courseProgress?.completedLessons || [];

                let totalLessons = 0;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                course.modules.forEach((module: { lessons: any[] }) => {
                    totalLessons += module.lessons.length;
                });

                const progressPercentage = totalLessons === 0 ? 0 : (completedLessons.length / totalLessons) * 100;

                return {
                    ...course.toObject(),
                    _id: course._id.toString(),
                    createdAt: course.createdAt.toISOString(),
                    updatedAt: course.updatedAt.toISOString(),
                    progress: progressPercentage,
                };
            })
        );

        const completedCourses = coursesWithProgress.filter((course) => course.progress === 100);
        const coursesInProgress = coursesWithProgress.filter((course) => (course.progress ?? 0) < 100);

        return {
            completedCourses,
            coursesInProgress,
        };

    } catch (error) {
        console.error("Get dashboard courses error:", error);
        return { completedCourses: [], coursesInProgress: [] };
    }
}
