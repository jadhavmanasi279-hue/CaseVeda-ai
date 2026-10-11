import * as pdfjsLib from 'pdfjs-dist';
import { PageContent } from '../types';

// Use standard CDN worker matching the installed pdfjs-dist version
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

export interface ExtractedPdfResult {
  fileName: string;
  fileSize: number;
  pageCount: number;
  fullText: string;
  pages: PageContent[];
  hasExtractableText: boolean;
  totalExtractedCharacters: number;
  ocrNotice?: string;
}

/**
 * Safely clean up whitespace and line artifacts while preserving legal words and text structure.
 * Fixes hyphens split across line wraps (e.g., "dis- missed" -> "dismissed").
 */
export function cleanExtractedText(text: string): string {
  if (!text) return '';

  return text
    // Replace hyphenated line breaks (e.g., "judg-\nment" or "judg- ment") with united word
    .replace(/(\b[A-Za-z]{2,})-\s+([a-z]{2,}\b)/g, '$1$2')
    // Normalize unicode quotes and dashes commonly present in court PDFs
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    // Replace multiple spaces or tabs with single space
    .replace(/[ \t]+/g, ' ')
    // Collapse more than two consecutive line breaks
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extracts plain text and page-by-page structure from an uploaded File (PDF, TXT)
 */
export async function extractTextFromPdf(
  file: File,
  onProgress?: (progressMsg: string, percent: number) => void
): Promise<ExtractedPdfResult> {
  // 1. File size check (25MB limit)
  const maxBytes = 25 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(
      `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 25MB upload limit. Please upload an official judgment document under 25MB.`
    );
  }

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

  // Text fallback for plain court transcripts or text files
  if (!isPdf) {
    onProgress?.('Reading text document content...', 40);
    const rawText = await file.text();
    onProgress?.('Partitioning document segments...', 90);

    const cleaned = cleanExtractedText(rawText);
    const pageChunks = cleaned.split(/\f|\n{3,}/).filter(chunk => chunk.trim().length > 0);
    const pages: PageContent[] = pageChunks.length > 0
      ? pageChunks.map((chunk, idx) => ({ pageNumber: idx + 1, text: cleanExtractedText(chunk) }))
      : [{ pageNumber: 1, text: cleaned }];

    const hasText = cleaned.length > 20;

    return {
      fileName: file.name,
      fileSize: file.size,
      pageCount: pages.length,
      fullText: cleaned,
      pages,
      hasExtractableText: hasText,
      totalExtractedCharacters: cleaned.length,
      ocrNotice: hasText ? undefined : 'The uploaded text file does not contain readable characters.',
    };
  }

  // Handle PDF using PDF.js
  onProgress?.('Loading PDF document structure...', 15);
  const arrayBuffer = await file.arrayBuffer();

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdfDoc = await loadingTask.promise;
    const pageCount = pdfDoc.numPages;
    const pages: PageContent[] = [];
    let combinedText = '';
    let totalExtractedCharacters = 0;

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const percent = Math.round(15 + (pageNum / pageCount) * 75);
      onProgress?.(`Extracting text from Page ${pageNum} of ${pageCount}...`, percent);

      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageStrings = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .filter(str => str.trim().length > 0);

      const rawPageText = pageStrings.join(' ');
      const cleanedPageText = cleanExtractedText(rawPageText);

      pages.push({
        pageNumber: pageNum,
        text: cleanedPageText,
      });

      totalExtractedCharacters += cleanedPageText.length;
      combinedText += (combinedText ? '\n\n' : '') + `--- Page ${pageNum} ---\n` + cleanedPageText;
    }

    onProgress?.('Verifying extractable digital text layer...', 95);

    // Check if document contains extractable text or is a scanned image PDF
    const avgCharsPerPage = pageCount > 0 ? totalExtractedCharacters / pageCount : 0;
    const hasExtractableText = totalExtractedCharacters >= 40 && avgCharsPerPage >= 15;

    let ocrNotice: string | undefined = undefined;
    if (!hasExtractableText) {
      ocrNotice = `This PDF appears to be a scanned image-only document or contains no extractable text layer (${totalExtractedCharacters} total characters across ${pageCount} pages). CaseVeda AI requires digital text for legal fact extraction. Optical Character Recognition (OCR) is not currently available client-side without an external OCR service.`;
    }

    onProgress?.('Text extraction completed.', 100);

    return {
      fileName: file.name,
      fileSize: file.size,
      pageCount,
      fullText: combinedText,
      pages,
      hasExtractableText,
      totalExtractedCharacters,
      ocrNotice,
    };
  } catch (error: any) {
    console.error('PDF.js text extraction error:', error);
    throw new Error(
      `Failed to parse PDF document "${file.name}". ${error?.message || 'The PDF might be corrupted, password-protected, or formatted improperly.'}`
    );
  }
}
