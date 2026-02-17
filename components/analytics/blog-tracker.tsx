"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackBlogVisit, updatePageMetrics } from "@/lib/actions/blog-analytics.actions";

interface BlogTrackerProps {
    articleId: string;
    articleTitle: string;
    articleSlug: string;
}

// Generate or retrieve visitor ID
function getVisitorId(): string {
    if (typeof window === 'undefined') return '';

    let visitorId = localStorage.getItem('blog_visitor_id');
    if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('blog_visitor_id', visitorId);
    }
    return visitorId;
}

// Generate session ID
function getSessionId(): string {
    if (typeof window === 'undefined') return '';

    let sessionId = sessionStorage.getItem('blog_session_id');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('blog_session_id', sessionId);
    }
    return sessionId;
}

export const BlogTracker = ({ articleId, articleTitle, articleSlug }: BlogTrackerProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [tracked, setTracked] = useState(false);
    const startTime = useRef<number>(Date.now());
    const maxScroll = useRef<number>(0);

    useEffect(() => {
        if (tracked) return;

        const visitorId = getVisitorId();
        const sessionId = getSessionId();
        const referrer = document.referrer;
        const previousPage = sessionStorage.getItem('previous_page') || undefined;

        // Get UTM parameters
        const utmParams = {
            source: searchParams?.get('utm_source') || undefined,
            medium: searchParams?.get('utm_medium') || undefined,
            campaign: searchParams?.get('utm_campaign') || undefined,
            term: searchParams?.get('utm_term') || undefined,
            content: searchParams?.get('utm_content') || undefined,
        };

        // Track the visit
        trackBlogVisit({
            articleId,
            articleTitle,
            articleSlug,
            visitorId,
            sessionId,
            referrer,
            utmParams,
            previousPage,
        });

        setTracked(true);

        // Store current page for next visit
        if (pathname) {
            sessionStorage.setItem('previous_page', pathname);
        }

        // Track scroll depth
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

            if (scrollPercent > maxScroll.current) {
                maxScroll.current = Math.min(scrollPercent, 100);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Track time on page and scroll depth when leaving
        const handleBeforeUnload = () => {
            const timeOnPage = Math.floor((Date.now() - startTime.current) / 1000);
            const scrollDepth = Math.floor(maxScroll.current);

            // Use sendBeacon for reliable tracking on page unload
            const data = JSON.stringify({
                visitorId,
                sessionId,
                timeOnPage,
                scrollDepth,
            });

            navigator.sendBeacon('/api/analytics/update', data);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [articleId, articleTitle, articleSlug, pathname, searchParams, tracked]);

    return null; // This component doesn't render anything
};
