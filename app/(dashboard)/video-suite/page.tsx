import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/actions/user.actions";
import { getVideoProjects } from "@/lib/actions/video.actions";
import { VideoProjectCard } from "@/app/(dashboard)/video-suite/_components/video-project-card";
import { CreateProjectButton } from "@/app/(dashboard)/video-suite/_components/create-project-button";
import { Film, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function VideoSuitePage() {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    const dbCurrentUser = await getOrCreateUser();
    if (!dbCurrentUser) return <div>User not found.</div>;

    const { data: projects } = await getVideoProjects(dbCurrentUser._id);

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0B0D0F] p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto w-full">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
                            <Film className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Video Editing Suite</h1>
                            <p className="text-sm text-[#ABABAD]">Create and edit professional videos on the VPS</p>
                        </div>
                    </div>
                    <CreateProjectButton userId={dbCurrentUser._id.toString()} />
                </div>

                {projects && projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project: any) => (
                            <VideoProjectCard key={project._id} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#1A1D21] rounded-2xl border border-dashed border-[#303236]">
                        <Film className="w-16 h-16 text-[#303236] mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
                        <p className="text-[#ABABAD] mb-6 text-center max-w-xs">
                            Start by creating your first video project to see it here.
                        </p>
                        <CreateProjectButton userId={dbCurrentUser._id.toString()} variant="secondary" />
                    </div>
                )}
            </div>
        </div>
    );
}
