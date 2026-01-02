import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentUserRole } from "@/lib/actions/user.actions";

// Force dynamic rendering to avoid build-time errors with Clerk
export const dynamic = 'force-dynamic';


const DashboardLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    const userRole = await getCurrentUserRole();

    return (
        <DashboardShell userRole={userRole}>
            {children}
        </DashboardShell>
    );
}

export default DashboardLayout;

