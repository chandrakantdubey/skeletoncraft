import React, { useState, useCallback, Suspense, lazy, useEffect, createContext, useContext } from 'react';
import { SkeletonElement, SkeletonPreset } from './types';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';

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
    const [theme, setTheme] = useState<Theme>('light');

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

// --- MAIN APP ROUTER ---
type Page = 'landing' | 'editor';

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('landing');
    const [initialElements, setInitialElements] = useState<SkeletonElement[] | null>(null);
    
    const handleStartEditing = useCallback((preset?: SkeletonPreset) => {
        if (preset) {
            const elementsWithIds = preset.elements.map((el, i) => ({ 
                ...el, 
                id: `el_${Date.now()}_${i}`,
                zIndex: i + 1,
                locked: false,
            }));
            setInitialElements(elementsWithIds);
             // Clear local storage when starting from a preset
            localStorage.removeItem('skeleton-craft-elements');
        } else {
            // If starting from scratch, we check local storage later in EditorPage
            setInitialElements([]);
        }
        setPage('editor');
    }, []);

    const handleBackToHome = useCallback(() => {
        setPage('landing');
        setInitialElements(null);
    }, []);

    return (
        <ThemeProvider>
            {page === 'landing' && <LandingPage onStartEditing={handleStartEditing} />}
            {page === 'editor' && initialElements !== null && <EditorPage initialElements={initialElements} onBack={handleBackToHome} />}
        </ThemeProvider>
    );
};

export default App;