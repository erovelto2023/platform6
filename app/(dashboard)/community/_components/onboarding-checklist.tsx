"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Circle, ArrowRight, Sparkles, BookOpen, UserPlus, Send } from "lucide-react";
import { useRouter } from "next/navigation";

interface OnboardingChecklistProps {
    currentUser: any;
}

export function OnboardingChecklist({ currentUser }: OnboardingChecklistProps) {
    const router = useRouter();
    
    // We keep track of completed steps in local storage so it persists for the user
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(`p6_onboarding_steps_${currentUser?._id}`);
        if (stored) {
            try {
                setCompletedSteps(JSON.parse(stored));
            } catch (e) {
                console.error(e);
            }
        }
    }, [currentUser]);

    const steps = [
        {
            id: 1,
            title: "Introduce yourself to the community",
            description: "Say hello, tell us what business niche you're launching, and where you're from.",
            actionText: "Write intro post",
            icon: Sparkles,
            action: () => {
                // Focus the post box and insert intro template
                const textarea = document.querySelector('textarea');
                if (textarea) {
                    textarea.value = `👋 Hey everyone! Just joined the K Business Academy community.\n\n📍 Based in: [Your City]\n📦 My Niche: [e.g. SaaS, Dropshipping, Agency]\n🎯 Current Goal: [Your next milestone]\n\nLet's grow together! #IntroduceYourself`;
                    // Trigger textarea input event so React state updates
                    const event = new Event('input', { bubbles: true });
                    textarea.dispatchEvent(event);
                    textarea.focus();
                    // Scroll to textarea smoothly
                    textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        },
        {
            id: 2,
            title: "Set your first business goal",
            description: "Public goals hold you accountable. Share what you want to achieve in the next 30 days.",
            actionText: "Share 30-day goal",
            icon: Send,
            action: () => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                    textarea.value = `🎯 MY 30-DAY BUSINESS GOAL:\n\n1. Revenue/Sales target: \n2. Primary action focus: \n3. Daily habit I'm building:\n\n#DropshippingSprint #BusinessGoals`;
                    const event = new Event('input', { bubbles: true });
                    textarea.dispatchEvent(event);
                    textarea.focus();
                    textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        },
        {
            id: 3,
            title: "Complete Lesson 1 in Classroom",
            description: "Unlock core strategies by finishing the 'Foundations to Profits' starter module.",
            actionText: "Go to Classroom",
            icon: BookOpen,
            action: () => {
                router.push("/courses");
            }
        },
        {
            id: 4,
            title: "Add your first client profile",
            description: "Check out the Accounting module and setup your first customer record.",
            actionText: "Go to Accounting",
            icon: UserPlus,
            action: () => {
                router.push("/accounting");
            }
        }
    ];

    const toggleStep = (id: number) => {
        let updated: number[];
        if (completedSteps.includes(id)) {
            updated = completedSteps.filter(s => s !== id);
        } else {
            updated = [...completedSteps, id];
        }
        setCompletedSteps(updated);
        localStorage.setItem(`p6_onboarding_steps_${currentUser?._id}`, JSON.stringify(updated));
    };

    const completionRate = Math.round((completedSteps.length / steps.length) * 100);

    return (
        <Card className="border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/5 to-purple-50/10 shadow-md">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            Welcome, {currentUser?.firstName || "Builder"}! 🚀
                        </CardTitle>
                        <CardDescription className="text-slate-500">
                            Get started by completing your quick onboarding checklist to set up your business workspace.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100/60 px-3.5 py-1.5 rounded-xl self-start sm:self-center">
                        <span className="text-xs font-bold text-indigo-700">{completionRate}% Completed</span>
                        <div className="w-16 bg-indigo-100 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {steps.map((step) => {
                        const isDone = completedSteps.includes(step.id);
                        const StepIcon = step.icon;

                        return (
                            <div 
                                key={step.id} 
                                className={`p-4 rounded-2xl border transition duration-200 flex flex-col justify-between ${
                                    isDone 
                                        ? "bg-emerald-50/40 border-emerald-100" 
                                        : "bg-white border-slate-100 hover:border-indigo-100 shadow-sm"
                                }`}
                            >
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                                                isDone 
                                                    ? "bg-emerald-500 text-white" 
                                                    : "bg-indigo-50 text-indigo-600"
                                            }`}>
                                                {step.id}
                                            </span>
                                            <h4 className="font-bold text-slate-800 text-sm leading-tight">{step.title}</h4>
                                        </div>
                                        <button 
                                            onClick={() => toggleStep(step.id)}
                                            className="text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                                        >
                                            {isDone ? (
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                                            ) : (
                                                <Circle className="h-5 w-5 hover:text-indigo-600" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed pl-8">
                                        {step.description}
                                    </p>
                                </div>

                                <div className="pt-3 pl-8 flex justify-between items-center mt-3 border-t border-slate-100/50">
                                    <button
                                        onClick={step.action}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                                    >
                                        <StepIcon className="h-3.5 w-3.5" />
                                        {step.actionText}
                                        <ArrowRight className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
