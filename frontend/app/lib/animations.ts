// Global animation utilities and keyframes

// Animation variants for Framer Motion (if using) or CSS classes
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: "easeOut" }
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// CSS Animation Classes
export const animationClasses = {
  // Fade animations
  'fade-in': 'animate-in fade-in duration-300',
  'fade-out': 'animate-out fade-out duration-200',
  
  // Slide animations
  'slide-up': 'animate-in slide-in-from-bottom-4 duration-300',
  'slide-down': 'animate-in slide-in-from-top-4 duration-300',
  'slide-left': 'animate-in slide-in-from-right-4 duration-300',
  'slide-right': 'animate-in slide-in-from-left-4 duration-300',
  
  // Scale animations
  'scale-in': 'animate-in zoom-in-95 duration-200',
  'scale-out': 'animate-out zoom-out-95 duration-150',
  
  // Bounce
  'bounce-in': 'animate-in zoom-in-50 duration-300 ease-out',
  
  // Loading states
  'loading-pulse': 'animate-pulse',
  'loading-spin': 'animate-spin',
  'loading-bounce': 'animate-bounce',
  
  // Hover effects
  'hover-lift': 'hover:scale-105 hover:-translate-y-1 transition-transform duration-200',
  'hover-glow': 'hover:shadow-lg hover:shadow-blue-500/25 transition-shadow duration-300',
  'hover-rotate': 'hover:rotate-3 transition-transform duration-200',
  
  // Focus states
  'focus-ring': 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  
  // Micro-interactions
  'click-scale': 'active:scale-95 transition-transform duration-100',
  'click-bounce': 'active:scale-110 transition-transform duration-100',
} as const;

// Utility functions for animation timing
export const timing = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

// Easing functions
export const easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Loading skeleton animation
export const skeleton = {
  className: 'animate-pulse bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%] animate-[shimmer_2s_infinite]',
  style: {
    backgroundImage: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.5) 50%, transparent 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite',
  }
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { 
    duration: 0.3,
    ease: 'easeOut',
    staggerChildren: 0.1
  }
};

// Button interaction animations
export const buttonInteractions = {
  tap: { scale: 0.95 },
  hover: { scale: 1.02 },
  loading: { 
    scale: [1, 1.05, 1],
    transition: { 
      repeat: Infinity,
      duration: 1.5,
      ease: 'easeInOut'
    }
  }
};

// Card animations
export const cardAnimations = {
  hover: {
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  tap: { scale: 0.98 }
};
