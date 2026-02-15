/**
 * OCR PDF Processor
 * Requirements: 5.1
 * 
 * Performs Optical Character Recognition on PDF pages.
 * 
 * NOTE: This processor is currently MOCKED because 'tesseract.js'
 * is missing. To enable this feature, install this package.
 */

import type {
  ProcessInput,
  ProcessOutput,
  ProgressCallback,
} from '@/app/(dashboard)/tools/pdf-suite/_types/pdf';
import { BasePDFProcessor } from '../processor';

/**
 * Supported OCR languages
 */
export type OCRLanguage = 'eng' | 'chi_sim' | 'chi_tra' | 'jpn' | 'kor' | 'spa' | 'fra' | 'deu' | 'por' | 'ara';

/**
 * OCR options
 */
export interface OCROptions {
  languages: OCRLanguage[];
  scale: number;
  pages: number[];
  outputFormat: 'text' | 'searchable-pdf';
  preserveLayout: boolean;
}

/**
 * Language display names
 */
export const OCR_LANGUAGE_NAMES: Record<OCRLanguage, string> = {
  eng: 'English',
  chi_sim: 'Chinese (Simplified)',
  chi_tra: 'Chinese (Traditional)',
  jpn: 'Japanese',
  kor: 'Korean',
  spa: 'Spanish',
  fra: 'French',
  deu: 'German',
  por: 'Portuguese',
  ara: 'Arabic',
};

/**
 * OCR PDF Processor
 * Performs OCR on PDF pages.
 */
export class OCRProcessor extends BasePDFProcessor {

  async process(
    input: ProcessInput,
    onProgress?: ProgressCallback
  ): Promise<ProcessOutput> {
    throw new Error('OCR feature is currently disabled due to missing dependencies (tesseract.js).');
  }
}

/**
 * Create a new instance of the OCR processor
 */
export function createOCRProcessor(): OCRProcessor {
  return new OCRProcessor();
}

/**
 * Perform OCR on PDF (convenience function)
 */
export async function ocrPDF(
  file: File,
  options?: Partial<OCROptions>,
  onProgress?: ProgressCallback
): Promise<ProcessOutput> {
  const processor = createOCRProcessor();
  return processor.process(
    {
      files: [file],
      options: options || {},
    },
    onProgress
  );
}
