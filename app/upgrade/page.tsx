"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UpgradePage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard");
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="text-slate-400 text-xs font-mono animate-pulse">
                Redirecting to dashboard...
            </div>
        </div>
    );
}
