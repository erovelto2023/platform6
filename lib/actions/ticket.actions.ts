"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import Ticket from "@/lib/db/models/Ticket";
import User from "@/lib/db/models/User";
import { revalidatePath } from "next/cache";

// Helper to check if user is admin
async function isAdmin(userId: string) {
    await connectDB();
    const user = await User.findOne({ clerkId: userId });
    return user?.role === 'admin';
}

export async function createTicket(title: string, description: string, priority: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const user = await User.findOne({ clerkId: userId });
        if (!user) return { error: "User not found" };

        const ticket = await Ticket.create({
            userId: user._id,
            title,
            description,
            priority,
            messages: [{
                senderId: user._id,
                content: description,
                isAdmin: false,
            }]
        });

        revalidatePath("/support");
        return { success: true, ticketId: ticket._id.toString() };
    } catch (error) {
        console.error("Create ticket error:", error);
        return { error: "Failed to create ticket" };
    }
}

export async function getUserTickets() {
    try {
        const { userId } = await auth();
        if (!userId) return [];

        await connectDB();
        const user = await User.findOne({ clerkId: userId });
        if (!user) return [];

        const tickets = await Ticket.find({ userId: user._id }).sort({ updatedAt: -1 });
        return JSON.parse(JSON.stringify(tickets));
    } catch (error) {
        console.error("Get user tickets error:", error);
        return [];
    }
}

export async function getAllTickets() {
    try {
        const { userId } = await auth();
        if (!userId) return [];

        if (!(await isAdmin(userId))) return [];

        const tickets = await Ticket.find({})
            .sort({ updatedAt: -1 })
            .populate('userId', 'firstName lastName email avatar'); // Populate user details
        return JSON.parse(JSON.stringify(tickets));
    } catch (error) {
        console.error("Get all tickets error:", error);
        return [];
    }
}

export async function getTicket(ticketId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return null;

        await connectDB();
        const user = await User.findOne({ clerkId: userId });
        if (!user) return null;

        const ticket = await Ticket.findById(ticketId)
            .populate('userId', 'firstName lastName email avatar')
            .populate('messages.senderId', 'firstName lastName avatar role');

        if (!ticket) return null;

        // Check auth: Owner or Admin
        const isOwner = ticket.userId._id.toString() === user._id.toString();
        const isUserAdmin = user.role === 'admin';

        if (!isOwner && !isUserAdmin) return null;

        return JSON.parse(JSON.stringify(ticket));
    } catch (error) {
        console.error("Get ticket error:", error);
        return null;
    }
}

export async function addMessage(ticketId: string, content: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const user = await User.findOne({ clerkId: userId });
        if (!user) return { error: "User not found" };

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) return { error: "Ticket not found" };

        const isUserAdmin = user.role === 'admin';

        // If not admin, verify ownership
        if (!isUserAdmin && ticket.userId.toString() !== user._id.toString()) {
            return { error: "Unauthorized" };
        }

        ticket.messages.push({
            senderId: user._id,
            content,
            isAdmin: isUserAdmin,
        });

        // If admin replies, user might want to know (status update?)
        // If user replies, maybe set status to Open if it was waiting?
        // For now, simple message add.

        await ticket.save();

        revalidatePath(`/support/${ticketId}`);
        revalidatePath(`/admin/tickets/${ticketId}`);
        return { success: true };
    } catch (error) {
        console.error("Add message error:", error);
        return { error: "Failed to send message" };
    }
}

export async function updateTicketStatus(ticketId: string, status: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        if (!(await isAdmin(userId))) return { error: "Unauthorized" };

        await Ticket.findByIdAndUpdate(ticketId, { status });

        revalidatePath(`/support/${ticketId}`);
        revalidatePath(`/admin/tickets/${ticketId}`);
        revalidatePath("/admin/tickets");
        return { success: true };
    } catch (error) {
        console.error("Update status error:", error);
        return { error: "Failed to update status" };
    }
}

export async function updateTicketPriority(ticketId: string, priority: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        if (!(await isAdmin(userId))) return { error: "Unauthorized" };

        await Ticket.findByIdAndUpdate(ticketId, { priority });

        revalidatePath(`/support/${ticketId}`);
        revalidatePath(`/admin/tickets/${ticketId}`);
        revalidatePath("/admin/tickets");
        return { success: true };
    } catch (error) {
        console.error("Update priority error:", error);
        return { error: "Failed to update priority" };
    }
}
