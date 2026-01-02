import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getUserRole } from "@/lib/roles";

// Force dynamic rendering to avoid build-time errors with Clerk
export const dynamic = 'force-dynamic';


const DashboardLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    const userRole = await getUserRole();

    return (
        <DashboardShell userRole={userRole}>
            {children}
        </DashboardShell>
    );
}

export default DashboardLayout;
