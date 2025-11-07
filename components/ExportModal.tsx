import React, { useState } from 'react';
import { SkeletonElement, ExportFormat } from '../types';
import { generateCode } from '../lib/codeGenerator';
import CodeBlock from './CodeBlock';
import { EXPORT_FORMATS } from '../constants';

interface ExportModalProps {
  elements: SkeletonElement[];
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ elements, onClose }) => {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>(ExportFormat.REACT);

  const code = generateCode(activeFormat, elements);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="w-full max-w-3xl h-[80vh] bg-white dark:bg-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700/50 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Export Code</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-slate-900/50">
            <nav className="flex-shrink-0 md:w-40 p-2 md:p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700/50">
                <ul className="flex flex-row md:flex-col gap-1">
                    {EXPORT_FORMATS.map(format => (
                        <li key={format}>
                            <button 
                                onClick={() => setActiveFormat(format)}
                                className={`w-full text-left text-sm font-medium px-3 py-2 rounded-md transition-colors ${activeFormat === format ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}
                            >
                                {format}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <main className="flex-1 p-4 overflow-auto">
                <CodeBlock code={code} language={activeFormat.toLowerCase()} />
            </main>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
