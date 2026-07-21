"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, GripVertical, Save, ArrowLeft, Copy, Eye, Settings, HelpCircle, Award, CheckCircle2, Mail, Target, Palette } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import SurveyViewer from "./survey-viewer";

export interface Question {
    id: string;
    type: string;
    text: string;
    description?: string;
    options?: string[];
    correctAnswer?: any;
    explanation?: string;
    points?: number;
    required: boolean;
}

interface SurveyBuilderProps {
    initialSurvey: any;
}

export default function SurveyBuilder({ initialSurvey }: SurveyBuilderProps) {
    const router = useRouter();
    const [survey, setSurvey] = useState(initialSurvey);
    const [isSaving, setIsSaving] = useState(false);
    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"builder" | "preview" | "settings" | "leadcapture" | "outcomes" | "theme">("builder");

    const isQuizMode = survey.subtype === "Quiz" || survey.settings?.quizMode;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/surveys/${survey._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(survey),
            });

            if (!res.ok) throw new Error("Failed to save");

            toast.success("Survey saved successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to save survey");
        } finally {
            setIsSaving(false);
        }
    };

    const addQuestion = () => {
        const newQuestion: Question = {
            id: uuidv4(),
            type: "multiple_choice",
            text: "New Question",
            required: false,
            options: ["Option 1", "Option 2", "Option 3"],
            points: 1,
            correctAnswer: isQuizMode ? "Option 1" : undefined,
        };
        setSurvey({
            ...survey,
            questions: [...(survey.questions || []), newQuestion],
        });
        setActiveQuestionId(newQuestion.id);
    };

    const duplicateQuestion = (index: number) => {
        const questionToCopy = survey.questions[index];
        const duplicated: Question = {
            ...JSON.parse(JSON.stringify(questionToCopy)),
            id: uuidv4(),
            text: `${questionToCopy.text} (Copy)`,
        };
        const updated = [...survey.questions];
        updated.splice(index + 1, 0, duplicated);
        setSurvey({ ...survey, questions: updated });
        setActiveQuestionId(duplicated.id);
        toast.info("Question duplicated");
    };

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        setSurvey({
            ...survey,
            questions: survey.questions.map((q: Question) =>
                q.id === id ? { ...q, ...updates } : q
            ),
        });
    };

    const deleteQuestion = (id: string) => {
        setSurvey({
            ...survey,
            questions: survey.questions.filter((q: Question) => q.id !== id),
        });
    };

    const moveQuestion = (index: number, direction: 'up' | 'down') => {
        const questions = [...survey.questions];
        if (direction === 'up' && index > 0) {
            [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]];
        } else if (direction === 'down' && index < questions.length - 1) {
            [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
        }
        setSurvey({ ...survey, questions });
    };

    // Calculate total quiz points
    const totalPoints = (survey.questions || []).reduce((sum: number, q: Question) => sum + (q.points || 0), 0);

    return (
        <div className="max-w-6xl mx-auto p-6 pb-24">
            {/* Sticky Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sticky top-0 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl z-20 border border-slate-800 shadow-xl text-white">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-300 hover:text-white hover:bg-slate-800"
                        onClick={() => {
                            if (survey.context?.type === 'Group' && survey.context?.entityId) {
                                router.back();
                            } else {
                                router.push('/admin/surveys');
                            }
                        }}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold truncate max-w-xs sm:max-w-md">{survey.title || "Untitled Survey"}</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${survey.subtype === 'Quiz' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : survey.subtype === 'Poll' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
                                {survey.subtype || "Survey"}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">
                            {survey.questions?.length || 0} Questions {isQuizMode ? `• ${totalPoints} Total Points` : ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="mr-2">
                        <TabsList className="bg-slate-800 border border-slate-700">
                            <TabsTrigger value="builder" className="data-[state=active]:bg-indigo-600 text-xs gap-1.5">
                                <HelpCircle className="h-3.5 w-3.5" />
                                Questions
                            </TabsTrigger>
                            <TabsTrigger value="leadcapture" className="data-[state=active]:bg-indigo-600 text-xs gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                Lead Capture
                            </TabsTrigger>
                            <TabsTrigger value="outcomes" className="data-[state=active]:bg-indigo-600 text-xs gap-1.5">
                                <Target className="h-3.5 w-3.5" />
                                Results
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="data-[state=active]:bg-indigo-600 text-xs gap-1.5">
                                <Settings className="h-3.5 w-3.5" />
                                Settings
                            </TabsTrigger>
                            <TabsTrigger value="preview" className="data-[state=active]:bg-indigo-600 text-xs gap-1.5">
                                <Eye className="h-3.5 w-3.5" />
                                Preview
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                        <Switch
                            id="published-toggle"
                            checked={survey.status === 'Active'}
                            onCheckedChange={(checked) => setSurvey({ ...survey, status: checked ? 'Active' : 'Draft' })}
                        />
                        <Label htmlFor="published-toggle" className="text-xs font-medium cursor-pointer">
                            {survey.status === 'Active' ? 'Published' : 'Draft'}
                        </Label>
                    </div>

                    <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium">
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save
                    </Button>
                </div>
            </div>

            {/* PREVIEW TAB */}
            {activeTab === "preview" && (
                <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-2xl">
                    <div className="mb-4 flex items-center justify-between pb-4 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-indigo-400" />
                            <h3 className="font-semibold text-slate-200">Interactive Student View</h3>
                        </div>
                        <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">Simulated Live Environment</span>
                    </div>
                    <SurveyViewer survey={survey} />
                </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-indigo-400 flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Classification & Quiz Rules
                            </CardTitle>
                            <CardDescription className="text-slate-400">Configure type, scoring system, and passing criteria.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Platform Subtype</Label>
                                <Select
                                    value={survey.subtype || "Survey"}
                                    onValueChange={(val) => {
                                        setSurvey({
                                            ...survey,
                                            subtype: val,
                                            settings: {
                                                ...survey.settings,
                                                quizMode: val === "Quiz",
                                            }
                                        });
                                    }}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                                        <SelectItem value="Survey">Feedback Survey</SelectItem>
                                        <SelectItem value="Poll">Quick Opinion Poll</SelectItem>
                                        <SelectItem value="Quiz">Graded Quiz / Assessment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {isQuizMode && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Passing Score Percentage (%)</Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={survey.settings?.passingScore ?? 70}
                                            onChange={(e) => setSurvey({
                                                ...survey,
                                                settings: { ...survey.settings, passingScore: Number(e.target.value) }
                                            })}
                                            className="bg-slate-800 border-slate-700 text-slate-200"
                                        />
                                        <p className="text-xs text-slate-400">Students scoring at or above this percentage pass the quiz.</p>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/60">
                                        <div>
                                            <Label className="text-slate-200 font-medium">Show Correct Answers Upon Completion</Label>
                                            <p className="text-xs text-slate-400">Display answer explanations to students after submission.</p>
                                        </div>
                                        <Switch
                                            checked={survey.settings?.showCorrectAnswersAfterSubmit ?? true}
                                            onCheckedChange={(checked) => setSurvey({
                                                ...survey,
                                                settings: { ...survey.settings, showCorrectAnswersAfterSubmit: checked }
                                            })}
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-indigo-400 flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Access & Response Behavior
                            </CardTitle>
                            <CardDescription className="text-slate-400">Control who can take this survey and post-submit actions.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/60">
                                <div>
                                    <Label className="text-slate-200 font-medium">Allow Anonymous Responses</Label>
                                    <p className="text-xs text-slate-400">Users do not need to log in to participate.</p>
                                </div>
                                <Switch
                                    checked={survey.settings?.allowAnonymous ?? false}
                                    onCheckedChange={(checked) => setSurvey({
                                        ...survey,
                                        settings: { ...survey.settings, allowAnonymous: checked }
                                    })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/60">
                                <div>
                                    <Label className="text-slate-200 font-medium">Public Results Aggregation</Label>
                                    <p className="text-xs text-slate-400">Show aggregate statistics to respondents after submitting.</p>
                                </div>
                                <Switch
                                    checked={survey.settings?.showResultsAfterSubmit ?? false}
                                    onCheckedChange={(checked) => setSurvey({
                                        ...survey,
                                        settings: { ...survey.settings, showResultsAfterSubmit: checked }
                                    })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Completion Redirect URL (Optional)</Label>
                                <Input
                                    placeholder="https://example.com/thank-you"
                                    value={survey.settings?.redirectUrl || ""}
                                    onChange={(e) => setSurvey({
                                        ...survey,
                                        settings: { ...survey.settings, redirectUrl: e.target.value }
                                    })}
                                    className="bg-slate-800 border-slate-700 text-slate-200"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* LEAD CAPTURE TAB */}
            {activeTab === "leadcapture" && (
                <div className="max-w-3xl mx-auto space-y-6">
                    <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-indigo-400 flex items-center gap-2"><Mail className="h-5 w-5" /> Lead Capture</CardTitle>
                            <CardDescription className="text-slate-400">Configure when and how to capture lead information from quiz takers.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/60">
                                <div><Label className="text-slate-200 font-medium">Enable Lead Capture</Label><p className="text-xs text-slate-400">Collect name & email before showing results.</p></div>
                                <Switch checked={survey.leadCapture?.enabled ?? true} onCheckedChange={(checked) => setSurvey({ ...survey, leadCapture: { ...survey.leadCapture, enabled: checked } })} />
                            </div>

                            {survey.leadCapture?.enabled !== false && (
                                <>
                                    <div className="space-y-3">
                                        <Label className="text-slate-300 font-semibold">Capture Position</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[{ val: "before_results", label: "Before Results", desc: "Capture after last question but before showing results. Highest conversion rate." }, { val: "before_start", label: "Before Starting", desc: "Capture upfront. Lower completion but ensures 100% lead capture." }].map(pos => (
                                                <button key={pos.val} type="button" onClick={() => setSurvey({ ...survey, leadCapture: { ...survey.leadCapture, position: pos.val } })} className={`p-4 rounded-xl border text-left transition-all ${(survey.leadCapture?.position || 'before_results') === pos.val ? 'border-indigo-500 bg-indigo-950/30 ring-2 ring-indigo-500' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}>
                                                    <div className="font-semibold text-sm text-slate-200 mb-1">{pos.label}</div>
                                                    <div className="text-xs text-slate-400">{pos.desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Form Headline</Label>
                                        <Input value={survey.leadCapture?.headline || "Where should we send your results?"} onChange={e => setSurvey({ ...survey, leadCapture: { ...survey.leadCapture, headline: e.target.value } })} className="bg-slate-800 border-slate-700 text-slate-200" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Sub-headline</Label>
                                        <Input value={survey.leadCapture?.subheadline || "Enter your details below to unlock your custom breakdown."} onChange={e => setSurvey({ ...survey, leadCapture: { ...survey.leadCapture, subheadline: e.target.value } })} className="bg-slate-800 border-slate-700 text-slate-200" />
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/60">
                                        <div><Label className="text-slate-200 font-medium">Require GDPR Consent</Label><p className="text-xs text-slate-400">Show consent checkbox before form submission.</p></div>
                                        <Switch checked={survey.leadCapture?.requireConsent ?? true} onCheckedChange={(checked) => setSurvey({ ...survey, leadCapture: { ...survey.leadCapture, requireConsent: checked } })} />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* OUTCOMES TAB */}
            {activeTab === "outcomes" && (
                <div className="max-w-3xl mx-auto space-y-6">
                    <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div><CardTitle className="text-indigo-400 flex items-center gap-2"><Target className="h-5 w-5" /> Results & Outcomes</CardTitle>
                                <CardDescription className="text-slate-400">Configure score ranges and personalized outcome pages.</CardDescription></div>
                                <Button size="sm" onClick={() => {
                                    const newOutcome = { id: uuidv4(), title: "", description: "", minScore: 0, maxScore: 100, ctaText: "Get Started Now", ctaUrl: "" };
                                    setSurvey({ ...survey, outcomes: [...(survey.outcomes || []), newOutcome] });
                                }} className="bg-indigo-600 hover:bg-indigo-500 text-white"><Plus className="h-4 w-4 mr-1" /> Add Outcome</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-200">
                                <p className="font-semibold">💡 Pro Tip: The Doctor Analogy</p>
                                <p className="text-xs text-amber-300/80 mt-1">Questions = the check-up. Outcomes = the diagnosis & prescription. Don't just say "You scored 50%". Say "You have a solid foundation, but here are 3 things to fix..."</p>
                            </div>

                            {(!survey.outcomes || survey.outcomes.length === 0) ? (
                                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
                                    <Target className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-400 font-semibold">No outcomes yet</p>
                                    <p className="text-xs text-slate-500">Create results to show your users based on their quiz answers.</p>
                                </div>
                            ) : (
                                survey.outcomes.map((outcome: any, idx: number) => (
                                    <Card key={outcome.id} className="bg-slate-800/50 border-slate-700">
                                        <CardContent className="p-5 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <Label className="text-xs text-indigo-400 font-bold uppercase">Outcome #{idx + 1}</Label>
                                                <Button variant="ghost" size="sm" onClick={() => setSurvey({ ...survey, outcomes: survey.outcomes.filter((_: any, i: number) => i !== idx) })} className="text-red-400 hover:text-red-300 h-7"><Trash2 className="h-3.5 w-3.5" /></Button>
                                            </div>
                                            <Input value={outcome.title} onChange={e => { const u = [...survey.outcomes]; u[idx] = { ...u[idx], title: e.target.value }; setSurvey({ ...survey, outcomes: u }); }} placeholder="e.g. You are a Marketing Pro!" className="bg-slate-800 border-slate-700 text-white font-semibold" />
                                            <Textarea value={outcome.description || ""} onChange={e => { const u = [...survey.outcomes]; u[idx] = { ...u[idx], description: e.target.value }; setSurvey({ ...survey, outcomes: u }); }} placeholder="Describe this outcome..." rows={2} className="bg-slate-800 border-slate-700 text-slate-200 text-sm" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1"><Label className="text-xs text-slate-400">Min Score</Label><Input type="number" value={outcome.minScore ?? 0} onChange={e => { const u = [...survey.outcomes]; u[idx] = { ...u[idx], minScore: Number(e.target.value) }; setSurvey({ ...survey, outcomes: u }); }} className="bg-slate-800 border-slate-700 text-slate-200" /></div>
                                                <div className="space-y-1"><Label className="text-xs text-slate-400">Max Score</Label><Input type="number" value={outcome.maxScore ?? 100} onChange={e => { const u = [...survey.outcomes]; u[idx] = { ...u[idx], maxScore: Number(e.target.value) }; setSurvey({ ...survey, outcomes: u }); }} className="bg-slate-800 border-slate-700 text-slate-200" /></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1"><Label className="text-xs text-slate-400">CTA Button Text</Label><Input value={outcome.ctaText || ""} onChange={e => { const u = [...survey.outcomes]; u[idx] = { ...u[idx], ctaText: e.target.value }; setSurvey({ ...survey, outcomes: u }); }} placeholder="Get Started Now" className="bg-slate-800 border-slate-700 text-slate-200" /></div>
                                                <div className="space-y-1"><Label className="text-xs text-slate-400">CTA URL / Redirect</Label><Input value={outcome.ctaUrl || ""} onChange={e => { const u = [...survey.outcomes]; u[idx] = { ...u[idx], ctaUrl: e.target.value }; setSurvey({ ...survey, outcomes: u }); }} placeholder="https://..." className="bg-slate-800 border-slate-700 text-slate-200" /></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* BUILDER TAB */}
            {activeTab === "builder" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Questions Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Meta Card */}
                        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-indigo-400">Survey Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300 font-medium">Title</Label>
                                    <Input
                                        value={survey.title}
                                        onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
                                        placeholder="Enter survey or quiz title"
                                        className="bg-slate-800 border-slate-700 text-white font-semibold text-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300 font-medium">Description</Label>
                                    <Textarea
                                        value={survey.description || ""}
                                        onChange={(e) => setSurvey({ ...survey, description: e.target.value })}
                                        placeholder="Provide instructions or context for respondents..."
                                        rows={3}
                                        className="bg-slate-800 border-slate-700 text-slate-200"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Questions List */}
                        <div className="space-y-5">
                            {survey.questions?.map((question: Question, index: number) => (
                                <Card
                                    key={question.id}
                                    className={`bg-slate-900 border-slate-800 text-slate-100 shadow-xl transition-all duration-200 hover:border-slate-700 ${activeQuestionId === question.id ? 'ring-2 ring-indigo-500 border-transparent' : ''}`}
                                    onClick={() => setActiveQuestionId(question.id)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            {/* Left Grip & Reorder */}
                                            <div className="flex flex-col items-center gap-1.5 pt-2 text-slate-500">
                                                <GripVertical className="h-5 w-5 cursor-grab" />
                                                <div className="flex flex-col gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800"
                                                        onClick={(e) => { e.stopPropagation(); moveQuestion(index, 'up'); }}
                                                        disabled={index === 0}
                                                    >
                                                        ↑
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800"
                                                        onClick={(e) => { e.stopPropagation(); moveQuestion(index, 'down'); }}
                                                        disabled={index === survey.questions.length - 1}
                                                    >
                                                        ↓
                                                    </Button>
                                                </div>
                                                <span className="text-xs font-bold text-slate-500 mt-1">#{index + 1}</span>
                                            </div>

                                            {/* Question Editor Content */}
                                            <div className="flex-1 space-y-4">
                                                <div className="flex flex-wrap sm:flex-nowrap gap-3 justify-between items-start">
                                                    <Input
                                                        value={question.text}
                                                        onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                                                        className="font-semibold text-lg bg-slate-800/80 border-slate-700 text-white focus:border-indigo-500 flex-1"
                                                        placeholder="Question text..."
                                                    />

                                                    <Select
                                                        value={question.type}
                                                        onValueChange={(value) => updateQuestion(question.id, { type: value })}
                                                    >
                                                        <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-slate-200">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                                                            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                                            <SelectItem value="checkbox">Checkboxes</SelectItem>
                                                            <SelectItem value="dropdown">Dropdown</SelectItem>
                                                            <SelectItem value="short_text">Short Text</SelectItem>
                                                            <SelectItem value="long_text">Long Text Paragraph</SelectItem>
                                                            <SelectItem value="rating">Rating Scale</SelectItem>
                                                            <SelectItem value="boolean">True / False</SelectItem>
                                                            <SelectItem value="number">Numeric Input</SelectItem>
                                                            <SelectItem value="date">Date Picker</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <Input
                                                    value={question.description || ''}
                                                    onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
                                                    placeholder="Subtext / Hint description (optional)..."
                                                    className="text-xs bg-slate-800/50 border-slate-700/60 text-slate-400"
                                                />

                                                {/* Options Editor for Choice Types */}
                                                {['multiple_choice', 'checkbox', 'dropdown'].includes(question.type) && (
                                                    <div className="space-y-3 pl-4 border-l-2 border-slate-800 my-4">
                                                        <Label className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Answer Options</Label>
                                                        {question.options?.map((option, optIndex) => (
                                                            <div key={optIndex} className="flex items-center gap-2">
                                                                {isQuizMode && (
                                                                    <button
                                                                        type="button"
                                                                        title="Set as Correct Answer"
                                                                        onClick={() => {
                                                                            if (question.type === "checkbox") {
                                                                                const current = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
                                                                                const updated = current.includes(option)
                                                                                    ? current.filter((v: string) => v !== option)
                                                                                    : [...current, option];
                                                                                updateQuestion(question.id, { correctAnswer: updated });
                                                                            } else {
                                                                                updateQuestion(question.id, { correctAnswer: option });
                                                                            }
                                                                        }}
                                                                        className={`p-1.5 rounded-full transition-all ${((Array.isArray(question.correctAnswer) && question.correctAnswer.includes(option)) || question.correctAnswer === option)
                                                                            ? "text-emerald-400 bg-emerald-500/20 border border-emerald-500/40"
                                                                            : "text-slate-600 hover:text-slate-400"
                                                                            }`}
                                                                    >
                                                                        <CheckCircle2 className="h-4 w-4" />
                                                                    </button>
                                                                )}
                                                                <Input
                                                                    value={option}
                                                                    onChange={(e) => {
                                                                        const newOptions = [...(question.options || [])];
                                                                        newOptions[optIndex] = e.target.value;
                                                                        updateQuestion(question.id, { options: newOptions });
                                                                    }}
                                                                    className="bg-slate-800 border-slate-700 text-slate-200 text-sm"
                                                                />
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => {
                                                                        const newOptions = question.options?.filter((_, i) => i !== optIndex);
                                                                        updateQuestion(question.id, { options: newOptions });
                                                                    }}
                                                                    className="text-slate-500 hover:text-red-400 hover:bg-slate-800"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateQuestion(question.id, { options: [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`] })}
                                                            className="bg-slate-800 border-slate-700 text-indigo-400 hover:bg-slate-700 text-xs"
                                                        >
                                                            <Plus className="h-3.5 w-3.5 mr-1" /> Add Choice Option
                                                        </Button>
                                                    </div>
                                                )}

                                                {/* True/False Selector for Boolean Type */}
                                                {question.type === "boolean" && isQuizMode && (
                                                    <div className="space-y-2 p-3 bg-slate-800/40 rounded-lg border border-slate-700/60">
                                                        <Label className="text-xs text-indigo-400 font-semibold uppercase">Correct True/False Choice</Label>
                                                        <Select
                                                            value={String(question.correctAnswer ?? "true")}
                                                            onValueChange={(val) => updateQuestion(question.id, { correctAnswer: val === "true" })}
                                                        >
                                                            <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                                                                <SelectItem value="true">True is Correct</SelectItem>
                                                                <SelectItem value="false">False is Correct</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}

                                                {/* Text / Numeric Answer Key for Quiz Mode */}
                                                {['short_text', 'number'].includes(question.type) && isQuizMode && (
                                                    <div className="space-y-2 p-3 bg-slate-800/40 rounded-lg border border-slate-700/60">
                                                        <Label className="text-xs text-indigo-400 font-semibold uppercase">Expected Exact Answer</Label>
                                                        <Input
                                                            value={question.correctAnswer || ""}
                                                            onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                                                            placeholder="Enter expected answer for auto-grading..."
                                                            className="bg-slate-800 border-slate-700 text-slate-200"
                                                        />
                                                    </div>
                                                )}

                                                {/* Quiz Grading Section (Points & Explanations) */}
                                                {isQuizMode && (
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80">
                                                        <div className="space-y-1">
                                                            <Label className="text-xs text-amber-400 font-medium">Question Points</Label>
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                value={question.points ?? 1}
                                                                onChange={(e) => updateQuestion(question.id, { points: Number(e.target.value) })}
                                                                className="bg-slate-800 border-slate-700 text-amber-300 font-semibold"
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2 space-y-1">
                                                            <Label className="text-xs text-slate-400 font-medium">Answer Explanation (Optional)</Label>
                                                            <Input
                                                                value={question.explanation || ""}
                                                                onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                                                                placeholder="Why is this answer correct? Shown after submission..."
                                                                className="bg-slate-800 border-slate-700 text-slate-200 text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Question Footer Toolbar */}
                                                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-800/80 gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                id={`req-${question.id}`}
                                                                checked={question.required}
                                                                onCheckedChange={(checked) => updateQuestion(question.id, { required: checked })}
                                                            />
                                                            <Label htmlFor={`req-${question.id}`} className="text-xs text-slate-300 cursor-pointer">
                                                                Required
                                                            </Label>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
                                                            onClick={(e) => { e.stopPropagation(); duplicateQuestion(index); }}
                                                        >
                                                            <Copy className="h-3.5 w-3.5 mr-1" /> Duplicate
                                                        </Button>

                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-950/40 text-xs"
                                                            onClick={(e) => { e.stopPropagation(); deleteQuestion(question.id); }}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <Button
                                onClick={addQuestion}
                                className="w-full py-8 border-2 border-dashed border-slate-800 hover:border-indigo-500/60 bg-slate-900/60 hover:bg-indigo-950/20 text-indigo-400 rounded-xl transition-all font-semibold"
                            >
                                <Plus className="h-5 w-5 mr-2" /> Add Question
                            </Button>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg text-indigo-400">Quick Stats & Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Subtype:</span>
                                        <span className="font-semibold text-slate-200">{survey.subtype || "Survey"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Total Questions:</span>
                                        <span className="font-semibold text-slate-200">{survey.questions?.length || 0}</span>
                                    </div>
                                    {isQuizMode && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Max Score:</span>
                                            <span className="font-bold text-amber-400">{totalPoints} Points</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Total Responses:</span>
                                        <span className="font-semibold text-slate-200">{survey.stats?.responseCount || 0}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => router.push(`/admin/surveys/${survey._id}/results`)}
                                    variant="outline"
                                    className="w-full bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                                >
                                    View Detailed Results Dashboard
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
