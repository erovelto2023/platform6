"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import Article from "@/lib/db/models/Article";
import { revalidatePath } from "next/cache";

export async function createArticle(title: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const article = await Article.create({
            title,
        });

        revalidatePath("/admin/knowledge-base");
        return article;
    } catch (error) {
        console.error("Create article error:", error);
        return null;
    }
}

export async function getArticles() {
    try {
        await connectDB();
        const articles = await Article.find({}).sort({ createdAt: -1 });
        return articles;
    } catch (error) {
        console.error("Get articles error:", error);
        return [];
    }
}

export async function getArticle(articleId: string) {
    try {
        await connectDB();
        const article = await Article.findById(articleId);
        return article;
    } catch (error) {
        console.error("Get article error:", error);
        return null;
    }
}

interface IArticleUpdate {
    title?: string;
    content?: string;
    imageUrl?: string;
    category?: string;
    isPublished?: boolean;
    [key: string]: unknown;
}

export async function updateArticle(articleId: string, values: IArticleUpdate) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        const article = await Article.findByIdAndUpdate(articleId, {
            ...values,
        }, { new: true });

        revalidatePath(`/admin/knowledge-base/${articleId}`);
        revalidatePath("/knowledge-base");
        return article;
    } catch (error) {
        console.error("Update article error:", error);
        return null;
    }
}

export async function deleteArticle(articleId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        await Article.findByIdAndDelete(articleId);

        revalidatePath("/admin/knowledge-base");
        revalidatePath("/knowledge-base");
        return { success: true };
    } catch (error) {
        console.error("Delete article error:", error);
        return { error: "Something went wrong" };
    }
}
