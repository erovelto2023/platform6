import { getResources } from "@/lib/actions/resource.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { File, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ResourcesDashboardPage() {
    const resources = await getResources();
    const publishedResources = resources.filter((resource: any) => resource.isPublished);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-3xl font-bold">Resources</h1>
                <p className="text-muted-foreground">
                    Downloadable files and templates for your business.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedResources.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground mt-10">
                        No resources available yet.
                    </div>
                ) : (
                    publishedResources.map((resource: any) => (
                        <Card key={resource._id} className="hover:shadow-lg transition h-full border-slate-200">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="line-clamp-1 text-lg">
                                        {resource.title}
                                    </CardTitle>
                                    <File className="h-4 w-4 text-slate-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                                    {resource.description}
                                </p>
                                <Link href={resource.fileUrl} target="_blank" download>
                                    <Button className="w-full" variant="outline">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
