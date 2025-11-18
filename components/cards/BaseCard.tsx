import React, { forwardRef, Children, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

// Card variants for different use cases
export type CardVariant =
  | 'default'
  | 'featured'
  | 'promotional'
  | 'comparison'
  | 'product'
  | 'testimonial';

// Card sizes for responsive design
export type CardSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

export interface BaseCardProps {
  children: ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  hover?: boolean;
  interactive?: boolean;
  featured?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  testId?: string;
  ariaLabel?: string;
}

// Size configurations
const sizeClasses: Record<CardSize, string> = {
  sm: 'p-4 text-sm',
  md: 'p-6 text-base',
  lg: 'p-8 text-lg',
  xl: 'p-10 text-xl',
};

// Variant configurations
const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white border-slate-200',
  featured: 'bg-gradient-to-br from-white to-green-50 border-green-400 shadow-lg',
  promotional: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400',
  comparison: 'bg-white border-blue-200',
  product: 'bg-white border-slate-200',
  testimonial: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300',
};

const BaseCard = forwardRef<HTMLDivElement, BaseCardProps>(({
  children,
  variant = 'default',
  size = 'md',
  hover = true,
  interactive = false,
  featured = false,
  className,
  onClick,
  disabled = false,
  testId,
  ariaLabel,
  ...props
}, ref) => {
  const Component = interactive || onClick ? motion.button : motion.div;

  const cardClasses = cn(
    // Base styles
    'relative w-full rounded-2xl border transition-all duration-300',
    'backdrop-blur-sm',

    // Size classes
    sizeClasses[size],

    // Variant classes
    variantClasses[variant],

    // Featured enhancements
    featured && [
      'ring-2 ring-green-400 ring-offset-2',
      'shadow-2xl',
    ],

    // Hover effects
    hover && !disabled && [
      'hover:shadow-xl',
      'hover:scale-[1.02]',
      'hover:-translate-y-1',
      'cursor-pointer',
    ],

    // Disabled state
    disabled && [
      'opacity-50 cursor-not-allowed',
      'hover:scale-100 hover:translate-y-0',
    ],

    // Interactive states
    interactive && !disabled && [
      'active:scale-[0.98]',
      'active:shadow-md',
    ],

    className
  );

  const motionProps = onClick ? {
    whileHover: { scale: disabled ? 1 : 1.02, y: disabled ? 0 : -4 },
    whileTap: { scale: disabled ? 1 : 0.98 },
    transition: { type: 'spring', damping: 20, stiffness: 300 }
  } : {
    whileHover: { scale: disabled ? 1 : 1.02, y: disabled ? 0 : -4 },
    transition: { type: 'spring', damping: 25, stiffness: 400 }
  };

  return (
    <Component
      ref={ref}
      className={cardClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={testId}
      {...motionProps}
      {...props}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Top-Angebot
          </div>
        </div>
      )}

      {/* Gradient Overlay for depth */}
      {!disabled && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}

      <div className="relative z-10">
        {Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              variant,
              size,
              featured,
            });
          }
          return child;
        })}
      </div>
    </Component>
  );
});

BaseCard.displayName = 'BaseCard';

export default BaseCard;