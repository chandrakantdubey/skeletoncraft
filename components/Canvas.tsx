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
      if (!canvasRef.current) return { x: 0, y: 0 };
      const canvasBounds = canvasRef.current.getBoundingClientRect();
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
          color: theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200',
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
  }, [getCanvasRelativeCoords, onAddElement, theme]);

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
        if (element.locked) return;
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
        
        const currentSelected = (e.metaKey || e.ctrlKey) && isSelected ? selectedElementIds.filter(id => id !== elementId) : !isSelected && (e.metaKey || e.ctrlKey) ? [...selectedElementIds, elementId] : [elementId];

        const startPositions = new Map<string, {x: number, y: number}>();
        elements.forEach(el => {
            if (currentSelected.includes(el.id) && !el.locked) {
                startPositions.set(el.id, { x: el.x, y: el.y });
            }
        });

        if (startPositions.size > 0) {
            setDragState({ type: 'move', startPositions, startMouse: { x, y } });
        }
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

        if (newWidth < 10) {
            newX = dragState.startRect.x + dragState.startRect.width - 10;
            newWidth = 10;
        }
        if (newHeight < 10) {
            newY = dragState.startRect.y + dragState.startRect.height - 10;
            newHeight = 10;
        }

        onUpdateElements([dragState.id], {
            x: Math.round(newX),
            y: Math.round(newY),
            width: Math.round(newWidth),
            height: Math.round(newHeight),
        });
    } else if (marquee) {
        setMarquee({ ...marquee, x2: x, y2: y });
    }
  }, [dragState, getCanvasRelativeCoords, onUpdateElements, marquee]);

  const handleMouseUp = useCallback(() => {
    if (marquee) {
        const x1 = Math.min(marquee.x1, marquee.x2);
        const y1 = Math.min(marquee.y1, marquee.y2);
        const x2 = Math.max(marquee.x1, marquee.x2);
        const y2 = Math.max(marquee.y1, marquee.y2);

        const selectedIds = elements.filter(el => 
            !el.locked &&
            el.x < x2 && el.x + el.width > x1 &&
            el.y < y2 && el.y + el.height > y1
        ).map(el => el.id);
        onSelectElements(selectedIds);
    }
    setDragState(null);
    setMarquee(null);
  }, [marquee, elements, onSelectElements]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        const isEditingInput = (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'SELECT';
        if (isEditingInput) return;

        if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
            copyElements();
        } else if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
            pasteElements();
        } else if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
            e.preventDefault();
            duplicateElements();
        } else if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
            e.preventDefault();
            selectAllElements();
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            if (selectedElementIds.length > 0) {
                removeElements(selectedElementIds);
            }
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [copyElements, pasteElements, duplicateElements, selectAllElements, removeElements, selectedElementIds]);

  const getElementColorClass = (color: string) => {
    if (theme === 'light') {
      return DARK_TO_LIGHT_COLOR_MAP[color] || 'bg-slate-200';
    }
    return color;
  };

  const getAnimationClass = (animation: AnimationType) => {
      if (animation === AnimationType.PULSE) return 'animate-pulse';
      if (animation === AnimationType.WAVE) return 'relative overflow-hidden';
      return '';
  }

  const marqueeStyle = marquee ? {
      left: Math.min(marquee.x1, marquee.x2),
      top: Math.min(marquee.y1, marquee.y2),
      width: Math.abs(marquee.x1 - marquee.x2),
      height: Math.abs(marquee.y1 - marquee.y2),
  } : {};

  return (
    <div 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="w-full h-full bg-slate-100 dark:bg-slate-900 overflow-hidden relative select-none cursor-auto flex-1"
        style={{
            backgroundSize: '20px 20px',
            backgroundImage: 'radial-gradient(circle, #E2E8F0 1px, rgba(0, 0, 0, 0) 1px)',
        }}
    >
        <div className="dark:hidden absolute inset-0" style={{
            backgroundSize: '20px 20px',
            backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, rgba(0, 0, 0, 0) 1px)',
        }}></div>
         <div className="hidden dark:block absolute inset-0" style={{
            backgroundSize: '20px 20px',
            backgroundImage: 'radial-gradient(circle, #334155 1px, rgba(0, 0, 0, 0) 1px)',
        }}></div>

      <div className="w-[600px] h-[400px] bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {elements.map((el) => (
          <div
            key={el.id}
            data-element-id={el.id}
            className={`absolute ${getElementColorClass(el.color)} ${getAnimationClass(el.animation)} ${selectedElementIds.includes(el.id) ? '' : 'hover:ring-2 hover:ring-indigo-400/50'} ${el.locked ? 'cursor-not-allowed' : 'cursor-move'}`}
            style={{
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              borderRadius: el.type === ElementType.CIRCLE ? '50%' : el.borderRadius,
              zIndex: el.zIndex,
              boxShadow: el.locked ? 'inset 0 0 0 1px rgba(239, 68, 68, 0.6)' : 'none'
            }}
          >
            {el.animation === AnimationType.WAVE && (
                <div className="absolute top-0 left-[-150%] h-full w-[150%] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-[wave_1.5s_infinite]"></div>
            )}
          </div>
        ))}

        {selectedElementIds.length === 1 && !elements.find(el => el.id === selectedElementIds[0])?.locked && (
          <div
            className="absolute border-2 border-indigo-500 pointer-events-none"
            style={{
              left: elements.find(el => el.id === selectedElementIds[0])!.x - 2,
              top: elements.find(el => el.id === selectedElementIds[0])!.y - 2,
              width: elements.find(el => el.id === selectedElementIds[0])!.width + 4,
              height: elements.find(el => el.id === selectedElementIds[0])!.height + 4,
              zIndex: 10000,
            }}
          >
            {RESIZE_HANDLES.map(handle => (
              <div
                key={handle}
                data-resize-handle={handle}
                className="absolute w-3 h-3 bg-white border border-indigo-500 rounded-full"
                style={{
                  top: handle.includes('t') ? -7 : handle.includes('b') ? 'auto' : '50%',
                  bottom: handle.includes('b') ? -7 : 'auto',
                  left: handle.includes('l') ? -7 : handle.includes('r') ? 'auto' : '50%',
                  right: handle.includes('r') ? -7 : 'auto',
                  transform: (handle.length === 1) ? (handle === 't' || handle === 'b' ? 'translate(-50%, 0)' : 'translate(0, -50%)') : 'none',
                  marginTop: (handle.length === 1 && (handle === 't' || handle === 'b')) ? 0 : -7,
                  marginLeft: (handle.length === 1 && (handle === 'l' || handle === 'r')) ? 0 : -7,
                  cursor: handle.includes('t') ? (handle.includes('l') ? 'nwse-resize' : 'nesw-resize') : handle.includes('b') ? (handle.includes('l') ? 'nesw-resize' : 'nwse-resize') : handle.includes('r') || handle.includes('l') ? 'ew-resize' : 'ns-resize',
                  pointerEvents: 'all',
                }}
              />
            ))}
          </div>
        )}
        {selectedElementIds.length > 1 && (
            <div
                className="absolute border-2 border-dashed border-indigo-500 pointer-events-none"
                style={{
                    left: Math.min(...elements.filter(e => selectedElementIds.includes(e.id)).map(e => e.x)) - 2,
                    top: Math.min(...elements.filter(e => selectedElementIds.includes(e.id)).map(e => e.y)) - 2,
                    width: Math.max(...elements.filter(e => selectedElementIds.includes(e.id)).map(e => e.x + e.width)) - Math.min(...elements.filter(e => selectedElementIds.includes(e.id)).map(e => e.x)) + 4,
                    height: Math.max(...elements.filter(e => selectedElementIds.includes(e.id)).map(e => e.y + e.height)) - Math.min(...elements.filter(e => selectedElementIds.includes(e.id)).map(e => e.y)) + 4,
                    zIndex: 9999,
                }}
            />
        )}
      </div>

       {marquee && (
            <div 
                className="absolute bg-indigo-500/20 border border-indigo-500 pointer-events-none"
                style={marqueeStyle}
            />
        )}

      <div ref={dropTargetRef} className="hidden absolute inset-0 bg-indigo-500/10 border-2 border-dashed border-indigo-500 rounded-lg m-4 pointer-events-none z-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 font-semibold">Drop to add element</div>
      </div>
    </div>
  );
};

export default Canvas;
