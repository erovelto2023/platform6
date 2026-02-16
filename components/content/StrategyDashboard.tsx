
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, Target, Layers, TrendingUp } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface StrategyDashboardProps {
    posts: any[];
    offers: any[];
}

const FUNNEL_COLORS = {
    awareness: '#6366f1', // Indigo
    consideration: '#8b5cf6', // Violet
    conversion: '#10b981', // Emerald
    retention: '#f43f5e', // Rose
};

const PILLAR_COLORS = ['#3b82f6', '#f59e0b', '#ec4899', '#84cc16', '#06b6d4', '#8b5cf6'];

export function StrategyDashboard({ posts, offers }: StrategyDashboardProps) {
    // 1. Funnel Analysis
    const funnelCounts = posts.reduce((acc: any, post) => {
        const stage = post.funnelStage || 'uncategorized';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
    }, {});

    const funnelData = [
        { name: 'Awareness', value: funnelCounts['awareness'] || 0, color: FUNNEL_COLORS.awareness },
        { name: 'Consideration', value: funnelCounts['consideration'] || 0, color: FUNNEL_COLORS.consideration },
        { name: 'Conversion', value: funnelCounts['conversion'] || 0, color: FUNNEL_COLORS.conversion },
        { name: 'Retention', value: funnelCounts['retention'] || 0, color: FUNNEL_COLORS.retention },
    ].filter(d => d.value > 0);

    // 2. Offer Alignment
    const postsWithOffer = posts.filter(p => p.offerId).length;
    const postsWithoutOffer = posts.length - postsWithOffer;
    const alignmentScore = posts.length ? Math.round((postsWithOffer / posts.length) * 100) : 0;

    // 3. Content Pillars
    const pillarCounts = posts.reduce((acc: any, post) => {
        const pillar = post.contentPillar || 'Other';
        acc[pillar] = (acc[pillar] || 0) + 1;
        return acc;
    }, {});

    const pillarData = Object.entries(pillarCounts).map(([name, value], index) => ({
        name,
        value,
        color: PILLAR_COLORS[index % PILLAR_COLORS.length]
    }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Offer Alignment Score */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Offer Alignment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{alignmentScore}%</div>
                        <Progress value={alignmentScore} className="h-2 mt-2" />
                        <p className="text-xs text-slate-500 mt-2">
                            {postsWithOffer} posts linked to offers
                        </p>
                    </CardContent>
                </Card>

                {/* Funnel Health */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Funnel Coverage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 text-xs mb-2">
                            {funnelData.map(d => (
                                <div key={d.name} className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                                    {d.name}
                                </div>
                            ))}
                        </div>
                        <div className="h-2 flex rounded-full overflow-hidden">
                            {funnelData.map(d => (
                                <div
                                    key={d.name}
                                    style={{ width: `${(d.value / posts.length) * 100}%`, backgroundColor: d.color }}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Total Content */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{posts.length}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Across all platforms
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Funnel Stage Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Funnel Distribution</CardTitle>
                        <CardDescription>Content breakdown by customer journey stage</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                    {funnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pillar Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Content Pillars</CardTitle>
                        <CardDescription>Topic distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pillarData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pillarData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts */}
            {alignmentScore < 50 && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Low Offer Alignment</AlertTitle>
                    <AlertDescription>
                        Less than 50% of your content is linked to an offer. Consider creating more conversion-focused posts.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
