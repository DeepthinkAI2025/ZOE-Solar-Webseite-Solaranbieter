/**
 * Image Optimization Enhancement Service für ZOE Solar
 * 
 * Erweiterte Progressive Image Optimization mit Advanced Browser-Support
 * und Performance-Optimierung für bessere Core Web Vitals.
 * 
 * Features:
 * - Progressive Enhancement für alle Browser
 * - Advanced WebP/AVIF mit Fallbacks
 * - Critical Image Preloading
 * - Smart Lazy Loading mit Threshold-Anpassung
 * - Progressive JPEG für Legacy-Support
 */

export interface ImageOptimizationConfig {
  enabled: boolean;
  qualitySettings: {
    webp: number;
    avif: number;
    jpeg: number;
    progressive: boolean;
  };
  lazyLoading: {
    threshold: number;
    rootMargin: string;
    skipLargestContentfulPaint: boolean;
  };
  preloading: {
    criticalImagesOnly: boolean;
    maxPreloadSize: number;
    priorityHints: boolean;
  };
  compression: {
    maxFileSize: number;
    adaptiveQuality: boolean;
    metadataStripping: boolean;
  };
}

export interface ImageVariant {
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  width: number;
  height: number;
  quality: number;
  size: number;
  url: string;
  isOptimized: boolean;
}

export interface OptimizedImage {
  originalSrc: string;
  variants: ImageVariant[];
  primaryVariant: ImageVariant;
  isLazy: boolean;
  preloadPriority: 'high' | 'low' | 'auto';
  lcpCandidate: boolean;
  clsCandidate: boolean;
}

export interface BrowserCapabilities {
  supportsWebP: boolean;
  supportsAVIF: boolean;
  supportsIntersectionObserver: boolean;
  supportsNativeLazy: boolean;
  supportsPriorityHints: boolean;
  connectionType: '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';
}

class ImageOptimizationEnhancementService {
  private static instance: ImageOptimizationEnhancementService;
  private config: ImageOptimizationConfig;
  private browserCapabilities: BrowserCapabilities;
  private imageCache: Map<string, OptimizedImage> = new Map();
  private observerCallbacks: Map<Element, () => void> = new Map();
  private imageObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private processingQueue: string[] = [];
  private isProcessing: boolean = false;

  private constructor() {
    this.initializeConfig();
    this.detectBrowserCapabilities();
    this.setupImageObservers();
    this.setupResizeObserver();
  }

  public static getInstance(): ImageOptimizationEnhancementService {
    if (!ImageOptimizationEnhancementService.instance) {
      ImageOptimizationEnhancementService.instance = new ImageOptimizationEnhancementService();
    }
    return ImageOptimizationEnhancementService.instance;
  }

  private initializeConfig(): void {
    this.config = {
      enabled: true,
      qualitySettings: {
        webp: 85,
        avif: 80,
        jpeg: 90,
        progressive: true
      },
      lazyLoading: {
        threshold: 300, // px
        rootMargin: '50px',
        skipLargestContentfulPaint: true
      },
      preloading: {
        criticalImagesOnly: false,
        maxPreloadSize: 100000, // 100KB
        priorityHints: true
      },
      compression: {
        maxFileSize: 500000, // 500KB
        adaptiveQuality: true,
        metadataStripping: true
      }
    };
  }

  private detectBrowserCapabilities(): void {
    this.browserCapabilities = {
      supportsWebP: this.supportsFormat('image/webp'),
      supportsAVIF: this.supportsFormat('image/avif'),
      supportsIntersectionObserver: 'IntersectionObserver' in window,
      supportsNativeLazy: 'loading' in HTMLImageElement.prototype,
      supportsPriorityHints: 'priority' in HTMLImageElement.prototype,
      connectionType: (navigator as any).connection?.effectiveType || 'unknown'
    };
  }

  private supportsFormat(format: string): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    try {
      return canvas.toDataURL(format).indexOf('data:image/') === 0;
    } catch {
      return false;
    }
  }

  private setupImageObservers(): void {
    // Intersection Observer for lazy loading
    if (this.browserCapabilities.supportsIntersectionObserver) {
      this.imageObserver = new IntersectionObserver(
        (entries) => this.handleIntersectionEntries(entries),
        {
          rootMargin: this.config.lazyLoading.rootMargin,
          threshold: 0
        }
      );
    }

    // Resize Observer for responsive images
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(
        (entries) => this.handleResizeEntries(entries)
      );
    }
  }

  private setupResizeObserver(): void {
    // Setup responsive image handling
    window.addEventListener('resize', this.debounce(() => {
      this.updateResponsiveImages();
    }, 250));
  }

  // ===== IMAGE OPTIMIZATION =====

  /**
   * Optimize an image with progressive enhancement
   */
  public async optimizeImage(src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    isLazy?: boolean;
    isLCP?: boolean;
    priority?: 'high' | 'low' | 'auto';
  } = {}): Promise<OptimizedImage> {
    const cacheKey = `${src}-${JSON.stringify(options)}`;
    
    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey)!;
    }

    // Generate optimized variants
    const variants = await this.generateImageVariants(src, options);
    
    // Select primary variant based on browser support
    const primaryVariant = this.selectPrimaryVariant(variants);
    
    const optimizedImage: OptimizedImage = {
      originalSrc: src,
      variants,
      primaryVariant,
      isLazy: options.isLazy || false,
      preloadPriority: this.determinePriority(options),
      lcpCandidate: options.isLCP || false,
      clsCandidate: false
    };

    // Cache the result
    this.imageCache.set(cacheKey, optimizedImage);
    
    // Process critical images immediately
    if (options.isLCP || primaryVariant.size < this.config.preloading.maxPreloadSize) {
      this.processImage(optimizedImage);
    }

    return optimizedImage;
  }

  private async generateImageVariants(src: string, options: any): Promise<ImageVariant[]> {
    const variants: ImageVariant[] = [];
    
    try {
      // Generate AVIF variant (best quality)
      if (this.browserCapabilities.supportsAVIF) {
        const avifVariant = await this.generateVariant(src, 'avif', {
          width: options.width,
          height: options.height,
          quality: options.quality || this.config.qualitySettings.avif
        });
        if (avifVariant) variants.push(avifVariant);
      }

      // Generate WebP variant (good fallback)
      if (this.browserCapabilities.supportsWebP) {
        const webpVariant = await this.generateVariant(src, 'webp', {
          width: options.width,
          height: options.height,
          quality: options.quality || this.config.qualitySettings.webp
        });
        if (webpVariant) variants.push(webpVariant);
      }

      // Generate JPEG variant (legacy support)
      const jpegVariant = await this.generateVariant(src, 'jpeg', {
        width: options.width,
        height: options.height,
        quality: options.quality || this.config.qualitySettings.jpeg,
        progressive: this.config.qualitySettings.progressive
      });
      if (jpegVariant) variants.push(jpegVariant);

    } catch (error) {
      console.error('Image variant generation failed:', error);
    }

    return variants;
  }

  private async generateVariant(
    src: string, 
    format: 'webp' | 'avif' | 'jpeg' | 'png',
    options: any
  ): Promise<ImageVariant | null> {
    return new Promise((resolve) => {
      // Simulate image processing (in real implementation, use canvas)
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        canvas.width = options.width || img.naturalWidth;
        canvas.height = options.height || img.naturalHeight;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        try {
          const dataURL = canvas.toDataURL(`image/${format}`, options.quality / 100);
          
          const variant: ImageVariant = {
            format,
            width: canvas.width,
            height: canvas.height,
            quality: options.quality,
            size: this.dataURLToSize(dataURL),
            url: dataURL,
            isOptimized: true
          };
          
          resolve(variant);
        } catch (error) {
          resolve(null);
        }
      };
      
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  private selectPrimaryVariant(variants: ImageVariant[]): ImageVariant {
    // Preference order: AVIF > WebP > JPEG
    const preferredFormats = ['avif', 'webp', 'jpeg'];
    
    for (const format of preferredFormats) {
      const variant = variants.find(v => v.format === format);
      if (variant) return variant;
    }
    
    return variants[0];
  }

  // ===== PROGRESSIVE ENHANCEMENT =====

  /**
   * Create a progressive image element with optimal fallback
   */
  public createProgressiveImage(
    src: string,
    alt: string,
    options: {
      width?: number;
      height?: number;
      className?: string;
      isLazy?: boolean;
      isLCP?: boolean;
      sizes?: string;
      srcSet?: string;
    } = {}
  ): HTMLPictureElement {
    const picture = document.createElement('picture');
    
    // AVIF source
    if (this.browserCapabilities.supportsAVIF) {
      const avifSource = document.createElement('source');
      avifSource.type = 'image/avif';
      if (options.srcSet) {
        avifSource.srcset = options.srcSet.replace(/\.(jpg|jpeg|png)/g, '.avif');
      }
      if (options.sizes) {
        avifSource.sizes = options.sizes;
      }
      picture.appendChild(avifSource);
    }
    
    // WebP source
    if (this.browserCapabilities.supportsWebP) {
      const webpSource = document.createElement('source');
      webpSource.type = 'image/webp';
      if (options.srcSet) {
        webpSource.srcset = options.srcSet.replace(/\.(jpg|jpeg|png)/g, '.webp');
      }
      if (options.sizes) {
        webpSource.sizes = options.sizes;
      }
      picture.appendChild(webpSource);
    }
    
    // Fallback img element
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.width = options.width;
    img.height = options.height;
    img.className = options.className || '';
    
    // Configure loading behavior
    this.configureImageLoading(img, options);
    
    picture.appendChild(img);
    
    return picture;
  }

  private configureImageLoading(img: HTMLImageElement, options: any): void {
    // Native lazy loading
    if (this.browserCapabilities.supportsNativeLazy && options.isLazy) {
      img.loading = 'lazy';
    }
    
    // Priority hints
    if (this.browserCapabilities.supportsPriorityHints) {
      if (options.isLCP) {
        img.priority = 'high';
      } else if (options.isLazy) {
        img.priority = 'low';
      }
    }
    
    // Intersection Observer fallback
    if (options.isLazy && !this.browserCapabilities.supportsNativeLazy) {
      this.observeImage(img);
    }
  }

  // ===== LAZY LOADING ENHANCEMENT =====

  private observeImage(img: HTMLImageElement): void {
    if (this.imageObserver) {
      this.imageObserver.observe(img);
      this.observerCallbacks.set(img, () => {
        img.src = img.dataset.src || img.src;
      });
    }
  }

  private handleIntersectionEntries(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLImageElement;
        const callback = this.observerCallbacks.get(target);
        
        if (callback) {
          callback();
          this.observerCallbacks.delete(target);
        }
        
        if (this.imageObserver) {
          this.imageObserver.unobserve(target);
        }
      }
    }
  }

  // ===== CRITICAL IMAGE PRELOADING =====

  public preloadCriticalImages(images: Array<{
    src: string;
    priority: 'high' | 'low';
    as?: string;
  }>): void {
    for (const image of images) {
      if (image.priority === 'high') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = image.src;
        link.as = image.as || 'image';
        
        if (this.browserCapabilities.supportsWebP) {
          link.type = 'image/webp';
        }
        
        document.head.appendChild(link);
      }
    }
  }

  // ===== RESPONSIVE IMAGE MANAGEMENT =====

  private handleResizeEntries(entries: ResizeObserverEntry[]): void {
    for (const entry of entries) {
      this.updateResponsiveImage(entry.target as HTMLElement);
    }
  }

  private updateResponsiveImages(): void {
    const responsiveImages = document.querySelectorAll('img[data-responsive]');
    responsiveImages.forEach(img => this.updateResponsiveImage(img));
  }

  private updateResponsiveImage(element: HTMLElement): void {
    const img = element as HTMLImageElement;
    const container = element.parentElement;
    
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    const srcset = img.dataset.srcset;
    
    if (srcset) {
      // Update srcset based on current container width
      img.srcset = this.selectOptimalSrcSet(srcset, containerWidth);
    }
  }

  private selectOptimalSrcSet(srcset: string, containerWidth: number): string {
    const sources = srcset.split(',').map(source => {
      const [url, size] = source.trim().split(' ');
      return { url, size: parseInt(size), width: parseInt(size.replace('w', '')) };
    });
    
    // Select optimal source based on container width
    const optimal = sources
      .filter(source => source.width >= containerWidth)
      .sort((a, b) => a.width - b.width)[0];
    
    return optimal ? `${optimal.url} ${optimal.size}` : srcset;
  }

  // ===== PERFORMANCE OPTIMIZATION =====

  private processImage(optimizedImage: OptimizedImage): void {
    // Add to processing queue
    if (!this.processingQueue.includes(optimizedImage.originalSrc)) {
      this.processingQueue.push(optimizedImage.originalSrc);
    }
    
    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    
    while (this.processingQueue.length > 0) {
      const src = this.processingQueue.shift()!;
      const optimizedImage = Array.from(this.imageCache.values())
        .find(img => img.originalSrc === src);
      
      if (optimizedImage) {
        await this.applyImageOptimization(optimizedImage);
      }
    }
    
    this.isProcessing = false;
  }

  private async applyImageOptimization(optimizedImage: OptimizedImage): Promise<void> {
    // Inject optimized image into DOM
    const imageElement = this.findImageElement(optimizedImage.originalSrc);
    
    if (imageElement) {
      // Replace with optimized variant
      const picture = this.createProgressiveImage(
        optimizedImage.primaryVariant.url,
        imageElement.alt,
        {
          width: imageElement.width,
          height: imageElement.height,
          className: imageElement.className,
          isLazy: optimizedImage.isLazy,
          isLCP: optimizedImage.lcpCandidate
        }
      );
      
      // Replace original element
      imageElement.parentNode?.replaceChild(picture, imageElement);
    }
  }

  private findImageElement(src: string): HTMLImageElement | null {
    return document.querySelector(`img[src*="${src.split('/').pop()}"]`);
  }

  // ===== UTILITY METHODS =====

  private determinePriority(options: any): 'high' | 'low' | 'auto' {
    if (options.isLCP) return 'high';
    if (options.isLazy) return 'low';
    return 'auto';
  }

  private dataURLToSize(dataURL: string): number {
    const base64Length = dataURL.split(',')[1].length;
    return Math.ceil(base64Length * 0.75);
  }

  private debounce(func: Function, wait: number): Function {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // ===== PUBLIC API =====

  public getOptimizedImage(src: string, options?: any): OptimizedImage | undefined {
    const cacheKey = `${src}-${JSON.stringify(options)}`;
    return this.imageCache.get(cacheKey);
  }

  public updateConfig(newConfig: Partial<ImageOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getBrowserCapabilities(): BrowserCapabilities {
    return { ...this.browserCapabilities };
  }

  public getCacheStats(): {
    cachedImages: number;
    processingQueue: number;
    observerCallbacks: number;
  } {
    return {
      cachedImages: this.imageCache.size,
      processingQueue: this.processingQueue.length,
      observerCallbacks: this.observerCallbacks.size
    };
  }

  public clearCache(): void {
    this.imageCache.clear();
    this.processingQueue = [];
  }

  // ===== LIFECYCLE =====

  public destroy(): void {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    this.observerCallbacks.clear();
  }
}

// ===== EXPORT =====

export const imageOptimizationEnhancementService = ImageOptimizationEnhancementService.getInstance();
export default imageOptimizationEnhancementService;

/**
 * ===== USAGE EXAMPLES =====
 * 
 * // Progressive image with optimization
 * const picture = imageOptimizationEnhancementService.createProgressiveImage(
 *   '/assets/images/solar-panel.jpg',
 *   'Moderne Photovoltaik-Anlage von ZOE Solar',
 *   {
 *     width: 800,
 *     height: 600,
 *     className: 'hero-image',
 *     isLCP: true,
 *     sizes: '(max-width: 768px) 100vw, 50vw'
 *   }
 * );
 * 
 * // Optimized image with variants
 * const optimized = await imageOptimizationEnhancementService.optimizeImage(
 *   '/assets/images/installation.jpg',
 *   { width: 1200, height: 800, quality: 90, isLazy: true }
 * );
 * 
 * // Critical image preloading
 * imageOptimizationEnhancementService.preloadCriticalImages([
 *   { src: '/assets/images/hero.jpg', priority: 'high' },
 *   { src: '/assets/images/logo.png', priority: 'high' }
 * ]);
 */