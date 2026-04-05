
'use server';

import connectDB from "@/lib/db/connect";
import ContentPost from "@/lib/db/models/ContentPost";
import { revalidatePath } from "next/cache";
import { getActionContext } from "../auth-utils";
import { ActionResponse } from "@/types";

/**
 * Normalizes input data for consistent schema persistence
 * Handles mapping between legacy 'description' and new 'content' fields
 */
function normalizePostData(data: any, ctx: { userId: string, businessId: string }) {
    return {
        ...data,
        content: data.content || data.description || 'No content provided',
        status: (data.status || 'draft').toLowerCase(),
        contentType: (data.contentType || 'social').toLowerCase().split(' ')[0],
        userId: ctx.userId,
        businessId: ctx.businessId,
        platforms: (data.platforms || ["social"]).map((p: string | any) => {
            const name = typeof p === 'string' ? p.toLowerCase() : p.name.toLowerCase();
            return {
                name,
                status: 'pending'
            };
        })
    };
}

/**
 * Create a new content piece
 */
export async function createPost(data: any): Promise<ActionResponse> {
  try {
    const context = await getActionContext();
    if (!context.success || !context.data) return { success: false, error: context.error };
    const { userId, business } = context.data;

    await connectDB();
    const normalized = normalizePostData(data, { userId, businessId: business._id });

    const newPost = await ContentPost.create(normalized);
    
    revalidatePath('/calendar');
    return { success: true, data: JSON.parse(JSON.stringify(newPost)) };
  } catch (error: any) {
    console.error("[CREATE_POST_ERROR]", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update an existing post (content, title, metadata)
 */
export async function updatePost(id: string, updates: any): Promise<ActionResponse> {
  try {
    const context = await getActionContext();
    if (!context.success || !context.data) return { success: false, error: context.error };

    await connectDB();
    
    // Partial normalization for updates
    const normalizedUpdates: any = { ...updates };
    if (updates.description) normalizedUpdates.content = updates.description;
    if (updates.contentType) normalizedUpdates.contentType = updates.contentType.toLowerCase().split(' ')[0];
    if (updates.status) normalizedUpdates.status = updates.status.toLowerCase();

    const updated = await ContentPost.findByIdAndUpdate(
      id,
      { $set: normalizedUpdates },
      { new: true }
    );
    
    revalidatePath('/calendar');
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("[UPDATE_POST_ERROR]", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update specifically the schedule / drag-and-drop state
 */
export async function updatePostSchedule(id: string, scheduledFor: string): Promise<ActionResponse> {
  try {
    const context = await getActionContext();
    if (!context.success || !context.data) return { success: false, error: context.error };

    await connectDB();
    const updated = await ContentPost.findByIdAndUpdate(
      id, 
      { status: 'scheduled', scheduledFor: new Date(scheduledFor) },
      { returnDocument: 'after' }
    );
    
    revalidatePath('/calendar');
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a post
 */
export async function deletePost(id: string): Promise<ActionResponse> {
  try {
    const context = await getActionContext();
    if (!context.success || !context.data) return { success: false, error: context.error };

    await connectDB();
    await ContentPost.findByIdAndDelete(id);
    
    revalidatePath('/calendar');
    return { success: true };
  } catch (error: any) {
    console.error("[DELETE_POST_ERROR]", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all posts for the current ecosystem
 */
export async function getPosts(): Promise<any[]> {
  try {
    const context = await getActionContext();
    if (!context.success || !context.data) return [];
    const { userId, business } = context.data;

    await connectDB();
    const query = { userId, businessId: business._id };
    
    const posts = await ContentPost.find(query).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("[FETCH_POSTS_ERROR]", error);
    return [];
  }
}
