"use server";

import { currentUser } from "@clerk/nextjs/server";
import { checkRole } from "@/lib/roles";
import connectDB from "@/lib/db/connect";
import Ticket from "@/lib/db/models/Ticket";
import { revalidatePath } from "next/cache";

export async function createTicket(title: string, description: string, priority: string) {
    try {
        console.log("[createTicket] Starting ticket creation...");
        const user = await currentUser();
        if (!user) {
            console.log("[createTicket] Unauthorized: No user found");
            return { error: "Unauthorized" };
        }
        console.log("[createTicket] User found:", user.id);

        await connectDB();
        console.log("[createTicket] DB Connected");

        const ticketData = {
            clerkId: user.id,
            userInfo: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.emailAddresses[0]?.emailAddress,
                avatar: user.imageUrl,
            },
            title,
            description,
            priority,
            messages: [{
                senderId: user.id,
                senderName: `${user.firstName} ${user.lastName}`,
                senderAvatar: user.imageUrl,
                content: description,
                isAdmin: false,
            }]
        };
        console.log("[createTicket] Creating ticket with data:", JSON.stringify(ticketData, null, 2));

        const ticket = await Ticket.create(ticketData);
        console.log("[createTicket] Ticket created successfully:", ticket._id);

        revalidatePath("/support");
        return { success: true, ticketId: ticket._id.toString() };
    } catch (error) {
        console.error("[createTicket] CRITICAL ERROR:", error);
        return { error: "Failed to create ticket" };
    }
}

export async function getUserTickets() {
    try {
        const user = await currentUser();
        if (!user) return [];

        await connectDB();
        const tickets = await Ticket.find({ clerkId: user.id }).sort({ updatedAt: -1 });
        return JSON.parse(JSON.stringify(tickets));
    } catch (error) {
        console.error("Get user tickets error:", error);
        throw new Error("Failed to fetch user tickets");
    }
}

export async function getAllTickets() {
    try {
        const isAdmin = await checkRole('admin');
        if (!isAdmin) return [];

        await connectDB();
        const tickets = await Ticket.find({}).sort({ updatedAt: -1 });
        return JSON.parse(JSON.stringify(tickets));
    } catch (error) {
        console.error("Get all tickets error:", error);
        throw new Error("Failed to fetch tickets");
    }
}

export async function getTicket(ticketId: string) {
    try {
        const user = await currentUser();
        if (!user) return null;

        await connectDB();
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) return null;

        const isAdmin = await checkRole('admin');
        const isOwner = ticket.clerkId === user.id;

        if (!isOwner && !isAdmin) return null;

        return JSON.parse(JSON.stringify(ticket));
    } catch (error) {
        console.error("Get ticket error:", error);
        return null;
    }
}

export async function addMessage(ticketId: string, content: string) {
    try {
        const user = await currentUser();
        if (!user) return { error: "Unauthorized" };

        await connectDB();
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) return { error: "Ticket not found" };

        const isAdmin = await checkRole('admin');

        // If not admin, verify ownership
        if (!isAdmin && ticket.clerkId !== user.id) {
            return { error: "Unauthorized" };
        }

        ticket.messages.push({
            senderId: user.id,
            senderName: `${user.firstName || 'User'} ${user.lastName || ''}`.trim(),
            senderAvatar: user.imageUrl,
            content,
            isAdmin,
        });

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
        const isAdmin = await checkRole('admin');
        if (!isAdmin) return { error: "Unauthorized" };

        await connectDB();
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
        const isAdmin = await checkRole('admin');
        if (!isAdmin) return { error: "Unauthorized" };

        await connectDB();
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
