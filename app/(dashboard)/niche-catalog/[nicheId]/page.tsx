import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getNicheBox } from "@/lib/actions/niche.actions";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Lightbulb, Search, Video, BookOpen, Users } from "lucide-react";
import Link from "next/link";

export default async function NicheBoxDetailPage({
    params
}: {
    params: Promise<{ nicheId: string }>
}) {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const { nicheId } = await params;
    const niche = await getNicheBox(nicheId);

    if (!niche) {
        return redirect("/niche-catalog");
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{niche.title}</h1>
                    <p className="text-muted-foreground mt-1">
                        Your complete business blueprint.
                    </p>
                </div>
                {/* Placeholder for "Enroll" or status */}
                <Badge className="bg-emerald-600 text-white px-4 py-1 text-sm">
                    Unlocked
                </Badge>
            </div>

            <Separator />

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-6 lg:w-[720px]">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                    <TabsTrigger value="strategy">Strategy</TabsTrigger>
                    <TabsTrigger value="research">Research</TabsTrigger>
                    <TabsTrigger value="keywords">Keywords</TabsTrigger>
                    <TabsTrigger value="assets">Assets</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>About this Business</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {niche.description || "No description provided."}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <Lightbulb className="h-5 w-5 text-yellow-500" />
                                Business Ideas & Angles
                            </CardTitle>
                            <CardDescription>
                                Different ways to monetize this niche.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {niche.businessIdeas?.length > 0 ? (
                                    niche.businessIdeas.map((idea: string, index: number) => (
                                        <li key={index} className="flex items-start gap-x-2 bg-slate-50 p-3 rounded-md">
                                            <span className="font-bold text-slate-400">#{index + 1}</span>
                                            <span className="text-slate-700">{idea}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No specific ideas listed.</p>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="videos" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <Video className="h-5 w-5 text-red-500" />
                                Video Guides
                            </CardTitle>
                            <CardDescription>
                                Watch these videos to master this niche.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {niche.videos && niche.videos.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {niche.videos.map((video: any) => (
                                        <div key={video._id} className="space-y-2">
                                            <div className="relative aspect-video rounded-md overflow-hidden bg-slate-100 border">
                                                <iframe
                                                    src={video.url.replace("watch?v=", "embed/")}
                                                    className="absolute inset-0 w-full h-full"
                                                    allowFullScreen
                                                />
                                            </div>
                                            <p className="font-medium text-sm">{video.title}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-sm text-muted-foreground py-8">
                                    No videos available for this niche yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="keywords" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <Search className="h-5 w-5 text-sky-500" />
                                Target Keywords
                            </CardTitle>
                            <CardDescription>
                                Low competition keywords to target for SEO and content.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <div className="grid grid-cols-3 bg-slate-100 p-3 font-medium text-sm">
                                    <div>Keyword</div>
                                    <div>Volume</div>
                                    <div>Difficulty</div>
                                </div>
                                {niche.keywords?.length > 0 ? (
                                    niche.keywords.map((k: any) => (
                                        <div key={k._id} className="grid grid-cols-3 p-3 border-t text-sm items-center">
                                            <div className="font-medium">{k.keyword}</div>
                                            <div className="text-slate-500">{k.volume}</div>
                                            <div>
                                                <Badge variant={k.difficulty === 'Easy' ? 'default' : 'secondary'} className={k.difficulty === 'Easy' ? 'bg-green-500' : ''}>
                                                    {k.difficulty}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No keywords available.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="assets" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <Download className="h-5 w-5 text-indigo-500" />
                                Downloadable Assets
                            </CardTitle>
                            <CardDescription>
                                Templates, guides, and resources to get you started.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {niche.downloads?.length > 0 ? (
                                    niche.downloads.map((d: any) => (
                                        <div key={d._id} className="flex items-center p-4 border rounded-lg hover:bg-slate-50 transition">
                                            <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-4">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{d.title}</p>
                                                <p className="text-xs text-muted-foreground">{d.type}</p>
                                            </div>
                                            <Link href={d.url} target="_blank" rel="noopener noreferrer">
                                                <Button size="sm" variant="outline">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center text-sm text-muted-foreground py-8">
                                        No assets available for download.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="strategy" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <BookOpen className="h-5 w-5 text-purple-500" />
                                Playbooks & Roadmaps
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {niche.playbooks?.length > 0 ? (
                                <div className="space-y-4">
                                    {niche.playbooks.map((playbook: any) => (
                                        <div key={playbook._id} className="border rounded-lg p-4">
                                            <h3 className="font-semibold text-lg mb-2">{playbook.title}</h3>
                                            <div className="text-slate-600 whitespace-pre-wrap text-sm">
                                                {playbook.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No playbooks available yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="research" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <Users className="h-5 w-5 text-orange-500" />
                                Customer Avatar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-sm text-slate-500 mb-2">Demographics</h4>
                                    <ul className="space-y-1 text-sm">
                                        <li><span className="font-semibold">Age:</span> {niche.marketResearch?.demographics?.ageRange || "N/A"}</li>
                                        <li><span className="font-semibold">Income:</span> {niche.marketResearch?.demographics?.income || "N/A"}</li>
                                        <li><span className="font-semibold">Location:</span> {niche.marketResearch?.demographics?.location || "N/A"}</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-slate-500 mb-2">Profile</h4>
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                        {niche.marketResearch?.avatar?.description || "No profile available."}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
