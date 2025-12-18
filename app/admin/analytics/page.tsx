import { getAnalytics } from "@/lib/actions/analytics.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default async function AnalyticsPage() {
    const { totalUsers, courseStats } = await getAnalytics();

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Course Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {courseStats.map((item, index) => (
                            <div key={index} className="flex items-center">
                                <div className="w-full">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">{item.startedCount} students</p>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-sky-500"
                                            style={{ width: `${(item.startedCount / (totalUsers || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
