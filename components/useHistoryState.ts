import { useState, useCallback, useRef } from 'react';

// A simple deep-equals check for objects and arrays.
const deepEquals = (a: any, b: any) => {
    if (a === b) return true;
    if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
        return false;
    }
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
        if (!keysB.includes(key) || !deepEquals(a[key], b[key])) {
            return false;
        }
    }
    return true;
};


export const useHistoryState = <T,>(initialState: T) => {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setState = useCallback((action: T | ((prevState: T) => T)) => {
    const newState = typeof action === 'function'
      ? (action as (prevState: T) => T)(history[currentIndex])
      : action;
    
    // If the new state is the same as the current one, do nothing.
    if (deepEquals(newState, history[currentIndex])) {
      return;
    }

    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [currentIndex, history]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  }, [currentIndex, history.length]);
  
  const resetState = useCallback((newState: T) => {
      setHistory([newState]);
      setCurrentIndex(0);
  }, []);

  return {
    state: history[currentIndex],
    setState,
    undo,
    redo,
    resetState,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
};
