import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

// ===== STATE-OF-THE-ART DESIGN SYSTEM COMPONENTS =====

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'colored';
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'light',
  hover = true
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  }, []);

  const getVariantClasses = () => {
    switch (variant) {
      case 'dark':
        return 'bg-slate-900/20 border-slate-700/30 text-white';
      case 'colored':
        return 'bg-green-500/10 border-green-500/20 text-green-100';
      default:
        return 'bg-white/10 border-white/20 text-white';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative overflow-hidden rounded-2xl backdrop-blur-md border
        transition-all duration-300 ${getVariantClasses()} ${className}
        ${hover ? 'hover:scale-105 hover:shadow-2xl' : ''}
      `}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: hover ? 1.02 : 1 }}
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%,
          rgba(255, 255, 255, 0.1) 0%, transparent 50%)`
      }}
    >
      {children}
    </motion.div>
  );
};

interface ParticleFieldProps {
  particleCount?: number;
  color?: string;
  size?: number;
  speed?: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  particleCount = 50,
  color = '#22c55e',
  size = 2,
  speed = 0.5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * size + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [particleCount, color, size, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

interface MorphingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const MorphingButton: React.FC<MorphingButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'ghost':
        return 'bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white';
      default:
        return 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={loading}
      className={`
        relative overflow-hidden rounded-xl font-semibold
        transition-all duration-300 transform
        ${getVariantClasses()} ${getSizeClasses()}
        ${loading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        animate={{ opacity: isHovered ? 0.2 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Loading...
          </>
        ) : (
          children
        )}
      </span>

      {/* Morphing border effect */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-white opacity-0"
        animate={{
          opacity: isHovered ? [0, 1, 0] : 0,
          scale: isHovered ? [1, 1.1, 1] : 1
        }}
        transition={{
          duration: 0.6,
          repeat: isHovered ? Infinity : 0
        }}
      />
    </motion.button>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  delay = 0,
  duration = 3,
  distance = 20
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -distance, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

interface ParallaxContainerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  speed = 0.5,
  className = ''
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={className}
      style={{
        transform: `translateY(${scrollY * speed}px)`
      }}
    >
      {children}
    </div>
  );
};

interface GradientTextProps {
  children: React.ReactNode;
  colors?: string[];
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  colors = ['#22c55e', '#16a34a', '#15803d'],
  className = ''
}) => {
  return (
    <span
      className={className}
      style={{
        background: `linear-gradient(135deg, ${colors.join(', ')})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}
    >
      {children}
    </span>
  );
};

interface GlitchEffectProps {
  children: React.ReactNode;
  trigger?: boolean;
}

export const GlitchEffect: React.FC<GlitchEffectProps> = ({
  children,
  trigger = false
}) => {
  return (
    <div className="relative inline-block">
      <motion.div
        animate={{
          x: trigger ? [-2, 2, -2, 0] : 0,
          color: trigger ? ['#ff0080', '#00ffff', '#ffff00', '#ffffff'] : '#ffffff'
        }}
        transition={{
          duration: 0.3,
          repeat: trigger ? 1 : 0
        }}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      >
        {children}
      </motion.div>

      <motion.div
        animate={{
          x: trigger ? [2, -2, 2, 0] : 0,
          color: trigger ? ['#00ffff', '#ff0080', '#ffff00', '#ffffff'] : '#ffffff'
        }}
        transition={{
          duration: 0.3,
          repeat: trigger ? 1 : 0
        }}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      >
        {children}
      </motion.div>

      <div>{children}</div>
    </div>
  );
};

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({
  children,
  className = ''
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative overflow-hidden rounded-2xl p-8
        ${className}
      `}
      onMouseMove={handleMouseMove}
      style={{
        background: `linear-gradient(135deg,
          hsl(${mousePosition.x}, 70%, 50%) 0%,
          hsl(${mousePosition.y}, 70%, 60%) 50%,
          hsl(${mousePosition.x + mousePosition.y}, 70%, 70%) 100%)`
      }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

interface LiquidButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  onClick,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden px-8 py-4 rounded-full
        bg-gradient-to-r from-purple-500 to-pink-500
        text-white font-semibold
        transition-all duration-300
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"
        animate={{
          x: isHovered ? ['0%', '100%'] : '0%',
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut"
        }}
      />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// All components are already exported individually above