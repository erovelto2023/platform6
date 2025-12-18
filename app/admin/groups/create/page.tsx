import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { CreateGroupForm } from "../_components/create-group-form";

export default async function CreateGroupPage() {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });

    if (!dbUser) {
        return redirect("/");
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Group</h1>
                <p className="text-slate-600 mt-1">Set up a new community space.</p>
            </div>

            <CreateGroupForm userId={dbUser._id.toString()} />
        </div>
    );
}
