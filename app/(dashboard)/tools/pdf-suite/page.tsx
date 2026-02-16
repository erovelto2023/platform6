import { tools } from "./_config/tools";
import { toolContentEn } from "./_config/tool-content/en";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./_components/ui/PdfCard";
import NextLink from "next/link";
import * as Icons from "lucide-react";

export default function PDFSuitePage() {
    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">PDF Tools</h2>
                    <p className="text-muted-foreground">
                        A complete suite of PDF manipulation tools.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {tools.filter(t => !t.disabled).map((tool) => {
                    // Dynamic icon resolution
                    const IconComponent = (Icons as any)[tool.icon] || Icons.FileText;
                    const content = toolContentEn[tool.id];
                    const title = content?.title || tool.id;
                    const description = content?.metaDescription || "No description available.";
                    const path = `/tools/pdf-suite/${tool.slug}`;

                    return (
                        <NextLink key={tool.id} href={path} className="block h-full">
                            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {title}
                                    </CardTitle>
                                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xs text-muted-foreground line-clamp-2">
                                        {description}
                                    </div>
                                </CardContent>
                            </Card>
                        </NextLink>
                    );
                })}
            </div>
        </div>
    );
}
