import { NextRequest, NextResponse } from 'next/server';
import { join, resolve } from 'path';
import { existsSync, createReadStream, statSync } from 'fs';
import connectDB from '@/lib/db/connect';
import Resource from '@/lib/db/models/Resource';

export const runtime = 'nodejs';

const UPLOAD_DIR = resolve(process.cwd(), "public", "uploads");

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        await connectDB();

        const resource = await Resource.findById(id);
        if (!resource) {
            return new NextResponse('Asset Not Found', { status: 404 });
        }

        // Increment download count
        await Resource.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });

        // Get file path
        const fileName = resource.url.replace('/uploads/', '');
        const filePath = join(UPLOAD_DIR, fileName);

        if (!existsSync(filePath)) {
            return new NextResponse('File Missing on Storage', { status: 404 });
        }

        // Stream the file back to the user
        const stats = statSync(filePath);
        const stream = createReadStream(filePath);

        // Prepare headers
        const headers = new Headers();
        headers.set('Content-Disposition', `attachment; filename="${resource.originalFilename || fileName}"`);
        headers.set('Content-Type', resource.mimeType || 'application/octet-stream');
        headers.set('Content-Length', stats.size.toString());

        return new NextResponse(stream as any, { headers });

    } catch (err: any) {
        console.error('[Download API Error]', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
