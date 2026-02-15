"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex bg-white h-screen flex-col items-center justify-center p-6 text-center space-y-4 font-sans text-slate-900">
                    <h2 className="text-2xl font-bold">Something went wrong!</h2>
                    <p className="text-muted-foreground max-w-sm">
                        A critical error occurred. This is likely a configuration issue.
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
                    </div>
                </div>
            </body>
        </html>
    );
}
