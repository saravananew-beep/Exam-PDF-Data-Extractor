
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import { ExamRecord, ProcessingStatus } from './types';
import { convertPdfToImages } from './utils/pdfProcessor';
import { extractTableData } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [data, setData] = useState<ExamRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setError(null);
      setStatus('rendering');
      
      // 1. Convert PDF pages to high-quality images for OCR
      const images = await convertPdfToImages(file);
      
      setStatus('extracting');
      
      // 2. Use Gemini to extract structured table data
      const extractedRecords = await extractTableData(images);
      
      setData(extractedRecords);
      setStatus('completed');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during processing.');
      setStatus('error');
    }
  }, []);

  const reset = () => {
    setData([]);
    setStatus('idle');
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-8">
          {/* Hero / Introduction */}
          {status === 'idle' && (
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Turn your PDF exam schedules into <span className="text-indigo-600">Clean Tables</span>
              </h2>
              <p className="text-lg text-slate-500">
                Instantly extract Serial Numbers, Exam Dates, Batches, Subject Codes, Names, Register Numbers, and Student Names using AI.
              </p>
            </div>
          )}

          {/* Upload or Loading State */}
          {(status === 'idle' || status === 'rendering' || status === 'extracting') && (
            <div className="relative">
              {status !== 'idle' && (
                <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl border border-slate-200">
                  <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-lg font-bold text-slate-800">
                    {status === 'rendering' ? 'Reading PDF Pages...' : 'AI Extracting Table Data...'}
                  </p>
                  <p className="text-slate-500 text-sm mt-1">This may take a moment depending on the file size.</p>
                </div>
              )}
              <FileUpload 
                onFileSelect={handleFileSelect} 
                isLoading={status !== 'idle' && status !== 'error'} 
              />
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-red-800">Extraction Failed</h3>
              <p className="text-red-600 mt-1 mb-4">{error}</p>
              <button
                onClick={reset}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Another File
              </button>
            </div>
          )}

          {/* Results Display */}
          {(status === 'completed' || (status === 'idle' && data.length > 0)) && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-2 mb-6 text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-lg w-fit">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Data Extracted Successfully!
              </div>
              <DataTable data={data} onReset={reset} />
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} ExamData. Built with React and Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
