"use server";

import { AIService } from "@/lib/ai-service";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db/connect";
import ContentPost from "@/lib/db/models/ContentPost";
import { revalidatePath } from "next/cache";
import User from "@/lib/db/models/User";

export async function generateContentFromTemplate(template: any, inputs: any) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // 1. Construct the prompt
    let prompt = template.systemPrompt;

    // Replace variables
    for (const [key, value] of Object.entries(inputs)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        prompt = prompt.replace(regex, String(value));
    }

    // Inject Rich Metadata Context if available
    if (inputs.intent || inputs.targetAudience || inputs.keywords) {
        prompt += `\n\n[CONTEXT]\n`;
        if (inputs.intent) prompt += `Search Intent: ${inputs.intent}\n`;
        if (inputs.targetAudience) prompt += `Target Audience: ${inputs.targetAudience}\n`;
        if (inputs.keywords) prompt += `Secondary Keywords to Include: ${inputs.keywords}\n`;
        prompt += `\nPlease ensure the content aligns with this context.`;
    }

    // 2. Call AI Service
    try {
        console.log(`[ContentGen] Generating with template: ${template.name}, User: ${userId}`);
        const response = await AIService.generate({
            prompt: prompt,
            systemPrompt: "You are a helpful content assistant.",
            userId: userId, // Pass userId so service can look up settings
            model: template.model // Optional: allow template to override
        });
        console.log(`[ContentGen] Success. Provider: ${response.provider}, Model: ${response.model}`);

        return { success: true, content: response.content };
    } catch (error: any) {
        console.error("[ContentGen] Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getContentPosts() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();
    const posts = await ContentPost.find({ userId }).sort({ scheduledFor: 1, createdAt: -1 });

    // Serialize for client
    return posts.map(post => ({
        ...post.toObject(),
        _id: post._id.toString(),
        userId: post.userId.toString(),
        campaignId: post.campaignId?.toString(),
        scheduledFor: post.scheduledFor?.toISOString(),
        publishedAt: post.publishedAt?.toISOString(),
        createdAt: post.createdAt?.toISOString(),
        updatedAt: post.updatedAt?.toISOString(),
    }));
}

export async function getContentPostById(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();
    const post = await ContentPost.findOne({ _id: id, userId });

    if (!post) return null;

    return {
        ...post.toObject(),
        _id: post._id.toString(),
        userId: post.userId.toString(),
        campaignId: post.campaignId?.toString(),
        scheduledFor: post.scheduledFor?.toISOString(),
        publishedAt: post.publishedAt?.toISOString(),
        createdAt: post.createdAt?.toISOString(),
        updatedAt: post.updatedAt?.toISOString(),
    };
}

export async function createContentPost(data: any) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();
    const post: any = await ContentPost.create({
        ...data,
        userId,
    });

    revalidatePath("/tools/content-planner");
    return { success: true, id: post._id.toString() };
}

export async function updateContentPost(id: string, data: any) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();
    await ContentPost.findOneAndUpdate(
        { _id: id, userId },
        { $set: data },
        { new: true }
    );

    revalidatePath("/tools/content-planner");
    return { success: true };
}

export async function deleteContentPost(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();
    await ContentPost.findOneAndDelete({ _id: id, userId });

    revalidatePath("/tools/content-planner");
    return { success: true };
}

export async function fixContentOwnership() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    // 1. Find the user's MongoDB _id
    const user = await User.findOne({ clerkId: userId });
    if (!user) return { success: false, message: "User not found" };

    const mongoId = user._id.toString();

    // 2. Find posts that have the MongoDB ID as the userId
    // We check both string and ObjectId versions just in case
    const result = await ContentPost.updateMany(
        {
            $or: [
                { userId: mongoId },
                { userId: user._id }
            ]
        },
        { $set: { userId: userId } }
    );

    revalidatePath("/tools/content-planner");
    return { success: true, count: result.modifiedCount };
}
