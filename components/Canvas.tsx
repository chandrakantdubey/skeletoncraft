import React, { useRef, useState, useCallback, useEffect } from 'react';
import { SkeletonElement, ElementType, AnimationType } from '../types';
import { useTheme } from '../App';
import { DARK_TO_LIGHT_COLOR_MAP } from '../constants';

interface CanvasProps {
  elements: SkeletonElement[];
  selectedElementIds: string[];
  onSelectElements: (ids: string[], metaKey?: boolean) => void;
  onUpdateElements: (ids: string[], updates: Partial<Omit<SkeletonElement, 'id'>> | ((el: SkeletonElement) => Partial<Omit<SkeletonElement, 'id'>>)) => void;
  onAddElement: (element: Omit<SkeletonElement, 'id' | 'zIndex' | 'locked'>) => void;
  copyElements: () => void;
  pasteElements: () => void;
  duplicateElements: () => void;
  removeElements: (ids: string[]) => void;
  selectAllElements: () => void;
}

type DragState = 
    | { type: 'move'; startPositions: Map<string, {x: number, y: number}>; startMouse: {x: number, y: number} }
    | { type: 'resize'; id: string; handle: string; startRect: {x:number, y:number, width:number, height:number}; startMouse: {x: number, y: number}; aspectRatio: number; }
    | null;

const RESIZE_HANDLES = ['tl', 'tr', 'bl', 'br', 't', 'b', 'l', 'r'];

const Canvas: React.FC<CanvasProps> = ({ elements, selectedElementIds, onSelectElements, onUpdateElements, onAddElement, copyElements, pasteElements, duplicateElements, removeElements, selectAllElements }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>(null);
  const [marquee, setMarquee] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const dropTargetRef = useRef<HTMLDivElement | null>(null);

  const { theme } = useTheme();
  
  const getCanvasRelativeCoords = useCallback((e: MouseEvent | React.MouseEvent) => {
      const canvasBounds = canvasRef.current!.getBoundingClientRect();
      return {
          x: e.clientX - canvasBounds.left,
          y: e.clientY - canvasBounds.top,
      };
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/reactflow') as ElementType;
      if (!type || !canvasRef.current) return;

      const { x, y } = getCanvasRelativeCoords(e);
      let newElement: Omit<SkeletonElement, 'id' | 'zIndex' | 'locked'>;
      
      const baseProps = {
          x: Math.round(x - 50),
          y: Math.round(y - 25),
          animation: AnimationType.PULSE,
          color: 'bg-slate-700',
      };

      if (type === ElementType.RECT) {
          newElement = { ...baseProps, type: ElementType.RECT, width: 100, height: 50, borderRadius: 8 };
      } else if (type === ElementType.CIRCLE) {
          newElement = { ...baseProps, type: ElementType.CIRCLE, width: 60, height: 60, borderRadius: 30, x: Math.round(x-30), y: Math.round(y-30) };
      } else { // TEXT
          newElement = { ...baseProps, type: ElementType.TEXT, width: 120, height: 16, borderRadius: 4 };
      }
      onAddElement(newElement);
      if(dropTargetRef.current) dropTargetRef.current.classList.add('hidden');
  }, [getCanvasRelativeCoords, onAddElement]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if(dropTargetRef.current) dropTargetRef.current.classList.remove('hidden');
  };

  const handleDragLeave = () => {
      if(dropTargetRef.current) dropTargetRef.current.classList.add('hidden');
  }

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { x, y } = getCanvasRelativeCoords(e);
    const target = e.target as HTMLElement;
    const elementId = target.dataset.elementId;
    const resizeHandle = target.dataset.resizeHandle;

    if (resizeHandle && selectedElementIds.length === 1) {
        const element = elements.find(el => el.id === selectedElementIds[0])!;
        setDragState({
            type: 'resize',
            id: element.id,
            handle: resizeHandle,
            startRect: { x: element.x, y: element.y, width: element.width, height: element.height },
            startMouse: { x, y },
            aspectRatio: element.width / element.height,
        });
    } else if (elementId) {
        const isSelected = selectedElementIds.includes(elementId);
        
        if (!isSelected) {
            onSelectElements([elementId], e.metaKey || e.ctrlKey);
        }
        
        const currentSelected = (e.metaKey || e.ctrlKey) && isSelected ? [...selectedElementIds] : !isSelected && (e.metaKey || e.ctrlKey) ? [...selectedElementIds, elementId] : [elementId];

        const startPositions = new Map<string, {x: number, y: number}>();
        elements.forEach(el => {
            if (currentSelected.includes(el.id)) {
                startPositions.set(el.id, { x: el.x, y: el.y });
            }
        });

        setDragState({ type: 'move', startPositions, startMouse: { x, y } });
    } else { // Clicked on canvas
        onSelectElements([]);
        setMarquee({ x1: x, y1: y, x2: x, y2: y });
    }
}, [elements, getCanvasRelativeCoords, onSelectElements, selectedElementIds]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { x, y } = getCanvasRelativeCoords(e);
    
    if (dragState?.type === 'move') {
        const dx = x - dragState.startMouse.x;
        const dy = y - dragState.startMouse.y;
        
        onUpdateElements(Array.from(dragState.startPositions.keys()), (el: SkeletonElement) => {
            const startPos = dragState.startPositions.get(el.id);
            if (!startPos) return {};
            return {
                x: Math.round(startPos.x + dx),
                y: Math.round(startPos.y + dy),
            }
        });
    } else if (dragState?.type === 'resize') {
        let { x: newX, y: newY, width: newWidth, height: newHeight } = dragState.startRect;
        const dx = x - dragState.startMouse.x;
        const dy = y - dragState.startMouse.y;

        if (dragState.handle.includes('r')) newWidth = Math.max(10, dragState.startRect.width + dx);
        if (dragState.handle.includes('l')) {
            newWidth = Math.max(10, dragState.startRect.width - dx);
            newX = dragState.startRect.x + dx;
        }
        if (dragState.handle.includes('b')) newHeight = Math.max(10, dragState.startRect.height + dy);
        if (dragState.handle.includes('t')) {
            newHeight = Math.max(10, dragState.startRect.height - dy);
            newY = dragState.startRect.y + dy;
        }

        if (newWidth < 10) { newX = dragState.startRect.x + dragState.startRect.width - 10; }
        if (newHeight < 10) { newY = dragState.startRect.y + dragState.startRect.height - 10; }

        const element = elements.find(el => el.id === dragState.id);
        const updates: Partial<SkeletonElement> = { x: Math.round(newX), y: Math.round(newY), width: Math.round(newWidth), height: Math.round(newHeight) };
        if (element?.type === ElementType.CIRCLE) {
            updates.borderRadius = Math.round(Math.max(newWidth, newHeight) / 2);
        }
        onUpdateElements([dragState.id], updates);
    } else if (marquee) {
        setMarquee({ ...marquee, x2: x, y2: y });
    }
  }, [dragState, marquee, getCanvasRelativeCoords, onUpdateElements, elements]);

  const handleMouseUp = useCallback(() => {
    if (marquee) {
        const x1 = Math.min(marquee.x1, marquee.x2);
        const y1 = Math.min(marquee.y1, marquee.y2);
        const x2 = Math.max(marquee.x1, marquee.x2);
        const y2 = Math.max(marquee.y1, marquee.y2);

        if (x2 - x1 > 5 && y2 - y1 > 5) {
          const selected = elements
            .filter(el => {
              const elX2 = el.x + el.width;
              const elY2 = el.y + el.height;
              return x1 < elX2 && x2 > el.x && y1 < elY2 && y2 > el.y;
            })
            .map(el => el.id);
          onSelectElements(selected);
        }
    }
    setDragState(null);
    setMarquee(null);
  }, [marquee, elements, onSelectElements]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (dragState || marquee) {
        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
}, [dragState, marquee, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') return;

        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

        if (ctrlKey && e.key === 'c') {
            copyElements();
        } else if (ctrlKey && e.key === 'v') {
            pasteElements();
        } else if (ctrlKey && e.key === 'd') {
            e.preventDefault();
            duplicateElements();
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            if (selectedElementIds.length > 0) {
              removeElements(selectedElementIds);
            }
        } else if (ctrlKey && e.key === 'a') {
            e.preventDefault();
            selectAllElements();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementIds, copyElements, pasteElements, duplicateElements, removeElements, selectAllElements]);

  const getElementColorClass = (darkColor: string) => {
      return theme === 'light' ? (DARK_TO_LIGHT_COLOR_MAP[darkColor] || 'bg-slate-200') : darkColor;
  };
  
  const selectedElements = elements.filter(el => selectedElementIds.includes(el.id));
  const BoundingBox = selectedElements.length > 0 ? selectedElements.reduce((acc, el) => {
      return {
          x: Math.min(acc.x, el.x),
          y: Math.min(acc.y, el.y),
          x2: Math.max(acc.x2, el.x + el.width),
          y2: Math.max(acc.y2, el.y + el.height),
      }
  }, {x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity}) : null;

  return (
    <div
      ref={canvasRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onMouseDown={handleMouseDown}
      className="relative flex-1 w-full h-full bg-slate-100 dark:bg-slate-900/70 overflow-hidden cursor-crosshair touch-none"
    >
      <div 
        ref={dropTargetRef} 
        className="absolute inset-0 bg-indigo-500/10 border-2 border-dashed border-indigo-400 rounded-2xl m-4 pointer-events-none hidden z-10"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 font-medium">Drop to add element</div>
      </div>
      
      {/* Canvas Elements */}
      <div className="absolute top-0 left-0">
        {elements.sort((a,b) => a.zIndex - b.zIndex).map(el => {
            const animationClass = el.animation === AnimationType.PULSE ? 'animate-pulse' : el.animation === AnimationType.WAVE ? 'wave-animation' : '';
            const isSelected = selectedElementIds.includes(el.id);
            return (
              <div
                  key={el.id}
                  data-element-id={el.id}
                  className={`absolute group cursor-move ${animationClass} ${isSelected ? 'z-30' : ''}`}
                  style={{ left: el.x, top: el.y, width: el.width, height: el.height, zIndex: el.zIndex }}
              >
                  <div
                      data-element-id={el.id}
                      className={`w-full h-full ${getElementColorClass(el.color)}`}
                      style={{ borderRadius: el.type === ElementType.CIRCLE ? '50%' : `${el.borderRadius}px` }}
                  />
                  {el.animation === AnimationType.WAVE && (
                      <div className="absolute inset-0 wave-overlay" style={{ borderRadius: el.type === ElementType.CIRCLE ? '50%' : `${el.borderRadius}px` }}></div>
                  )}
              </div>
            );
        })}
      </div>

      {/* Selection Box and Resize Handles */}
      {selectedElementIds.length > 0 && BoundingBox && (
          <div
              className={`absolute pointer-events-none ring-2 ring-indigo-500 z-40 ${selectedElementIds.length > 1 ? 'ring-dashed' : ''}`}
              style={{ left: BoundingBox.x - 2, top: BoundingBox.y - 2, width: BoundingBox.x2 - BoundingBox.x + 4, height: BoundingBox.y2 - BoundingBox.y + 4 }}
          >
              {selectedElementIds.length === 1 && RESIZE_HANDLES.map(handle => {
                  const el = elements.find(e => e.id === selectedElementIds[0])!;
                  let cursor = 'nesw-resize';
                  if (handle === 't' || handle === 'b') cursor = 'ns-resize';
                  if (handle === 'l' || handle === 'r') cursor = 'ew-resize';
                  if (handle === 'tr' || handle === 'bl') cursor = 'nwse-resize';
                  
                  return (
                      <div
                          key={handle}
                          data-resize-handle={handle}
                          className="absolute w-2.5 h-2.5 bg-white border border-indigo-500 rounded-full pointer-events-auto"
                          style={{
                              cursor,
                              top: handle.includes('t') ? -5 : handle.includes('b') ? 'auto' : '50%',
                              bottom: handle.includes('b') ? -5 : 'auto',
                              left: handle.includes('l') ? -5 : handle.includes('r') ? 'auto' : '50%',
                              right: handle.includes('r') ? -5 : 'auto',
                              transform: (handle === 't' || handle === 'b' || handle === 'l' || handle === 'r') ? 'translate(-50%, -50%)' : undefined,
                              marginTop: (handle === 't' || handle === 'b') ? 0 : -5,
                              marginLeft: (handle === 'l' || handle === 'r') ? 0 : -5,
                          }}
                      />
                  );
              })}
          </div>
      )}
      
      {/* Marquee Selection */}
      {marquee && (
          <div
              className="absolute bg-indigo-500/20 border border-indigo-500 z-50"
              style={{
                  left: Math.min(marquee.x1, marquee.x2),
                  top: Math.min(marquee.y1, marquee.y2),
                  width: Math.abs(marquee.x1 - marquee.x2),
                  height: Math.abs(marquee.y1 - marquee.y2),
              }}
          />
      )}
    </div>
  );
};

export default Canvas;
