/**
 * ZOE SOLAR - Skeleton Loader Component
 * Rekonstruiert aus Chat-Verlauf - Vollständige Implementierung
 * 
 * Features:
 * - CSS-based Skeleton Loading
 * - Multiple Skeleton Types (Card, Text, Image, List, etc.)
 * - Responsive Design
 * - Accessibility Support
 * - Customizable Themes
 * - Performance Optimized
 */

import React from 'react';
import { cn } from '../utils/classNameUtils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'title' | 'card' | 'image' | 'button' | 'avatar' | 'list' | 'table';
  count?: number;
  height?: string | number;
  width?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animation?: 'pulse' | 'wave' | 'none';
  theme?: 'light' | 'dark' | 'auto';
  children?: React.ReactNode;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  variant = 'text',
  count = 1,
  height,
  width,
  rounded = 'md',
  animation = 'pulse',
  theme = 'auto',
  children,
  ...props
}) => {
  // Base skeleton styles
  const baseStyles = {
    backgroundColor: theme === 'dark' ? '#374151' : 
                    theme === 'light' ? '#E5E7EB' :
                    'var(--skeleton-base, #E5E7EB)',
    display: 'inline-block',
    borderRadius: rounded === 'none' ? '0' :
                 rounded === 'sm' ? '0.125rem' :
                 rounded === 'md' ? '0.375rem' :
                 rounded === 'lg' ? '0.5rem' :
                 rounded === 'xl' ? '0.75rem' :
                 '9999px',
    animation: animation === 'pulse' ? 'skeleton-pulse 1.5s ease-in-out infinite' :
               animation === 'wave' ? 'skeleton-wave 1.5s ease-in-out infinite' :
               'none'
  };

  // Variant-specific styles
  const variantStyles = {
    text: {
      height: '1em',
      width: '100%',
      marginBottom: '0.5em'
    },
    title: {
      height: '2rem',
      width: '75%',
      marginBottom: '1rem'
    },
    card: {
      height: '200px',
      width: '100%',
      borderRadius: '0.5rem'
    },
    image: {
      height: '100%',
      width: '100%',
      aspectRatio: '1/1',
      borderRadius: '0.5rem'
    },
    button: {
      height: '2.5rem',
      width: 'auto',
      minWidth: '6rem',
      borderRadius: '0.375rem'
    },
    avatar: {
      height: '2.5rem',
      width: '2.5rem',
      borderRadius: '50%'
    },
    list: {
      height: '1.25rem',
      width: '100%',
      marginBottom: '0.75rem'
    },
    table: {
      height: '2rem',
      width: '100%',
      marginBottom: '0.5rem'
    }
  };

  // Custom dimensions override variant defaults
  const customStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    height: height || baseStyles.height,
    width: width || baseStyles.width
  };

  // Clean up undefined values
  Object.keys(customStyles).forEach(key => {
    if (customStyles[key] === undefined) {
      delete customStyles[key];
    }
  });

  if (children) {
    return (
      <div className={cn('relative overflow-hidden', className)} {...props}>
        {children}
        <div 
          className="absolute inset-0 bg-current opacity-0 animate-pulse"
          style={{ animation: 'skeleton-overlay 0.6s ease-in-out infinite' }}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={cn('skeleton-loader', className)}
          style={customStyles}
          role="status"
          aria-label="Lade Inhalt..."
          {...props}
        />
      ))}
    </>
  );
};

// Text Skeleton
export const TextSkeleton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="text" {...props} />
);

// Title Skeleton
export const TitleSkeleton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="title" {...props} />
);

// Card Skeleton
export const CardSkeleton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="card" {...props} />
);

// Image Skeleton
export const ImageSkeleton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="image" {...props} />
);

// Button Skeleton
export const ButtonSkeleton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="button" {...props} />
);

// Avatar Skeleton
export const AvatarSkeleton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="avatar" {...props} />
);

// List Skeleton
export const ListSkeleton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="list" {...props} />
);

// Table Skeleton
export const TableSkeleton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="table" {...props} />
);

// Compound Components for common UI patterns

// Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
    <ImageSkeleton className="aspect-video" />
    
    <div className="space-y-2">
      <TitleSkeleton height="1.5rem" />
      <TextSkeleton count={2} />
    </div>
    
    <div className="flex items-center justify-between">
      <TextSkeleton width="60%" />
      <ButtonSkeleton width="80px" />
    </div>
  </div>
);

// News Card Skeleton
export const NewsCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
    <div className="flex space-x-4">
      <ImageSkeleton width="120px" height="80px" className="flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <TitleSkeleton />
        <TextSkeleton count={2} />
        <div className="flex items-center space-x-2">
          <AvatarSkeleton />
          <TextSkeleton width="40%" />
        </div>
      </div>
    </div>
  </div>
);

// Profile Skeleton
export const ProfileSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
    <div className="flex items-center space-x-4">
      <AvatarSkeleton width="64px" height="64px" />
      <div className="space-y-2">
        <TitleSkeleton width="60%" />
        <TextSkeleton width="40%" />
      </div>
    </div>
    
    <div className="space-y-3">
      <TitleSkeleton />
      <TextSkeleton count={3} />
    </div>
    
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <TextSkeleton width="60%" className="mx-auto mb-1" />
        <TextSkeleton width="80%" className="mx-auto" />
      </div>
      <div className="text-center">
        <TextSkeleton width="60%" className="mx-auto mb-1" />
        <TextSkeleton width="80%" className="mx-auto" />
      </div>
      <div className="text-center">
        <TextSkeleton width="60%" className="mx-auto mb-1" />
        <TextSkeleton width="80%" className="mx-auto" />
      </div>
    </div>
  </div>
);

// Dashboard Skeleton
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <TitleSkeleton width="30%" />
      <div className="flex space-x-2">
        <ButtonSkeleton width="100px" />
        <ButtonSkeleton width="100px" />
      </div>
    </div>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }, (_, i) => (
        <CardSkeleton key={i} height="120px" />
      ))}
    </div>
    
    {/* Chart */}
    <CardSkeleton height="300px" />
    
    {/* Recent Items */}
    <div className="space-y-4">
      <TitleSkeleton />
      {Array.from({ length: 3 }, (_, i) => (
        <ListSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Table Skeleton
export const DataTableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }, (_, i) => (
        <TextSkeleton key={i} />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }, (_, colIndex) => (
          <ListSkeleton key={`${rowIndex}-${colIndex}`} />
        ))}
      </div>
    ))}
  </div>
);

// List Skeleton with icons
export const MenuListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: items }, (_, i) => (
      <div key={i} className="flex items-center space-x-3">
        <TextSkeleton width="20px" height="20px" rounded="sm" />
        <TextSkeleton />
      </div>
    ))}
  </div>
);

// Form Skeleton
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => (
  <div className="space-y-6">
    {Array.from({ length: fields }, (_, i) => (
      <div key={i} className="space-y-2">
        <TextSkeleton width="30%" />
        <TextSkeleton height="40px" />
      </div>
    ))}
    <div className="flex space-x-3">
      <ButtonSkeleton width="100px" />
      <ButtonSkeleton width="100px" />
    </div>
  </div>
);

// Hero Section Skeleton
export const HeroSkeleton: React.FC = () => (
  <div className="space-y-8">
    <div className="text-center space-y-4">
      <TitleSkeleton width="60%" className="mx-auto" />
      <TextSkeleton count={3} className="mx-auto" />
      <div className="flex justify-center space-x-4">
        <ButtonSkeleton width="150px" />
        <ButtonSkeleton width="150px" />
      </div>
    </div>
    
    <ImageSkeleton height="400px" className="mx-auto" />
  </div>
);

// Gallery Skeleton
export const GallerySkeleton: React.FC<{ items?: number }> = ({ items = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: items }, (_, i) => (
      <CardSkeleton key={i} height="200px" />
    ))}
  </div>
);

// Timeline Skeleton
export const TimelineSkeleton: React.FC<{ items?: number }> = ({ items = 4 }) => (
  <div className="space-y-6">
    {Array.from({ length: items }, (_, i) => (
      <div key={i} className="flex space-x-4">
        <div className="flex flex-col items-center">
          <AvatarSkeleton />
          {i < items - 1 && <div className="w-px h-8 bg-gray-300 mt-2" />}
        </div>
        <div className="flex-1 space-y-2">
          <TitleSkeleton width="40%" />
          <TextSkeleton count={2} />
        </div>
      </div>
    ))}
  </div>
);

// Skeleton Group for complex layouts
export const SkeletonGroup: React.FC<{
  layout: 'cards' | 'list' | 'table' | 'profile' | 'dashboard';
  count?: number;
}> = ({ layout, count = 1 }) => {
  const components = {
    cards: ProductCardSkeleton,
    list: ListSkeleton,
    table: DataTableSkeleton,
    profile: ProfileSkeleton,
    dashboard: DashboardSkeleton
  };

  const Component = components[layout];
  
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Component key={i} />
      ))}
    </>
  );
};

// Loading State Wrapper
interface LoadingWrapperProps {
  isLoading: boolean;
  skeleton?: React.ReactNode;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  isLoading,
  skeleton,
  children,
  fallback = <TextSkeleton />
}) => {
  if (isLoading) {
    return skeleton || fallback;
  }
  
  return <>{children}</>;
};

// Skeleton CSS Styles (to be included in global CSS)
export const skeletonStyles = `
  @keyframes skeleton-pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  
  @keyframes skeleton-wave {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
  
  @keyframes skeleton-overlay {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.1;
    }
    100% {
      opacity: 0;
    }
  }
  
  .skeleton-loader {
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    background-size: 200px 100%;
    background-repeat: no-repeat;
    animation: skeleton-wave 1.5s ease-in-out infinite;
  }
  
  [data-theme="dark"] .skeleton-loader {
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
  }
`;

// Theme-aware Skeleton Loader
export const AdaptiveSkeletonLoader: React.FC<Omit<SkeletonLoaderProps, 'theme'>> = (props) => {
  const isDark = document.documentElement.classList.contains('dark') || 
                 window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  return (
    <SkeletonLoader 
      {...props} 
      theme={isDark ? 'dark' : 'light'} 
    />
  );
};

// Skeleton utilities for common patterns
export const createSkeletonSequence = (patterns: Array<{ 
  type: keyof typeof variantStyles; 
  count?: number; 
  delay?: number 
}>) => (
  <div className="space-y-2">
    {patterns.map((pattern, index) => (
      <SkeletonLoader
        key={index}
        variant={pattern.type}
        count={pattern.count || 1}
        style={{
          animationDelay: pattern.delay ? `${pattern.delay}ms` : undefined
        }}
      />
    ))}
  </div>
);

export default SkeletonLoader;