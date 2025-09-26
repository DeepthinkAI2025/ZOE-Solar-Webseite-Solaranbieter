import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

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
