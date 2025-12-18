"use client";

import { useState } from "react";
import { updateSurvey } from "@/lib/actions/survey.actions";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, GripVertical, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

interface Question {
    id: string;
    type: string;
    text: string;
    description?: string;
    options?: string[];
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

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSurvey(survey._id, survey);
            toast.success("Survey saved successfully");
        } catch (error) {
            toast.error("Failed to save survey");
        } finally {
            setIsSaving(false);
        }
    };

    const addQuestion = () => {
        const newQuestion: Question = {
            id: uuidv4(),
            type: "short_text",
            text: "New Question",
            required: false,
            options: [],
        };
        setSurvey({
            ...survey,
            questions: [...(survey.questions || []), newQuestion],
        });
        setActiveQuestionId(newQuestion.id);
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

    return (
        <div className="max-w-5xl mx-auto p-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-sm py-4 z-10 border-b">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/admin/surveys')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Survey Builder</h1>
                        <p className="text-sm text-slate-500">{survey.status}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 mr-4">
                        <Switch
                            checked={survey.status === 'Active'}
                            onCheckedChange={(checked) => setSurvey({ ...survey, status: checked ? 'Active' : 'Draft' })}
                        />
                        <Label>Published</Label>
                    </div>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Questions */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Survey Title</Label>
                                <Input
                                    value={survey.title}
                                    onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={survey.description}
                                    onChange={(e) => setSurvey({ ...survey, description: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        {survey.questions?.map((question: Question, index: number) => (
                            <Card key={question.id} className={`transition-all ${activeQuestionId === question.id ? 'ring-2 ring-indigo-500' : ''}`}>
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col gap-2 pt-2 text-slate-400">
                                            <GripVertical className="h-5 w-5 cursor-move" />
                                            <div className="flex flex-col gap-1">
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveQuestion(index, 'up')} disabled={index === 0}>↑</Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveQuestion(index, 'down')} disabled={index === survey.questions.length - 1}>↓</Button>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-2 flex-1 mr-4">
                                                    <Input
                                                        value={question.text}
                                                        onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                                                        className="font-medium text-lg border-transparent hover:border-slate-200 focus:border-indigo-500 px-0"
                                                        placeholder="Question Text"
                                                    />
                                                </div>
                                                <Select
                                                    value={question.type}
                                                    onValueChange={(value) => updateQuestion(question.id, { type: value })}
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="short_text">Short Text</SelectItem>
                                                        <SelectItem value="long_text">Long Text</SelectItem>
                                                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                                        <SelectItem value="checkbox">Checkboxes</SelectItem>
                                                        <SelectItem value="dropdown">Dropdown</SelectItem>
                                                        <SelectItem value="rating">Rating</SelectItem>
                                                        <SelectItem value="date">Date</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <Input
                                                value={question.description || ''}
                                                onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
                                                placeholder="Description (optional)"
                                                className="text-sm text-slate-500"
                                            />

                                            {/* Options Editor for Choice Types */}
                                            {['multiple_choice', 'checkbox', 'dropdown'].includes(question.type) && (
                                                <div className="space-y-2 pl-4 border-l-2 border-slate-100">
                                                    <Label className="text-xs text-slate-500 uppercase">Options</Label>
                                                    {question.options?.map((option, optIndex) => (
                                                        <div key={optIndex} className="flex gap-2">
                                                            <Input
                                                                value={option}
                                                                onChange={(e) => {
                                                                    const newOptions = [...(question.options || [])];
                                                                    newOptions[optIndex] = e.target.value;
                                                                    updateQuestion(question.id, { options: newOptions });
                                                                }}
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    const newOptions = question.options?.filter((_, i) => i !== optIndex);
                                                                    updateQuestion(question.id, { options: newOptions });
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-slate-400" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateQuestion(question.id, { options: [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`] })}
                                                    >
                                                        Add Option
                                                    </Button>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between pt-4 border-t">
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={question.required}
                                                        onCheckedChange={(checked) => updateQuestion(question.id, { required: checked })}
                                                    />
                                                    <Label>Required</Label>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => deleteQuestion(question.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Button onClick={addQuestion} className="w-full py-8 border-dashed" variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
                        </Button>
                    </div>
                </div>

                {/* Sidebar - Settings */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Allow Anonymous</Label>
                                <Switch
                                    checked={survey.settings?.allowAnonymous}
                                    onCheckedChange={(checked) => setSurvey({
                                        ...survey,
                                        settings: { ...survey.settings, allowAnonymous: checked }
                                    })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Show Results After</Label>
                                <Switch
                                    checked={survey.settings?.showResultsAfterSubmit}
                                    onCheckedChange={(checked) => setSurvey({
                                        ...survey,
                                        settings: { ...survey.settings, showResultsAfterSubmit: checked }
                                    })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
