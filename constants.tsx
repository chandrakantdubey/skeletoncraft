import { ElementType, AnimationType, ExportFormat } from './types';

export const TOOLBOX_ITEMS = [
  { type: ElementType.RECT, label: 'Rectangle', icon: <div className="w-6 h-4 bg-slate-500 rounded-sm" /> },
  { type: ElementType.CIRCLE, label: 'Circle', icon: <div className="w-5 h-5 bg-slate-500 rounded-full" /> },
  { type: ElementType.TEXT, label: 'Text Line', icon: <div className="w-6 h-2 bg-slate-500 rounded-full" /> },
];

export const ANIMATION_OPTIONS = [
  { value: AnimationType.PULSE, label: 'Pulse' },
  { value: AnimationType.WAVE, label: 'Wave' },
  { value: AnimationType.SPIN, label: 'Spin' },
  { value: AnimationType.FADE, label: 'Fade' },
  { value: AnimationType.BOUNCE, label: 'Bounce' },
  { value: AnimationType.NONE, label: 'None' },
];

export const DARK_COLORS = [
  'bg-slate-700',
  'bg-gray-700',
  'bg-zinc-700',
  'bg-neutral-700',
  'bg-stone-700',
];

export const LIGHT_COLORS = [
  'bg-slate-200',
  'bg-gray-200',
  'bg-zinc-200',
  'bg-neutral-200',
  'bg-stone-200',
];

export const DARK_TO_LIGHT_COLOR_MAP: Record<string, string> = {
    'bg-slate-700': 'bg-slate-200',
    'bg-gray-700': 'bg-gray-200',
    'bg-zinc-700': 'bg-zinc-200',
    'bg-neutral-700': 'bg-neutral-200',
    'bg-stone-700': 'bg-stone-200',
};


export const EXPORT_FORMATS = [
    ExportFormat.HTML,
    ExportFormat.REACT,
    ExportFormat.VUE,
    ExportFormat.SVELTE,
    ExportFormat.ANGULAR,
];

export const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

export const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

export const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);