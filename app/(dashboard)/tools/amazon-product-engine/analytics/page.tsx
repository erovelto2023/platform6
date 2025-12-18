"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, BarChart3, DollarSign, MousePointerClick, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">
                    Track the performance of your Amazon affiliate products.
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$452.31</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Link Clicks
                        </CardTitle>
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Conversion Rate
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12.5%</div>
                        <p className="text-xs text-muted-foreground">
                            +4.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Products
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">
                            +201 since last hour
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Activity / Chart Placeholder */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-slate-50 rounded-md border border-dashed">
                            Chart Visualization Placeholder
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Top Performing Products</CardTitle>
                        <CardDescription>
                            Your highest converting Amazon items this month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {[
                                {
                                    name: "Apple MacBook Air M2",
                                    revenue: "$1,299.00",
                                    clicks: 245,
                                    initials: "AM"
                                },
                                {
                                    name: "Sony WH-1000XM5",
                                    revenue: "$348.00",
                                    clicks: 180,
                                    initials: "SW"
                                },
                                {
                                    name: "Kindle Paperwhite",
                                    revenue: "$139.99",
                                    clicks: 120,
                                    initials: "KP"
                                },
                                {
                                    name: "Logitech MX Master 3S",
                                    revenue: "$99.99",
                                    clicks: 85,
                                    initials: "LM"
                                },
                                {
                                    name: "Samsung T7 Shield SSD",
                                    revenue: "$89.99",
                                    clicks: 64,
                                    initials: "ST"
                                },
                            ].map((product, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700 mr-4">
                                        {product.initials}
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {product.clicks} clicks
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">+{product.revenue}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
