import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Optimize JSX
      jsxImportSource: '@emotion/react',
    }),

    VitePWA({
      registerType: 'generateSW',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'ZOE Solar - Photovoltaik Unternehmen',
        short_name: 'ZOE Solar',
        description: 'Professionelle Solarlösungen für Gewerbe, Industrie und Landwirtschaft',
        theme_color: '#22c55e',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },

      // Enhanced Workbox Configuration for Performance
      workbox: {
        // Increase cache limit for larger chunks
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB

        // Cache strategies
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,avif,woff2}'],

        // Runtime caching for dynamic content
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}?version=${Date.now()}`;
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],

        // Don't cache large chunks
        navigateFallbackDenylist: [/^\/api\//],

        // Skip waiting for new updates
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],

  // Enhanced Build Optimizations
  build: {
    target: 'es2020',

    // Optimize chunk splitting
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Three.js ecosystem (heavy!)
          'three-vendor': [
            'three',
            '@react-three/fiber',
            '@react-three/drei',
            '@react-three/cannon',
            '@react-three/postprocessing'
          ],

          // UI libraries
          'ui-vendor': ['framer-motion', 'lucide-react'],

          // Heavy pages - split individually
          'agri-pv': ['./src/pages/AgriPVPage.tsx'],
          'dashboard': ['./src/pages/DashboardPage.tsx'],
          'home': ['./src/pages/HomePage.tsx'],

          // Large data files
          'data': ['./src/data/offers.ts', './src/data/productTypes.ts'],

          // Services
          'services': [
            './src/services/aiChatService.ts',
            './src/services/contactFormService.ts',
            './src/services/pdfExportService.ts'
          ],
        },

        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        },

        // Asset optimization
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').pop();
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/media/[name]-[hash].[ext]`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].[ext]`;
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].[ext]`;
          }
          return `assets/[name]-[hash].[ext]`;
        },
      },
    },

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Optimize minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
    },

    // Source maps for production debugging (remove in final build)
    sourcemap: false,

    // Report compressed size
    reportCompressedSize: true,

    // Enable chunk size warnings
    chunkSizeWarningLimit: 500, // Warn for chunks > 500KB
  },

  // Enhanced Development Server
  server: {
    port: 3000,
    host: true,
    open: true,

    // Enable HMR overlay
    hmr: {
      overlay: true,
    },
  },

  // Enhanced Preview Server
  preview: {
    port: 3000,
    host: true,
  },

  // Path Resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@services': resolve(__dirname, 'src/services'),
      '@data': resolve(__dirname, 'src/data'),
      '@types': resolve(__dirname, 'src/types'),
    },
  },

  // CSS Optimization
  css: {
    devSourcemap: true,

    // PostCSS configuration
    postcss: {
      plugins: [
        // Add any additional PostCSS plugins here
      ],
    },

    // CSS modules
    modules: false,

    // Preprocessor options
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/design-tokens.css";`,
      },
    },
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },

  // Environment variables
  envPrefix: 'VITE_',

  // Experimental Features
  experimental: {
    renderBuiltUrl(filename, { hostType, type }) {
      if (type === 'asset') {
        return { js: `/${filename}` };
      } else {
        return { relative: true };
      }
    },
  },

  // Optimized dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
    ],

    exclude: [
      'three', // Three.js should be bundled separately
    ],

    // Force optimization
    force: true,
  },

  // Worker configuration
  worker: {
    format: 'es',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/workers/[name]-[hash].js',
        chunkFileNames: 'assets/workers/[name]-[hash].js',
        assetFileNames: 'assets/workers/[name]-[hash].[ext]',
      },
    },
  },
});