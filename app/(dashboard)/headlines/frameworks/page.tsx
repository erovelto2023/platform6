import { getFrameworks, seedFrameworks } from "@/lib/actions/headline.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function FrameworksPage() {
    // Ensure defaults exist
    await seedFrameworks();
    const frameworks = await getFrameworks();

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/headlines">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Framework Library</h1>
                        <p className="text-slate-500 mt-2">Proven formulas to structure your headlines.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {frameworks.map((framework: any) => (
                    <Card key={framework._id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline">{framework.category}</Badge>
                            </div>
                            <CardTitle className="text-lg">{framework.name}</CardTitle>
                            <CardDescription className="font-mono text-xs bg-slate-100 p-2 rounded mt-2 block">
                                {framework.template}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col gap-4">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-500">Examples:</p>
                                <ul className="text-sm space-y-1 list-disc list-inside text-slate-700">
                                    {framework.examples.map((ex: string, i: number) => (
                                        <li key={i}>{ex}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-auto pt-4 flex flex-wrap gap-2">
                                {framework.emotionalTriggers.map((trigger: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="text-[10px]">
                                        {trigger}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
