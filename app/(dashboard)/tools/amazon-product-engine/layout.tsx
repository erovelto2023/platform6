import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "./_components/sidebar";

export default async function AmazonEngineLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    return (
        <div className="flex h-full flex-col md:flex-row">
            <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50 mt-[80px]">
                <Sidebar />
            </div>
            <main className="md:pl-64 h-full w-full">
                {children}
            </main>
        </div>
    );
}
