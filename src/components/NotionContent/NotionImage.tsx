import React, { useState } from 'react'

interface NotionImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: boolean
}

export function NotionImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false
}: NotionImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className={`notion-image-error bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center ${className}`}
           style={{ width: width || '100%', height: height || '200px' }}>
        <div className="text-center p-4">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-500">Bild nicht verfügbar</p>
        </div>
      </div>
    )
  }

  // Optimierung für Notion CDN
  const optimizedSrc = src.includes('notion.so') || src.includes('aws.work')
    ? `${src}?width=${Math.min(width || 1200, 1200)}&quality=85`
    : src

  return (
    <div className={`notion-image-wrapper relative ${className}`}>
      {/* Loading Placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`
          notion-image transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          ${priority ? 'z-10' : ''}
        `}
        loading={priority ? 'eager' : loading}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* SEO and Accessibility */}
      {priority && (
        <link rel="preload" as="image" href={optimizedSrc} />
      )}
    </div>
  )
}

// Specialized component for hero images
export function NotionHeroImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <NotionImage
      src={src}
      alt={alt}
      className={`w-full h-auto object-cover ${className}`}
      priority={true}
      loading="eager"
    />
  )
}

// Specialized component for gallery images
export function NotionGalleryImage({ src, alt, onClick }: { src: string; alt: string; onClick?: () => void }) {
  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      <NotionImage
        src={src}
        alt={alt}
        className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
        <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      </div>
    </div>
  )
}