/**
 * LibreOffice WASM Converter
 * 
 * Uses @matbee/libreoffice-converter WorkerBrowserConverter for document conversion.
 * 
 * Key design decisions:
 * 1. Uses WorkerBrowserConverter instead of BrowserConverter — runs WASM in a
 *    dedicated Web Worker, avoiding main-thread blocking and eliminating the need
 *    for fragile loadModule patches / Cloudflare Rocket Loader workarounds
 * 2. Uses uncompressed paths (soffice.wasm / soffice.data) — works natively with
 *    all servers (Next.js dev, Vercel, Netlify, etc.). For Nginx production,
 *    gzip_static automatically serves the .gz version when available.
 * 3. Specifies browserWorkerJs for the library's internal worker communication
 * 4. Checks SharedArrayBuffer support upfront — fails fast with a clear error
 * 
 * IMPORTANT: The browser.worker.global.js in public/libreoffice-wasm/ MUST match
 * the version from @matbee/libreoffice-converter/dist/. Do NOT modify it — the
 * library's WorkerBrowserConverter expects an unmodified worker script. If you
 * need CJK font support, fonts must be pre-baked into soffice.data.
 * 
 * How pthreads work:
 * - soffice.js (Emscripten glue) creates 4 pthread Workers via
 *   new Worker(Module["mainScriptUrlOrBlob"]) — loading soffice.js itself
 * - Each pthread Worker detects ENVIRONMENT_IS_PTHREAD from self.name ("em-pthread-N")
 * - These are NESTED Workers (created from inside the browser.worker.global.js Worker)
 * - They must NOT run from a Blob URL parent, or nested Worker creation breaks
 */

// import { WorkerBrowserConverter } from '@matbee/libreoffice-converter/browser';

const LIBREOFFICE_PATH = '/libreoffice-wasm/';
const ASSET_VERSION = '20240212-3';
// Request uncompressed names. In production, nginx gzip_static serves the .gz variant
// with correct Content-Encoding and MIME headers (required for WebAssembly streaming).
const SOFFICE_WASM_FILE = 'soffice.wasm';
const SOFFICE_DATA_FILE = 'soffice.data';

function normalizeBasePath(path: string): string {
    return path.endsWith('/') ? path : `${path}/`;
}

export interface LoadProgress {
    phase: 'loading' | 'initializing' | 'converting' | 'complete' | 'ready';
    percent: number;
    message: string;
}

export type ProgressCallback = (progress: LoadProgress) => void;

// Singleton for converter instance
let converterInstance: LibreOfficeConverter | null = null;

export class LibreOfficeConverter {
    constructor(basePath?: string) {
        console.warn('LibreOfficeConverter is mocked because assets are missing.');
    }

    async initialize(onProgress?: ProgressCallback): Promise<void> {
        console.warn('LibreOfficeConverter: Initializing mock...');
        if (onProgress) onProgress({ phase: 'ready', percent: 100, message: 'Mock converter ready (feature unavailable)' });
    }

    isReady(): boolean {
        return false;
    }

    async convert(file: File, outputFormat: string): Promise<Blob> {
        throw new Error('LibreOffice WASM assets are missing. Please install @matbee/libreoffice-converter and copy assets to /public/libreoffice-wasm/');
    }

    async convertToPdf(file: File): Promise<Blob> {
        return this.convert(file, 'pdf');
    }

    async wordToPdf(file: File): Promise<Blob> {
        return this.convertToPdf(file);
    }

    async pptToPdf(file: File): Promise<Blob> {
        return this.convertToPdf(file);
    }

    async excelToPdf(file: File): Promise<Blob> {
        return this.convertToPdf(file);
    }

    async destroy(): Promise<void> {
        // no-op
    }
}

export function getLibreOfficeConverter(basePath?: string): LibreOfficeConverter {
    if (!converterInstance) {
        converterInstance = new LibreOfficeConverter(basePath);
    }
    return converterInstance;
}
