import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtected = createRouteMatcher([
    '/dashboard(.*)',
    '/catalog(.*)',
    '/niche-catalog(.*)',
    '/admin(.*)',
    '/docs-editor(.*)',
    '/affiliates(.*)',
    '/niche-boxes(.*)',
    '/resources(.*)',
    '/community(.*)',
    '/messages(.*)',
    '/tickets(.*)',
    '/whiteboard(.*)',
    '/partner(.*)',
    '/docs(.*)',
]);

const isStudentRoute = createRouteMatcher([
    '/accounting(.*)',
    '/affiliates(.*)',
    '/niche-boxes(.*)',
    '/resources(.*)',
    '/community(.*)',
]);

const isPublic = createRouteMatcher([
    '/api/uploadthing(.*)',
    '/invite(.*)',
    '/uploads(.*)',
    '/locations(.*)',
    '/glossary(.*)',
    '/tools(.*)',
    '/',
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();
    const url = new URL(req.url);
    const ref = url.searchParams.get('ref');

    // Helper to add referral cookie to any response
    const withReferral = (res: NextResponse, code: string) => {
        res.cookies.set('p6_partner_ref', code, {
            maxAge: 60 * 60 * 24 * 120, // 120 days
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        return res;
    };

    // If we have a referral code in the URL, set it and redirect to the clean URL
    if (ref) {
        url.searchParams.delete('ref');
        const response = NextResponse.redirect(url);
        return withReferral(response, ref);
    }

    let response = NextResponse.next();

    // Public routes don't need protection
    if (isPublic(req)) return response;

    // Protect all other routes
    if (isProtected(req)) {
        await auth.protect();

        const plan = (sessionClaims?.publicMetadata as any)?.plan || 'free';
        const role = (sessionClaims?.publicMetadata as any)?.role || 'user';
        let isAdmin = role === 'admin';

        // FEATURE BYPASS: Set to false in production to enforce access control
        const BYPASS_ACCESS_CONTROL = false; 

        // 1. Admin Route Protection
        if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin && !BYPASS_ACCESS_CONTROL) {
            // High-reliability check: Fetch user's email directly if metadata role isn't 'admin'
            if (userId) {
                const client = await clerkClient();
                const user = await client.users.getUser(userId);
                const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
                
                const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
                const adminEmails = adminEmailsEnv.split(',').map(email => email.trim()).filter(Boolean);
                const isEmailAdmin = userEmail ? adminEmails.includes(userEmail) : false;
                
                if (isEmailAdmin) {
                    isAdmin = true;
                }
            }

            // If still not admin, redirect
            if (!isAdmin) {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
        }

        // 2. Student Route Protection (Plan-based)
        if (!BYPASS_ACCESS_CONTROL && isStudentRoute(req)) {
            if (plan !== 'student' && !isAdmin) {
                const upgradeUrl = new URL('/upgrade', req.url);
                return NextResponse.redirect(upgradeUrl);
            }
        }
    }

    return response;
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|mp3|m4a|wav|mov|m4v|avi)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
