import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, HelpCircle, Star } from "lucide-react";
import Link from "next/link";

export function UtilityPanel({ savedCount }: { savedCount: number }) {
    return (
        <div className="w-64 flex-shrink-0 space-y-6 pl-4 border-l border-slate-200 hidden xl:block">
            {/* Saved Suppliers */}
            <Card className="bg-amber-50 border-amber-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-amber-900 text-lg flex items-center gap-2">
                        <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                        Saved Suppliers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-amber-900 mb-2">{savedCount}</div>
                    <Link href="/tools/wholesale-directory/saved">
                        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm">
                            View My Suppliers
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-slate-700 text-sm flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="font-semibold block text-slate-700 mb-1">New Suppliers Added</span>
                        12 new dropshippers added in "Electronics" this week.
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-xs">
                        Manage Alerts
                    </Button>
                </CardContent>
            </Card>

            {/* Help */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-slate-700 text-sm flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Can't find it?
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-slate-500 mb-3">
                        Our research team can help you find specific products or suppliers.
                    </p>
                    <Button variant="secondary" size="sm" className="w-full text-xs">
                        Request Product Research
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
