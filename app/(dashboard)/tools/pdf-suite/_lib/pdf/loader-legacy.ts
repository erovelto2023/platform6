/**
 * PDF.js Legacy Library Loader
 * 
 * NOTE: This loader is currently MOCKED because 'pdfjs-dist-legacy' 
 * is missing. To enable PDF-to-SVG conversion, install this package.
 */

// Type definitions for legacy pdfjs-dist
type PDFJSLegacyModule = any;

// Cached library instance
let pdfjsLegacyInstance: PDFJSLegacyModule | null = null;

// Loading promise to prevent duplicate loads
let pdfjsLegacyLoadingPromise: Promise<PDFJSLegacyModule> | null = null;

/**
 * Configure legacy PDF.js worker source
 */
function configureLegacyWorker(pdfjsLib: PDFJSLegacyModule): void {
    // no-op
}

/**
 * Load legacy pdfjs-dist library (v2.16.105)
 */
export async function loadPdfjsLegacy(): Promise<PDFJSLegacyModule> {
    throw new Error('Legacy PDF.js support is currently disabled due to missing dependencies (pdfjs-dist-legacy).');
}

/**
 * SVGGraphics type definition
 */
export interface SVGGraphicsInstance {
    embedFonts: boolean;
    getSVG(operatorList: any, viewport: any): Promise<SVGElement>;
}

export interface SVGGraphicsConstructor {
    new(commonObjs: any, objs: any): SVGGraphicsInstance;
}

/**
 * Load SVGGraphics class from legacy pdfjs-dist
 */
export async function loadSVGGraphics(): Promise<SVGGraphicsConstructor> {
    throw new Error('Legacy PDF.js support is currently disabled due to missing dependencies (pdfjs-dist-legacy).');
}

/**
 * Check if legacy library is loaded
 */
export function isLegacyLibraryLoaded(): boolean {
    return false;
}

/**
 * Get legacy library loading status
 */
export function getLegacyLibraryStatus(): 'loaded' | 'loading' | 'not-loaded' {
    return 'not-loaded';
}
