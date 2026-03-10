import { ReactNode } from "react";

export default async function ToolsLayout({
    children,
}: {
    children: ReactNode;
}) {
    // All tools are now free for all users.

    return <>{children}</>;
}
