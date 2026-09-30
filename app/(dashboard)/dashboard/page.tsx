import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { getDashboardCourses } from "@/lib/actions/course.actions";
import { CourseCard } from "@/components/course-card";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/roles";
import { getPageBySlug } from "@/lib/actions/page-builder.actions";
import { CustomHTMLRenderer } from "@/components/CustomHTMLRenderer";
import { PuckRenderer } from "@/components/PuckRenderer";
import { generateThemeCSS, defaultTheme } from "@/lib/theme-config";
import { getDashboardData } from "@/lib/actions/dashboard.actions";
import ScalePlusDashboard from "@/components/dashboard/ScalePlusDashboard";

export default async function DashboardPage() {
    const { userId } = await auth();
    if (!userId) return redirect("/");

    const userRole = await getUserRole();

    if (userRole === 'free') {
        const freePage = await getPageBySlug("free-dashboard");
        if (freePage) {
            const themeCSS = generateThemeCSS({ ...defaultTheme, ...(freePage.theme || {}) } as any);
            return (
                <div className="min-h-screen bg-[#f8fafc] text-slate-900">
                    <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
                    {freePage.headerCode && (
                        <div dangerouslySetInnerHTML={{ __html: freePage.headerCode }} />
                    )}
                    {freePage.bodyCode && (
                        <div dangerouslySetInnerHTML={{ __html: freePage.bodyCode }} />
                    )}
                    <div>
                        {freePage.sections?.map((section: any, index: number) => {
                            if (section.templateId === 'puck-blocks' && section.customHTML) {
                                try {
                                    const data = JSON.parse(section.customHTML);
                                    return (
                                        <div key={section._id || index}>
                                            <PuckRenderer data={data} />
                                        </div>
                                    );
                                } catch (e) {
                                    return null;
                                }
                            } else if (section.customHTML) {
                                return (
                                    <CustomHTMLRenderer 
                                        key={section._id || index}
                                        className="custom-html-wrapper-dashboard"
                                        html={section.customHTML}
                                    />
                                );
                            }
                            return null;
                        })}
                    </div>
                    {freePage.footerCode && (
                        <div dangerouslySetInnerHTML={{ __html: freePage.footerCode }} />
                    )}
                </div>
            );
        }
    }

    return <ScalePlusDashboard />;
}
