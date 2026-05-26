// @ts-ignore
import PDFParser from "pdf2json";

export interface ParsedPDF {
  text: string;
  totalPages: number;
  info: Record<string, unknown>;
}

export async function parsePDF(buffer: Buffer): Promise<ParsedPDF> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true);

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(new Error(errData.parserError));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      const text = pdfParser.getRawTextContent();
      resolve({
        text: text,
        totalPages: pdfData.Pages ? pdfData.Pages.length : 1,
        info: {},
      });
    });

    try {
      pdfParser.parseBuffer(buffer);
    } catch (err) {
      reject(err);
    }
  });
}
