"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface SurveyViewerProps {
    survey: any;
    hasResponded?: boolean;
    userId?: string | null;
}

export default function SurveyViewer({ survey, hasResponded: initialHasResponded = false, userId: propUserId }: SurveyViewerProps) {
    const { user } = useUser();
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(initialHasResponded);

    const handleInputChange = (questionId: string, value: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        // Validation
        const missingRequired = survey.questions.filter((q: any) => q.required && !answers[q.id]);
        if (missingRequired.length > 0) {
            toast.error(`Please answer all required questions.`);
            return;
        }

        setIsSubmitting(true);
        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
                questionId,
                value
            }));

            // Use propUserId if available, otherwise try publicMetadata
            const submitUserId = propUserId || (user?.publicMetadata?.userId as string) || null;

            const res = await fetch(`/api/surveys/${survey._id}/responses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: submitUserId,
                    answers: formattedAnswers,
                    metadata: {
                        userAgent: navigator.userAgent,
                        timeTakenSeconds: 0 // TODO: Track time
                    }
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to submit");
            }

            setIsCompleted(true);
            toast.success("Thank you for your feedback!");
        } catch (error: any) {
            toast.error(error.message || "Failed to submit survey");
        } finally {
            setIsSubmitting(false);
        }
    };

    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [isLoadingResults, setIsLoadingResults] = useState(false);

    const fetchResults = async () => {
        setIsLoadingResults(true);
        try {
            const res = await fetch(`/api/surveys/${survey._id}/results`);
            if (!res.ok) throw new Error("Failed to fetch results");
            const data = await res.json();
            setResults(data);
            setShowResults(true);
        } catch (error) {
            toast.error("Could not load results");
        } finally {
            setIsLoadingResults(false);
        }
    };

    if (showResults && results) {
        return (
            <div className="max-w-3xl mx-auto space-y-8 pb-12">
                <div className="bg-white p-8 rounded-lg border shadow-sm text-center relative">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{survey.title}</h1>
                    <p className="text-slate-600 mb-4">Results</p>
                    <Button variant="ghost" size="sm" onClick={() => setShowResults(false)} className="absolute top-4 left-4">
                        Back
                    </Button>
                </div>

                <div className="space-y-6">
                    {survey.questions.map((question: any, index: number) => {
                        const res = results[question.id];
                        return (
                            <div key={question.id} className="bg-white p-6 rounded-lg border shadow-sm">
                                <div className="mb-4">
                                    <Label className="text-lg font-medium text-slate-900 block mb-1">
                                        {index + 1}. {question.text}
                                    </Label>
                                </div>

                                <div className="mt-4">
                                    {res && res.counts ? (
                                        <div className="space-y-3">
                                            {Object.entries(res.counts).map(([option, count]: [string, any]) => {
                                                const percentage = res.total > 0 ? Math.round((count / res.total) * 100) : 0;
                                                return (
                                                    <div key={option} className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span>{option}</span>
                                                            <span className="text-slate-500">{count} ({percentage}%)</span>
                                                        </div>
                                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div className="text-xs text-slate-400 text-right mt-2">Total votes: {res.total}</div>
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 italic text-sm">Text responses are not aggregated.</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (isCompleted) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center bg-white rounded-lg border shadow-sm p-8">
                <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
                <p className="text-slate-600 mb-6">Your response has been recorded.</p>
                {survey.settings?.showResultsAfterSubmit && (
                    <Button variant="outline" onClick={fetchResults} disabled={isLoadingResults}>
                        {isLoadingResults ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        View Results
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            <div className="bg-white p-8 rounded-lg border shadow-sm text-center relative">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{survey.title}</h1>
                {survey.description && (
                    <p className="text-slate-600">{survey.description}</p>
                )}

                {/* Edit button for owner */}
                {/* We check if the current user is the owner. Since survey is serialized, IDs are strings. */}
                {user?.publicMetadata?.userId && (
                    (typeof survey.owner === 'object' ? survey.owner._id === user.publicMetadata.userId : survey.owner === user.publicMetadata.userId)
                ) && (
                        <div className="absolute top-4 right-4">
                            <Button variant="outline" size="sm" onClick={() => window.location.href = `${window.location.pathname}/edit`}>
                                Edit Survey
                            </Button>
                        </div>
                    )}
            </div>

            <div className="space-y-6">
                {(!survey.questions || survey.questions.length === 0) ? (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <p className="text-slate-500">This survey has no questions yet.</p>
                        {!!user?.publicMetadata?.userId && (
                            (typeof survey.owner === 'object' ? survey.owner._id === user.publicMetadata.userId : survey.owner === user.publicMetadata.userId)
                        ) && (
                                <Button variant="link" onClick={() => window.location.href = `${window.location.pathname}/edit`}>
                                    Add Questions
                                </Button>
                            )}
                    </div>
                ) : (
                    survey.questions.map((question: any, index: number) => (
                        <div key={question.id} className="bg-white p-6 rounded-lg border shadow-sm">
                            <div className="mb-4">
                                <Label className="text-lg font-medium text-slate-900 block mb-1">
                                    {index + 1}. {question.text}
                                    {question.required && <span className="text-red-500 ml-1">*</span>}
                                </Label>
                                {question.description && (
                                    <p className="text-sm text-slate-500">{question.description}</p>
                                )}
                            </div>

                            <div className="mt-4">
                                {question.type === "short_text" && (
                                    <Input
                                        value={answers[question.id] || ""}
                                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                                        placeholder="Your answer"
                                    />
                                )}

                                {question.type === "long_text" && (
                                    <Textarea
                                        value={answers[question.id] || ""}
                                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                                        placeholder="Your answer"
                                    />
                                )}

                                {question.type === "multiple_choice" && (
                                    <RadioGroup
                                        value={answers[question.id]}
                                        onValueChange={(val: string) => handleInputChange(question.id, val)}
                                    >
                                        {question.options?.map((opt: string, i: number) => (
                                            <div key={i} className="flex items-center space-x-2">
                                                <RadioGroupItem value={opt} id={`${question.id}-${i}`} />
                                                <Label htmlFor={`${question.id}-${i}`}>{opt}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                )}

                                {question.type === "checkbox" && (
                                    <div className="space-y-2">
                                        {question.options?.map((opt: string, i: number) => {
                                            const current = (answers[question.id] as string[]) || [];
                                            return (
                                                <div key={i} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`${question.id}-${i}`}
                                                        checked={current.includes(opt)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                handleInputChange(question.id, [...current, opt]);
                                                            } else {
                                                                handleInputChange(question.id, current.filter(v => v !== opt));
                                                            }
                                                        }}
                                                    />
                                                    <Label htmlFor={`${question.id}-${i}`}>{opt}</Label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {question.type === "dropdown" && (
                                    <Select
                                        value={answers[question.id]}
                                        onValueChange={(val: string) => handleInputChange(question.id, val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {question.options?.map((opt: string, i: number) => (
                                                <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}

                                {question.type === "rating" && (
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                                key={rating}
                                                onClick={() => handleInputChange(question.id, rating)}
                                                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${answers[question.id] === rating
                                                    ? "bg-indigo-600 text-white border-indigo-600"
                                                    : "bg-white text-slate-700 hover:border-indigo-300"
                                                    }`}
                                            >
                                                {rating}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex justify-end">
                <Button size="lg" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Submit Survey
                </Button>
            </div>
        </div>
    );
}
