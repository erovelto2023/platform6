import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import Resource from "@/lib/db/models/Resource";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 1 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file uploaded", { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure upload directory exists
        const uploadDir = join(process.cwd(), "public", "uploads");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Directory might already exist
        }

        // Generate unique filename to avoid collisions
        const uniqueId = uuidv4();
        const extension = file.name.split('.').pop();
        const fileName = `${uniqueId}.${extension}`;
        const path = join(uploadDir, fileName);

        console.log(`[DEBUG_UPLOAD] Writing file to: ${path}`);
        await writeFile(path, buffer);

        // Return the public URL
        const url = `/uploads/${fileName}`;
        
        let type = 'file';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type === 'application/pdf') type = 'pdf';

        try {
            await connectDB();
            await Resource.create({
                title: file.name,
                url,
                type,
                category: 'General',
                mimeType: file.type,
                fileSizeBytes: file.size,
                originalFilename: file.name,
                storedFilename: fileName,
                isPublished: true,
                isMedia: true,
                status: 'published',
                altText: file.name,
                thumbnailUrl: type === 'image' ? url : undefined,
                tags: []
            });
        } catch (dbError) {
            console.error("Failed to save resource to DB:", dbError);
        }

        return NextResponse.json({
            url,
            name: file.name,
            size: file.size,
            type: file.type
        });

    } catch (error) {
        console.error("[UPLOAD_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
