export type PDFCanvasProps = {
  pdfFile: File | ArrayBuffer | string; // Required prop from user
  onLoadSuccess?: () => void; // Optional callback when PDF loads
  onLoadError?: (error: Error) => void; // Optional error callback
  onPageChange?: (pageNumber: number) => void; // Optional page change callback
  getPdfName?: (pdfName: string) => void;
  showToolbar?: boolean; // Optional toolbar visibility
  toolbarConfig?: {
    // Optional toolbar configuration
    showZoom?: boolean;
    showPageNavigation?: boolean;
  };
  toolbarStyles?: {
    className?: string;
  };
  containerStyles?: {
    className?: string;
    maxHeight?: string | number;
    width?: string | number;
    padding?: string | number;
  };
  fullScreen?: boolean;
};

export type ToolbarStyles = {
  arrowUpImage?: string;
  arrowDownImage?: string;
  zoomInImage?: string;
  zoomOutImage?: string;
  className?: string;
  container?: React.CSSProperties;
};
