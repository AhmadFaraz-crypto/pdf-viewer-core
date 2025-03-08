import { describe, it, expect, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import * as RTL from "@testing-library/react";
import BottomToolbar from "./index";

const { screen } = RTL;

describe("BottomToolbar", () => {
  const defaultProps = {
    currentPage: 0,
    totalPages: 5,
    onNextPage: vi.fn(),
    onPreviousPage: vi.fn(),
    setCurrentPage: vi.fn(),
    setIsNavigation: vi.fn(),
    config: {
      showPageNavigation: true,
    },
  };

  it("renders navigation controls", async () => {
    render(<BottomToolbar {...defaultProps} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /previous/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });
  });

  it("disables previous button on first page", async () => {
    render(<BottomToolbar {...defaultProps} currentPage={0} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    });
  });

  it("disables next button on last page", async () => {
    render(<BottomToolbar {...defaultProps} currentPage={4} totalPages={5} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
    });
  });

  it("applies custom styles when provided", async () => {
    const customStyles = {
      className: "custom-class",
    };

    render(<BottomToolbar {...defaultProps} styles={customStyles} />);

    await waitFor(() => {
      const toolbar = screen.getByRole("toolbar");
      expect(toolbar).toHaveClass("custom-class");
    });
  });
});
