import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ShoppingCart, ExternalLink, Image as ImageIcon, LayoutTemplate, Calendar, FileText, Search, BarChart3, Globe, ShoppingBag, PenTool } from "lucide-react";
import Link from "next/link";
import { getTools } from "@/lib/actions/tool.actions";
import * as Icons from "lucide-react";

const iconMap: { [key: string]: any } = {
    Calendar,
    ShoppingCart,
    Search,
    LayoutTemplate,
    FileText,
    BarChart3,
    Globe,
    ShoppingBag,
    Settings,
    PenTool
};

export default async function ToolsDashboardPage() {
    const { data: tools } = await getTools(true); // Only get enabled tools

    return (
        // Tools Dashboard
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-3xl font-bold">Tools & Apps</h1>
                <p className="text-muted-foreground">
                    Useful tools and applications to help you succeed.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tools && tools.length > 0 ? (
                    tools.map((tool: any) => {
                        const IconComponent = iconMap[tool.icon] || Settings;

                        return (
                            <Link key={tool._id} href={tool.path}>
                                <Card className="hover:shadow-lg transition cursor-pointer h-full border-slate-200 overflow-hidden group">
                                    <div className={`relative w-full aspect-video rounded-t-md overflow-hidden bg-gradient-to-br ${tool.gradient} flex items-center justify-center`}>
                                        <IconComponent className="h-8 w-8 text-white" />
                                    </div>
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-base line-clamp-1 group-hover:text-sky-700 transition flex items-center justify-between">
                                            {tool.name}
                                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-xs text-slate-600 line-clamp-2">
                                            {tool.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center text-muted-foreground py-20">
                        <p className="text-lg font-medium">No tools available</p>
                        <p className="text-sm mt-2">Check back soon for new tools!</p>
                    </div>
                )}

                {/* More tools coming soon message */}
                {tools && tools.length > 0 && (
                    <div className="col-span-full text-center text-muted-foreground mt-10">
                        More tools coming soon!
                    </div>
                )}
            </div>
        </div>
    );
}
