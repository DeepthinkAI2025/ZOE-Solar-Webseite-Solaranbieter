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
          includeAssets: [
            'favicon.ico',
            'favicon.svg',
            'apple-touch-icon.png',
            'apple-touch-startup-icon.png',
            'mstile-150x150.png',
            'images/icon-72x72.png',
            'images/icon-96x96.png',
            'images/icon-128x128.png',
            'images/icon-144x144.png',
            'images/icon-152x152.png',
            'images/icon-192x192.png',
            'images/icon-384x384.png',
            'images/icon-512x512.png',
            'images/screenshot-mobile-1.png',
            'images/screenshot-mobile-2.png',
            'images/screenshot-desktop-1.png',
            'images/shortcut-calculator.png',
            'images/shortcut-contact.png',
            'images/shortcut-projects.png'
          ],
          manifest: {
            id: 'de.zoesolar.app',
            name: 'ZOE Solar – Ihr Solaranbieter Testsieger 2025',
            short_name: 'ZOE Solar',
            description: 'ZOE Solar – Ihr Experte für Photovoltaik, Batteriespeicher und Ladeinfrastruktur in Deutschland. Testsieger 2025.',
            start_url: '/',
            scope: '/',
            display: 'standalone',
            display_override: ['window-controls-overlay', 'minimal-ui'],
            orientation: 'portrait',
            lang: 'de',
            dir: 'ltr',
            background_color: '#f5fbf7',
            theme_color: '#16a34a',
            categories: ['business', 'utilities', 'productivity', 'energy'],
            prefer_related_applications: false,
            icons: [
              {
                src: 'images/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any'
              },
              {
                src: 'images/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
              }
            ],
            screenshots: [
              {
                src: 'images/screenshot-mobile-1.png',
                sizes: '750x1334',
                type: 'image/png',
                form_factor: 'narrow',
                label: 'ZOE Solar Startseite auf dem Smartphone'
              },
              {
                src: 'images/screenshot-desktop-1.png',
                sizes: '1440x900',
                type: 'image/png',
                form_factor: 'wide',
                label: 'ZOE Solar Startseite auf dem Desktop'
              }
            ],
            shortcuts: [
              {
                name: 'Solarrechner',
                short_name: 'Rechner',
                description: 'Kostenlose Solaranalyse für Ihr Unternehmen',
                url: '/solar-rechner',
                icons: [
                  {
                    src: 'images/shortcut-calculator.png',
                    sizes: '96x96',
                    type: 'image/png'
                  }
                ]
              },
              {
                name: 'Kontaktanfrage',
                short_name: 'Kontakt',
                description: 'Persönliche Beratung anfordern',
                url: '/kontakt',
                icons: [
                  {
                    src: 'images/shortcut-contact.png',
                    sizes: '96x96',
                    type: 'image/png'
                  }
                ]
              },
              {
                name: 'Referenzen',
                short_name: 'Projekte',
                description: 'Erfolgreiche Solarprojekte ansehen',
                url: '/referenzen',
                icons: [
                  {
                    src: 'images/shortcut-projects.png',
                    sizes: '96x96',
                    type: 'image/png'
                  }
                ]
              }
            ],
            edge_side_panel: {
              preferred_width: 400
            },
            protocol_handlers: [
              {
                protocol: 'web+solar',
                url: '/solar-rechner?type=%s'
              }
            ],
            share_target: {
              action: '/share',
              method: 'POST',
              enctype: 'multipart/form-data',
              params: {
                title: 'title',
                text: 'text',
                url: 'url',
                files: [
                  {
                    name: 'documents',
                    accept: ['application/pdf', 'image/jpeg', 'image/png']
                  }
                ]
              }
            },
            launch_handler: {
              client_mode: 'focus-existing'
            }
          },
          strategies: 'generateSW',
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
            skipWaiting: true,
            clientsClaim: true,
            // Don't cache vendor bundles immediately to allow polyfill to load first
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
              // Cache JS files with NetworkFirst strategy to ensure polyfill priority
              {
                urlPattern: /\.(?:js)$/,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'js-cache',
                  expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                  },
                  networkTimeoutSeconds: 3,
                },
              },
            ],
            // Exclude vendor bundles from precache
            navigateFallbackDenylist: [/vendor.*\.js$/],
          },
          devOptions: {
            enabled: false,
            type: 'module',
          },
        }),
      ],
      build: {
      target: 'es2020', // Use slightly older target for better compatibility
      minify: 'terser', // ENABLE MINIFICATION FOR SMALLER BUNDLES
      sourcemap: false,
      reportCompressedSize: true,
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 1000, // TEMPORARILY INCREASE LIMIT WHILE OPTIMIZING
      modulePreload: {
        polyfill: false,
      },
      // ENABLE TREE SHAKING TO REMOVE UNUSED CODE
      treeshake: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-utils': ['axios', 'date-fns', 'lucide-react']
          }
        }
      }
    },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      optimizeDeps: {
        include: [
          'reflect-metadata',
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
      define: {
        'process.env': env,
      },
      // SEO und Performance Optimierungen
      esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
      },
    };
});