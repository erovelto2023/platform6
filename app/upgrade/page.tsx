"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export default function UpgradePage() {
    const router = useRouter();
    const { openUserProfile } = useClerk();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4">
            <Card className="max-w-md w-full bg-slate-900 border-slate-800 shadow-2xl">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-purple-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">Unlock Premium Access</CardTitle>
                    <CardDescription className="text-slate-400">
                        This content is exclusive to premium members.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        {[
                            "Access to all premium courses",
                            "Exclusive tools and resources",
                            "Community access",
                            "Direct support"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pt-6">
                    <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                        onClick={() => openUserProfile()}
                    >
                        Upgrade Now
                    </Button>
                    <p className="text-xs text-center text-slate-500 px-4">
                        You can also upgrade your plan by going to
                        <br />
                        <span className="font-semibold text-slate-400">Manage Account &rarr; Billing</span>
                    </p>
                    <Button
                        variant="ghost"
                        className="w-full text-slate-400 hover:text-white"
                        onClick={() => router.back()}
                    >
                        Go Back
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
