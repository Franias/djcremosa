/**
 * VerticalRails — global side-rail text echoes the editorial frame of
 * the Midia Kit 2026 PDF. Rendered once in the root layout so every
 * page carries the same "press kit" chrome.
 *
 * Left rail:  SELETORA · CURADORIA · DISCOTECAGEM
 * Right rail: PRESS KIT · 2026
 *
 * Sized for desktop only — hidden below `sm` so the rails don't crowd
 * mobile content. Uses the pixel (VT323) font for an MS-Sans-Serif feel.
 */

const LEFT_RAIL = "SELETORA · CURADORIA · DISCOTECAGEM";
const RIGHT_TOP = "PRESS KIT";
const RIGHT_BOT = "2026";

export function VerticalRails() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-0 right-0 z-20 hidden lg:block"
    >
      <div className="mx-auto max-w-[1600px] relative h-full">
        {/* Left rail — vertical text, centered vertically */}
        <span
          className="absolute left-4 xl:left-6 top-1/2 -translate-y-1/2 win-eyebrow text-bubble/80 whitespace-nowrap"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg) translateY(50%)" }}
        >
          {LEFT_RAIL}
        </span>

        {/* Right rail — two anchored blocks (PRESS KIT / 2026) like the kit */}
        <span
          className="absolute right-4 xl:right-6 top-[15%] win-eyebrow text-bubble/80 whitespace-nowrap"
          style={{ writingMode: "vertical-rl" }}
        >
          {RIGHT_TOP}
        </span>
        <span
          className="absolute right-4 xl:right-6 bottom-[15%] win-eyebrow text-bubble/80 whitespace-nowrap"
          style={{ writingMode: "vertical-rl" }}
        >
          {RIGHT_BOT}
        </span>
      </div>
    </div>
  );
}