import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AiGeneratePage() {
    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/tools/content-planner">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-indigo-600" />
                        AI Content Generator
                    </h1>
                    <p className="text-slate-600">Generate endless content ideas tailored to your niche.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Generate Ideas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Topic or Niche</Label>
                        <Input placeholder="e.g. Digital Marketing, Healthy Cooking, Personal Finance" />
                    </div>

                    <div className="space-y-2">
                        <Label>Target Audience</Label>
                        <Input placeholder="e.g. Small business owners, Busy moms, College students" />
                    </div>

                    <div className="space-y-2">
                        <Label>Additional Context (Optional)</Label>
                        <Textarea placeholder="Any specific goals, tone of voice, or constraints?" />
                    </div>

                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Content Plan
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
