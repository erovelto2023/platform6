import { getSectionTemplates } from "@/lib/actions/section-template.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SectionTemplatesPage() {
    const templates = await getSectionTemplates();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Section Templates</h1>
                    <p className="text-muted-foreground">
                        Manage reusable section designs for your page builder.
                    </p>
                </div>
                <Link href="/admin/section-templates/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Template
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template: any) => (
                    <Card key={template._id} className="group relative overflow-hidden">
                        <div className="aspect-video bg-slate-100 border-b flex items-center justify-center text-slate-400">
                            {template.thumbnail ? (
                                <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-sm">No Preview</span>
                            )}
                        </div>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{template.name}</CardTitle>
                                <Badge variant="secondary">{template.category}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mt-2">
                                <Button variant="outline" size="sm" className="w-full">
                                    <Edit className="mr-2 h-3 w-3" />
                                    Edit
                                </Button>
                                {!template.isSystem && (
                                    <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                                        <Trash className="mr-2 h-3 w-3" />
                                        Delete
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {templates.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border border-dashed">
                        <p className="text-slate-500 mb-4">No templates found.</p>
                        <Link href="/admin/section-templates/create">
                            <Button variant="outline">Create your first template</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
