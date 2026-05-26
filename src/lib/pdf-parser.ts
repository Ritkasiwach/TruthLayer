// @ts-ignore
if (typeof global.DOMMatrix === 'undefined') global.DOMMatrix = class DOMMatrix {} as any;
// @ts-ignore
if (typeof global.ImageData === 'undefined') global.ImageData = class ImageData {} as any;
// @ts-ignore
if (typeof global.Path2D === 'undefined') global.Path2D = class Path2D {} as any;

// @ts-ignore
const pdf = require("pdf-parse/lib/pdf-parse.js");

export interface ParsedPDF {
  text: string;
  totalPages: number;
  info: Record<string, unknown>;
}

export async function parsePDF(buffer: Buffer): Promise<ParsedPDF> {
  const data = await pdf(buffer);

  return {
    text: data.text,
    totalPages: data.numpages,
    info: data.info || {},
  };
}
