import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
    onExport?: () => void;
    onBack?: () => void;
    isEditorView?: boolean;
    onUndo?: () => void;
    onRedo?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
    onClear?: () => void;
}

const HeaderButton: React.FC<{ onClick?: () => void; disabled?: boolean; children: React.ReactNode; title: string;}> = ({ onClick, disabled, children, title }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-indigo-500"
    >
        {children}
    </button>
);


const Header: React.FC<HeaderProps> = ({ onExport, onBack, isEditorView = false, onUndo, onRedo, canUndo, canRedo, onClear }) => {
  return (
    <header className="flex-shrink-0 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between p-3 z-20">
      <div className="flex items-center gap-3">
        {isEditorView ? (
            <button 
                onClick={onBack}
                title="Back to Home"
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-indigo-500"
            >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
              Home
            </button>
        ) : (
            <>
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-white dark:bg-slate-900 rounded-sm animate-pulse"></div>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200">Skeleton Craft</h1>
            </>
        )}
      </div>

      {isEditorView && (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <HeaderButton onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8a5 5 0 010 10H9" /></svg>
            </HeaderButton>
            <HeaderButton onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 15l3-3m0 0l-3-3m3 3H8a5 5 0 000 10h1" /></svg>
            </HeaderButton>
            <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
            <HeaderButton onClick={onClear} title="Clear Canvas">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </HeaderButton>
        </div>
      )}

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        {isEditorView && (
             <button 
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-indigo-500"
            >
                Export
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            </button>
        )}
      </div>
    </header>
  );
};

export default Header;