import React from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from '../ImageWithFallback';
import { CardVariant, CardSize } from './BaseCard';

// Card Header Component
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
  size?: CardSize;
  featured?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  variant,
  size,
  featured
}) => {
  const sizeClasses: Record<CardSize, string> = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <header className={`
      mb-4 font-bold text-slate-800
      ${sizeClasses[size || 'md']}
      ${featured ? 'text-green-700' : ''}
      ${className}
    `}>
      {children}
    </header>
  );
};

// Card Title Component
export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
  size?: CardSize;
  featured?: boolean;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
  variant,
  size,
  featured
}) => {
  const sizeClasses: Record<CardSize, string> = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <h3 className={`
      font-bold text-slate-900 mb-2
      ${sizeClasses[size || 'md']}
      ${featured ? 'text-green-700' : ''}
      ${className}
    `}>
      {children}
    </h3>
  );
};

// Card Subtitle Component
export interface CardSubtitleProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
  featured?: boolean;
}

export const CardSubtitle: React.FC<CardSubtitleProps> = ({
  children,
  className = '',
  variant,
  featured
}) => {
  const variantColors: Record<CardVariant, string> = {
    default: featured ? 'text-green-600' : 'text-slate-600',
    featured: 'text-green-600',
    promotional: 'text-orange-600',
    comparison: 'text-blue-600',
    product: 'text-slate-600',
    testimonial: 'text-slate-700',
  };

  return (
    <p className={`
      font-semibold text-sm mb-3
      ${variantColors[variant || 'default']}
      ${className}
    `}>
      {children}
    </p>
  );
};

// Card Content Component
export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  variant
}) => {
  const variantColors: Record<CardVariant, string> = {
    default: 'text-slate-600',
    featured: 'text-slate-700',
    promotional: 'text-slate-700',
    comparison: 'text-slate-600',
    product: 'text-slate-600',
    testimonial: 'text-slate-600 italic',
  };

  return (
    <div className={`
      text-slate-600 leading-relaxed flex-grow
      ${variantColors[variant || 'default']}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Card Image Component
export interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  variant?: CardVariant;
  featured?: boolean;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
  fallbackText?: string;
}

export const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  className = '',
  variant,
  featured,
  aspectRatio = 'landscape',
  fallbackText
}) => {
  const aspectRatioClasses: Record<string, string> = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[16/9]',
  };

  return (
    <div className={`
      relative w-full mb-4 overflow-hidden rounded-xl
      ${aspectRatioClasses[aspectRatio]}
      ${className}
    `}>
      <ImageWithFallback
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        fallbackText={fallbackText || alt.substring(0, 2).toUpperCase()}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />

      {/* Featured Badge Overlay */}
      {featured && (
        <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Featured
        </div>
      )}
    </div>
  );
};

// Card Footer Component
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  variant
}) => {
  return (
    <footer className={`
      mt-6 pt-4 border-t border-slate-200
      ${variant === 'promotional' ? 'border-orange-200' : ''}
      ${variant === 'featured' ? 'border-green-200' : ''}
      ${variant === 'comparison' ? 'border-blue-200' : ''}
      ${className}
    `}>
      {children}
    </footer>
  );
};

// Card Actions Component (for buttons and CTAs)
export interface CardActionsProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
  align?: 'left' | 'center' | 'right' | 'space-between';
}

export const CardActions: React.FC<CardActionsProps> = ({
  children,
  className = '',
  variant,
  align = 'left'
}) => {
  const alignClasses: Record<string, string> = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    'space-between': 'justify-between',
  };

  return (
    <div className={`
      flex gap-3 items-center
      ${alignClasses[align]}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Card Badge Component
export interface CardBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CardBadge: React.FC<CardBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const variantClasses: Record<string, string> = {
    default: 'bg-slate-100 text-slate-700 border-slate-300',
    success: 'bg-green-100 text-green-700 border-green-300',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    error: 'bg-red-100 text-red-700 border-red-300',
    info: 'bg-blue-100 text-blue-700 border-blue-300',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span className={`
      inline-flex items-center font-semibold rounded-full border
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className}
    `}>
      {children}
    </span>
  );
};

// Card Stats Component (for metrics and numbers)
export interface CardStatsProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export const CardStats: React.FC<CardStatsProps> = ({
  children,
  className = '',
  columns = 2
}) => {
  const gridClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={`
      grid gap-4 mb-4
      ${gridClasses[columns]}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Card Stat Item Component
export interface CardStatItemProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const CardStatItem: React.FC<CardStatItemProps> = ({
  label,
  value,
  unit,
  trend,
  className = ''
}) => {
  const trendColors: Record<string, string> = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-slate-600',
  };

  const trendIcons: Record<string, React.ReactNode> = {
    up: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    down: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
    neutral: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" /></svg>,
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="text-2xl font-bold text-slate-900">
        {value}
        {unit && <span className="text-sm font-normal text-slate-600 ml-1">{unit}</span>}
      </div>
      <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">{label}</div>
      {trend && (
        <div className={`flex items-center justify-center mt-1 ${trendColors[trend]}`}>
          {trendIcons[trend]}
        </div>
      )}
    </div>
  );
};