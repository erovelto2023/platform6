"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuiz } from "@/lib/actions/quiz.actions";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function NewQuizPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        category: "",
        difficulty: "beginner",
        timeLimit: "",
        passingScore: "70",
        accessLevel: "public",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const quiz = await createQuiz({
                ...formData,
                slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
                timeLimit: formData.timeLimit ? parseInt(formData.timeLimit) : undefined,
                passingScore: parseInt(formData.passingScore),
                createdBy: "user-id", // Will replace with actual user ID
            });
            router.push(`/dashboard/quizzes/${quiz._id}/edit`);
        } catch (error) {
            console.error("Failed to create quiz:", error);
            alert("Failed to create quiz. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/dashboard/quizzes"
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} /> Back
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white">Create New Quiz</h1>
                    <p className="text-slate-400 mt-1">Set up your quiz details</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Quiz Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Accounting Fundamentals Quiz"
                            className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Slug */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            URL Slug
                        </label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="accounting-fundamentals-quiz"
                            className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">Leave empty to auto-generate from title</p>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe what this quiz covers..."
                            rows={3}
                            className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Category
                        </label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="e.g., Accounting"
                            className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Difficulty Level
                        </label>
                        <select
                            value={formData.difficulty}
                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    {/* Time Limit */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Time Limit (minutes)
                        </label>
                        <input
                            type="number"
                            value={formData.timeLimit}
                            onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                            placeholder="e.g., 30"
                            min="1"
                            className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">Leave empty for no time limit</p>
                    </div>

                    {/* Passing Score */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Passing Score (%)
                        </label>
                        <input
                            type="number"
                            value={formData.passingScore}
                            onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
                            placeholder="70"
                            min="0"
                            max="100"
                            className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Access Level */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Access Level
                        </label>
                        <select
                            value={formData.accessLevel}
                            onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="public">Public</option>
                            <option value="members">Members Only</option>
                            <option value="paid">Paid Members Only</option>
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-slate-800">
                    <Link
                        href="/dashboard/quizzes"
                        className="px-6 py-2.5 border border-slate-700 rounded-xl text-slate-300 font-semibold hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors"
                    >
                        <Save size={18} />
                        {loading ? "Creating..." : "Create Quiz"}
                    </button>
                </div>
            </form>
        </div>
    );
}
