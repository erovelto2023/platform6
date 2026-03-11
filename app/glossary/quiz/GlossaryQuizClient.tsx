"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Trophy, RefreshCw, CheckCircle2, XCircle, ChevronRight, Brain } from "lucide-react";

interface Term {
    slug: string;
    term: string;
    shortDefinition: string;
    category?: string;
    contentLevel?: string;
}

interface Question {
    term: Term;
    choices: string[];
    correctIndex: number;
}

function buildQuiz(terms: Term[], count = 10): Question[] {
    const pool = [...terms].sort(() => Math.random() - 0.5).slice(0, Math.min(count * 3, terms.length));
    const questions: Question[] = [];

    for (const term of pool.slice(0, count)) {
        const distractors = pool
            .filter(t => t.slug !== term.slug && t.shortDefinition)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(t => t.shortDefinition);

        if (distractors.length < 3) continue;
        const correctIndex = Math.floor(Math.random() * 4);
        const choices = [...distractors];
        choices.splice(correctIndex, 0, term.shortDefinition);
        questions.push({ term, choices, correctIndex });
    }

    return questions;
}

export default function GlossaryQuizClient({ terms }: { terms: Term[] }) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);
    const [answers, setAnswers] = useState<boolean[]>([]);
    const [difficulty, setDifficulty] = useState<string>("all");

    const startQuiz = useCallback(() => {
        const filtered = difficulty === "all" ? terms : terms.filter(t => t.contentLevel === difficulty);
        const q = buildQuiz(filtered.filter(t => t.shortDefinition));
        setQuestions(q);
        setCurrent(0);
        setSelected(null);
        setScore(0);
        setDone(false);
        setAnswers([]);
    }, [terms, difficulty]);

    useEffect(() => { startQuiz(); }, [startQuiz]);

    const handleSelect = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        const correct = idx === questions[current].correctIndex;
        if (correct) setScore(s => s + 1);
        setAnswers(a => [...a, correct]);
    };

    const next = () => {
        if (current + 1 >= questions.length) {
            setDone(true);
        } else {
            setCurrent(c => c + 1);
            setSelected(null);
        }
    };

    if (!questions.length) return (
        <div className="text-center py-20 text-slate-500">
            Not enough terms with definitions to build a quiz. Import more terms first.
        </div>
    );

    if (done) return (
        <div className="max-w-xl mx-auto text-center py-16 px-6">
            <Trophy size={56} className="mx-auto text-amber-400 mb-6" />
            <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2">Quiz Complete!</h2>
            <p className="text-xl text-slate-500 mb-8">
                You scored <strong className="text-emerald-600">{score}</strong> out of <strong>{questions.length}</strong>
            </p>
            <div className="grid grid-cols-5 gap-2 mb-10 justify-center">
                {answers.map((correct, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${correct ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                        {correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    </div>
                ))}
            </div>
            <div className="flex gap-4 justify-center">
                <button
                    onClick={startQuiz}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
                >
                    <RefreshCw size={18} /> Try Again
                </button>
                <Link href="/glossary" className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 px-8 rounded-xl transition-colors">
                    Browse Glossary
                </Link>
            </div>
        </div>
    );

    const q = questions[current];

    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <select
                        value={difficulty}
                        onChange={e => { setDifficulty(e.target.value); }}
                        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 dark:border-slate-700 font-semibold outline-none"
                    >
                        <option value="all">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                    <button onClick={startQuiz} className="text-sm text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors">
                        <RefreshCw size={14} /> New Quiz
                    </button>
                </div>
                <div className="text-sm font-bold text-slate-500">
                    {current + 1} / {questions.length}
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${((current) / questions.length) * 100}%` }}
                />
            </div>

            {/* Score */}
            <div className="flex items-center gap-2 mb-6 text-sm font-semibold text-slate-500">
                <Trophy size={16} className="text-amber-400" /> Score: {score}
            </div>

            {/* Question */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm mb-6">
                <p className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3">What does this mean?</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">{q.term.term}</h3>
                {q.term.category && (
                    <span className="mt-2 inline-block text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-full px-3 py-1 font-semibold">
                        {q.term.category}
                    </span>
                )}
            </div>

            {/* Choices */}
            <div className="space-y-3">
                {q.choices.map((choice, idx) => {
                    let btnClass = "w-full text-left p-4 rounded-2xl border-2 font-semibold text-sm transition-all ";
                    if (selected === null) {
                        btnClass += "border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300";
                    } else if (idx === q.correctIndex) {
                        btnClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300";
                    } else if (idx === selected && selected !== q.correctIndex) {
                        btnClass += "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-600";
                    } else {
                        btnClass += "border-slate-100 dark:border-slate-700 text-slate-400 opacity-60";
                    }

                    return (
                        <button key={idx} onClick={() => handleSelect(idx)} className={btnClass}>
                            <span className="font-black mr-3 text-slate-400">{String.fromCharCode(65 + idx)}.</span>
                            {choice}
                        </button>
                    );
                })}
            </div>

            {selected !== null && (
                <div className="mt-6 text-center">
                    {selected === q.correctIndex ? (
                        <p className="text-emerald-600 font-bold text-lg mb-4">✓ Correct!</p>
                    ) : (
                        <p className="text-red-500 font-bold text-lg mb-4">✗ Not quite — the correct answer is highlighted above.</p>
                    )}
                    <div className="flex gap-3 justify-center">
                        <Link href={`/glossary/${q.term.slug}`} className="text-sm text-slate-500 hover:text-emerald-600 underline">
                            Read full definition →
                        </Link>
                        <button onClick={next} className="flex items-center gap-2 bg-black hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors">
                            {current + 1 >= questions.length ? "See Results" : "Next"} <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
