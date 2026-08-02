import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, HelpCircle, Star } from "lucide-react";
import Link from "next/link";

export function UtilityPanel({ savedCount }: { savedCount: number }) {
    return (
        <div className="w-64 flex-shrink-0 space-y-6 pl-4 border-l border-slate-800/80 hidden xl:block text-slate-100">
            {/* Saved Suppliers */}
            <Card className="bg-slate-900 border-slate-800 shadow-xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-amber-400 text-sm font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        Saved Suppliers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black text-slate-100 font-mono mb-3">{savedCount}</div>
                    <Link href="/tools/wholesale-directory/saved">
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider shadow-md cursor-pointer">
                            View My Suppliers
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-slate-900 border-slate-800 shadow-xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-slate-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                        <Bell className="h-3.5 w-3.5 text-orange-400" />
                        Notifications
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="font-bold text-amber-400 block mb-1">New Suppliers Added</span>
                        12 new dropshippers added in "Electronics" this week.
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-slate-950 border-slate-800 hover:border-orange-500 text-slate-300 hover:text-white font-mono text-xs cursor-pointer">
                        Manage Alerts
                    </Button>
                </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-slate-900 border-slate-800 shadow-xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-slate-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                        <HelpCircle className="h-3.5 w-3.5 text-orange-400" />
                        Can't Find A Supplier?
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-xs font-mono text-slate-400 leading-relaxed">
                        Our research team can source specific suppliers or products for your catalog.
                    </p>
                    <Button size="sm" className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-mono text-xs cursor-pointer">
                        Request Product Research
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
