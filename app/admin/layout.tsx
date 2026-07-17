import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/roles";

// Force dynamic rendering to avoid build-time errors with Clerk
export const dynamic = 'force-dynamic';


const AdminLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    // Combine role and role name fetching to reduce Clerk API calls
    const userRole = await getUserRole();
    const isAdmin = userRole === 'admin';

    if (!isAdmin) {
        redirect('/dashboard');
    }

    return (
        <DashboardShell userRole={userRole}>
            <div className="p-6">
                {children}
            </div>
        </DashboardShell>
    );
}

export default AdminLayout;
