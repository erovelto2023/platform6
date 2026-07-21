"use client";

import { useState, useEffect } from "react";
import { getSurveys, deleteSurvey } from "@/lib/actions/survey.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Award, BarChart3, HelpCircle, Eye, Edit3, BarChart2, Users, BookOpen, Mail, Zap, Trash2, ExternalLink, Code } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const dynamic = 'force-dynamic';

export default function SurveysPage() {
    const [surveys, setSurveys] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [surveyToDelete, setSurveyToDelete] = useState<string | null>(null);
    const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
    const [surveyToEmbed, setSurveyToEmbed] = useState<any>(null);

    useEffect(() => {
        loadSurveys();
    }, []);

    const loadSurveys = async () => {
        try {
            const data = await getSurveys();
            setSurveys(data);
        } catch (error) {
            console.error("Failed to load surveys:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!surveyToDelete) return;
        try {
            await deleteSurvey(surveyToDelete);
            setSurveys(surveys.filter(s => s._id !== surveyToDelete));
            setDeleteDialogOpen(false);
            setSurveyToDelete(null);
        } catch (error) {
            console.error("Failed to delete survey:", error);
            alert("Failed to delete survey. Please try again.");
        }
    };

    const getEmbedCode = (survey: any) => {
        return `<iframe 
  src="${window.location.origin}/surveys/${survey._id}/embed"
  width="100%" 
  height="600" 
  frameborder="0"
  style="border: none; border-radius: 8px;">
</iframe>`;
    };

    const quizCount = surveys.filter((s: any) => s.subtype === "Quiz").length;
    const surveyCount = surveys.filter((s: any) => s.subtype === "Survey").length;
    const pollCount = surveys.filter((s: any) => s.subtype === "Poll").length;
    const totalResponses = surveys.reduce((sum: number, s: any) => sum + (s.stats?.responseCount || 0), 0);
    const totalLeads = surveys.reduce((sum: number, s: any) => sum + (s.stats?.leadsCapturedCount || 0), 0);

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="text-slate-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto text-slate-100 space-y-8">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                <div>
                    <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-1">
                        <Zap className="h-4 w-4" /> Quiz Funnel Platform
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">My Quizzes & Surveys</h1>
                    <p className="text-slate-400 text-sm mt-1">Create interactive quiz funnels that convert, grade, and capture leads.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/surveys/leads">
                        <Button variant="outline" className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700">
                            <Mail className="mr-2 h-4 w-4 text-emerald-400" /> Leads
                        </Button>
                    </Link>
                    <Link href="/admin/surveys/instructions">
                        <Button variant="outline" className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700">
                            <BookOpen className="mr-2 h-4 w-4 text-cyan-400" /> Instructions
                        </Button>
                    </Link>
                    <Link href="/admin/surveys/create">
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20">
                            <Plus className="mr-2 h-4 w-4" /> Create Quiz Funnel
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Total Funnels</div>
                    <div className="text-2xl font-black text-white">{surveys.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
                    <div className="text-xs font-semibold text-amber-400 uppercase mb-1">Quizzes</div>
                    <div className="text-2xl font-black text-amber-400">{quizCount}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
                    <div className="text-xs font-semibold text-cyan-400 uppercase mb-1">Surveys / Polls</div>
                    <div className="text-2xl font-black text-cyan-400">{surveyCount + pollCount}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Total Responses</div>
                    <div className="text-2xl font-black text-white">{totalResponses}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
                    <div className="text-xs font-semibold text-emerald-400 uppercase mb-1">Leads Captured</div>
                    <div className="text-2xl font-black text-emerald-400">{totalLeads}</div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-800/60">
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableHead className="text-slate-300 font-semibold">Title & Type</TableHead>
                            <TableHead className="text-slate-300 font-semibold">Status</TableHead>
                            <TableHead className="text-slate-300 font-semibold">Questions</TableHead>
                            <TableHead className="text-slate-300 font-semibold">Responses</TableHead>
                            <TableHead className="text-slate-300 font-semibold">Leads</TableHead>
                            <TableHead className="text-slate-300 font-semibold">Created</TableHead>
                            <TableHead className="text-right text-slate-300 font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {surveys.length === 0 ? (
                            <TableRow className="border-slate-800">
                                <TableCell colSpan={7} className="text-center py-16 text-slate-400">
                                    <div className="space-y-3">
                                        <Zap className="h-10 w-10 mx-auto text-slate-600" />
                                        <p className="font-semibold">No quiz funnels created yet</p>
                                        <p className="text-xs text-slate-500">Click &quot;Create Quiz Funnel&quot; to start building interactive lead-generating quizzes.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            surveys.map((survey: any) => (
                                <TableRow key={survey._id} className="border-slate-800 hover:bg-slate-800/40 transition-all">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg border ${survey.subtype === 'Quiz' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : survey.subtype === 'Poll' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                                                {survey.subtype === 'Quiz' ? <Award className="h-4 w-4" /> : survey.subtype === 'Poll' ? <BarChart3 className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <Link href={`/admin/surveys/${survey._id}`} className="font-semibold text-slate-100 hover:text-indigo-400 transition-colors">
                                                    {survey.title}
                                                </Link>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${survey.subtype === 'Quiz' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : survey.subtype === 'Poll' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'}`}>
                                                        {survey.subtype || "Survey"}
                                                    </span>
                                                    {(survey.outcomes?.length || 0) > 0 && (
                                                        <span className="text-[10px] text-slate-500">{survey.outcomes.length} outcome{survey.outcomes.length !== 1 ? 's' : ''}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${survey.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                            {survey.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-300 font-semibold">
                                        {survey.questions?.length || 0}
                                    </TableCell>
                                    <TableCell className="text-slate-300 font-semibold">
                                        {survey.stats?.responseCount || 0}
                                    </TableCell>
                                    <TableCell className="text-emerald-400 font-semibold">
                                        {survey.stats?.leadsCapturedCount || 0}
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-sm">
                                        {format(new Date(survey.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 text-slate-300 hover:text-white hover:bg-slate-800"
                                                onClick={() => {
                                                    setSurveyToEmbed(survey);
                                                    setEmbedDialogOpen(true);
                                                }}
                                            >
                                                <Code className="h-3.5 w-3.5 mr-1" /> Embed
                                            </Button>
                                            <Link href={`/admin/surveys/${survey._id}`}>
                                                <Button size="sm" variant="ghost" className="h-8 text-slate-300 hover:text-white hover:bg-slate-800">
                                                    <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/surveys/${survey._id}/results`}>
                                                <Button size="sm" variant="outline" className="h-8 bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700">
                                                    <BarChart2 className="h-3.5 w-3.5 mr-1" /> Results
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                onClick={() => {
                                                    setSurveyToDelete(survey._id);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Survey</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Are you sure you want to delete this survey? This action cannot be undone and will also delete all associated responses.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-500 text-white"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Embed Code Dialog */}
            <AlertDialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen}>
                <AlertDialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Embed Survey</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Copy this code to embed the survey on your website.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="my-4">
                        <pre className="bg-slate-950 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto border border-slate-800">
                            {surveyToEmbed && getEmbedCode(surveyToEmbed)}
                        </pre>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700">
                            Close
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (surveyToEmbed) {
                                    navigator.clipboard.writeText(getEmbedCode(surveyToEmbed));
                                    alert("Embed code copied to clipboard!");
                                }
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white"
                        >
                            Copy Code
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
