/**
 * Responsive Design Utilities & Mobile-First Breakpoints
 * Ensures consistent responsive behavior across the application
 */

export const BREAKPOINTS = {
  xs: 0, // Extra small devices: phones
  sm: 640, // Small devices: landscape phones, tablets in portrait
  md: 768, // Medium devices: tablets in portrait
  lg: 1024, // Large devices: tablets in landscape, desktops
  xl: 1280, // Extra large: wide desktops
  "2xl": 1536, // 2X extra large: very wide desktops
}

export const MOBILE_FIRST_QUERIES = {
  xs: `@media (min-width: ${BREAKPOINTS.xs}px)`,
  sm: `@media (min-width: ${BREAKPOINTS.sm}px)`,
  md: `@media (min-width: ${BREAKPOINTS.md}px)`,
  lg: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  xl: `@media (min-width: ${BREAKPOINTS.xl}px)`,
  "2xl": `@media (min-width: ${BREAKPOINTS["2xl"]}px)`,
}

export const MOBILE_OPTIMIZATIONS = {
  // Touch-friendly sizing for mobile
  minTouchTarget: "h-10 w-10", // 40x40px minimum per WCAG
  spacingMobileDefault: "p-4", // Default mobile padding
  spacingTabletDefault: "md:p-6", // Tablet padding
  spacingDesktopDefault: "lg:p-8", // Desktop padding

  // Responsive font sizes
  headingMobile: "text-2xl sm:text-3xl lg:text-4xl",
  bodyMobile: "text-sm sm:text-base lg:text-lg",
  captionMobile: "text-xs sm:text-sm",

  // Column layouts
  gridMobileOneCol: "grid-cols-1",
  gridTabletTwoCol: "md:grid-cols-2",
  gridDesktopThreeCol: "lg:grid-cols-3",
  gridFullFourCol: "xl:grid-cols-4",

  // Container sizing
  containerMobile: "w-full",
  containerConstraint: "max-w-screen-2xl mx-auto",
}

export type ResponsiveProps = {
  mobile?: string
  tablet?: string
  desktop?: string
  wide?: string
}

/**
 * Generate responsive Tailwind classes
 */
export function generateResponsiveClasses(props: ResponsiveProps): string {
  const classes = []
  if (props.mobile) classes.push(props.mobile)
  if (props.tablet) classes.push(`md:${props.tablet}`)
  if (props.desktop) classes.push(`lg:${props.desktop}`)
  if (props.wide) classes.push(`xl:${props.wide}`)
  return classes.join(" ")
}

/**
 * Common responsive patterns for faster development
 */
export const RESPONSIVE_PATTERNS = {
  // Full-bleed container that becomes side-by-side on tablet+
  sidebarLayout: "flex flex-col lg:flex-row gap-4 lg:gap-6",

  // Responsive grid that starts with 1 col on mobile
  responsiveGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6",

  // Responsive padding that increases with screen size
  responsivePadding: "p-4 md:p-6 lg:p-8",

  // Responsive typography that scales smoothly
  responsiveHeading: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold",

  // Mobile-first button sizing
  responsiveButton:
    "px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 text-xs sm:text-sm md:text-base",

  // Responsive card layout
  responsiveCard:
    "p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg border bg-card text-card-foreground",

  // Full-width on mobile, constrained on desktop
  responsiveContainer: "w-full px-4 md:px-6 lg:px-0 max-w-7xl mx-auto",
}
