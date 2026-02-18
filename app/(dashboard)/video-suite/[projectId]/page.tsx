import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/actions/user.actions";
import { getVideoProjectById } from "@/lib/actions/video.actions";
import { VideoEditor } from "@/app/(dashboard)/video-suite/_components/video-editor";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface ProjectPageProps {
    params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    const dbCurrentUser = await getOrCreateUser();
    if (!dbCurrentUser) return <div>User not found.</div>;

    const { projectId } = await params;
    const { data: project } = await getVideoProjectById(projectId);

    if (!project) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#0B0D0F] text-white p-8">
                <h2 className="text-xl font-bold mb-4">Project not found</h2>
                <Link href="/video-suite" className="text-purple-400 hover:underline flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Video Suite
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0B0D0F] overflow-hidden">
            <VideoEditor initialProject={project} currentUser={dbCurrentUser} />
        </div>
    );
}
