"use server";

import connectToDatabase from "@/lib/db/connect";
import CommunityEvent from "@/lib/db/models/CommunityEvent";
import { revalidatePath } from "next/cache";

export async function createEvent(data: any) {
    await connectToDatabase();
    const event = await CommunityEvent.create(data);
    revalidatePath("/community/events");
    revalidatePath("/admin/events");
    return JSON.parse(JSON.stringify(event));
}

export async function getEvents() {
    await connectToDatabase();
    const events = await CommunityEvent.find({})
        .sort({ startDate: 1 })
        .populate('organizer', 'firstName lastName avatar clerkId')
        .populate('attendees', 'firstName lastName avatar clerkId');
    return JSON.parse(JSON.stringify(events));
}

export async function joinEvent(eventId: string, userId: string) {
    await connectToDatabase();
    const event = await CommunityEvent.findByIdAndUpdate(
        eventId,
        { $addToSet: { attendees: userId } },
        { new: true }
    );
    revalidatePath("/community/events");
    revalidatePath("/admin/events");
    return JSON.parse(JSON.stringify(event));
}

export async function leaveEvent(eventId: string, userId: string) {
    await connectToDatabase();
    const event = await CommunityEvent.findByIdAndUpdate(
        eventId,
        { $pull: { attendees: userId } },
        { new: true }
    );
    revalidatePath("/community/events");
    revalidatePath("/admin/events");
    return JSON.parse(JSON.stringify(event));
}

export async function deleteEvent(eventId: string) {
    await connectToDatabase();
    await CommunityEvent.findByIdAndDelete(eventId);
    revalidatePath("/community/events");
    revalidatePath("/admin/events");
    return { success: true };
}
