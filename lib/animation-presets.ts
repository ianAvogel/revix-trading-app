/**
 * Framer Motion Animation Presets & Utilities
 * Reusable animation patterns for consistent micro-interactions
 */

import { Variants } from "framer-motion"

/**
 * Fade in animation
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

/**
 * Slide in from top
 */
export const slideInTopVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

/**
 * Slide in from bottom
 */
export const slideInBottomVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

/**
 * Slide in from left
 */
export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

/**
 * Slide in from right
 */
export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

/**
 * Scale up animation
 */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
}

/**
 * Bounce animation on hover
 */
export const bounceVariants: Variants = {
  initial: { y: 0 },
  hover: { y: -5, transition: { type: "spring", stiffness: 400, damping: 10 } },
}

/**
 * Rotate animation
 */
export const rotateVariants: Variants = {
  initial: { rotate: 0 },
  animate: { rotate: 360, transition: { duration: 2, repeat: Infinity, ease: "linear" } },
}

/**
 * Pulse animation (for active states)
 */
export const pulseVariants: Variants = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: { duration: 2, repeat: Infinity },
  },
}

/**
 * Container animation with stagger effect for children
 */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

/**
 * Child item animation (use with containerVariants)
 */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

/**
 * Page transition animation
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
}

/**
 * Tap animation for interactive elements
 */
export const tapVariants: Variants = {
  initial: { scale: 1 },
  tap: { scale: 0.95 },
  hover: { scale: 1.02 },
}

/**
 * Smooth transition presets
 */
export const transitions = {
  fast: { duration: 0.15 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
  spring: { type: "spring", stiffness: 300, damping: 30 },
  smooth: { type: "tween", ease: "easeInOut" },
}

/**
 * Delay multiplier for staggered animations
 */
export function getStaggerDelay(index: number, baseDelay: number = 0.05): number {
  return index * baseDelay
}

/**
 * Combined animation preset for list items
 */
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
    },
  }),
}

/**
 * Modal/Dialog entrance animation
 */
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
}

/**
 * Drawer slide-in animation
 */
export const drawerVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { x: "100%", transition: { duration: 0.2 } },
}

/**
 * Tooltip fade animation
 */
export const tooltipVariants: Variants = {
  hidden: { opacity: 0, y: -5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, y: -5, transition: { duration: 0.1 } },
}
