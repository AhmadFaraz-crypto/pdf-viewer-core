import { useEffect, useState } from "react";
import { ToolbarStyles } from "../../types/types";

const BottomToolbar = ({
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
  setCurrentPage,
  setIsNavigation,
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
  const [pageInput, setPageInput] = useState(String(currentPage + 1));

  useEffect(() => {
    setPageInput(String(currentPage + 1));
  }, [currentPage]);

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(inputValue)) {
      return;
    }

    // If input is empty, allow it (user is in process of typing)
    if (inputValue === "") {
      setPageInput("");
      return;
    }

    const numValue = parseInt(inputValue);

    // Don't allow values above totalPages
    if (numValue > totalPages) {
      return;
    }

    setPageInput(inputValue);

    // Only update the page if it's a valid number within range
    if (numValue > 0 && numValue <= totalPages) {
      setIsNavigation(true);
      setCurrentPage(numValue - 1);
    }
  };

  const handlePageInputBlur = () => {
    if (
      pageInput === "" ||
      isNaN(parseInt(pageInput)) ||
      parseInt(pageInput) < 1 ||
      parseInt(pageInput) > totalPages
    ) {
      setPageInput(String(currentPage + 1));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePageInputBlur();
    }
  };

  return (
    <div
      data-testid="pdf-toolbar"
      role="toolbar"
      className={`${styles?.className} sticky z-50 bottom-10 left-0 right-0 mx-auto w-11/12 sm:w-3/4 md:w-1/2 max-w-2xs bg-gray-900 text-white flex items-center justify-center px-2 sm:px-4 py-2 rounded-md shadow-md overflow-x-auto whitespace-nowrap`}
      style={styles?.container}
    >
      {config.showPageNavigation && (
        <div className="flex items-center space-x-2">
          <button
            data-testid="prev-page-button"
            onClick={onPreviousPage}
            disabled={currentPage === 0}
            className="p-2 text-gray-300 hover:text-white disabled:cursor-not-allowed"
          >
            <span className="sr-only">previous</span>
            {styles?.arrowUpImage ? (
              <img src={styles?.arrowUpImage} alt="arrow up" />
            ) : (
              "↑"
            )}
          </button>
          <button
            data-testid="next-page-button"
            onClick={onNextPage}
            disabled={currentPage + 1 === totalPages}
            className="p-2 text-gray-300 hover:text-white disabled:cursor-not-allowed"
          >
            <span className="sr-only">next</span>
            {styles?.arrowDownImage ? (
              <img src={styles?.arrowDownImage} alt="arrow down" />
            ) : (
              "↓"
            )}
          </button>
          <div className="flex items-center space-x-2">
            <input
              data-testid="page-input"
              type="text"
              value={pageInput}
              onChange={handlePageChange}
              onBlur={handlePageInputBlur}
              onKeyDown={handleKeyDown}
              className="w-12 p-1 text-center bg-gray-700 rounded text-white outline-none"
            />
            <span className="p-2 bg-gray-700 rounded">/ {totalPages}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomToolbar;
