import { ToolbarStyles } from "../../types/types";

const BottomToolbar = ({
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
  config,
  styles = {},
}: {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  setCurrentPage: (page: number) => void;
  setIsNavigation: (isNavigation: boolean) => void;
  config: {
    showPageNavigation?: boolean;
  };
  styles?: ToolbarStyles;
}) => {

  return (
    <div
      data-testid="pdf-toolbar"
      role="toolbar"
      className={`${
        styles?.className
      } fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-white flex items-center justify-center px-4 py-2 rounded-lg shadow-md space-x-3`}
      style={{
        ...styles?.container,
        minWidth: '180px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      {config.showPageNavigation && (
        <div className="flex items-center space-x-3">
          <button
            data-testid="prev-page-button"
            onClick={onPreviousPage}
            disabled={currentPage === 0}
            className="text-2xl text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            ‹
          </button>

          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              {currentPage + 1} of {totalPages}
            </span>
          </div>

          <button
            data-testid="next-page-button"
            onClick={onNextPage}
            disabled={currentPage + 1 === totalPages}
            className="text-2xl text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default BottomToolbar;
