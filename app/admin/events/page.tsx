import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { getEvents } from "@/lib/actions/event.actions";
import { EventCard } from "@/app/(dashboard)/community/events/_components/event-card";
import { CreateEventDialog } from "@/app/(dashboard)/community/events/_components/create-event-dialog";

export default async function AdminEventsPage() {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbCurrentUserDoc = await User.findOne({ clerkId: user.id });
    const dbCurrentUser = JSON.parse(JSON.stringify(dbCurrentUserDoc));

    if (!dbCurrentUser) {
        console.error("AdminEventsPage: User not found in database", user.id);
        return <div>Error: User not found. Please contact support.</div>;
    }

    const events = await getEvents();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Events Management</h1>
                    <p className="text-slate-600 mt-1">Create and manage community events.</p>
                </div>
                <CreateEventDialog userId={dbCurrentUser._id.toString()} />
            </div>

            {events.length === 0 && (
                <div className="text-center py-10 text-slate-500 bg-white rounded-lg border">
                    No events found. Create one to get started.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event: any) => (
                    <EventCard
                        key={event._id}
                        event={event}
                        currentUserId={dbCurrentUser._id.toString()}
                        isAdmin={true}
                    />
                ))}
            </div>
        </div>
    );
}
