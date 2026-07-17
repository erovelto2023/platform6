"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignOutPage() {
    const { signOut } = useClerk();
    const router = useRouter();

    useEffect(() => {
        const handleSignOut = async () => {
            try {
                await signOut();
                router.push("/");
            } catch (err) {
                console.error("Sign out error:", err);
                router.push("/");
            }
        };

        handleSignOut();
    }, [signOut, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                <p className="text-slate-400 text-sm">Signing you out...</p>
            </div>
        </div>
    );
}
