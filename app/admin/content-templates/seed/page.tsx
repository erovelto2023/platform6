"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { seedContentTemplates } from "@/lib/actions/content-template.actions";
import { Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SeedTemplatesPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ count: number } | null>(null);
    const router = useRouter();

    const handleSeed = async () => {
        setIsLoading(true);
        try {
            const res = await seedContentTemplates();
            setResult(res);
            toast.success(`Successfully added ${res.count} templates!`);
            setTimeout(() => {
                router.push('/admin/content-templates');
            }, 2000);
        } catch (error) {
            toast.error("Failed to seed templates");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20">
            <Card>
                <CardHeader>
                    <CardTitle>Seed Default Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-slate-600">
                        This will populate your database with over 50+ content templates (Blog Posts, Social Media, Email Sequences, etc.).
                    </p>
                    <p className="text-sm text-slate-500">
                        Existing templates with the same slug will be skipped.
                    </p>

                    {result ? (
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Added {result.count} new templates. Redirecting...
                        </div>
                    ) : (
                        <Button className="w-full" onClick={handleSeed} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Seeding...
                                </>
                            ) : (
                                "Start Seeding"
                            )}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
