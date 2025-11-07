import { SkeletonElement, ExportFormat, AnimationType, ElementType } from '../types';

function getAnimationClass(animation: AnimationType): string {
  if (animation === AnimationType.PULSE) return 'animate-pulse';
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

// --- HTML/CSS Generator ---
function generateHtmlCss(elements: SkeletonElement[]): string {
  const hasWave = elements.some(el => el.animation === AnimationType.WAVE);

  const elementsHtml = elements.map((el, index) => {
    const style = `position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; background-color: var(--sk-color-${index}); border-radius: ${el.type === ElementType.CIRCLE ? '50%' : `${el.borderRadius}px`};`;
    const animationClass = el.animation === AnimationType.PULSE ? 'animate-pulse' : el.animation === AnimationType.WAVE ? 'wave-animation' : '';
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
    background-color: #1e293b; /* Default dark background */
    /* Light mode variables */
${lightColorVariables}
  }

  /* Example of how to theme it */
  @media (prefers-color-scheme: dark) {
    .skeleton-container {
      background-color: #1e293b;
${colorVariables}
    }
  }

  /* Or using a class */
  .dark .skeleton-container {
    background-color: #1e293b;
${colorVariables}
  }


  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes pulse {
    50% { opacity: .5; }
  }
  ${hasWave ? `
  .wave-animation {
    position: relative;
    overflow: hidden;
  }
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
  @keyframes wave {
      0% { left: -150%; }
      100% { left: 150%; }
  }` : ''}
</style>`;

  return `${css}\n\n<div class="skeleton-container">\n${elementsHtml}\n</div>`;
}


// --- React Generator ---
function generateReact(elements: SkeletonElement[]): string {
  const hasWave = elements.some(el => el.animation === AnimationType.WAVE);

  const elementsJsx = elements.map(el => {
    const style = `{ left: '${el.x}px', top: '${el.y}px', width: '${el.width}px', height: '${el.height}px', borderRadius: '${el.type === ElementType.CIRCLE ? '50%' : `${el.borderRadius}px`}' }`;
    const animationClass = el.animation === AnimationType.WAVE ? 'relative overflow-hidden' : getAnimationClass(el.animation);
    const lightColorClass = tailwindLightColorMap[el.color]?.replace('bg-', 'dark:bg-');
    return `      <div
        className="${el.color.replace('bg-', 'bg-')} ${lightColorClass}"
        style={${style}}
      >${el.animation === AnimationType.WAVE ? '\n        <div className="wave-overlay" />' : ''}
      </div>`;
  }).join('\n');

  const waveCss = hasWave ? `
.wave-overlay {
  position: absolute;
  top: 0;
  left: -150%;
  width: 150%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
}

html.dark .wave-overlay {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

@keyframes wave {
  0% { left: -150%; }
  100% { left: 150%; }
}
.wave-overlay {
    animation: wave 1.5s infinite;
}
` : '';

  return `import React from 'react';

// Make sure you have Tailwind CSS configured in your project with dark mode enabled.
// If using the wave animation, add the following CSS to your global stylesheet:
/*
${waveCss}
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
    const hasWave = elements.some(el => el.animation === AnimationType.WAVE);
    
    const elementsTemplate = elements.map(el => {
      const style = `left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; border-radius: ${el.type === ElementType.CIRCLE ? '50%' : `${el.borderRadius}px`};`;
      const animationClass = el.animation === AnimationType.WAVE ? 'relative overflow-hidden' : getAnimationClass(el.animation);
      const lightColorClass = tailwindLightColorMap[el.color]?.replace('bg-', 'dark:bg-');
      return `    <div
      class="${el.color.replace('bg-', 'bg-')} ${lightColorClass}"
      style="${style}"
    >
      ${el.animation === AnimationType.WAVE ? '<div class="wave-overlay"></div>' : ''}
    </div>`;
    }).join('\n');

    const waveCss = hasWave ? `
.wave-overlay {
  position: absolute;
  top: 0;
  left: -150%;
  width: 150%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  animation: wave 1.5s infinite;
}

.dark .wave-overlay {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

@keyframes wave {
  0% { left: -150%; }
  100% { left: 150%; }
}` : '';

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
${waveCss}
</style>`;
}

// --- Svelte and Angular Generators (Simplified for brevity, following similar patterns) ---
function generateSvelte(elements: SkeletonElement[]): string {
    const hasWave = elements.some(el => el.animation === AnimationType.WAVE);
    
    const elementsHtml = elements.map(el => {
      const style = `left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; border-radius: ${el.type === ElementType.CIRCLE ? '50%' : `${el.borderRadius}px`};`;
      const animationClass = el.animation === AnimationType.WAVE ? 'relative overflow-hidden' : getAnimationClass(el.animation);
      const lightColorClass = tailwindLightColorMap[el.color]?.replace('bg-', 'dark:bg-');
      return `  <div
    class="${el.color.replace('bg-', 'bg-')} ${lightColorClass}"
    style="${style}"
  >
    ${el.animation === AnimationType.WAVE ? '<div class="wave-overlay"></div>' : ''}
  </div>`;
    }).join('\n');

    const waveCss = hasWave ? `
  .wave-overlay {
    position: absolute;
    top: 0;
    left: -150%;
    width: 150%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
    animation: wave 1.5s infinite;
  }
  
  :global(.dark) .wave-overlay {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }

  @keyframes wave {
    0% { left: -150%; }
    100% { left: 150%; }
  }` : '';
    
    return `<div class="relative w-[600px] h-[400px] bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
${elementsHtml}
</div>

<style>
  /* Make sure you have Tailwind CSS utility classes available globally with dark mode enabled. */
  ${waveCss}
</style>`;
}

function generateAngular(elements: SkeletonElement[]): string {
    const hasWave = elements.some(el => el.animation === AnimationType.WAVE);

    const elementsHtml = elements.map(el => {
        const style = `left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; border-radius: ${el.type === ElementType.CIRCLE ? '50%' : `${el.borderRadius}px`};`;
        const animationClass = el.animation === AnimationType.WAVE ? 'relative overflow-hidden' : getAnimationClass(el.animation);
        const lightColorClass = tailwindLightColorMap[el.color]?.replace('bg-', 'dark:bg-');
        return `    <div
      class="${el.color.replace('bg-', 'bg-')} ${lightColorClass}"
      [ngStyle]="{ 'left.px': ${el.x}, 'top.px': ${el.y}, 'width.px': ${el.width}, 'height.px': ${el.height}, 'border-radius': '${el.type === ElementType.CIRCLE ? '50%' : `${el.borderRadius}px`}' }"
    >
      ${el.animation === AnimationType.WAVE ? '<div class="wave-overlay"></div>' : ''}
    </div>`;
    }).join('\n');

    const waveCss = hasWave ? `
:host-context(.dark) .wave-overlay {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}
.wave-overlay {
  position: absolute;
  top: 0;
  left: -150%;
  width: 150%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  animation: wave 1.5s infinite;
}

@keyframes wave {
  0% { left: -150%; }
  100% { left: 150%; }
}` : '';

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
${waveCss}`;
    
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
