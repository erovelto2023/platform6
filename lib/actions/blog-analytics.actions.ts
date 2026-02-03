"use server";

import connectDB from "@/lib/db/connect";
import BlogAnalytics from "@/lib/db/models/BlogAnalytics";
// import Article from "@/lib/db/models/Article"; // TODO: Create Article model
import { headers } from "next/headers";

interface TrackVisitParams {
    articleId: string;
    articleTitle: string;
    articleSlug: string;
    visitorId: string;
    sessionId: string;
    referrer?: string;
    utmParams?: {
        source?: string;
        medium?: string;
        campaign?: string;
        term?: string;
        content?: string;
    };
    previousPage?: string;
}

export async function trackBlogVisit(params: TrackVisitParams) {
    try {
        await connectDB();

        const headersList = await headers();
        const userAgent = headersList.get('user-agent') || '';
        const forwardedFor = headersList.get('x-forwarded-for');
        const realIp = headersList.get('x-real-ip');
        const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';

        // Parse referrer
        let referrerDomain = '';
        let referrerType = 'direct';
        let searchEngine = '';
        let searchKeywords = '';

        if (params.referrer && params.referrer !== '') {
            try {
                const refUrl = new URL(params.referrer);
                referrerDomain = refUrl.hostname;

                // Detect search engines
                if (referrerDomain.includes('google')) {
                    referrerType = 'search';
                    searchEngine = 'Google';
                    searchKeywords = refUrl.searchParams.get('q') || '';
                } else if (referrerDomain.includes('bing')) {
                    referrerType = 'search';
                    searchEngine = 'Bing';
                    searchKeywords = refUrl.searchParams.get('q') || '';
                } else if (referrerDomain.includes('yahoo')) {
                    referrerType = 'search';
                    searchEngine = 'Yahoo';
                    searchKeywords = refUrl.searchParams.get('p') || '';
                } else if (referrerDomain.includes('duckduckgo')) {
                    referrerType = 'search';
                    searchEngine = 'DuckDuckGo';
                    searchKeywords = refUrl.searchParams.get('q') || '';
                }
                // Detect social media
                else if (
                    referrerDomain.includes('facebook') ||
                    referrerDomain.includes('twitter') ||
                    referrerDomain.includes('linkedin') ||
                    referrerDomain.includes('instagram') ||
                    referrerDomain.includes('pinterest') ||
                    referrerDomain.includes('reddit')
                ) {
                    referrerType = 'social';
                }
                // Detect email
                else if (referrerDomain.includes('mail') || referrerDomain.includes('email')) {
                    referrerType = 'email';
                }
                // Everything else is referral
                else {
                    referrerType = 'referral';
                }
            } catch (error) {
                // Invalid URL, keep as unknown
            }
        }

        // Detect device type from user agent
        let deviceType = 'desktop';
        if (/mobile/i.test(userAgent)) {
            deviceType = 'mobile';
        } else if (/tablet|ipad/i.test(userAgent)) {
            deviceType = 'tablet';
        }

        // Detect browser
        let browser = 'Unknown';
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Edge')) browser = 'Edge';

        // Detect OS
        let os = 'Unknown';
        if (userAgent.includes('Windows')) os = 'Windows';
        else if (userAgent.includes('Mac')) os = 'macOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iOS')) os = 'iOS';

        // Create analytics record
        await BlogAnalytics.create({
            articleId: params.articleId,
            articleTitle: params.articleTitle,
            articleSlug: params.articleSlug,
            visitorId: params.visitorId,
            sessionId: params.sessionId,
            visitedAt: new Date(),
            referrer: params.referrer || '',
            referrerDomain,
            referrerType,
            searchEngine: searchEngine || undefined,
            searchKeywords: searchKeywords || undefined,
            utmSource: params.utmParams?.source,
            utmMedium: params.utmParams?.medium,
            utmCampaign: params.utmParams?.campaign,
            utmTerm: params.utmParams?.term,
            utmContent: params.utmParams?.content,
            previousPage: params.previousPage,
            userAgent,
            deviceType,
            browser,
            os,
            ipAddress,
            pageUrl: `/blog/${params.articleSlug}`,
        });

        return { success: true };
    } catch (error) {
        console.error('Error tracking blog visit:', error);
        return { success: false, error: 'Failed to track visit' };
    }
}

export async function updatePageMetrics(
    visitorId: string,
    sessionId: string,
    timeOnPage: number,
    scrollDepth: number,
    nextPage?: string
) {
    try {
        await connectDB();

        // Find the most recent visit for this session
        const visit = await BlogAnalytics.findOne({
            visitorId,
            sessionId,
        }).sort({ visitedAt: -1 });

        if (visit) {
            visit.timeOnPage = timeOnPage;
            visit.scrollDepth = scrollDepth;
            if (nextPage) {
                visit.nextPage = nextPage;
            }
            await visit.save();
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating page metrics:', error);
        return { success: false };
    }
}

// TODO: Uncomment when Article model is created
/*
export async function getBlogAnalyticsSummary() {
    try {
        await connectDB();

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Get all articles with their view counts
        const articles = await Article.find({});

        const analyticsData = await Promise.all(
            articles.map(async (article) => {
                const totalViews = await BlogAnalytics.countDocuments({
                    articleId: article._id,
                });

                const recentViews = await BlogAnalytics.countDocuments({
                    articleId: article._id,
                    visitedAt: { $gte: thirtyDaysAgo },
                });

                const uniqueVisitors = await BlogAnalytics.distinct('visitorId', {
                    articleId: article._id,
                });

                const avgTimeOnPage = await BlogAnalytics.aggregate([
                    { $match: { articleId: article._id, timeOnPage: { $exists: true, $gt: 0 } } },
                    { $group: { _id: null, avg: { $avg: '$timeOnPage' } } },
                ]);

                const topReferrers = await BlogAnalytics.aggregate([
                    { $match: { articleId: article._id, referrerDomain: { $ne: '' } } },
                    { $group: { _id: '$referrerDomain', count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                    { $limit: 5 },
                ]);

                return {
                    _id: article._id,
                    title: article.title,
                    slug: article.slug,
                    totalViews,
                    recentViews,
                    uniqueVisitors: uniqueVisitors.length,
                    avgTimeOnPage: avgTimeOnPage[0]?.avg || 0,
                    topReferrers: topReferrers.map((r) => ({
                        domain: r._id,
                        count: r.count,
                    })),
                };
            })
        );

        return analyticsData.sort((a, b) => b.totalViews - a.totalViews);
    } catch (error) {
        console.error('Error fetching blog analytics:', error);
        return [];
    }
}
*/

export async function getBlogAnalyticsSummary(): Promise<Array<{
    _id: any;
    title: string;
    slug: string;
    totalViews: number;
    recentViews: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
    topReferrers: Array<{ domain: string; count: number }>;
}>> {
    // Temporary stub until Article model is created
    return [];
}

export async function getArticleDetailedAnalytics(articleId: string) {
    try {
        await connectDB();

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Total views
        const totalViews = await BlogAnalytics.countDocuments({ articleId });

        // Unique visitors
        const uniqueVisitors = await BlogAnalytics.distinct('visitorId', { articleId });

        // Views by day (last 30 days)
        const viewsByDay = await BlogAnalytics.aggregate([
            {
                $match: {
                    articleId: articleId,
                    visitedAt: { $gte: thirtyDaysAgo },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$visitedAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Traffic sources
        const trafficSources = await BlogAnalytics.aggregate([
            { $match: { articleId: articleId } },
            { $group: { _id: '$referrerType', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        // Top referrers
        const topReferrers = await BlogAnalytics.aggregate([
            { $match: { articleId: articleId, referrerDomain: { $ne: '' } } },
            { $group: { _id: '$referrerDomain', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        // Search keywords
        const searchKeywords = await BlogAnalytics.aggregate([
            { $match: { articleId: articleId, searchKeywords: { $ne: '' } } },
            { $group: { _id: '$searchKeywords', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        // Device breakdown
        const deviceBreakdown = await BlogAnalytics.aggregate([
            { $match: { articleId: articleId } },
            { $group: { _id: '$deviceType', count: { $sum: 1 } } },
        ]);

        // Browser breakdown
        const browserBreakdown = await BlogAnalytics.aggregate([
            { $match: { articleId: articleId } },
            { $group: { _id: '$browser', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        // Average time on page
        const avgMetrics = await BlogAnalytics.aggregate([
            {
                $match: {
                    articleId: articleId,
                    timeOnPage: { $exists: true, $gt: 0 },
                },
            },
            {
                $group: {
                    _id: null,
                    avgTime: { $avg: '$timeOnPage' },
                    avgScroll: { $avg: '$scrollDepth' },
                },
            },
        ]);

        return {
            totalViews,
            uniqueVisitors: uniqueVisitors.length,
            viewsByDay,
            trafficSources,
            topReferrers,
            searchKeywords,
            deviceBreakdown,
            browserBreakdown,
            avgTimeOnPage: avgMetrics[0]?.avgTime || 0,
            avgScrollDepth: avgMetrics[0]?.avgScroll || 0,
        };
    } catch (error) {
        console.error('Error fetching detailed analytics:', error);
        return null;
    }
}
