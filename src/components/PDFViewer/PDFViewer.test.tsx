import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import * as RTL from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PDFViewer from "./index";
import { readAsPDF } from "../../utils/asyncReader";

const { screen } = RTL;

// Mock the readAsPDF function to control loading state
vi.mock("../../utils/asyncReader", () => ({
  readAsPDF: vi.fn(),
}));

describe("PDFViewer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Mock PDF document for successful load cases
  const mockPdfDocument = {
    numPages: 5,
    getPage: vi.fn().mockResolvedValue({
      getViewport: vi.fn().mockReturnValue({ width: 800, height: 1000 }),
      render: vi.fn().mockResolvedValue({}),
    }),
  };

  const renderPDFViewer = async (props = {}) => {
    (readAsPDF as any).mockResolvedValue(mockPdfDocument);

    const result = render(
      <PDFViewer pdfFile={new ArrayBuffer(0)} {...props} />,
    );

    // Wait for PDF to load
    await waitFor(() => {
      expect(screen.queryByTestId("pdf-loading")).not.toBeInTheDocument();
    });

    return result;
  };

  it("renders loading state initially", async () => {
    // Create a promise that we can control
    let resolvePromise: (value: any) => void;
    const loadingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    // Mock readAsPDF to return our controlled promise
    (readAsPDF as any).mockReturnValue(loadingPromise);

    render(<PDFViewer pdfFile={new ArrayBuffer(0)} />);

    // Check for loading state
    expect(screen.getByTestId("pdf-loading")).toBeInTheDocument();

    // Resolve the loading promise
    resolvePromise!({
      numPages: 5,
      getPage: vi.fn().mockResolvedValue({
        getViewport: vi.fn().mockReturnValue({ width: 800, height: 1000 }),
        render: vi.fn().mockResolvedValue({}),
      }),
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("pdf-loading")).not.toBeInTheDocument();
    });
  });

  it("calls onLoadSuccess when PDF loads successfully", async () => {
    const onLoadSuccess = vi.fn();
    render(
      <PDFViewer pdfFile={new ArrayBuffer(0)} onLoadSuccess={onLoadSuccess} />,
    );

    await waitFor(() => {
      expect(onLoadSuccess).toHaveBeenCalled();
    });
  });

  it("shows correct number of pages", async () => {
    render(<PDFViewer pdfFile={new ArrayBuffer(0)} />);

    await waitFor(() => {
      const pages = screen.getAllByRole("article");
      expect(pages).toHaveLength(5); // mockPDFDocument has 5 pages
    });
  });

  it("calls onLoadError when PDF fails to load", async () => {
    const onLoadError = vi.fn();
    const expectedError = new Error("Failed to load PDF");

    // Mock readAsPDF to reject with an error
    (readAsPDF as any).mockRejectedValue(expectedError);

    render(
      <PDFViewer pdfFile={new ArrayBuffer(0)} onLoadError={onLoadError} />,
    );

    await waitFor(() => {
      expect(onLoadError).toHaveBeenCalledWith(expectedError);
    });
  });

  it("shows error message when PDF fails to load", async () => {
    // Mock readAsPDF to reject with an error
    (readAsPDF as any).mockRejectedValue(new Error("Failed to load PDF"));

    render(<PDFViewer pdfFile={new ArrayBuffer(0)} />);

    await waitFor(() => {
      expect(screen.getByTestId("pdf-error")).toBeInTheDocument();
      expect(screen.getByText(/failed to load pdf/i)).toBeInTheDocument();
    });
  });

  it("shows toolbar when showToolbar is true", async () => {
    // Mock successful PDF load
    (readAsPDF as any).mockResolvedValue(mockPdfDocument);

    render(<PDFViewer pdfFile={new ArrayBuffer(0)} showToolbar={true} />);

    // Wait for PDF to load
    await waitFor(() => {
      expect(screen.queryByTestId("pdf-loading")).not.toBeInTheDocument();
    });

    // Check if toolbar is rendered
    const toolbar = screen.getByTestId("pdf-toolbar");
    expect(toolbar).toBeInTheDocument();
  });

  it("hides toolbar when showToolbar is false", async () => {
    // Mock successful PDF load
    (readAsPDF as any).mockResolvedValue(mockPdfDocument);

    render(<PDFViewer pdfFile={new ArrayBuffer(0)} showToolbar={false} />);

    // Wait for PDF to load
    await waitFor(() => {
      expect(screen.queryByTestId("pdf-loading")).not.toBeInTheDocument();
    });

    // Check if toolbar is not rendered
    expect(screen.queryByTestId("pdf-toolbar")).not.toBeInTheDocument();
  });

  describe("Navigation Tests", () => {
    it("handles next page navigation", async () => {
      const onPageChange = vi.fn();
      await renderPDFViewer({ onPageChange });

      const nextButton = screen.getByTestId("next-page-button");
      await userEvent.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it("handles previous page navigation", async () => {
      const onPageChange = vi.fn();
      await renderPDFViewer({ onPageChange });

      // Go to page 2 first
      const nextButton = screen.getByTestId("next-page-button");
      await userEvent.click(nextButton);

      const prevButton = screen.getByTestId("prev-page-button");
      await userEvent.click(prevButton);

      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it("disables previous button on first page", async () => {
      await renderPDFViewer();

      const prevButton = screen.getByTestId("prev-page-button");
      expect(prevButton).toBeDisabled();
    });

    it("disables next button on last page", async () => {
      await renderPDFViewer();

      // Go to last page
      for (let i = 0; i < mockPdfDocument.numPages - 1; i++) {
        await userEvent.click(screen.getByTestId("next-page-button"));
      }

      const nextButton = screen.getByTestId("next-page-button");
      expect(nextButton).toBeDisabled();
    });

    it("allows direct page navigation via input", async () => {
      const onPageChange = vi.fn();
      await renderPDFViewer({ onPageChange });

      const pageInput = screen.getByTestId("page-input");
      await userEvent.clear(pageInput);
      await userEvent.type(pageInput, "3");
      await userEvent.keyboard("{Enter}");

      expect(onPageChange).toHaveBeenCalledWith(3); // 0-based index
    });
  });

  describe("Toolbar Configuration Tests", () => {
    it("shows page navigation when configured", async () => {
      await renderPDFViewer({
        toolbarConfig: { showPageNavigation: true },
      });

      expect(screen.getByTestId("page-input")).toBeInTheDocument();
      expect(screen.getByTestId("prev-page-button")).toBeInTheDocument();
      expect(screen.getByTestId("next-page-button")).toBeInTheDocument();
    });
  });

  describe("PDF Source Handling", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("handles File upload", async () => {
      const file = new File(["dummy content"], "test.pdf", {
        type: "application/pdf",
      });
      const onLoadSuccess = vi.fn();

      render(<PDFViewer pdfFile={file} onLoadSuccess={onLoadSuccess} />);

      await waitFor(() => {
        expect(onLoadSuccess).toHaveBeenCalled();
      });
    });

    it("handles ArrayBuffer input", async () => {
      const buffer = new ArrayBuffer(8);
      const onLoadSuccess = vi.fn();

      render(<PDFViewer pdfFile={buffer} onLoadSuccess={onLoadSuccess} />);

      await waitFor(() => {
        expect(onLoadSuccess).toHaveBeenCalled();
      });
    });

    it("handles URL input", async () => {
      const url = "https://example.com/test.pdf";
      const onLoadSuccess = vi.fn();

      // Mock fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () =>
          Promise.resolve(
            new Blob(["dummy content"], { type: "application/pdf" }),
          ),
      });

      render(<PDFViewer pdfFile={url} onLoadSuccess={onLoadSuccess} />);

      await waitFor(() => {
        expect(onLoadSuccess).toHaveBeenCalled();
      });
    });

    it("handles URL fetch error", async () => {
      const url = "https://example.com/test.pdf";
      const onLoadError = vi.fn();

      // Mock fetch error
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      });

      render(<PDFViewer pdfFile={url} onLoadError={onLoadError} />);

      await waitFor(() => {
        expect(onLoadError).toHaveBeenCalled();
      });
    });
  });
});
