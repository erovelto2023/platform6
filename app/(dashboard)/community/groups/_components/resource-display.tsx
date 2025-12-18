"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ExternalLink,
    FileText,
    Download,
    Link as LinkIcon,
    Video,
    Mic,
    File,
    LayoutTemplate,
    CheckSquare,
    GraduationCap,
    BookOpen,
    Tag,
    Globe,
    Shield
} from "lucide-react";
import Link from "next/link";

interface ResourceDisplayProps {
    resource: any; // Using any to support both old and new structures flexibly
}

export function ResourceDisplay({ resource }: ResourceDisplayProps) {
    if (!resource) return null;

    // Normalize data
    const type = resource.type || "Link";
    const url = resource.url;
    const description = resource.shortDescription;
    const tags = resource.tags || [];

    const getIcon = () => {
        switch (type) {
            case "Link": return <LinkIcon className="h-8 w-8 text-blue-500" />;
            case "Video": return <Video className="h-8 w-8 text-red-500" />;
            case "Audio": return <Mic className="h-8 w-8 text-purple-500" />;
            case "File": return <File className="h-8 w-8 text-orange-500" />;
            case "Document": return <FileText className="h-8 w-8 text-slate-500" />;
            case "Template": return <LayoutTemplate className="h-8 w-8 text-indigo-500" />;
            case "Checklist": return <CheckSquare className="h-8 w-8 text-green-500" />;
            case "Course": return <GraduationCap className="h-8 w-8 text-yellow-500" />;
            case "Lesson": return <BookOpen className="h-8 w-8 text-teal-500" />;
            default: return <ExternalLink className="h-8 w-8 text-slate-500" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Main Card */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 shrink-0">
                    {getIcon()}
                </div>

                <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="bg-white border-slate-200 text-slate-700 hover:bg-white">
                            {type}
                        </Badge>
                        {resource.category && (
                            <Badge variant="outline" className="text-slate-600">
                                {resource.category}
                            </Badge>
                        )}
                        {resource.difficulty && (
                            <Badge variant="outline" className="text-slate-600">
                                {resource.difficulty}
                            </Badge>
                        )}
                        {resource.pricing && (
                            <Badge variant="outline" className={resource.pricing === 'Free' ? "text-green-600 border-green-200 bg-green-50" : "text-slate-600"}>
                                {resource.pricing === 'Free' ? 'Free' : resource.pricing}
                            </Badge>
                        )}
                    </div>

                    {description && (
                        <p className="text-slate-700 font-medium">
                            {description}
                        </p>
                    )}

                    {resource.platform && (
                        <div className="text-sm text-slate-500 flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            Platform: {resource.platform}
                        </div>
                    )}
                </div>

                <div className="w-full md:w-auto shrink-0">
                    {url && (
                        <Button asChild className="w-full md:w-auto" size="lg">
                            <Link href={url} target="_blank" rel="noopener noreferrer">
                                {type === "Link" || type === "Tool" ? (
                                    <>
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Visit Resource
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4 mr-2" />
                                        Access / Download
                                    </>
                                )}
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Context & Usage */}
                {(resource.howToUse || resource.bestFor || resource.intendedOutcome) && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-indigo-500" />
                            Context & Usage
                        </h4>
                        <dl className="space-y-3 text-sm">
                            {resource.bestFor && (
                                <div>
                                    <dt className="text-slate-500 font-medium">Best For</dt>
                                    <dd className="text-slate-700 mt-1">{resource.bestFor}</dd>
                                </div>
                            )}
                            {resource.intendedOutcome && (
                                <div>
                                    <dt className="text-slate-500 font-medium">Intended Outcome</dt>
                                    <dd className="text-slate-700 mt-1">{resource.intendedOutcome}</dd>
                                </div>
                            )}
                            {resource.howToUse && (
                                <div>
                                    <dt className="text-slate-500 font-medium">How to Use</dt>
                                    <dd className="text-slate-700 mt-1 whitespace-pre-wrap">{resource.howToUse}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                )}

                {/* Technical & Attribution */}
                <div className="space-y-6">
                    {/* Tech Specs */}
                    {(resource.fileType || resource.fileSize || resource.duration || resource.estimatedTime) && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                <CheckSquare className="h-4 w-4 text-emerald-500" />
                                Specifications
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                {resource.fileType && (
                                    <div>
                                        <dt className="text-slate-500 font-medium">Format</dt>
                                        <dd className="text-slate-700">{resource.fileType}</dd>
                                    </div>
                                )}
                                {resource.fileSize && (
                                    <div>
                                        <dt className="text-slate-500 font-medium">Size</dt>
                                        <dd className="text-slate-700">{resource.fileSize}</dd>
                                    </div>
                                )}
                                {resource.duration && (
                                    <div>
                                        <dt className="text-slate-500 font-medium">Duration</dt>
                                        <dd className="text-slate-700">{resource.duration}</dd>
                                    </div>
                                )}
                                {resource.estimatedTime && (
                                    <div>
                                        <dt className="text-slate-500 font-medium">Est. Time</dt>
                                        <dd className="text-slate-700">{resource.estimatedTime}</dd>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Attribution */}
                    {(resource.source || resource.license || resource.attributionText) && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                <Shield className="h-4 w-4 text-slate-500" />
                                Attribution
                            </h4>
                            <dl className="space-y-3 text-sm">
                                {resource.source && (
                                    <div>
                                        <dt className="text-slate-500 font-medium">Source</dt>
                                        <dd className="text-slate-700">{resource.source}</dd>
                                    </div>
                                )}
                                {resource.license && (
                                    <div>
                                        <dt className="text-slate-500 font-medium">License</dt>
                                        <dd className="text-slate-700">{resource.license}</dd>
                                    </div>
                                )}
                                {resource.attributionText && (
                                    <div className="bg-slate-50 p-3 rounded text-xs text-slate-600 italic border border-slate-100">
                                        "{resource.attributionText}"
                                    </div>
                                )}
                            </dl>
                        </div>
                    )}
                </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {tags.map((tag: string, i: number) => (
                        <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
