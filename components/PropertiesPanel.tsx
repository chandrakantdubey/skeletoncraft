import React from 'react';
import { SkeletonElement, AnimationType, ElementType } from '../types';
import { ANIMATION_OPTIONS, DARK_COLORS, LIGHT_COLORS } from '../constants';
import { useTheme } from '../App';

interface PropertiesPanelProps {
  selectedElements: SkeletonElement[];
  onUpdateElements: (ids: string[], updates: Partial<Omit<SkeletonElement, 'id'>> | ((el: SkeletonElement) => Partial<Omit<SkeletonElement, 'id'>>)) => void;
  onRemoveElements: (ids: string[]) => void;
  onAlign: (alignment: 'left' | 'center-h' | 'right' | 'top' | 'center-v' | 'bottom') => void;
  onDistribute: (distribution: 'horizontal' | 'vertical') => void;
  onArrange: (arrangement: 'forward' | 'backward' | 'front' | 'back') => void;
}

const IconButton: React.FC<{ onClick: () => void, title: string, children: React.ReactNode}> = ({ onClick, title, children }) => (
    <button onClick={onClick} title={title} className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors">
        {children}
    </button>
);


const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedElements, onUpdateElements, onRemoveElements, onAlign, onDistribute, onArrange }) => {
  const { theme } = useTheme();
  const selectedElement = selectedElements.length === 1 ? selectedElements[0] : null;

  if (selectedElements.length === 0) {
    return (
      <aside className="w-full md:w-72 bg-slate-50 dark:bg-slate-800/50 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700/50 p-4 flex-shrink-0 flex flex-col items-center justify-center text-center">
        <div className="text-slate-400 dark:text-slate-500">
            <svg xmlns="http://www.w.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
            </svg>
            <p className="text-sm font-medium">No element selected</p>
            <p className="text-xs mt-1">Click an element on the canvas to see its properties, or drag to select multiple.</p>
        </div>
      </aside>
    );
  }

  const handleUpdate = (prop: keyof SkeletonElement, value: any) => {
    onUpdateElements(selectedElements.map(e => e.id), { [prop]: value });
  };
  
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  const commonColor = selectedElements.every(el => el.color === selectedElements[0].color) ? selectedElements[0].color : null;
  const commonAnimation = selectedElements.every(el => el.animation === selectedElements[0].animation) ? selectedElements[0].animation : 'mixed';

  return (
    <aside className="w-full md:w-72 bg-slate-50 dark:bg-slate-800/50 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700/50 p-4 flex-shrink-0 overflow-y-auto">
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">{selectedElement ? 'Properties' : `${selectedElements.length} Elements Selected`}</h2>
      
      {selectedElements.length > 1 && (
        <div className="space-y-3 mb-4 p-3 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg">
            <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Align</label>
                <div className="grid grid-cols-3 gap-1">
                    <IconButton onClick={() => onAlign('left')} title="Align Left"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 21V3M20 17H8V7H20V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconButton>
                    <IconButton onClick={() => onAlign('center-h')} title="Align Center Horizontal"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21V3M20 17H4V7H20V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconButton>
                    <IconButton onClick={() => onAlign('right')} title="Align Right"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21V3M4 17H16V7H4V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconButton>
                    <IconButton onClick={() => onAlign('top')} title="Align Top"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 4H21M7 20V8H17V20H7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconButton>
                    <IconButton onClick={() => onAlign('center-v')} title="Align Center Vertical"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12H21M7 20V4H17V20H7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconButton>
                    <IconButton onClick={() => onAlign('bottom')} title="Align Bottom"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 20H21M7 4V16H17V4H7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconButton>
                </div>
            </div>
             <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Distribute</label>
                <div className="grid grid-cols-3 gap-1">
                     <IconButton onClick={() => onDistribute('horizontal')} title="Distribute Horizontal"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 17V7M20 17V7M12 17V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconButton>
                    <IconButton onClick={() => onDistribute('vertical')} title="Distribute Vertical"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 4H7M17 20H7M17 12H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconButton>
                </div>
            </div>
        </div>
      )}

      <div className="space-y-4">
        {selectedElement && (
            <>
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
            </>
        )}
        
        <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Layer</label>
             <div className="grid grid-cols-4 gap-1">
                <IconButton onClick={() => onArrange('backward')} title="Send Backward"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 13H4V3H14V9M10 21V11H20V21H10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconButton>
                <IconButton onClick={() => onArrange('forward')} title="Bring Forward"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 15V3H20V13H14M4 21V9H14V21H4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconButton>
                <IconButton onClick={() => onArrange('back')} title="Send to Back"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 9H4V3H14V9ZM10 15V9H20V21H4V15H10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconButton>
                <IconButton onClick={() => onArrange('front')} title="Bring to Front"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 15H10V9H20V3H4V15ZM4 21V15H14V21H4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconButton>
            </div>
        </div>

        <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Color</label>
            <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                    <button 
                        key={color}
                        onClick={() => handleUpdate('color', color)}
                        className={`w-6 h-6 rounded-full ${color} ${commonColor === color ? 'ring-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-800 ring-indigo-500 dark:ring-indigo-400' : ''}`}
                    />
                ))}
            </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Animation</label>
          <select value={commonAnimation} onChange={e => handleUpdate('animation', e.target.value as AnimationType)} className="w-full bg-slate-200 dark:bg-slate-700 rounded-md p-2 text-sm appearance-none">
            {commonAnimation === 'mixed' && <option value="mixed" disabled>Mixed</option>}
            {ANIMATION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
            <button 
                onClick={() => onRemoveElements(selectedElements.map(e => e.id))}
                className="w-full text-sm font-semibold text-red-500 dark:text-red-400 hover:bg-red-500/10 py-2 rounded-md transition-colors"
            >
                {`Delete ${selectedElements.length} Element${selectedElements.length > 1 ? 's' : ''}`}
            </button>
        </div>
      </div>
    </aside>
  );
};

export default PropertiesPanel;
