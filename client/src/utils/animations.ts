// Animation variants and utilities for PitchSite
export const globalEasing = [0.6, -0.05, 0.01, 0.99];

export const timings = {
  fast: 0.3,
  medium: 0.6,
  slow: 0.9,
  pageLoad: 1.2,
};

export const delays = {
  section: 0.2,
  stagger: 0.1,
  hero: 0.4,
};

// Standard fade in up animation for sections
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: timings.medium, ease: globalEasing },
};

// Slide in from left
export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: timings.medium, ease: globalEasing },
};

// Slide in from right
export const slideInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: timings.medium, ease: globalEasing },
};

// Hero section animations
export const heroAnimations = {
  badge: {
    initial: { scale: 0, rotate: -90 },
    animate: { scale: 1, rotate: 0 },
    transition: {
      delay: delays.section,
      type: "spring",
      stiffness: 200,
      damping: 25,
    },
  },
  title: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: delays.hero, duration: 0.8 },
  },
  metrics: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      delay: 0.6,
      duration: timings.medium,
      staggerChildren: delays.stagger,
    },
  },
};

// Stagger container for grids
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: delays.section,
    },
  },
};

// Stagger items for grids
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

// Paper hover effects
export const paperHover = {
  whileHover: {
    scale: 1.01,
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  },
  transition: { type: "spring", stiffness: 300 },
};

// Button interactions
export const buttonHover = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 400, damping: 17 },
};

// List animations for risk factors
export const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: delays.stagger,
    },
  },
};

export const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

// Call-to-action pulse
export const pulseCTA = {
  scale: [1, 1.02, 1],
  transition: {
    duration: 2.5,
    repeat: Infinity,
    repeatType: "reverse" as const,
  },
};

// Responsive animation check
export const getResponsiveVariants = (isMobile: boolean) => ({
  initial: {
    opacity: 0,
    y: isMobile ? 20 : 30,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  transition: {
    duration: isMobile ? 0.4 : 0.6,
  },
});
