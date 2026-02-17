import { getChannelByToken, joinChannelByToken, getChannelMessages } from "@/lib/actions/channel.actions";
import { currentUser } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, Lock, Users } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { SlackMessage } from "@/app/(dashboard)/messages/_components/slack-message";

interface InvitePageProps {
    params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
    const { token } = await params;
    const user = await currentUser();
    const dbUser = user ? await getOrCreateUser() : null;

    const { success, data: channel, error } = await getChannelByToken(token);

    if (!success || !channel) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-red-600">Invalid Invite</CardTitle>
                        <CardDescription>
                            This invite link is invalid or has expired.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button asChild>
                            <Link href="/">Go Home</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // If user is already a member, redirect to messages
    if (dbUser && channel.members.some((m: any) => m._id === dbUser._id)) {
        redirect(`/messages`);
    }

    // Handle Join Action
    async function joinAction() {
        "use server";
        if (!dbUser) return redirect("/sign-in");
        await joinChannelByToken(token, dbUser._id);
        redirect("/messages");
    }

    // If public viewable, fetch last few messages
    let recentMessages = [];
    if (channel.isPubliclyViewable) {
        const res = await getChannelMessages(channel._id);
        if (res.success) {
            recentMessages = res.data.slice(-5); // Last 5 messages
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#3F0E40] p-4">
            <Card className="w-full max-w-lg shadow-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
                        {channel.isPrivate ? (
                            <Lock className="h-8 w-8 text-indigo-600" />
                        ) : (
                            <Hash className="h-8 w-8 text-indigo-600" />
                        )}
                    </div>
                    <CardTitle className="text-2xl">Join #{channel.name}</CardTitle>
                    <CardDescription className="text-base">
                        {channel.description || "No description provided."}
                    </CardDescription>
                    <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{channel.members.length} members</span>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Preview Messages if Public */}
                    {channel.isPubliclyViewable && recentMessages.length > 0 && (
                        <div className="rounded-lg border bg-slate-50 p-4">
                            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Recent Activity</p>
                            <div className="space-y-3">
                                {recentMessages.map((msg: any) => (
                                    <SlackMessage key={msg._id} message={msg} />
                                ))}
                            </div>
                            <div className="mt-4 text-center text-xs text-muted-foreground">
                                ... and more
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={channel.creator.profileImage} />
                            <AvatarFallback>{channel.creator.firstName[0]}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-muted-foreground">
                            Invited by <span className="font-medium text-foreground">{channel.creator.firstName} {channel.creator.lastName}</span>
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="flex-col gap-2 border-t bg-slate-50/50 p-6">
                    {user ? (
                        <form action={joinAction} className="w-full">
                            <Button className="w-full bg-[#007a5a] hover:bg-[#148567]" size="lg">
                                Join Channel
                            </Button>
                        </form>
                    ) : (
                        <div className="flex w-full flex-col gap-2">
                            <Button asChild className="w-full bg-[#007a5a] hover:bg-[#148567]" size="lg">
                                <Link href={`/sign-up?redirect_url=/invite/${token}`}>
                                    Create Account to Join
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link href={`/sign-in?redirect_url=/invite/${token}`}>
                                    Sign In
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
