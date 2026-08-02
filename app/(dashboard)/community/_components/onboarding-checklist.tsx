"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, ArrowRight, UserPlus, Target, BookOpen, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserOnboardingProgress, toggleOnboardingStep } from "@/lib/actions/community.actions";
import { toast } from "sonner";

interface OnboardingChecklistProps {
    currentUser: any;
    onOpenPostModal?: () => void;
}

export function OnboardingChecklist({ currentUser, onOpenPostModal }: OnboardingChecklistProps) {
    const router = useRouter();
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            if (!currentUser?._id && !currentUser?.id) return;
            try {
                const userId = currentUser._id || currentUser.id;
                const result = await getUserOnboardingProgress(userId);
                if (result.success && result.completedSteps) {
                    setCompletedSteps(result.completedSteps);
                }
            } catch (error) {
                console.error("Failed to fetch onboarding progress:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [currentUser]);

    const steps = [
        {
            id: 1,
            title: "Introduce yourself to the community",
            description: "Say hello, tell us what business niche you're launching, and where you're from.",
            actionText: "Write intro post",
            icon: UserPlus,
            action: () => {
                if (onOpenPostModal) {
                    onOpenPostModal();
                } else {
                    router.push("/community");
                }
            }
        },
        {
            id: 2,
            title: "Set your first business goal",
            description: "Public goals hold you accountable. Share what you want to achieve in the next 30 days.",
            actionText: "Share 30-day goal",
            icon: Target,
            action: () => {
                if (onOpenPostModal) {
                    onOpenPostModal();
                } else {
                    router.push("/community");
                }
            }
        },
        {
            id: 3,
            title: "Complete Lesson 1 in Classroom",
            description: "Unlock core strategies by finishing the 'Foundations to Profits' starter module.",
            actionText: "Go to Classroom",
            icon: BookOpen,
            action: () => router.push("/catalog")
        },
        {
            id: 4,
            title: "Add your first client profile",
            description: "Check out the Accounting module and setup your first customer record.",
            actionText: "Go to Accounting",
            icon: UserCheck,
            action: () => router.push("/accounting")
        }
    ];

    const toggleStep = async (stepId: number) => {
        const userId = currentUser._id || currentUser.id;
        if (!userId) return;

        const isCurrentlyCompleted = completedSteps.includes(stepId);
        const newCompleted = isCurrentlyCompleted
            ? completedSteps.filter((id) => id !== stepId)
            : [...completedSteps, stepId];

        setCompletedSteps(newCompleted);

        try {
            await toggleOnboardingStep(userId, stepId);
            toast.success(isCurrentlyCompleted ? "Step unmarked" : "Step completed! +25 XP");
        } catch (error) {
            toast.error("Failed to update step progress");
            setCompletedSteps(completedSteps);
        }
    };

    const completionRate = Math.round((completedSteps.length / steps.length) * 100);

    return (
        <Card className="border border-slate-800 bg-slate-900 shadow-xl text-slate-100 mb-6">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
                            Welcome, {currentUser?.firstName || "Builder"}! 🚀
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-xs font-mono">
                            Get started by completing your quick onboarding checklist to set up your business workspace.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl self-start sm:self-center">
                        <span className="text-xs font-mono font-bold text-amber-400">{completionRate}% Completed</span>
                        <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500" 
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
                                        ? "bg-emerald-950/40 border-emerald-800/80" 
                                        : "bg-slate-950 border-slate-800 hover:border-orange-500/50 shadow-md"
                                }`}
                            >
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                                                isDone 
                                                    ? "bg-emerald-500 text-slate-950" 
                                                    : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                            }`}>
                                                {step.id}
                                            </span>
                                            <h4 className="font-bold text-slate-100 text-sm leading-tight">{step.title}</h4>
                                        </div>
                                        <button 
                                            onClick={() => toggleStep(step.id)}
                                            className="text-slate-500 hover:text-orange-400 transition cursor-pointer"
                                        >
                                            {isDone ? (
                                                <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-950" />
                                            ) : (
                                                <Circle className="h-5 w-5 hover:text-orange-400" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed pl-8">
                                        {step.description}
                                    </p>
                                </div>

                                <div className="pt-3 pl-8 flex justify-between items-center mt-3 border-t border-slate-800/80">
                                    <button
                                        onClick={step.action}
                                        className="text-xs font-mono font-bold text-orange-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
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
