/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance Optimization
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    scrollRestoration: true,
    largePageDataBytes: 128 * 1000, // 128KB
  },

  // Image Optimization für WebP/AVIF
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['images.unsplash.com', 'zoe-solar.de'],
    minimumCacheTTL: 86400, // 24 hours
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

  // Security Headers
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
        source: '/(.*)',
        headers: [
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

  // Webpack Konfiguration für maximale Performance
  webpack: (config, { isServer }) => {
    // Optimierung für Client-Side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Code Splitting Optimization
    config.optimization.splitChunks = {
      chunks: 'all',
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
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
        },
      },
    };

    return config;
  },
};

module.exports = nextConfig;