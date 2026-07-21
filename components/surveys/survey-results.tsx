"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Download, Users, Award, Percent, FileText, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface SurveyResultsProps {
    survey: any;
    responses: any[];
}

export default function SurveyResults({ survey, responses }: SurveyResultsProps) {
    const totalResponses = responses.length;
    const isQuizMode = survey.subtype === "Quiz" || survey.settings?.quizMode;

    // Calculate Quiz Statistics
    let totalScoreSum = 0;
    let totalMaxSum = 0;
    let passCount = 0;

    responses.forEach(r => {
        if (r.maxScore > 0) {
            totalScoreSum += r.score;
            totalMaxSum += r.maxScore;
            if (r.passed) passCount++;
        }
    });

    const avgScorePercent = totalMaxSum > 0 ? Math.round((totalScoreSum / totalMaxSum) * 100) : 0;
    const passRatePercent = totalResponses > 0 ? Math.round((passCount / totalResponses) * 100) : 0;

    type QuestionStats =
        | { type: 'text'; count: number; answers: string[] }
        | { type: 'chart'; total: number; counts: Record<string, number> }
        | { type: 'unknown' };

    const getQuestionStats = (question: any): QuestionStats => {
        const answers = responses
            .map(r => r.answers?.find((a: any) => a.questionId === question.id)?.value)
            .filter(v => v !== undefined && v !== null && v !== "");

        if (['short_text', 'long_text', 'date', 'number'].includes(question.type)) {
            return { type: 'text', count: answers.length, answers: answers.map(String) };
        }

        if (['multiple_choice', 'dropdown', 'rating', 'boolean'].includes(question.type)) {
            const counts: Record<string, number> = {};
            question.options?.forEach((opt: string) => counts[opt] = 0);
            if (question.type === 'rating') {
                [1, 2, 3, 4, 5].forEach(r => counts[r] = 0);
            }
            if (question.type === 'boolean') {
                counts['True'] = 0;
                counts['False'] = 0;
            }

            answers.forEach((val: any) => {
                const stringVal = typeof val === 'boolean' ? (val ? 'True' : 'False') : String(val);
                counts[stringVal] = (counts[stringVal] || 0) + 1;
            });

            return { type: 'chart', total: answers.length, counts };
        }

        if (question.type === 'checkbox') {
            const counts: Record<string, number> = {};
            question.options?.forEach((opt: string) => counts[opt] = 0);

            answers.forEach((vals: any[]) => {
                if (Array.isArray(vals)) {
                    vals.forEach(v => counts[v] = (counts[v] || 0) + 1);
                }
            });

            return { type: 'chart', total: answers.length, counts };
        }

        return { type: 'unknown' };
    };

    const handleExportCSV = () => {
        if (responses.length === 0) {
            toast.error("No responses available to export");
            return;
        }

        const headers = ["Response ID", "Student Name", "Email", "Submission Date"];
        if (isQuizMode) {
            headers.push("Score", "Max Score", "Percentage", "Passed");
        }
        survey.questions.forEach((q: any, i: number) => {
            headers.push(`Q${i + 1}: ${q.text.replace(/"/g, '""')}`);
        });

        const rows = responses.map(r => {
            const rowData = [
                r._id,
                r.user ? `"${r.user.firstName || ''} ${r.user.lastName || ''}"`.trim() : '"Anonymous"',
                r.user?.email ? `"${r.user.email}"` : '""',
                `"${format(new Date(r.createdAt), "yyyy-MM-dd HH:mm")}"`
            ];

            if (isQuizMode) {
                const pct = r.maxScore > 0 ? Math.round((r.score / r.maxScore) * 100) : 0;
                rowData.push(r.score, r.maxScore, `${pct}%`, r.passed ? "PASSED" : "FAILED");
            }

            survey.questions.forEach((q: any) => {
                const ans = r.answers?.find((a: any) => a.questionId === q.id)?.value;
                const formattedAns = Array.isArray(ans) ? ans.join("; ") : String(ans ?? "");
                rowData.push(`"${formattedAns.replace(/"/g, '""')}"`);
            });

            return rowData.join(",");
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${survey.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_responses.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("CSV exported successfully!");
    };

    return (
        <div className="space-y-8 text-slate-100">
            {/* Header Toolbar */}
            <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                <div>
                    <h1 className="text-2xl font-bold text-white">{survey.title}</h1>
                    <p className="text-xs text-slate-400 mt-1">Analytics & Respondent Master Log</p>
                </div>

                <Button onClick={handleExportCSV} className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium">
                    <Download className="h-4 w-4 mr-2" /> Export to CSV
                </Button>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-lg">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white">{totalResponses}</div>
                            <p className="text-xs text-slate-400 font-semibold uppercase">Total Submissions</p>
                        </div>
                    </CardContent>
                </Card>

                {isQuizMode ? (
                    <>
                        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-lg">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-amber-400">{avgScorePercent}%</div>
                                    <p className="text-xs text-slate-400 font-semibold uppercase">Average Score</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-lg">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-emerald-400">{passRatePercent}%</div>
                                    <p className="text-xs text-slate-400 font-semibold uppercase">Pass Rate ({passCount}/{totalResponses})</p>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-lg">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
                                <Percent className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-cyan-400">100%</div>
                                <p className="text-xs text-slate-400 font-semibold uppercase">Completion Rate</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-lg">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-slate-800 text-slate-300 rounded-xl border border-slate-700">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white">{survey.questions?.length || 0}</div>
                            <p className="text-xs text-slate-400 font-semibold uppercase">Total Questions</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for Summary vs Individual */}
            <Tabs defaultValue="summary" className="space-y-6">
                <TabsList className="bg-slate-900 border border-slate-800 p-1">
                    <TabsTrigger value="summary" className="data-[state=active]:bg-indigo-600 text-xs">Summary Breakdown</TabsTrigger>
                    <TabsTrigger value="individual" className="data-[state=active]:bg-indigo-600 text-xs">Individual Respondent Logs ({totalResponses})</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-6">
                    {survey.questions.map((question: any, index: number) => {
                        const stats = getQuestionStats(question);

                        return (
                            <Card key={question.id} className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-base font-semibold text-white">
                                            {index + 1}. {question.text}
                                        </CardTitle>
                                        {isQuizMode && question.points && (
                                            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                                {question.points} pts
                                            </span>
                                        )}
                                    </div>
                                    {question.correctAnswer !== undefined && (
                                        <p className="text-xs text-emerald-400 mt-1">
                                            Correct Answer: <span className="font-semibold">{Array.isArray(question.correctAnswer) ? question.correctAnswer.join(", ") : String(question.correctAnswer)}</span>
                                        </p>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {stats.type === 'text' && (
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {stats.answers.length === 0 ? (
                                                <p className="text-slate-500 italic text-sm">No responses yet</p>
                                            ) : (
                                                stats.answers.map((ans: string, i: number) => (
                                                    <div key={i} className="p-3 bg-slate-800/60 rounded-xl text-sm text-slate-200 border border-slate-700/60">
                                                        {ans}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    {stats.type === 'chart' && (
                                        <div className="space-y-4">
                                            {Object.entries(stats.counts as Record<string, number>).map(([label, count]) => {
                                                const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                                                const isCorrect = Array.isArray(question.correctAnswer)
                                                    ? question.correctAnswer.includes(label)
                                                    : String(question.correctAnswer) === label;

                                                return (
                                                    <div key={label} className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span className={`font-medium ${isCorrect ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>
                                                                {label} {isCorrect && "✓ (Correct)"}
                                                            </span>
                                                            <span className="text-slate-400">{count} ({percentage}%)</span>
                                                        </div>
                                                        <Progress value={percentage} className="h-2 bg-slate-800" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </TabsContent>

                <TabsContent value="individual">
                    <div className="space-y-4">
                        {responses.length === 0 ? (
                            <Card className="bg-slate-900 border-slate-800 text-slate-400 p-8 text-center">
                                No student submissions recorded yet.
                            </Card>
                        ) : (
                            responses.map((response: any) => (
                                <Card key={response._id} className="bg-slate-900 border-slate-800 text-slate-100 shadow-lg">
                                    <CardHeader className="pb-3 border-b border-slate-800">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <CardTitle className="text-base font-semibold text-white">
                                                    {response.user ? `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim() : 'Anonymous Respondent'}
                                                </CardTitle>
                                                {response.user?.email && (
                                                    <span className="text-xs text-slate-400">{response.user.email}</span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {isQuizMode && (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${response.passed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                                                        {response.score} / {response.maxScore} Pts ({response.passed ? 'PASSED' : 'FAILED'})
                                                    </span>
                                                )}
                                                <span className="text-xs text-slate-500">
                                                    {format(new Date(response.createdAt), "MMM d, yyyy h:mm a")}
                                                </span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="space-y-3">
                                            {response.answers?.map((ans: any, i: number) => {
                                                const question = survey.questions.find((q: any) => q.id === ans.questionId);
                                                return (
                                                    <div key={i} className="text-sm p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                                                        <span className="font-medium text-indigo-300 block mb-1">
                                                            Q: {question?.text || "Question"}
                                                        </span>
                                                        <span className="text-slate-200">
                                                            {Array.isArray(ans.value) ? ans.value.join(", ") : String(ans.value ?? "")}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
