import React from 'react';
import { SkeletonElement, AnimationType, ElementType } from '../types';
import { ANIMATION_OPTIONS, DARK_COLORS } from '../constants';

interface PropertiesPanelProps {
  selectedElement: SkeletonElement | null;
  onUpdateElement: (id: string, updates: Partial<SkeletonElement>) => void;
  onRemoveElement: (id: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedElement, onUpdateElement, onRemoveElement }) => {
  if (!selectedElement) {
    return (
      <aside className="w-full md:w-72 bg-slate-50 dark:bg-slate-800/50 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700/50 p-4 flex-shrink-0 flex flex-col items-center justify-center text-center">
        <div className="text-slate-400 dark:text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
            </svg>
            <p className="text-sm font-medium">No element selected</p>
            <p className="text-xs mt-1">Click an element on the canvas to see its properties.</p>
        </div>
      </aside>
    );
  }

  const handleUpdate = (prop: keyof SkeletonElement, value: any) => {
    if (prop === 'borderRadius' && selectedElement.type === ElementType.CIRCLE) {
        return;
    }
    onUpdateElement(selectedElement.id, { [prop]: value });
  };

  return (
    <aside className="w-full md:w-72 bg-slate-50 dark:bg-slate-800/50 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700/50 p-4 flex-shrink-0 overflow-y-auto">
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Properties</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Position (X, Y)</label>
          <div className="flex gap-2">
            <input type="number" value={selectedElement.x} onChange={e => handleUpdate('x', parseInt(e.target.value))} className="w-full bg-slate-200 dark:bg-slate-700 rounded-md p-1 text-sm text-center" />
            <input type="number" value={selectedElement.y} onChange={e => handleUpdate('y', parseInt(e.target.value))} className="w-full bg-slate-200 dark:bg-slate-700 rounded-md p-1 text-sm text-center" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Size (Width, Height)</label>
          <div className="flex gap-2">
            <input type="number" value={selectedElement.width} onChange={e => handleUpdate('width', parseInt(e.target.value))} className="w-full bg-slate-200 dark:bg-slate-700 rounded-md p-1 text-sm text-center" />
            <input type="number" value={selectedElement.height} onChange={e => handleUpdate('height', parseInt(e.target.value))} className="w-full bg-slate-200 dark:bg-slate-700 rounded-md p-1 text-sm text-center" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Border Radius</label>
          <input type="range" min="0" max="50" disabled={selectedElement.type === ElementType.CIRCLE} value={selectedElement.borderRadius} onChange={e => handleUpdate('borderRadius', parseInt(e.target.value))} className="w-full disabled:opacity-50" />
        </div>
        <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Color</label>
            <div className="flex flex-wrap gap-2">
                {DARK_COLORS.map(color => (
                    <button 
                        key={color}
                        onClick={() => handleUpdate('color', color)}
                        className={`w-6 h-6 rounded-full ${color} ${selectedElement.color === color ? 'ring-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-800 ring-indigo-500 dark:ring-indigo-400' : ''}`}
                    />
                ))}
            </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Animation</label>
          <select value={selectedElement.animation} onChange={e => handleUpdate('animation', e.target.value as AnimationType)} className="w-full bg-slate-200 dark:bg-slate-700 rounded-md p-2 text-sm appearance-none">
            {ANIMATION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
            <button 
                onClick={() => onRemoveElement(selectedElement.id)}
                className="w-full text-sm font-semibold text-red-500 dark:text-red-400 hover:bg-red-500/10 py-2 rounded-md transition-colors"
            >
                Delete Element
            </button>
        </div>
      </div>
    </aside>
  );
};

export default PropertiesPanel;
