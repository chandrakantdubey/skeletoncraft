import React, { useState } from 'react';
import { LoaderSpinnerPreset } from '../types';
import CodeBlock from './CodeBlock';

interface CodeDisplayModalProps {
  preset: LoaderSpinnerPreset;
  onClose: () => void;
}

const CodeDisplayModal: React.FC<CodeDisplayModalProps> = ({ preset, onClose }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');

  const cssWithTheme = `/* CSS Variables for theming */
:root {
  --color-primary: #4f46e5; /* indigo-600 */
  --color-secondary: #e5e7eb; /* gray-200 */
  --color-accent: #a5b4fc; /* indigo-300 */
}

.dark {
  --color-primary: #818cf8; /* indigo-400 */
  --color-secondary: #4b5563; /* gray-600 */
  --color-accent: #6366f1; /* indigo-500 */
}

${preset.css}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="w-full max-w-2xl h-[70vh] bg-white dark:bg-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700/50 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{preset.name} - Code</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/50">
            <div className="p-2 border-b border-slate-200 dark:border-slate-700/50">
                <nav className="flex space-x-2">
                     <button 
                        onClick={() => setActiveTab('html')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'html' ? 'bg-white dark:bg-slate-700/50 text-indigo-600 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/30'}`}
                    >
                        HTML
                    </button>
                    <button 
                        onClick={() => setActiveTab('css')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'css' ? 'bg-white dark:bg-slate-700/50 text-indigo-600 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/30'}`}
                    >
                        CSS
                    </button>
                </nav>
            </div>
            <main className="flex-1 p-4 overflow-auto">
                {activeTab === 'html' && <CodeBlock code={preset.html} language="html" />}
                {activeTab === 'css' && <CodeBlock code={cssWithTheme} language="css" />}
            </main>
        </div>
      </div>
    </div>
  );
};

export default CodeDisplayModal;
