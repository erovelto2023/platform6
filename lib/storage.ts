import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.resolve(process.cwd(), "public", "uploads");

/**
 * Ensures the upload directory exists.
 */
const ensureUploadDir = () => {
    console.log(`[Storage] Checking UPLOAD_DIR: ${UPLOAD_DIR}`);
    if (!fs.existsSync(UPLOAD_DIR)) {
        console.log(`[Storage] Creating UPLOAD_DIR...`);
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
};

/**
 * Saves a file to the local filesystem.
 * @param file The file object from FormData
 * @returns The public URL of the saved file
 */
export async function saveFile(file: File): Promise<string> {
    ensureUploadDir();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Save to disk
    fs.writeFileSync(filePath, buffer);

    // Return the public URL
    return `/uploads/${fileName}`;
}

/**
 * Deletes a file from the local filesystem.
 * @param fileUrl The public URL of the file
 */
export async function deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl.startsWith("/uploads/")) return;

    const fileName = fileUrl.replace("/uploads/", "");
    const filePath = path.join(UPLOAD_DIR, fileName);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}
