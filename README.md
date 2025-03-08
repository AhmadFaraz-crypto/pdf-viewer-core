# React PDF Viewer

A modern, flexible and customizable PDF viewer package for React applications.

## Features

- 🚀 Fast and responsive PDF rendering
- 📱 Mobile-friendly with touch support
- 🎨 Customizable UI and styling
- 📄 Multiple page navigation
- 🎯 Page scrolling with smooth transitions
- 📦 Support for both file uploads and URL sources
- 🎮 Comprehensive toolbar controls
- 🎨 Flexible styling options

## Installation

```bash
npm install pdf-viewer-core
```

## Usage

```tsx
import { PDFViewer } from 'pdf-viewer-core';
import 'pdf-viewer-core/style.css';

<PDFViewer pdfFile={pdfFile} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pdfFile` | `File/url/ArrayBuffer` | `undefined` | The PDF file to display. |
| `onLoadSuccess` | `() => void` | `undefined` | Callback function called when the PDF is loaded successfully. |
| `onLoadError` | `(error: Error) => void` | `undefined` | Callback function called when the PDF fails to load. |
| `onPageChange` | `(page: number) => void` | `undefined` | Callback function called when the page changes. |
| `getPdfName` | `(name: string) => void` | `undefined` | Callback function called to get the name of the PDF file. |
| `showToolbar` | `boolean` | `true` | Whether to show the toolbar. |
| `toolbarConfig` | `{ showPageNavigation: boolean }` | `{ showPageNavigation: true }` | The configuration for the toolbar. |
| `toolbarStyles` | `React.CSSProperties` | `{className: 'toolbar-style'}` | The styles for the toolbar. |
| `containerStyles` | `React.CSSProperties` | `{className: 'container-style', maxHeight: '80vh', width: '100%'}` | The styles for the container. |
| `fullScreen` | `boolean` | `false` | Whether to show the full screen. |

## Configuration Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `vitest.config.ts` - Vitest configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

If you have any questions or need help, please:
  - Open an issue
  - Contact us at ahmadfarazjutt3@gmail.com

## Development

```bash
npm install
npm run dev
```

## Testing

```bash
npm run test
```

## Linting

```bash
npm run lint
```

## Formatting

```bash
npm run format
```

## Example

```bash
npm run example
```


## Support
[Buy me a coffee](https://buymeacoffee.com/ahmadfaraz1)