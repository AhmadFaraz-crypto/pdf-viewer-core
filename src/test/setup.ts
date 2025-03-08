import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import './mocks/pdfjs.mock';

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];

    constructor(
        private callback: IntersectionObserverCallback,
        private options?: IntersectionObserverInit
    ) {}

    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
    takeRecords = vi.fn(() => []);
}

// Set the mock constructor as the global IntersectionObserver
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();
HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock canvas and its context
const mockContext2D = {
  scale: vi.fn(),
  drawImage: vi.fn(),
  getImageData: vi.fn(),
  putImageData: vi.fn(),
  transform: vi.fn(),
  setTransform: vi.fn(),
};

global.HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockContext2D);

// Mock FileReader
global.FileReader = class {
  readAsArrayBuffer() {
    this.onload?.({ target: { result: new ArrayBuffer(0) } } as any);
  }
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
};

// Extend expect with DOM matchers
expect.extend(matchers as any);

// Mock scroll behavior
Object.defineProperty(window, 'scroll', {
  value: vi.fn(),
  writable: true
});

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
}); 