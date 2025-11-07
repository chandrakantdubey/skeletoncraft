import React from 'react';
import { SkeletonPreset, LoaderSpinnerPreset } from '../types';
import { useTheme } from '../App';
import { DARK_TO_LIGHT_COLOR_MAP } from '../constants';

type PresetCardProps = 
    | { type: 'skeleton'; preset: SkeletonPreset; onCustomize: () => void; onGetCode?: never; }
    | { type: 'loader'; preset: LoaderSpinnerPreset; onGetCode: () => void; onCustomize?: never; };

const PresetCard: React.FC<PresetCardProps> = ({ type, preset, onCustomize, onGetCode }) => {
    const { theme } = useTheme();

    const getSkeletonColorClass = (darkColor: string) => {
        if (theme === 'light') {
            return DARK_TO_LIGHT_COLOR_MAP[darkColor] || 'bg-slate-200';
        }
        return darkColor;
    };

    const getLoaderStyle = (css: string) => {
        const primaryColor = theme === 'light' ? '#4f46e5' : '#818cf8'; // indigo-600 / indigo-400
        const secondaryColor = theme === 'light' ? '#e5e7eb' : '#4b5563'; // gray-200 / gray-600
        const accentColor = theme === 'light' ? '#a5b4fc' : '#6366f1'; // indigo-300 / indigo-500
        return css
            .replace(/var\(--color-primary\)/g, primaryColor)
            .replace(/var\(--color-secondary\)/g, secondaryColor)
            .replace(/var\(--color-accent\)/g, accentColor);
    };

    return (
        <div className="group bg-white dark:bg-slate-800/50 rounded-xl shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 ring-1 ring-slate-200 dark:ring-slate-700/50 flex flex-col overflow-hidden">
            <div className="h-48 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 relative overflow-hidden">
                {type === 'skeleton' && (
                    <div className="w-full h-full scale-[0.4] origin-center">
                        <div className="relative w-[300px] h-[200px]">
                            {(preset as SkeletonPreset).elements.map((el, i) => (
                                <div key={i} className={`absolute ${getSkeletonColorClass(el.color)}`} style={{
                                    left: el.x * 0.5, top: el.y * 0.5,
                                    width: el.width * 0.5, height: el.height * 0.5,
                                    borderRadius: el.borderRadius,
                                }}></div>
                            ))}
                        </div>
                    </div>
                )}
                {type === 'loader' && (
                     <>
                        <style>{getLoaderStyle((preset as LoaderSpinnerPreset).css)}</style>
                        <div dangerouslySetInnerHTML={{ __html: (preset as LoaderSpinnerPreset).html }} />
                    </>
                )}
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">{preset.name}</h3>
                <div className="mt-4 flex items-center gap-2">
                    {type === 'skeleton' && (
                        <button 
                            onClick={onCustomize}
                            className="w-full px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500"
                        >
                            Customize
                        </button>
                    )}
                     {type === 'loader' && (
                        <button 
                            onClick={onGetCode}
                            className="w-full px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500"
                        >
                            Get Code
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PresetCard;
