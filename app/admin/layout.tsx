import { Navbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { checkRole, getUserRole } from "@/lib/roles";

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

    // Check if user is admin using Clerk metadata
    const isAdmin = await checkRole('admin');
    if (!isAdmin) {
        redirect('/dashboard');
    }

    const userRole = await getUserRole();

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar userRole={userRole} />
            </div>
            <main className="md:pl-72">
                <Navbar userRole={userRole} />
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;
