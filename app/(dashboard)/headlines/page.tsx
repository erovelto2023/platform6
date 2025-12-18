import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getHeadlines } from "@/lib/actions/headline.actions";
import HeadlineVaultClient from "./_components/headline-vault-client";
import AddHeadlineModal from "./_components/add-headline-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function HeadlinesPage() {
    const { userId } = await auth();
    if (!userId) return redirect("/");

    const headlines = await getHeadlines(userId);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Headline Vault™</h1>
                    <p className="text-slate-500 mt-2">Manage, generate, and optimize your marketing headlines.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/headlines/frameworks">
                        <Button variant="outline">Framework Library</Button>
                    </Link>
                    <AddHeadlineModal userId={userId} />
                    <Link href="/headlines/generate">
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Generate New
                        </Button>
                    </Link>
                </div>
            </div>

            <HeadlineVaultClient initialHeadlines={headlines} />
        </div>
    );
}
