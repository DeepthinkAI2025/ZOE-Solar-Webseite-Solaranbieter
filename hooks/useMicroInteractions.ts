import { useCallback, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Mouse tracking hook for interactive elements
export const useMouseTracking = (ref: React.RefObject<HTMLElement>) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      x.set(mouseX);
      y.set(mouseY);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, x, y]);

  return { x, y };
};

// Parallax effect hook
export const useParallax = (ref: React.RefObject<HTMLElement>, speed: number = 0.5) => {
  const y = useMotionValue(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;

      y.set(rate);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, speed, y]);

  return y;
};

// Magnetic button effect
export const useMagneticEffect = (ref: React.RefObject<HTMLElement>, strength: number = 0.3) => {
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      x.set(deltaX);
      y.set(deltaY);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, strength, x, y]);

  return { x, y };
};

// Scroll trigger animations
export const useScrollTrigger = (
  ref: React.RefObject<HTMLElement>,
  options: {
    threshold?: number;
    rootMargin?: string;
    onIntersect?: (isIntersecting: boolean) => void;
  } = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const { threshold = 0.1, rootMargin = '0px', onIntersect } = options;
  const controls = useAnimation();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = entry.isIntersecting;
        setIsIntersecting(intersecting);
        onIntersect?.(intersecting);

        if (intersecting) {
          controls.start('visible');
        } else {
          controls.start('hidden');
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, onIntersect, controls]);

  return { isIntersecting, controls };
};

// Stagger animation for list items
export const useStaggerAnimation = (itemCount: number, staggerDelay: number = 0.1) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
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

  return {
    containerVariants,
    itemVariants,
  };
};

// Floating animation
export const useFloatingAnimation = (amplitude: number = 10, duration: number = 3) => {
  const y = useMotionValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      const newY = Math.sin(time * 2 * Math.PI / duration) * amplitude;
      y.set(newY);
    }, 16); // 60fps

    return () => clearInterval(interval);
  }, [amplitude, duration, y]);

  return y;
};

// Pulse animation
export const usePulseAnimation = (scale: number = 1.05, duration: number = 2) => {
  const scaleValue = useMotionValue(1);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      const newScale = 1 + (Math.sin(time * 2 * Math.PI / duration) * (scale - 1)) / 2;
      scaleValue.set(newScale);
    }, 16);

    return () => clearInterval(interval);
  }, [scale, duration, scaleValue]);

  return scaleValue;
};

// Typewriter effect
export const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayText('');
    setIsComplete(false);

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(prev => prev + text[index]);
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};

// Loading animation with progress
export const useLoadingAnimation = (duration: number = 2000) => {
  const progress = useMotionValue(0);

  useEffect(() => {
    const timer = setInterval(() => {
      progress.set(p => Math.min(p + 1, 100));
    }, duration / 100);

    return () => clearInterval(timer);
  }, [duration, progress]);

  return progress;
};

// Magnetic card 3D effect
export const use3DCardEffect = (ref: React.RefObject<HTMLElement>) => {
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = (e.clientX - centerX) / (rect.width / 2);
      const mouseY = (e.clientY - centerY) / (rect.height / 2);

      rotateY.set(mouseX * 15);
      rotateX.set(-mouseY * 15);
      scale.set(1.05);
    };

    const handleMouseLeave = () => {
      rotateX.set(0);
      rotateY.set(0);
      scale.set(1);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, rotateX, rotateY, scale]);

  return { rotateX, rotateY, scale };
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    type: 'spring',
    damping: 25,
    stiffness: 400,
    duration: 0.3,
  },
};

// Modal transition animations
export const modalTransition = {
  initial: { opacity: 0, scale: 0.9, y: -50 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 50 },
  transition: {
    type: 'spring',
    damping: 20,
    stiffness: 300,
  },
};

// Drawer/slide panel animations
export const drawerTransition = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: {
    type: 'spring',
    damping: 25,
    stiffness: 400,
  },
};

// Enhanced button animations
export const buttonVariants = {
  idle: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.05,
    rotate: [0, -1, 1, 0],
    transition: { duration: 0.3 }
  },
  tap: { scale: 0.95 },
  disabled: { scale: 1, opacity: 0.5 },
};

// Card hover animations
export const cardVariants = {
  idle: {
    scale: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
  },
  hover: {
    scale: 1.02,
    y: -8,
    rotateX: 2,
    rotateY: 2,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
    }
  },
  tap: { scale: 0.98 },
};

// Loading skeleton animation
export const skeletonVariants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

// Text reveal animation
export const textRevealVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: 'spring',
      damping: 20,
      stiffness: 300,
    },
  }),
};

// Scale and fade animation
export const scaleFadeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
    },
  },
};

// Bounce animation for notifications
export const bounceVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 10,
      stiffness: 400,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Slide and fade animation
export const slideFadeVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 400,
    },
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: { duration: 0.2 },
  },
};

export default {
  useMouseTracking,
  useParallax,
  useMagneticEffect,
  useScrollTrigger,
  useStaggerAnimation,
  useFloatingAnimation,
  usePulseAnimation,
  useTypewriter,
  useLoadingAnimation,
  use3DCardEffect,
  pageTransition,
  modalTransition,
  drawerTransition,
  buttonVariants,
  cardVariants,
  skeletonVariants,
  textRevealVariants,
  scaleFadeVariants,
  bounceVariants,
  slideFadeVariants,
};