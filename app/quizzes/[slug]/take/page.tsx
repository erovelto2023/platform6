"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getQuizBySlug, submitQuizAttempt } from "@/lib/actions/quiz.actions";
import { Clock, Trophy, CheckCircle2, XCircle, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TakeQuizPage() {
    const router = useRouter();
    const params = useParams();
    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [startedAt] = useState(new Date());

    useEffect(() => {
        if (params?.slug) {
            loadQuiz();
        }
    }, [params?.slug]);

    useEffect(() => {
        if (quiz?.timeLimit && timeLeft === null) {
            setTimeLeft(quiz.timeLimit * 60);
        }
    }, [quiz]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null || prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const loadQuiz = async () => {
        try {
            const data = await getQuizBySlug(params?.slug as string);
            setQuiz(data);
        } catch (error) {
            console.error("Failed to load quiz:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (answer: any) => {
        const questionId = quiz.questions[currentQuestion]._id;
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = async () => {
        const answerArray = Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
        }));

        try {
            const result = await submitQuizAttempt({
                quizId: quiz._id,
                userId: "user-id", // Replace with actual user ID
                answers: answerArray,
                startedAt,
            });
            setResults(result);
            setShowResults(true);
        } catch (error) {
            console.error("Failed to submit quiz:", error);
            alert("Failed to submit quiz. Please try again.");
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-slate-400">Loading quiz...</div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-white mb-2">Quiz not found</h2>
                    <Link href="/quizzes" className="text-indigo-400 hover:underline">
                        Back to quizzes
                    </Link>
                </div>
            </div>
        );
    }

    if (showResults && results) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="max-w-2xl w-full bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-lg text-center">
                    <Trophy size={64} className="mx-auto text-amber-400 mb-6" />
                    <h2 className="text-4xl font-black text-white mb-2">
                        {results.passed ? "Congratulations!" : "Quiz Complete"}
                    </h2>
                    <p className="text-xl text-slate-300 mb-8">
                        You scored <strong className={results.passed ? "text-emerald-400" : "text-red-400"}>
                            {results.score} / {results.totalPoints}
                        </strong> ({Math.round(results.percentage)}%)
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-800/50 rounded-2xl p-4">
                            <div className="text-2xl font-bold text-white">{results.percentage.toFixed(1)}%</div>
                            <div className="text-sm text-slate-500">Score</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-2xl p-4">
                            <div className="text-2xl font-bold text-white">
                                {Math.floor(results.timeSpent / 60)}m {results.timeSpent % 60}s
                            </div>
                            <div className="text-sm text-slate-500">Time</div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-8">
                        {results.answers.map((ans: any, idx: number) => (
                            <div
                                key={idx}
                                className={`flex items-center gap-3 p-3 rounded-xl ${
                                    ans.isCorrect
                                        ? "bg-emerald-900/20 text-emerald-300"
                                        : "bg-red-900/20 text-red-400"
                                }`}
                            >
                                {ans.isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                <span className="flex-1 text-left font-semibold">
                                    Question {idx + 1}
                                </span>
                                <span className="text-sm">{ans.pointsEarned} pts</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Link
                            href={`/quizzes/${quiz.slug}`}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-6 rounded-xl transition-colors"
                        >
                            Back to Quiz
                        </Link>
                        <Link
                            href="/dashboard/quizzes"
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                        >
                            More Quizzes
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];
    const currentAnswer = answers[question._id];

    return (
        <div className="min-h-screen">
            <div className="max-w-3xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href={`/quizzes/${quiz.slug}`}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        ← Back
                    </Link>
                    {timeLeft !== null && (
                        <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                            <Clock size={18} className="text-slate-400" />
                            <span className="font-mono font-semibold text-white">
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-400">
                            Question {currentQuestion + 1} of {quiz.questions.length}
                        </span>
                        <span className="text-sm font-semibold text-slate-400">
                            {Object.keys(answers).length} answered
                        </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-lg mb-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-black text-indigo-400">
                                {currentQuestion + 1}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {question.question}
                            </h2>
                            {question.explanation && (
                                <p className="text-sm text-slate-400">{question.explanation}</p>
                            )}
                        </div>
                        <span className="text-sm font-semibold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                            {question.points} pts
                        </span>
                    </div>

                    {/* Question Image */}
                    {question.imageUrl && (
                        <div className="mb-6 rounded-2xl overflow-hidden">
                            <img src={question.imageUrl} alt="Question" className="w-full h-auto" />
                        </div>
                    )}

                    {/* Answer Options */}
                    <div className="space-y-3">
                        {question.type === "multiple-choice" && question.options?.map((option: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full text-left p-4 rounded-2xl border-2 font-semibold transition-all ${
                                    currentAnswer === idx
                                        ? "border-indigo-500 bg-indigo-900/20 text-indigo-300"
                                        : "border-slate-700 hover:border-indigo-500 hover:bg-indigo-900/10 text-slate-300"
                                }`}
                            >
                                <span className="inline-block w-8 font-black text-slate-500 mr-3">{String.fromCharCode(65 + idx)}.</span>
                                {option}
                            </button>
                        ))}

                        {question.type === "true-false" && (
                            <div className="grid grid-cols-2 gap-4">
                                {["true", "false"].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswer(option)}
                                        className={`p-6 rounded-2xl border-2 font-bold text-xl capitalize transition-all ${
                                            currentAnswer === option
                                                ? "border-indigo-500 bg-indigo-900/20 text-indigo-300"
                                                : "border-slate-700 hover:border-indigo-500 hover:bg-indigo-900/10 text-slate-300"
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}

                        {question.type === "short-answer" && (
                            <input
                                type="text"
                                value={currentAnswer || ""}
                                onChange={(e) => handleAnswer(e.target.value)}
                                placeholder="Type your answer..."
                                className="w-full px-4 py-4 border-2 border-slate-700 rounded-2xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                        Previous
                    </button>

                    <div className="flex items-center gap-2">
                        {currentQuestion === quiz.questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={!answers[question._id]}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-bold py-3 px-8 rounded-xl transition-colors"
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-colors"
                            >
                                Next <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Question Navigator */}
                <div className="mt-8 bg-slate-900 rounded-2xl border border-slate-800 p-4">
                    <p className="text-sm font-semibold text-slate-400 mb-3">Jump to question:</p>
                    <div className="flex flex-wrap gap-2">
                        {quiz.questions.map((q: any, idx: number) => (
                            <button
                                key={q._id}
                                onClick={() => setCurrentQuestion(idx)}
                                className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${
                                    currentQuestion === idx
                                        ? "bg-indigo-600 text-white"
                                        : answers[q._id] !== undefined
                                        ? "bg-indigo-900/30 text-indigo-300"
                                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
