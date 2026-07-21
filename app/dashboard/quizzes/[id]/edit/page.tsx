"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getQuizById, addQuestion, updateQuestion, deleteQuestion, publishQuiz, unpublishQuiz, updateQuiz } from "@/lib/actions/quiz.actions";
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Eye, EyeOff, ChevronRight, ChevronDown, Settings } from "lucide-react";
import Link from "next/link";

export default function EditQuizPage() {
    const router = useRouter();
    const params = useParams();
    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (params?.id) loadQuiz();
    }, [params?.id]);

    const loadQuiz = async () => {
        if (!params?.id) return;
        try {
            const id = Array.isArray(params.id) ? params.id[0] : params.id;
            const data = await getQuizById(id);
            setQuiz(data);
        } catch (error) {
            console.error("Failed to load quiz:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuiz = async (data: any) => {
        if (!quiz || !params?.id) return;
        try {
            const id = Array.isArray(params.id) ? params.id[0] : params.id;
            const updatedQuiz = await updateQuiz(id, data);
            setQuiz(updatedQuiz);
        } catch (error) {
            console.error("Failed to update quiz:", error);
        }
    };

    const handleAddQuestion = async () => {
        if (!quiz) return;
        setSaving(true);
        try {
            const updatedQuiz = await addQuestion(quiz._id, {
                type: "multiple-choice",
                question: "New Question",
                options: ["Option A", "Option B", "Option C", "Option D"],
                correctAnswer: 0,
                points: 1,
            });
            setQuiz(updatedQuiz);
            setExpandedQuestions(new Set([...expandedQuestions, updatedQuiz.questions[updatedQuiz.questions.length - 1]._id]));
        } catch (error) {
            console.error("Failed to add question:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateQuestion = async (questionId: string, data: any) => {
        if (!quiz) return;
        try {
            const updatedQuiz = await updateQuestion(quiz._id, questionId, data);
            setQuiz(updatedQuiz);
        } catch (error) {
            console.error("Failed to update question:", error);
        }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        if (!quiz || !confirm("Are you sure you want to delete this question?")) return;
        try {
            const updatedQuiz = await deleteQuestion(quiz._id, questionId);
            setQuiz(updatedQuiz);
        } catch (error) {
            console.error("Failed to delete question:", error);
        }
    };

    const togglePublish = async () => {
        if (!quiz) return;
        try {
            if (quiz.isPublished) {
                const updatedQuiz = await unpublishQuiz(quiz._id);
                setQuiz(updatedQuiz);
            } else {
                const updatedQuiz = await publishQuiz(quiz._id);
                setQuiz(updatedQuiz);
            }
        } catch (error) {
            console.error("Failed to toggle publish:", error);
        }
    };

    const toggleExpand = (questionId: string) => {
        const newExpanded = new Set(expandedQuestions);
        if (newExpanded.has(questionId)) {
            newExpanded.delete(questionId);
        } else {
            newExpanded.add(questionId);
        }
        setExpandedQuestions(newExpanded);
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="text-slate-500">Loading quiz...</div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="p-8">
                <div className="text-center py-20">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Quiz not found</h2>
                    <Link href="/dashboard/quizzes" className="text-emerald-600 hover:underline">
                        Back to quizzes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/dashboard/quizzes"
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} /> Back
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white">{quiz.title}</h1>
                    <p className="text-slate-400 mt-1">{quiz.questions?.length || 0} questions</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="flex items-center gap-2 px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                        <Settings size={18} /> Settings
                    </button>
                    <button
                        onClick={togglePublish}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-colors ${
                            quiz.isPublished
                                ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                : "bg-indigo-600 hover:bg-indigo-500 text-white"
                        }`}
                    >
                        {quiz.isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
                        {quiz.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                        href={`/quizzes/${quiz.slug}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors"
                    >
                        Preview
                    </Link>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quiz Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Time Limit (min)</label>
                            <input
                                type="number"
                                defaultValue={quiz.timeLimit || ""}
                                onChange={(e) => handleUpdateQuiz({ timeLimit: e.target.value ? parseInt(e.target.value) : null })}
                                placeholder="No limit"
                                className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Passing Score (%)</label>
                            <input
                                type="number"
                                defaultValue={quiz.passingScore}
                                onChange={(e) => handleUpdateQuiz({ passingScore: parseInt(e.target.value) })}
                                min="0"
                                max="100"
                                className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Show Results</label>
                            <select
                                defaultValue={quiz.showResults}
                                onChange={(e) => handleUpdateQuiz({ showResults: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="immediately">Immediately</option>
                                <option value="after-completion">After Completion</option>
                                <option value="never">Never</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Questions List */}
            <div className="space-y-4">
                {quiz.questions?.map((question: any, index: number) => (
                    <div
                        key={question._id}
                        className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden"
                    >
                        {/* Question Header */}
                        <div
                            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-800 transition-colors"
                            onClick={() => toggleExpand(question._id)}
                        >
                            <GripVertical className="text-slate-400" size={20} />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-500">Q{index + 1}</span>
                                    <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-1 rounded-full">
                                        {question.type}
                                    </span>
                                </div>
                                <p className="font-semibold text-white mt-1 line-clamp-1">
                                    {question.question}
                                </p>
                            </div>
                            <span className="text-sm text-slate-400">{question.points} pts</span>
                            {expandedQuestions.has(question._id) ? (
                                <ChevronDown className="text-slate-400" size={20} />
                            ) : (
                                <ChevronRight className="text-slate-400" size={20} />
                            )}
                        </div>

                        {/* Question Details */}
                        {expandedQuestions.has(question._id) && (
                            <div className="p-4 pt-0 border-t border-slate-800">
                                <div className="space-y-4 mt-4">
                                    {/* Question Text */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                                            Question
                                        </label>
                                        <textarea
                                            value={question.question}
                                            onChange={(e) => handleUpdateQuestion(question._id, { question: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                        />
                                    </div>

                                    {/* Options for Multiple Choice */}
                                    {question.type === "multiple-choice" && (
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                                Options (select correct answer)
                                            </label>
                                            <div className="space-y-2">
                                                {question.options?.map((option: string, optIndex: number) => (
                                                    <div key={optIndex} className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name={`correct-${question._id}`}
                                                            checked={question.correctAnswer === optIndex}
                                                            onChange={() => handleUpdateQuestion(question._id, { correctAnswer: optIndex })}
                                                            className="w-4 h-4 text-indigo-600"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => {
                                                                const newOptions = [...question.options];
                                                                newOptions[optIndex] = e.target.value;
                                                                handleUpdateQuestion(question._id, { options: newOptions });
                                                            }}
                                                            className="flex-1 px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Points */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                                Points
                                            </label>
                                            <input
                                                type="number"
                                                value={question.points}
                                                onChange={(e) => handleUpdateQuestion(question._id, { points: parseInt(e.target.value) })}
                                                min="1"
                                                className="w-24 px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                                Explanation
                                            </label>
                                            <input
                                                type="text"
                                                value={question.explanation || ""}
                                                onChange={(e) => handleUpdateQuestion(question._id, { explanation: e.target.value })}
                                                placeholder="Optional explanation"
                                                className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDeleteQuestion(question._id)}
                                        className="flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold text-sm"
                                    >
                                        <Trash2 size={16} /> Delete Question
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Question Button */}
            <button
                onClick={handleAddQuestion}
                disabled={saving}
                className="w-full mt-6 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-700 rounded-2xl text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors font-semibold"
            >
                <Plus size={20} />
                {saving ? "Adding..." : "Add Question"}
            </button>
        </div>
    );
}
