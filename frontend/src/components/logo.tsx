/**
 * Reusable Logo and Icon components for HealthConnect India.
 * Automatically switches between light/dark variants based on theme.
 *
 * Usage:
 *   <Logo />               — Full logo (image with text banner)
 *   <Logo size="sm" />     — Smaller version for compact layouts
 *   <AppIcon />            — Just the flower icon (for avatars, loading, etc.)
 *   <AppIcon size={48} />  — Custom-sized icon
 */

interface LogoProps {
  /** Controls the height of the full logo banner */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
  /** When true, forces the dark-mode logo (useful on dark footer backgrounds) */
  forceDark?: boolean;
}

const sizeMap = {
  sm: "h-10",
  md: "h-16",
  lg: "h-20",
} as const;

export function Logo({ size = "md", className = "", forceDark = false }: LogoProps) {
  return (
    <a href="#top" className={`inline-flex items-center ${className}`} aria-label="HealthConnect India home">
      {/* Light-mode logo: shown by default, hidden when dark class is present */}
      <img
        src="/images/logo-light.png"
        alt="HealthConnect India"
        className={`${sizeMap[size]} w-auto ${forceDark ? "hidden" : "block dark:hidden"}`}
      />
      {/* Dark-mode logo: hidden by default, shown when dark class is present */}
      <img
        src="/images/logo-dark.png"
        alt="HealthConnect India"
        className={`${sizeMap[size]} w-auto ${forceDark ? "block" : "hidden dark:block"}`}
      />
    </a>
  );
}

interface AppIconProps {
  /** Size in pixels (applied to both width and height) */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /** When true, forces the dark-mode icon */
  forceDark?: boolean;
}

export function AppIcon({ size = 40, className = "", forceDark = false }: AppIconProps) {
  return (
    <span className={`inline-flex shrink-0 ${className}`}>
      <img
        src="/images/icon-light.png"
        alt="HealthConnect India icon"
        width={size}
        height={size}
        className={`rounded-full object-contain ${forceDark ? "hidden" : "block dark:hidden"}`}
      />
      <img
        src="/images/icon-dark.png"
        alt="HealthConnect India icon"
        width={size}
        height={size}
        className={`rounded-full object-contain ${forceDark ? "block" : "hidden dark:block"}`}
      />
    </span>
  );
}
