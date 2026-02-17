
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
// ... existing code ...

export async function getFullContentPosts() {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        // Populate campaign, offer, and pillar
        const posts = await ContentPost.find({ businessId })
            .populate('campaignId')
            .populate('offerId')
            .populate('pillarId')
            .sort({ scheduledFor: 1 });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(posts)),
        };
    } catch (error) {
        console.error('[GET_FULL_CONTENT_POSTS]', error);
        return { success: false, error: 'Failed to fetch content posts' };
    }
}

export async function repurposeContent(originalId: string, formats: string[]) {
    try {
        await connectToDatabase();
        const originalPost = await ContentPost.findById(originalId);
        if (!originalPost) return { success: false, error: "Original post not found" };

        let count = 0;

        // Simple generation logic (placeholder for AI)
        for (const format of formats) {
            let contentType = 'social';
            let platformName = 'twitter';
            let titlePrefix = 'Repurposed: ';

            if (format === 'twitter_thread') { platformName = 'twitter'; titlePrefix = 'Thread: '; }
            if (format === 'linkedin_post') { platformName = 'linkedin'; titlePrefix = 'LinkedIn: '; }
            if (format === 'email_newsletter') { contentType = 'email'; platformName = 'email'; titlePrefix = 'Email: '; }
            if (format === 'short_video_script') { contentType = 'video'; platformName = 'tiktok'; titlePrefix = 'Script: '; }
            if (format === 'instagram_carousel') { contentType = 'carousel'; platformName = 'instagram'; titlePrefix = 'Carousel: '; }

            await ContentPost.create({
                title: `${titlePrefix}${originalPost.title}`,
                content: `(Draft generated from ${originalPost.title})\n\n[Insert repurposed content here]`,
                contentType,
                status: 'draft',
                userId: originalPost.userId,
                repurposedFrom: originalId,
                campaignId: originalPost.campaignId,
                platforms: [{ name: platformName, status: 'pending' }],
                tags: [...(originalPost.tags || []), 'repurposed']
            });
            count++;
        }

        revalidatePath('/calendar/content');
        return { success: true, count };
    } catch (error) {
        console.error('[REPURPOSE_CONTENT]', error);
        return { success: false, error: 'Failed to repurpose content' };
    }
}
// ... existing code ...

export async function createContentPost(data: any) {
    try {
        await connectToDatabase();

        // Ensure userId is present (mock for now, should come from auth)
        // In a real app we'd use auth() or similar. 
        // For this demo, let's assume we can get it from the data or default to a dummy if not.
        // But ContentPost demands userId.
        // Let's rely on the client passing it or we fetch the first user.

        // Quick fix: Fetch a business or user to attribute to.
        const businessResult = await getOrCreateBusiness();
        let userId = 'unknown';
        let businessId = 'default';
        if (businessResult.success && businessResult.data) {
            userId = businessResult.data.userId;
            businessId = businessResult.data._id;
        }

        const newPost = await ContentPost.create({
            ...data,
            userId: data.userId || userId,
            businessId: businessId,
            status: data.status || 'idea',
            platforms: data.platforms || [],
            tags: data.tags || []
        });

        revalidatePath('/calendar/content');
        return { success: true, data: JSON.parse(JSON.stringify(newPost)) };
    } catch (error) {
        console.error('[CREATE_CONTENT_POST]', error);
        return { success: false, error: 'Failed to create content post' };
    }
}
