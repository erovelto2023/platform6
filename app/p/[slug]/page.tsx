import { getPageBySlug } from "@/lib/actions/page-builder.actions";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CustomHTMLRenderer } from "@/components/CustomHTMLRenderer";
import { PuckRenderer } from "@/components/PuckRenderer";
import { generateThemeCSS, defaultTheme } from "@/lib/theme-config";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/roles";
import { Lock, LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function verifyAccess(accessControl: "free" | "student" | "admin" | undefined) {
    if (!accessControl || accessControl === "free") {
        return { hasAccess: true, reason: "public" };
    }

    const { userId } = await auth();
    if (!userId) {
        return { hasAccess: false, reason: "not_logged_in" };
    }

    const role = await getUserRole();
    if (accessControl === "admin") {
        if (role === "admin") {
            return { hasAccess: true, reason: "admin" };
        }
        return { hasAccess: false, reason: "admin_required" };
    }

    if (accessControl === "student") {
        if (role === "student" || role === "admin") {
            return { hasAccess: true, reason: "student" };
        }
        return { hasAccess: false, reason: "student_required" };
    }

    return { hasAccess: true, reason: "default" };
}

function LockedPageScreen({ reason, slug }: { reason: "not_logged_in" | "admin_required" | "student_required", slug: string }) {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-indigo-905/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-sky-905/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md bg-slate-90/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative z-10 flex flex-col items-center">
                {/* Lock Icon Wrapper */}
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 animate-pulse">
                    <Lock size={32} />
                </div>

                <h1 className="text-2xl font-black tracking-tight text-white mb-2">
                    {reason === "not_logged_in" ? "Exclusive Content Locked" :
                     reason === "admin_required" ? "Admin Access Required" :
                     "Student Content Only"}
                </h1>
                
                <p className="text-sm text-slate-400 mb-8 leading-relaxed max-w-xs mx-auto">
                    {reason === "not_logged_in" ? "This page is private. Please sign in or create an account to access the materials." :
                     reason === "admin_required" ? "This page is restricted to administrators of the platform only." :
                     "This page contains premium learning resources. Please purchase a course or upgrade your plan to access."}
                </p>

                {reason === "not_logged_in" ? (
                    <div className="w-full flex flex-col gap-3">
                        <Link href={`/sign-in?redirect_url=/p/${slug}`} className="w-full">
                            <Button className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-bold py-6 rounded-2xl border-none shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2">
                                <LogIn size={16} /> Sign In to Access
                            </Button>
                        </Link>
                        <Link href={`/sign-up?redirect_url=/p/${slug}`} className="text-xs text-slate-400 hover:text-white font-semibold transition-colors mt-2">
                            Don't have an account? Sign Up
                        </Link>
                    </div>
                ) : (
                    <div className="w-full flex flex-col gap-3">
                        {reason === "student_required" && (
                            <Link href="/courses" className="w-full">
                                <Button className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-bold py-6 rounded-2xl border-none shadow-lg shadow-indigo-500/20 transition-all">
                                    Browse Premium Courses
                                </Button>
                            </Link>
                        )}
                        <Link href="/" className="w-full">
                            <Button variant="outline" className="w-full border-slate-800 bg-slate-900/40 text-slate-350 hover:text-white hover:bg-slate-80/80 font-bold py-6 rounded-2xl transition-all flex items-center justify-center gap-2">
                                <ArrowLeft size={16} /> Return to Home
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const page = await getPageBySlug(slug);

    if (!page) {
        return {
            title: "Page Not Found",
        };
    }

    return {
        title: page.metaTitle || page.name,
        description: page.metaDescription || `View ${page.name}`,
    };
}

export default async function PublicPageView({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    const access = await verifyAccess(page.accessControl);
    if (!access.hasAccess) {
        return <LockedPageScreen reason={access.reason as any} slug={slug} />;
    }

    const themeCSS = generateThemeCSS({ ...defaultTheme, ...(page.theme || {}) } as any);

    return (
        <>
            {/* Global theme CSS variables */}
            <style dangerouslySetInnerHTML={{ __html: themeCSS }} />

            {page.headerCode && (
                <div dangerouslySetInnerHTML={{ __html: page.headerCode }} />
            )}
            {page.bodyCode && (
                <div dangerouslySetInnerHTML={{ __html: page.bodyCode }} />
            )}
            <div className="min-h-screen bg-slate-950 text-slate-100">
                <style dangerouslySetInnerHTML={{ __html: `
                    /* Reset/Isolation for custom HTML */
                    .custom-html-wrapper {
                        all: revert;
                    }
                `}} />
                
                {page.sections?.map((section: any, index: number) => {
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
                                className="custom-html-wrapper"
                                html={section.customHTML}
                            />
                        );
                    }
                    return null;
                })}

                {(!page.sections || page.sections.length === 0) && (
                    <div className="flex items-center justify-center min-h-screen text-slate-400">
                        <div className="text-center">
                            <p className="text-lg">This page is empty</p>
                        </div>
                    </div>
                )}
            </div>
            {page.footerCode && (
                <div dangerouslySetInnerHTML={{ __html: page.footerCode }} />
            )}
        </>
    );
}
