/** @type {import('next').NextConfig} */
const { performanceConfig, coreWebVitalsTargets, germanSEOConfig } = require('./config/seo-performance-config');

const nextConfig = {
  // Performance Optimization mit Core Web Vitals Fokus
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    scrollRestoration: true,
    largePageDataBytes: 128 * 1000, // 128KB
    optimizePackageImports: ['lucide-react', 'react-markdown'],
  },

  // Image Optimization für Core Web Vitals
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['images.unsplash.com', 'zoe-solar.de'],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // LCP Optimierung
    loader: 'default',
    // CLS Reduzierung
    layoutRaw: false,
    quality: 75, // Bessere Performance vs Qualität Balance
    priority: true, // LCP Bilder priorisieren
  },

  // Build Optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Compression
  compress: true,

  // Power by Header Removal für Performance
  poweredByHeader: false,

  // React Optimization
  reactStrictMode: true,
  swcMinify: true,

  // Output Configuration
  output: 'standalone',

  // Performance & Security Headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=7776000, immutable' // 90 Tage
          }
        ]
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable' // 1 Jahr
          }
        ]
      },
      {
        source: '/(.*\\.(webp|avif|jpg|jpeg|png|gif|svg))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=7776000, immutable'
          }
        ]
      },
      {
        source: '/(.*)',
        headers: [
          // Security Headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Performance Headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          // Hints für Browser
          {
            key: 'Link',
            value: '</api/robots.txt>; rel=preload; as=fetch'
          }
        ]
      }
    ];
  },

  // Redirects für SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      }
    ];
  },

  // Rewrites für API Endpoints
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/faq-data',
          destination: '/api/faq-data/route.js',
        },
        {
          source: '/api/ai-content/:path*',
          destination: '/api/ai-content/:path*/route.js',
        }
      ]
    };
  },

  // Webpack Konfiguration für Core Web Vitals Optimierung
  webpack: (config, { isServer, dev }) => {
    // Optimierung für Client-Side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Nur im Production Mode optimieren
    if (!dev) {
      // Aggressives Code Splitting für Performance
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: performanceConfig.bundling.chunkSizeLimit,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            enforce: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
            enforce: true,
          },
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'three',
            chunks: 'all',
            priority: 15,
            enforce: true,
          },
          ui: {
            test: /[\\/]node_modules[\\/](framer-motion|lucide-react)[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 10,
            enforce: true,
          },
          // Lazy Loading für große Services
          services: {
            test: /[\\/]services[\\/]/,
            name: 'services',
            chunks: 'async',
            priority: 5,
          },
        },
      };

      // Tree Shaking und Unused Code Elimination
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // Compression
      config.optimization.minimize = true;
    }

    // Performance Hints
    if (!isServer) {
      config.performance = {
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      };
    }

    return config;
  },
};

module.exports = nextConfig;