import { getPosts } from "@/lib/actions/community.actions";
import { currentUser } from "@clerk/nextjs/server";
import { ProfileHeader } from "./_components/profile-header";
import { getOrCreateUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { CommunityPageClient } from "./_components/community-page-client";

export default async function CommunityPage() {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    const dbCurrentUser = await getOrCreateUser();

    if (!dbCurrentUser) {
        return <div>User not found in database. Please contact support.</div>;
    }

    // Fetch global feed (public posts)
    const posts = await getPosts({ visibility: 'public' });

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            {/* Header Banner */}
            <ProfileHeader user={dbCurrentUser} isOwnProfile={true} />

            <CommunityPageClient posts={posts} currentUser={dbCurrentUser} />
        </div>
    );
}
