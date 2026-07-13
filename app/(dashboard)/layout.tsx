import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getOrCreateUser } from "@/lib/actions/user.actions";
import { getUserRole } from "@/lib/roles";

// Force dynamic rendering to avoid build-time errors with Clerk
export const dynamic = 'force-dynamic';


const DashboardLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    // getOrCreateUser handles syncing Clerk users to MongoDB
    // AND linking them to a referrer if a referral cookie exists.
    await getOrCreateUser();
    const userRole = await getUserRole();

    return (
        <DashboardShell userRole={userRole}>
            {children}
        </DashboardShell>
    );
}

export default DashboardLayout;
