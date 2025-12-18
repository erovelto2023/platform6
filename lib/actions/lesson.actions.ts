"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import Course from "@/lib/db/models/Course";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

export async function createLesson(courseId: string, moduleId: string, title: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const course = await Course.findById(courseId);
        if (!course) return { error: "Course not found" };

        const courseModule = course.modules.id(moduleId);
        if (!courseModule) return { error: "Module not found" };

        courseModule.lessons.push({
            title,
            type: 'video', // default
            isFreePreview: false,
        });

        await course.save();

        revalidatePath(`/admin/courses/${courseId}/chapters/${moduleId}`);
        return { success: true };
    } catch (error) {
        console.error("Create lesson error:", error);
        return { error: "Something went wrong" };
    }
}

export async function reorderLessons(courseId: string, moduleId: string, updateData: { id: string; position: number }[]) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const course = await Course.findById(courseId);
        if (!course) return { error: "Course not found" };

        const courseModule = course.modules.id(moduleId);
        if (!courseModule) return { error: "Module not found" };

        interface ILesson {
            _id: mongoose.Types.ObjectId;
            title: string;
        }

        const lessonsMap = new Map<string, ILesson>(courseModule.lessons.map((l: ILesson) => [l._id.toString(), l]));
        const newLessonsArray: ILesson[] = [];

        updateData.sort((a, b) => a.position - b.position);

        for (const item of updateData) {
            const lesson = lessonsMap.get(item.id);
            if (lesson) {
                newLessonsArray.push(lesson);
                lessonsMap.delete(item.id);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, lesson] of lessonsMap) {
            newLessonsArray.push(lesson);
        }

        courseModule.lessons = newLessonsArray;
        await course.save();

        revalidatePath(`/admin/courses/${courseId}/chapters/${moduleId}`);
        return { success: true };
    } catch (error) {
        console.error("Reorder lessons error:", error);
        return { error: "Something went wrong" };
    }
}

interface ILessonUpdate {
    title?: string;
    description?: string;
    content?: string;
    videoUrl?: string;
    isFreePreview?: boolean;
    type?: string;
    fileUrl?: string;
    fileName?: string;
    [key: string]: unknown;
}

export async function updateLesson(courseId: string, moduleId: string, lessonId: string, values: ILessonUpdate) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const course = await Course.findById(courseId);
        if (!course) return { error: "Course not found" };

        const courseModule = course.modules.id(moduleId);
        if (!courseModule) return { error: "Module not found" };

        const lesson = courseModule.lessons.id(lessonId);
        if (!lesson) return { error: "Lesson not found" };

        if (values.title !== undefined) lesson.title = values.title;
        if (values.description !== undefined) lesson.content = values.description;
        if (values.content !== undefined) lesson.content = values.content;
        if (values.videoUrl !== undefined) lesson.videoUrl = values.videoUrl;
        if (values.isFreePreview !== undefined) lesson.isFreePreview = values.isFreePreview;
        if (values.type !== undefined) lesson.type = values.type;
        if (values.fileUrl !== undefined) lesson.fileUrl = values.fileUrl;
        if (values.fileName !== undefined) lesson.fileName = values.fileName;

        await course.save();

        revalidatePath(`/admin/courses/${courseId}/chapters/${moduleId}`);
        revalidatePath(`/admin/courses/${courseId}/chapters/${moduleId}/lessons/${lessonId}`);
        return { success: true, lesson: JSON.parse(JSON.stringify(lesson)) };
    } catch (error) {
        console.error("Update lesson error:", error);
        return { error: "Something went wrong" };
    }
}

export async function getModule(courseId: string, moduleId: string) {
    try {
        await connectDB();
        const course = await Course.findById(courseId);
        if (!course) return null;
        const courseModule = course.modules.id(moduleId);
        if (!courseModule) return null;
        return JSON.parse(JSON.stringify(courseModule));
    } catch (error) {
        console.error("Get module error:", error);
        return null;
    }
}

export async function getLesson(courseId: string, moduleId: string, lessonId: string) {
    try {
        await connectDB();
        const course = await Course.findById(courseId);
        if (!course) return null;
        const courseModule = course.modules.id(moduleId);
        if (!courseModule) return null;
        const lesson = courseModule.lessons.id(lessonId);
        if (!lesson) return null;
        return JSON.parse(JSON.stringify(lesson));
    } catch (error) {
        console.error("Get lesson error:", error);
        return null;
    }
}

export async function addAttachment(courseId: string, moduleId: string, lessonId: string, url: string, title: string = "Attachment") {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const course = await Course.findById(courseId);
        if (!course) return { error: "Course not found" };

        const courseModule = course.modules.id(moduleId);
        if (!courseModule) return { error: "Module not found" };

        const lesson = courseModule.lessons.id(lessonId);
        if (!lesson) return { error: "Lesson not found" };

        lesson.attachments.push({
            title,
            url,
        });

        await course.save();

        revalidatePath(`/admin/courses/${courseId}/chapters/${moduleId}/lessons/${lessonId}`);
        return { success: true, lesson: JSON.parse(JSON.stringify(lesson)) };
    } catch (error) {
        console.error("Add attachment error:", error);
        return { error: "Something went wrong" };
    }
}

export async function removeAttachment(courseId: string, moduleId: string, lessonId: string, attachmentId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const course = await Course.findById(courseId);
        if (!course) return { error: "Course not found" };

        const courseModule = course.modules.id(moduleId);
        if (!courseModule) return { error: "Module not found" };

        const lesson = courseModule.lessons.id(lessonId);
        if (!lesson) return { error: "Lesson not found" };

        lesson.attachments = lesson.attachments.filter((a: { _id: mongoose.Types.ObjectId }) => a._id.toString() !== attachmentId);

        await course.save();

        revalidatePath(`/admin/courses/${courseId}/chapters/${moduleId}/lessons/${lessonId}`);
        return { success: true, lesson: JSON.parse(JSON.stringify(lesson)) };
    } catch (error) {
        console.error("Remove attachment error:", error);
        return { error: "Something went wrong" };
    }
}
