/**
 * Sparkle — small four-point Y2K starburst decoration. Use sparingly
 * around big titles to echo the cover of the Midia Kit 2026.
 *
 *   <Sparkle />                    → default 1em
 *   <Sparkle size="lg" />          → 1.6em
 *   <Sparkle className="ml-2" />   → className passthrough
 */

interface SparkleProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "text-[10px]",
  md: "text-base",
  lg: "text-2xl",
};

export function Sparkle({ size = "md", className }: SparkleProps) {
  return <span className={["sparkle", SIZES[size], className].filter(Boolean).join(" ")} />;
}