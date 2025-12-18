import { NextRequest, NextResponse } from 'next/server';
import { searchOpenverseImages } from '@/lib/openverse';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('page_size') || '100');

    if (!q) {
        return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    try {
        const data = await searchOpenverseImages(q, page, pageSize);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Openverse API Error:", error.message);
        if (error.response) {
            console.error("Openverse API Error Data:", JSON.stringify(error.response.data));
        }
        const status = error.message.includes("credentials missing") ? 503 : 500;
        return NextResponse.json({
            error: 'Failed to fetch images',
            details: error.message
        }, { status });
    }
}
