import { NextRequest, NextResponse } from 'next/server';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join, resolve, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import busboy from 'busboy';
import { Readable } from 'stream';
import connectDB from '@/lib/db/connect';
import Resource from '@/lib/db/models/Resource';
import { getUserRole } from '@/lib/roles';

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
    try {
        const role = await getUserRole();
        if (role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
        }

        await connectDB();
        ensureUploadDir();

        const headers = Object.fromEntries(req.headers);
        const nodeStream = Readable.fromWeb(req.body as any);
        
        const bb = busboy({ 
            headers,
            limits: { fileSize: 1024 * 1024 * 1000 } // 1GB Limit
        });

        const uploadPromise = new Promise((resolve, reject) => {
            let finalResource: any = null;
            let fileUploaded = false;
            let assetData: any = { title: '', category: 'General', tags: [] };
            const filePromises: Promise<void>[] = [];

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

                const filePromise = new Promise<void>((resolveFile, rejectFile) => {
                    file.pipe(writeStream);

                    writeStream.on('finish', async () => {
                        try {
                            let type: 'image' | 'pdf' | 'file' = 'file';
                            if (mimeType.startsWith('image/')) type = 'image';
                            else if (mimeType === 'application/pdf') type = 'pdf';

                            const savedFileUrl = `/uploads/${storedFilename}`;
                            
                            finalResource = await Resource.create({
                                title: assetData.title || filename,
                                url: savedFileUrl,
                                type,
                                category: assetData.category,
                                mimeType,
                                fileSizeBytes: writeStream.bytesWritten,
                                originalFilename: filename,
                                storedFilename: storedFilename,
                                isPublished: true,
                                status: 'published',
                                altText: assetData.title || filename,
                                thumbnailUrl: type === 'image' ? savedFileUrl : undefined,
                                tags: assetData.tags
                            });

                            fileUploaded = true;
                            resolveFile();
                        } catch (err) {
                            rejectFile(err);
                        }
                    });

                    writeStream.on('error', (err) => rejectFile(err));
                });

                filePromises.push(filePromise);
            });

            bb.on('error', (err) => reject(err));

            bb.on('finish', async () => {
                try {
                    await Promise.all(filePromises);
                    if (!fileUploaded) {
                        reject(new Error("No file was uploaded"));
                    } else {
                        resolve(finalResource);
                    }
                } catch (err) {
                    reject(err);
                }
            });
        });

        nodeStream.pipe(bb);
        const result = await uploadPromise;

        return NextResponse.json({ 
            success: true, 
            data: JSON.parse(JSON.stringify(result)) 
        });

    } catch (error: any) {
        console.error('[API Upload Error]:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || "Upload failed" 
        }, { status: 500 });
    }
}
