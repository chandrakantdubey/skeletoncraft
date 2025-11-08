import { SkeletonElement, ExportFormat, AnimationType, ElementType } from '../types';
// FIX: Import DARK_TO_LIGHT_COLOR_MAP to resolve reference errors in framework-specific code generation.
import { DARK_TO_LIGHT_COLOR_MAP } from '../constants';

function getAnimationClass(animation: AnimationType): string {
    if (animation === AnimationType.PULSE) return 'animate-pulse';
    if (animation === AnimationType.SPIN) return 'animate-spin-custom';
    if (animation === AnimationType.FADE) return 'animate-fade-custom';
    if (animation === AnimationType.BOUNCE) return 'animate-bounce-custom';
    return '';
}

const tailwindColorMap: { [key: string]: string } = {
    'bg-slate-700': '#334155',
    'bg-gray-700': '#374151',
    'bg-zinc-700': '#3f3f46',
    'bg-neutral-700': '#404040',
    'bg-stone-700': '#44403c',
};

const tailwindLightColorMap: { [key: string]: string } = {
    'bg-slate-700': '#e2e8f0', // slate-200
    'bg-gray-700': '#e5e7eb',   // gray-200
    'bg-zinc-700': '#e4e4e7',   // zinc-200
    'bg-neutral-700': '#e5e5e5', // neutral-200
    'bg-stone-700': '#e7e5e4', // stone-200
};

const hasAnimation = (elements: SkeletonElement[], type: AnimationType) => elements.some(el => el.animation === type);

const generateKeyframes = (elements: SkeletonElement[]) => {
    let css = '';
    if (hasAnimation(elements, AnimationType.PULSE)) {
        css += `
  .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  @keyframes pulse { 50% { opacity: .5; } }`;
    }
    if (hasAnimation(elements, AnimationType.WAVE)) {
        css += `
  .wave-animation { position: relative; overflow: hidden; }
  .wave-animation::after {
      content: '';
      position: absolute;
      top: 0;
      left: -150%;
      width: 150%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      animation: wave 1.5s infinite;
  }
  @keyframes wave { 0% { left: -150%; } 100% { left: 150%; } }`;
    }
    if (hasAnimation(elements, AnimationType.SPIN)) {
        css += `
  .animate-spin-custom { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
    }
    if (hasAnimation(elements, AnimationType.FADE)) {
        css += `
  .animate-fade-custom { animation: fade 1.5s ease-in-out infinite; }
  @keyframes fade { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }`;
    }
    if (hasAnimation(elements, AnimationType.BOUNCE)) {
        css += `
  .animate-bounce-custom { animation: bounce 1s ease-in-out infinite; }
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15%); } }`;
    }
    return css;
}


// --- HTML/CSS Generator ---
function generateHtmlCss(elements: SkeletonElement[]): string {
  const elementsHtml = elements.map((el, index) => {
    const style = `position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; background-color: var(--sk-color-${index}); border-radius: ${el.type === ElementType.CIRCLE ? '50%' : `${el.borderRadius}px`}; ${el.animationDelay ? `animation-delay: ${el.animationDelay}` : ''}`;
    const animationClass = el.animation === AnimationType.WAVE ? 'wave-animation' : getAnimationClass(el.animation);
    return `    <div class="${animationClass}" style="${style}"></div>`;
  }).join('\n');
  
  const colorVariables = elements.map((el, index) => `    --sk-color-${index}: ${tailwindColorMap[el.color] || '#334155'};`).join('\n');
  const lightColorVariables = elements.map((el, index) => `    --sk-color-${index}: ${tailwindLightColorMap[el.color] || '#e2e8f0'};`).join('\n');


  const css = `<style>
  .skeleton-container {
    position: relative;
    width: 600px; /* Adjust to your container size */
    height: 400px; /* Adjust to your container size */
    overflow: hidden;
    background-color: #ffffff; /* Default light background */
    /* Light mode variables */
${lightColorVariables}
  }

  /* Or using a class for dark mode */
  .dark .skeleton-container {
    background-color: #1e293b;
${colorVariables}
  }

${generateKeyframes(elements)}
</style>`;

  return `${css}\n\n<div class="skeleton-container">\n${elementsHtml}\n</div>`;
}


// --- React Generator ---
function generateReact(elements: SkeletonElement[]): string {
  const elementsJsx = elements.map(el => {
    let styleProperties = `left: '${el.x}px', top: '${el.y}px', width: '${el.width}px', height: '${el.height}px', borderRadius: '${el.type === ElementType.CIRCLE ? '50%' : `${el.borderRadius}px`}'`;
    if (el.animationDelay) {
        styleProperties += `, animationDelay: '${el.animationDelay}'`;
    }
    const style = `{ ${styleProperties} }`;
    const animationClass = getAnimationClass(el.animation);
    const lightColorClass = el.color.replace('bg-', 'bg-');
    const darkColorClass = (DARK_TO_LIGHT_COLOR_MAP[el.color] || 'bg-slate-200').replace('bg-', 'dark:bg-');
    
    return `      <div
        className="${lightColorClass} ${darkColorClass} ${animationClass} absolute ${el.animation === AnimationType.WAVE ? 'relative overflow-hidden' : ''}"
        style={${style}}
      >${el.animation === AnimationType.WAVE ? `\n        <div className="absolute top-0 left-[-150%] h-full w-[150%] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-[wave_1.5s_infinite]" />` : ''}
      </div>`;
  }).join('\n');

  const keyframesCss = `/* In your global CSS file */
${generateKeyframes(elements)}
`;

  return `import React from 'react';

// Make sure you have Tailwind CSS configured in your project with dark mode enabled.
// If using animations, add the following keyframes to your global stylesheet:
/*
${keyframesCss}
*/

const SkeletonLoader = () => {
  return (
    <div className="relative w-[600px] h-[400px] bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
${elementsJsx}
    </div>
  );
};

export default SkeletonLoader;
`;
}


// --- Vue Generator ---
function generateVue(elements: SkeletonElement[]): string {
    const elementsTemplate = elements.map(el => {
      let style = `left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; border-radius: ${el.type === ElementType.CIRCLE ? '50%' : `${el.borderRadius}px`};`;
      if (el.animationDelay) {
          style += ` animation-delay: ${el.animationDelay};`;
      }
      const animationClass = getAnimationClass(el.animation);
      const lightColorClass = el.color.replace('bg-', 'bg-');
      const darkColorClass = (DARK_TO_LIGHT_COLOR_MAP[el.color] || 'bg-slate-200').replace('bg-', 'dark:bg-');

      return `    <div
      class="absolute ${lightColorClass} ${darkColorClass} ${animationClass} ${el.animation === AnimationType.WAVE ? 'relative overflow-hidden' : ''}"
      style="${style}"
    >${el.animation === AnimationType.WAVE ? `\n      <div class="absolute top-0 left-[-150%] h-full w-[150%] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-[wave_1.5s_infinite]"></div>` : ''}
    </div>`;
    }).join('\n');
    
    return `<template>
  <div class="relative w-[600px] h-[400px] bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
${elementsTemplate}
  </div>
</template>

<script>
export default {
  name: 'SkeletonLoader',
};
</script>

<style scoped>
/* Make sure you have Tailwind CSS utility classes available with dark mode enabled. */
${generateKeyframes(elements)}
</style>`;
}

// --- Svelte Generator ---
function generateSvelte(elements: SkeletonElement[]): string {
    const elementsHtml = elements.map(el => {
      let style = `left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; border-radius: ${el.type === ElementType.CIRCLE ? '50%' : `${el.borderRadius}px`};`;
      if (el.animationDelay) {
          style += ` animation-delay: ${el.animationDelay};`;
      }
      const animationClass = getAnimationClass(el.animation);
      const lightColorClass = el.color.replace('bg-', 'bg-');
      const darkColorClass = (DARK_TO_LIGHT_COLOR_MAP[el.color] || 'bg-slate-200').replace('bg-', 'dark:bg-');
      
      return `  <div
    class="absolute ${lightColorClass} ${darkColorClass} ${animationClass} ${el.animation === AnimationType.WAVE ? 'relative overflow-hidden' : ''}"
    style="${style}"
  >${el.animation === AnimationType.WAVE ? `\n    <div class="absolute top-0 left-[-150%] h-full w-[150%] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-[wave_1.5s_infinite]"></div>` : ''}
  </div>`;
    }).join('\n');
    
    return `<div class="relative w-[600px] h-[400px] bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
${elementsHtml}
</div>

<style>
  /* Make sure you have Tailwind CSS utility classes available globally with dark mode enabled. */
  :global(.dark) { /* Example for dark mode theming */ }
${generateKeyframes(elements)}
</style>`;
}

// --- Angular Generator ---
function generateAngular(elements: SkeletonElement[]): string {
    const elementsHtml = elements.map(el => {
        let styleObject = `{ 'left.px': ${el.x}, 'top.px': ${el.y}, 'width.px': ${el.width}, 'height.px': ${el.height}, 'border-radius': '${el.type === ElementType.CIRCLE ? '50%' : `${el.borderRadius}px`}'`;
        if (el.animationDelay) {
            styleObject += `, 'animation-delay': '${el.animationDelay}'`;
        }
        styleObject += ` }`;
        const animationClass = getAnimationClass(el.animation);
        const lightColorClass = el.color.replace('bg-', 'bg-');
        const darkColorClass = (DARK_TO_LIGHT_COLOR_MAP[el.color] || 'bg-slate-200').replace('bg-', 'dark\\:bg-');

        return `    <div
      class="absolute ${lightColorClass} ${darkColorClass} ${animationClass} ${el.animation === AnimationType.WAVE ? 'relative overflow-hidden' : ''}"
      [ngStyle]="${styleObject}"
    >${el.animation === AnimationType.WAVE ? `\n      <div class="absolute top-0 left-[-150%] h-full w-[150%] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-[wave_1.5s_infinite]"></div>` : ''}
    </div>`;
    }).join('\n');

    const componentTs = `import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.css']
})
export class SkeletonLoaderComponent {}
`;

    const componentHtml = `<div class="relative w-[600px] h-[400px] bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
${elementsHtml}
</div>`;

    const componentCss = `/* Ensure Tailwind is configured in your project (e.g., in styles.css) */
${generateKeyframes(elements)}`;
    
    return `// skeleton-loader.component.ts
${componentTs}

// skeleton-loader.component.html
${componentHtml}

// skeleton-loader.component.css
${componentCss}`;
}


export function generateCode(format: ExportFormat, elements: SkeletonElement[]): string {
  switch (format) {
    case ExportFormat.HTML:
      return generateHtmlCss(elements);
    case ExportFormat.REACT:
      return generateReact(elements);
    case ExportFormat.VUE:
        return generateVue(elements);
    case ExportFormat.SVELTE:
        return generateSvelte(elements);
    case ExportFormat.ANGULAR:
        return generateAngular(elements);
    default:
      return 'Unsupported format';
  }
}