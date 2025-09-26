import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
          port: 5173,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              if (id.includes('node_modules')) {
                if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                  return 'vendor';
                }
                if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('three')) {
                  return 'utils';
                }
                if (id.includes('react-hook-form') || id.includes('@hookform')) {
                  return 'forms';
                }
                return 'vendor';
              }
              if (id.includes('/components/')) {
                if (id.includes('Hero') || id.includes('Header') || id.includes('Footer') || id.includes('SEOManager')) {
                  return 'core-ui';
                }
                if (id.includes('MegaMenu') || id.includes('Navigation') || id.includes('Menu')) {
                  return 'navigation';
                }
                if (id.includes('Modal') || id.includes('Popup') || id.includes('Banner')) {
                  return 'overlays';
                }
                return 'components';
              }
              if (id.includes('/pages/')) {
                return 'pages';
              }
              if (id.includes('/data/')) {
                return 'data';
              }
            }
          }
        }
      }
    };
});
