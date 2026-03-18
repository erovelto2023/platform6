import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getUserRole } from "@/lib/roles";
import { getStates } from "@/lib/actions/location.actions";

// Force dynamic rendering to avoid build-time errors with Clerk
export const dynamic = 'force-dynamic';


const DashboardLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    const userRole = await getUserRole();
    const states = await getStates();

    return (
        <DashboardShell userRole={userRole} states={states}>
            {children}
        </DashboardShell>
    );
}

export default DashboardLayout;
