/**
 * Pixel-style icons used across the site chrome. Inlined SVGs so
 * they stay crisp at any DPI and inherit `currentColor` from their
 * Win95 button parent (black ink inside a gray face surface).
 *
 * shapeRendering="crispEdges" disables anti-aliasing so the bars
 * look like 1-bit pixel art at every zoom level.
 */

interface IconProps {
  className?: string;
  size?: number;
}

export function HomeIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
    >
      {/* Roof */}
      <path d="M8 1 L1 7 L2 7 L8 2 L14 7 L15 7 Z" fill="currentColor" />
      {/* Walls + door */}
      <path
        d="M3 7 L3 14 L7 14 L7 10 L9 10 L9 14 L13 14 L13 7 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Three stacked bars — Win95 hamburger. */
export function MenuIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
    >
      <path d="M1 3 H15 V5 H1 Z" fill="currentColor" />
      <path d="M1 7 H15 V9 H1 Z" fill="currentColor" />
      <path d="M1 11 H15 V13 H1 Z" fill="currentColor" />
    </svg>
  );
}

/** Close × — paired with the open Menu icon on the drawer title bar. */
export function CloseIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
    >
      <path
        d="M3 3 L13 13 M13 3 L3 13"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
      />
    </svg>
  );
}
