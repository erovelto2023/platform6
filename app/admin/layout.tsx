import { Navbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/actions/user.actions";

const AdminLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    // Check if user is admin
    const userRole = await getCurrentUserRole();
    if (userRole !== 'admin') {
        redirect('/dashboard');
    }

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
