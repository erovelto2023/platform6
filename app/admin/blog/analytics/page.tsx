import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBlogAnalyticsSummary } from "@/lib/actions/blog-analytics.actions";
import Link from "next/link";
import { Eye, Users, Clock, TrendingUp, ExternalLink } from "lucide-react";

export default async function BlogAnalyticsPage() {
    const analytics = await getBlogAnalyticsSummary();

    const totalViews = analytics.reduce((sum, article) => sum + article.totalViews, 0);
    const totalUniqueVisitors = analytics.reduce((sum, article) => sum + article.uniqueVisitors, 0);
    const avgTimeOnPage = analytics.reduce((sum, article) => sum + article.avgTimeOnPage, 0) / (analytics.length || 1);

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Blog Analytics</h1>
                <p className="text-slate-600 mt-1">Track your blog performance and visitor behavior</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 mt-1">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Unique Visitors</CardTitle>
                        <Users className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUniqueVisitors.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 mt-1">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Avg. Time on Page</CardTitle>
                        <Clock className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.floor(avgTimeOnPage / 60)}m {Math.floor(avgTimeOnPage % 60)}s</div>
                        <p className="text-xs text-slate-500 mt-1">Average</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Posts</CardTitle>
                        <TrendingUp className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.length}</div>
                        <p className="text-xs text-slate-500 mt-1">Being tracked</p>
                    </CardContent>
                </Card>
            </div>

            {/* Blog Posts Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Blog Post Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    {analytics.length === 0 ? (
                        <div className="text-center py-12">
                            <Eye className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-600">No analytics data yet</p>
                            <p className="text-sm text-slate-500 mt-1">
                                Data will appear once visitors start viewing your blog posts
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-semibold text-sm">Post Title</th>
                                        <th className="text-center py-3 px-4 font-semibold text-sm">Total Views</th>
                                        <th className="text-center py-3 px-4 font-semibold text-sm">Last 30 Days</th>
                                        <th className="text-center py-3 px-4 font-semibold text-sm">Unique Visitors</th>
                                        <th className="text-center py-3 px-4 font-semibold text-sm">Avg. Time</th>
                                        <th className="text-center py-3 px-4 font-semibold text-sm">Top Referrer</th>
                                        <th className="text-center py-3 px-4 font-semibold text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.map((article) => (
                                        <tr key={article._id} className="border-b hover:bg-slate-50">
                                            <td className="py-3 px-4">
                                                <div className="font-medium">{article.title}</div>
                                                <div className="text-xs text-slate-500">/{article.slug}</div>
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <div className="font-semibold">{article.totalViews.toLocaleString()}</div>
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <div className="text-sm">{article.recentViews.toLocaleString()}</div>
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <div className="text-sm">{article.uniqueVisitors.toLocaleString()}</div>
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <div className="text-sm">
                                                    {Math.floor(article.avgTimeOnPage / 60)}m {Math.floor(article.avgTimeOnPage % 60)}s
                                                </div>
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <div className="text-xs">
                                                    {article.topReferrers[0]?.domain || 'Direct'}
                                                </div>
                                                {article.topReferrers[0] && (
                                                    <div className="text-xs text-slate-500">
                                                        ({article.topReferrers[0].count} visits)
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <Link
                                                    href={`/admin/blog/analytics/${article._id}`}
                                                    className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                                                >
                                                    Details
                                                    <ExternalLink className="h-3 w-3" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info Box */}
            <Card className="bg-indigo-50 border-indigo-200">
                <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">📊 Analytics Features</h3>
                    <ul className="text-sm space-y-1 text-slate-700">
                        <li>• <strong>Real-time tracking</strong> - See visits as they happen</li>
                        <li>• <strong>Referrer detection</strong> - Know where visitors come from (Google, social media, etc.)</li>
                        <li>• <strong>Search keywords</strong> - See what people searched to find your posts</li>
                        <li>• <strong>User journey</strong> - Track which pages visitors view in sequence</li>
                        <li>• <strong>Device & browser data</strong> - Understand your audience's tech</li>
                        <li>• <strong>Time on page & scroll depth</strong> - Measure engagement</li>
                        <li>• <strong>UTM tracking</strong> - Track campaign performance</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
