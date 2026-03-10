"use server";

import connectToDatabase from "@/lib/db/connect";
import Subscriber from "@/lib/db/models/Subscriber";
import { revalidatePath } from "next/cache";

export async function subscribeUser(email: string) {
    if (!email) return { error: "Email is required" };

    try {
        await connectToDatabase();
        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return { message: "Already subscribed!" };
        }

        await Subscriber.create({
            id: `sub-${Date.now()}`,
            email,
            subscribedAt: new Date(),
            status: 'active'
        });

        return { success: true, message: "Successfully subscribed!" };
    } catch (e: any) {
        console.error("Subscription error", e);
        return { error: "Failed to subscribe." };
    }
}

export async function getSubscribers() {
    try {
        await connectToDatabase();
        const subs = await Subscriber.find().sort({ subscribedAt: -1 }).lean();
        return JSON.parse(JSON.stringify(subs));
    } catch (e) {
        console.error("Error fetching subscribers", e);
        return [];
    }
}

export async function deleteSubscriber(id: string) {
    try {
        await connectToDatabase();
        await Subscriber.findOneAndDelete({ id });
        revalidatePath('/admin/subscribers');
        return { success: true };
    } catch (e: any) {
        console.error("Error deleting subscriber", e);
        return { error: "Failed to delete subscriber" };
    }
}
