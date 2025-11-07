import React, { useRef, useState } from 'react';

interface AIToolbarProps {
  onGenerate: (imageData: string) => void;
  isLoading: boolean;
}

const AIToolbar: React.FC<AIToolbarProps> = ({ onGenerate, isLoading }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) { // 4MB limit
            setError('Image size cannot exceed 4MB.');
            return;
        }

        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            onGenerate(base64String);
        };
        reader.readAsDataURL(file);
        
        // Reset file input to allow uploading the same file again
        e.target.value = '';
    };

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-xl shadow-lg flex items-center gap-3 z-20 ring-1 ring-slate-200 dark:ring-slate-700">
            <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                title="Generate a skeleton layout from a UI screenshot"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors disabled:bg-indigo-400 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-indigo-500"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Generate with AI</span>
            </button>
            {error && <p className="text-xs text-red-500 pr-2">{error}</p>}
        </div>
    );
};

export default AIToolbar;
