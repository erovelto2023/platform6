import { getContentTemplates } from "@/lib/actions/content-template.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ContentTemplatesPage() {
    const templates = await getContentTemplates();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Content Templates</h1>
                    <p className="text-muted-foreground">
                        Manage templates for AI content generation.
                    </p>
                </div>
                <Link href="/admin/content-templates/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Template
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template: any) => (
                    <Card key={template._id} className="group relative overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{template.name}</CardTitle>
                                <Badge variant={template.isActive ? "default" : "secondary"}>
                                    {template.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            <div className="flex gap-2 text-xs text-muted-foreground">
                                <span>{template.category}</span>
                                {template.subcategory && (
                                    <>
                                        <span>•</span>
                                        <span>{template.subcategory}</span>
                                    </>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-4 min-h-[40px]">
                                {template.description || "No description provided."}
                            </p>

                            <div className="flex items-center gap-2">
                                <Link href={`/admin/content-templates/${template._id}`} className="w-full">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Edit className="mr-2 h-3 w-3" />
                                        Edit
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {templates.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border border-dashed">
                        <p className="text-slate-500 mb-4">No content templates found.</p>
                        <Link href="/admin/content-templates/create">
                            <Button variant="outline">Create your first template</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
