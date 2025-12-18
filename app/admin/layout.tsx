import { Navbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AdminLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    // TODO: Add real admin role check here
    // if (user.role !== 'admin') redirect('/dashboard');

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>
            <main className="md:pl-72">
                <Navbar />
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;
