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
        console.log('[API Upload] Creating UPLOAD_DIR:', UPLOAD_DIR);
        mkdirSync(UPLOAD_DIR, { recursive: true });
    }
};

export async function POST(req: NextRequest) {
    console.log('[API Upload] Received POST request');
    try {
        // 1. Check Auth
        const { sessionClaims } = await auth();
        const role = (sessionClaims?.publicMetadata as any)?.role;
        console.log('[API Upload] User Role:', role);

        if (role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
        }

        await connectDB();
        ensureUploadDir();

        if (!req.body) {
            console.error('[API Upload] Request body is missing');
            return NextResponse.json({ error: 'Request body is missing' }, { status: 400 });
        }

        // 2. Setup Streaming
        const nodeStream = Readable.fromWeb(req.body as any);
        const headers = Object.fromEntries(req.headers);
        
        console.log('[API Upload] Initializing Busboy with headers:', headers['content-type']);
        
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
                console.log(`[API Upload] Field received: ${name} = ${value}`);
                if (name === 'title') assetData.title = value;
                if (name === 'category') assetData.category = value;
                if (name === 'tags') {
                    assetData.tags = value.split(',').map((t: string) => t.trim()).filter(Boolean);
                }
            });

            bb.on('file', (name, file, info) => {
                const { filename, mimeType } = info;
                console.log(`[API Upload] File detected: ${filename} (${mimeType})`);
                
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
                    console.log(`[API Upload] File stream ended. Total bytes: ${bytesRead}`);
                    writeStream.end();
                    fileUploaded = true;
                    savedFileUrl = `/uploads/${storedFilename}`;

                    // Determine type
                    let type: 'image' | 'pdf' | 'file' = 'file';
                    if (mimeType.startsWith('image/')) type = 'image';
                    else if (mimeType === 'application/pdf') type = 'pdf';

                    try {
                        console.log('[API Upload] Saving to MongoDB...');
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
                        console.log('[API Upload] MongoDB Save Successful:', finalResource._id);
                    } catch (err) {
                        console.error('[API Upload] DB Error:', err);
                    }
                });
            });

            bb.on('finish', () => {
                console.log('[API Upload] Busboy finished');
                if (!fileUploaded) {
                    console.error('[API Upload] No file was found in the stream');
                    resolveReject(NextResponse.json({ error: 'No file detected' }, { status: 400 }));
                    return;
                }
                resolveReject(NextResponse.json({ 
                    success: true, 
                    data: JSON.parse(JSON.stringify(finalResource)) 
                }));
            });

            bb.on('error', (err: any) => {
                console.error('[Busboy Error]', err);
                resolveReject(NextResponse.json({ error: 'Stream processing failed: ' + (err.message || 'Unknown Error') }, { status: 500 }));
            });

            nodeStream.pipe(bb);
        });

    } catch (err: any) {
        console.error('[Upload API Error]', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
