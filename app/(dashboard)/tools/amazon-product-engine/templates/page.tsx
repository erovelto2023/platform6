import { getAmazonTemplates } from "@/lib/actions/amazon.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileCode } from "lucide-react";
import Link from "next/link";

export default async function TemplatesPage() {
    const templates = await getAmazonTemplates();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-3xl font-bold">Templates</h1>
                    <p className="text-muted-foreground">
                        Create and manage your product display templates.
                    </p>
                </div>
                <Link href="/tools/amazon-product-engine/templates/create">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Template
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground mt-10">
                        No templates created yet.
                    </div>
                ) : (
                    templates.map((template: any) => (
                        <Card key={template._id} className="hover:shadow-md transition">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {template.name}
                                </CardTitle>
                                <FileCode className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-muted-foreground mb-4 capitalize">
                                    Type: {template.type}
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="w-full">
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="destructive" className="w-full">
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
