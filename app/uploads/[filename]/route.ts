import { NextRequest, NextResponse } from 'next/server';
import { join, resolve } from 'path';
import { existsSync, createReadStream, statSync } from 'fs';

export const runtime = 'nodejs';

const UPLOAD_DIR = resolve(process.cwd(), "public", "uploads");

export async function GET(
    req: NextRequest,
    { params }: { params: { filename: string } }
) {
    try {
        const { filename } = await params;
        const filePath = join(UPLOAD_DIR, filename);

        if (!existsSync(filePath)) {
            return new NextResponse('Asset Not Found', { status: 404 });
        }

        // Stream the file back to the user
        const stats = statSync(filePath);
        const stream = createReadStream(filePath);

        // Determine content type from filename
        let contentType = 'application/octet-stream';
        if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) contentType = 'image/jpeg';
        else if (filename.endsWith('.png')) contentType = 'image/png';
        else if (filename.endsWith('.webp')) contentType = 'image/webp';
        else if (filename.endsWith('.gif')) contentType = 'image/gif';
        else if (filename.endsWith('.pdf')) contentType = 'application/pdf';

        const headers = new Headers();
        headers.set('Content-Type', contentType);
        headers.set('Content-Length', stats.size.toString());
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');

        return new NextResponse(stream as any, { headers });

    } catch (err: any) {
        console.error('[Serve Media Error]', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
