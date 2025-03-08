import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      skipDiagnostics: true
    })
  ],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PDFViewer',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        // Provide global variables to use in the UMD build
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsx'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'index.css';
          return assetInfo.name;
        }
      }
    },
    cssCodeSplit: false,  // This ensures all CSS goes into one file
    commonjsOptions: {
      include: [/node_modules/],
      requireReturnsDefault: 'auto'
    }
  },
  optimizeDeps: {
    include: ['ajv']
  }
})
