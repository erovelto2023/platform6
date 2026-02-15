import Link from "next/link";
import { getNicheBoxes } from "@/lib/actions/niche.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Lightbulb } from "lucide-react";
import { checkSubscription } from "@/lib/check-subscription";
import { redirect } from "next/navigation";

export default async function NicheBoxesPage() {
    // const isPro = await checkSubscription();
    // 
    // if (!isPro) {
    //    return redirect("/upgrade");
    // }

    const niches = await getNicheBoxes();

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-3xl font-bold">Niche Boxes</h1>
                <p className="text-muted-foreground">
                    Complete "Business in a Box" blueprints to jumpstart your next venture.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {niches.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground mt-10">
                        No niche boxes available yet. Check back soon!
                    </div>
                ) : (
                    niches.map((niche: any) => (
                        <Link href={`/niche-catalog/${niche._id}`} key={niche._id}>
                            <Card className="hover:shadow-lg transition cursor-pointer h-full border-slate-200">
                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{niche.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600 line-clamp-3 mb-4 h-[60px]">
                                        {niche.description || "No description available."}
                                    </p>
                                    <div className="flex items-center gap-x-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-x-1">
                                            <BookOpen className="h-4 w-4" />
                                            <span>{niche.keywords?.length || 0} Keywords</span>
                                        </div>
                                        <div className="flex items-center gap-x-1">
                                            <Download className="h-4 w-4" />
                                            <span>{niche.downloads?.length || 0} Assets</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Badge variant="secondary">
                                            View Blueprint
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
