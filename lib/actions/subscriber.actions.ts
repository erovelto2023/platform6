"use server";

import connectToDatabase from "@/lib/db/connect";
import Subscriber from "@/lib/db/models/Subscriber";
import MailingList from "@/lib/db/models/MailingList";
import { revalidatePath } from "next/cache";

// =====================
// MAILING LIST ACTIONS
// =====================

export async function getMailingLists() {
    try {
        await connectToDatabase();
        const lists = await MailingList.find().sort({ createdAt: -1 }).lean();
        return { success: true, data: JSON.parse(JSON.stringify(lists)) };
    } catch (e) {
        console.error("Error fetching mailing lists", e);
        return { success: false, error: "Failed to fetch lists" };
    }
}

export async function createMailingList(data: { name: string; description?: string }) {
    try {
        await connectToDatabase();
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const list = await MailingList.create({ ...data, slug });
        revalidatePath('/admin/subscribers');
        return { success: true, data: JSON.parse(JSON.stringify(list)) };
    } catch (e: any) {
        console.error("Error creating mailing list", e);
        return { success: false, error: e.message || "Failed to create list" };
    }
}

export async function updateMailingList(id: string, data: { name: string; description?: string }) {
    try {
        await connectToDatabase();
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const list = await MailingList.findByIdAndUpdate(id, { ...data, slug }, { new: true });
        revalidatePath('/admin/subscribers');
        return { success: true, data: JSON.parse(JSON.stringify(list)) };
    } catch (e: any) {
        console.error("Error updating mailing list", e);
        return { success: false, error: e.message || "Failed to update list" };
    }
}

export async function deleteMailingList(id: string) {
    try {
        await connectToDatabase();
        await MailingList.findByIdAndDelete(id);
        // Remove list from all subscribers
        await Subscriber.updateMany({ lists: id }, { $pull: { lists: id } });
        revalidatePath('/admin/subscribers');
        return { success: true };
    } catch (e: any) {
        console.error("Error deleting mailing list", e);
        return { success: false, error: "Failed to delete list" };
    }
}

// =====================
// SUBSCRIBER ACTIONS
// =====================

export async function getSubscribers() {
    try {
        await connectToDatabase();
        const subs = await Subscriber.find().populate('lists', 'name slug').sort({ subscribedAt: -1 }).lean();
        return { success: true, data: JSON.parse(JSON.stringify(subs)) };
    } catch (e) {
        console.error("Error fetching subscribers", e);
        return { success: false, error: "Failed to fetch subscribers" };
    }
}

export async function addSubscriber(data: { email: string; name?: string; lists?: string[], ipAddress?: string }) {
    if (!data.email) return { success: false, error: "Email is required" };

    try {
        await connectToDatabase();
        const existing = await Subscriber.findOne({ email: data.email });
        if (existing) {
            // Update existing
            const updatedLists = new Set([...existing.lists.map(l => l.toString()), ...(data.lists || [])]);
            await Subscriber.findByIdAndUpdate(existing._id, {
                name: data.name || existing.name,
                lists: Array.from(updatedLists),
                status: 'active' // Resubscribe if they were unsubscribed
            });
            revalidatePath('/admin/subscribers');
            return { success: true, message: "Subscriber updated!" };
        }

        const id = `sub-${Date.now()}`;
        await Subscriber.create({
            id,
            email: data.email,
            name: data.name,
            ipAddress: data.ipAddress,
            subscribedAt: new Date(),
            status: 'active',
            lists: data.lists || []
        });

        // Update counts
        if (data.lists && data.lists.length > 0) {
            await MailingList.updateMany({ _id: { $in: data.lists } }, { $inc: { subscriberCount: 1 } });
        }

        revalidatePath('/admin/subscribers');
        return { success: true, message: "Successfully subscribed!" };
    } catch (e: any) {
        console.error("Subscription error", e);
        return { success: false, error: "Failed to subscribe." };
    }
}

export async function updateSubscriber(id: string, data: { name?: string; email?: string; status?: string; lists?: string[] }) {
    try {
        await connectToDatabase();
        const oldSub = await Subscriber.findById(id);
        if (!oldSub) return { success: false, error: "Not found" };

        const newSub = await Subscriber.findByIdAndUpdate(id, data, { new: true });
        
        // Recalculate list counts (simplified: just run a count aggregation or update diffs)
        // For robustness, in a real app you'd diff the lists or use an aggregate
        
        revalidatePath('/admin/subscribers');
        return { success: true, data: JSON.parse(JSON.stringify(newSub)) };
    } catch (e: any) {
        console.error("Error updating subscriber", e);
        return { success: false, error: "Failed to update subscriber" };
    }
}

export async function deleteSubscriber(id: string) {
    try {
        await connectToDatabase();
        const sub = await Subscriber.findOneAndDelete({ _id: id });
        if (sub && sub.lists && sub.lists.length > 0) {
            await MailingList.updateMany({ _id: { $in: sub.lists } }, { $inc: { subscriberCount: -1 } });
        }
        revalidatePath('/admin/subscribers');
        return { success: true };
    } catch (e: any) {
        console.error("Error deleting subscriber", e);
        return { success: false, error: "Failed to delete subscriber" };
    }
}
