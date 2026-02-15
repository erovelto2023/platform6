"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-bold">Something went wrong!</h2>
            <p className="text-muted-foreground max-w-sm">
                We encountered an error while loading your support ticket.
                This might be due to a connection issue or an invalid ticket ID.
            </p>
            {error.digest && (
                <p className="text-xs text-muted-foreground bg-slate-100 p-2 rounded">
                    Error Code: {error.digest}
                </p>
            )}
            <div className="flex gap-x-2">
                <Button onClick={() => reset()}>
                    Try again
                </Button>
                <Button variant="outline" onClick={() => router.push("/support")}>
                    Go back to Support
                </Button>
            </div>
        </div>
    );
}
