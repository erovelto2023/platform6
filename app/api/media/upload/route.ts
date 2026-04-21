import { NextRequest, NextResponse } from 'next/server';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join, resolve, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import busboy from 'busboy';
import { Readable } from 'stream';
import connectDB from '@/lib/db/connect';
import Resource from '@/lib/db/models/Resource';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

const UPLOAD_DIR = resolve(process.cwd(), "public", "uploads");

/**
 * Ensures the upload directory exists.
 */
const ensureUploadDir = () => {
    if (!existsSync(UPLOAD_DIR)) {
        mkdirSync(UPLOAD_DIR, { recursive: true });
    }
};

export async function POST(req: NextRequest) {
    try {
        // 1. Check Auth
        const { sessionClaims } = await auth();
        const role = (sessionClaims?.publicMetadata as any)?.role;
        if (role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        ensureUploadDir();

        // 2. Setup Streaming
        const nodeStream = Readable.fromWeb(req.body as any);
        const headers = Object.fromEntries(req.headers);
        const bb = busboy({ 
            headers,
            limits: { fileSize: 1024 * 1024 * 1000 } // 1GB Limit
        });

        return new Promise<NextResponse>((resolveReject) => {
            let fileUploaded = false;
            let assetData: any = {
                title: '',
                category: 'General',
                tags: []
            };
            let savedFileUrl = '';
            let finalResource: any = null;

            bb.on('field', (name, value) => {
                if (name === 'title') assetData.title = value;
                if (name === 'category') assetData.category = value;
                if (name === 'tags') {
                    assetData.tags = value.split(',').map((t: string) => t.trim()).filter(Boolean);
                }
            });

            bb.on('file', (name, file, info) => {
                const { filename, mimeType } = info;
                const fileExtension = extname(filename);
                const storedFilename = `${uuidv4()}${fileExtension}`;
                const savePath = join(UPLOAD_DIR, storedFilename);
                const writeStream = createWriteStream(savePath);

                let bytesRead = 0;
                
                file.on('data', (data) => {
                    bytesRead += data.length;
                    writeStream.write(data);
                });

                file.on('end', async () => {
                    writeStream.end();
                    fileUploaded = true;
                    savedFileUrl = `/uploads/${storedFilename}`;

                    // Determine type
                    let type: 'image' | 'pdf' | 'file' = 'file';
                    if (mimeType.startsWith('image/')) type = 'image';
                    else if (mimeType === 'application/pdf') type = 'pdf';

                    try {
                        finalResource = await Resource.create({
                            title: assetData.title || filename,
                            url: savedFileUrl,
                            type,
                            category: assetData.category,
                            mimeType,
                            fileSizeBytes: bytesRead,
                            originalFilename: filename,
                            storedFilename: storedFilename,
                            isPublished: true,
                            status: 'published',
                            altText: assetData.title || filename,
                            thumbnailUrl: type === 'image' ? savedFileUrl : undefined,
                            tags: assetData.tags
                        });
                    } catch (err) {
                        console.error('[API Upload] DB Error:', err);
                    }
                });
            });

            bb.on('finish', () => {
                if (!fileUploaded) {
                    resolveReject(NextResponse.json({ error: 'No file detected' }, { status: 400 }));
                    return;
                }
                resolveReject(NextResponse.json({ 
                    success: true, 
                    data: JSON.parse(JSON.stringify(finalResource)) 
                }));
            });

            bb.on('error', (err) => {
                console.error('[Busboy Error]', err);
                resolveReject(NextResponse.json({ error: 'Stream processing failed' }, { status: 500 }));
            });

            nodeStream.pipe(bb);
        });

    } catch (err: any) {
        console.error('[Upload API Error]', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
