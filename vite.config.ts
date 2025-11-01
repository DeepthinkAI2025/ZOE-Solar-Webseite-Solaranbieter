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
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
          manifest: {
            name: 'ZOE Solar - Photovoltaik Experten',
            short_name: 'ZOE Solar',
            description: 'Experten für Photovoltaik-Lösungen für Gewerbe und Landwirtschaft',
            theme_color: '#f59e0b',
            background_color: '#ffffff',
            display: 'standalone',
            orientation: 'portrait',
            scope: '/',
            start_url: '/',
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
            categories: ['business', 'utilities', 'energy'],
            shortcuts: [
              {
                name: 'Photovoltaik Rechner',
                short_name: 'PV Rechner',
                description: 'Schnelle Berechnung Ihrer Solaranlage',
                url: '/photovoltaik/rechner-gewerbe',
                icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }],
              },
              {
                name: 'Beratung vereinbaren',
                short_name: 'Beratung',
                description: 'Persönliche Beratungstermin vereinbaren',
                url: '/kontakt',
                icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }],
              },
              {
                name: 'Projekte ansehen',
                short_name: 'Projekte',
                description: 'Unsere erfolgreichsten Solarprojekte',
                url: '/projekte',
                icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }],
              },
            ],
            screenshots: [
              {
                src: 'screenshot-desktop.png',
                sizes: '1280x720',
                type: 'image/png',
                platform: 'wide',
                label: 'Desktop Ansicht der ZOE Solar Website',
              },
              {
                src: 'screenshot-mobile.png',
                sizes: '390x844',
                type: 'image/png',
                platform: 'narrow',
                label: 'Mobile Ansicht der ZOE Solar Website',
              },
            ],
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
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
                urlPattern: /^https:\/\/zoe-solar\.de\/.*/i,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'zoe-solar-cache',
                  expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24, // 24 hours
                  },
                },
              },
              {
                urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
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
                urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
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
          },
          devOptions: {
            enabled: true,
            type: 'module',
          },
        }),
      ],
      build: {
        target: 'esnext',
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: mode === 'production',
            drop_debugger: mode === 'production',
            pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
          },
          mangle: {
            safari10: true,
          },
        },
        rollupOptions: isSSR ? {
          input: {
            server: './src/entry-server.tsx',
          },
          output: {
            format: 'esm',
          },
        } : {
          input: {
            main: './index.html',
          },
          output: {
            manualChunks: (id) => {
              if (id.includes('node_modules')) {
                // React und React-Router in separaten Chunk
                if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                  return 'react-vendor';
                }
                // Große UI-Bibliotheken
                if (id.includes('@mui') || id.includes('material-ui') || id.includes('antd') || id.includes('bootstrap')) {
                  return 'ui-vendor';
                }
                // Three.js und 3D-Bibliotheken
                if (id.includes('three') || id.includes('@react-three') || id.includes('react-three-fiber')) {
                  return 'three-vendor';
                }
                // PDF und Canvas-Bibliotheken
                if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('puppeteer')) {
                  return 'pdf-vendor';
                }
                // Form-Bibliotheken
                if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('formik') || id.includes('yup')) {
                  return 'forms-vendor';
                }
                // Chart-Bibliotheken
                if (id.includes('chart.js') || id.includes('d3') || id.includes('recharts')) {
                  return 'charts-vendor';
                }
                // HTTP und API-Bibliotheken
                if (id.includes('axios') || id.includes('fetch') || id.includes('apollo') || id.includes('graphql')) {
                  return 'http-vendor';
                }
                // Utility-Bibliotheken
                if (id.includes('lodash') || id.includes('underscore') || id.includes('ramda') || id.includes('date-fns') || id.includes('moment')) {
                  return 'utils-vendor';
                }
                // Animation-Bibliotheken
                if (id.includes('framer-motion') || id.includes('react-spring') || id.includes('gsap')) {
                  return 'animation-vendor';
                }
                // Andere Vendor-Bibliotheken
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
                if (id.includes('AI') || id.includes('Chat') || id.includes('Bot')) {
                  return 'ai-components';
                }
                if (id.includes('Dashboard') || id.includes('Monitoring')) {
                  return 'dashboard-components';
                }
                return 'components';
              }
              if (id.includes('/pages/')) {
                if (id.includes('HomePage') || id.includes('PhotovoltaikPage') || id.includes('EMobilitaetPage') || id.includes('ElektroPage') || id.includes('PreisePage') || id.includes('UeberUnsPage') || id.includes('KontaktPage') || id.includes('KarrierePage') || id.includes('TeamPage') || id.includes('WarumZoeSolarPage') || id.includes('PartnerWerdenPage') || id.includes('EmpfehlungspraemiePage') || id.includes('NachhaltigkeitPage') || id.includes('PressePage') || id.includes('ImpressumPage') || id.includes('DatenschutzPage') || id.includes('AGBPage') || id.includes('LoginPage') || id.includes('MitarbeiterLoginPage') || id.includes('DashboardPage')) {
                  return 'core-pages';
                }
                if (id.includes('Service') || id.includes('Wartung') || id.includes('Garantie')) {
                  return 'service-pages';
                }
                if (id.includes('Standort') || id.includes('Eigenheim') || id.includes('AgriPV') || id.includes('Fallstudien') || id.includes('CaseStudy')) {
                  return 'location-pages';
                }
                if (id.includes('Foerdermittel') || id.includes('Funding') || id.includes('Finanzierung')) {
                  return 'funding-pages';
                }
                if (id.includes('Produkte') || id.includes('Hersteller') || id.includes('Anwendungs')) {
                  return 'product-pages';
                }
                if (id.includes('Aktuelles') || id.includes('Article') || id.includes('Wissens') || id.includes('Glossar') || id.includes('Guide') || id.includes('FAQPage') || id.includes('DIY')) {
                  return 'content-pages';
                }
                return 'other-pages';
              }
              if (id.includes('/services/')) {
                if (id.includes('ai') || id.includes('AI')) {
                  return 'ai-services';
                }
                if (id.includes('seo') || id.includes('SEO') || id.includes('optimization')) {
                  return 'seo-services';
                }
                if (id.includes('brand') || id.includes('authority') || id.includes('citation')) {
                  return 'authority-services';
                }
                return 'services';
              }
              if (id.includes('/data/')) {
                return 'data';
              }
              if (id.includes('/utils/')) {
                return 'utils';
              }
            },
            assetFileNames: (assetInfo) => {
              const info = assetInfo.name.split('.');
              const extType = info[info.length - 1];
              if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
                return `assets/images/[name]-[hash][extname]`;
              }
              if (/\.(css)$/i.test(assetInfo.name)) {
                return `assets/css/[name]-[hash][extname]`;
              }
              return `assets/[name]-[hash][extname]`;
            },
            chunkFileNames: 'assets/js/[name]-[hash].js',
            entryFileNames: 'assets/js/[name]-[hash].js',
          }
        },
        sourcemap: mode === 'development',
        reportCompressedSize: false,
        cssCodeSplit: true,
        assetsInlineLimit: 4096,
        chunkSizeWarningLimit: 1500, // Erhöht von 500KB auf 1500KB
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