import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtected = createRouteMatcher([
    '/dashboard(.*)',
    '/catalog(.*)',
    '/niche-catalog(.*)',
    '/admin(.*)',
    '/docs-editor(.*)', // Protect the new editor route
]);

const isPublic = createRouteMatcher([
    '/api/uploadthing(.*)',
    '/invite(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    // Redirect old editor URLs to new location
    if (req.nextUrl.pathname.startsWith('/admin/docs/editor/')) {
        const pageId = req.nextUrl.pathname.split('/').pop();
        return NextResponse.redirect(new URL(`/docs-editor/${pageId}`, req.url));
    }

    if (isProtected(req) && !isPublic(req)) await auth.protect();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|mp3|m4a|wav|mov|m4v|avi)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
