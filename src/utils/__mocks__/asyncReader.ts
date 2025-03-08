import { vi } from "vitest";
import { mockPDFDocument } from "../../test/mocks/pdfjs.mock";

export const readAsPDF = vi.fn().mockResolvedValue(mockPDFDocument);
