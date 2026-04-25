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

const ALLOWED_EXTENSIONS = [
    ".jpg", ".jpeg", ".png", ".gif", ".webp", // Images
    ".pdf", ".docx", ".xlsx", ".pptx", ".txt", // Documents
    ".mp4", ".mp3", ".wav", ".m4a" // Media
];

const ALLOWED_MIME_TYPES = [
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "video/mp4", "audio/mpeg", "audio/wav", "audio/x-m4a"
];

/**
 * Saves a file to the local filesystem.
 * @param file The file object from FormData
 * @returns The public URL of the saved file
 */
export async function saveFile(file: File): Promise<string> {
    ensureUploadDir();

    // SECURITY: Validate file type
    const fileExtension = path.extname(file.name).toLowerCase();
    const mimeType = file.type;

    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
        throw new Error(`File extension ${fileExtension} is not allowed.`);
    }

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        throw new Error(`MIME type ${mimeType} is not allowed.`);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
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
