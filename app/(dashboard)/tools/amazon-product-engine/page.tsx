import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileCode, Settings, ArrowRight, Table, Link as LinkIcon, BarChart3, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AmazonEnginePage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-3xl font-bold">Amazon Product Engine</h1>
                <p className="text-muted-foreground">
                    Manage your Amazon affiliate products, templates, and settings.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Product Search
                        </CardTitle>
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Search</div>
                        <p className="text-xs text-muted-foreground mb-4">
                            Find products and generate links
                        </p>
                        <Link href="/tools/amazon-product-engine/search">
                            <Button size="sm" className="w-full">
                                Go to Search <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Bulk Editor
                        </CardTitle>
                        <Table className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Bulk Tools</div>
                        <p className="text-xs text-muted-foreground mb-4">
                            CSV upload & comparison charts
                        </p>
                        <Link href="/tools/amazon-product-engine/bulk">
                            <Button size="sm" variant="outline" className="w-full">
                                Open Editor
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Link Tools
                        </CardTitle>
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Links & QR</div>
                        <p className="text-xs text-muted-foreground mb-4">
                            Bulk generator for links/QR codes
                        </p>
                        <Link href="/tools/amazon-product-engine/links">
                            <Button size="sm" variant="outline" className="w-full">
                                Generate Links
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Templates
                        </CardTitle>
                        <FileCode className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Templates</div>
                        <p className="text-xs text-muted-foreground mb-4">
                            Create custom display templates
                        </p>
                        <Link href="/tools/amazon-product-engine/templates">
                            <Button size="sm" variant="outline" className="w-full">
                                Manage Templates
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Analytics
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Analytics</div>
                        <p className="text-xs text-muted-foreground mb-4">
                            Track revenue and clicks
                        </p>
                        <Link href="/tools/amazon-product-engine/analytics">
                            <Button size="sm" variant="outline" className="w-full">
                                View Analytics
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Settings
                        </CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Settings</div>
                        <p className="text-xs text-muted-foreground mb-4">
                            API keys and tracking IDs
                        </p>
                        <Link href="/tools/amazon-product-engine/settings">
                            <Button size="sm" variant="outline" className="w-full">
                                Configure
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
