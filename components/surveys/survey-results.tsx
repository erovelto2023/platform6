"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface SurveyResultsProps {
    survey: any;
    responses: any[];
}

export default function SurveyResults({ survey, responses }: SurveyResultsProps) {
    const totalResponses = responses.length;

    type QuestionStats =
        | { type: 'text'; count: number; answers: string[] }
        | { type: 'chart'; total: number; counts: Record<string, number> }
        | { type: 'unknown' };

    // Helper to calculate stats for a question
    const getQuestionStats = (question: any): QuestionStats => {
        const answers = responses
            .map(r => r.answers.find((a: any) => a.questionId === question.id)?.value)
            .filter(v => v !== undefined && v !== null && v !== "");

        if (['short_text', 'long_text', 'date'].includes(question.type)) {
            return { type: 'text', count: answers.length, answers };
        }

        if (['multiple_choice', 'dropdown', 'rating'].includes(question.type)) {
            const counts: Record<string, number> = {};
            question.options?.forEach((opt: string) => counts[opt] = 0);
            if (question.type === 'rating') {
                [1, 2, 3, 4, 5].forEach(r => counts[r] = 0);
            }

            answers.forEach((val: any) => {
                counts[val] = (counts[val] || 0) + 1;
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

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{totalResponses}</div>
                        <p className="text-xs text-slate-500 uppercase font-medium">Total Responses</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{survey.stats?.completionRate || 0}%</div>
                        <p className="text-xs text-slate-500 uppercase font-medium">Completion Rate</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">Active</div>
                        <p className="text-xs text-slate-500 uppercase font-medium">Status</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="summary">
                <TabsList>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="individual">Individual Responses</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-6 mt-6">
                    {survey.questions.map((question: any, index: number) => {
                        const stats = getQuestionStats(question);

                        return (
                            <Card key={question.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg font-medium">
                                        {index + 1}. {question.text}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {stats.type === 'text' && (
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {stats.answers.length === 0 ? (
                                                <p className="text-slate-500 italic">No responses yet</p>
                                            ) : (
                                                stats.answers.map((ans: string, i: number) => (
                                                    <div key={i} className="p-3 bg-slate-50 rounded-md text-sm text-slate-700 border border-slate-100">
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
                                                return (
                                                    <div key={label} className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="font-medium text-slate-700">{label}</span>
                                                            <span className="text-slate-500">{count} ({percentage}%)</span>
                                                        </div>
                                                        <Progress value={percentage} className="h-2" />
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

                <TabsContent value="individual" className="mt-6">
                    <div className="space-y-4">
                        {responses.map((response: any) => (
                            <Card key={response._id}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-base font-medium">
                                            {response.user ? `${response.user.firstName} ${response.user.lastName}` : 'Anonymous'}
                                        </CardTitle>
                                        <span className="text-xs text-slate-500">
                                            {format(new Date(response.createdAt), "MMM d, yyyy h:mm a")}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {response.answers.map((ans: any, i: number) => {
                                            const question = survey.questions.find((q: any) => q.id === ans.questionId);
                                            return (
                                                <div key={i} className="text-sm">
                                                    <span className="font-medium text-slate-700 block">{question?.text || "Unknown Question"}:</span>
                                                    <span className="text-slate-600">
                                                        {Array.isArray(ans.value) ? ans.value.join(", ") : ans.value}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
