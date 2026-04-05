'use server';

import connectDB from "@/lib/db/connect";
import ContentPost from "@/lib/db/models/ContentPost";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

// Helper to get business (workspace)
async function getActiveBusiness() {
    // In platform6, we might want to get the business related to the user
    // For now, let's assume we find the first business for the user
    const { userId } = await auth();
    if (!userId) return null;
    
    const Business = (await import("@/lib/db/models/Business")).default;
    await connectDB();
    const business = await Business.findOne({ userId });
    return business;
}

export async function createPost(data: any) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const business = await getActiveBusiness();
    
    await connectDB();
    
    // Normalize for model
    const normalizedData = {
        ...data,
        content: data.content || data.description || 'No content provided',
        contentType: (data.contentType || 'social').toLowerCase().split(' ')[0],
        status: (data.status || 'draft').toLowerCase(),
        platforms: (data.platforms || []).map((p: string) => ({
            name: p.toLowerCase(),
            status: 'pending'
        }))
    };

    const newPost = await ContentPost.create({
      ...normalizedData,
      businessId: business ? business._id.toString() : 'unassigned',
      userId: userId,
    });
    
    revalidatePath('/calendar');
    return { success: true, post: JSON.parse(JSON.stringify(newPost)) };
  } catch (error: any) {
    console.error("Create Post Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updatePost(id: string, updates: any) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    
    await connectDB();
    
    // Normalize updates
    const normalizedUpdates = {
        ...updates,
        content: updates.content || updates.description,
        contentType: updates.contentType ? updates.contentType.toLowerCase().split(' ')[0] : undefined,
        status: updates.status ? updates.status.toLowerCase() : undefined,
    };

    const updated = await ContentPost.findByIdAndUpdate(
      id,
      { $set: normalizedUpdates },
      { new: true }
    );
    
    revalidatePath('/calendar');
    return { success: true, post: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Update Post Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updatePostSchedule(id: string, scheduledFor: string) {
  try {
    await connectDB();
    const updated = await ContentPost.findByIdAndUpdate(
      id, 
      { status: 'scheduled', scheduledFor: new Date(scheduledFor) },
      { returnDocument: 'after' }
    );
    
    revalidatePath('/calendar');
    return { success: true, post: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePost(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    
    await connectDB();
    await ContentPost.findByIdAndDelete(id);
    
    revalidatePath('/calendar');
    return { success: true };
  } catch (error: any) {
    console.error("Delete Post Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getPosts() {
  try {
    const { userId } = await auth();
    if (!userId) return [];
    
    const business = await getActiveBusiness();
    
    await connectDB();
    const query: any = { userId };
    if (business) {
        query.businessId = business._id;
    }

    const posts = await ContentPost.find(query).sort({ createdAt: -1 }).lean();
    
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}
