import { vi } from "vitest";

export const mockPDFPage = {
  getViewport: vi.fn().mockReturnValue({
    width: 800,
    height: 1000,
    scale: 1,
  }),
  render: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
};

export const mockPDFDocument = {
  numPages: 5,
  getPage: vi.fn().mockResolvedValue(mockPDFPage),
  _initialize: vi.fn().mockResolvedValue(true),
};

vi.mock("pdfjs-dist", () => ({
  default: {
    getDocument: vi.fn().mockImplementation(() => ({
      promise: Promise.resolve(mockPDFDocument),
      _initialize: vi.fn().mockResolvedValue(true),
    })),
    GlobalWorkerOptions: {
      workerSrc: "",
    },
  },
}));

vi.mock("../../utils/asyncReader", () => ({
  readAsPDF: vi.fn().mockResolvedValue({
    numPages: 5,
    getPage: vi.fn().mockResolvedValue(mockPDFPage),
    _initialize: vi.fn().mockResolvedValue(true),
  }),
}));
