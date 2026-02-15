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

        const note = await Note.create({
            ticketId,
            text,
            isStaff: isAdmin,
            clerkId: user.id, // Who created the note
            staffId: isAdmin ? user.id : null,
        });

        return { success: true, note: JSON.parse(JSON.stringify(note)) };
    } catch (error) {
        console.error("Create note error:", error);
        return { error: "Failed to create note" };
    }
}
