import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/roles";

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

    const userRole = await getUserRole();

    return (
        <DashboardShell userRole={userRole}>
            <div className="p-6">
                {children}
            </div>
        </DashboardShell>
    );
};

export default AdminLayout;
