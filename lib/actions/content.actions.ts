
'use server';

import connectToDatabase from "@/lib/db/connect";
import ContentItem, { IContentItem } from "@/lib/db/models/ContentItem";
import ContentPost from "@/lib/db/models/ContentPost";
import { getOrCreateBusiness } from "@/lib/actions/business.actions";
import { revalidatePath } from "next/cache";

export async function getContentItems() {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        const items = await ContentItem.find({ businessId }).sort({ scheduledAt: 1 });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(items)),
        };
    } catch (error) {
        console.error('[GET_CONTENT_ITEMS]', error);
        return { success: false, error: 'Failed to fetch content items' };
    }
}

export async function createContentItem(data: Partial<IContentItem>) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        const newItem = await ContentItem.create({
            ...data,
            businessId,
        });

        revalidatePath('/calendar/content');
        return { success: true, data: JSON.parse(JSON.stringify(newItem)) };
    } catch (error) {
        console.error('[CREATE_CONTENT_ITEM]', error);
        return { success: false, error: 'Failed to create content item' };
    }
}

export async function updateContentItem(id: string, data: Partial<IContentItem>) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        const updatedItem = await ContentItem.findOneAndUpdate(
            { _id: id, businessId },
            data,
            { new: true }
        );

        if (!updatedItem) {
            return { success: false, error: 'Content item not found' };
        }

        revalidatePath('/calendar/content');
        return { success: true, data: JSON.parse(JSON.stringify(updatedItem)) };
    } catch (error) {
        console.error('[UPDATE_CONTENT_ITEM]', error);
        return { success: false, error: 'Failed to update content item' };
    }
}

export async function deleteContentItem(id: string) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        await ContentItem.findOneAndDelete({ _id: id, businessId });

        revalidatePath('/calendar/content');
        return { success: true };
    } catch (error) {
        console.error('[DELETE_CONTENT_ITEM]', error);
        return { success: false, error: 'Failed to delete content item' };
    }
}

// Legacy / Content Planner Actions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateContentPost(id: string, data: any) {
    try {
        await connectToDatabase();
        const updatedPost = await ContentPost.findByIdAndUpdate(id, data, { new: true });
        if (!updatedPost) return { success: false, error: "Post not found" };
        revalidatePath('/tools/content-planner');
        return { success: true, data: JSON.parse(JSON.stringify(updatedPost)) };
    } catch (error) {
        console.error("Error updating content post:", error);
        return { success: false, error: "Failed to update post" };
    }
}
