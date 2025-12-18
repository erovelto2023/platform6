import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import Headline from "@/lib/db/models/Headline";
import HeadlineDetailClient from "./_components/headline-detail-client";

export default async function HeadlineDetailPage({ params }: { params: { headlineId: string } }) {
    const { userId } = await auth();
    if (!userId) return redirect("/");

    await connectToDatabase();
    const headline = await Headline.findOne({ _id: params.headlineId, userId }).lean();

    if (!headline) {
        return redirect("/headlines");
    }

    return (
        <div className="p-6">
            <HeadlineDetailClient headline={JSON.parse(JSON.stringify(headline))} />
        </div>
    );
}
