import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, motionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../utils/cn';
import {
  useMouseTracking,
  useMagneticEffect,
  use3DCardEffect,
  buttonVariants,
  cardVariants,
} from '../hooks/useMicroInteractions';

interface MicroInteractionWrapperProps {
  children: React.ReactNode;
  variant?: 'button' | 'card' | 'magnetic' | '3d-card' | 'hover-lift' | 'glow';
  intensity?: 'subtle' | 'normal' | 'strong';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  [key: string]: any;
}

const MicroInteractionWrapper: React.FC<MicroInteractionWrapperProps> = ({
  children,
  variant = 'button',
  intensity = 'normal',
  disabled = false,
  className = '',
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Get interaction parameters based on intensity
  const getInteractionParams = () => {
    switch (intensity) {
      case 'subtle':
        return { strength: 0.2, scale: 1.02, duration: 0.2 };
      case 'strong':
        return { strength: 0.5, scale: 1.1, duration: 0.4 };
      default:
        return { strength: 0.3, scale: 1.05, duration: 0.3 };
    }
  };

  const params = getInteractionParams();

  // Select appropriate hook based on variant
  let interactionStyles = {};

  switch (variant) {
    case 'magnetic':
      const { x: magX, y: magY } = useMagneticEffect(ref, params.strength);
      interactionStyles = {
        x: magX,
        y: magY,
      };
      break;

    case '3d-card':
      const { rotateX, rotateY, scale: scale3d } = use3DCardEffect(ref);
      interactionStyles = {
        rotateX,
        rotateY,
        scale: scale3d,
        style: { transformStyle: 'preserve-3d' as const },
      };
      break;

    case 'hover-lift':
      const y = useMotionValue(0);
      interactionStyles = {
        y,
        whileHover: { y: -8, scale: params.scale },
        whileTap: { scale: params.scale * 0.95 },
      };
      break;

    case 'glow':
      const glowOpacity = useMotionValue(0);
      interactionStyles = {
        whileHover: { glowOpacity: 1 },
        style: { '--glow-opacity': glowOpacity } as React.CSSProperties,
      };
      break;

    default:
      interactionStyles = {};
  }

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
      onMouseEnter?.();
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setIsHovered(false);
      onMouseLeave?.();
    }
  };

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
    }
  };

  // Get animation variants based on variant
  const getVariants = () => {
    switch (variant) {
      case 'button':
        return buttonVariants;
      case 'card':
      case '3d-card':
        return cardVariants;
      default:
        return {};
    }
  };

  // Get specific classes for variant
  const getVariantClasses = () => {
    switch (variant) {
      case 'glow':
        return 'relative overflow-hidden';
      case '3d-card':
        return 'preserve-3d';
      default:
        return '';
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        'cursor-pointer transition-all duration-300',
        getVariantClasses(),
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      variants={getVariants()}
      initial="idle"
      animate={isHovered ? 'hover' : 'idle'}
      whileTap="tap"
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...interactionStyles}
      {...props}
    >
      {/* Glow effect overlay */}
      {variant === 'glow' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 opacity-20 rounded-lg blur-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Ripple effect */}
      <AnimatePresence>
        {isHovered && variant === 'button' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {children}
    </motion.div>
  );
};

// Specialized interaction components

export const MagneticButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}> = ({ children, onClick, className = '', variant = 'primary' }) => {
  const baseClasses = {
    primary: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-slate-800 border border-slate-200 shadow-md hover:shadow-lg',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  };

  return (
    <MicroInteractionWrapper
      variant="magnetic"
      className={cn(
        'px-6 py-3 rounded-lg font-semibold transition-all duration-300',
        baseClasses[variant],
        className
      )}
      onClick={onClick}
    >
      {children}
    </MicroInteractionWrapper>
  );
};

export const InteractiveCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
  onClick?: () => void;
}> = ({ children, className = '', featured = false, onClick }) => {
  return (
    <MicroInteractionWrapper
      variant="3d-card"
      intensity="normal"
      className={cn(
        'bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-2xl p-6',
        featured && 'ring-2 ring-green-500 ring-offset-2',
        className
      )}
      onClick={onClick}
    >
      {children}
    </MicroInteractionWrapper>
  );
};

export const FloatingElement: React.FC<{
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  className?: string;
}> = ({ children, amplitude = 10, duration = 3, className = '' }) => {
  const y = useMotionValue(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      y.set(Math.sin(time * 2 * Math.PI / duration) * amplitude);
    }, 16);

    return () => clearInterval(interval);
  }, [amplitude, duration, y]);

  return (
    <motion.div
      style={{ y }}
      className={cn('transition-transform duration-300', className)}
    >
      {children}
    </motion.div>
  );
};

export const PulseElement: React.FC<{
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}> = ({ children, scale = 1.1, duration = 2, className = '' }) => {
  const scaleValue = useMotionValue(1);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      const newScale = 1 + (Math.sin(time * 2 * Math.PI / duration) * (scale - 1)) / 2;
      scaleValue.set(newScale);
    }, 16);

    return () => clearInterval(interval);
  }, [scale, duration, scaleValue]);

  return (
    <motion.div
      style={{ scale: scaleValue }}
      className={cn('transition-transform duration-300', className)}
    >
      {children}
    </motion.div>
  );
};

export const TextReveal: React.FC<{
  children: string;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const words = children.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export const ShimmerEffect: React.FC<{
  className?: string;
  width?: string | number;
  height?: string | number;
}> = ({ className = '', width = '100%', height = '1rem' }) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-slate-200 rounded',
        className
      )}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-50"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

export default MicroInteractionWrapper;