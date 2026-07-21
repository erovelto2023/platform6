import { getQuizBySlug } from "@/lib/actions/quiz.actions";
import { notFound } from "next/navigation";
import { Clock, Trophy, Play, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function QuizPage({ params }: { params: { slug: string } }) {
    const quiz = await getQuizBySlug(params.slug);

    if (!quiz) {
        notFound();
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Back Link */}
                <Link
                    href="/dashboard/quizzes"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft size={20} /> Back to Quizzes
                </Link>

                {/* Quiz Header */}
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 mb-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        {quiz.category && (
                            <span className="text-sm font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">
                                {quiz.category}
                            </span>
                        )}
                        <span className="text-sm font-semibold text-slate-400 bg-slate-800 px-3 py-1 rounded-full capitalize">
                            {quiz.difficulty}
                        </span>
                    </div>

                    <h1 className="text-4xl font-black text-white mb-4">{quiz.title}</h1>

                    {quiz.description && (
                        <p className="text-lg text-slate-300 mb-6">{quiz.description}</p>
                    )}

                    {/* Quiz Info */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="text-center p-4 bg-slate-800/50 rounded-2xl">
                            <Clock className="mx-auto text-slate-400 mb-2" size={24} />
                            <div className="text-2xl font-bold text-white">
                                {quiz.timeLimit ? `${quiz.timeLimit}m` : "No limit"}
                            </div>
                            <div className="text-sm text-slate-500">Time Limit</div>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-2xl">
                            <Trophy className="mx-auto text-amber-400 mb-2" size={24} />
                            <div className="text-2xl font-bold text-white">{quiz.passingScore}%</div>
                            <div className="text-sm text-slate-500">Passing Score</div>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-2xl">
                            <div className="mx-auto text-slate-400 mb-2 text-2xl font-bold">{quiz.questions?.length || 0}</div>
                            <div className="text-2xl font-bold text-white">Questions</div>
                            <div className="text-sm text-slate-500">Total</div>
                        </div>
                    </div>

                    {/* Start Button */}
                    <Link
                        href={`/quizzes/${quiz.slug}/take`}
                        className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
                    >
                        <Play size={24} /> Start Quiz
                    </Link>
                </div>

                {/* Quiz Stats */}
                {(quiz.totalAttempts > 0 || quiz.averageScore > 0) && (
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Quiz Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-3xl font-bold text-white">{quiz.totalAttempts}</div>
                                <div className="text-sm text-slate-500">Total Attempts</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">
                                    {quiz.averageScore ? Math.round(quiz.averageScore) : 0}%
                                </div>
                                <div className="text-sm text-slate-500">Average Score</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
