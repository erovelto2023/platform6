import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, Sparkles, BookOpen, Zap } from "lucide-react";
import { getBrandBases } from "@/lib/actions/brand-baser.actions";
import { format } from "date-fns";
import { OllamaTest } from "./_components/ollama-test";

export default async function BrandBaserPage() {
    const brandBases = await getBrandBases();

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">BrandBaser</h1>
                        <p className="text-slate-600">
                            Build your brand foundation with AI-powered content generation
                        </p>
                    </div>
                    <Link href="/admin/brand-baser/create">
                        <Button size="lg">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Brand Base
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Link href="/admin/brand-baser/documents">
                    <Card className="hover:shadow-md transition cursor-pointer border-2 border-blue-200 bg-blue-50">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Brand Documents</h3>
                                    <p className="text-xs text-slate-600">20-question intake forms</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/brand-baser/kits">
                    <Card className="hover:shadow-md transition cursor-pointer border-2 border-purple-200 bg-purple-50">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Brand Kits</h3>
                                    <p className="text-xs text-slate-600">Colors, fonts & identity</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/brand-baser/instructions">
                    <Card className="hover:shadow-md transition cursor-pointer border-2 border-emerald-200 bg-emerald-50">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Project Instructions</h3>
                                    <p className="text-xs text-slate-600">Content templates</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/brand-baser/action-brief">
                    <Card className="hover:shadow-md transition cursor-pointer border-2 border-orange-200 bg-orange-50">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Create Action Brief</h3>
                                    <p className="text-xs text-slate-600">Perfect prompt wizard</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Recent Brand Bases */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Your Brand Bases</h2>

                {brandBases.length === 0 ? (
                    <Card className="border-2 border-dashed">
                        <CardContent className="py-12 text-center">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Brand Bases Yet</h3>
                            <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                Create your first brand base by answering 20 strategic questions about your business.
                            </p>
                            <Link href="/admin/brand-baser/create">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Your First Brand Base
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {brandBases.map((base: any) => (
                            <Link key={base._id} href={`/admin/brand-baser/${base._id}`}>
                                <Card className="hover:shadow-md transition cursor-pointer">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg mb-1">{base.name}</CardTitle>
                                                {base.description && (
                                                    <p className="text-sm text-slate-600 line-clamp-2">
                                                        {base.description}
                                                    </p>
                                                )}
                                            </div>
                                            {base.isComplete && (
                                                <div className="ml-2 w-2 h-2 bg-emerald-500 rounded-full" title="Complete" />
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span>Created {format(new Date(base.createdAt), "MMM d, yyyy")}</span>
                                            <span>{base.isComplete ? "Complete" : "In Progress"}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* AI Test Section */}
            <OllamaTest />
        </div>
    );
}
