import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export interface ParsedPDF {
  text: string;
  totalPages: number;
  info: Record<string, unknown>;
}

export async function parsePDF(buffer: Buffer): Promise<ParsedPDF> {
  const data = new Uint8Array(buffer);
  
  // Load the PDF document
  const loadingTask = pdfjsLib.getDocument({
    data,
    useWorkerFetch: false,
    useSystemFonts: true,
  });
  
  const pdfDocument = await loadingTask.promise;
  const numPages = pdfDocument.numPages;
  let fullText = "";

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      // @ts-ignore
      .map((item) => item.str)
      .join(" ");
    fullText += pageText + "\n\n";
  }

  return {
    text: fullText,
    totalPages: numPages,
    info: {},
  };
}
