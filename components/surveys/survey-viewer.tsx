"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, Award, ArrowRight, ArrowLeft, RotateCcw, ChevronRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface SurveyViewerProps {
    survey: any;
    hasResponded?: boolean;
    userId?: string | null;
}

export default function SurveyViewer({ survey, hasResponded: initialHasResponded = false, userId: propUserId }: SurveyViewerProps) {
    const { user } = useUser();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(initialHasResponded);
    const [submittedResponse, setSubmittedResponse] = useState<any>(null);
    const [leadData, setLeadData] = useState({ name: "", email: "" });
    const [phase, setPhase] = useState<"intro" | "questions" | "leadcapture" | "done">("intro");
    const [animating, setAnimating] = useState(false);
    const [startTime] = useState(Date.now());

    const questions = survey.questions || [];
    const isQuizMode = survey.subtype === "Quiz" || survey.settings?.quizMode;
    const leadCaptureEnabled = survey.leadCapture?.enabled !== false;
    const leadCapturePosition = survey.leadCapture?.position || "before_results";
    const totalSteps = questions.length + (leadCaptureEnabled && leadCapturePosition === "before_results" ? 1 : 0);
    const progress = phase === "done" ? 100 : phase === "leadcapture" ? Math.round((questions.length / totalSteps) * 100) : Math.round((currentIndex / totalSteps) * 100);

    const currentQuestion = questions[currentIndex];

    const handleAnswer = (value: any) => {
        if (!currentQuestion) return;
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    };

    const goNext = () => {
        if (currentQuestion?.required && (answers[currentQuestion.id] === undefined || answers[currentQuestion.id] === null || answers[currentQuestion.id] === "")) {
            toast.error("Please answer this question before continuing.");
            return;
        }
        setAnimating(true);
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                // All questions done
                if (leadCaptureEnabled && leadCapturePosition === "before_results") {
                    setPhase("leadcapture");
                } else {
                    handleSubmit();
                }
            }
            setAnimating(false);
        }, 180);
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            setAnimating(true);
            setTimeout(() => {
                setCurrentIndex(prev => prev - 1);
                setAnimating(false);
            }, 180);
        } else {
            setPhase("intro");
        }
    };

    const handleSubmit = async (capturedLead?: typeof leadData) => {
        setIsSubmitting(true);
        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
            const submitUserId = propUserId || (user?.publicMetadata?.userId as string) || null;
            const res = await fetch(`/api/surveys/${survey._id}/responses`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: submitUserId,
                    answers: formattedAnswers,
                    leadData: capturedLead || (leadCaptureEnabled && leadCapturePosition === "before_start" ? leadData : undefined),
                    metadata: { userAgent: typeof window !== "undefined" ? navigator.userAgent : "", timeTakenSeconds: Math.round((Date.now() - startTime) / 1000) },
                }),
            });
            if (!res.ok) throw new Error((await res.json()).error || "Failed to submit");
            const data = await res.json();
            setSubmittedResponse(data);
            setPhase("done");
            setIsCompleted(true);
        } catch (err: any) {
            toast.error(err.message || "Failed to submit");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLeadSubmit = () => {
        if (!leadData.email) { toast.error("Please enter your email address."); return; }
        handleSubmit(leadData);
    };

    const restart = () => {
        setCurrentIndex(0);
        setAnswers({});
        setLeadData({ name: "", email: "" });
        setPhase("intro");
        setIsCompleted(false);
        setSubmittedResponse(null);
    };

    // ─── INTRO SCREEN ────────────────────────────────────────────────
    if (phase === "intro" && !isCompleted) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="max-w-xl w-full text-center space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-2xl">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${survey.subtype === "Quiz" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"}`}>
                        {survey.subtype || "Survey"} • {questions.length} Question{questions.length !== 1 ? "s" : ""}
                    </span>
                    <h1 className="text-3xl font-extrabold text-white leading-tight">{survey.title}</h1>
                    {survey.description && <p className="text-slate-400 text-sm leading-relaxed">{survey.description}</p>}
                    <Button
                        size="lg"
                        onClick={() => {
                            if (leadCaptureEnabled && leadCapturePosition === "before_start") {
                                setPhase("leadcapture");
                            } else {
                                setPhase("questions");
                            }
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-3 text-base rounded-xl shadow-lg shadow-indigo-600/30 gap-2"
                        disabled={questions.length === 0}
                    >
                        {questions.length === 0 ? "No Questions Yet" : "Start Quiz"} <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        );
    }

    // ─── LEAD CAPTURE SCREEN ─────────────────────────────────────────
    if (phase === "leadcapture") {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center space-y-2">
                        <div className="inline-flex h-14 w-14 rounded-full bg-indigo-500/20 border border-indigo-500/30 items-center justify-center mx-auto">
                            <Award className="h-7 w-7 text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-white">{survey.leadCapture?.headline || "Where should we send your results?"}</h2>
                        <p className="text-slate-400 text-sm">{survey.leadCapture?.subheadline || "Enter your details to unlock your custom breakdown."}</p>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-slate-300 text-sm font-medium">Your Name</Label>
                            <Input value={leadData.name} onChange={e => setLeadData(p => ({ ...p, name: e.target.value }))} placeholder="First name" className="bg-slate-800 border-slate-700 text-white" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-slate-300 text-sm font-medium">Email Address *</Label>
                            <Input type="email" value={leadData.email} onChange={e => setLeadData(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" className="bg-slate-800 border-slate-700 text-white" />
                        </div>
                    </div>
                    <Button onClick={handleLeadSubmit} disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-base">
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                        Show My Results <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    {survey.leadCapture?.requireConsent !== false && (
                        <p className="text-xs text-slate-500 text-center">By continuing you agree to receive emails. Unsubscribe anytime.</p>
                    )}
                </div>
            </div>
        );
    }

    // ─── COMPLETION / SCORE CARD ─────────────────────────────────────
    if (phase === "done" || isCompleted) {
        const score = submittedResponse?.score ?? 0;
        const maxScore = submittedResponse?.maxScore ?? 0;
        const scorePercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 100;
        const passed = submittedResponse?.passed ?? true;
        const passingScorePercent = survey.settings?.passingScore ?? 70;
        const outcome = survey.outcomes?.find((o: any) => scorePercentage >= (o.minScore ?? 0) && scorePercentage <= (o.maxScore ?? 100));

        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="max-w-2xl w-full space-y-6">
                    {/* Score Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl space-y-5">
                        <div className={cn("inline-flex h-20 w-20 rounded-full items-center justify-center border-2 mx-auto", isQuizMode ? (passed ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-red-500/20 border-red-500/40 text-red-400") : "bg-indigo-500/20 border-indigo-500/40 text-indigo-400")}>
                            {isQuizMode ? (passed ? <Award className="h-10 w-10" /> : <XCircle className="h-10 w-10" />) : <CheckCircle2 className="h-10 w-10" />}
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-white">
                                {isQuizMode ? (passed ? "Congratulations!" : "Quiz Completed") : "Response Recorded!"}
                            </h2>
                            {isQuizMode && maxScore > 0 && (
                                <p className="text-slate-400 text-sm mt-1">{passed ? `You passed with ${scorePercentage}%!` : `You scored ${scorePercentage}%. Passing score is ${passingScorePercent}%.`}</p>
                            )}
                        </div>

                        {isQuizMode && maxScore > 0 && (
                            <div className="flex justify-center gap-8 p-5 bg-slate-800/60 rounded-xl border border-slate-700/60 max-w-xs mx-auto">
                                <div>
                                    <span className="text-xs text-slate-400 block uppercase font-semibold">Score</span>
                                    <span className="text-3xl font-black text-amber-400">{score}<span className="text-sm text-slate-500">/{maxScore}</span></span>
                                </div>
                                <div className="w-px bg-slate-700" />
                                <div>
                                    <span className="text-xs text-slate-400 block uppercase font-semibold">Result</span>
                                    <span className={cn("text-3xl font-black", passed ? "text-emerald-400" : "text-red-400")}>{scorePercentage}%</span>
                                </div>
                            </div>
                        )}

                        {/* Outcome Block */}
                        {outcome && (
                            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-5 text-left space-y-2">
                                <p className="text-xs text-indigo-400 uppercase font-bold tracking-wider">Your Result</p>
                                <h3 className="text-xl font-extrabold text-white">{outcome.title}</h3>
                                {outcome.description && <p className="text-slate-300 text-sm">{outcome.description}</p>}
                                {outcome.ctaUrl && outcome.ctaText && (
                                    <a href={outcome.ctaUrl} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm mt-2 transition-all">
                                        {outcome.ctaText} <ArrowRight className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                        )}

                        {survey.settings?.redirectUrl && (
                            <Button onClick={() => window.location.href = survey.settings.redirectUrl} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                                Continue <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                        <Button variant="ghost" onClick={restart} className="text-slate-400 hover:text-white text-sm gap-1.5">
                            <RotateCcw className="h-3.5 w-3.5" /> Retake
                        </Button>
                    </div>

                    {/* Answer Key (Quiz Only) */}
                    {isQuizMode && survey.settings?.showCorrectAnswersAfterSubmit && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Answer Breakdown</h3>
                            {questions.map((q: any, i: number) => {
                                const userVal = answers[q.id];
                                const isCorrect = q.correctAnswer !== undefined && (Array.isArray(q.correctAnswer) ? JSON.stringify(q.correctAnswer.sort()) === JSON.stringify((Array.isArray(userVal) ? [...userVal] : []).sort()) : String(userVal) === String(q.correctAnswer));
                                return (
                                    <div key={q.id} className={cn("p-4 rounded-xl border space-y-1.5", isCorrect ? "border-emerald-500/20 bg-emerald-950/20" : "border-red-500/20 bg-red-950/10")}>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-semibold text-slate-200">#{i + 1}. {q.text}</span>
                                            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0 ml-2">{q.points || 1} pts</span>
                                        </div>
                                        {q.correctAnswer !== undefined && (
                                            <div className="text-xs space-y-0.5">
                                                <div className="text-slate-400">Your answer: <span className={cn("font-semibold", isCorrect ? "text-emerald-300" : "text-red-300")}>{Array.isArray(userVal) ? userVal.join(", ") : String(userVal ?? "Not answered")}</span></div>
                                                {!isCorrect && <div className="text-emerald-400">Correct: <span className="font-semibold">{Array.isArray(q.correctAnswer) ? q.correctAnswer.join(", ") : String(q.correctAnswer)}</span></div>}
                                                {q.explanation && <p className="text-slate-400 italic mt-1">💡 {q.explanation}</p>}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ─── QUESTION FLOW ───────────────────────────────────────────────
    return (
        <div className="min-h-[60vh] flex flex-col p-4">
            {/* Progress Bar */}
            <div className="max-w-xl w-full mx-auto mb-6 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                    <span>{currentIndex + 1} of {questions.length}</span>
                    <span>{progress}% complete</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
                </div>
            </div>

            {/* Question Card */}
            {currentQuestion && (
                <div className={cn("max-w-xl w-full mx-auto flex-1 transition-all duration-200", animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0")}>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-start gap-3">
                                <h2 className="text-xl font-bold text-white leading-snug">
                                    {currentQuestion.text}
                                    {currentQuestion.required && <span className="text-red-400 ml-1">*</span>}
                                </h2>
                                {isQuizMode && currentQuestion.points && (
                                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 shrink-0">{currentQuestion.points} pts</span>
                                )}
                            </div>
                            {currentQuestion.description && <p className="text-slate-400 text-sm">{currentQuestion.description}</p>}
                        </div>

                        {/* Answer Input */}
                        <div>
                            {currentQuestion.type === "short_text" && (
                                <Input value={answers[currentQuestion.id] || ""} onChange={e => handleAnswer(e.target.value)} placeholder="Type your answer..." className="bg-slate-800 border-slate-700 text-white text-base py-3" autoFocus />
                            )}
                            {currentQuestion.type === "long_text" && (
                                <Textarea value={answers[currentQuestion.id] || ""} onChange={e => handleAnswer(e.target.value)} placeholder="Type your answer..." rows={4} className="bg-slate-800 border-slate-700 text-white" autoFocus />
                            )}
                            {currentQuestion.type === "multiple_choice" && (
                                <div className="space-y-2.5">
                                    {currentQuestion.options?.map((opt: string, i: number) => (
                                        <button key={i} type="button" onClick={() => handleAnswer(opt)} className={cn("w-full flex items-center gap-3 p-4 rounded-xl border text-left text-sm font-medium transition-all", answers[currentQuestion.id] === opt ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20" : "bg-slate-800/60 border-slate-700 text-slate-200 hover:border-indigo-400/50 hover:bg-slate-800")}>
                                            <span className={cn("flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs font-bold", answers[currentQuestion.id] === opt ? "border-white bg-white text-indigo-600" : "border-slate-600")}>{String.fromCharCode(65 + i)}</span>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {currentQuestion.type === "checkbox" && (
                                <div className="space-y-2.5">
                                    {currentQuestion.options?.map((opt: string, i: number) => {
                                        const current = (answers[currentQuestion.id] as string[]) || [];
                                        const checked = current.includes(opt);
                                        return (
                                            <button key={i} type="button" onClick={() => handleAnswer(checked ? current.filter((v: string) => v !== opt) : [...current, opt])} className={cn("w-full flex items-center gap-3 p-4 rounded-xl border text-left text-sm font-medium transition-all", checked ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20" : "bg-slate-800/60 border-slate-700 text-slate-200 hover:border-indigo-400/50 hover:bg-slate-800")}>
                                                <Checkbox checked={checked} className="border-slate-500 data-[state=checked]:bg-white data-[state=checked]:border-white" />
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            {currentQuestion.type === "boolean" && (
                                <div className="grid grid-cols-2 gap-4">
                                    {[{ val: true, label: "True", color: "emerald" }, { val: false, label: "False", color: "red" }].map(({ val, label, color }) => (
                                        <button key={label} type="button" onClick={() => handleAnswer(val)} className={cn("p-5 rounded-xl font-bold text-base border transition-all", answers[currentQuestion.id] === val ? `bg-${color}-600 text-white border-${color}-500 shadow-lg` : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600")}>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {currentQuestion.type === "rating" && (
                                <div className="flex gap-3 justify-center py-2">
                                    {[1, 2, 3, 4, 5].map(r => (
                                        <button key={r} type="button" onClick={() => handleAnswer(r)} className={cn("w-14 h-14 rounded-xl font-bold text-lg border flex items-center justify-center transition-all", answers[currentQuestion.id] === r ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/30 scale-110" : "bg-slate-800 text-slate-300 border-slate-700 hover:border-indigo-400 hover:scale-105")}>{r}</button>
                                    ))}
                                </div>
                            )}
                            {currentQuestion.type === "dropdown" && (
                                <Select value={answers[currentQuestion.id]} onValueChange={handleAnswer}>
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200 py-3"><SelectValue placeholder="Select an option..." /></SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                                        {currentQuestion.options?.map((opt: string, i: number) => <SelectItem key={i} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                            {currentQuestion.type === "number" && (
                                <Input type="number" value={answers[currentQuestion.id] ?? ""} onChange={e => handleAnswer(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Enter a number..." className="bg-slate-800 border-slate-700 text-white text-base py-3" autoFocus />
                            )}
                            {currentQuestion.type === "date" && (
                                <Input type="date" value={answers[currentQuestion.id] || ""} onChange={e => handleAnswer(e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
                            )}
                        </div>

                        {/* Nav */}
                        <div className="flex justify-between items-center pt-2">
                            <Button variant="ghost" onClick={goPrev} className="text-slate-400 hover:text-white gap-1.5 text-sm">
                                <ArrowLeft className="h-4 w-4" /> Back
                            </Button>
                            <Button onClick={goNext} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-7 gap-2 rounded-xl">
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {currentIndex === questions.length - 1 ? (leadCaptureEnabled && leadCapturePosition === "before_results" ? "Next" : "Submit") : "Next"}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
