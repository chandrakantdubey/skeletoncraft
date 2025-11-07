import React from 'react';
import { CodeIcon } from '../constants';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
    onExport?: () => void;
    onBack?: () => void;
    isEditorView?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onExport, onBack, isEditorView = false }) => {
  return (
    <header className="flex-shrink-0 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between p-4 z-20">
      <div className="flex items-center gap-3">
        {isEditorView && (
            <button 
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-indigo-500"
            >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
              Home
            </button>
        )}
        {!isEditorView && (
            <>
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-white dark:bg-slate-900 rounded-sm animate-pulse"></div>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200">Skeleton Craft</h1>
            </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        {isEditorView && (
             <button 
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-indigo-500"
            >
                <CodeIcon />
                Export
            </button>
        )}
      </div>
    </header>
  );
};

export default Header;
