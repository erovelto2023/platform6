import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getUserRole } from "@/lib/roles";

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
