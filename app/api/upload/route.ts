import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@clerk/nextjs/server";

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

        await writeFile(path, buffer);

        // Return the public URL
        const url = `/uploads/${fileName}`;

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
