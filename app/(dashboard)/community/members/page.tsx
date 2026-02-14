import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/actions/user.actions";
import { searchMembers } from "@/lib/actions/member.actions";
import { MemberSearch } from "./_components/member-search";
import { MemberCard } from "./_components/member-card";

interface MembersPageProps {
    searchParams: Promise<{
        q?: string;
        role?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
    const user = await currentUser();
    if (!user) {
        console.log('No user found, redirecting to sign-in');
        return redirect("/sign-in");
    }

    console.log('User found:', user.id);

    const dbUser = await getOrCreateUser();

    if (!dbUser) {
        console.log('No database user found for clerkId:', user.id);
        return redirect("/sign-in");
    }

    console.log('Database user found:', dbUser._id.toString());

    const params = await searchParams;
    const page = Number(params.page) || 1;
    const { data: members, totalPages, totalMembers } = await searchMembers({
        query: params.q,
        filters: {
            role: params.role === "all" ? undefined : params.role,
        },
        sort: params.sort,
        page,
        limit: 20,
        currentUserId: dbUser._id.toString()
    });

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Community Members</h1>
                <p className="text-slate-500 mt-2">
                    Connect with {totalMembers} other members in the community.
                </p>
            </div>

            <MemberSearch />

            {members.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {members.map((member: any) => (
                        <MemberCard
                            key={member._id}
                            member={member}
                            currentUserId={dbUser._id.toString()}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                    <p className="text-slate-500">No members found matching your search.</p>
                </div>
            )}
        </div>
    );
}
