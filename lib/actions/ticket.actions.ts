"use server";

import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import Ticket from "@/lib/db/models/Ticket";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// @desc    Get user tickets
// @access  Private
export async function getTickets() {
    try {
        const user = await currentUser();
        if (!user) return [];

        await connectDB();
        const tickets = await Ticket.find({ clerkId: user.id }).sort({ lastMessageAt: -1, createdAt: -1 });
        return JSON.parse(JSON.stringify(tickets));
    } catch (error) {
        console.error("Get tickets error:", error);
        throw new Error("Failed to fetch tickets");
    }
}

// @desc    Get user ticket
// @access  Private
export async function getTicket(ticketId: string) {
    try {
        const user = await currentUser();
        if (!user) return null;

        await connectDB();
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) return null;

        if (ticket.clerkId !== user.id) {
            // Check if admin
            const { checkRole } = await import("@/lib/roles");
            const isAdmin = await checkRole("admin");

            if (!isAdmin) {
                return null; // Not Authorized
            }
        }

        return JSON.parse(JSON.stringify(ticket));
    } catch (error) {
        console.error("Get ticket error:", error);
        return null;
    }
}

// @desc    Create new ticket
// @access  Private
export async function createTicket(subject: string, description: string) {
    try {
        const user = await currentUser();
        if (!user) return { error: "Unauthorized" };

        if (!subject || !description) {
            return { error: "Please add a subject and description" };
        }

        await connectDB();

        const ticket = await Ticket.create({
            clerkId: user.id,
            userInfo: {
                name: `${user.firstName} ${user.lastName}`.trim(),
                email: user.emailAddresses[0]?.emailAddress,
                avatar: user.imageUrl,
            },
            subject,
            description,
            status: 'new',
        });

        revalidatePath("/tickets");
        return { success: true, ticketId: ticket._id.toString() };
    } catch (error) {
        console.error("Create ticket error:", error);
        return { error: "Failed to create ticket" };
    }
}

// @desc    Close ticket
// @access  Private
export async function closeTicket(ticketId: string) {
    try {
        const user = await currentUser();
        if (!user) return { error: "Unauthorized" };

        await connectDB();
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) return { error: "Ticket not found" };

        if (ticket.clerkId !== user.id) {
            // Check if admin
            const { checkRole } = await import("@/lib/roles");
            const isAdmin = await checkRole("admin");

            if (!isAdmin) {
                return { error: "Unauthorized" };
            }
        }

        await Ticket.findByIdAndUpdate(ticketId, { status: 'closed' }, { new: true });

        revalidatePath(`/tickets/${ticketId}`);
        revalidatePath("/tickets");
        return { success: true };
    } catch (error) {
        console.error("Close ticket error:", error);
        return { error: "Failed to close ticket" };
    }
}

// @desc    Get all tickets (Admin)
// @access  Private/Admin
export async function getAllTickets() {
    try {
        const user = await currentUser();
        if (!user) return [];

        const { checkRole } = await import("@/lib/roles");
        const isAdmin = await checkRole("admin");

        if (!isAdmin) return [];

        await connectDB();
        const tickets = await Ticket.find({}).sort({ lastMessageAt: -1, createdAt: -1 });
        return JSON.parse(JSON.stringify(tickets));
    } catch (error) {
        console.error("Get all tickets error:", error);
        throw new Error("Failed to fetch tickets");
    }
}

// @desc    Delete ticket
// @access  Private/Admin
export async function deleteTicket(ticketId: string) {
    try {
        const user = await currentUser();
        if (!user) return { error: "Unauthorized" };

        const { checkRole } = await import("@/lib/roles");
        const isAdmin = await checkRole("admin");

        if (!isAdmin) {
            return { error: "Unauthorized" };
        }

        await connectDB();

        await Ticket.findByIdAndDelete(ticketId);

        // Optionally delete associated notes
        // const Note = (await import("@/lib/db/models/Note")).default;
        // await Note.deleteMany({ ticketId });

        revalidatePath("/admin/tickets");
        return { success: true };
    } catch (error) {
        console.error("Delete ticket error:", error);
        return { error: "Failed to delete ticket" };
    }
}

// @desc    Get ticket count
// @access  Private/Admin
export async function getTicketCount() {
    try {
        const user = await currentUser();
        if (!user) return 0;

        const { checkRole } = await import("@/lib/roles");
        const isAdmin = await checkRole("admin");

        if (!isAdmin) return 0;

        await connectDB();
        const count = await Ticket.countDocuments();
        return count;
    } catch (error) {
        console.error("Get ticket count error:", error);
        return 0;
    }
}
