import React, { useState } from 'react';
import Header from '../components/Header';
import { SkeletonPreset, PresetCategory } from '../types';
import { SKELETON_PRESETS, LOADER_PRESETS, SPINNER_PRESETS } from '../lib/presets';
import PresetCard from '../components/PresetCard';

interface LandingPageProps {
  onStartEditing: (preset?: SkeletonPreset) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartEditing }) => {
    const [activeTab, setActiveTab] = useState<PresetCategory>(PresetCategory.SKELETONS);

    const TABS = [
        { name: PresetCategory.SKELETONS, count: SKELETON_PRESETS.length },
        { name: PresetCategory.LOADERS, count: LOADER_PRESETS.length },
        { name: PresetCategory.SPINNERS, count: SPINNER_PRESETS.length }
    ];

    const renderContent = () => {
        let presets: SkeletonPreset[] = [];
        let gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

        switch (activeTab) {
            case PresetCategory.SKELETONS:
                presets = SKELETON_PRESETS;
                break;
            case PresetCategory.LOADERS:
                 presets = LOADER_PRESETS;
                 gridCols = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
                 break;
            case PresetCategory.SPINNERS:
                presets = SPINNER_PRESETS;
                gridCols = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
                break;
        }

        return (
             <div className={`grid ${gridCols} gap-6`}>
                {presets.map(preset => (
                    <PresetCard key={preset.name} preset={preset} onCustomize={() => onStartEditing(preset)} />
                ))}
            </div>
        )
    }

  return (
    <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Component Gallery</h1>
                <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                    Browse our collection of pre-built skeletons, loaders, and spinners. Customize them or grab the code to go.
                </p>
                <button
                    onClick={() => onStartEditing()} 
                    className="mt-6 px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-500 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-indigo-500"
                >
                    Create From Scratch
                </button>
            </div>
            
            <div className="mb-8">
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {TABS.map(tab => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`${
                                    activeTab === tab.name
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                            >
                                {tab.name}
                                <span className={`ml-2 text-xs py-0.5 px-2 rounded-full ${activeTab === tab.name ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800'}`}>{tab.count}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {renderContent()}
        </main>
    </div>
  );
};

export default LandingPage;