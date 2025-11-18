// Asset Optimization Service for optimal performance

interface AssetConfig {
  // Image optimization
  imageFormats: ('webp' | 'avif' | 'original')[];
  imageQuality: number;
  enableLazyLoading: boolean;
  enableResponsiveImages: boolean;

  // Font optimization
  fontDisplay: 'swap' | 'block' | 'fallback' | 'optional';
  preloadCriticalFonts: boolean;

  // Script optimization
  enableScriptDefer: boolean;
  enableScriptAsync: boolean;
  enableScriptSplitting: boolean;

  // Cache strategies
  cacheStrategy: 'cacheFirst' | 'networkFirst' | 'staleWhileRevalidate';
  cacheDuration: number; // in seconds
}

class AssetOptimizationService {
  private config: AssetConfig = {
    imageFormats: ['webp', 'avif', 'original'],
    imageQuality: 85,
    enableLazyLoading: true,
    enableResponsiveImages: true,
    fontDisplay: 'swap',
    preloadCriticalFonts: true,
    enableScriptDefer: true,
    enableScriptAsync: true,
    enableScriptSplitting: true,
    cacheStrategy: 'cacheFirst',
    cacheDuration: 86400, // 24 hours
  };

  private supportedFormats: { avif: boolean; webp: boolean } = {
    avif: false,
    webp: false,
  };

  constructor(config: Partial<AssetConfig> = {}) {
    this.config = { ...this.config, ...config };
    this.detectSupportedFormats();
    this.initializeOptimizations();
  }

  private async detectSupportedFormats() {
    if (typeof window === 'undefined') return;

    // Detect AVIF support
    const avif = new Image();
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACJtZGF0EgAKCBgACog==';
    await new Promise(resolve => {
      avif.onload = () => {
        this.supportedFormats.avif = (avif.width > 0);
        resolve(void 0);
      };
      avif.onerror = () => resolve(void 0);
    });

    // Detect WebP support
    const webp = new Image();
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    await new Promise(resolve => {
      webp.onload = () => {
        this.supportedFormats.webp = (webp.width > 0);
        resolve(void 0);
      };
      webp.onerror = () => resolve(void 0);
    });

    console.log('Supported image formats:', this.supportedFormats);
  }

  private initializeOptimizations() {
    if (typeof window === 'undefined') return;

    // Optimize fonts
    this.optimizeFonts();

    // Optimize scripts
    this.optimizeScripts();

    // Initialize service worker for caching
    this.initializeCaching();
  }

  private optimizeFonts() {
    if (!this.config.preloadCriticalFonts) return;

    const criticalFonts = [
      {
        family: 'Poppins',
        weight: '400',
        style: 'normal',
      },
      {
        family: 'Poppins',
        weight: '600',
        style: 'normal',
      },
    ];

    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = `https://fonts.googleapis.com/css2?family=Poppins:wght@${font.weight}&display=${this.config.fontDisplay}`;
      link.as = 'style';
      link.onload = function() { this.rel = 'stylesheet'; };
      document.head.appendChild(link);
    });

    // Add font-display CSS for better loading performance
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Poppins';
        font-display: ${this.config.fontDisplay};
      }
    `;
    document.head.appendChild(style);
  }

  private optimizeScripts() {
    if (!this.config.enableScriptDefer && !this.config.enableScriptAsync) return;

    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const scriptElement = script as HTMLScriptElement;

      // Skip if already optimized
      if (scriptElement.hasAttribute('data-optimized')) return;

      if (this.config.enableScriptAsync && !scriptElement.hasAttribute('async')) {
        scriptElement.async = true;
      } else if (this.config.enableScriptDefer && !scriptElement.hasAttribute('defer')) {
        scriptElement.defer = true;
      }

      scriptElement.setAttribute('data-optimized', 'true');
    });
  }

  private initializeCaching() {
    if ('serviceWorker' in navigator && 'caches' in window) {
      // Register cache for assets
      this.registerCache();
    }
  }

  private async registerCache() {
    try {
      const cacheName = `zoe-solar-assets-v${Date.now()}`;
      const cache = await caches.open(cacheName);

      // Cache critical assets
      const criticalAssets = [
        '/',
        '/styles/design-tokens.css',
        '/fonts/poppins-v20-latin-regular.woff2',
      ];

      await Promise.all(
        criticalAssets.map(async asset => {
          try {
            await cache.add(asset);
          } catch (error) {
            console.warn(`Failed to cache ${asset}:`, error);
          }
        })
      );

      console.log('Asset cache initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize asset cache:', error);
    }
  }

  // Public API methods

  public getOptimizedImageUrl(
    originalUrl: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'avif' | 'original';
    } = {}
  ): string {
    const {
      width,
      height,
      quality = this.config.imageQuality,
      format = 'original'
    } = options;

    // If we have a CDN service for image optimization
    if (originalUrl.includes('cloudinary') || originalUrl.includes('imgix')) {
      return this.buildCdnUrl(originalUrl, { width, height, quality, format });
    }

    // For local images, add optimization parameters
    const url = new URL(originalUrl, window.location.origin);
    const params = new URLSearchParams(url.search);

    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality < 100) params.set('q', quality.toString());
    if (format !== 'original') params.set('f', format);

    url.search = params.toString();
    return url.toString();
  }

  public getBestImageFormat(): 'avif' | 'webp' | 'original' {
    for (const format of this.config.imageFormats) {
      if (format === 'avif' && this.supportedFormats.avif) return 'avif';
      if (format === 'webp' && this.supportedFormats.webp) return 'webp';
    }
    return 'original';
  }

  public generateResponsiveSrcSet(
    baseUrl: string,
    widths: number[] = [320, 640, 768, 1024, 1280, 1536],
    options: Omit<Parameters<typeof this.getOptimizedImageUrl>[1], 'width'> = {}
  ): string {
    return widths
      .map(width => `${this.getOptimizedImageUrl(baseUrl, { ...options, width })} ${width}w`)
      .join(', ');
  }

  public generateImageSizes(): string {
    return `
      (max-width: 640px) 100vw,
      (max-width: 768px) 50vw,
      (max-width: 1024px) 33vw,
      25vw
    `;
  }

  public preloadImage(url: string, options: {
    format?: string;
    width?: number;
    height?: number;
  } = {}) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'image';

    if (options.format) {
      link.type = `image/${options.format}`;
    }

    document.head.appendChild(link);
  }

  public async optimizeExistingImages(): Promise<{
    optimized: number;
    errors: number;
    totalSizeSaved: number;
  }> {
    if (typeof document === 'undefined') {
      return { optimized: 0, errors: 0, totalSizeSaved: 0 };
    }

    const images = document.querySelectorAll('img[src]');
    let optimized = 0;
    let errors = 0;
    let totalSizeSaved = 0;

    images.forEach(img => {
      try {
        const imgElement = img as HTMLImageElement;
        const originalSrc = imgElement.src;

        // Skip if already optimized
        if (imgElement.hasAttribute('data-optimized')) return;

        // Get best format
        const bestFormat = this.getBestImageFormat();
        const optimizedSrc = this.getOptimizedImageUrl(originalSrc, {
          format: bestFormat,
          width: imgElement.width || undefined,
        });

        if (optimizedSrc !== originalSrc) {
          imgElement.srcset = this.generateResponsiveSrcSet(originalSrc);
          imgElement.sizes = this.generateImageSizes();
          imgElement.setAttribute('data-optimized', 'true');
          optimized++;

          // Estimate size savings (rough calculation)
          if (bestFormat === 'avif') {
            totalSizeSaved += 50; // ~50% savings for AVIF
          } else if (bestFormat === 'webp') {
            totalSizeSaved += 25; // ~25% savings for WebP
          }
        }
      } catch (error) {
        console.warn('Failed to optimize image:', error);
        errors++;
      }
    });

    console.log(`Optimized ${optimized} images, ${errors} errors, estimated ${totalSizeSaved}KB saved`);
    return { optimized, errors, totalSizeSaved };
  }

  public buildCdnUrl(
    originalUrl: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: string;
      crop?: string;
      gravity?: string;
    }
  ): string {
    const url = new URL(originalUrl);

    // This would be customized based on your CDN provider
    // Example for Cloudinary
    const transformations = [];

    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.quality && options.quality < 100) transformations.push(`q_${options.quality}`);
    if (options.format && options.format !== 'original') transformations.push(`f_${options.format}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.gravity) transformations.push(`g_${options.gravity}`);

    if (transformations.length > 0) {
      url.pathname = url.pathname.replace(
        /\/upload\//,
        `/upload/${transformations.join(',')}/`
      );
    }

    return url.toString();
  }

  public async cacheAsset(url: string, strategy: 'cacheFirst' | 'networkFirst' = 'cacheFirst'): Promise<Response> {
    if (!('caches' in window)) {
      return fetch(url);
    }

    const cacheName = `zoe-solar-assets-v${Math.floor(Date.now() / (1000 * 60 * 60 * 24))}`; // Daily cache version

    try {
      const cache = await caches.open(cacheName);

      if (strategy === 'cacheFirst') {
        const cachedResponse = await cache.match(url);
        if (cachedResponse) {
          return cachedResponse;
        }
      }

      const networkResponse = await fetch(url);
      if (networkResponse.ok) {
        cache.put(url, networkResponse.clone());
      }
      return networkResponse;

    } catch (error) {
      console.warn('Cache operation failed:', error);
      // Fallback to network
      return fetch(url);
    }
  }

  public generateOptimizedPicture(
    baseUrl: string,
    alt: string,
    options: {
      widths?: number[];
      formats?: string[];
      className?: string;
      loading?: 'lazy' | 'eager';
      sizes?: string;
    } = {}
  ): string {
    const {
      widths = [320, 640, 768, 1024, 1280],
      formats = ['avif', 'webp', 'original'],
      className = '',
      loading = this.config.enableLazyLoading ? 'lazy' : 'eager',
      sizes = this.generateImageSizes()
    } = options;

    const pictureSources: string[] = [];

    // Generate sources for each format
    formats.slice(0, -1).forEach(format => {
      pictureSources.push(`
        <source
          type="image/${format}"
          srcset="${this.generateResponsiveSrcSet(baseUrl, widths, { format })}"
          sizes="${sizes}"
        />
      `);
    });

    // Generate original format as fallback
    const originalSrcSet = this.generateResponsiveSrcSet(baseUrl, widths, { format: 'original' });

    return `
      <picture class="${className}">
        ${pictureSources.join('\n        ')}
        <img
          src="${this.getOptimizedImageUrl(baseUrl, { width: widths[0] })}"
          srcset="${originalSrcSet}"
          sizes="${sizes}"
          alt="${alt}"
          loading="${loading}"
          decoding="async"
        />
      </picture>
    `;
  }

  public getOptimizationReport(): {
    supportedFormats: { avif: boolean; webp: boolean };
    config: AssetConfig;
    recommendations: string[];
  } {
    const recommendations: string[] = [];

    if (!this.supportedFormats.avif) {
      recommendations.push('AVIF not supported - consider WebP fallback for better compression');
    }

    if (!this.supportedFormats.webp) {
      recommendations.push('WebP not supported - users will receive larger JPEG/PNG images');
    }

    if (this.config.imageQuality > 80) {
      recommendations.push('Consider reducing image quality to 80% for better performance');
    }

    if (!this.config.enableLazyLoading) {
      recommendations.push('Enable lazy loading for images to improve initial page load');
    }

    return {
      supportedFormats: this.supportedFormats,
      config: this.config,
      recommendations,
    };
  }
}

// Singleton instance
export const assetOptimizationService = new AssetOptimizationService();

// Export for testing
export { AssetOptimizationService };

// Auto-optimize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      assetOptimizationService.optimizeExistingImages();
    }, 1000);
  });
}