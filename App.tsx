import React, { useState, useCallback, Suspense, lazy, useEffect, createContext, useContext } from 'react';
import { SkeletonElement, SkeletonPreset } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import LandingPage from './pages/LandingPage';

const LazyExportModal = lazy(() => import('./components/ExportModal'));

// --- THEME MANAGEMENT ---
type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };
    
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


// --- EDITOR PAGE ---
interface EditorPageProps {
    initialElements: SkeletonElement[];
    onBack: () => void;
}

const EditorPage: React.FC<EditorPageProps> = ({ initialElements, onBack }) => {
  const [elements, setElements] = useState<SkeletonElement[]>(initialElements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const addElement = useCallback((element: Omit<SkeletonElement, 'id'>) => {
    const newElement = { ...element, id: `el_${Date.now()}` };
    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<SkeletonElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  }, []);

  const removeElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if(selectedElementId === id) {
        setSelectedElementId(null);
    }
  }, [selectedElementId]);

  const selectedElement = elements.find((el) => el.id === selectedElementId) || null;

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header onExport={() => setIsExportModalOpen(true)} onBack={onBack} isEditorView={true} />
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <Sidebar onAddElement={addElement} />
        <div className="flex-1 flex justify-center items-center p-4 lg:p-8 bg-grid-pattern overflow-auto">
             <Canvas
                elements={elements}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={updateElement}
                onAddElement={addElement}
            />
        </div>
        <PropertiesPanel
          selectedElement={selectedElement}
          onUpdateElement={updateElement}
          onRemoveElement={removeElement}
        />
      </main>
      {isExportModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">Loading...</div>}>
            <LazyExportModal
                elements={elements}
                onClose={() => setIsExportModalOpen(false)}
            />
        </Suspense>
      )}
    </div>
  );
};

const bgPattern = `
.bg-grid-pattern {
    background-image: linear-gradient(rgba(100, 116, 139, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 116, 139, 0.15) 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: center;
}
html.dark .bg-grid-pattern {
    background-image: linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
}
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = bgPattern;
document.head.appendChild(styleSheet);


// --- MAIN APP ROUTER ---
type Page = 'landing' | 'editor';

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('landing');
    const [initialElements, setInitialElements] = useState<SkeletonElement[]>([]);
    
    const handleStartEditing = (preset?: SkeletonPreset) => {
        const elementsWithIds = preset ? preset.elements.map((el, i) => ({ ...el, id: `el_${Date.now()}_${i}` })) : [];
        setInitialElements(elementsWithIds);
        setPage('editor');
    };

    const handleBackToHome = () => {
        setPage('landing');
        setInitialElements([]);
    };

    return (
        <ThemeProvider>
            {page === 'landing' && <LandingPage onStartEditing={handleStartEditing} />}
            {page === 'editor' && <EditorPage initialElements={initialElements} onBack={handleBackToHome} />}
        </ThemeProvider>
    );
};

export default App;
