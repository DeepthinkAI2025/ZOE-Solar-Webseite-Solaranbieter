// Roboto fonts are loaded via CDN or system fonts
// Removed @fontsource/roboto imports to fix build errors

import poppins300 from '@fontsource/poppins/files/poppins-latin-300-normal.woff2?url';
import poppins400 from '@fontsource/poppins/files/poppins-latin-400-normal.woff2?url';
import poppins500 from '@fontsource/poppins/files/poppins-latin-500-normal.woff2?url';
import poppins600 from '@fontsource/poppins/files/poppins-latin-600-normal.woff2?url';
import poppins700 from '@fontsource/poppins/files/poppins-latin-700-normal.woff2?url';

const FONT_PRELOADS = [poppins300, poppins400, poppins500, poppins600, poppins700];

export const ensureFontPreloads = (): void => {
  if (typeof document === 'undefined') {
    return;
  }

  // Add font-display CSS for better performance
  const fontCSS = document.createElement('style');
  fontCSS.textContent = `
    @font-face {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: url('${poppins300}') format('woff2');
    }
    @font-face {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('${poppins400}') format('woff2');
    }
    @font-face {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url('${poppins500}') format('woff2');
    }
    @font-face {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url('${poppins600}') format('woff2');
    }
    @font-face {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: url('${poppins700}') format('woff2');
    }
  `;

  // Only add if not already present
  if (!document.querySelector('style[data-font-faces]')) {
    fontCSS.setAttribute('data-font-faces', 'true');
    document.head.appendChild(fontCSS);
  }

  // Preload critical fonts
  FONT_PRELOADS.forEach((href) => {
    if (document.querySelector(`link[data-font-preload="${href}"]`)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = href;
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.dataset.fontPreload = href;
    document.head.appendChild(link);
  });
};
