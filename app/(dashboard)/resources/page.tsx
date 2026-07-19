import { getResources } from "@/lib/actions/resource.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { File, Download, ExternalLink, Video, Image as ImageIcon, FileText, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { getOrCreateUser } from "@/lib/actions/user.actions";
import { Lock } from "lucide-react";

export default async function ResourcesDashboardPage() {
    const user = await getOrCreateUser();
    const userLevel = user?.level || 1;
    const resources = await getResources();
    const publishedResources = resources.filter((resource: any) => resource.isPublished);

    // Get unique categories
    const categories = Array.from(new Set(publishedResources.map((r: any) => r.category))).filter(Boolean);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video': return <Video className="h-5 w-5" />;
            case 'image': return <ImageIcon className="h-5 w-5" />;
            case 'pdf': return <FileText className="h-5 w-5" />;
            case 'link': return <ExternalLink className="h-5 w-5" />;
            default: return <File className="h-5 w-5" />;
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'video': return 'bg-red-100 text-red-700';
            case 'image': return 'bg-blue-100 text-blue-700';
            case 'pdf': return 'bg-orange-100 text-orange-700';
            case 'link': return 'bg-sky-100 text-sky-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                        Resources
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl">
                        A curated collection of tools, templates, and guides to help you scale your business.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publishedResources.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <File className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">No resources yet</h3>
                        <p className="text-slate-500 mt-2">Check back soon for new business templates and downloads.</p>
                    </div>
                ) : (
                    publishedResources.map((resource: any) => {
                        const requiredLevel = resource.requiredLevel || (
                            resource.title.toLowerCase().includes('pro') ? 3 : 
                            resource.title.toLowerCase().includes('template') ? 2 : 1
                        );
                        const isLocked = userLevel < requiredLevel;

                        return (
                            <div key={resource._id} className={`group relative bg-white rounded-2xl border p-6 transition-all duration-300 flex flex-col h-full ${
                                isLocked 
                                    ? "border-slate-100 opacity-80 bg-slate-50/50" 
                                    : "border-slate-200 hover:shadow-2xl hover:border-indigo-500/50"
                            }`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn(
                                        "p-3 rounded-xl transition-colors",
                                        isLocked ? "bg-slate-200 text-slate-400" : getTypeColor(resource.type)
                                    )}>
                                        {isLocked ? <Lock className="h-5 w-5" /> : getTypeIcon(resource.type)}
                                    </div>
                                    <div className="flex gap-1.5 items-center">
                                        {isLocked && (
                                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 font-bold border-none text-[10px]">
                                                Lvl {requiredLevel} Locked
                                            </Badge>
                                        )}
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-medium">
                                            {resource.category}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className={`text-xl font-bold transition-colors mb-2 flex items-center gap-1.5 ${
                                        isLocked ? "text-slate-500" : "text-slate-900 group-hover:text-indigo-600"
                                    }`}>
                                        {resource.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                                        {resource.description || "No description provided."}
                                    </p>
                                </div>

                                <div className="mt-8">
                                    {isLocked ? (
                                        <Button className="w-full rounded-xl bg-slate-200 text-slate-500 cursor-not-allowed hover:bg-slate-200 flex items-center justify-center gap-2" size="lg" disabled>
                                            <Lock className="h-4 w-4" />
                                            Unlock at Level {requiredLevel}
                                        </Button>
                                    ) : (
                                        <Link href={resource.url} target="_blank">
                                            <Button className="w-full rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white transition-all group" size="lg">
                                                {resource.type === 'link' ? (
                                                    <>
                                                        Visit Resource
                                                        <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                ) : (
                                                    <>
                                                        Download {resource.type.toUpperCase()}
                                                        <Download className="h-4 w-4 ml-2 group-hover:translate-y-1 transition-transform" />
                                                    </>
                                                )}
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// Add cn helper if not available
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
