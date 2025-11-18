import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fallbackText?: string;
  [key: string]: any;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/assets/logos/q-cells.png', // Use existing logo as fallback
  fallbackText,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImageSrc(src);
    setImageError(false);
    setIsLoading(true);
  }, [src]);

  const handleImageError = () => {
    console.warn(`Failed to load image: ${src}`);
    setImageError(true);
    setIsLoading(false);

    // Try alternative extensions for known logos
    if (imageSrc.includes('.png') && imageSrc.includes('/assets/logos/')) {
      const baseName = imageSrc.replace('.png', '');
      const alternatives = ['.jpg', '.jpeg', '.webp'];

      // Try specific known mappings first
      const knownMappings: { [key: string]: string } = {
        'suntech': '/assets/logos/suntech.jpg',
        'wallbox-chargers': '/assets/logos/wallbox.png',
        'q-cells': '/assets/logos/q-cells.png'
      };

      const baseLogoName = baseName.split('/').pop()?.toLowerCase() || '';
      if (knownMappings[baseLogoName]) {
        setImageSrc(knownMappings[baseLogoName]);
        setImageError(false);
        return;
      }

      // Try other extensions
      for (const ext of alternatives) {
        if (!imageSrc.includes(ext)) {
          const alternativeSrc = baseName + ext;
          setImageSrc(alternativeSrc);
          setImageError(false);
          return;
        }
      }
    }

    // Try fallback logo last
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setImageError(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  // If both primary and fallback fail, show placeholder
  if (imageError && imageSrc === fallbackSrc) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 text-gray-500 ${className}`}
        {...props}
      >
        {fallbackText ? (
          <span className="text-sm font-medium text-center px-2">
            {fallbackText}
          </span>
        ) : (
          <svg 
            className="w-8 h-8" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        )}
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`animate-pulse bg-gray-200 ${className}`} />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        {...props}
      />
    </>
  );
};

export default ImageWithFallback;