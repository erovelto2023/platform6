import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Resource from '@/lib/db/models/Resource';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const status = searchParams.get('status') || 'published';
        const query = searchParams.get('query') || '';
        const category = searchParams.get('category') || '';

        // Build filter
        const filter: any = { type: 'image' };
        
        if (status !== 'all') {
            filter.status = status;
        }

        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ];
        }

        if (category && category !== 'all') {
            filter.category = category;
        }

        const resources = await Resource.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        // Ensure URLs are absolute for external consumption
        // We'll determine the base URL from the request host if possible, or fallback
        const protocol = request.headers.get('x-forwarded-proto') || 'https';
        const host = request.headers.get('host') || 'kbusinessacademy.com';
        const baseUrl = `${protocol}://${host}`;

        const images = resources.map((res: any) => {
            const makeAbsolute = (url: string) => {
                if (!url) return '';
                if (url.startsWith('http')) return url;
                return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
            };

            return {
                _id: res._id.toString(),
                title: res.title || '',
                altText: res.altText || res.title || '',
                description: res.description || '',
                tags: res.tags || [],
                fileUrl: makeAbsolute(res.url),
                thumbnailUrl: makeAbsolute(res.thumbnailUrl || res.url),
                mimeType: res.mimeType || 'image/jpeg',
                fileSizeBytes: res.fileSizeBytes || 0,
                status: res.status || 'published',
                createdAt: res.createdAt,
                category: res.category || 'General'
            };
        });

        return NextResponse.json({ success: true, images }, {
            status: 200,
            headers: CORS_HEADERS
        });
    } catch (error: any) {
        console.error('Gallery API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch gallery' },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
