/**
 * ZOE SOLAR - Image Optimization Service
 * Rekonstruiert aus Chat-Verlauf - Vollständige Implementierung
 * 
 * Quick Win Features:
 * - Lazy Loading Implementation
 * - WebP Format Support
 * - Responsive Images
 * - Preload Critical Images
 * - Image Compression
 * - CDN Integration Ready
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// Image Optimization Configuration
interface ImageOptimizationConfig {
    enableLazyLoading: boolean;
    enableWebP: boolean;
    enableResponsive: boolean;
    quality: number;
    formats: string[];
    breakpoints: number[];
    preloadCritical: boolean;
}

// Default Configuration
const DEFAULT_CONFIG: ImageOptimizationConfig = {
    enableLazyLoading: true,
    enableWebP: true,
    enableResponsive: true,
    quality: 85,
    formats: ['webp', 'jpg', 'png'],
    breakpoints: [320, 640, 768, 1024, 1280, 1920],
    preloadCritical: true
};

// Image Optimization Service
export class ImageOptimizationService {
    private static instance: ImageOptimizationService;
    private config: ImageOptimizationConfig;
    private preloadedImages: Set<string> = new Set();
    private observer: IntersectionObserver | null = null;

    constructor(config: ImageOptimizationConfig = DEFAULT_CONFIG) {
        this.config = config;
        this.initIntersectionObserver();
    }

    public static getInstance(config?: ImageOptimizationConfig): ImageOptimizationService {
        if (!ImageOptimizationService.instance) {
            ImageOptimizationService.instance = new ImageOptimizationService(config);
        }
        return ImageOptimizationService.instance;
    }

    private initIntersectionObserver() {
        if (!this.config.enableLazyLoading) return;

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target as HTMLImageElement);
                        this.observer?.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '50px 0px',
                threshold: 0.01
            }
        );
    }

    // Generate optimized image URL
    public generateOptimizedUrl(
        originalUrl: string,
        width?: number,
        height?: number,
        format?: string,
        quality?: number
    ): string {
        const params = new URLSearchParams();
        
        if (width) params.append('w', width.toString());
        if (height) params.append('h', height.toString());
        if (format) params.append('f', format);
        if (quality) params.append('q', quality.toString());

        const queryString = params.toString();
        return queryString ? `${originalUrl}?${queryString}` : originalUrl;
    }

    // Preload critical images
    public preloadImage(url: string, priority: 'high' | 'low' = 'low'): void {
        if (this.preloadedImages.has(url)) return;

        const img = new Image();
        img.decoding = 'async';
        img.loading = priority === 'high' ? 'eager' : 'lazy';
        
        img.onload = () => {
            this.preloadedImages.add(url);
            console.log(`✅ Image preloaded: ${url}`);
        };
        
        img.onerror = () => {
            console.warn(`⚠️ Failed to preload image: ${url}`);
        };

        img.src = url;
    }

    // Preload critical images for hero sections
    public preloadHeroImages(imageUrls: string[]): void {
        if (!this.config.preloadCritical) return;

        imageUrls.forEach((url, index) => {
            // High priority for first image, low for others
            const priority = index === 0 ? 'high' : 'low';
            setTimeout(() => this.preloadImage(url, priority), index * 100);
        });
    }

    // Get best format for browser support
    public getBestFormat(): string {
        if (!this.config.enableWebP) return 'jpg';
        
        // Check WebP support
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0 ? 'webp' : 'jpg';
    }

    // Generate responsive image sources
    public generateResponsiveSources(
        baseUrl: string,
        breakpoints: number[] = this.config.breakpoints
    ): { srcSet: string; sizes: string } {
        const format = this.getBestFormat();
        const srcSet = breakpoints
            .map(width => `${this.generateOptimizedUrl(baseUrl, width, undefined, format)} ${width}w`)
            .join(', ');

        const sizes = `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw`;

        return { srcSet, sizes };
    }

    // Optimize image with all enhancements
    public optimizeImage(image: HTMLImageElement): void {
        // Add loading optimization
        if (this.config.enableLazyLoading) {
            image.loading = 'lazy';
            image.decoding = 'async';
        }

        // Add responsive attributes
        if (this.config.enableResponsive) {
            const { srcSet, sizes } = this.generateResponsiveSources(image.src);
            image.srcSet = srcSet;
            image.sizes = sizes;
        }

        // Add error handling
        image.addEventListener('error', (e) => {
            const target = e.target as HTMLImageElement;
            console.warn(`Image failed to load: ${target.src}`);
            
            // Try fallback format
            if (target.src.includes('webp')) {
                target.src = target.src.replace(/\.webp/, '.jpg');
            }
        });

        // Add load optimization
        image.addEventListener('load', () => {
            console.log(`✅ Image loaded successfully: ${image.src}`);
        });
    }

    // Start observing image for lazy loading
    public observeImage(img: HTMLImageElement): void {
        if (!this.observer || !this.config.enableLazyLoading) {
            this.loadImage(img);
            return;
        }

        this.observer.observe(img);
    }

    // Load image when needed
    private loadImage(img: HTMLImageElement): void {
        if (img.dataset.loaded) return;

        this.optimizeImage(img);
        img.dataset.loaded = 'true';
    }

    // Batch optimize all images on page
    public batchOptimize(): void {
        const images = document.querySelectorAll('img');
        images.forEach((img) => {
            if (!img.dataset.loaded) {
                this.observeImage(img);
            }
        });
        console.log(`🔄 Optimized ${images.length} images`);
    }

    // Get image performance metrics
    public getImageMetrics(): { total: number; optimized: number; lazy: number } {
        const images = document.querySelectorAll('img');
        const optimized = images.filter(img => img.dataset.loaded).length;
        const lazy = images.filter(img => img.loading === 'lazy').length;

        return {
            total: images.length,
            optimized,
            lazy
        };
    }
}

// React Hook for Image Optimization
export function useOptimizedImage(
    src: string,
    alt: string,
    options: {
        width?: number;
        height?: number;
        quality?: number;
        formats?: string[];
        priority?: 'high' | 'low';
        className?: string;
        loading?: 'eager' | 'lazy';
        fallback?: string;
    } = {}
) {
    const [optimizedSrc, setOptimizedSrc] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    
    const imageService = ImageOptimizationService.getInstance();
    const {
        width,
        height,
        quality = imageService['config'].quality,
        formats = imageService['config'].formats,
        priority = 'low',
        className = '',
        loading = 'lazy',
        fallback = ''
    } = options;

    const bestFormat = imageService.getBestFormat();

    useEffect(() => {
        if (!src) return;

        // Generate optimized URL
        const optimizedUrl = imageService.generateOptimizedUrl(
            src,
            width,
            height,
            bestFormat,
            quality
        );

        setOptimizedSrc(optimizedUrl);
        setIsLoading(true);
        setError(null);

        // Preload if high priority
        if (priority === 'high') {
            imageService.preloadImage(optimizedUrl, 'high');
        }
    }, [src, width, height, quality, bestFormat, priority]);

    useEffect(() => {
        if (!imgRef.current || !optimizedSrc) return;

        imageService.observeImage(imgRef.current);

        const img = imgRef.current;
        
        const handleLoad = () => {
            setIsLoading(false);
            imageService.optimizeImage(img);
        };

        const handleError = () => {
            setError('Failed to load image');
            setIsLoading(false);
            
            // Try fallback
            if (fallback && optimizedSrc !== fallback) {
                setOptimizedSrc(fallback);
            }
        };

        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleError);

        return () => {
            img.removeEventListener('load', handleLoad);
            img.removeEventListener('error', handleError);
        };
    }, [optimizedSrc, fallback]);

    const handleImageLoad = useCallback(() => {
        setIsLoading(false);
        setError(null);
    }, []);

    const handleImageError = useCallback(() => {
        setError('Image loading failed');
        setIsLoading(false);
        
        if (fallback && optimizedSrc !== fallback) {
            setOptimizedSrc(fallback);
        }
    }, [fallback, optimizedSrc]);

    return {
        src: optimizedSrc,
        alt,
        ref: imgRef,
        isLoading,
        error,
        onLoad: handleImageLoad,
        onError: handleImageError,
        className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`
    };
}

// Optimized Image Component
export const OptimizedImage: React.FC<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    loading?: 'eager' | 'lazy';
    priority?: 'high' | 'low';
    fallback?: string;
    sizes?: string;
    quality?: number;
}> = ({
    src,
    alt,
    width,
    height,
    className = '',
    loading = 'lazy',
    priority = 'low',
    fallback = '',
    sizes,
    quality
}) => {
    const {
        src: optimizedSrc,
        ref,
        isLoading,
        error,
        onLoad,
        onError,
        className: imageClassName
    } = useOptimizedImage(src, alt, {
        width,
        height,
        priority,
        className,
        loading,
        fallback,
        quality
    });

    if (!optimizedSrc) return null;

    return (
        <div className="relative">
            {/* Loading skeleton */}
            {isLoading && (
                <div 
                    className="absolute inset-0 bg-gray-200 animate-pulse rounded"
                    style={{ width, height }}
                />
            )}
            
            {/* Error state */}
            {error && (
                <div 
                    className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-sm rounded"
                    style={{ width, height }}
                >
                    <span>Bild konnte nicht geladen werden</span>
                </div>
            )}
            
            <img
                ref={ref}
                src={optimizedSrc}
                alt={alt}
                width={width}
                height={height}
                loading={loading}
                sizes={sizes}
                onLoad={onLoad}
                onError={onError}
                className={imageClassName}
                decoding="async"
            />
        </div>
    );
};

// Hero Image Optimizer Component
export const HeroOptimizedImage: React.FC<{
    src: string;
    alt: string;
    className?: string;
    children?: React.ReactNode;
}> = ({ src, alt, className = '', children }) => {
    const imageService = ImageOptimizationService.getInstance();
    const { srcSet, sizes } = imageService.generateResponsiveSources(src);
    const bestFormat = imageService.getBestFormat();
    const optimizedSrc = imageService.generateOptimizedUrl(src, undefined, undefined, bestFormat);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <OptimizedImage
                src={optimizedSrc}
                alt={alt}
                srcSet={srcSet}
                sizes={sizes}
                priority="high"
                loading="eager"
                className="w-full h-full object-cover"
            />
            {children}
        </div>
    );
};

// Image Gallery Optimizer
export const OptimizedImageGallery: React.FC<{
    images: Array<{
        src: string;
        alt: string;
        width?: number;
        height?: number;
    }>;
    className?: string;
    columns?: number;
}> = ({ images, className = '', columns = 3 }) => {
    const imageService = ImageOptimizationService.getInstance();

    return (
        <div className={`grid gap-4 ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {images.map((image, index) => (
                <div key={index} className="relative group">
                    <OptimizedImage
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        priority={index < 3 ? 'high' : 'low'}
                        className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            ))}
        </div>
    );
};

// Preload critical images hook
export function usePreloadCriticalImages(urls: string[]) {
    const imageService = ImageOptimizationService.getInstance();

    useEffect(() => {
        imageService.preloadHeroImages(urls);
    }, [urls]);
}

// Image optimization utilities
export const imageUtils = {
    // Generate blur placeholder
    generateBlurPlaceholder: (src: string): string => {
        return `${src}?blur=10&quality=1`;
    },

    // Check WebP support
    supportsWebP: (): boolean => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    },

    // Get optimal format
    getOptimalFormat: (): 'webp' | 'jpg' | 'png' => {
        if (imageUtils.supportsWebP()) return 'webp';
        return 'jpg';
    },

    // Calculate optimal dimensions
    calculateOptimalDimensions: (
        originalWidth: number,
        originalHeight: number,
        targetWidth?: number,
        targetHeight?: number,
        aspectRatio?: number
    ): { width: number; height: number } => {
        if (targetWidth && targetHeight) {
            return { width: targetWidth, height: targetHeight };
        }

        if (aspectRatio) {
            const height = targetWidth ? targetWidth / aspectRatio : originalHeight;
            const width = targetWidth || height * aspectRatio;
            return { width: Math.round(width), height: Math.round(height) };
        }

        return { width: originalWidth, height: originalHeight };
    }
};

// CSS for image loading animations
export const imageStyles = `
    .optimized-image {
        transition: opacity 0.3s ease-in-out;
    }
    
    .optimized-image.loading {
        opacity: 0;
    }
    
    .optimized-image.loaded {
        opacity: 1;
    }
    
    .image-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
`;

export default ImageOptimizationService;