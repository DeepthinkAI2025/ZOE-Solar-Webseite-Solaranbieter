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
              if (id.includes('/data/')) {
                return 'data';
              }
            }
          }
        }
      }
    };
});
