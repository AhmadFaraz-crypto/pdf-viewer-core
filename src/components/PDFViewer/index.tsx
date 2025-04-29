import React, { useState, useEffect, useRef, useCallback } from "react";
import { readAsPDF } from "../../utils/asyncReader";
import PDFCanvas from "../PdfCanvas";
import { PDFCanvasProps } from "../../types/types";
import BottomToolbar from "../BottomToolbar";

const PDFViewer = ({
  pdfFile,
  onLoadSuccess,
  onLoadError,
  onPageChange,
  getPdfName,
  showToolbar = true,
  toolbarConfig = {
    showPageNavigation: true,
  },
  toolbarStyles = {className: 'toolbar-style'},
  containerStyles = {className: 'container-style', maxHeight: '80vh', width: '100%', padding: '1rem'},
  fullScreen = false,
}: PDFCanvasProps) => {
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [isNavigation, setIsNavigation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState<number>(-1);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPDF = async () => {
      if (!pdfFile) return;

      setIsLoading(true);
      setError(null);
      try {
        let pdf;
        let fileName = "document.pdf";

        if (pdfFile instanceof File) {
          pdf = await readAsPDF(pdfFile);
          fileName = pdfFile.name;
        } else if (pdfFile instanceof ArrayBuffer) {
          pdf = await readAsPDF(new Blob([pdfFile]));
        } else if (typeof pdfFile === "string") {
          const response = await fetch(pdfFile);
          if (!response.ok) {
            throw new Error("Failed to fetch PDF from URL");
          }
          const pdfBlob = await response.blob();
          pdf = await readAsPDF(pdfBlob);

          const urlParts = pdfFile.split("/");
          fileName = urlParts[urlParts.length - 1] || fileName;
        } else {
          throw new Error("Invalid PDF source");
        }

        getPdfName?.(fileName);

        const numPages = pdf.numPages;
        const pagesPromises = Array(numPages)
          .fill(null)
          .map((_, i) => pdf.getPage(i + 1));

        const loadedPages = await Promise.all(pagesPromises);
        setPages(loadedPages);
        setSelectedPageIndex(0);
        setCurrentPage(0);
        setIsNavigation(true);
        onLoadSuccess?.();
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to load PDF");
        setError(error);
        onLoadError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPDF();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfFile, onLoadSuccess, onLoadError]);

  useEffect(() => {
    if (!pageRefs.current || isNavigation) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageIndex = pageRefs.current.indexOf(
              entry.target as HTMLDivElement,
            );
            if (currentPage === -1) {
              setCurrentPage(selectedPageIndex === -1 ? 0 : selectedPageIndex);
              setSelectedPageIndex?.(
                selectedPageIndex === -1 ? 0 : selectedPageIndex,
              );
              setIsNavigation?.(true);
            } else {
              if (pageIndex !== -1) {
                setCurrentPage(pageIndex);
                setSelectedPageIndex?.(pageIndex);
                setIsNavigation?.(false);
              }
            }
          }
        });
      },
      { root: null, threshold: 0.5 }, // Adjust threshold for better accuracy
    );

    pageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      pageRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageRefs, isNavigation]);

  // Effect to synchronize currentPage with selectedPageIndex
  useEffect(() => {
    if (currentPage !== selectedPageIndex) {
      setSelectedPageIndex?.(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Handle page changes
  useEffect(() => {
    if (selectedPageIndex >= 0) {
      onPageChange?.(selectedPageIndex + 1);
    }
  }, [selectedPageIndex, onPageChange]);

  const memoizedSetIsNavigation = useCallback((value: boolean) => {
    setIsNavigation?.(value);
  }, []);

  const handleNextPage = () => {
    if (!pages.length) return;
    if (currentPage < pages.length) {
      setCurrentPage((prev) => prev + 1);
    }
    memoizedSetIsNavigation(true);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
    memoizedSetIsNavigation(true);
  };

  // Effect to scroll to the selected page when selectedPageIndex changes
  useEffect(() => {
    if (
      isNavigation &&
      selectedPageIndex >= 0 &&
      pageRefs.current[selectedPageIndex]
    ) {
      pageRefs.current[selectedPageIndex]?.scrollIntoView({
        behavior: "smooth",
      });
      // setCurrentPage(selectedPageIndex);
      setTimeout(() => {
        memoizedSetIsNavigation(false);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPageIndex]);

  if (isLoading) {
    return (
      <div
        data-testid="pdf-loading"
        className="flex items-center justify-center"
      >
        <span>Loading PDF...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="pdf-error" className="text-red-500">
        {error.message}
      </div>
    );
  }

  return (
    <div
      className={`${containerStyles.className} relative flex flex-col items-center bg-gray-100`}
    >
      <div
        className="relative overflow-auto"
        style={
          !fullScreen
            ? {
                maxHeight: containerStyles?.maxHeight ?? "80vh",
                width: containerStyles?.width ?? "100%",
                padding: containerStyles?.padding ?? "1rem",
              }
            : {
                height: "100vh",
                width: "100%",
              }
        }
      >
        {pages.map((page, pIndex) => (
          <div
            key={pIndex}
            role="article"
            ref={(el: any) => (pageRefs.current[pIndex] = el)}
            className="p-5 w-full flex flex-col items-center"
          >
            <div
              className={`relative shadow-lg p-2 border-2 transition-all duration-300 overflow-hidden`}
            >
              <PDFCanvas page={page} />
            </div>
          </div>
        ))}
      </div>
      {showToolbar && (
        <BottomToolbar
          currentPage={currentPage}
          totalPages={pages.length ?? 1}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          setCurrentPage={setCurrentPage}
          setIsNavigation={setIsNavigation ?? (() => {})}
          config={toolbarConfig}
          styles={toolbarStyles}
        />
      )}
    </div>
  );
};

export default PDFViewer;
