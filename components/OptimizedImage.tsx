import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  // Must provide alt text for fallback generation
  alt: string;
  // Provide dimensions for correct aspect ratio
  imgWidth?: number;
  imgHeight?: number;
  // Enable WebP optimization
  enableWebP?: boolean;
  // Enable lazy loading
  lazy?: boolean;
  // Quality for WebP conversion
  quality?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  imgWidth, 
  imgHeight, 
  enableWebP = true,
  lazy = true,
  quality = 80,
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(lazy ? undefined : src);
  const [isLoading, setIsLoading] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const hasTriedFallback = useRef(false);
  const ai = useRef<GoogleGenAI | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setImgSrc(src);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before element is visible
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, isInView, src]);

  // WebP conversion function
  const convertToWebP = useCallback(async (imageSrc: string): Promise<string> => {
    if (!enableWebP || !imageSrc || imageSrc.startsWith('data:')) {
      return imageSrc;
    }

    try {
      // Check if browser supports WebP
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx || !canvas.toDataURL('image/webp').startsWith('data:image/webp')) {
        return imageSrc;
      }

      // Load original image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
          
          // Convert to WebP with specified quality
          const webpSrc = canvas.toDataURL('image/webp', quality / 100);
          resolve(webpSrc.startsWith('data:image/webp') ? webpSrc : imageSrc);
        };
        
        img.onerror = () => resolve(imageSrc);
        img.src = imageSrc;
      });
    } catch (error) {
      console.warn('WebP conversion failed:', error);
      return imageSrc;
    }
  }, [enableWebP, quality]);

  const getAspectRatio = (width?: number, height?: number): "1:1" | "4:3" | "3:4" | "16:9" | "9:16" => {
    if (!width || !height || width === 0 || height === 0) return '1:1';
    const ratio = width / height;
    const ratios: Record<"1:1" | "4:3" | "3:4" | "16:9" | "9:16", number> = {
      '1:1': 1,
      '4:3': 4/3,
      '3:4': 3/4,
      '16:9': 16/9,
      '9:16': 9/16,
    };
    
    const closest = (Object.keys(ratios) as Array<keyof typeof ratios>).reduce((a, b) => {
      return Math.abs(ratios[b] - ratio) < Math.abs(ratios[a] - ratio) ? b : a;
    });
    return closest;
  };

  const handleError = async () => {
    if (hasTriedFallback.current || !ai.current || !alt) return;
    hasTriedFallback.current = true;
    setIsLoading(true);
    console.log(`Image failed to load: ${src}. Generating fallback for: ${alt}`);

    try {
      const aspectRatio = getAspectRatio(imgWidth, imgHeight);
      
      const response = await ai.current.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Photorealistic image of: ${alt}. For a professional corporate website about solar energy. High quality, clean, modern aesthetic. Aspect ratio ${aspectRatio}.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        },
      });

      if (response && response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        
        // Convert to WebP if enabled
        const optimizedUrl = await convertToWebP(imageUrl);
        setImgSrc(optimizedUrl);
      } else {
        throw new Error("API returned no images or image data was missing.");
      }
    } catch (error) {
      console.error('Error generating fallback image:', error);
      // Fallback to a placeholder if Gemini fails
      setImgSrc(`https://via.placeholder.com/${imgWidth || 400}x${imgHeight || 300}.png?text=Bild+nicht+gefunden`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async () => {
    if (imgSrc && enableWebP && !imgSrc.startsWith('data:image/webp')) {
      try {
        const webpSrc = await convertToWebP(imgSrc);
        if (webpSrc !== imgSrc) {
          setImgSrc(webpSrc);
        }
      } catch (error) {
        console.warn('Post-load WebP conversion failed:', error);
      }
    }
  };
  
  useEffect(() => {
    // Reset state if the src prop changes
    if (src !== imgSrc) {
      setImgSrc(lazy && !isInView ? undefined : src);
      hasTriedFallback.current = false;
    }
  }, [src, lazy, isInView]);

  if (isLoading) {
    return (
      <div 
        ref={imgRef}
        className={`w-full h-full bg-slate-200 animate-pulse ${props.className}`}
        style={{ width: imgWidth, height: imgHeight }}
      />
    );
  }

  if (lazy && !isInView) {
    return (
      <div 
        ref={imgRef}
        className={`w-full h-full bg-slate-100 ${props.className}`}
        style={{ width: imgWidth, height: imgHeight }}
        title={`Loading image: ${alt}`}
      />
    );
  }

  return (
    <img 
      ref={imgRef}
      src={imgSrc} 
      alt={alt} 
      onError={handleError}
      onLoad={handleLoad}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      {...props} 
    />
  );
};

export default OptimizedImage;