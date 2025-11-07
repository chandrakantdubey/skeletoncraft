import React from 'react';
import { ElementType, SkeletonElement, AnimationType } from '../types';
import { TOOLBOX_ITEMS } from '../constants';

interface SidebarProps {
  onAddElement: (element: Omit<SkeletonElement, 'id'>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddElement }) => {

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: ElementType) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-full md:w-60 bg-slate-50 dark:bg-slate-800/50 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700/50 p-4 flex-shrink-0 z-10">
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Elements</h2>
      <div className="space-y-2">
        {TOOLBOX_ITEMS.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => handleDragStart(e, item.type)}
            className="flex items-center gap-3 p-3 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg cursor-grab hover:bg-slate-300/50 dark:hover:bg-slate-700 transition-colors active:cursor-grabbing"
          >
            {item.icon}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 text-xs text-slate-400 dark:text-slate-500 text-center">
        <p>Drag elements onto the canvas to start building your skeleton loader.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
