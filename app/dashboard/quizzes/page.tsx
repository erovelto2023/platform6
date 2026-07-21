import { getQuizzes } from "@/lib/actions/quiz.actions";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, BarChart3, Users, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function QuizzesPage() {
    const quizzes = await getQuizzes({ isPublished: true });

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Quizzes</h1>
                    <p className="text-slate-400 mt-1">Create and manage your quizzes</p>
                </div>
                <Link
                    href="/dashboard/quizzes/new"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors"
                >
                    <Plus size={18} /> Create Quiz
                </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search quizzes..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors">
                    <Filter size={18} /> Filters
                </button>
            </div>

            {/* Quiz Grid */}
            {quizzes.length === 0 ? (
                <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No quizzes yet</h3>
                    <p className="text-slate-400 mb-6">Create your first quiz to get started</p>
                    <Link
                        href="/dashboard/quizzes/new"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors"
                    >
                        <Plus size={18} /> Create Quiz
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz: any) => (
                        <div
                            key={quiz._id}
                            className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:shadow-lg hover:border-slate-700 transition-all"
                        >
                            {/* Quiz Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">{quiz.title}</h3>
                                    {quiz.category && (
                                        <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full">
                                            {quiz.category}
                                        </span>
                                    )}
                                </div>
                                <button className="text-slate-400 hover:text-slate-300">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            {/* Description */}
                            {quiz.description && (
                                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{quiz.description}</p>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                                        <Users size={14} />
                                    </div>
                                    <div className="text-lg font-bold text-white">{quiz.totalAttempts || 0}</div>
                                    <div className="text-xs text-slate-500">Attempts</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                                        <BarChart3 size={14} />
                                    </div>
                                    <div className="text-lg font-bold text-white">
                                        {quiz.averageScore ? Math.round(quiz.averageScore) : 0}%
                                    </div>
                                    <div className="text-xs text-slate-500">Avg Score</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                                        <Clock size={14} />
                                    </div>
                                    <div className="text-lg font-bold text-white">{quiz.questions?.length || 0}</div>
                                    <div className="text-xs text-slate-500">Questions</div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Link
                                    href={`/dashboard/quizzes/${quiz._id}/edit`}
                                    className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 rounded-lg transition-colors text-sm"
                                >
                                    <Edit size={16} /> Edit
                                </Link>
                                <Link
                                    href={`/quizzes/${quiz.slug}`}
                                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                                >
                                    <BarChart3 size={16} /> View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
