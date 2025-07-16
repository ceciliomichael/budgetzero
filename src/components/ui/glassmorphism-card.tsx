import React from 'react';
import { motion } from 'framer-motion';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'heavy';
  hoverEffect?: boolean;
  glowEffect?: boolean;
  animation?: 'fade' | 'scale' | 'slide' | 'none';
  borderGradient?: boolean;
}

export function GlassmorphismCard({
  children,
  className = '',
  variant = 'default',
  hoverEffect = false,
  glowEffect = false,
  animation = 'none',
  borderGradient = false,
}: GlassmorphismCardProps) {
  // Base classes for glassmorphism effect
  const baseClasses = {
    default: 'bg-glass',
    strong: 'bg-glass-strong',
    heavy: 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/30 dark:border-white/5',
  };

  // Hover effect classes
  const hoverClasses = hoverEffect
    ? 'transition-all duration-300 hover:shadow-glass-lg hover:-translate-y-1'
    : '';

  // Glow effect classes
  const glowClasses = glowEffect ? 'glow' : '';

  // Border gradient classes
  const borderClasses = borderGradient ? 'gradient-border' : '';

  // Animation variants
  const animationVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5, type: 'spring', stiffness: 100 },
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, type: 'spring', stiffness: 100 },
    },
    none: {},
  };

  // Combine all classes
  const combinedClasses = `rounded-2xl p-6 ${baseClasses[variant]} ${hoverClasses} ${glowClasses} ${borderClasses} ${className}`;

  // If no animation, return a regular div
  if (animation === 'none') {
    return <div className={combinedClasses}>{children}</div>;
  }

  // Otherwise, return an animated motion.div
  return (
    <motion.div
      className={combinedClasses}
      initial={animationVariants[animation].initial}
      animate={animationVariants[animation].animate}
      transition={animationVariants[animation].transition}
    >
      {children}
    </motion.div>
  );
} 