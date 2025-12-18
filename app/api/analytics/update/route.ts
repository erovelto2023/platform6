import { NextResponse } from 'next/server';
import { updatePageMetrics } from '@/lib/actions/blog-analytics.actions';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { visitorId, sessionId, timeOnPage, scrollDepth, nextPage } = body;

        await updatePageMetrics(visitorId, sessionId, timeOnPage, scrollDepth, nextPage);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating analytics:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
