import { loadExternalScript } from './loadExternalScript';

const HTML2CANVAS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
const JSPDF_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

interface PdfLibraries {
  html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  jsPDF: new (...args: ConstructorParameters<any>) => any;
}

export const ensurePdfLibraries = async (): Promise<PdfLibraries> => {
  if (typeof window === 'undefined') {
    throw new Error('PDF generation ist nur im Browser möglich.');
  }

  await Promise.all([
    loadExternalScript(HTML2CANVAS_SRC),
    loadExternalScript(JSPDF_SRC),
  ]);

  const html2canvas = (window as any).html2canvas;
  const jspdfNamespace = (window as any).jspdf;
  const jsPDF = jspdfNamespace?.jsPDF;

  if (!html2canvas || !jsPDF) {
    throw new Error('PDF-Bibliotheken konnten nicht geladen werden.');
  }

  return { html2canvas, jsPDF };
};
