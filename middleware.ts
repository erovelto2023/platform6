import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtected = createRouteMatcher([
    '/dashboard(.*)',
    '/catalog(.*)',
    '/niche-catalog(.*)',
    '/admin(.*)',
    '/api/admin(.*)',
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
    '/story-hacker(.*)',
    '/user-profile(.*)',
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
    '/api/click(.*)',
    '/invite(.*)',
    '/uploads(.*)',
    '/locations(.*)',
    '/glossary(.*)',
    '/tools(.*)',
    '/c(.*)',
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

        const role = (sessionClaims?.publicMetadata as any)?.role || 'free';
        let isAdmin = role === 'admin';

        // High-reliability check: Fetch user's email directly if metadata role isn't 'admin'
        if (userId && !isAdmin) {
            try {
                const client = await clerkClient();
                const user = await client.users.getUser(userId);
                const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress?.toLowerCase();
                
                const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
                const adminEmails = adminEmailsEnv.split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
                const defaults = ['erovelto1@gmail.com', 'erovelto@outlook.com'];
                defaults.forEach(email => {
                    if (!adminEmails.includes(email)) adminEmails.push(email);
                });
                
                const isEmailAdmin = userEmail && (adminEmails.includes(userEmail) || userEmail.includes('erovelto') || userId === 'user_3Bj6dEmUZDloX8iV0KxAgq1PIMS');
                
                if (isEmailAdmin) {
                    isAdmin = true;
                }
            } catch (err) {
                console.error("Error verifying admin email in middleware:", err);
            }
        }

        // Admin Route Protection (for non-admins trying to access /admin or /api/admin)
        if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin')) {
            if (req.nextUrl.pathname.startsWith('/api/')) {
                return new NextResponse(JSON.stringify({ error: "Forbidden: Admin access required" }), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        // Allow all users to access their respective sidebar pages & tools
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
