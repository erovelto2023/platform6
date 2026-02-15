"use server";

import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import Note from "@/lib/db/models/Note";
import Ticket from "@/lib/db/models/Ticket";
import { checkRole } from "@/lib/roles";

// @desc    Get notes for a ticket
// @access  Private
export async function getNotes(ticketId: string) {
    try {
        const user = await currentUser();
        if (!user) return [];

        await connectDB();

        // Ensure ticket belongs to user OR user is admin
        const ticket = await Ticket.findById(ticketId);

        // If ticket doesn't exist, return empty
        if (!ticket) return [];

        const isAdmin = await checkRole('admin');

        if (ticket.clerkId !== user.id && !isAdmin) {
            return []; // Not Authorized
        }

        const notes = await Note.find({ ticketId });
        return JSON.parse(JSON.stringify(notes));
    } catch (error) {
        console.error("Get notes error:", error);
        return [];
    }
}

import { createNotification } from "@/lib/actions/notification.actions";
import User from "@/lib/db/models/User";

// @desc    Create ticket note
// @access  Private
export async function createNote(ticketId: string, text: string) {
    try {
        const user = await currentUser();
        if (!user) return { error: "Unauthorized" };

        if (!text) return { error: "Please add some text" };

        await connectDB();

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) return { error: "Ticket not found" };

        const isAdmin = await checkRole('admin');

        if (ticket.clerkId !== user.id && !isAdmin) {
            return { error: "Unauthorized" };
        }

        // 1. Create Note
        const note = await Note.create({
            ticketId,
            text,
            isStaff: isAdmin,
            clerkId: user.id,
            staffId: isAdmin ? user.id : null,
        });

        // 2. Update Ticket lastMessageAt
        await Ticket.findByIdAndUpdate(ticketId, {
            lastMessageAt: new Date(),
            // Optional: Update status if user replies?
            // status: isAdmin ? 'open' : 'new' (maybe?)
        });

        // 3. Handle Notifications
        // We need DB _ids for Notifications, not Clerk IDs
        const senderDoc = await User.findOne({ clerkId: user.id });

        if (senderDoc) {
            if (isAdmin) {
                // Notify Ticket Owner
                const recipientDoc = await User.findOne({ clerkId: ticket.clerkId });
                if (recipientDoc) {
                    await createNotification({
                        recipientId: recipientDoc._id,
                        senderId: senderDoc._id,
                        type: 'reply',
                        content: `New reply on your ticket: ${ticket.product}`,
                        link: `/tickets/${ticketId}`,
                        relatedId: ticket._id
                    });
                }
            } else {
                // Notify All Admins
                const admins = await User.find({ role: 'admin' });
                for (const admin of admins) {
                    await createNotification({
                        recipientId: admin._id,
                        senderId: senderDoc._id, // User sending the reply
                        type: 'reply',
                        content: `New reply on ticket #${ticket._id}`,
                        link: `/admin/tickets/${ticketId}`,
                        relatedId: ticket._id
                    });
                }
            }
        }

        return { success: true, note: JSON.parse(JSON.stringify(note)) };
    } catch (error) {
        console.error("Create note error:", error);
        return { error: "Failed to create note" };
    }
}
