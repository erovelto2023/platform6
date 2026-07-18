"use client";

import React, { useState, useTransition } from "react";
import { Megaphone, Calendar, FileText, Plus, Pencil, Trash2, X, Paperclip, Clock, CheckCircle, AlertCircle } from "lucide-react";
import {
    createAnnouncement, updateAnnouncement, deleteAnnouncement,
    createCalendarEvent, updateCalendarEvent, deleteCalendarEvent,
    createAssignment, updateAssignment, deleteAssignment,
} from "@/lib/actions/dashboard.actions";

type Tab = "announcements" | "events" | "assignments";

const inputCls = "w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";
const labelCls = "text-xs font-bold text-slate-400 block mb-1.5";
const btnPrimary = "px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50";
const btnDanger = "p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all";
const btnEdit = "p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all";

function Modal({ title, onClose, onSubmit, isPending, children }: {
    title: string; onClose: () => void; onSubmit: (e: React.FormEvent) => void;
    isPending: boolean; children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={onSubmit} className="bg-[#0f131a] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 relative max-h-[90vh] overflow-y-auto">
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
                <h3 className="text-base font-bold text-white pr-8">{title}</h3>
                {children}
                <button type="submit" disabled={isPending} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all">
                    {isPending ? "Saving..." : "Save"}
                </button>
            </form>
        </div>
    );
}

function AttachmentsEditor({ attachments, setAttachments }: {
    attachments: { name: string; url: string }[];
    setAttachments: React.Dispatch<React.SetStateAction<{ name: string; url: string }[]>>;
}) {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    return (
        <div className="space-y-2">
            <label className={labelCls}>Attachments & Resource Links</label>
            {attachments.map((a, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs">
                    <div className="min-w-0 flex-1 pr-2">
                        <span className="text-white font-bold block truncate">{a.name}</span>
                        <span className="text-slate-500 block truncate">{a.url}</span>
                    </div>
                    <button type="button" onClick={() => setAttachments(p => p.filter((_, j) => j !== i))} className="text-rose-400 hover:text-rose-300 text-[10px] font-bold shrink-0">Remove</button>
                </div>
            ))}
            <div className="flex gap-2">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Link name" className="flex-1 bg-[#0d1117] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none" />
                <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className="flex-[1.5] bg-[#0d1117] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none" />
                <button type="button" onClick={() => { if (name.trim() && url.trim()) { setAttachments(p => [...p, { name: name.trim(), url: url.trim() }]); setName(""); setUrl(""); } }} className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shrink-0">Add</button>
            </div>
        </div>
    );
}

export default function AdminContentManager({ initialData }: {
    initialData: { announcements: any[]; events: any[]; assignments: any[] };
}) {
    const [tab, setTab] = useState<Tab>("announcements");
    const [data, setData] = useState(initialData);
    const [isPending, startTransition] = useTransition();
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    // Announcement state
    const [showAnnModal, setShowAnnModal] = useState(false);
    const [editAnn, setEditAnn] = useState<any>(null);
    const [annTitle, setAnnTitle] = useState("");
    const [annContent, setAnnContent] = useState("");

    // Event state
    const [showEvtModal, setShowEvtModal] = useState(false);
    const [editEvt, setEditEvt] = useState<any>(null);
    const [evtTitle, setEvtTitle] = useState("");
    const [evtDesc, setEvtDesc] = useState("");
    const [evtDate, setEvtDate] = useState("");
    const [evtLoc, setEvtLoc] = useState("");
    const [evtType, setEvtType] = useState("general");

    // Assignment state
    const [showAsgModal, setShowAsgModal] = useState(false);
    const [editAsg, setEditAsg] = useState<any>(null);
    const [asgTitle, setAsgTitle] = useState("");
    const [asgDesc, setAsgDesc] = useState("");
    const [asgDue, setAsgDue] = useState("");
    const [asgPoints, setAsgPoints] = useState(100);
    const [asgInstr, setAsgInstr] = useState("");
    const [asgAttachments, setAsgAttachments] = useState<{ name: string; url: string }[]>([]);

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const refresh = async () => {
        const res = await fetch("/api/admin/content");
        if (res.ok) { const d = await res.json(); setData(d); }
    };

    // ── Announcement handlers ──────────────────────────────
    const openNewAnn = () => { setEditAnn(null); setAnnTitle(""); setAnnContent(""); setShowAnnModal(true); };
    const openEditAnn = (a: any) => { setEditAnn(a); setAnnTitle(a.title); setAnnContent(a.content); setShowAnnModal(true); };
    const handleAnn = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const res = editAnn
                ? await updateAnnouncement(editAnn._id, annTitle, annContent)
                : await createAnnouncement(annTitle, annContent);
            if (res.success) { showToast(editAnn ? "Announcement updated." : "Announcement created.", "success"); setShowAnnModal(false); await refresh(); }
            else showToast(res.error || "Failed.", "error");
        });
    };
    const handleDelAnn = (id: string) => {
        if (!confirm("Delete this announcement?")) return;
        startTransition(async () => {
            const res = await deleteAnnouncement(id);
            if (res.success) { showToast("Deleted.", "success"); await refresh(); }
            else showToast(res.error || "Failed.", "error");
        });
    };

    // ── Event handlers ────────────────────────────────────
    const openNewEvt = () => { setEditEvt(null); setEvtTitle(""); setEvtDesc(""); setEvtDate(""); setEvtLoc(""); setEvtType("general"); setShowEvtModal(true); };
    const openEditEvt = (e: any) => {
        setEditEvt(e);
        setEvtTitle(e.title); setEvtDesc(e.description);
        const d = new Date(e.date); setEvtDate(d.toISOString().slice(0, 16));
        setEvtLoc(e.location || ""); setEvtType(e.type || "general");
        setShowEvtModal(true);
    };
    const handleEvt = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const res = editEvt
                ? await updateCalendarEvent(editEvt._id, evtTitle, evtDesc, new Date(evtDate), evtLoc, evtType)
                : await createCalendarEvent(evtTitle, evtDesc, new Date(evtDate), evtLoc, evtType);
            if (res.success) { showToast(editEvt ? "Event updated." : "Event created.", "success"); setShowEvtModal(false); await refresh(); }
            else showToast(res.error || "Failed.", "error");
        });
    };
    const handleDelEvt = (id: string) => {
        if (!confirm("Delete this event?")) return;
        startTransition(async () => {
            const res = await deleteCalendarEvent(id);
            if (res.success) { showToast("Deleted.", "success"); await refresh(); }
            else showToast(res.error || "Failed.", "error");
        });
    };

    // ── Assignment handlers ───────────────────────────────
    const openNewAsg = () => { setEditAsg(null); setAsgTitle(""); setAsgDesc(""); setAsgDue(""); setAsgPoints(100); setAsgInstr(""); setAsgAttachments([]); setShowAsgModal(true); };
    const openEditAsg = (a: any) => {
        setEditAsg(a); setAsgTitle(a.title); setAsgDesc(a.description);
        setAsgDue(new Date(a.dueDate).toISOString().split("T")[0]);
        setAsgPoints(a.points || 100); setAsgInstr(a.instructions || "");
        setAsgAttachments(a.attachments || []);
        setShowAsgModal(true);
    };
    const handleAsg = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const res = editAsg
                ? await updateAssignment(editAsg._id, asgTitle, asgDesc, new Date(asgDue), asgPoints, asgInstr, asgAttachments)
                : await createAssignment(asgTitle, asgDesc, new Date(asgDue), asgPoints, asgInstr, asgAttachments);
            if (res.success) { showToast(editAsg ? "Assignment updated." : "Assignment created.", "success"); setShowAsgModal(false); await refresh(); }
            else showToast(res.error || "Failed.", "error");
        });
    };
    const handleDelAsg = (id: string) => {
        if (!confirm("Delete this assignment?")) return;
        startTransition(async () => {
            const res = await deleteAssignment(id);
            if (res.success) { showToast("Deleted.", "success"); await refresh(); }
            else showToast(res.error || "Failed.", "error");
        });
    };

    const tabs = [
        { id: "announcements" as Tab, label: "Announcements", icon: Megaphone, count: data.announcements.length, color: "emerald" },
        { id: "events" as Tab, label: "Events", icon: Calendar, count: data.events.length, color: "amber" },
        { id: "assignments" as Tab, label: "Assignments", icon: FileText, count: data.assignments.length, color: "indigo" },
    ];

    return (
        <div className="min-h-screen bg-[#07090e] -m-6 p-8 space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold border transition-all ${toast.type === "success" ? "bg-emerald-950 border-emerald-500/30 text-emerald-300" : "bg-rose-950 border-rose-500/30 text-rose-300"}`}>
                    {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white">Content Management</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage all announcements, calendar events, and assignments</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#0d1117] border border-slate-800/80 rounded-2xl w-fit">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t.id ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}>
                        <t.icon className="w-3.5 h-3.5" />
                        {t.label}
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${tab === t.id ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}`}>{t.count}</span>
                    </button>
                ))}
            </div>

            {/* ── ANNOUNCEMENTS ── */}
            {tab === "announcements" && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button onClick={openNewAnn} className={`${btnPrimary} flex items-center gap-2`}><Plus className="w-3.5 h-3.5" />New Announcement</button>
                    </div>
                    {data.announcements.length === 0 ? (
                        <div className="text-center py-16 text-slate-500 bg-[#0d1117] border border-slate-800 rounded-2xl">No announcements yet.</div>
                    ) : (
                        <div className="space-y-3">
                            {data.announcements.map((a: any) => (
                                <div key={a._id} className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-slate-700 transition-all">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                            <h4 className="text-sm font-bold text-white truncate">{a.title}</h4>
                                        </div>
                                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{a.content}</p>
                                        <span className="text-[10px] text-slate-600 font-bold mt-2 block">{new Date(a.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button onClick={() => openEditAnn(a)} className={btnEdit}><Pencil className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => handleDelAnn(a._id)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── EVENTS ── */}
            {tab === "events" && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button onClick={openNewEvt} className={`${btnPrimary} flex items-center gap-2`}><Plus className="w-3.5 h-3.5" />New Event</button>
                    </div>
                    {data.events.length === 0 ? (
                        <div className="text-center py-16 text-slate-500 bg-[#0d1117] border border-slate-800 rounded-2xl">No events yet.</div>
                    ) : (
                        <div className="space-y-3">
                            {data.events.map((e: any) => {
                                const d = new Date(e.date);
                                return (
                                    <div key={e._id} className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-slate-700 transition-all">
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-center min-w-[52px] shrink-0">
                                                <span className="text-[9px] text-amber-400 font-bold uppercase block">{d.toLocaleString("default", { month: "short" })}</span>
                                                <span className="text-lg font-black text-amber-300 leading-none">{d.getDate()}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-white">{e.title}</h4>
                                                <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{e.description}</p>
                                                <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-bold">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                                    {e.location && <span>📍 {e.location}</span>}
                                                    <span className="bg-slate-800 px-1.5 py-0.5 rounded uppercase">{e.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button onClick={() => openEditEvt(e)} className={btnEdit}><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelEvt(e._id)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ── ASSIGNMENTS ── */}
            {tab === "assignments" && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button onClick={openNewAsg} className={`${btnPrimary} flex items-center gap-2`}><Plus className="w-3.5 h-3.5" />New Assignment</button>
                    </div>
                    {data.assignments.length === 0 ? (
                        <div className="text-center py-16 text-slate-500 bg-[#0d1117] border border-slate-800 rounded-2xl">No assignments yet.</div>
                    ) : (
                        <div className="space-y-3">
                            {data.assignments.map((a: any) => (
                                <div key={a._id} className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-slate-700 transition-all">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="text-sm font-bold text-white">{a.title}</h4>
                                            <span className="text-[9px] bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-extrabold uppercase shrink-0">{a.points} pts</span>
                                        </div>
                                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{a.description}</p>
                                        <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500 font-bold">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Due {new Date(a.dueDate).toLocaleDateString()}</span>
                                            {a.attachments?.length > 0 && <span className="flex items-center gap-1"><Paperclip className="w-3 h-3" />{a.attachments.length} link{a.attachments.length !== 1 ? "s" : ""}</span>}
                                            <span>{a.submissions?.length || 0} submission{(a.submissions?.length || 0) !== 1 ? "s" : ""}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button onClick={() => openEditAsg(a)} className={btnEdit}><Pencil className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => handleDelAsg(a._id)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── ANNOUNCEMENT MODAL ── */}
            {showAnnModal && (
                <Modal title={editAnn ? "Edit Announcement" : "New Announcement"} onClose={() => setShowAnnModal(false)} onSubmit={handleAnn} isPending={isPending}>
                    <div><label className={labelCls}>Title</label><input required value={annTitle} onChange={e => setAnnTitle(e.target.value)} className={inputCls} placeholder="e.g. Important Update" /></div>
                    <div><label className={labelCls}>Body</label><textarea required rows={5} value={annContent} onChange={e => setAnnContent(e.target.value)} className={inputCls} placeholder="Write your announcement..." /></div>
                </Modal>
            )}

            {/* ── EVENT MODAL ── */}
            {showEvtModal && (
                <Modal title={editEvt ? "Edit Event" : "New Calendar Event"} onClose={() => setShowEvtModal(false)} onSubmit={handleEvt} isPending={isPending}>
                    <div><label className={labelCls}>Title</label><input required value={evtTitle} onChange={e => setEvtTitle(e.target.value)} className={inputCls} placeholder="Event title" /></div>
                    <div><label className={labelCls}>Description</label><input required value={evtDesc} onChange={e => setEvtDesc(e.target.value)} className={inputCls} placeholder="Brief description" /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelCls}>Date & Time</label><input required type="datetime-local" value={evtDate} onChange={e => setEvtDate(e.target.value)} className={inputCls} /></div>
                        <div><label className={labelCls}>Location</label><input value={evtLoc} onChange={e => setEvtLoc(e.target.value)} className={inputCls} placeholder="Zoom / Discord..." /></div>
                    </div>
                    <div>
                        <label className={labelCls}>Event Type</label>
                        <select value={evtType} onChange={e => setEvtType(e.target.value)} className={inputCls}>
                            <option value="general">General Meeting</option>
                            <option value="live">Live Streaming</option>
                            <option value="workshop">Workshop</option>
                            <option value="assignment">Assignment Deadline</option>
                        </select>
                    </div>
                </Modal>
            )}

            {/* ── ASSIGNMENT MODAL ── */}
            {showAsgModal && (
                <Modal title={editAsg ? "Edit Assignment" : "New Assignment"} onClose={() => setShowAsgModal(false)} onSubmit={handleAsg} isPending={isPending}>
                    <div><label className={labelCls}>Title</label><input required value={asgTitle} onChange={e => setAsgTitle(e.target.value)} className={inputCls} placeholder="Assignment title" /></div>
                    <div><label className={labelCls}>Description</label><textarea required rows={3} value={asgDesc} onChange={e => setAsgDesc(e.target.value)} className={inputCls} placeholder="What students need to do..." /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelCls}>Due Date</label><input required type="date" value={asgDue} onChange={e => setAsgDue(e.target.value)} className={inputCls} /></div>
                        <div><label className={labelCls}>Max Points</label><input required type="number" min={0} value={asgPoints} onChange={e => setAsgPoints(Number(e.target.value))} className={inputCls} /></div>
                    </div>
                    <div><label className={labelCls}>Instructions</label><input value={asgInstr} onChange={e => setAsgInstr(e.target.value)} className={inputCls} placeholder="e.g. Submit your URL" /></div>
                    <AttachmentsEditor attachments={asgAttachments} setAttachments={setAsgAttachments} />
                </Modal>
            )}
        </div>
    );
}
