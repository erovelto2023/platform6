"use server";

import connectToDatabase from "@/lib/db/connect";
import ContentPost from "@/lib/db/models/ContentPost";
import { auth } from "@clerk/nextjs/server";
import User from "@/lib/db/models/User";
import { revalidatePath } from "next/cache";

export async function saveGeneratedContent(data: any) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Fetch active business
    // We need to dynamically import or use the existing action, but to avoid circular deps with business.actions if any,
    // we can re-implement fetching active business logic or just use getOrCreateBusiness
    const { getOrCreateBusiness } = await import("@/lib/actions/business.actions");
    const businessResult = await getOrCreateBusiness();

    if (!businessResult.data) throw new Error("No business found");
    const businessId = businessResult.data._id;

    await connectToDatabase();

    // Map template category to contentType
    let contentType = 'social';
    if (data.templateCategory?.includes('Written')) contentType = 'blog';
    if (data.templateCategory?.includes('Email')) contentType = 'email';
    if (data.templateCategory?.includes('Video')) contentType = 'video';

    const post = await ContentPost.create({
        userId: userId, // Use Clerk ID directly
        businessId: businessId,
        title: data.title || "Untitled AI Draft",
        content: data.content,
        contentType: contentType,
        status: 'draft',
        contentPillar: data.inputs?.pillar || 'education', // Try to grab from inputs if available
        funnelStage: data.inputs?.funnelStage || 'top',
        tags: ['ai-generated', data.templateName || 'template']
    });

    revalidatePath('/tools/content-planner');
    return JSON.parse(JSON.stringify(post));
}
