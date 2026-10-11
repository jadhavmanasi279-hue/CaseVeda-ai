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
}

/**
 * Extracts plain text and page-by-page structure from an uploaded File (PDF, TXT)
 */
export async function extractTextFromPdf(
  file: File,
  onProgress?: (progressMsg: string, percent: number) => void
): Promise<ExtractedPdfResult> {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    // Text fallback for plain court transcripts or plain text judgments
    onProgress?.('Reading text document content...', 40);
    const text = await file.text();
    onProgress?.('Partitioning document segments...', 90);
    
    // Split into simulated pages by character count or form-feed markers if present
    const pageChunks = text.split(/\f|\n{3,}/).filter(chunk => chunk.trim().length > 0);
    const pages: PageContent[] = pageChunks.length > 0
      ? pageChunks.map((chunk, idx) => ({ pageNumber: idx + 1, text: chunk.trim() }))
      : [{ pageNumber: 1, text: text.trim() }];

    return {
      fileName: file.name,
      fileSize: file.size,
      pageCount: pages.length,
      fullText: text,
      pages,
    };
  }

  // Handle PDF using PDF.js
  onProgress?.('Loading PDF document structure...', 20);
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

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const percent = Math.round(20 + (pageNum / pageCount) * 70);
      onProgress?.(`Extracting text from Page ${pageNum} of ${pageCount}...`, percent);

      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageStrings = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .filter(str => str.trim().length > 0);

      const pageText = pageStrings.join(' ').replace(/\s+/g, ' ').trim();
      pages.push({
        pageNumber: pageNum,
        text: pageText,
      });
      combinedText += (combinedText ? '\n\n' : '') + `--- Page ${pageNum} ---\n` + pageText;
    }

    onProgress?.('Text extraction completed successfully.', 100);

    return {
      fileName: file.name,
      fileSize: file.size,
      pageCount,
      fullText: combinedText,
      pages,
    };
  } catch (error: any) {
    console.error('PDF.js text extraction error:', error);
    throw new Error(
      `Failed to extract text from "${file.name}". ${error?.message || 'The PDF might be password-protected or contain scanned bitmap images requiring OCR.'}`
    );
  }
}
