import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { getEvents } from "@/lib/actions/event.actions";
import { EventCard } from "./_components/event-card";
import { CreateEventDialog } from "./_components/create-event-dialog";
import { ProfileHeader } from "@/app/(dashboard)/community/_components/profile-header";
import { CommunitySidebar } from "@/app/(dashboard)/community/_components/community-sidebar";

export default async function EventsPage() {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbCurrentUserDoc = await User.findOne({ clerkId: user.id });
    const dbCurrentUser = JSON.parse(JSON.stringify(dbCurrentUserDoc));

    if (!dbCurrentUser) return redirect("/sign-in");

    const events = await getEvents();
    const isAdmin = dbCurrentUser.role === 'admin';

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <ProfileHeader user={dbCurrentUser} isOwnProfile={true} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="hidden lg:block space-y-6">
                    <CommunitySidebar user={dbCurrentUser} />
                </div>

                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Upcoming Events</h1>
                        {isAdmin && <CreateEventDialog userId={dbCurrentUser._id.toString()} />}
                    </div>

                    {events.length === 0 && (
                        <div className="text-center py-10 text-slate-500 bg-white rounded-lg border">
                            No upcoming events scheduled.
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {events.map((event: any) => (
                            <EventCard
                                key={event._id}
                                event={event}
                                currentUserId={dbCurrentUser._id.toString()}
                                isAdmin={isAdmin}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
