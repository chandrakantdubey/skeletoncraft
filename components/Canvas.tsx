import React, { useRef, useState, useCallback } from 'react';
import { SkeletonElement, ElementType, AnimationType } from '../types';
import { useTheme } from '../App';
import { DARK_TO_LIGHT_COLOR_MAP } from '../constants';

interface CanvasProps {
  elements: SkeletonElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<SkeletonElement>) => void;
  onAddElement: (element: Omit<SkeletonElement, 'id'>) => void;
}

const Canvas: React.FC<CanvasProps> = ({ elements, selectedElementId, onSelectElement, onUpdateElement, onAddElement }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const { theme } = useTheme();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/reactflow') as ElementType;
      if (!type || !canvasRef.current) return;

      const canvasBounds = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - canvasBounds.left;
      const y = e.clientY - canvasBounds.top;

      const newElement: Omit<SkeletonElement, 'id'> = {
          type,
          x: Math.round((x - 50) / 20) * 20,
          y: Math.round((y - 25) / 20) * 20,
          width: type === ElementType.TEXT ? 150 : 100,
          height: type === ElementType.TEXT ? 16 : 100,
          borderRadius: type === ElementType.CIRCLE ? 50 : type === ElementType.TEXT ? 9999 : 8,
          animation: AnimationType.PULSE,
          color: 'bg-slate-700', // Always use dark color as the base
      };
      
      onAddElement(newElement);

  }, [onAddElement]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleElementMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    e.stopPropagation();
    onSelectElement(id);
    const element = elements.find(el => el.id === id);
    if (element && canvasRef.current) {
      const canvasBounds = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - canvasBounds.left;
      const mouseY = e.clientY - canvasBounds.top;
      setDragState({ id, offsetX: mouseX - element.x, offsetY: mouseY - element.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragState || !canvasRef.current) return;
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    let newX = e.clientX - canvasBounds.left - dragState.offsetX;
    let newY = e.clientY - canvasBounds.top - dragState.offsetY;

    // Snap to grid (20px)
    newX = Math.round(newX / 20) * 20;
    newY = Math.round(newY / 20) * 20;

    onUpdateElement(dragState.id, { x: newX, y: newY });
  };
  
  const handleMouseUp = () => {
    setDragState(null);
  };
  
  const getAnimationClass = (animation: AnimationType) => {
    switch (animation) {
      case AnimationType.PULSE: return 'animate-pulse';
      case AnimationType.WAVE: return 'wave-animation';
      default: return '';
    }
  }

  const getColorClass = (darkColor: string) => {
      if (theme === 'light') {
          return DARK_TO_LIGHT_COLOR_MAP[darkColor] || 'bg-slate-200';
      }
      return darkColor;
  }

  return (
    <div
      ref={canvasRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={() => onSelectElement(null)}
      className="w-full max-w-[600px] h-[400px] bg-white dark:bg-slate-800/50 shadow-lg rounded-xl relative overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700/50"
      style={{ width: 600, height: 400 }} // Fixed size for skeleton context
    >
      {elements.map((el) => (
        <div
          key={el.id}
          onMouseDown={(e) => handleElementMouseDown(e, el.id)}
          className={`absolute cursor-move ${getColorClass(el.color)} ${getAnimationClass(el.animation)} ${selectedElementId === el.id ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''}`}
          style={{
            left: `${el.x}px`,
            top: `${el.y}px`,
            width: `${el.width}px`,
            height: `${el.height}px`,
            borderRadius: el.type === ElementType.CIRCLE ? '50%' : `${el.borderRadius}px`,
          }}
        />
      ))}
      {!elements.length && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="font-semibold">Drop Zone</p>
              <p className="text-sm">Drag elements from the left panel here</p>
          </div>
      )}
      <style>{`
          .wave-animation {
              position: relative;
              overflow: hidden;
          }
          .wave-animation::after {
              content: '';
              position: absolute;
              top: 0;
              left: -150%;
              width: 150%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
          }
          html.dark .wave-animation::after {
              background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          }
          .wave-animation::after {
              animation: wave 1.5s infinite;
          }
          @keyframes wave {
              0% { left: -150%; }
              100% { left: 150%; }
          }
      `}</style>
    </div>
  );
};

export default Canvas;
