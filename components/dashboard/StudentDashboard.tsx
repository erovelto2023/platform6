"use client";

import React, { useState, useEffect } from "react";
import { 
    Calendar, Megaphone, MessageSquare, Send, Trash2, Archive, 
    CheckCircle2, Award, BookOpen, Sparkles, Check, Plus, 
    Search, FileText, ChevronRight, Clock, ArrowUpRight, 
    X, AlertCircle, Eye, EyeOff, CheckCheck, BookOpenCheck,
    Paperclip, Pencil
} from "lucide-react";
import Link from "next/link";
import { 
    getDashboardData, markAnnouncementRead, archiveAnnouncement, 
    submitAssignment, sendPrivateMessage, replyToConversation, 
    deletePrivateMessage, archiveConversation, getUsersList, 
    createAnnouncement, createCalendarEvent, createAssignment, 
    deleteCalendarEvent, gradeAssignmentSubmission,
    updateAnnouncement, deleteAnnouncement, updateCalendarEvent,
    updateAssignment, deleteAssignment
} from "@/lib/actions/dashboard.actions";

interface StudentDashboardProps {
    initialData: any;
}

export default function StudentDashboard({ initialData }: StudentDashboardProps) {
    const [data, setData] = useState<any>(initialData);
    const [activeTab, setActiveTab] = useState<string>("overview");
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Private Messaging States
    const [activeConvId, setActiveConvId] = useState<string | null>(
        initialData?.conversations?.[0]?._id || null
    );
    const [replyContent, setReplyContent] = useState<string>("");
    const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
    const [usersList, setUsersList] = useState<any[]>([]);
    const [selectedRecipientId, setSelectedRecipientId] = useState<string>("");
    const [newChatContent, setNewChatContent] = useState<string>("");

    // Assignment States
    const [assignmentContent, setAssignmentContent] = useState<string>("");
    const [gradingStatus, setGradingStatus] = useState<'approved' | 'rejected'>('approved');
    const [gradingFeedback, setGradingFeedback] = useState<string>("");

    // Admin Creation Modals
    const [showAnnouncementModal, setShowAnnouncementModal] = useState<boolean>(false);
    const [newAnnTitle, setNewAnnTitle] = useState<string>("");
    const [newAnnContent, setNewAnnContent] = useState<string>("");

    const [showEventModal, setShowEventModal] = useState<boolean>(false);
    const [newEventTitle, setNewEventTitle] = useState<string>("");
    const [newEventDesc, setNewEventDesc] = useState<string>("");
    const [newEventDate, setNewEventDate] = useState<string>("");
    const [newEventLoc, setNewEventLoc] = useState<string>("");
    const [newEventType, setNewEventType] = useState<string>("general");

    const [showAssignmentModal, setShowAssignmentModal] = useState<boolean>(false);
    const [newAsgTitle, setNewAsgTitle] = useState<string>("");
    const [newAsgDesc, setNewAsgDesc] = useState<string>("");
    const [newAsgDueDate, setNewAsgDueDate] = useState<string>("");
    const [newAsgPoints, setNewAsgPoints] = useState<number>(100);
    const [newAsgInstructions, setNewAsgInstructions] = useState<string>("");
    const [newAsgAttachments, setNewAsgAttachments] = useState<{ name: string; url: string }[]>([]);
    const [newAsgAttachmentName, setNewAsgAttachmentName] = useState<string>("");
    const [newAsgAttachmentUrl, setNewAsgAttachmentUrl] = useState<string>("");

    // Admin Edit Modals & States
    const [showEditAnnModal, setShowEditAnnModal] = useState<boolean>(false);
    const [editAnnId, setEditAnnId] = useState<string>("");
    const [editAnnTitle, setEditAnnTitle] = useState<string>("");
    const [editAnnContent, setEditAnnContent] = useState<string>("");

    const [showEditEventModal, setShowEditEventModal] = useState<boolean>(false);
    const [editEventId, setEditEventId] = useState<string>("");
    const [editEventTitle, setEditEventTitle] = useState<string>("");
    const [editEventDesc, setEditEventDesc] = useState<string>("");
    const [editEventDate, setEditEventDate] = useState<string>("");
    const [editEventLoc, setEditEventLoc] = useState<string>("");
    const [editEventType, setEditEventType] = useState<string>("general");

    const [showEditAsgModal, setShowEditAsgModal] = useState<boolean>(false);
    const [editAsgId, setEditAsgId] = useState<string>("");
    const [editAsgTitle, setEditAsgTitle] = useState<string>("");
    const [editAsgDesc, setEditAsgDesc] = useState<string>("");
    const [editAsgDueDate, setEditAsgDueDate] = useState<string>("");
    const [editAsgPoints, setEditAsgPoints] = useState<number>(100);
    const [editAsgInstructions, setEditAsgInstructions] = useState<string>("");
    const [editAsgAttachments, setEditAsgAttachments] = useState<{ name: string; url: string }[]>([]);
    const [editAsgAttachmentName, setEditAsgAttachmentName] = useState<string>("");
    const [editAsgAttachmentUrl, setEditAsgAttachmentUrl] = useState<string>("");

    // Fetch users for new conversation modal
    useEffect(() => {
        if (showNewChatModal) {
            getUsersList().then((list) => {
                setUsersList(list);
                if (list.length > 0) setSelectedRecipientId(list[0].clerkId);
            });
        }
    }, [showNewChatModal]);

    // Helper to refresh dashboard data
    const refreshData = async () => {
        setLoading(true);
        const fresh = await getDashboardData();
        if (!fresh.error) {
            setData(fresh);
            // Sync active conversation
            if (fresh.conversations && fresh.conversations.length > 0) {
                if (!activeConvId || !fresh.conversations.some((c: any) => c._id === activeConvId)) {
                    setActiveConvId(fresh.conversations[0]._id);
                }
            }
        }
        setLoading(false);
    };

    // Auto-dismiss banners
    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
                setErrorMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    const activeConversation = data?.conversations?.find((c: any) => c._id === activeConvId);

    // Handlers
    const handleMarkAnnouncementRead = async (id: string) => {
        const res = await markAnnouncementRead(id);
        if (res.success) {
            setSuccessMessage("Announcement marked as read.");
            refreshData();
        } else {
            setErrorMessage(res.error || "Action failed.");
        }
    };

    const handleArchiveAnnouncement = async (id: string) => {
        const res = await archiveAnnouncement(id);
        if (res.success) {
            setSuccessMessage("Announcement archived.");
            refreshData();
        } else {
            setErrorMessage(res.error || "Action failed.");
        }
    };

    const handleSendReply = async () => {
        if (!activeConvId || !replyContent.trim()) return;
        const res = await replyToConversation(activeConvId, replyContent);
        if (res.success) {
            setReplyContent("");
            refreshData();
        } else {
            setErrorMessage(res.error || "Failed to send message.");
        }
    };

    const handleStartNewChat = async () => {
        if (!selectedRecipientId || !newChatContent.trim()) return;
        const res = await sendPrivateMessage(selectedRecipientId, newChatContent);
        if (res.success) {
            setNewChatContent("");
            setShowNewChatModal(false);
            setSuccessMessage("Message sent successfully!");
            refreshData();
        } else {
            setErrorMessage(res.error || "Failed to start conversation.");
        }
    };

    const handleArchiveConversation = async (id: string) => {
        const res = await archiveConversation(id);
        if (res.success) {
            setSuccessMessage("Conversation archived.");
            refreshData();
        } else {
            setErrorMessage(res.error || "Action failed.");
        }
    };

    const handleAssignmentSubmit = async (asgId: string) => {
        if (!assignmentContent.trim()) return;
        const res = await submitAssignment(asgId, assignmentContent);
        if (res.success) {
            setAssignmentContent("");
            setSuccessMessage("Assignment submitted successfully!");
            refreshData();
        } else {
            setErrorMessage(res.error || "Submission failed.");
        }
    };

    // Admin action Handlers
    const handleCreateAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await createAnnouncement(newAnnTitle, newAnnContent);
        if (res.success) {
            setNewAnnTitle("");
            setNewAnnContent("");
            setShowAnnouncementModal(false);
            setSuccessMessage("Announcement published successfully.");
            refreshData();
        } else {
            setErrorMessage(res.error || "Failed to create announcement.");
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await createCalendarEvent(newEventTitle, newEventDesc, new Date(newEventDate), newEventLoc, newEventType);
        if (res.success) {
            setNewEventTitle("");
            setNewEventDesc("");
            setNewEventDate("");
            setNewEventLoc("");
            setShowEventModal(false);
            setSuccessMessage("Calendar event published successfully.");
            refreshData();
        } else {
            setErrorMessage(res.error || "Failed to create event.");
        }
    };

    const handleCreateAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await createAssignment(
            newAsgTitle, 
            newAsgDesc, 
            new Date(newAsgDueDate), 
            newAsgPoints, 
            newAsgInstructions, 
            newAsgAttachments
        );
        if (res.success) {
            setNewAsgTitle("");
            setNewAsgDesc("");
            setNewAsgDueDate("");
            setNewAsgPoints(100);
            setNewAsgInstructions("");
            setNewAsgAttachments([]);
            setNewAsgAttachmentName("");
            setNewAsgAttachmentUrl("");
            setShowAssignmentModal(false);
            setSuccessMessage("Assignment published successfully.");
            refreshData();
        } else {
            setErrorMessage(res.error || "Failed to create assignment.");
        }
    };

    const handleUpdateAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await updateAnnouncement(editAnnId, editAnnTitle, editAnnContent);
        if (res.success) {
            setShowEditAnnModal(false);
            setSuccessMessage("Announcement updated successfully.");
            refreshData();
        } else {
            setErrorMessage(res.error || "Failed to update announcement.");
        }
    };

    const handleDeleteAnnouncement = async (id: string) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return;
        const res = await deleteAnnouncement(id);
        if (res.success) {
            setSuccessMessage("Announcement deleted successfully.");
            refreshData();
        } else {
            setErrorMessage(res.error || "Failed to delete announcement.");
        }
    };

    const handleUpdateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await updateCalendarEvent(editEventId, editEventTitle, editEventDesc, new Date(editEventDate), editEventLoc, editEventType);
        if (res.success) {
            setShowEditEventModal(false);
            setSuccessMessage("Event updated successfully.");
            refreshData();
        } else {
            setErrorMessage(res.error || "Failed to update event.");
        }
    };

    const handleUpdateAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await updateAssignment(
            editAsgId, 
            editAsgTitle, 
            editAsgDesc, 
            new Date(editAsgDueDate), 
            editAsgPoints, 
            editAsgInstructions, 
            editAsgAttachments
        );
        if (res.success) {
            setShowEditAsgModal(false);
            setSuccessMessage("Assignment updated successfully.");
            refreshData();
        } else {
            setErrorMessage(res.error || "Failed to update assignment.");
        }
    };

    const handleDeleteAssignment = async (id: string) => {
        if (!confirm("Are you sure you want to delete this assignment?")) return;
        const res = await deleteAssignment(id);
        if (res.success) {
            setSuccessMessage("Assignment deleted successfully.");
            refreshData();
        } else {
            setErrorMessage(res.error || "Failed to delete assignment.");
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        const res = await deleteCalendarEvent(id);
        if (res.success) {
            setSuccessMessage("Event deleted.");
            refreshData();
        } else {
            setErrorMessage(res.error || "Delete failed.");
        }
    };

    const handleGradeSubmission = async (asgId: string, studentClerkId: string) => {
        const res = await gradeAssignmentSubmission(asgId, studentClerkId, gradingFeedback, gradingStatus);
        if (res.success) {
            setGradingFeedback("");
            setSuccessMessage("Graded student submission successfully!");
            refreshData();
        } else {
            setErrorMessage(res.error || "Failed to save grade.");
        }
    };

    return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans relative overflow-x-hidden pb-12">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

            {/* Notification Toast */}
            {successMessage && (
                <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-semibold">{successMessage}</span>
                </div>
            )}
            {errorMessage && (
                <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                    <span className="text-sm font-semibold">{errorMessage}</span>
                </div>
            )}

            {/* Main Header */}
            <header className="max-w-7xl mx-auto px-6 pt-8 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/60 relative z-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white">Student Workspace</h1>
                    <p className="text-slate-400 text-xs mt-1">Accelerate your product delivery, digital assets, and curriculum learning portals.</p>
                </div>

                {/* Dashboard Tab switcher */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
                    {[
                        { id: "overview", label: "Overview", icon: BookOpen },
                        { id: "messages", label: `Messages (${data?.conversations?.length || 0})`, icon: MessageSquare },
                        { id: "assignments", label: "Assignments", icon: FileText },
                        { id: "courses", label: "Courses", icon: Award },
                        { id: "announcements", label: "Announcements", icon: Megaphone }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                    activeTab === tab.id 
                                    ? "bg-[#10b981] text-[#07090e] shadow-lg shadow-emerald-500/20" 
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* ADMIN ACTIONS ZONE */}
            {data?.role === 'admin' && (
                <div className="max-w-7xl mx-auto px-6 mt-6 relative z-10">
                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">Creator Admin Zone</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setShowAnnouncementModal(true)}
                                className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold"
                            >
                                <Plus className="w-3.5 h-3.5" /> Announcement
                            </button>
                            <button 
                                onClick={() => setShowEventModal(true)}
                                className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold"
                            >
                                <Plus className="w-3.5 h-3.5" /> Event
                            </button>
                            <button 
                                onClick={() => setShowAssignmentModal(true)}
                                className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold"
                            >
                                <Plus className="w-3.5 h-3.5" /> Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB PANELS CONTAINER */}
            <main className="max-w-7xl mx-auto px-6 mt-8 relative z-10">
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left & Middle Column */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Daily Vocab Term / Spark */}
                            {data?.glossaryTerm && (
                                <div className="relative rounded-3xl p-6 overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-[#07090e] shadow-2xl">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none" />
                                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                                        <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                                        Daily Vocabulary Spark
                                    </div>
                                    <h3 className="text-2xl font-black mt-3 text-white">{data.glossaryTerm.term}</h3>
                                    <p className="text-slate-300 text-sm mt-2 leading-relaxed max-w-3xl">
                                        {data.glossaryTerm.shortDefinition}
                                    </p>
                                    
                                    {data.glossaryTerm.howItMakesMoney && (
                                        <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-400">
                                            <span className="font-bold text-white uppercase tracking-wider block mb-1">💸 Monetization Perspective:</span>
                                            {data.glossaryTerm.howItMakesMoney}
                                        </div>
                                    )}

                                    <div className="mt-5 flex items-center justify-between">
                                        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                            {data.glossaryTerm.category}
                                        </span>
                                        <Link href={`/glossary/${data.glossaryTerm.slug}`} className="flex items-center gap-1 text-xs text-emerald-400 font-bold hover:underline">
                                            Explore Term Guide <ArrowUpRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Announcements Widget */}
                            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-extrabold flex items-center gap-2 text-white">
                                        <Megaphone className="w-5 h-5 text-[#10b981]" />
                                        Daily Notices & Announcements
                                    </h2>
                                    <button onClick={() => setActiveTab("announcements")} className="text-xs text-slate-400 hover:text-white font-bold flex items-center gap-0.5">
                                        All Announcements <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>

                                {data?.announcements?.filter((a: any) => !a.isRead).length === 0 ? (
                                    <div className="text-center py-8 text-slate-500 text-xs">
                                        No unread announcements for today. You are fully caught up!
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {data?.announcements?.filter((a: any) => !a.isRead).slice(0, 3).map((ann: any) => (
                                            <div 
                                                key={ann._id}
                                                className={`p-4 rounded-2xl border transition-all ${
                                                    ann.color === 'green' 
                                                    ? 'bg-emerald-500/5 border-emerald-500/10' 
                                                    : ann.color === 'yellow'
                                                    ? 'bg-amber-500/5 border-amber-500/10'
                                                    : 'bg-slate-900/60 border-slate-800'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${
                                                            ann.color === 'green' ? 'bg-emerald-500' : 'bg-amber-500'
                                                        }`} />
                                                        <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 font-medium">
                                                        {new Date(ann.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                                                    {ann.content}
                                                </p>
                                                <div className="mt-3 flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleMarkAnnouncementRead(ann._id)}
                                                        className="text-[10px] text-[#10b981] bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg font-bold transition-all"
                                                    >
                                                        Mark Read
                                                    </button>
                                                    <button 
                                                        onClick={() => handleArchiveAnnouncement(ann._id)}
                                                        className="text-[10px] text-slate-400 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg font-bold transition-all"
                                                    >
                                                        Archive
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Featured Courses Widget */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                        <Award className="w-5 h-5 text-indigo-400" />
                                        Recommended Curriculums
                                    </h2>
                                    <button onClick={() => setActiveTab("courses")} className="text-xs text-slate-400 hover:text-white font-bold flex items-center gap-0.5">
                                        View All Courses <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {data?.topCourses?.slice(0, 4).map((course: any) => (
                                        <div key={course._id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
                                            <div>
                                                <div className="w-full h-32 rounded-xl bg-slate-950 overflow-hidden relative border border-slate-800">
                                                    {course.thumbnail ? (
                                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900 font-bold">
                                                            KBA Course
                                                        </div>
                                                    )}
                                                    {course.progress > 0 && (
                                                        <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md rounded-lg p-1.5 text-[10px]">
                                                            <div className="flex justify-between font-bold text-white mb-0.5">
                                                                <span>Progress</span>
                                                                <span>{Math.round(course.progress)}%</span>
                                                            </div>
                                                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                                <div className="bg-[#10b981] h-full" style={{ width: `${course.progress}%` }}></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <h4 className="text-sm font-bold text-white mt-3 line-clamp-1">{course.title}</h4>
                                                <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">{course.description}</p>
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                                    {course.modulesCount} modules
                                                </span>
                                                <Link 
                                                    href={`/catalog/${course._id}`}
                                                    className="flex items-center gap-1 bg-[#10b981]/15 text-[#34d399] px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-[#10b981]/25 transition-all"
                                                >
                                                    Enter Course <ChevronRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Events & Assignment */}
                        <div className="space-y-8">
                            
                            {/* Current Assignment Card */}
                            <div className="bg-gradient-to-br from-indigo-950/20 to-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-[30px] pointer-events-none" />
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <FileText className="w-4 h-4 text-indigo-400" />
                                        Active Assignment
                                    </h3>
                                    {data?.role === 'admin' && data?.assignments && data.assignments.length > 0 && (
                                        <div className="flex items-center gap-1.5 relative z-10">
                                            <button 
                                                onClick={() => {
                                                    const latestAsg = data.assignments[0];
                                                    setEditAsgId(latestAsg._id);
                                                    setEditAsgTitle(latestAsg.title);
                                                    setEditAsgDesc(latestAsg.description);
                                                    const d = new Date(latestAsg.dueDate);
                                                    const formattedDate = d.toISOString().split('T')[0];
                                                    setEditAsgDueDate(formattedDate);
                                                    setEditAsgPoints(latestAsg.points || 100);
                                                    setEditAsgInstructions(latestAsg.instructions || "");
                                                    setEditAsgAttachments(latestAsg.attachments || []);
                                                    setEditAsgAttachmentName("");
                                                    setEditAsgAttachmentUrl("");
                                                    setShowEditAsgModal(true);
                                                }}
                                                className="text-slate-400 hover:text-white p-1"
                                                title="Edit Assignment"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteAssignment(data.assignments[0]._id)}
                                                className="text-slate-405 hover:text-rose-400 p-1"
                                                title="Delete Assignment"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {data?.assignments && data.assignments.length > 0 ? (
                                    (() => {
                                        const latestAsg = data.assignments[0];
                                        return (
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <h4 className="text-base font-bold text-white">{latestAsg.title}</h4>
                                                    <p className="text-slate-400 text-xs mt-1 line-clamp-3 leading-relaxed">
                                                        {latestAsg.description}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-4 text-xs">
                                                    <div className="flex items-center gap-1 text-slate-500">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>Due {new Date(latestAsg.dueDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="font-extrabold text-[#10b981]">
                                                        {latestAsg.points} Points
                                                    </div>
                                                </div>

                                                {latestAsg.attachments && latestAsg.attachments.length > 0 && (
                                                    <div className="space-y-1.5">
                                                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Reference Links & Attachments:</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {latestAsg.attachments.map((att: any, idx: number) => (
                                                                <a 
                                                                    key={idx} 
                                                                    href={att.url} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-bold border border-indigo-500/15 flex items-center gap-1 transition-all"
                                                                >
                                                                    <Paperclip className="w-3.5 h-3.5 mr-1" />
                                                                    {att.name}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {latestAsg.submission ? (
                                                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
                                                        <div className="flex items-center justify-between text-slate-400">
                                                            <span>Submission Status:</span>
                                                            <span className={`px-2 py-0.5 rounded font-extrabold uppercase text-[9px] ${
                                                                latestAsg.submission.status === 'approved' 
                                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                : latestAsg.submission.status === 'rejected'
                                                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                            }`}>
                                                                {latestAsg.submission.status}
                                                            </span>
                                                        </div>
                                                        {latestAsg.submission.grade && (
                                                            <div className="mt-2 text-slate-300">
                                                                <span className="font-bold text-white">Grade/Feedback:</span> {latestAsg.submission.grade}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => setActiveTab("assignments")}
                                                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all text-center block shadow-lg shadow-indigo-500/15"
                                                    >
                                                        Submit Work & Earn Points
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <div className="text-center py-6 text-slate-500 text-xs">
                                        No active assignments found. Check back soon!
                                    </div>
                                )}
                            </div>

                            {/* Upcoming Events Calendar Widget */}
                            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6">
                                <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                                    <Calendar className="w-4 h-4 text-[#10b981]" />
                                    Upcoming Events
                                </h3>

                                {data?.events?.length === 0 ? (
                                    <div className="text-center py-6 text-slate-500 text-xs">
                                        No upcoming calendar events schedules.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {data?.events?.slice(0, 4).map((evt: any) => (
                                            <div key={evt._id} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 hover:border-slate-800 transition-all flex items-start gap-3">
                                                <div className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-center font-bold text-xs uppercase tracking-wider shrink-0 min-w-[50px]">
                                                    <span className="block text-[8px] font-medium text-emerald-500">
                                                        {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                                                    </span>
                                                    {new Date(evt.date).getDate()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs font-bold text-white line-clamp-1">{evt.title}</h4>
                                                    <p className="text-slate-400 text-[10px] line-clamp-1 mt-0.5">{evt.description}</p>
                                                    <div className="flex items-center justify-between gap-2 mt-2">
                                                        {evt.location && (
                                                            <span className="text-[9px] text-slate-500 truncate">📍 {evt.location}</span>
                                                        )}
                                                        <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-extrabold uppercase">
                                                            {evt.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                {data?.role === 'admin' && (
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <button 
                                                            onClick={() => {
                                                                setEditEventId(evt._id);
                                                                setEditEventTitle(evt.title);
                                                                setEditEventDesc(evt.description);
                                                                const d = new Date(evt.date);
                                                                const formattedDate = d.toISOString().split('T')[0];
                                                                setEditEventDate(formattedDate);
                                                                setEditEventLoc(evt.location || "");
                                                                setEditEventType(evt.type || "general");
                                                                setShowEditEventModal(true);
                                                            }}
                                                            className="text-slate-500 hover:text-white p-1"
                                                            title="Edit Event"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteEvent(evt._id)}
                                                            className="text-slate-500 hover:text-rose-400 p-1"
                                                            title="Delete Event"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. MESSAGES TAB (Private Message Center) */}
                {activeTab === "messages" && (
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[550px] relative z-10">
                        
                        {/* Conversations Left Panel */}
                        <div className="border-r border-slate-800/80 flex flex-col justify-between bg-[#080a0f]">
                            <div>
                                <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-[#10b981]" />
                                        Conversations
                                    </h3>
                                    <button 
                                        onClick={() => setShowNewChatModal(true)}
                                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-[#10b981] hover:text-black transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="divide-y divide-slate-800/40 max-h-[480px] overflow-y-auto">
                                    {data?.conversations?.length === 0 ? (
                                        <div className="text-center py-10 text-slate-500 text-xs">
                                            No active messages. Click "+" to start a new chat.
                                        </div>
                                    ) : (
                                        data.conversations.map((conv: any) => {
                                            const isActive = conv._id === activeConvId;
                                            return (
                                                <button
                                                    key={conv._id}
                                                    onClick={() => setActiveConvId(conv._id)}
                                                    className={`w-full p-4 text-left flex items-start gap-3 transition-all ${
                                                        isActive ? 'bg-slate-800/30' : 'hover:bg-slate-900/50'
                                                    }`}
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                                                        {conv.otherParticipant?.avatar ? (
                                                            <img src={conv.otherParticipant.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                        ) : (
                                                            conv.otherParticipant?.name?.charAt(0) || "U"
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="text-xs font-bold text-white truncate">
                                                                {conv.otherParticipant?.name || "Group Message"}
                                                            </span>
                                                            <span className="text-[8px] text-slate-500 shrink-0">
                                                                {new Date(conv.lastMessageAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                                                                conv.otherParticipant?.role === 'admin'
                                                                ? 'bg-amber-500/10 text-amber-400'
                                                                : 'bg-indigo-500/10 text-indigo-400'
                                                            }`}>
                                                                {conv.otherParticipant?.role || "student"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Message History Right Panel */}
                        <div className="md:col-span-2 flex flex-col justify-between bg-slate-950/20">
                            {activeConversation ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300 overflow-hidden">
                                                {activeConversation.otherParticipant?.avatar ? (
                                                    <img src={activeConversation.otherParticipant.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    activeConversation.otherParticipant?.name?.charAt(0) || "U"
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white">
                                                    {activeConversation.otherParticipant?.name || "Chat Room"}
                                                </h4>
                                                <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase mt-1 inline-block">
                                                    {activeConversation.otherParticipant?.role || "student"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button 
                                                onClick={() => handleArchiveConversation(activeConversation._id)}
                                                className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800/80 rounded-lg text-xs"
                                                title="Archive conversation"
                                            >
                                                <Archive className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Messages View */}
                                    <div className="flex-1 p-6 space-y-4 max-h-[380px] overflow-y-auto">
                                        {activeConversation.messages?.map((msg: any) => {
                                            const isMe = msg.sender.clerkId === initialData?.conversations?.[0]?.otherParticipant?.clerkId ? false : true;
                                            return (
                                                <div 
                                                    key={msg._id}
                                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                                                        isMe 
                                                        ? 'bg-indigo-600 text-white rounded-br-none' 
                                                        : 'bg-slate-900 border border-slate-800/80 text-slate-300 rounded-bl-none'
                                                    }`}>
                                                        <p>{msg.content}</p>
                                                        <span className="block text-[8px] opacity-60 mt-1.5 text-right">
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Message Input Reply Box */}
                                    <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                placeholder="Write your message..."
                                                className="flex-1 bg-slate-900 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSendReply();
                                                }}
                                            />
                                            <button 
                                                onClick={handleSendReply}
                                                className="px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#34d399] text-[#07090e] font-extrabold text-xs flex items-center gap-1.5 transition-all"
                                            >
                                                <Send className="w-3.5 h-3.5" />
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-6 text-slate-500 text-xs">
                                    <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
                                    Select or create a conversation message thread.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. ASSIGNMENTS TAB */}
                {activeTab === "assignments" && (
                    <div className="space-y-8 relative z-10">
                        {/* Display Assignments Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            
                            {/* Submission List (Left 2 cols) */}
                            <div className="md:col-span-2 space-y-6">
                                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-400" />
                                    Active Assignments List
                                </h3>

                                {data?.assignments?.length === 0 ? (
                                    <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl text-center text-slate-500 text-xs">
                                        No homework assignments published.
                                    </div>
                                ) : (
                                    data.assignments.map((asg: any) => (
                                        <div key={asg._id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h4 className="text-base font-bold text-white">{asg.title}</h4>
                                                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                                        <span>Due: {new Date(asg.dueDate).toLocaleDateString()}</span>
                                                        <span className="font-bold text-[#10b981]">{asg.points} Points</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2.5 py-0.5 rounded font-extrabold uppercase text-[9px] ${
                                                        asg.submission?.status === 'approved' 
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : asg.submission?.status === 'rejected'
                                                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                        : asg.submission?.status === 'pending'
                                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                        : 'bg-slate-800 text-slate-400'
                                                    }`}>
                                                        {asg.submission ? asg.submission.status : "not submitted"}
                                                    </span>
                                                    {data?.role === 'admin' && (
                                                        <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
                                                            <button 
                                                                onClick={() => {
                                                                    setEditAsgId(asg._id);
                                                                    setEditAsgTitle(asg.title);
                                                                    setEditAsgDesc(asg.description);
                                                                    const d = new Date(asg.dueDate);
                                                                    const formattedDate = d.toISOString().split('T')[0];
                                                                    setEditAsgDueDate(formattedDate);
                                                                    setEditAsgPoints(asg.points || 100);
                                                                    setEditAsgInstructions(asg.instructions || "");
                                                                    setEditAsgAttachments(asg.attachments || []);
                                                                    setEditAsgAttachmentName("");
                                                                    setEditAsgAttachmentUrl("");
                                                                    setShowEditAsgModal(true);
                                                                }}
                                                                className="text-slate-400 hover:text-white p-1"
                                                                title="Edit Assignment"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteAssignment(asg._id)}
                                                                className="text-slate-400 hover:text-rose-400 p-1"
                                                                title="Delete Assignment"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs text-slate-300 leading-relaxed">
                                                <span className="font-bold text-white block mb-1">Description:</span>
                                                {asg.description}
                                            </div>

                                            {asg.instructions && (
                                                <div className="text-xs text-slate-400 leading-relaxed">
                                                    <span className="font-bold text-white block mb-0.5">Instructions:</span>
                                                    {asg.instructions}
                                                </div>
                                            )}

                                            {asg.attachments && asg.attachments.length > 0 && (
                                                <div className="space-y-1.5">
                                                    <span className="font-bold text-white text-xs block">Reference Links & Attachments:</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {asg.attachments.map((att: any, idx: number) => (
                                                            <a 
                                                                key={idx} 
                                                                href={att.url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-bold border border-indigo-500/15 flex items-center gap-1.5 transition-all"
                                                            >
                                                                <Paperclip className="w-3.5 h-3.5" />
                                                                {att.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Submissions Section */}
                                            {asg.submission ? (
                                                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-bold text-white">Your Submission:</span>
                                                        <span className="text-[10px] text-slate-500">
                                                            Submitted {new Date(asg.submission.submittedAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-300 text-xs italic bg-slate-900 p-2.5 rounded-lg border border-white/5">
                                                        "{asg.submission.content}"
                                                    </p>
                                                    {asg.submission.grade && (
                                                        <div className="text-xs p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 font-medium">
                                                            <span className="font-extrabold uppercase text-[10px] tracking-wider block mb-0.5">Review Feedback:</span>
                                                            {asg.submission.grade}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-white block">Submit your Work:</label>
                                                    <textarea 
                                                        rows={3}
                                                        value={assignmentContent}
                                                        onChange={(e) => setAssignmentContent(e.target.value)}
                                                        placeholder="Paste your completed URL, screenshot link, or solution content here to prove execution..."
                                                        className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                                                    />
                                                    <div className="flex justify-end">
                                                        <button 
                                                            onClick={() => handleAssignmentSubmit(asg._id)}
                                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all"
                                                        >
                                                            Submit Work
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Admin Grading Dashboard (Right 1 col) */}
                            <div className="space-y-6">
                                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                                    <BookOpenCheck className="w-5 h-5 text-amber-400" />
                                    Submissions Review
                                </h3>

                                {data?.role !== 'admin' ? (
                                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 text-center text-slate-500 text-xs">
                                        Submissions review dashboard is only visible to creator administrators.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Find all assignments with pending submissions */}
                                        {data.assignments?.every((a: any) => !a.submissions || a.submissions.length === 0) ? (
                                            <div className="text-center py-6 text-slate-500 text-xs">
                                                No submissions received yet.
                                            </div>
                                        ) : (
                                            data.assignments.map((asg: any) => 
                                                asg.submissions?.map((sub: any) => (
                                                    <div key={sub._id || sub.userId} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <div>
                                                                <h4 className="text-xs font-extrabold text-white truncate max-w-[120px]">{asg.title}</h4>
                                                                <span className="text-[10px] text-slate-400 block truncate">User: {sub.userId}</span>
                                                            </div>
                                                            <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase">
                                                                {sub.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-300 text-[11px] bg-slate-950 p-2 rounded border border-white/5 break-all">
                                                            {sub.content}
                                                        </p>

                                                        {/* Grade Input Form */}
                                                        <div className="space-y-2 pt-2 border-t border-slate-800">
                                                            <input 
                                                                type="text" 
                                                                placeholder="Grade Feedback (e.g. Approved. Added 100pts!)"
                                                                value={gradingFeedback}
                                                                onChange={(e) => setGradingFeedback(e.target.value)}
                                                                className="w-full bg-slate-950 border border-slate-800 text-[10px] rounded p-1.5 text-white"
                                                            />
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={() => {
                                                                        setGradingStatus('approved');
                                                                        handleGradeSubmission(asg._id, sub.userId);
                                                                    }}
                                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] py-1 rounded"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button 
                                                                    onClick={() => {
                                                                        setGradingStatus('rejected');
                                                                        handleGradeSubmission(asg._id, sub.userId);
                                                                    }}
                                                                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[9px] py-1 rounded"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. COURSES TAB */}
                {activeTab === "courses" && (
                    <div className="space-y-8 relative z-10">
                        {/* Course search banner */}
                        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Interactive Courses Catalog</h3>
                                <p className="text-slate-400 text-xs mt-0.5">Enroll, learn frameworks, build monetization tools, and verify completions.</p>
                            </div>
                            <Link href="/catalog" className="flex items-center gap-1.5 bg-[#10b981] hover:bg-[#34d399] text-[#07090e] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/10">
                                Browse Main Catalog <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Top 5 courses Grid */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Active Curriculums (Top 5)</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {data?.topCourses?.map((course: any) => (
                                    <div key={course._id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
                                        <div className="w-full h-24 rounded-lg bg-slate-950 overflow-hidden relative border border-slate-850">
                                            {course.thumbnail && (
                                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <h4 className="text-xs font-bold text-white mt-2.5 line-clamp-1">{course.title}</h4>
                                        <div className="w-full bg-slate-800 h-1 mt-2.5 rounded-full overflow-hidden">
                                            <div className="bg-[#10b981] h-full" style={{ width: `${course.progress}%` }}></div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-[9px] text-[#34d399] font-bold">{Math.round(course.progress)}% done</span>
                                            <Link href={`/catalog/${course._id}`} className="text-[10px] text-indigo-400 font-extrabold hover:underline">
                                                Resume
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Newest 5 courses Grid */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">New Additions (Newest 5)</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {data?.newestCourses?.map((course: any) => (
                                    <div key={course._id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
                                        <div className="w-full h-24 rounded-lg bg-slate-950 overflow-hidden relative border border-slate-850">
                                            {course.thumbnail && (
                                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <h4 className="text-xs font-bold text-white mt-2.5 line-clamp-1">{course.title}</h4>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-[9px] text-slate-500 uppercase font-bold">{course.modulesCount} Modules</span>
                                            <Link href={`/catalog/${course._id}`} className="text-[10px] bg-[#10b981]/15 text-[#34d399] px-2 py-0.5 rounded font-extrabold hover:bg-[#10b981]/25 transition-all">
                                                Start
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. ANNOUNCEMENTS TAB */}
                {activeTab === "announcements" && (
                    <div className="space-y-6 relative z-10 max-w-4xl mx-auto">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                                <Megaphone className="w-5 h-5 text-[#10b981]" />
                                Master Announcements Bulletin
                            </h3>
                        </div>

                        {data?.announcements?.length === 0 ? (
                            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 text-center text-slate-500 text-xs">
                                No system notifications posted.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data.announcements.map((ann: any) => (
                                    <div 
                                        key={ann._id}
                                        className={`p-5 rounded-2xl border transition-all ${
                                            ann.isRead 
                                            ? 'bg-slate-950/20 border-slate-800/60 opacity-70' 
                                            : ann.color === 'green'
                                            ? 'bg-emerald-500/5 border-emerald-500/10'
                                            : 'bg-amber-500/5 border-amber-500/10'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2.5 h-2.5 rounded-full ${
                                                    ann.isRead 
                                                    ? 'bg-slate-700' 
                                                    : ann.color === 'green'
                                                    ? 'bg-[#10b981]'
                                                    : 'bg-amber-500'
                                                }`} />
                                                <h4 className="text-sm font-extrabold text-white">{ann.title}</h4>
                                            </div>

                                            <div className="flex items-center gap-2.5">
                                                <span className="text-[10px] text-slate-500 font-bold">
                                                    {new Date(ann.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                                                    ann.isRead 
                                                    ? 'bg-slate-800 text-slate-400' 
                                                    : 'bg-emerald-500/10 text-emerald-400'
                                                }`}>
                                                    {ann.isRead ? "read" : "new"}
                                                </span>
                                                {data?.role === 'admin' && (
                                                    <div className="flex items-center gap-1.5 ml-2 border-l border-slate-850 pl-3">
                                                        <button 
                                                            onClick={() => {
                                                                setEditAnnId(ann._id);
                                                                setEditAnnTitle(ann.title);
                                                                setEditAnnContent(ann.content);
                                                                setShowEditAnnModal(true);
                                                            }}
                                                            className="text-slate-400 hover:text-white p-1"
                                                            title="Edit Announcement"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteAnnouncement(ann._id)}
                                                            className="text-slate-400 hover:text-rose-400 p-1"
                                                            title="Delete Announcement"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-slate-300 text-xs mt-3 leading-relaxed">
                                            {ann.content}
                                        </p>

                                        {!ann.isRead && (
                                            <div className="mt-4 flex justify-end">
                                                <button 
                                                    onClick={() => handleMarkAnnouncementRead(ann._id)}
                                                    className="text-xs text-[#10b981] hover:underline font-bold"
                                                >
                                                    Mark as Read & Archive
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* --- MODALS ZONE --- */}

            {/* 1. New Chat Message Thread Modal */}
            {showNewChatModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0f131a] border border-slate-800/80 rounded-3xl w-full max-w-md p-6 relative">
                        <button onClick={() => setShowNewChatModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-base font-extrabold text-white mb-4">Start Private Chat</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Select Contact:</label>
                                <select 
                                    value={selectedRecipientId}
                                    onChange={(e) => setSelectedRecipientId(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                                >
                                    {usersList.map((user) => (
                                        <option key={user.clerkId} value={user.clerkId}>
                                            {user.name} ({user.role})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Your Message:</label>
                                <textarea 
                                    rows={3}
                                    value={newChatContent}
                                    onChange={(e) => setNewChatContent(e.target.value)}
                                    placeholder="Type your greeting message..."
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                                />
                            </div>

                            <button 
                                onClick={handleStartNewChat}
                                className="w-full py-2.5 bg-[#10b981] hover:bg-[#34d399] text-[#07090e] font-extrabold text-xs rounded-xl transition-all"
                            >
                                Start Chat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Admin Create Announcement Modal */}
            {showAnnouncementModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <form onSubmit={handleCreateAnnouncement} className="bg-[#0f131a] border border-slate-800/80 rounded-3xl w-full max-w-md p-6 relative space-y-4">
                        <button type="button" onClick={() => setShowAnnouncementModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-base font-extrabold text-white">Create Announcement</h3>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Title:</label>
                            <input 
                                type="text"
                                required
                                value={newAnnTitle}
                                onChange={(e) => setNewAnnTitle(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Announcement Body:</label>
                            <textarea 
                                rows={4}
                                required
                                value={newAnnContent}
                                onChange={(e) => setNewAnnContent(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                            />
                        </div>

                        <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all">
                            Publish Announcement
                        </button>
                    </form>
                </div>
            )}

            {/* 3. Admin Create Event Modal */}
            {showEventModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <form onSubmit={handleCreateEvent} className="bg-[#0f131a] border border-slate-800/80 rounded-3xl w-full max-w-md p-6 relative space-y-4">
                        <button type="button" onClick={() => setShowEventModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-base font-extrabold text-white">Create Calendar Event</h3>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Title:</label>
                            <input 
                                type="text"
                                required
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Description:</label>
                            <input 
                                type="text"
                                value={newEventDesc}
                                onChange={(e) => setNewEventDesc(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Date & Time:</label>
                                <input 
                                    type="datetime-local"
                                    required
                                    value={newEventDate}
                                    onChange={(e) => setNewEventDate(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Location:</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Zoom Link or Discord"
                                    value={newEventLoc}
                                    onChange={(e) => setNewEventLoc(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Event Type:</label>
                            <select 
                                value={newEventType}
                                onChange={(e) => setNewEventType(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                            >
                                <option value="general">General Meeting</option>
                                <option value="live">Live Streaming Session</option>
                                <option value="workshop">Interactive Workshop</option>
                                <option value="assignment">Homework Assignment</option>
                            </select>
                        </div>

                        <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all">
                            Publish Event
                        </button>
                    </form>
                </div>
            )}

            {/* 4. Admin Create Assignment Modal */}
            {showAssignmentModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <form onSubmit={handleCreateAssignment} className="bg-[#0f131a] border border-slate-800/80 rounded-3xl w-full max-w-md p-6 relative space-y-4">
                        <button type="button" onClick={() => setShowAssignmentModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-base font-extrabold text-white">Create Assignment</h3>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Title:</label>
                            <input 
                                type="text"
                                required
                                value={newAsgTitle}
                                onChange={(e) => setNewAsgTitle(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Description:</label>
                            <textarea 
                                rows={3}
                                required
                                value={newAsgDesc}
                                onChange={(e) => setNewAsgDesc(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Due Date:</label>
                                <input 
                                    type="date"
                                    required
                                    value={newAsgDueDate}
                                    onChange={(e) => setNewAsgDueDate(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Max Points:</label>
                                <input 
                                    type="number"
                                    required
                                    value={newAsgPoints}
                                    onChange={(e) => setNewAsgPoints(Number(e.target.value))}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Instructions:</label>
                            <input 
                                type="text"
                                placeholder="e.g. Submit your URL link"
                                value={newAsgInstructions}
                                onChange={(e) => setNewAsgInstructions(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                            />
                        </div>

                        {/* Attachments Section */}
                        <div className="space-y-2 border-t border-slate-800/80 pt-3">
                            <label className="text-xs font-bold text-slate-400 block">Attachments & Resources:</label>
                            
                            {newAsgAttachments.length > 0 && (
                                <div className="space-y-1.5 mb-2">
                                    {newAsgAttachments.map((att, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <span className="text-slate-300 font-bold block truncate">{att.name}</span>
                                                <span className="text-[10px] text-slate-500 block truncate">{att.url}</span>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setNewAsgAttachments(prev => prev.filter((_, i) => i !== idx))}
                                                className="text-rose-400 hover:text-rose-300 font-extrabold text-[10px] shrink-0"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Link Name (e.g. Google Doc)" 
                                    value={newAsgAttachmentName}
                                    onChange={(e) => setNewAsgAttachmentName(e.target.value)}
                                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-[10px] text-white focus:outline-none"
                                />
                                <input 
                                    type="text" 
                                    placeholder="URL (https://...)" 
                                    value={newAsgAttachmentUrl}
                                    onChange={(e) => setNewAsgAttachmentUrl(e.target.value)}
                                    className="flex-[1.5] bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-[10px] text-white focus:outline-none"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        if (newAsgAttachmentName.trim() && newAsgAttachmentUrl.trim()) {
                                            setNewAsgAttachments(prev => [...prev, { name: newAsgAttachmentName.trim(), url: newAsgAttachmentUrl.trim() }]);
                                            setNewAsgAttachmentName("");
                                            setNewAsgAttachmentUrl("");
                                        }
                                    }}
                                    className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-xl shrink-0"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all">
                            Publish Assignment
                        </button>
                    </form>
                </div>
            )}

            {/* 5. Admin Edit Announcement Modal */}
            {showEditAnnModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <form onSubmit={handleUpdateAnnouncement} className="bg-[#0f131a] border border-slate-800/80 rounded-3xl w-full max-w-md p-6 relative space-y-4">
                        <button type="button" onClick={() => setShowEditAnnModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-base font-extrabold text-white">Edit Announcement</h3>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Announcement Title:</label>
                            <input 
                                type="text"
                                required
                                value={editAnnTitle}
                                onChange={(e) => setEditAnnTitle(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Announcement Body:</label>
                            <textarea 
                                rows={4}
                                required
                                value={editAnnContent}
                                onChange={(e) => setEditAnnContent(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                            />
                        </div>

                        <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all">
                            Save Changes
                        </button>
                    </form>
                </div>
            )}

            {/* 6. Admin Edit Event Modal */}
            {showEditEventModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <form onSubmit={handleUpdateEvent} className="bg-[#0f131a] border border-slate-800/80 rounded-3xl w-full max-w-md p-6 relative space-y-4">
                        <button type="button" onClick={() => setShowEditEventModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-base font-extrabold text-white">Edit Calendar Event</h3>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Title:</label>
                            <input 
                                type="text"
                                required
                                value={editEventTitle}
                                onChange={(e) => setEditEventTitle(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Description:</label>
                            <input 
                                type="text"
                                required
                                value={editEventDesc}
                                onChange={(e) => setEditEventDesc(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Date & Time:</label>
                                <input 
                                    type="datetime-local"
                                    required
                                    value={editEventDate}
                                    onChange={(e) => setEditEventDate(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Location:</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Zoom Link or Discord"
                                    value={editEventLoc}
                                    onChange={(e) => setEditEventLoc(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Event Type:</label>
                            <select 
                                value={editEventType}
                                onChange={(e) => setEditEventType(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                            >
                                <option value="general">General Meeting</option>
                                <option value="live">Live Streaming Session</option>
                                <option value="workshop">Interactive Workshop</option>
                                <option value="assignment">Homework Assignment</option>
                            </select>
                        </div>

                        <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all">
                            Save Changes
                        </button>
                    </form>
                </div>
            )}

            {/* 7. Admin Edit Assignment Modal */}
            {showEditAsgModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <form onSubmit={handleUpdateAssignment} className="bg-[#0f131a] border border-slate-800/80 rounded-3xl w-full max-w-md p-6 relative space-y-4">
                        <button type="button" onClick={() => setShowEditAsgModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-base font-extrabold text-white">Edit Assignment</h3>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Title:</label>
                            <input 
                                type="text"
                                required
                                value={editAsgTitle}
                                onChange={(e) => setEditAsgTitle(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Description:</label>
                            <textarea 
                                rows={3}
                                required
                                value={editAsgDesc}
                                onChange={(e) => setEditAsgDesc(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Due Date:</label>
                                <input 
                                    type="date"
                                    required
                                    value={editAsgDueDate}
                                    onChange={(e) => setEditAsgDueDate(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Max Points:</label>
                                <input 
                                    type="number"
                                    required
                                    value={editAsgPoints}
                                    onChange={(e) => setEditAsgPoints(Number(e.target.value))}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Instructions:</label>
                            <input 
                                type="text"
                                placeholder="e.g. Submit your URL link"
                                value={editAsgInstructions}
                                onChange={(e) => setEditAsgInstructions(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                            />
                        </div>

                        {/* Attachments Section */}
                        <div className="space-y-2 border-t border-slate-800/80 pt-3">
                            <label className="text-xs font-bold text-slate-400 block">Attachments & Resources:</label>
                            
                            {editAsgAttachments.length > 0 && (
                                <div className="space-y-1.5 mb-2">
                                    {editAsgAttachments.map((att, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <span className="text-slate-300 font-bold block truncate">{att.name}</span>
                                                <span className="text-[10px] text-slate-500 block truncate">{att.url}</span>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setEditAsgAttachments(prev => prev.filter((_, i) => i !== idx))}
                                                className="text-rose-400 hover:text-rose-300 font-extrabold text-[10px] shrink-0"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Link Name (e.g. Google Doc)" 
                                    value={editAsgAttachmentName}
                                    onChange={(e) => setEditAsgAttachmentName(e.target.value)}
                                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-[10px] text-white focus:outline-none"
                                />
                                <input 
                                    type="text" 
                                    placeholder="URL (https://...)" 
                                    value={editAsgAttachmentUrl}
                                    onChange={(e) => setEditAsgAttachmentUrl(e.target.value)}
                                    className="flex-[1.5] bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-[10px] text-white focus:outline-none"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        if (editAsgAttachmentName.trim() && editAsgAttachmentUrl.trim()) {
                                            setEditAsgAttachments(prev => [...prev, { name: editAsgAttachmentName.trim(), url: editAsgAttachmentUrl.trim() }]);
                                            setEditAsgAttachmentName("");
                                            setEditAsgAttachmentUrl("");
                                        }
                                    }}
                                    className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-xl shrink-0"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-2.5 bg-[#10b981] hover:bg-[#34d399] text-[#07090e] font-bold text-xs rounded-xl transition-all">
                            Save Changes
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
