import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode, command }) => {
    const env = loadEnv(mode, '.', '');
    const isSSR = command === 'build' && process.env.VITE_SSR === 'true';

    return {
      server: {
          port: 5173,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
          strategies: 'generateSW',
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB - ERHÖHT FÜR GROSSE BUNDLES
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                  },
                },
              },
              {
                urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'images-cache',
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                  },
                },
              },
              {
                urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'fonts-cache',
                  expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                  },
                },
              },
            ],
          },
          devOptions: {
            enabled: false,
            type: 'module',
          },
        }),
      ],
      build: {
      target: 'esnext',
      minify: false, // DISABLED FOR REACT ASYNCMODE COMPATIBILITY
      sourcemap: false,
      reportCompressedSize: false,
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 2000,
      modulePreload: {
        polyfill: false,
      },
      // KEEP IT SIMPLE - NO COMPLEX OPTIMIZATIONS FOR REACT COMPATIBILITY
      treeshake: false,
    },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react-router-dom',
          'axios',
          '@fontsource/poppins'
        ],
        exclude: [
          'jspdf',
          'html2canvas',
          'puppeteer'
        ]
      },
      // SEO und Performance Optimierungen
      esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
      },
    };
});