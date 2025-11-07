import { SkeletonPreset, LoaderSpinnerPreset, ElementType, AnimationType } from './types';

export const SKELETON_PRESETS: SkeletonPreset[] = [
    {
        name: 'Article Card',
        elements: [
            { type: ElementType.RECT, x: 20, y: 20, width: 360, height: 200, borderRadius: 8, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 20, y: 240, width: 300, height: 20, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 20, y: 270, width: 360, height: 16, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 20, y: 296, width: 360, height: 16, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
        ],
    },
    {
        name: 'User Profile',
        elements: [
            { type: ElementType.CIRCLE, x: 40, y: 40, width: 80, height: 80, borderRadius: 50, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 140, y: 50, width: 150, height: 24, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 140, y: 84, width: 100, height: 16, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 40, y: 150, width: 420, height: 16, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 40, y: 176, width: 380, height: 16, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
        ],
    },
    {
        name: 'Video Playlist',
        elements: [
            { type: ElementType.RECT, x: 20, y: 20, width: 120, height: 80, borderRadius: 8, color: 'bg-slate-700', animation: AnimationType.WAVE },
            { type: ElementType.RECT, x: 160, y: 20, width: 400, height: 20, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.WAVE },
            { type: ElementType.RECT, x: 160, y: 50, width: 200, height: 16, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.WAVE },
            { type: ElementType.RECT, x: 20, y: 120, width: 120, height: 80, borderRadius: 8, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 160, y: 120, width: 400, height: 20, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 160, y: 150, width: 200, height: 16, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 20, y: 220, width: 120, height: 80, borderRadius: 8, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 160, y: 220, width: 400, height: 20, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 160, y: 250, width: 200, height: 16, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
        ],
    },
     {
        name: 'Dashboard Widgets',
        elements: [
            { type: ElementType.RECT, x: 20, y: 20, width: 270, height: 150, borderRadius: 12, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 310, y: 20, width: 270, height: 150, borderRadius: 12, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 20, y: 190, width: 560, height: 190, borderRadius: 12, color: 'bg-slate-700', animation: AnimationType.WAVE },
        ],
    }
];

export const LOADER_PRESETS: LoaderSpinnerPreset[] = [
    {
        name: 'Bar Pulse',
        html: `<div class="loader"></div>`,
        css: `
.loader {
  width: 80px;
  height: 50px;
  position: relative;
}
.loader:before, .loader:after {
  content: "";
  position: absolute;
  bottom: 0;
  width: 15px;
  height: 100%;
  background-color: var(--color-primary);
  animation: bar-pulse 1.5s infinite ease-in-out;
}
.loader:before {
  left: 20px;
  animation-delay: -0.5s;
}
.loader:after {
  right: 20px;
}
@keyframes bar-pulse {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1.0); }
}`
    },
    {
        name: 'Three Dots',
        html: `<div class="loader"></div>`,
        css: `
.loader {
  width: 60px;
  height: 10px;
  display: flex;
  justify-content: space-between;
}
.loader:before, .loader:after {
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--color-primary);
  animation: three-dots 1.2s infinite ease-in-out both;
}
.loader:before {
  animation-delay: -0.32s;
}
.loader:after {
  animation-delay: -0.16s;
}
@keyframes three-dots {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}`
    },
    {
        name: 'Bouncing Blocks',
        html: `<div class="loader"></div>`,
        css: `
.loader {
  width: 50px;
  height: 50px;
  position: relative;
  transform: rotateZ(45deg);
}
.loader:before, .loader:after {
  content: "";
  position: absolute;
  width: 25px;
  height: 25px;
  background-color: var(--color-primary);
  animation: bounce-blocks 2s infinite ease-in-out;
}
.loader:before {
  top: 0;
  left: 0;
}
.loader:after {
  top: 0;
  right: 0;
  animation-delay: -1.0s;
}
@keyframes bounce-blocks {
  0%, 100% { transform: scale(0.0); }
  50% { transform: scale(1.0); }
}`
    },
    {
        name: 'Shifting Squares',
        html: `<div class="loader"><div></div><div></div><div></div><div></div></div>`,
        css: `
.loader{
    width: 60px;
    height: 60px;
    position: relative;
}
.loader div{
    width: 25px;
    height: 25px;
    background: var(--color-primary);
    position: absolute;
    animation: shift 2s ease infinite;
}
.loader div:nth-child(1){ top: 0; left: 0; }
.loader div:nth-child(2){ top: 0; right: 0; }
.loader div:nth-child(3){ bottom: 0; left: 0; }
.loader div:nth-child(4){ bottom: 0; right: 0; }

@keyframes shift {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(35px, 0); }
  50% { transform: translate(35px, 35px); }
  75% { transform: translate(0, 35px); }
}`
    }
];

export const SPINNER_PRESETS: LoaderSpinnerPreset[] = [
    {
        name: 'Classic Spinner',
        html: `<div class="spinner"></div>`,
        css: `
.spinner {
  border: 4px solid var(--color-secondary);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`
    },
    {
        name: 'Duo Ring',
        html: `<div class="spinner"></div>`,
        css: `
.spinner {
  width: 40px;
  height: 40px;
  position: relative;
}
.spinner:before, .spinner:after {
  content: "";
  position: absolute;
  border-radius: 50%;
  border: 4px solid transparent;
  border-top-color: var(--color-primary);
  animation: spin 1.5s linear infinite;
}
.spinner:before {
  top: 0; left: 0; right: 0; bottom: 0;
}
.spinner:after {
  top: 6px; left: 6px; right: 6px; bottom: 6px;
  animation-direction: reverse;
  border-top-color: var(--color-accent);
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`
    },
    {
        name: 'Orbit',
        html: `<div class="spinner"></div>`,
        css: `
.spinner {
  width: 44px;
  height: 44px;
  position: relative;
  border-radius: 50%;
  border: 4px solid var(--color-secondary);
}
.spinner:before {
  content: "";
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: orbit 2s linear infinite;
}
@keyframes orbit {
  from { transform: rotate(0deg) translateX(22px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(22px) rotate(-360deg); }
}`
    },
    {
        name: 'Staggered Arc',
        html: `<div class="spinner"></div>`,
        css: `
.spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid var(--color-secondary);
  border-left-color: var(--color-primary);
  animation: spin-staggered 1.2s infinite cubic-bezier(0.5, 0, 0.5, 1);
}
@keyframes spin-staggered {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(1440deg); }
}`
    }
];