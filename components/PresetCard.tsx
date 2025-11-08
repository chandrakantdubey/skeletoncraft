import React from 'react';
import { SkeletonPreset, SkeletonElement, AnimationType } from '../types';
import { useTheme } from '../App';
import { DARK_TO_LIGHT_COLOR_MAP } from '../constants';

type PresetCardProps = {
    preset: SkeletonPreset;
    onCustomize: () => void;
};

// Keyframes are defined here for the preview animation within the card
const animationStyles = `
    @keyframes pulse { 50% { opacity: .5; } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes fade { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15%); } }
`;

const PresetCard: React.FC<PresetCardProps> = ({ preset, onCustomize }) => {
    const { theme } = useTheme();

    const getSkeletonColorClass = (darkColor: string) => {
        if (theme === 'light') {
            return DARK_TO_LIGHT_COLOR_MAP[darkColor] || 'bg-slate-200';
        }
        return darkColor;
    };

    const getAnimationStyle = (el: Omit<SkeletonElement, 'id' | 'zIndex' | 'locked'>): React.CSSProperties => {
        const style: React.CSSProperties = {};
        switch(el.animation) {
             case AnimationType.PULSE:
                style.animation = 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite';
                break;
             case AnimationType.SPIN:
                style.animation = 'spin 1s linear infinite';
                break;
             case AnimationType.FADE:
                style.animation = 'fade 1.5s ease-in-out infinite';
                break;
            case AnimationType.BOUNCE:
                style.animation = 'bounce 1s ease-in-out infinite';
                break;
            default:
                break;
        }
        if (el.animationDelay) {
            style.animationDelay = el.animationDelay;
        }
        return style;
    }


    return (
        <div className="group bg-white dark:bg-slate-800/50 rounded-xl shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 ring-1 ring-slate-200 dark:ring-slate-700/50 flex flex-col overflow-hidden">
            <div className="h-48 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 relative overflow-hidden">
                <style>{animationStyles}</style>
                <div className="w-full h-full scale-[0.5] origin-center">
                    <div className="relative w-[600px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        {preset.elements.map((el, i) => (
                            <div key={i} className={`absolute ${getSkeletonColorClass(el.color)}`} style={{
                                left: el.x, top: el.y,
                                width: el.width, height: el.height,
                                borderRadius: el.type === 'circle' ? '50%' : el.borderRadius,
                                ...getAnimationStyle(el)
                            }}></div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">{preset.name}</h3>
                <div className="mt-4 flex items-center gap-2">
                    <button 
                        onClick={onCustomize}
                        className="w-full px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500"
                    >
                        Customize
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PresetCard;