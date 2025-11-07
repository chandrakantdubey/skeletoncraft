import React from 'react';
import { SkeletonElement } from '../types';

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);
const UnlockIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
    </svg>
);

interface LayersPanelProps {
  elements: SkeletonElement[];
  selectedElementIds: string[];
  onSelectElement: (id: string, metaKey?: boolean) => void;
  onUpdateElements: (ids: string[], updates: Partial<Omit<SkeletonElement, 'id'>>) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({ elements, selectedElementIds, onSelectElement, onUpdateElements }) => {
    const handleToggleLock = (e: React.MouseEvent, id: string, isLocked: boolean) => {
        e.stopPropagation();
        onUpdateElements([id], { locked: !isLocked });
    }

    return (
        <aside className="w-full md:w-60 bg-slate-50 dark:bg-slate-800/50 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700/50 p-4 flex-shrink-0 z-10 flex flex-col">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Layers</h2>
            <div className="flex-1 overflow-y-auto -mr-4 pr-4">
                {elements.length === 0 ? (
                    <div className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
                        <p>No layers yet. Drag an element onto the canvas to begin.</p>
                    </div>
                ) : (
                    <ul className="space-y-1">
                        {elements.slice().sort((a,b) => b.zIndex - a.zIndex).map(el => (
                            <li key={el.id} 
                                onClick={(e) => onSelectElement(el.id, e.metaKey || e.ctrlKey)}
                                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${selectedElementIds.includes(el.id) ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}
                            >
                                <span className="text-sm truncate text-slate-700 dark:text-slate-300 capitalize">
                                    {`${el.type} ${el.id.slice(-4)}`}
                                </span>
                                <button 
                                    onClick={(e) => handleToggleLock(e, el.id, el.locked)} 
                                    title={el.locked ? 'Unlock Element' : 'Lock Element'}
                                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
                                >
                                    {el.locked ? <LockIcon/> : <UnlockIcon />}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </aside>
    );
}

export default LayersPanel;
