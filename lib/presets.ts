import { SkeletonPreset, ElementType, AnimationType } from '../types';

// =================================================================
// PRESET HELPERS
// =================================================================
const createRing = (
    count: number,
    radius: number,
    center: {x: number, y: number},
    elementSize: {w: number, h: number},
    animation: AnimationType,
    color: string,
    type: ElementType.RECT | ElementType.CIRCLE,
    stagger = 0,
    offset = 0,
) => {
    const elements = [];
    for(let i=0; i<count; i++) {
        const angle = offset + (i / count) * 2 * Math.PI;
        const x = center.x + radius * Math.cos(angle) - elementSize.w / 2;
        const y = center.y + radius * Math.sin(angle) - elementSize.h / 2;
        elements.push({
            type: type,
            x: Math.round(x),
            y: Math.round(y),
            width: elementSize.w,
            height: elementSize.h,
            borderRadius: type === ElementType.CIRCLE ? elementSize.w/2 : 4,
            color: color,
            animation,
            animationDelay: `${i*stagger}s`,
        })
    }
    return elements;
}

// =================================================================
// SKELETON PRESETS
// =================================================================

export const SKELETON_PRESETS: SkeletonPreset[] = [
    {
        name: 'Article Card',
        elements: [
            { type: ElementType.RECT, x: 20, y: 20, width: 560, height: 200, borderRadius: 8, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 20, y: 240, width: 400, height: 24, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 20, y: 274, width: 560, height: 16, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 20, y: 300, width: 520, height: 16, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
        ],
    },
    {
        name: 'User Profile Card',
        elements: [
            { type: ElementType.CIRCLE, x: 250, y: 40, width: 100, height: 100, borderRadius: 50, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 210, y: 160, width: 180, height: 28, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 240, y: 198, width: 120, height: 16, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 40, y: 250, width: 520, height: 16, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 40, y: 276, width: 480, height: 16, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
        ],
    },
    {
        name: 'Video Card',
        elements: [
            { type: ElementType.RECT, x: 20, y: 20, width: 360, height: 200, borderRadius: 8, color: 'bg-slate-700', animation: AnimationType.WAVE },
            { type: ElementType.CIRCLE, x: 20, y: 240, width: 48, height: 48, borderRadius: 24, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 88, y: 240, width: 292, height: 20, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 88, y: 270, width: 210, height: 16, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
        ],
    },
    {
        name: 'Email List',
        elements: [
            { type: ElementType.CIRCLE, x: 20, y: 20, width: 48, height: 48, borderRadius: 24, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 88, y: 25, width: 200, height: 18, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 88, y: 53, width: 450, height: 14, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.CIRCLE, x: 20, y: 90, width: 48, height: 48, borderRadius: 24, color: 'bg-gray-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 88, y: 95, width: 250, height: 18, borderRadius: 4, color: 'bg-gray-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 88, y: 123, width: 480, height: 14, borderRadius: 4, color: 'bg-gray-700', animation: AnimationType.PULSE },
            { type: ElementType.CIRCLE, x: 20, y: 160, width: 48, height: 48, borderRadius: 24, color: 'bg-zinc-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 88, y: 165, width: 180, height: 18, borderRadius: 4, color: 'bg-zinc-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 88, y: 193, width: 420, height: 14, borderRadius: 4, color: 'bg-zinc-700', animation: AnimationType.PULSE },
        ],
    },
    {
        name: 'Dashboard Widgets',
        elements: [
            { type: ElementType.RECT, x: 20, y: 20, width: 270, height: 150, borderRadius: 12, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 310, y: 20, width: 270, height: 150, borderRadius: 12, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 20, y: 190, width: 560, height: 190, borderRadius: 12, color: 'bg-gray-700', animation: AnimationType.WAVE },
        ],
    },
    {
        name: 'Data Table',
        elements: [
            { type: ElementType.RECT, x: 20, y: 20, width: 560, height: 40, borderRadius: 6, color: 'bg-slate-700', animation: AnimationType.PULSE },
            { type: ElementType.RECT, x: 20, y: 80, width: 560, height: 32, borderRadius: 4, color: 'bg-gray-700', animation: AnimationType.NONE },
            { type: ElementType.RECT, x: 20, y: 122, width: 560, height: 32, borderRadius: 4, color: 'bg-zinc-700', animation: AnimationType.NONE },
            { type: ElementType.RECT, x: 20, y: 164, width: 560, height: 32, borderRadius: 4, color: 'bg-gray-700', animation: AnimationType.NONE },
            { type: ElementType.RECT, x: 20, y: 206, width: 560, height: 32, borderRadius: 4, color: 'bg-zinc-700', animation: AnimationType.NONE },
            { type: ElementType.RECT, x: 20, y: 248, width: 560, height: 32, borderRadius: 4, color: 'bg-gray-700', animation: AnimationType.NONE },
        ],
    },
];


// =================================================================
// LOADER PRESETS
// =================================================================

export const LOADER_PRESETS: SkeletonPreset[] = [
    {
        name: 'Bar Pulse',
        elements: [
            { type: ElementType.RECT, x: 260, y: 180, width: 10, height: 40, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.BOUNCE, animationDelay: '0s' },
            { type: ElementType.RECT, x: 280, y: 180, width: 10, height: 40, borderRadius: 4, color: 'bg-gray-700', animation: AnimationType.BOUNCE, animationDelay: '0.2s' },
            { type: ElementType.RECT, x: 300, y: 180, width: 10, height: 40, borderRadius: 4, color: 'bg-zinc-700', animation: AnimationType.BOUNCE, animationDelay: '0.4s' },
            { type: ElementType.RECT, x: 320, y: 180, width: 10, height: 40, borderRadius: 4, color: 'bg-neutral-700', animation: AnimationType.BOUNCE, animationDelay: '0.6s' },
        ],
    },
    {
        name: 'Three Dots Fade',
        elements: [
            { type: ElementType.CIRCLE, x: 260, y: 190, width: 20, height: 20, borderRadius: 10, color: 'bg-slate-700', animation: AnimationType.FADE, animationDelay: '0s' },
            { type: ElementType.CIRCLE, x: 300, y: 190, width: 20, height: 20, borderRadius: 10, color: 'bg-gray-700', animation: AnimationType.FADE, animationDelay: '0.25s' },
            { type: ElementType.CIRCLE, x: 340, y: 190, width: 20, height: 20, borderRadius: 10, color: 'bg-zinc-700', animation: AnimationType.FADE, animationDelay: '0.5s' },
        ],
    },
    {
        name: 'Shifting Squares',
        elements: [
            { type: ElementType.RECT, x: 280, y: 180, width: 20, height: 20, borderRadius: 4, color: 'bg-slate-700', animation: AnimationType.BOUNCE, animationDelay: '0s' },
            { type: ElementType.RECT, x: 320, y: 180, width: 20, height: 20, borderRadius: 4, color: 'bg-gray-700', animation: AnimationType.BOUNCE, animationDelay: '0.2s' },
            { type: ElementType.RECT, x: 280, y: 220, width: 20, height: 20, borderRadius: 4, color: 'bg-zinc-700', animation: AnimationType.BOUNCE, animationDelay: '0.4s' },
            { type: ElementType.RECT, x: 320, y: 220, width: 20, height: 20, borderRadius: 4, color: 'bg-neutral-700', animation: AnimationType.BOUNCE, animationDelay: '0.6s' },
        ]
    },
    {
        name: 'Jumping Dots',
        elements: [
            { type: ElementType.CIRCLE, x: 270, y: 200, width: 15, height: 15, borderRadius: 10, color: 'bg-slate-700', animation: AnimationType.BOUNCE, animationDelay: '0s' },
            { type: ElementType.CIRCLE, x: 300, y: 200, width: 15, height: 15, borderRadius: 10, color: 'bg-gray-700', animation: AnimationType.BOUNCE, animationDelay: '0.1s' },
            { type: ElementType.CIRCLE, x: 330, y: 200, width: 15, height: 15, borderRadius: 10, color: 'bg-zinc-700', animation: AnimationType.BOUNCE, animationDelay: '0.2s' },
        ]
    },
    {
        name: 'Heartbeat',
        elements: [
             { type: ElementType.RECT, x: 290, y: 190, width: 40, height: 40, borderRadius: 8, color: 'bg-slate-700', animation: AnimationType.PULSE, animationDelay: '0s' }
        ]
    }
];

// =================================================================
// SPINNER PRESETS
// =================================================================

export const SPINNER_PRESETS: SkeletonPreset[] = [
    {
        name: 'Classic Spinner',
        elements: [
            // A bit of a hack to create a spinner ring
            { type: ElementType.RECT, x: 275, y: 175, width: 50, height: 50, borderRadius: 25, color: 'bg-slate-700', animation: AnimationType.SPIN, animationDelay: '0s' },
            { type: ElementType.RECT, x: 280, y: 180, width: 40, height: 40, borderRadius: 20, color: 'bg-slate-800', animation: AnimationType.NONE, animationDelay: '0s' },
            { type: ElementType.RECT, x: 295, y: 175, width: 10, height: 25, borderRadius: 5, color: 'bg-slate-800', animation: AnimationType.NONE, animationDelay: '0s' }
        ]
    },
    {
        name: 'Orbit',
        elements: [
            ...createRing(1, 40, {x: 300, y: 200}, {w: 12, h: 12}, AnimationType.SPIN, 'bg-slate-700', ElementType.CIRCLE),
        ]
    },
    {
        name: 'Breathing Circle',
        elements: [
            { type: ElementType.CIRCLE, x: 280, y: 180, width: 40, height: 40, borderRadius: 20, color: 'bg-slate-700', animation: AnimationType.PULSE }
        ]
    },
    {
        name: 'Fading Dots',
        elements: [
            ...createRing(8, 35, {x:300, y:200}, {w: 10, h:10}, AnimationType.FADE, 'bg-slate-700', ElementType.CIRCLE, 0.125)
        ]
    },
    {
        name: 'Spinning Dashes',
        elements: [
             ...createRing(4, 35, {x:300, y:200}, {w: 6, h:18}, AnimationType.SPIN, 'bg-slate-700', ElementType.RECT, 0, 0),
             ...createRing(4, 35, {x:300, y:200}, {w: 6, h:18}, AnimationType.SPIN, 'bg-slate-700', ElementType.RECT, 0, Math.PI/4)
        ]
    },
];