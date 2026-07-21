import connectToDatabase from "@/lib/db/connect";
import SurveyResponse from "@/lib/db/models/SurveyResponse";
import Survey from "@/lib/db/models/Survey";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Users, Mail, Phone, Calendar, Award, ExternalLink } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function AdminQuizLeadsPage() {
    await connectToDatabase();
    
    // Force model registration
    const _s = Survey;
    
    const responses = await SurveyResponse.find({ "leadData.email": { $exists: true, $ne: null } })
        .populate("survey", "title subtype")
        .sort({ createdAt: -1 })
        .lean();

    const parsedResponses = JSON.parse(JSON.stringify(responses));

    return (
        <div className="p-6 max-w-7xl mx-auto text-slate-100 space-y-8">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                <div>
                    <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-1">
                        <Users className="h-4 w-4" /> Lead Management Hub
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">Quiz Funnel Leads</h1>
                    <p className="text-slate-400 text-sm mt-1">High-intent leads captured from your interactive quizzes and assessments.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700">
                        <Download className="mr-2 h-4 w-4 text-emerald-400" />
                        Export Leads CSV
                    </Button>
                    <Link href="/admin/surveys">
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                            Manage Quizzes
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center justify-between text-slate-400 text-sm font-medium mb-2">
                        <span>Total Leads Captured</span>
                        <Users className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div className="text-3xl font-bold text-white">{parsedResponses.length}</div>
                    <p className="text-xs text-emerald-400 mt-1">↑ 100% verified opt-ins</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center justify-between text-slate-400 text-sm font-medium mb-2">
                        <span>Active Lead Funnels</span>
                        <Award className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {new Set(parsedResponses.map((r: any) => r.survey?._id)).size}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Active quiz campaigns</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center justify-between text-slate-400 text-sm font-medium mb-2">
                        <span>Avg Lead Score</span>
                        <Mail className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {parsedResponses.length > 0
                            ? Math.round(parsedResponses.reduce((acc: number, r: any) => acc + (r.score || 0), 0) / parsedResponses.length)
                            : 0} pts
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Average quiz assessment score</p>
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-800/60">
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableHead className="text-slate-300 font-semibold">Lead Contact</TableHead>
                            <TableHead className="text-slate-300 font-semibold">Source Quiz</TableHead>
                            <TableHead className="text-slate-300 font-semibold">Score / Status</TableHead>
                            <TableHead className="text-slate-300 font-semibold">Date Captured</TableHead>
                            <TableHead className="text-right text-slate-300 font-semibold">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {parsedResponses.length === 0 ? (
                            <TableRow className="border-slate-800">
                                <TableCell colSpan={5} className="text-center py-16 text-slate-400">
                                    No leads captured yet. Publish a quiz with Lead Capture enabled to start generating leads!
                                </TableCell>
                            </TableRow>
                        ) : (
                            parsedResponses.map((resp: any) => (
                                <TableRow key={resp._id} className="border-slate-800 hover:bg-slate-800/40 transition-all">
                                    <TableCell>
                                        <div>
                                            <div className="font-semibold text-slate-100 flex items-center gap-2">
                                                {resp.leadData?.name || "Anonymous Lead"}
                                            </div>
                                            <div className="text-xs text-indigo-400 flex items-center gap-1 mt-0.5">
                                                <Mail className="h-3 w-3" /> {resp.leadData?.email || "N/A"}
                                            </div>
                                            {resp.leadData?.phone && (
                                                <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Phone className="h-3 w-3" /> {resp.leadData.phone}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-medium text-slate-200">
                                            {resp.survey?.title || "Quiz"}
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {resp.survey?.subtype || "Quiz"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${resp.passed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>
                                            {resp.score !== undefined ? `${resp.score} / ${resp.maxScore || 100} pts` : "Submitted"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-sm">
                                        {format(new Date(resp.createdAt), "MMM d, yyyy · h:mm a")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {resp.survey?._id && (
                                            <Link href={`/admin/surveys/${resp.survey._id}/results`}>
                                                <Button size="sm" variant="ghost" className="h-8 text-slate-300 hover:text-white hover:bg-slate-800">
                                                    <ExternalLink className="h-3.5 w-3.5 mr-1" /> View Breakdown
                                                </Button>
                                            </Link>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
