import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtected = createRouteMatcher([
    '/dashboard(.*)',
    '/catalog(.*)',
    '/niche-catalog(.*)',
    '/admin(.*)',
    '/docs-editor(.*)',
    '/accounting(.*)',
    '/affiliates(.*)',
    '/calendar(.*)',
    '/niche-boxes(.*)',
    '/resources(.*)',
    '/tools(.*)',
    '/community(.*)',
    '/messages(.*)',
    '/tickets(.*)',
    '/whiteboard(.*)',
    '/docs(.*)',
]);

const isStudentRoute = createRouteMatcher([
    '/accounting(.*)',
    '/affiliates(.*)',
    '/calendar(.*)',
    '/niche-boxes(.*)',
    '/resources(.*)',
    '/tools(.*)',
    '/community(.*)',
]);

const isPublic = createRouteMatcher([
    '/api/uploadthing(.*)',
    '/invite(.*)',
    '/uploads(.*)',
    '/locations(.*)',
    '/glossary(.*)',
    '/',
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();

    // Redirect old editor URLs to new location
    if (req.nextUrl.pathname.startsWith('/admin/docs/editor/')) {
        const pageId = req.nextUrl.pathname.split('/').pop();
        return NextResponse.redirect(new URL(`/docs-editor/${pageId}`, req.url));
    }

    // Public routes don't need protection
    if (isPublic(req)) return;

    // Protect all other routes
    if (isProtected(req)) {
        await auth.protect();

        // Check for Student tier on specific routes
        if (isStudentRoute(req)) {
            const plan = (sessionClaims?.publicMetadata as any)?.plan || 'free';
            const isAdmin = (sessionClaims?.publicMetadata as any)?.role === 'admin';

            if (plan !== 'student' && !isAdmin) {
                return NextResponse.redirect(new URL('/upgrade', req.url));
            }
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|mp3|m4a|wav|mov|m4v|avi)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
