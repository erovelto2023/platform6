"use server";

import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import Course from "@/lib/db/models/Course";
import Offer from "@/lib/db/models/Offer";
import Resource from "@/lib/db/models/Resource";
import Payment from "@/lib/db/models/Payment";
import AffiliateCompany from "@/lib/db/models/AffiliateCompany";
import Group from "@/lib/db/models/Group";
import Survey from "@/lib/db/models/Survey";
import Supplier from "@/lib/db/models/Supplier";
import GlossaryTerm from "@/lib/db/models/GlossaryTerm";
import Announcement from "@/lib/db/models/Announcement";
import CalendarEvent from "@/lib/db/models/CalendarEvent";
import Assignment from "@/lib/db/models/Assignment";
import Conversation from "@/lib/db/models/Conversation";
import Message from "@/lib/db/models/Message";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { checkRole } from "@/lib/roles";

// Original Admin dashboard statistics action
export async function getDashboardStats() {
    try {
        await connectDB();

        // Get current date and date 30 days ago
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Total users and growth
        const totalUsers = await User.countDocuments();
        const usersLastMonth = await User.countDocuments({
            createdAt: { $lt: thirtyDaysAgo }
        });
        const newUsers = totalUsers - usersLastMonth;
        const userGrowth = usersLastMonth > 0
            ? ((newUsers / usersLastMonth) * 100).toFixed(1)
            : totalUsers > 0 ? 100 : 0;

        // Active users (logged in within last 30 days)
        const activeUsers = await User.countDocuments({
            updatedAt: { $gte: thirtyDaysAgo }
        });
        const activeUsersLastPeriod = await User.countDocuments({
            updatedAt: {
                $gte: new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
                $lt: thirtyDaysAgo
            }
        });
        const activeGrowth = activeUsersLastPeriod > 0
            ? (((activeUsers - activeUsersLastPeriod) / activeUsersLastPeriod) * 100).toFixed(1)
            : activeUsers > 0 ? 100 : 0;

        // Content counts
        const totalCourses = await Course.countDocuments();
        const totalOffers = await Offer.countDocuments();
        const totalResources = await Resource.countDocuments();
        const totalAffiliatePartners = await AffiliateCompany.countDocuments();
        const totalGroups = await Group.countDocuments();
        const totalSurveys = await Survey.countDocuments({ status: "Active" });
        const totalWholesaleSuppliers = await Supplier.countDocuments();

        // Calculate total content items
        const totalContent = totalCourses + totalOffers + totalResources;

        // Content from last month
        const contentLastMonth =
            await Course.countDocuments({ createdAt: { $lt: thirtyDaysAgo } }) +
            await Offer.countDocuments({ createdAt: { $lt: thirtyDaysAgo } }) +
            await Resource.countDocuments({ createdAt: { $lt: thirtyDaysAgo } });

        const newContent = totalContent - contentLastMonth;
        const contentGrowth = contentLastMonth > 0
            ? ((newContent / contentLastMonth) * 100).toFixed(1)
            : totalContent > 0 ? 100 : 0;

        // Revenue from Stripe payments
        const successfulPayments = await Payment.find({ status: 'succeeded' });
        const totalRevenue = successfulPayments.reduce((sum, payment) => sum + payment.amount, 0);

        // Revenue from last month
        const paymentsLastMonth = await Payment.find({
            status: 'succeeded',
            createdAt: { $lt: thirtyDaysAgo }
        });
        const revenueLastMonth = paymentsLastMonth.reduce((sum, payment) => sum + payment.amount, 0);

        const recentRevenue = totalRevenue - revenueLastMonth;
        const revenueGrowth = revenueLastMonth > 0
            ? ((recentRevenue / revenueLastMonth) * 100).toFixed(1)
            : totalRevenue > 0 ? 100 : 0;

        // Page views - placeholder for now
        const pageViews = 0; 
        const viewsGrowth = 0;

        return {
            totalUsers,
            userGrowth: parseFloat(userGrowth as string),
            totalRevenue,
            revenueGrowth: parseFloat(revenueGrowth as string),
            pageViews,
            viewsGrowth,
            activeUsers,
            activeGrowth: parseFloat(activeGrowth as string),
            totalContent,
            contentGrowth: parseFloat(contentGrowth as string),
            breakdown: {
                courses: totalCourses,
                offers: totalOffers,
                resources: totalResources,
                affiliatePartners: totalAffiliatePartners,
                groups: totalGroups,
                surveys: totalSurveys,
                wholesaleSuppliers: totalWholesaleSuppliers,
            }
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            totalUsers: 0,
            userGrowth: 0,
            totalRevenue: 0,
            revenueGrowth: 0,
            pageViews: 0,
            viewsGrowth: 0,
            activeUsers: 0,
            activeGrowth: 0,
            totalContent: 0,
            contentGrowth: 0,
            breakdown: {
                courses: 0,
                offers: 0,
                resources: 0,
                affiliatePartners: 0,
                groups: 0,
                surveys: 0,
                wholesaleSuppliers: 0,
            }
        };
    }
}

// Fetch all dashboard data for the student
export async function getDashboardData() {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        // 1. Get User Profile & DB ID
        let dbUser = await User.findOne({ clerkId: userId });
        if (!dbUser) {
            // Auto-create user if they exist in Clerk but not in DB
            dbUser = await User.create({
                clerkId: userId,
                email: `user_${userId}@kbusiness.academy`, // Fallback
                role: 'student',
            });
        }
        const userDbId = dbUser._id.toString();

        // 2. Fetch Glossary Term of the day (Date-seeded selection)
        let glossaryTerm = null;
        try {
            const glossaryCount = await GlossaryTerm.countDocuments({ status: "Published" });
            if (glossaryCount > 0) {
                const daySeed = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
                const termIndex = daySeed % glossaryCount;
                const term = await GlossaryTerm.findOne({ status: "Published" }).skip(termIndex);
                if (term) {
                    glossaryTerm = JSON.parse(JSON.stringify(term));
                }
            }
        } catch (err) {
            console.error("Error fetching glossary term:", err);
        }

        // 3. Announcements
        const announcements = await Announcement.find({
            archivedBy: { $ne: userId }
        }).sort({ createdAt: -1 });

        const processedAnnouncements = announcements.map((ann) => {
            const isRead = ann.readBy.includes(userId);
            const ageInMs = Date.now() - new Date(ann.createdAt).getTime();
            const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
            const oneDayInMs = 24 * 60 * 60 * 1000;

            let color = "grey"; // Default/Archive/Old
            if (isRead) {
                color = "yellow";
            } else if (ageInMs > oneWeekInMs) {
                color = "grey";
            } else if (ageInMs <= oneDayInMs) {
                color = "green";
            } else {
                color = "green"; // Green for new/unread within the week
            }

            return {
                _id: ann._id.toString(),
                title: ann.title,
                content: ann.content,
                createdAt: ann.createdAt.toISOString(),
                color,
                isRead,
            };
        });

        // 4. Events
        const events = await CalendarEvent.find({
            date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }).sort({ date: 1 });

        // 5. Assignments
        const assignments = await Assignment.find({}).sort({ dueDate: 1 });
        const processedAssignments = assignments.map((asg) => {
            const userSubmission = asg.submissions?.find((s: any) => s.userId === userId);
            return {
                _id: asg._id.toString(),
                title: asg.title,
                description: asg.description,
                dueDate: asg.dueDate.toISOString(),
                points: asg.points,
                instructions: asg.instructions,
                attachments: asg.attachments ? JSON.parse(JSON.stringify(asg.attachments)) : [],
                submission: userSubmission ? {
                    submittedAt: userSubmission.submittedAt.toISOString(),
                    content: userSubmission.content,
                    status: userSubmission.status,
                    grade: userSubmission.grade,
                } : null,
            };
        });

        // 6. Courses
        const courses = await Course.find({ isPublished: true }).sort({ createdAt: -1 });
        const coursesWithProgress = courses.map((course) => {
            const progressObj = dbUser.progress?.find(
                (p: any) => p.courseId?.toString() === course._id.toString()
            );
            return {
                _id: course._id.toString(),
                title: course.title,
                thumbnail: course.thumbnail || "",
                modulesCount: course.modules?.length || 0,
                price: course.price || 0,
                progress: progressObj?.progressPercentage || 0,
                createdAt: course.createdAt.toISOString(),
                description: course.description || "",
            };
        });

        const newestCourses = [...coursesWithProgress].slice(0, 5);
        // "Top Courses" - sorted by user progress or default to first 5
        const topCourses = [...coursesWithProgress]
            .sort((a, b) => b.progress - a.progress)
            .slice(0, 5);

        // 7. Private Messages & Conversations
        const conversations = await Conversation.find({
            participants: dbUser._id,
            archivedBy: { $ne: dbUser._id }
        })
            .populate({
                path: "participants",
                select: "firstName lastName email clerkId role avatar username"
            })
            .populate({
                path: "lastMessage",
                populate: { path: "sender", select: "firstName lastName role avatar" }
            })
            .sort({ lastMessageAt: -1 });

        const processedConversations = await Promise.all(conversations.map(async (conv) => {
            const rawMessages = await Message.find({
                conversationId: conv._id,
                isDeleted: false
            })
                .populate("sender", "firstName lastName role avatar clerkId")
                .sort({ createdAt: 1 });

            const formattedMessages = rawMessages.map((msg) => ({
                _id: msg._id.toString(),
                content: msg.content,
                createdAt: msg.createdAt.toISOString(),
                sender: {
                    _id: msg.sender._id.toString(),
                    name: `${msg.sender.firstName || ""} ${msg.sender.lastName || ""}`.trim() || msg.sender.email,
                    clerkId: msg.sender.clerkId,
                    avatar: msg.sender.avatar || "",
                    role: msg.sender.role,
                },
                type: msg.type,
            }));

            const otherParticipant = conv.participants.find((p: any) => p._id.toString() !== userDbId);

            return {
                _id: conv._id.toString(),
                isGroup: conv.isGroup,
                groupName: conv.groupName,
                lastMessageAt: conv.lastMessageAt.toISOString(),
                otherParticipant: otherParticipant ? {
                    _id: otherParticipant._id.toString(),
                    name: `${otherParticipant.firstName || ""} ${otherParticipant.lastName || ""}`.trim() || otherParticipant.email,
                    clerkId: otherParticipant.clerkId,
                    avatar: otherParticipant.avatar || "",
                    role: otherParticipant.role,
                } : null,
                messages: formattedMessages,
            };
        }));

        return {
            role: dbUser.role,
            userDbId,
            glossaryTerm,
            announcements: processedAnnouncements,
            events: JSON.parse(JSON.stringify(events)),
            assignments: processedAssignments,
            topCourses,
            newestCourses,
            allCourses: coursesWithProgress,
            conversations: processedConversations,
        };

    } catch (error) {
        console.error("Error loading dashboard data:", error);
        return { error: "Failed to load dashboard data." };
    }
}

// Mark Announcement as Read
export async function markAnnouncementRead(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        await Announcement.findByIdAndUpdate(id, {
            $addToSet: { readBy: userId }
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to mark announcement as read." };
    }
}

// Archive Announcement
export async function archiveAnnouncement(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        await Announcement.findByIdAndUpdate(id, {
            $addToSet: { archivedBy: userId }
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to archive announcement." };
    }
}

// Submit Assignment
export async function submitAssignment(assignmentId: string, content: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return { error: "Assignment not found." };

        // Check if already submitted
        const existingIndex = assignment.submissions.findIndex((s: any) => s.userId === userId);
        if (existingIndex > -1) {
            assignment.submissions[existingIndex].content = content;
            assignment.submissions[existingIndex].submittedAt = new Date();
            assignment.submissions[existingIndex].status = "pending";
        } else {
            assignment.submissions.push({
                userId,
                content,
                submittedAt: new Date(),
                status: "pending",
            });
        }

        await assignment.save();
        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to submit assignment." };
    }
}

// Send Private Message
export async function sendPrivateMessage(recipientClerkId: string, content: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();

        // 1. Get Sender and Recipient
        const sender = await User.findOne({ clerkId: userId });
        const recipient = await User.findOne({ clerkId: recipientClerkId });

        if (!sender || !recipient) {
            return { error: "Sender or recipient user not found in local DB." };
        }

        // 2. Find or Create Conversation
        let conversation = await Conversation.findOne({
            isGroup: false,
            participants: { $all: [sender._id, recipient._id] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [sender._id, recipient._id],
            });
        }

        // 3. Create Message
        const message = await Message.create({
            conversationId: conversation._id,
            sender: sender._id,
            content,
            type: 'text',
        });

        // 4. Update Conversation lastMessage metadata
        conversation.lastMessage = message._id;
        conversation.lastMessageAt = new Date();
        // Remove from archivedBy if either participant had archived it
        conversation.archivedBy = [];
        await conversation.save();

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to send private message." };
    }
}

// Reply inside Conversation
export async function replyToConversation(conversationId: string, content: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const sender = await User.findOne({ clerkId: userId });
        if (!sender) return { error: "Sender not found." };

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return { error: "Conversation not found." };

        const message = await Message.create({
            conversationId: conversation._id,
            sender: sender._id,
            content,
            type: 'text',
        });

        conversation.lastMessage = message._id;
        conversation.lastMessageAt = new Date();
        conversation.archivedBy = [];
        await conversation.save();

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to reply to message." };
    }
}

// Delete Message (Soft delete)
export async function deletePrivateMessage(messageId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        await Message.findByIdAndUpdate(messageId, { isDeleted: true });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to delete message." };
    }
}

// Archive Conversation
export async function archiveConversation(conversationId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const dbUser = await User.findOne({ clerkId: userId });
        if (!dbUser) return { error: "User not found." };

        await Conversation.findByIdAndUpdate(conversationId, {
            $addToSet: { archivedBy: dbUser._id }
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to archive conversation." };
    }
}

// Get User Contact List
export async function getUsersList() {
    try {
        const { userId } = await auth();
        if (!userId) return [];

        await connectDB();
        const users = await User.find({ clerkId: { $ne: userId } })
            .select("firstName lastName role clerkId email avatar")
            .sort({ role: 1, firstName: 1 });

        return users.map((u) => ({
            clerkId: u.clerkId,
            name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email,
            role: u.role,
            avatar: u.avatar || "",
        }));
    } catch (err) {
        console.error(err);
        return [];
    }
}

// ADMIN ACTIONS

// Fetch all content (announcements, events, assignments) for admin management
export async function getAdminContentData() {
    try {
        const isAdmin = await checkRole("admin");
        if (!isAdmin) return { error: "Unauthorized" };

        await connectDB();

        const [announcements, events, assignments] = await Promise.all([
            Announcement.find({}).sort({ createdAt: -1 }).lean(),
            CalendarEvent.find({}).sort({ date: 1 }).lean(),
            Assignment.find({}).sort({ createdAt: -1 }).lean(),
        ]);

        return {
            announcements: JSON.parse(JSON.stringify(announcements)),
            events: JSON.parse(JSON.stringify(events)),
            assignments: JSON.parse(JSON.stringify(assignments)),
        };
    } catch (err) {
        console.error(err);
        return { error: "Failed to fetch admin content data." };
    }
}

// Create Announcement
export async function createAnnouncement(title: string, content: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const isAdmin = await checkRole("admin");
        if (!isAdmin) return { error: "Only admins can perform this action." };

        await Announcement.create({ title, content });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to create announcement." };
    }
}

// Create Calendar Event
export async function createCalendarEvent(title: string, description: string, date: Date, location: string, type: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const isAdmin = await checkRole("admin");
        if (!isAdmin) return { error: "Only admins can perform this action." };

        await CalendarEvent.create({ title, description, date, location, type });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to create calendar event." };
    }
}

// Create Assignment
export async function createAssignment(title: string, description: string, dueDate: Date, points: number, instructions?: string, attachments?: { name: string; url: string }[]) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const isAdmin = await checkRole("admin");
        if (!isAdmin) return { error: "Only admins can perform this action." };

        await Assignment.create({ title, description, dueDate, points, instructions, attachments });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to create assignment." };
    }
}

// Delete Calendar Event
export async function deleteCalendarEvent(eventId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const isAdmin = await checkRole("admin");
        if (!isAdmin) return { error: "Only admins can perform this action." };

        await CalendarEvent.findByIdAndDelete(eventId);

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to delete calendar event." };
    }
}

// Grade Assignment Submission
export async function gradeAssignmentSubmission(assignmentId: string, submissionUserId: string, grade: string, status: 'approved' | 'rejected') {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const isAdmin = await checkRole("admin");
        if (!isAdmin) return { error: "Only admins can perform this action." };

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return { error: "Assignment not found." };

        const submission = assignment.submissions.find((s: any) => s.userId === submissionUserId);
        if (submission) {
            submission.grade = grade;
            submission.status = status;
        }

        await assignment.save();
        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to grade submission." };
    }
}

// Update Announcement
export async function updateAnnouncement(id: string, title: string, content: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const isAdmin = await checkRole("admin");
        if (!isAdmin) return { error: "Only admins can perform this action." };

        await Announcement.findByIdAndUpdate(id, { title, content });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to update announcement." };
    }
}

// Delete Announcement
export async function deleteAnnouncement(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const isAdmin = await checkRole("admin");
        if (!isAdmin) return { error: "Only admins can perform this action." };

        await Announcement.findByIdAndDelete(id);

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to delete announcement." };
    }
}

// Update Calendar Event
export async function updateCalendarEvent(id: string, title: string, description: string, date: Date, location: string, type: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const isAdmin = await checkRole("admin");
        if (!isAdmin) return { error: "Only admins can perform this action." };

        await CalendarEvent.findByIdAndUpdate(id, { title, description, date, location, type });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to update calendar event." };
    }
}

// Update Assignment
export async function updateAssignment(id: string, title: string, description: string, dueDate: Date, points: number, instructions?: string, attachments?: { name: string; url: string }[]) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const isAdmin = await checkRole("admin");
        if (!isAdmin) return { error: "Only admins can perform this action." };

        await Assignment.findByIdAndUpdate(id, { title, description, dueDate, points, instructions, attachments });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to update assignment." };
    }
}

// Delete Assignment
export async function deleteAssignment(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const isAdmin = await checkRole("admin");
        if (!isAdmin) return { error: "Only admins can perform this action." };

        await Assignment.findByIdAndDelete(id);

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Failed to delete assignment." };
    }
}

