import { auth } from "@clerk/nextjs/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getUserRole } from "@/lib/roles";

export const dynamic = 'force-dynamic';

export default async function GlossaryLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    if (userId) {
        const userRole = await getUserRole();
        return (
            <DashboardShell userRole={userRole}>
                {children}
            </DashboardShell>
        );
    }

    // Not logged in — render without sidebar
    return <>{children}</>;
}
