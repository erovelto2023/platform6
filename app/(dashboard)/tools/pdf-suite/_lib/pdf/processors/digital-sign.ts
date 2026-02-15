/**
 * Digital Signature Processor
 * Signs PDFs with X.509 certificates.
 * 
 * NOTE: This processor is currently MOCKED because 'node-forge' and 'zgapdfsigner' 
 * dependencies are missing. To enable this feature, install these packages.
 */

// import forge from 'node-forge';
import type {
  CertificateData,
  SignPdfOptions,
} from '@/app/(dashboard)/tools/pdf-suite/_types/digital-signature';

/**
 * Parse a PFX/P12 file
 */
export function parsePfxFile(pfxBytes: ArrayBuffer, password: string): CertificateData {
  throw new Error('Digital Signature feature is currently disabled due to missing dependencies (node-forge).');
}

/**
 * Parse PEM files (combined cert + key)
 */
export function parseCombinedPem(pemContent: string, password?: string): CertificateData {
  throw new Error('Digital Signature feature is currently disabled due to missing dependencies (node-forge).');
}

/**
 * Get certificate info for display
 */
export function getCertificateInfo(certificate: any) {
  return {
    subject: 'Unknown',
    issuer: 'Unknown',
    validFrom: new Date(),
    validTo: new Date(),
    serialNumber: '000000',
  };
}

/**
 * Sign a PDF with a certificate
 */
export async function signPdf(
  pdfBytes: Uint8Array,
  certificateData: CertificateData,
  options: SignPdfOptions = {}
): Promise<Uint8Array> {
  throw new Error('Digital Signature feature is currently disabled due to missing dependencies (node-forge, zgapdfsigner).');
}
