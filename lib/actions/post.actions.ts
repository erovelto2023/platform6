"use server";

import connectDB from "@/lib/db/connect";
import Post from "@/lib/models/post.model";
import { revalidatePath } from "next/cache";

export async function createPost(data: any) {
    try {
        await connectDB();
        // Set publishedAt if isPublished is true
        if (data.isPublished && !data.publishedAt) {
            data.publishedAt = new Date();
        }
        const post = await Post.create(data);
        revalidatePath("/blog");
        revalidatePath("/admin/blog");
        return JSON.parse(JSON.stringify(post));
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}

export async function updatePost(id: string, data: any) {
    try {
        await connectDB();

        // If isPublished is being set to true, set publishedAt if not already set
        if (data.isPublished) {
            const existingPost = await Post.findById(id);
            if (existingPost && !existingPost.publishedAt) {
                data.publishedAt = new Date();
            }
        }

        const post = await Post.findByIdAndUpdate(id, data, { new: true });
        revalidatePath("/blog");
        revalidatePath(`/blog/${post.slug}`);
        revalidatePath("/admin/blog");
        return JSON.parse(JSON.stringify(post));
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
}

export async function deletePost(id: string) {
    try {
        await connectDB();
        await Post.findByIdAndDelete(id);
        revalidatePath("/blog");
        revalidatePath("/admin/blog");
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
}

export async function getPost(id: string) {
    try {
        await connectDB();
        const post = await Post.findById(id);
        return JSON.parse(JSON.stringify(post));
    } catch (error) {
        console.error("Error getting post:", error);
        return null;
    }
}

export async function getPostBySlug(slug: string) {
    try {
        await connectDB();
        const post = await Post.findOne({ slug });
        return JSON.parse(JSON.stringify(post));
    } catch (error) {
        console.error("Error getting post by slug:", error);
        return null;
    }
}

export async function getPosts(query: any = {}) {
    try {
        await connectDB();
        const posts = await Post.find(query).sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        console.error("Error getting posts:", error);
        return [];
    }
}
