import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { WorksheetPage } from "./worksheet-store";

export interface PDFExportOptions {
    projectName: string;
    width: number;
    height: number;
    pages: WorksheetPage[];
    highResImages?: string[]; // 300+ DPI high-res Data URLs
}

/**
 * Converts a vector SVG string into an Ultra-HD 4K (3264 × 4224 px) PNG Data URL.
 * Vector anti-aliased rendering ensures 100% razor-sharp text & line art.
 */
export async function convertSvgToHighResDataUrl(
    svgString: string,
    width: number,
    height: number,
    scaleFactor: number = 4
): Promise<string> {
    return new Promise((resolve) => {
        if (typeof window === "undefined") {
            resolve("");
            return;
        }

        const img = new Image();
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width * scaleFactor;   // e.g. 816 * 4 = 3264px
            canvas.height = height * scaleFactor; // e.g. 1056 * 4 = 4224px

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL("image/png", 1.0));
        };

        img.onerror = (err) => {
            console.error("SVG rendering to canvas error:", err);
            URL.revokeObjectURL(url);
            resolve("");
        };

        img.src = url;
    });
}

export async function generateWorksheetPDF(options: PDFExportOptions): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    pdfDoc.setTitle(options.projectName || "Worksheet");
    pdfDoc.setAuthor("Worksheet Designer");
    pdfDoc.setSubject("Educational Worksheet");

    // Convert pixels to PDF Points (72 points per inch; standard width/height is in 96 DPI pixels)
    const ptWidth = (options.width * 72) / 96;
    const ptHeight = (options.height * 72) / 96;

    for (let i = 0; i < options.pages.length; i++) {
        const pageData = options.pages[i];
        const imageDataUrl = options.highResImages?.[i] || pageData.thumbnail;
        const pdfPage = pdfDoc.addPage([ptWidth, ptHeight]);

        if (imageDataUrl) {
            try {
                const base64Data = imageDataUrl.split(",")[1];
                if (base64Data) {
                    const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
                    const isPng = imageDataUrl.startsWith("data:image/png");
                    const embeddedImage = isPng ? await pdfDoc.embedPng(imageBytes) : await pdfDoc.embedJpg(imageBytes);

                    pdfPage.drawImage(embeddedImage, {
                        x: 0,
                        y: 0,
                        width: ptWidth,
                        height: ptHeight,
                    });
                }
            } catch (err) {
                console.error("PDF image embedding error for page:", pageData.name, err);
            }
        }
    }

    return await pdfDoc.save();
}
