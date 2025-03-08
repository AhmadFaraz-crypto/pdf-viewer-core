import React, { useState } from 'react';
import { PDFViewer } from 'pdf-viewer-core';
import 'pdf-viewer-core/style.css';
import { FiUpload, FiLink, FiX } from 'react-icons/fi';

function App() {
  const [pdfFile, setPdfFile] = useState<File | string | null>(null);
  const [url, setUrl] = useState<string>('');
  const [isUrlInput, setIsUrlInput] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setFileName(file.name);
      setUrl('');
      setIsUrlInput(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      setPdfFile(url);
      setFileName(url.split('/').pop() || 'PDF from URL');
    }
  };

  const handleReset = () => {
    setPdfFile(null);
    setUrl('');
    setFileName('');
    setIsUrlInput(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">PDF Viewer Demo</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {!pdfFile ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-6">
              {/* File Upload Section */}
              <div>
                <label 
                  htmlFor="file-upload" 
                  className="flex justify-center items-center px-6 py-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="space-y-2 text-center">
                    <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-indigo-600 hover:text-indigo-500">
                        Upload a PDF file
                      </span>
                      {' '}or drag and drop
                    </div>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* URL Input Section */}
              <div className="text-center">
                <span className="text-sm text-gray-500">OR</span>
              </div>

              <div>
                {isUrlInput ? (
                  <form onSubmit={handleUrlSubmit} className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter PDF URL"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Load PDF
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsUrlInput(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiLink className="mr-2" />
                    Load from URL
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* PDF Info Bar */}
            <div className="bg-white rounded-lg shadow px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900">
                  {fileName}
                </span>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="bg-white mx-auto flex justify-center w-full rounded-lg shadow overflow-hidden">
              <PDFViewer
                pdfFile={pdfFile}
                showToolbar={true}
                toolbarConfig={{
                  showPageNavigation: true,
                }}
                containerStyles={{
                  maxHeight: "80vh",
                  className: "container-style",
                }}
                onLoadSuccess={() => console.log('PDF loaded successfully')}
                onLoadError={(error: Error) => console.error('Failed to load PDF:', error)}
                onPageChange={(page: number) => console.log('Current page:', page)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 