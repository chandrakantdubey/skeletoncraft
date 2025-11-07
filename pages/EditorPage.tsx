import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { SkeletonElement, ElementType, AnimationType, SkeletonPreset } from '../types';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Canvas from '../components/Canvas';
import PropertiesPanel from '../components/PropertiesPanel';
import ExportModal from '../components/ExportModal';
import LayersPanel from '../components/LayersPanel';
import AIToolbar from '../components/AIToolbar';
import { useHistoryState } from '../hooks/useHistoryState';
import { DARK_TO_LIGHT_COLOR_MAP } from '../constants';

const LOCAL_STORAGE_KEY = 'skeleton-craft-elements';

interface EditorPageProps {
  initialElements: SkeletonElement[];
  onBack: () => void;
}

const EditorPage: React.FC<EditorPageProps> = ({ initialElements, onBack }) => {
  const { state: elements, setState: setElements, undo, redo, resetState, canUndo, canRedo } = useHistoryState<SkeletonElement[]>([]);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<SkeletonElement[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const isPresetLoad = useRef(initialElements.length > 0);

  useEffect(() => {
    let loadedElements = initialElements;
    if (initialElements.length === 0) { // "Create from scratch"
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          loadedElements = JSON.parse(saved);
        }
      } catch (error) {
        console.error("Failed to load from local storage", error);
        loadedElements = [];
      }
    }
    resetState(loadedElements);
    setSelectedElementIds([]);
  }, [initialElements, resetState]);

  useEffect(() => {
    if (!isPresetLoad.current) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(elements));
        } catch (error) {
            console.error("Failed to save to local storage", error);
        }
    }
  }, [elements]);
  
  const handleAddElement = useCallback((newElement: Omit<SkeletonElement, 'id' | 'zIndex' | 'locked'>) => {
    setElements(prev => {
        const maxZIndex = prev.reduce((max, el) => Math.max(max, el.zIndex), 0);
        return [...prev, { 
            ...newElement, 
            id: `el_${Date.now()}`, 
            zIndex: maxZIndex + 1,
            locked: false
        }];
    });
  }, [setElements]);

  const handleUpdateElements = useCallback((ids: string[], updates: Partial<Omit<SkeletonElement, 'id'>> | ((el: SkeletonElement) => Partial<Omit<SkeletonElement, 'id'>>)) => {
    setElements(prev =>
      prev.map(el => {
        if (ids.includes(el.id) && !el.locked) {
          const newValues = typeof updates === 'function' ? updates(el) : updates;
          return { ...el, ...newValues };
        }
        return el;
      })
    );
  }, [setElements]);

  const handleRemoveElements = useCallback((ids: string[]) => {
    setElements(prev => prev.filter(el => !ids.includes(el.id)));
    setSelectedElementIds([]);
  }, [setElements]);

  const handleSelectElements = useCallback((ids: string[], addToSelection = false) => {
    if (addToSelection) {
        setSelectedElementIds(prev => {
            const newSelection = new Set(prev);
            ids.forEach(id => {
                if(newSelection.has(id)) newSelection.delete(id);
                else newSelection.add(id);
            });
            return Array.from(newSelection);
        });
    } else {
        setSelectedElementIds(ids);
    }
  }, []);

  const selectAllElements = useCallback(() => {
      setSelectedElementIds(elements.map(el => el.id));
  }, [elements]);
  
  const copyElements = useCallback(() => {
    const toCopy = elements.filter(el => selectedElementIds.includes(el.id));
    setClipboard(toCopy);
  }, [elements, selectedElementIds]);

  const pasteElements = useCallback(() => {
    if (clipboard.length === 0) return;
    setElements(prev => {
        const maxZIndex = prev.reduce((max, el) => Math.max(max, el.zIndex), 0);
        const newElements = clipboard.map((el, i) => ({
            ...el,
            id: `el_${Date.now()}_${i}`,
            x: el.x + 20,
            y: el.y + 20,
            zIndex: maxZIndex + i + 1,
        }));
        setSelectedElementIds(newElements.map(el => el.id));
        return [...prev, ...newElements];
    });
  }, [clipboard, setElements]);

  const duplicateElements = useCallback(() => {
      const toDuplicate = elements.filter(el => selectedElementIds.includes(el.id));
      if (toDuplicate.length === 0) return;
      setElements(prev => {
          const maxZIndex = prev.reduce((max, el) => Math.max(max, el.zIndex), 0);
          const newElements = toDuplicate.map((el, i) => ({
              ...el,
              id: `el_${Date.now()}_${i}`,
              x: el.x + 20,
              y: el.y + 20,
              zIndex: maxZIndex + i + 1
          }));
          setSelectedElementIds(newElements.map(el => el.id));
          return [...prev, ...newElements];
      });
  }, [elements, selectedElementIds, setElements]);

  const handleClear = useCallback(() => {
      resetState([]);
      setSelectedElementIds([]);
      isPresetLoad.current = false;
  }, [resetState]);

  const handleAlign = useCallback((alignment: 'left' | 'center-h' | 'right' | 'top' | 'center-v' | 'bottom') => {
      const selected = elements.filter(el => selectedElementIds.includes(el.id));
      if (selected.length < 2) return;

      const boundingBox = selected.reduce((acc, el) => ({
          minX: Math.min(acc.minX, el.x),
          minY: Math.min(acc.minY, el.y),
          maxX: Math.max(acc.maxX, el.x + el.width),
          maxY: Math.max(acc.maxY, el.y + el.height),
      }), {minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity});
      
      const centerX = boundingBox.minX + (boundingBox.maxX - boundingBox.minX) / 2;
      const centerY = boundingBox.minY + (boundingBox.maxY - boundingBox.minY) / 2;

      handleUpdateElements(selectedElementIds, el => {
          switch(alignment) {
              case 'left': return { x: boundingBox.minX };
              case 'center-h': return { x: centerX - el.width / 2 };
              case 'right': return { x: boundingBox.maxX - el.width };
              case 'top': return { y: boundingBox.minY };
              case 'center-v': return { y: centerY - el.height / 2 };
              case 'bottom': return { y: boundingBox.maxY - el.height };
              default: return {};
          }
      });

  }, [elements, selectedElementIds, handleUpdateElements]);

  const handleDistribute = useCallback((distribution: 'horizontal' | 'vertical') => {
      const selected = elements.filter(el => selectedElementIds.includes(el.id)).sort((a,b) => distribution === 'horizontal' ? a.x - b.x : a.y - b.y);
      if (selected.length < 3) return;
      
      if (distribution === 'horizontal') {
          const totalWidth = selected.reduce((sum, el) => sum + el.width, 0);
          const totalSpan = selected[selected.length - 1].x + selected[selected.length - 1].width - selected[0].x;
          const gap = (totalSpan - totalWidth) / (selected.length - 1);
          let currentX = selected[0].x + selected[0].width + gap;
          for (let i = 1; i < selected.length - 1; i++) {
              handleUpdateElements([selected[i].id], { x: currentX });
              currentX += selected[i].width + gap;
          }
      } else {
          const totalHeight = selected.reduce((sum, el) => sum + el.height, 0);
          const totalSpan = selected[selected.length - 1].y + selected[selected.length - 1].height - selected[0].y;
          const gap = (totalSpan - totalHeight) / (selected.length - 1);
          let currentY = selected[0].y + selected[0].height + gap;
          for (let i = 1; i < selected.length - 1; i++) {
              handleUpdateElements([selected[i].id], { y: currentY });
              currentY += selected[i].height + gap;
          }
      }
  }, [elements, selectedElementIds, handleUpdateElements]);

  const handleArrange = useCallback((arrangement: 'forward' | 'backward' | 'front' | 'back') => {
      if (selectedElementIds.length !== 1) return;
      const selectedId = selectedElementIds[0];
      
      setElements(prev => {
          const sorted = [...prev].sort((a,b) => a.zIndex - b.zIndex);
          const currentIndex = sorted.findIndex(el => el.id === selectedId);
          if (currentIndex === -1) return prev;

          if (arrangement === 'forward' && currentIndex < sorted.length - 1) {
              [sorted[currentIndex], sorted[currentIndex + 1]] = [sorted[currentIndex + 1], sorted[currentIndex]];
          } else if (arrangement === 'backward' && currentIndex > 0) {
              [sorted[currentIndex], sorted[currentIndex - 1]] = [sorted[currentIndex - 1], sorted[currentIndex]];
          } else if (arrangement === 'front') {
              const [item] = sorted.splice(currentIndex, 1);
              sorted.push(item);
          } else if (arrangement === 'back') {
              const [item] = sorted.splice(currentIndex, 1);
              sorted.unshift(item);
          }
          return sorted.map((el, i) => ({ ...el, zIndex: i + 1 }));
      });
  }, [selectedElementIds, setElements]);

  const handleGenerateWithAI = async (imageData: string) => {
    setIsGeneratingAI(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        const imagePart = { inlineData: { mimeType: 'image/jpeg', data: imageData } };
        const textPart = { text: "Analyze this UI screenshot. Identify all placeholder elements like images, text lines, and buttons. Return a JSON array representing these elements as skeleton loaders. Each object must have 'type' ('rect', 'circle', or 'text'), 'x', 'y', 'width', and 'height' properties. All coordinates and dimensions should be relative to a 600x400 canvas. Do not include any explanation, just the raw JSON array." };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ['rect', 'circle', 'text'] },
                            x: { type: Type.NUMBER },
                            y: { type: Type.NUMBER },
                            width: { type: Type.NUMBER },
                            height: { type: Type.NUMBER }
                        },
                        required: ['type', 'x', 'y', 'width', 'height']
                    }
                }
            }
        });
        
        const jsonString = response.text.trim();
        const generatedLayout = JSON.parse(jsonString);

        if (Array.isArray(generatedLayout)) {
            const newElements = generatedLayout.map((item: any, i: number) => ({
                id: `ai_el_${Date.now()}_${i}`,
                type: item.type,
                x: Math.round(item.x),
                y: Math.round(item.y),
                width: Math.round(item.width),
                height: Math.round(item.height),
                borderRadius: item.type === 'circle' ? Math.round(item.width/2) : (item.type === 'text' ? 4 : 8),
                color: 'bg-slate-700',
                animation: AnimationType.PULSE,
                zIndex: i + 1,
                locked: false,
            }));
            resetState(newElements);
            selectAllElements();
        } else {
            throw new Error("Invalid format from AI");
        }
    } catch (error) {
        console.error("AI Generation Failed:", error);
        alert("Sorry, something went wrong while generating the layout. Please try again.");
    } finally {
        setIsGeneratingAI(false);
    }
  };


  const selectedElements = elements.filter(el => selectedElementIds.includes(el.id));

  return (
    <div className="flex flex-col h-screen antialiased bg-white dark:bg-slate-900">
      <Header 
        onExport={() => setIsExporting(true)} 
        onBack={onBack}
        isEditorView 
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onClear={handleClear}
      />
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <Sidebar onAddElement={handleAddElement} />
        <LayersPanel 
            elements={elements}
            selectedElementIds={selectedElementIds}
            onSelectElement={(id) => handleSelectElements([id])}
            onUpdateElements={handleUpdateElements}
        />
        <div className="flex-1 relative flex">
            <Canvas
              elements={elements}
              selectedElementIds={selectedElementIds}
              onSelectElements={handleSelectElements}
              onUpdateElements={handleUpdateElements}
              onAddElement={handleAddElement}
              copyElements={copyElements}
              pasteElements={pasteElements}
              duplicateElements={duplicateElements}
              removeElements={handleRemoveElements}
              selectAllElements={selectAllElements}
            />
            <AIToolbar onGenerate={handleGenerateWithAI} isLoading={isGeneratingAI} />
            {isGeneratingAI && (
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-white font-semibold">Generating layout with AI...</p>
                </div>
            )}
        </div>
        <PropertiesPanel
            selectedElements={selectedElements}
            onUpdateElements={handleUpdateElements}
            onRemoveElements={handleRemoveElements}
            onAlign={handleAlign}
            onDistribute={handleDistribute}
            onArrange={handleArrange}
        />
      </main>
      {isExporting && <ExportModal elements={elements} onClose={() => setIsExporting(false)} />}
    </div>
  );
};

export default EditorPage;
